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
  let entrance: ReturnType<AnimeApi['waapi']['animate']>[] = []
  let entranceTimer: ReturnType<typeof setTimeout> | undefined
  let settle: (() => void) | undefined

  /** En móvil la entrada es una animación CSS por compositor; aquí solo se retira su clase. */
  function stopEntrance() {
    entrance.forEach(animation => animation.cancel())
    entrance = []
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
        // WAAPI sobre `translate`: el telón corre en el compositor aunque el hilo principal esté ocupado, y conserva el skew de cada pieza.
        entrance = [
          anime.waapi.animate(element.querySelectorAll('[data-menu-side="left"]'), { ...timing, ease: 'inOut(2)', translate: ['-100vw 0px', '0px 0px'] }),
          anime.waapi.animate(element.querySelectorAll('[data-menu-side="right"]'), { ...timing, ease: 'inOut(2)', translate: ['100vw 0px', '0px 0px'], onComplete: cleanup }),
        ]
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
          anime.waapi.animate(element.querySelectorAll('[data-menu-side="left"]'), { ...timing, translate: '-100vw 0px' })
          anime.waapi.animate(element.querySelectorAll('[data-menu-side="right"]'), { ...timing, translate: '100vw 0px', onComplete: () => resolve() })
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
