<script setup lang="ts">
import { useEventListener, useMediaQuery, useMutationObserver } from '@vueuse/core'

const FOCUSABLE = 'a[href], button, input:not([type="hidden"]), textarea, select, summary, [tabindex]:not([tabindex^="-"]), [contenteditable="true"]'
/** La acción primaria o la opción activa se enmarcan con el acento; el resto con la tinta del tema. */
const PRIMARY = '.is-active, [aria-current], [aria-pressed="true"], .header-toggle, [class~="before:bg-red"]'
/** Zonas con su propio cursor de menú (anillo del menú rápido): conservan la flecha y no reciben marco. */
const PLAIN = '[data-cursor="plain"]'

interface Frame { x: number, y: number, width: number, height: number, round: boolean, primary: boolean, color: string }

const route = useRoute()
const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
const visible = ref(false)
const position = shallowRef({ x: 0, y: 0 })
const kind = ref<'default' | 'action' | 'text'>('default')
const pressed = ref(false)
const host = shallowRef<HTMLElement | null>(null)
const frame = shallowRef<Frame | null>(null)
let hovered: Element | null = null
let focused: Element | null = null
let pendingPointer: PointerEvent | null = null
let pendingFrame: number | undefined
let framed: Element | null = null

/** Marca solo el control enmarcado: una clase en <html> con `:focus-visible` descendiente invalidaba el estilo de todo el documento en cada cambio de foco. */
function markFramed(element: Element | null) {
  if (framed === element) return
  framed?.removeAttribute('data-p5-framed')
  framed = element
  framed?.setAttribute('data-p5-framed', '')
}

function hide() {
  pendingPointer = null
  visible.value = false
}

/** El cursor entra en el diálogo nativo para mantenerse sobre su capa modal. */
function syncHost() {
  host.value = document.querySelector<HTMLDialogElement>('dialog[open]') ?? document.body
}

/** Solo controles: las regiones enfocables para desplazarse (biografía, paneles, listas) no se enmarcan. */
function focusable(target: EventTarget | null) {
  const element = target instanceof Element ? target.closest(FOCUSABLE) : null
  if (!element || element.matches('main, section, ul, ol, [role="region"], :disabled, [aria-disabled="true"]') || element.closest(`[inert], ${PLAIN}`)) return null
  return element
}

/** Al cambiar de vista el elemento enmarcado desaparece bajo el wipe; el marco no debe sobrevivirle. */
function release() {
  if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame)
  pendingFrame = undefined
  pendingPointer = null
  hovered = null
  focused = null
  frame.value = null
  markFramed(null)
}

/** El marco encaja en el elemento bajo el puntero o, si no hay, en el que tiene el foco de teclado. */
function measure() {
  const element = hovered ?? focused
  if (!element?.isConnected) {
    frame.value = null
    markFramed(null)
    return
  }
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  const primary = element.matches(PRIMARY)
  const pad = 6
  const nextFrame: Frame = {
    x: rect.left - pad, y: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2,
    round: style.borderRadius.includes('50%') || (rect.width === rect.height && Number.parseFloat(style.borderRadius) >= rect.width / 2),
    primary,
    color: style.getPropertyValue(primary ? '--accent' : '--fg').trim() || style.color,
  }
  if (Object.entries(nextFrame).some(([key, value]) => frame.value?.[key as keyof Frame] !== value)) frame.value = nextFrame
  markFramed(element === document.activeElement ? element : null)
}

/** Agrupa eventos de un mismo frame; lee el objetivo antes de publicar el estado visual. */
function update() {
  pendingFrame = undefined
  const event = pendingPointer
  pendingPointer = null
  let nextKind = kind.value
  if (event) {
    const target = event.target instanceof Element ? event.target : null
    hovered = focusable(target)
    nextKind = target?.closest('textarea:not(:disabled), input:not(:disabled), [contenteditable="true"]')
      ? 'text'
      : target?.closest('a[href], button:not(:disabled), summary, [role="button"]') ? 'action' : 'default'
  }
  // :focus-visible se resuelve después de focusin, antes de este frame.
  focused = focused?.matches(':focus-visible') ? focused : null
  measure()
  if (event) {
    if (position.value.x !== event.clientX || position.value.y !== event.clientY) position.value = { x: event.clientX, y: event.clientY }
    kind.value = nextKind
    visible.value = true
  }
}

function scheduleUpdate() {
  pendingFrame ??= requestAnimationFrame(update)
}

function move(event: PointerEvent) {
  if (!finePointer.value || event.pointerType !== 'mouse') return hide()
  pendingPointer = event
  scheduleUpdate()
}

function onFocusIn(event: FocusEvent) {
  focused = focusable(event.target)
  scheduleUpdate()
}

function onFocusOut() {
  focused = null
  scheduleUpdate()
}

function press(down: boolean) {
  if (down && pendingPointer) hovered = focusable(pendingPointer.target)
  pressed.value = down && !!(hovered ?? focused)
}

onMounted(() => {
  syncHost()
  useEventListener(document, 'pointermove', move, { passive: true })
  useEventListener(document, 'pointerdown', () => press(true), { passive: true })
  useEventListener(document, 'pointerup', () => press(false), { passive: true })
  useEventListener(document, 'pointercancel', () => press(false), { passive: true })
  useEventListener(document, 'pointerleave', hide)
  useEventListener(document, 'keydown', hide)
  useEventListener(document, 'focusin', onFocusIn)
  useEventListener(document, 'focusout', onFocusOut)
  useEventListener(document, 'scroll', scheduleUpdate, { passive: true, capture: true })
  useEventListener(window, 'resize', scheduleUpdate, { passive: true })
  useEventListener(window, 'blur', hide)
  useMutationObserver(document.body, syncHost, { attributes: true, attributeFilter: ['open'], subtree: true })
  watch(() => route.fullPath, release)
  watch([visible, finePointer], ([shown, fine]) => {
    document.documentElement.classList.toggle('has-p5-cursor', shown && fine)
  }, { immediate: true })
})

onBeforeUnmount(() => {
  release()
  document.documentElement.classList.remove('has-p5-cursor')
})
</script>

<template>
  <Teleport :to="host ?? 'body'" :disabled="!host">
    <div v-show="visible && finePointer" class="p5-cursor" :class="[`p5-cursor--${kind}`, { 'is-pressed': pressed }]" :style="{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }" aria-hidden="true">
      <span></span>
    </div>
    <div
      v-show="finePointer && frame" class="p5-target"
      :class="{ 'is-on': !!frame, 'is-round': frame?.round, 'is-primary': frame?.primary, 'is-pressed': pressed }"
      :style="frame ? { translate: `${frame.x}px ${frame.y}px`, width: `${frame.width}px`, height: `${frame.height}px`, color: frame.color } : undefined"
      aria-hidden="true"
    >
      <svg v-if="frame?.round" focusable="false"><rect rx="50%" /></svg>
      <template v-else><span v-for="side in ['top', 'right', 'bottom', 'left']" :key="side" :class="`p5-ants p5-ants--${side}`"></span></template>
    </div>
  </Teleport>
</template>

<style src="~/assets/css/components/app-cursor.css"></style>
