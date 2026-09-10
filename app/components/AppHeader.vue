<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const menu = useTemplateRef('menu')
const menuOpen = ref(false)
const section = ref('home')
const contextLabel = computed(() => t(`common.${String(route.name).startsWith('projects') ? 'projects' : section.value}`))
const homeTarget = computed(() => ({ path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' }))

/** El hash solo se lee tras montar para que la cabecera inicial coincida con el HTML estático. */
function updateContext() {
  section.value = ['#sobre', '#about'].includes(route.hash) ? 'about' : ['#contacto', '#contact'].includes(route.hash) ? 'contact' : 'home'
}

onMounted(updateContext)
watch(() => route.fullPath, updateContext)
</script>

<template>
  <header class="app-header">
    <NuxtLink :to="homeTarget" class="header-brand display-p5" aria-label="Paric.io">Paric.io</NuxtLink>
    <div class="header-controls">
      <div class="header-context display-p5">{{ t('common.menu') }}: <span>{{ contextLabel }}</span></div>
      <LocaleSwitch />
      <button class="header-toggle label-p5" type="button" :aria-label="t('common.openMenu')" aria-haspopup="dialog" aria-controls="global-menu" :aria-expanded="menuOpen" @click="menu?.open()">
        <span>{{ t('common.menu') }}</span><span class="header-bars" aria-hidden="true"></span>
      </button>
    </div>
  </header>
  <GlobalMenu ref="menu" @change="menuOpen = $event" />
</template>

<style scoped>
.app-header { position: fixed; top: 0; left: 0; right: 0; z-index: var(--z-header); display: flex; align-items: center; justify-content: space-between; gap: var(--space-7); padding: var(--header-pad); pointer-events: none; }
.app-header > * { pointer-events: auto; }
.header-brand { display: inline-block; padding: var(--space-1) var(--space-6) var(--space-2); background: var(--p5-paper); color: var(--p5-ink); transform: skewX(var(--skew-md)) rotate(var(--rot-2)); box-shadow: var(--hard); font-size: var(--size-btn-lg); line-height: 1.4; }
.header-brand:hover { color: var(--p5-ink); transform: skewX(var(--skew-md)) rotate(var(--rot-2)) scale(1.06); }
.header-controls { display: flex; align-items: center; gap: var(--space-7); }
.header-context { padding: var(--space-2) var(--space-8) var(--space-3); background: var(--p5-paper); color: var(--p5-ink); box-shadow: var(--hard-md); transform: skewX(var(--skew)) rotate(var(--rot-2)); font-size: clamp(18px, 2vw, 28px); }
.header-context > span { color: var(--p5-red); }
.header-toggle { position: relative; isolation: isolate; display: flex; align-items: center; justify-content: center; gap: var(--space-5); min-height: 44px; padding: var(--space-4) var(--space-8) var(--space-4) var(--space-10); border: 0; background: transparent; color: var(--p5-paper); font-size: var(--size-btn); letter-spacing: var(--track-label-wide); cursor: pointer; transition: transform var(--dur-hover) var(--easing-pop); }
.header-toggle::before { position: absolute; inset: 0; z-index: -1; background: var(--p5-red); clip-path: var(--clip-slant-tight); content: ''; }
.header-toggle:hover { transform: scale(1.08) rotate(var(--rot-2)); color: var(--p5-ink); }
.header-toggle:hover::before { background: var(--p5-paper); }
.header-bars { width: 22px; height: 3px; background: currentColor; box-shadow: 0 -7px 0 currentColor, 0 7px 0 currentColor; }
@media (width < 1000px) { .header-context { display: none; } }
@media (width < 760px) { .app-header { padding: var(--space-7) var(--space-9); gap: var(--space-3); } .header-controls { gap: var(--space-3); } .header-brand { padding-inline: var(--space-4); } .header-toggle { min-width: 44px; padding-inline: var(--space-5); } .header-toggle > span:first-child { display: none; } }
</style>
