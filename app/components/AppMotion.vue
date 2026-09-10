<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import type { RouteLocationNormalized } from 'vue-router'
import type { AnimeApi } from '~/plugins/anime.client'
import { findProject } from '~/data/projects'

interface MotionNavigation {
  to: RouteLocationNormalized
  committed: boolean
  pending: boolean
  ready: boolean
  held: boolean
  proceed?: (allowed: boolean) => void
}

const nuxtApp = useNuxtApp()
const router = useRouter()
const { t } = useI18n()
const preference = usePreferredReducedMotion()
const introActive = useState('motion:intro-active', () => false)
const wipe = useTemplateRef('wipe')
const content = shallowRef<HTMLElement | null>(null)
const entries = useMotionEnter(content)
const visible = ref(false)
const label = ref('')
let appReady = !nuxtApp.isHydrating
let disposed = false
let navigation: MotionNavigation | undefined
let scope: ReturnType<AnimeApi['createScope']> | undefined
let timeline: ReturnType<AnimeApi['createTimeline']> | undefined
const removeHooks: (() => void)[] = []

/** Resuelve también el guard interrumpido para que una ráfaga nunca deje navegación pendiente. */
function reset(allowed = false) {
  const previous = navigation
  navigation = undefined
  scope?.revert()
  scope = undefined
  timeline = undefined
  visible.value = false
  previous?.proceed?.(allowed)
}

function destinationLabel(to: RouteLocationNormalized) {
  const locale = /^\/en(?:\/|$)/.test(to.path) ? 'en' : 'es'
  const project = typeof to.params.slug === 'string' ? findProject(to.params.slug) : undefined
  if (project) return project.title
  const hashLabels: Record<string, string> = { '#inicio': 'home', '#home': 'home', '#sobre': 'about', '#about': 'about', '#contacto': 'contact', '#contact': 'contact' }
  const key = hashLabels[to.hash]
    ?? (/\/(proyectos|projects)(?:\/|$)/.test(to.path) ? 'projects' : 'home')
  return t(`common.${key}`, {}, { locale })
}

function playEntries() {
  if (disposed || introActive.value) return
  content.value = document.querySelector<HTMLElement>('main')
  void entries.play()
}

/** El hash se resuelve sin selectores CSS y el foco temporal no altera el orden de tabulación. */
function focusDestination(to: RouteLocationNormalized) {
  let anchor: HTMLElement | null = null
  try {
    anchor = to.hash ? document.getElementById(decodeURIComponent(to.hash.slice(1))) : null
  }
  catch {
    anchor = null
  }
  const target = anchor ?? document.querySelector<HTMLElement>('main')
  if (!target) return
  if (anchor) anchor.scrollIntoView({ behavior: 'instant', block: 'start' })
  const tabindex = target.getAttribute('tabindex')
  if (tabindex === null) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  if (tabindex === null) target.removeAttribute('tabindex')
}

function reveal(current: MotionNavigation) {
  if (navigation !== current || !current.committed || current.pending) return
  current.ready = true
  if (current.held) timeline?.play()
}

/** El guard solo espera la cobertura; Suspense controla el despeje posterior. */
function cover(current: MotionNavigation): Promise<boolean> | boolean {
  const elements = wipe.value?.getElements()
  if (!elements) {
    reset(true)
    return true
  }
  const anime = nuxtApp.$anime
  const timing = anime.readMotion(elements.root, '--dur-wipe', '--easing-wipe')
  if (!timing.duration) {
    reset(true)
    return true
  }

  label.value = destinationLabel(current.to)
  visible.value = true
  return new Promise((resolve) => {
    current.proceed = resolve
    scope = anime.createScope({ root: elements.root })
    scope.add(() => {
      timeline = anime.createTimeline({ autoplay: false, onComplete: () => {
        if (navigation !== current) return
        reset(true)
        focusDestination(current.to)
      } })
      elements.planes.forEach((plane, index) => {
        timeline!.add(plane, {
          ...timing,
          keyframes: {
            '0%': { x: '-130%', skewX: -18 },
            '40%': { x: '0%', skewX: -18 },
            '60%': { x: '0%', skewX: -18 },
            '100%': { x: '130%', skewX: -18 },
          },
        }, index * 80)
      })
      anime.animate(elements.stamp, {
        ...anime.readMotion(elements.stamp, '--dur-stamp', '--easing-stamp'),
        delay: 350,
        keyframes: {
          '0%': { scale: 2.2, rotate: -14, opacity: 0 },
          '55%': { scale: .94, rotate: -4, opacity: 1 },
          '100%': { scale: 1, rotate: -4, opacity: 1 },
        },
      })
      timeline.call(() => {
        current.proceed?.(true)
        current.proceed = undefined
      }, timing.duration * .4 + 60)
      timeline.call(() => {
        if (!current.ready) {
          current.held = true
          timeline?.pause().seek(timing.duration * .4 + 160, true)
        }
      }, timing.duration * .4 + 160)
      timeline.call(playEntries, timing.duration * .6)
      timeline.play()
    })
  })
}

onMounted(() => {
  removeHooks.push(
    nuxtApp.hook('app:mounted', () => {
      appReady = true
      void nextTick().then(playEntries)
    }),
    router.beforeEach((to, from) => {
      reset()
      if (!appReady) return
      introActive.value = false
      if (preference.value === 'reduce' || (to.path === from.path && to.hash === from.hash)) return
      navigation = { to, committed: false, pending: false, ready: false, held: false }
    }),
    router.beforeResolve(to => navigation?.to === to ? cover(navigation) : undefined),
    router.afterEach(async (to, from, failure) => {
      const current = navigation
      if (current && current.to !== to) return
      if (failure) {
        reset()
        return
      }
      if (current) current.committed = true
      await nextTick()
      if (disposed || navigation !== current || router.currentRoute.value !== to) return
      if (current) reveal(current)
      else if (appReady) {
        playEntries()
        if (to.path !== from.path || to.hash !== from.hash) focusDestination(to)
      }
    }),
    router.onError((_error, to) => {
      if (navigation?.to === to) reset()
    }),
    nuxtApp.hook('page:start', () => {
      if (navigation?.to === router.currentRoute.value) navigation.pending = true
    }),
    nuxtApp.hook('page:finish', () => {
      if (navigation) {
        navigation.pending = false
        reveal(navigation)
      }
      else if (appReady) {
        playEntries()
        if (preference.value === 'reduce') focusDestination(router.currentRoute.value)
      }
    }),
    nuxtApp.hook('app:error', () => { reset() }),
  )
  if (appReady) void nextTick().then(playEntries)
})

watch(introActive, (active) => {
  if (!active && !navigation) playEntries()
}, { flush: 'post' })
watch(preference, () => {
  if (preference.value === 'reduce') {
    reset(true)
    playEntries()
  }
})
onBeforeUnmount(() => {
  disposed = true
  removeHooks.forEach(remove => remove())
  reset(true)
})
</script>

<template>
  <P5Wipe ref="wipe" :show="visible" :label="label" />
</template>
