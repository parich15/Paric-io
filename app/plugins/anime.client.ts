import { animate, createScope, createTimeline, cubicBezier, set, stagger, steps, waapi } from 'animejs'

/** Convierte los tokens CSS existentes a milisegundos y curvas de Anime.js. */
function readMotion(element: HTMLElement, durationToken: string, easingToken: string) {
  const style = getComputedStyle(element)
  const durationValue = style.getPropertyValue(durationToken).trim()
  const coordinates = style.getPropertyValue(easingToken).match(/-?\d*\.?\d+/g)?.map(Number)
  const duration = Number.parseFloat(durationValue) * (durationValue.endsWith('ms') ? 1 : 1000)
  const ease = coordinates?.length === 4
    ? cubicBezier(coordinates[0]!, coordinates[1]!, coordinates[2]!, coordinates[3]!)
    : cubicBezier(.25, .1, .25, 1)

  return { duration: Number.isFinite(duration) ? duration : 0, ease }
}

const anime = { animate, createScope, createTimeline, cubicBezier, stagger, steps, waapi, utils: { set }, readMotion } as const

export type AnimeApi = typeof anime

/** Inyecta Anime.js tipado en cliente; las instancias pertenecen a cada componente. */
export default defineNuxtPlugin(() => ({ provide: { anime } }))
