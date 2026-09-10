<script setup lang="ts">
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
  { key: 'about', to: { path: localePath('index'), hash: locale.value === 'es' ? '#sobre' : '#about' } },
  { key: 'contact', to: { path: localePath('index'), hash: locale.value === 'es' ? '#contacto' : '#contact' } },
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
  activeIndex.value = String(route.name).startsWith('projects') ? 1 : ['#sobre', '#about'].includes(route.hash) ? 2 : ['#contacto', '#contact'].includes(route.hash) ? 3 : 0
  dialog.showModal()
  emit('change', true)
  motion.open()
  nextTick(() => dialog.querySelector<HTMLAnchorElement>(`[data-menu-link="${activeIndex.value}"]`)?.focus())
}

/** Escape y el botón de cierre esperan la salida visual antes de restaurar el foco nativo. */
async function close() {
  if (!root.value?.open || closing.value) return
  closing.value = true
  try {
    await motion.close()
  }
  finally {
    root.value?.close()
  }
}

function finishClose() {
  document.body.style.overflow = previousOverflow
  closing.value = false
  emit('change', false)
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
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
    <div class="menu-stripes" aria-hidden="true"></div>
    <div class="menu-zigzag" aria-hidden="true"></div>
    <div class="menu-diagonal" aria-hidden="true"></div>
    <div class="menu-topbar">
      <NuxtLink :to="items[0]!.to" class="menu-brand display-p5" @click="onNavigate">Paric.io</NuxtLink>
      <div><LocaleSwitch /><button type="button" class="menu-close label-p5" :aria-label="t('common.closeMenu')" @click="close">{{ t('common.close') }} <span class="menu-bars" aria-hidden="true"></span></button></div>
    </div>
    <div class="menu-layout">
      <div class="menu-context">
        <div class="menu-context-plate"><h2 id="global-menu-title" class="display-p5">{{ t('common.menu') }}</h2><p class="label-p5">{{ t('nav.choose') }}</p></div>
        <span class="menu-number display-p5" aria-hidden="true">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
      </div>
      <nav class="menu-navigation" :aria-label="t('nav.choose')">
        <ul>
          <li v-for="(item, index) in items" :key="item.key" data-menu-item :style="{ marginLeft: `${Math.abs(index - activeIndex) * 1.2}vw` }">
            <NuxtLink :to="item.to" :data-menu-link="index" class="menu-option display-p5" :class="{ 'is-active': activeIndex === index }" @focus="select(index)" @pointerenter="select(index)" @click="onNavigate"><span>{{ t(`common.${item.key}`) }}</span></NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="menu-poster" :class="`poster-${activeItem.key}`" aria-hidden="true">
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
      <div class="menu-command">
        <div :aria-label="t(`nav.${activeItem.key}Word`)"><P5Heading :text="t(`nav.${activeItem.key}Word`).toUpperCase()" :shadow="false" size="title" class="menu-word" aria-hidden="true" /></div>
        <p class="menu-hint label-p5">{{ t(`nav.${activeItem.key}Hint`) }}</p>
      </div>
      <a class="menu-email display-p5" href="mailto:oscar@paric.io">oscar@paric.io</a>
      <div class="menu-keys keyboard-hints label-p5"><span><kbd>Esc</kbd> {{ t('common.close') }}</span><span><kbd>↑↓</kbd> {{ t('common.navigate') }}</span><span><kbd>↵</kbd> {{ t('nav.keyboard') }}</span></div>
    </div>
  </dialog>
</template>

<style scoped>
.global-menu { position: fixed; inset: 0; width: 100%; max-width: none; height: 100dvh; max-height: none; margin: 0; padding: 0; border: 0; overflow-x: hidden; overflow-y: auto; background: var(--p5-red); color: var(--p5-paper); isolation: isolate; }
.global-menu::backdrop { background: var(--p5-ink); }
.menu-stripes, .menu-zigzag, .menu-diagonal { position: absolute; z-index: -1; pointer-events: none; top: -10%; height: 130%; }
.menu-stripes { left: -10%; width: 120%; background: var(--stripes-red); }
.menu-stripes::after { content: ''; position: absolute; inset: 0; background: var(--halftone-ink); background-size: var(--halftone-size); opacity: .16; }
.menu-zigzag { right: -10%; width: 62%; background-color: var(--p5-paper); background-image: var(--zigzag); background-size: var(--zigzag-size); background-position: var(--zigzag-position); transform: skewX(-14deg); }
.menu-diagonal { left: 38%; width: 26%; background: var(--p5-ink); transform: skewX(var(--skew-lg)); box-shadow: -14px 0 0 var(--p5-paper); }
.menu-topbar { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: var(--space-7); padding: var(--header-pad); }
.menu-topbar > div { display: flex; align-items: center; gap: var(--space-7); }
.menu-brand { display: inline-block; padding: var(--space-1) var(--space-6) var(--space-2); background: var(--p5-paper); color: var(--p5-ink); transform: skewX(var(--skew-md)) rotate(var(--rot-2)); font-size: var(--size-btn-lg); line-height: 1.4; }
.menu-close { display: flex; align-items: center; gap: var(--space-5); min-height: 44px; padding: var(--space-4) var(--space-8); background: var(--p5-paper); color: var(--p5-ink); border: 0; transform: skewX(var(--skew)); font-size: var(--size-btn); cursor: pointer; }
.menu-bars { width: 22px; height: 3px; background: currentColor; box-shadow: 0 -7px 0 currentColor, 0 7px 0 currentColor; }
.menu-layout { position: absolute; inset: 0; min-height: 600px; pointer-events: none; }
.menu-layout a, .menu-layout nav { pointer-events: auto; }
.menu-context { position: absolute; right: 3vw; top: calc(80px + 4vh); z-index: 5; display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-6); }
.menu-context-plate { padding: var(--space-4) var(--space-10) var(--space-5); background: var(--p5-paper); color: var(--p5-ink); transform: skewX(var(--skew)) rotate(var(--rot-2)); box-shadow: var(--hard-lg); text-align: right; }
.menu-context h2 { margin: 0; font-size: clamp(26px, 3vw, 44px); }
.menu-context p { margin: var(--space-1) 0 0; font-size: var(--size-label); letter-spacing: var(--track-label-xwide); }
.menu-number { padding: 0 var(--space-7) var(--space-2); color: var(--p5-paper); background: var(--p5-red); transform: rotate(var(--rot-4)); font-size: clamp(40px, 6vw, 96px); }
.menu-navigation { position: absolute; left: 4vw; top: 12vh; z-index: 5; }
.menu-navigation ul { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; }
.menu-option { display: inline-flex; align-items: center; min-height: 44px; padding: 2px var(--space-7) var(--space-2); color: var(--p5-paper); background: var(--p5-ink); font-size: clamp(28px, 3.4vw, 52px); line-height: .95; letter-spacing: .02em; transform: skewX(var(--skew-md)) rotate(var(--rot-2)); transition: font-size var(--dur-hover) var(--easing-pop), background var(--dur-fast), color var(--dur-fast); }
.menu-option > span { transform: skewX(12deg); }
.menu-navigation li:nth-child(even) .menu-option { transform: skewX(var(--skew-md)) rotate(var(--rot-pos-2)); }
.menu-navigation .menu-option.is-active { color: var(--p5-red); background: var(--p5-paper); box-shadow: var(--hard-ink-lg); font-size: clamp(44px, 5.6vw, 84px); transform: skewX(var(--skew-md)) rotate(var(--rot-4)); }
.menu-option:focus-visible { outline: var(--border-3) solid var(--p5-paper); outline-offset: 6px; }
.menu-poster { position: absolute; z-index: 3; left: 50%; top: 50%; width: min(58vh, 46vw); aspect-ratio: 4/5; transform: translate(-30%, -56%) rotate(6deg) scale(.9); }
.menu-poster svg { display: block; width: 100%; height: 100%; }
.poster-projects { transform: translate(-12%, -60%) rotate(-5deg); }
.poster-about { transform: translate(-42%, -48%) rotate(-4deg); }
.poster-contact { transform: translate(-40%, -60%) rotate(-2deg); }
.menu-command { position: absolute; left: max(22vw, 330px); bottom: 8vh; z-index: 6; display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-10); max-width: calc(100% - max(22vw, 330px) - 4vw); }
.menu-word { flex-wrap: nowrap; font-size: clamp(64px, 11vw, 170px); }
.menu-hint { margin: 0; max-width: 100%; padding: var(--space-1) var(--space-6); background: var(--p5-paper); color: var(--p5-ink); border: var(--border-3) solid var(--p5-ink); box-shadow: var(--hard-sm); transform: skewX(var(--skew)) rotate(var(--rot-1)); font-size: clamp(16px, 1.5vw, 22px); letter-spacing: .06em; }
.menu-email { position: absolute; left: 4vw; bottom: 6vh; z-index: 6; display: flex; align-items: center; min-height: 44px; color: var(--p5-paper); text-shadow: var(--text-shadow-ink); font-size: clamp(16px, 1.9vw, 28px); }
.menu-email:hover { color: var(--p5-paper); text-decoration: underline; }
.menu-keys { position: absolute; right: 3vw; bottom: 3vh; z-index: 6; display: flex; gap: var(--space-10); padding: var(--space-3) var(--space-9); border: var(--border-3) solid var(--p5-ink); background: var(--p5-paper); color: var(--p5-ink); box-shadow: var(--hard-md); transform: skewX(var(--skew)); font-size: var(--size-btn); letter-spacing: .12em; }
.menu-keys kbd { padding: 1px var(--space-3); border: var(--border-3) solid currentColor; font-family: inherit; font-size: var(--size-label); }
@media (width < 1100px) and (width >= 760px) {
  .menu-context p { max-width: 240px; }
  .menu-command { left: 26vw; max-width: 70vw; }
  .menu-word { font-size: 10vw; }
}
@media (width < 760px), (height < 700px) {
  .menu-layout { position: relative; inset: auto; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-11); padding: var(--space-7) 5vw var(--space-13); }
  .menu-context { position: relative; inset: auto; grid-column: 1 / -1; flex-direction: row; justify-content: space-between; align-items: center; }
  .menu-context-plate { text-align: left; }
  .menu-context p { max-width: 250px; }
  .menu-navigation { position: relative; inset: auto; grid-column: 1; padding-block: var(--space-10); }
  .menu-poster { left: auto; right: 4vw; top: 110px; width: min(40vw, 42vh); transform: rotate(4deg); }
  .menu-command { position: relative; inset: auto; grid-column: 1 / -1; max-width: 100%; gap: var(--space-7); }
  .menu-word { font-size: clamp(64px, 11vw, 110px); }
  .menu-email { position: relative; inset: auto; grid-column: 1 / -1; }
  .menu-keys { display: none; }
}
@media (width < 760px) {
  .menu-topbar { padding: var(--space-7) var(--space-9); gap: var(--space-3); }
  .menu-topbar > div { gap: var(--space-3); }
  .menu-brand { padding-inline: var(--space-4); }
  .menu-close { padding-inline: var(--space-4); font-size: var(--size-btn-sm); }
  .menu-bars { display: none; }
  .menu-context-plate { max-width: calc(100% - 60px); padding: var(--space-3) var(--space-5); }
  .menu-context p { font-size: var(--size-label-xs); letter-spacing: var(--track-label); }
  .menu-context h2 { font-size: 26px; }
  .menu-option { font-size: clamp(28px, 6vw, 42px); }
  .menu-navigation .menu-option.is-active { font-size: clamp(36px, 8vw, 60px); }
  .menu-poster { top: 135px; right: -5vw; width: min(48vw, 50vh); }
  .menu-word { font-size: clamp(52px, 12vw, 88px); }
  .menu-command { margin-top: var(--space-11); }
  .menu-email { font-size: var(--size-btn-lg); }
}
</style>
