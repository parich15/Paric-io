import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import { findProject, getProjects, type Project, type ProjectCategory } from '../data/projects'

export interface CarouselState {
  category: ProjectCategory
  index: number
}

/** Normaliza índices, incluidos los negativos, sin perder la continuidad circular. */
export function circularIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

/** Distancia al centro por el recorrido más corto; el empate aparece a la derecha. */
export function carouselDistance(index: number, position: number, total: number): number {
  const distance = circularIndex(index - position, total)
  return distance > total / 2 ? distance - total : distance
}

/** Una categoría explícita manda; un slug ajeno o desconocido selecciona su primer proyecto. */
export function resolveCarouselState(query: LocationQuery, fallback?: Project): CarouselState {
  const slug = typeof query.slug === 'string' ? query.slug : undefined
  const selected = slug ? findProject(slug) : undefined
  const category = query.category === 'pro' || query.category === 'personal'
    ? query.category
    : (selected ?? fallback)?.category ?? 'pro'
  const projects = getProjects(category)
  const index = projects.findIndex(project => project.slug === (slug ?? fallback?.slug))
  return { category, index: Math.max(0, index) }
}

export function projectQuery(project: Project, query: LocationQuery = {}): LocationQueryRaw {
  return { ...query, category: project.category, slug: project.slug }
}

/** Conserva el origen incluso al recorrer otros detalles; las entradas directas vuelven a su ficha. */
export function carouselReturnQuery(query: LocationQuery, project: Project): LocationQueryRaw {
  const state = resolveCarouselState(query, project)
  return projectQuery(getProjects(state.category)[state.index]!, query)
}

/** Un arrastre vertical o corto no cambia selección; un gesto largo avanza hasta dos tarjetas. */
export function dragTarget(position: number, deltaX: number, deltaY: number, width: number): number {
  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY) || width <= 0) return position
  const steps = Math.min(2, Math.max(1, Math.round(Math.abs(deltaX) / width)))
  return position - Math.sign(deltaX) * steps
}
