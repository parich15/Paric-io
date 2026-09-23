import { describe, expect, it } from 'vitest'
import { buildContactMailto } from '../../app/utils/contact'

describe('buildContactMailto', () => {
  it('devuelve la dirección desnuda cuando el borrador está vacío', () => {
    expect(buildContactMailto({ name: '  ', email: '', message: '\n' }, 'Mensaje desde paric.io')).toBe('mailto:oscar@paric.io')
  })

  it('redacta asunto y cuerpo con firma, espacios %20 y saltos %0D%0A', () => {
    const href = buildContactMailto({ name: 'Ana Ruiz', email: 'ana@example.com', message: 'Hola Oscar,\n¿hablamos?' }, 'Mensaje desde paric.io · Ana Ruiz')
    const url = new URL(href)
    expect(url.protocol).toBe('mailto:')
    expect(url.pathname).toBe('oscar@paric.io')
    expect(href).toContain('subject=Mensaje%20desde%20paric.io%20%C2%B7%20Ana%20Ruiz')
    expect(href).toContain('body=Hola%20Oscar%2C%0D%0A%C2%BFhablamos%3F%0D%0A%0D%0AAna%20Ruiz%0D%0Aana%40example.com')
    expect(href).not.toContain('+')
  })

  it('omite las partes vacías y conserva el signo más del texto', () => {
    const href = buildContactMailto({ name: '', email: '', message: 'C++ y Vue' }, 'Mensaje desde paric.io')
    expect(href).toBe('mailto:oscar@paric.io?subject=Mensaje%20desde%20paric.io&body=C%2B%2B%20y%20Vue')
    expect(buildContactMailto({ name: 'Ana', email: '', message: '' }, '')).toBe('mailto:oscar@paric.io?body=Ana')
  })
})
