import { usePreferredReducedMotion } from '@vueuse/core'
import type { Ref } from 'vue'
import type { AnimeApi } from '~/plugins/anime.client'

/** Anima wrappers rise/stamp; play también resuelve si se interrumpe o desmonta. */
export function useMotionEnter(root: Ref<HTMLElement | null>) {
  const nuxtApp = useNuxtApp()
  const preference = usePreferredReducedMotion()
  let scope: ReturnType<AnimeApi['createScope']> | undefined
  let settle: (() => void) | undefined
  let disposed = false

  function cleanup() {
    scope?.revert()
    scope = undefined
    settle?.()
    settle = undefined
  }

  function play(): Promise<void> {
    cleanup()
    const element = root.value
    if (import.meta.server || disposed || !element || preference.value === 'reduce') return Promise.resolve()

    const selector = '[data-motion="rise"], [data-motion="stamp"]'
    const targets = [...(element.matches(selector) ? [element] : []), ...element.querySelectorAll<HTMLElement>(selector)]
    if (!targets.length) return Promise.resolve()

    const anime = nuxtApp.$anime
    return new Promise((resolve) => {
      settle = resolve
      scope = anime.createScope({ root: element })
      scope.add(() => {
        const timeline = anime.createTimeline({ autoplay: false, onComplete: cleanup })
        targets.forEach((target, index) => {
          const stamp = target.dataset.motion === 'stamp'
          const timing = anime.readMotion(target, stamp ? '--dur-stamp' : '--dur-rise', stamp ? '--easing-stamp' : '')
          timeline.add(target, stamp
            ? {
                ...timing,
                keyframes: {
                  '0%': { scale: 2.2, rotate: -10, opacity: 0 },
                  '55%': { scale: .94, rotate: 0, opacity: 1 },
                  '100%': { scale: 1, rotate: 0, opacity: 1 },
                },
              }
            : { ...timing, y: [30, 0], opacity: [0, 1] }, index * 100)
        })
        timeline.play()
      })
    })
  }

  watch(root, cleanup, { flush: 'sync' })
  watch(preference, () => {
    if (preference.value === 'reduce') cleanup()
  }, { flush: 'sync' })
  onScopeDispose(() => {
    disposed = true
    cleanup()
  })

  return { play }
}
