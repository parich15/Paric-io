import { usePreferredReducedMotion } from '@vueuse/core'
import type { Ref } from 'vue'
import type { AnimeApi } from '~/plugins/anime.client'

/** Mueve wrappers data-menu-item ya montados; el consumidor conserva apertura, selección y foco. */
export function useMenuMotion(root: Ref<HTMLElement | null>) {
  const nuxtApp = useNuxtApp()
  const preference = usePreferredReducedMotion()
  let scope: ReturnType<AnimeApi['createScope']> | undefined
  let selection: ReturnType<AnimeApi['createScope']> | undefined
  let moving = false
  let disposed = false
  let entrance: ReturnType<AnimeApi['createTimeline']> | undefined
  let entranceTimer: ReturnType<typeof setTimeout> | undefined
  let settle: (() => void) | undefined

  /** En móvil la entrada es una animación CSS por compositor; aquí solo se retira su clase. */
  function stopEntrance() {
    entrance?.cancel()
    entrance = undefined
    if (entranceTimer) clearTimeout(entranceTimer)
    entranceTimer = undefined
    root.value?.classList.remove('is-entering')
  }

  function cleanup() {
    selection?.revert()
    selection = undefined
    scope?.revert()
    scope = undefined
    moving = false
    stopEntrance()
    settle?.()
    settle = undefined
  }

  function open(): void {
    cleanup()
    const element = root.value
    if (import.meta.server || disposed || !element || preference.value === 'reduce') return
    const anime = nuxtApp.$anime
    moving = true
    scope = anime.createScope({ root: element })
    scope.add(() => {
      const timing = anime.readMotion(element, '--dur-enter', '--easing-slash')
      if (element.querySelector('.menu-curtain') && window.matchMedia('(min-width: 760px)').matches) {
        const left = [...element.querySelectorAll<HTMLElement>('[data-menu-side="left"]')]
        const right = [...element.querySelectorAll<HTMLElement>('[data-menu-side="right"]')]
        anime.utils.set(left, { x: '-100vw' })
        anime.utils.set(right, { x: '100vw' })
        entrance = anime.createTimeline({ onComplete: cleanup })
          .add(left, { ...timing, ease: 'inOut(2)', x: ['-100vw', '0vw'] }, 0)
          .add(right, { ...timing, ease: 'inOut(2)', x: ['100vw', '0vw'] }, 0)
      }
      else {
        const count = element.querySelectorAll('[data-menu-item]').length
        element.classList.add('is-entering')
        entranceTimer = setTimeout(cleanup, timing.duration + Math.max(0, count - 1) * 80 + 50)
      }
    })
  }

  /** Retira todas las piezas juntas; el cierre nunca espera el escalonado de entrada. */
  function close(): Promise<void> {
    const element = root.value
    if (!element || preference.value === 'reduce') { cleanup(); return Promise.resolve() }
    stopEntrance()
    selection?.revert()
    selection = undefined
    moving = true
    const anime = nuxtApp.$anime
    scope ??= anime.createScope({ root: element })
    return new Promise((resolve) => {
      settle = resolve
      scope!.add(() => {
        const timing = { ...anime.readMotion(element, '--dur-fast', '--easing-slash'), ease: 'in(2)' }
        if (window.matchMedia('(min-width: 760px)').matches) {
          anime.createTimeline({ onComplete: () => resolve() })
            .add(element.querySelectorAll('[data-menu-side="left"]'), { ...timing, x: '-100vw' }, 0)
            .add(element.querySelectorAll('[data-menu-side="right"]'), { ...timing, x: '100vw' }, 0)
        }
        else anime.animate(element.querySelectorAll('[data-menu-item]'), { ...timing, opacity: 0, x: -30, onComplete: () => resolve() })
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

  return { open, close, select, reset: cleanup }
}
