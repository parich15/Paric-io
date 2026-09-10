<script setup lang="ts">
import { useEventListener, usePreferredReducedMotion } from '@vueuse/core'
import type { AnimeApi } from '~/plugins/anime.client'

const nuxtApp = useNuxtApp()
const router = useRouter()
const { t } = useI18n()
const preference = usePreferredReducedMotion()
const seen = useState('motion:intro-seen', () => false)
const active = useState('motion:intro-active', () => false)
const root = useTemplateRef('root')
const hydrating = nuxtApp.isHydrating
let scope: ReturnType<AnimeApi['createScope']> | undefined
let removeReadyHook: (() => void) | undefined
let disposed = false

function finish() {
  scope?.revert()
  scope = undefined
  active.value = false
}

/** Se ejecuta tras app:mounted, después del replace inicial de idioma, una sola vez por carga. */
async function start() {
  if (disposed || seen.value) return
  seen.value = true
  const route = router.currentRoute.value
  if (!/^\/(?:en\/?)?$/.test(route.path) || (route.hash && !['#inicio', '#home'].includes(route.hash)) || preference.value === 'reduce') return

  active.value = true
  await nextTick()
  if (disposed || !active.value || !root.value) return
  const anime = nuxtApp.$anime
  const element = root.value
  scope = anime.createScope({ root: element })
  scope.add(() => {
    const timeline = anime.createTimeline({ autoplay: false, onComplete: finish })
    timeline.add('[data-intro-plane]', {
      ...anime.readMotion(element, '--dur-enter', '--easing-slash'),
      x: ['-120%', '0%'],
      skewX: -22,
      delay: anime.stagger(150),
    }, 0)
    timeline.add('[data-intro-stamp]', {
      ...anime.readMotion(element, '--dur-stamp', '--easing-stamp'),
      scale: [2.2, 1], rotate: [-14, -4], opacity: [0, 1],
    }, 500)
    timeline.add(element, { opacity: [1, 0], duration: 500, ease: anime.cubicBezier(.25, .1, .25, 1) }, 2300)
    anime.animate('[data-intro-loading]', { opacity: [1, .15], duration: 800, alternate: true, loop: true, ease: anime.steps(2) })
    timeline.play()
  })
}

onMounted(() => {
  if (hydrating) removeReadyHook = nuxtApp.hook('app:mounted', start)
  else void start()
})
useEventListener('pointerdown', finish)
useEventListener('keydown', finish)
watch(active, (visible) => { if (!visible) finish() })
watch(preference, () => { if (preference.value === 'reduce') finish() })
onBeforeUnmount(() => {
  disposed = true
  removeReadyHook?.()
  finish()
})
</script>

<template>
  <div v-show="active" ref="root" data-testid="page-intro" class="app-intro" aria-hidden="true" inert>
    <div data-intro-plane class="app-intro__plane app-intro__plane--red"></div>
    <div data-intro-plane class="app-intro__plane app-intro__plane--paper"></div>
    <div class="app-intro__center">
      <div data-intro-stamp class="app-intro__stamp display-p5">Paric.io</div>
      <div data-intro-loading class="app-intro__loading label-p5">{{ t('common.loading') }}...</div>
    </div>
  </div>
</template>

<style scoped>
.app-intro {
  position: fixed;
  inset: 0;
  z-index: var(--z-intro);
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--p5-ink);
  pointer-events: none;
}

.app-intro__plane { position: absolute; top: -10%; height: 120%; transform: skewX(-22deg); }
.app-intro__plane--red { left: -5%; width: 70%; background: var(--p5-red); }
.app-intro__plane--paper { right: -5%; width: 35%; background: var(--p5-paper); }
.app-intro__center { position: relative; text-align: center; }

.app-intro__stamp {
  display: inline-block;
  max-width: 94vw;
  padding: 8px clamp(8px, 3vw, 32px) 16px;
  background: var(--p5-ink);
  color: var(--p5-paper);
  font-size: var(--size-hero);
  box-shadow: 12px 12px 0 var(--p5-paper);
  transform: rotate(-4deg);
}

.app-intro__loading { margin-top: 28px; font-size: 20px; letter-spacing: var(--track-loader); color: var(--p5-ink); }

@media (prefers-reduced-motion: reduce) {
  .app-intro { display: none !important; }
}
</style>
