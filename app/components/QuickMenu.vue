<script setup lang="ts">
import { isEditingTarget } from '~/utils/keyboard'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const root = useTemplateRef<HTMLDialogElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const motion = useMenuMotion(root)
const isOpen = ref(false)
const closing = ref(false)
let returnFocus: HTMLElement | null = null

const items = computed(() => [
  { key: 'home', to: { path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' } },
  { key: 'projects', to: { path: localePath('projects') } },
  { key: 'about', to: { path: localePath('index'), hash: locale.value === 'es' ? '#sobre' : '#about' } },
  { key: 'contact', to: { path: localePath('index'), hash: locale.value === 'es' ? '#contacto' : '#contact' } },
])

/** El acceso rápido usa otro diálogo nativo; Q nunca interrumpe formularios ni un menú modal distinto. */
function open() {
  if (!root.value || root.value.open || document.querySelector('dialog[open]')) return
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger.value
  root.value.showModal()
  isOpen.value = true
  motion.open()
}

async function close() {
  if (!root.value?.open || closing.value) return
  closing.value = true
  try { await motion.close() }
  finally { root.value?.close() }
}

function finishClose() {
  isOpen.value = false
  closing.value = false
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
}

function onNavigate(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  root.value?.close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isEditingTarget(event.target) || event.key.toLowerCase() !== 'q') return
  if (document.querySelector('dialog[open]') && !root.value?.open) return
  event.preventDefault()
  if (root.value?.open) void close()
  else open()
}

watch(() => route.fullPath, () => { if (root.value?.open) root.value.close() })
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  root.value?.close()
})
</script>

<template>
  <div class="quick-launcher">
    <span class="quick-hint keyboard-hints label-p5">Q · {{ t('nav.quick') }}</span>
    <button ref="trigger" class="quick-toggle" type="button" :aria-label="t('nav.openQuick')" aria-haspopup="dialog" aria-controls="quick-menu" :aria-expanded="isOpen" @click="open"><span aria-hidden="true">✦</span></button>
  </div>
  <dialog id="quick-menu" ref="root" class="quick-menu" :aria-label="t('nav.quick')" @cancel.prevent="close" @close="finishClose" @click.self="close">
    <nav :aria-label="t('nav.quick')">
      <div class="quick-ring" aria-hidden="true"></div>
      <ul>
        <li v-for="(item, index) in items" :key="item.key" data-menu-item>
          <NuxtLink :to="item.to" class="quick-link" @focus="motion.select(index)" @pointerenter="motion.select(index)" @click="onNavigate"><span class="quick-key" aria-hidden="true">{{ String.fromCharCode(65 + index) }}</span><span class="display-p5">{{ t(`common.${item.key}`) }}</span></NuxtLink>
        </li>
      </ul>
      <button class="quick-toggle quick-close" type="button" :aria-label="t('nav.closeQuick')" @click="close"><span aria-hidden="true">✦</span></button>
    </nav>
  </dialog>
</template>

<style scoped>
.quick-launcher { position: fixed; right: var(--space-13); bottom: var(--space-13); z-index: var(--z-nav); }
.quick-hint { position: absolute; right: 0; bottom: calc(100% + 12px); white-space: nowrap; font-size: var(--size-label-xs); color: var(--p5-paper); text-shadow: 2px 2px 0 var(--p5-ink); }
.quick-toggle { display: grid; place-items: center; width: 72px; height: 72px; padding: 0; border: var(--border-4) solid var(--p5-paper); border-radius: var(--radius-full); background: var(--p5-red); color: var(--p5-paper); cursor: pointer; font: 30px/1 var(--type-display); transition: transform var(--dur-hover) var(--easing-pop); }
.quick-toggle:hover { transform: scale(1.1) rotate(-8deg); }
.quick-menu { position: fixed; inset: auto 0 0 auto; width: min(420px, 100vw); height: min(400px, 100dvh); max-width: none; max-height: none; margin: 0; padding: 0; overflow: hidden; border: 0; background: transparent; color: var(--p5-paper); }
.quick-menu::backdrop { background: transparent; }
.quick-menu nav { position: absolute; right: var(--space-13); bottom: var(--space-13); width: 72px; height: 72px; }
.quick-menu ul { margin: 0; padding: 0; list-style: none; }
.quick-menu li { position: absolute; right: 0; bottom: 0; }
.quick-menu li:nth-child(1) { right: 110px; bottom: 0; }
.quick-menu li:nth-child(2) { right: 120px; bottom: 62px; }
.quick-menu li:nth-child(3) { right: 85px; bottom: 124px; }
.quick-menu li:nth-child(4) { right: 0; bottom: 186px; }
.quick-link { display: inline-flex; align-items: center; gap: var(--space-4); min-height: 44px; padding: var(--space-2) var(--space-6) var(--space-3) var(--space-3); background: var(--p5-ink); color: var(--p5-paper); border: var(--border-3) solid var(--p5-paper); white-space: nowrap; transform: rotate(var(--rot-6)); }
.quick-link:hover, .quick-link:focus-visible { color: var(--p5-paper); background: var(--p5-red); }
.quick-link .display-p5 { font-size: 20px; }
.quick-key { display: grid; place-items: center; width: 28px; height: 28px; border-radius: var(--radius-full); background: var(--p5-red); color: var(--p5-paper); font-family: var(--type-display); font-size: var(--size-btn-sm); }
.quick-ring { position: absolute; inset: -34px; border: var(--border-4) dashed var(--p5-paper); border-radius: var(--radius-full); pointer-events: none; }
.quick-close { transform: rotate(135deg); }
@media (width < 760px) { .quick-launcher { right: var(--space-9); bottom: var(--space-9); } .quick-menu nav { right: var(--space-9); bottom: var(--space-9); } .quick-menu li:nth-child(2) { right: 100px; } }
@media (height < 400px) { .quick-menu { height: 100dvh; } .quick-menu li:nth-child(4) { bottom: 170px; } }
</style>
