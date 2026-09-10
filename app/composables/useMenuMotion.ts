import { usePreferredReducedMotion } from '@vueuse/core'
import type { Ref } from 'vue'
import type { AnimeApi } from '~/plugins/anime.client'

/** Mueve wrappers data-menu-item ya montados; el consumidor conserva apertura, selección y foco. */
export function useMenuMotion(root: Ref<HTMLElement | null>) {
  const nuxtApp = useNuxtApp()
  const preference = usePreferredReducedMotion()
  let scope: ReturnType<AnimeApi['createScope']> | undefined
  let selection: ReturnType<AnimeApi['createScope']> | undefined
  let settle: (() => void) | undefined
  let moving = false
  let disposed = false

  function cleanup() {
    selection?.revert()
    selection = undefined
    scope?.revert()
    scope = undefined
    moving = false
    settle?.()
    settle = undefined
  }

  function transition(opening: boolean): Promise<void> {
    cleanup()
    const element = root.value
    if (import.meta.server || disposed || !element || preference.value === 'reduce') return Promise.resolve()
    const targets = [...element.querySelectorAll<HTMLElement>('[data-menu-item]')]
    if (!targets.length) return Promise.resolve()

    const anime = nuxtApp.$anime
    moving = true
    return new Promise((resolve) => {
      settle = resolve
      scope = anime.createScope({ root: element })
      scope.add(() => {
        anime.animate(opening ? targets : targets.toReversed(), {
          ...anime.readMotion(element, '--dur-enter', '--easing-slash'),
          x: opening ? [-60, 0] : [0, -60],
          opacity: opening ? [0, 1] : [1, 0],
          delay: anime.stagger(80),
          onComplete: () => {
            moving = false
            settle?.()
            settle = undefined
            if (opening) cleanup()
          },
        })
      })
    })
  }

  /** El muelle se aplica al wrapper, conservando el skew y giro de su contenido. */
  function select(index: number): void {
    selection?.revert()
    selection = undefined
    const element = root.value
    if (import.meta.server || disposed || !element || moving || preference.value === 'reduce') return
    const target = element.querySelectorAll<HTMLElement>('[data-menu-item]')[index]
    if (!target) return

    const anime = nuxtApp.$anime
    const style = getComputedStyle(element)
    selection = anime.createScope({ root: element })
    selection.add(() => {
      anime.animate(target, {
        ...anime.readMotion(element, '--dur-hover', '--easing-pop'),
        scale: [1, Number.parseFloat(style.getPropertyValue('--hover-scale')), 1],
        rotate: [0, Number.parseFloat(style.getPropertyValue('--hover-rotate')), 0],
        onComplete: () => {
          selection?.revert()
          selection = undefined
        },
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

  return { open: () => transition(true), close: () => transition(false), select }
}
