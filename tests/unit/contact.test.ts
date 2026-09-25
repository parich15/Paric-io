import { describe, expect, it } from 'vitest'
import { buildContactMailto } from '../../app/utils/contact'

describe('buildContactMailto', () => {
  it('devuelve la dirección desnuda cuando el borrador está vacío', () => {
    expect(buildContactMailto({ name: '  ', email: '', message: '\n' }, 'Mensaje desde oscarparic.io')).toBe('mailto:oscar@oscarparic.io')
  })

  it('redacta asunto y cuerpo con firma, espacios %20 y saltos %0D%0A', () => {
    const href = buildContactMailto({ name: 'Ana Ruiz', email: 'ana@example.com', message: 'Hola Oscar,\n¿hablamos?' }, 'Mensaje desde oscarparic.io · Ana Ruiz')
    const url = new URL(href)
    expect(url.protocol).toBe('mailto:')
    expect(url.pathname).toBe('oscar@oscarparic.io')
    expect(href).toContain('subject=Mensaje%20desde%20oscarparic.io%20%C2%B7%20Ana%20Ruiz')
    expect(href).toContain('body=Hola%20Oscar%2C%0D%0A%C2%BFhablamos%3F%0D%0A%0D%0AAna%20Ruiz%0D%0Aana%40example.com')
    expect(href).not.toContain('+')
  })

  it('omite las partes vacías y conserva el signo más del texto', () => {
    const href = buildContactMailto({ name: '', email: '', message: 'C++ y Vue' }, 'Mensaje desde oscarparic.io')
    expect(href).toBe('mailto:oscar@oscarparic.io?subject=Mensaje%20desde%20oscarparic.io&body=C%2B%2B%20y%20Vue')
    expect(buildContactMailto({ name: 'Ana', email: '', message: '' }, '')).toBe('mailto:oscar@oscarparic.io?body=Ana')
  })
})
