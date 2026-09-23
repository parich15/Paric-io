<script setup lang="ts">
import { clients } from '~/data/clients'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const root = useTemplateRef<HTMLDialogElement>('root')
const motion = useMenuMotion(root)
const emit = defineEmits<{ change: [open: boolean] }>()
const activeIndex = ref(0)
const closing = ref(false)
let returnFocus: HTMLElement | null = null
let previousOverflow = ''

const items = computed(() => [
  { key: 'home', to: { path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' } },
  { key: 'projects', to: { path: localePath('projects') } },
  { key: 'clients', to: { path: localePath('clients') } },
  { key: 'about', to: { path: localePath('about') } },
  { key: 'contact', to: { path: localePath('contact') } },
])
const activeItem = computed(() => items.value[activeIndex.value]!)

/** Abre el diálogo nativo para mantener Tab dentro del menú y recordar su botón de origen. */
function open() {
  const dialog = root.value
  if (!dialog || dialog.open) return
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  closing.value = false
  const routeKey = ['#contacto', '#contact'].includes(route.hash) ? 'contact' : ['#sobre', '#about'].includes(route.hash) ? 'about' : String(route.name).split('___')[0]!.split('-')[0]
  activeIndex.value = Math.max(0, items.value.findIndex(item => item.key === routeKey))
  dialog.showModal()
  emit('change', true)
  motion.open()
  nextTick(() => dialog.querySelector<HTMLAnchorElement>(`[data-menu-link="${activeIndex.value}"]`)?.focus({ preventScroll: true }))
}

/** Una salida breve permite percibir el cierre sin encadenar esperas por opción. */
async function close() {
  if (!root.value?.open || closing.value) return
  closing.value = true
  try { await motion.close() }
  finally { root.value?.close() }
}

function finishClose() {
  motion.reset()
  document.body.style.overflow = previousOverflow
  closing.value = false
  emit('change', false)
  nextTick(() => { if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }) })
}

function select(index: number) {
  if (activeIndex.value === index) return
  activeIndex.value = index
  motion.select(index)
}

/** Las flechas cambian de destino; Tab conserva íntegro el recorrido nativo del diálogo. */
function onKeydown(event: KeyboardEvent) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  if (!(event.target instanceof Element) || !event.target.closest('[data-menu-link]')) return
  event.preventDefault()
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? items.value.length - 1 : (activeIndex.value + (event.key === 'ArrowDown' ? 1 : -1) + items.value.length) % items.value.length
  select(nextIndex)
  root.value?.querySelector<HTMLAnchorElement>(`[data-menu-link="${nextIndex}"]`)?.focus()
}

/** La navegación conserva NuxtLink y su transición global, sin dejar un diálogo en la capa superior. */
function onNavigate(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  root.value?.close()
}

watch(() => route.fullPath, () => { if (root.value?.open) root.value.close() })
onBeforeUnmount(() => {
  if (root.value?.open) {
    root.value.close()
    document.body.style.overflow = previousOverflow
  }
})
defineExpose({ open, close })
</script>

<template>
  <dialog id="global-menu" ref="root" class="global-menu" aria-labelledby="global-menu-title" @cancel.prevent="close" @close="finishClose" @keydown="onKeydown">
    <div class="menu-curtain menu-curtain--left" data-menu-side="left" aria-hidden="true">
      <div class="menu-stripes"></div>
      <div class="menu-diagonal"></div>
    </div>
    <div class="menu-curtain menu-curtain--right" data-menu-side="right" aria-hidden="true">
      <div class="menu-zigzag zigzag animate-zig"></div>
      <div class="menu-diagonal"></div>
    </div>
    <div class="menu-topbar">
      <div><AppBrand :to="items[0]!.to" class="menu-brand display-p5" @click="onNavigate" /></div>
      <div id="menu-header-actions"></div>
    </div>
    <div class="menu-layout">
      <div class="menu-context" data-menu-side="right">
        <div class="menu-context-plate"><h2 id="global-menu-title" class="display-p5">{{ t('common.menu') }}</h2><p class="label-p5">{{ t('nav.choose') }}</p></div>
        <span class="menu-number display-p5" aria-hidden="true">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
      </div>
      <nav class="menu-navigation" data-cursor="plain" data-menu-side="left" :aria-label="t('nav.choose')">
        <ul>
          <li v-for="(item, index) in items" :key="item.key" data-menu-item :style="{ 'marginLeft': `${Math.abs(index - activeIndex) * 1.2}vw`, '--i': index }">
            <NuxtLink :to="item.to" :data-menu-link="index" class="menu-option display-p5" :class="{ 'is-active': activeIndex === index }" @focus="select(index)" @pointerenter="select(index)" @click="onNavigate"><span>{{ t(`common.${item.key}`) }}</span></NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="menu-poster-motion" data-menu-side="right" aria-hidden="true">
      <div class="menu-poster" :class="`poster-${activeItem.key}`">
        <HomePortrait v-if="activeItem.key === 'about'" decorative />
        <svg v-else-if="activeItem.key === 'home'" viewBox="0 0 400 500" focusable="false">
          <rect width="400" height="500" fill="var(--p5-paper)" />
          <polygon points="0,500 400,120 400,500" fill="var(--p5-ink)" />
          <polygon points="200,60 245,175 365,180 270,255 300,375 200,305 100,375 130,255 35,180 155,175" fill="var(--p5-red)" stroke="var(--p5-ink)" stroke-width="14" stroke-linejoin="round" transform="rotate(-8 200 220)" />
          <text x="200" y="455" text-anchor="middle" font-family="var(--type-display)" font-size="92" fill="var(--p5-paper)" transform="rotate(-4 200 440)">P.IO</text>
        </svg>
        <svg v-else-if="activeItem.key === 'projects'" viewBox="0 0 400 500" focusable="false">
          <rect width="400" height="500" fill="var(--p5-ink)" />
          <g transform="skewX(-8)">
            <rect x="70" y="60" width="150" height="120" fill="var(--p5-paper)" />
            <rect x="240" y="60" width="150" height="120" fill="var(--p5-red)" />
            <rect x="70" y="200" width="150" height="120" fill="var(--p5-red)" />
            <rect x="240" y="200" width="150" height="120" fill="var(--p5-paper)" />
            <rect x="70" y="340" width="320" height="100" fill="var(--p5-paper)" />
            <rect x="95" y="375" width="180" height="14" fill="var(--p5-ink)" />
            <rect x="95" y="400" width="120" height="14" fill="var(--p5-red)" />
          </g>
        </svg>
        <div v-else-if="activeItem.key === 'clients'" class="menu-client-poster">
          <span v-for="client in clients.slice(0, 4)" :key="client.slug" class="display-p5">{{ client.initials }}</span>
        </div>
        <svg v-else viewBox="0 0 400 500" focusable="false">
          <rect width="400" height="500" fill="var(--p5-paper)" />
          <polygon points="0,0 400,0 400,220 0,300" fill="var(--p5-ink)" />
          <g transform="rotate(-8 200 260)">
            <rect x="60" y="170" width="280" height="190" fill="var(--p5-red)" stroke="var(--p5-ink)" stroke-width="14" />
            <polyline points="60,170 200,290 340,170" fill="none" stroke="var(--p5-ink)" stroke-width="14" />
            <polyline points="60,360 170,265 230,265 340,360" fill="none" stroke="var(--p5-ink)" stroke-width="14" />
          </g>
        </svg>
      </div>
      </div>
      <div class="menu-command" data-menu-side="left">
        <div :aria-label="t(`nav.${activeItem.key}Word`)"><P5Heading :text="t(`nav.${activeItem.key}Word`).toUpperCase()" :shadow="false" size="title" class="menu-word" aria-hidden="true" /></div>
        <p class="menu-hint label-p5">{{ t(`nav.${activeItem.key}Hint`) }}</p>
      </div>
      <a class="menu-email display-p5" data-menu-side="left" href="mailto:oscar@paric.io">oscar@paric.io</a>
      <div class="menu-keys keyboard-hints label-p5" data-menu-side="right"><span><kbd>Esc</kbd> {{ t('common.close') }}</span><span><kbd>↑↓</kbd> {{ t('common.navigate') }}</span><span><kbd>↵</kbd> {{ t('nav.keyboard') }}</span></div>
    </div>
  </dialog>
</template>

<style scoped src="~/assets/css/components/global-menu.css"></style>
