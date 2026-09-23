import { describe, expect, it } from 'vitest'
import { findClient, findProjectClient, getClientProjects, type Client } from '../../app/data/clients'

describe('proyectos de cada cliente', () => {
  it('admite uno o varios proyectos en el orden elegido para la ficha', () => {
    const client = findClient('hortec')!
    expect(getClientProjects(client).map(project => project.slug)).toEqual(['hortec'])

    const multipleProjects: Client = { ...client, projectSlugs: ['captotal', 'carland'] }
    expect(getClientProjects(multipleProjects).map(project => project.slug)).toEqual(['captotal', 'carland'])
    expect(getClientProjects({ ...client, projectSlugs: [] })).toEqual([])
  })

  it('resuelve el cliente de un proyecto y deja libres los proyectos personales', () => {
    expect(findProjectClient('carland')?.slug).toBe('captotal')
    expect(findProjectClient('snkrz')).toBeUndefined()
    expect(findClient('missing')).toBeUndefined()
  })
})
