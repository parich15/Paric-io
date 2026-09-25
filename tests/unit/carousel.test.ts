import { describe, expect, it } from 'vitest'
import { findProject, getNextProject, getProjects } from '../../app/data/projects'
import { carouselDistance, carouselReturnQuery, circularIndex, dragTarget, projectQuery, resolveCarouselState } from '../../app/utils/carousel'

describe('selección circular', () => {
  it('recorre ambas categorías hacia delante y hacia atrás', () => {
    for (const category of ['pro', 'personal'] as const) {
      const projects = getProjects(category)
      expect(circularIndex(-1, projects.length)).toBe(projects.length - 1)
      expect(circularIndex(projects.length, projects.length)).toBe(0)
      expect(circularIndex(-projects.length * 3 - 1, projects.length)).toBe(projects.length - 1)
      expect(getNextProject(projects.at(-1)!)).toEqual(projects[0])
    }
  })

  it('elige la distancia corta y mantiene la profundidad durante el arrastre', () => {
    expect(carouselDistance(0, 3, 4)).toBe(1)
    expect(carouselDistance(3, 0, 4)).toBe(-1)
    expect(carouselDistance(2, 0, 4)).toBe(2)
    expect(carouselDistance(1, 0.5, 4)).toBe(0.5)
    expect(circularIndex(0, 0)).toBe(0)
  })
})

describe('estado en URL y retorno', () => {
  it('restaura todas las selecciones con query, incluida la segunda categoría', () => {
    for (const category of ['pro', 'personal'] as const) {
      getProjects(category).forEach((project, index) => {
        expect(resolveCarouselState({ category, slug: project.slug })).toEqual({ category, index })
      })
    }
  })

  it('reinicia la selección al cambiar categoría y tolera queries inválidas', () => {
    expect(resolveCarouselState({ category: 'personal', slug: 'captotal' })).toEqual({ category: 'personal', index: 0 })
    expect(resolveCarouselState({ category: 'pro', slug: 'missing' })).toEqual({ category: 'pro', index: 0 })
    expect(resolveCarouselState({ category: ['personal'], slug: ['moof'] })).toEqual({ category: 'pro', index: 0 })
    expect(resolveCarouselState({ slug: 'moof' })).toEqual({ category: 'personal', index: getProjects('personal').findIndex(project => project.slug === 'moof') })
    expect(resolveCarouselState({})).toEqual({ category: 'pro', index: 0 })
  })

  it('vuelve al origen exacto aunque se haya abierto el siguiente detalle', () => {
    const original = findProject('moof')!
    const query = { category: 'personal', slug: 'moof', source: 'home' }
    expect(carouselReturnQuery(query, getNextProject(original))).toEqual(query)
    expect(projectQuery(original, { source: 'home' })).toEqual(query)
  })

  it('una URL de detalle sin query vuelve a ese proyecto', () => {
    const project = findProject('ayc')!
    expect(carouselReturnQuery({}, project)).toEqual({ category: 'personal', slug: 'ayc' })
  })
})

describe('gestos de galería', () => {
  it('distingue un toque y el scroll vertical de la navegación horizontal', () => {
    expect(dragTarget(1, 12, 2, 240)).toBe(1)
    expect(dragTarget(1, 100, 140, 240)).toBe(1)
    expect(dragTarget(1, -60, 4, 240)).toBe(2)
    expect(dragTarget(0, 60, 4, 240)).toBe(-1)
  })

  it('limita los gestos largos a dos fichas y permite cerrar el círculo', () => {
    expect(dragTarget(1, -2000, 10, 240)).toBe(3)
    expect(circularIndex(dragTarget(0, 70, 1, 240), 3)).toBe(2)
  })
})
