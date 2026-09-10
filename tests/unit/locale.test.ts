import { describe, expect, it } from 'vitest'
import { detectLocale, localizedHash } from '../../app/utils/locale'

describe('elección de idioma al entrar por raíz', () => {
  it.each(['es', 'es-ES', 'es-MX', 'ES-ar'])('conserva castellano para %s', (language) => {
    expect(detectLocale(language)).toBe('es')
  })

  it.each(['en', 'en-GB', 'fr-FR', 'ja', ''])('usa inglés para %s', (language) => {
    expect(detectLocale(language)).toBe('en')
  })

  it('la elección manual prevalece y una cookie desconocida se ignora', () => {
    expect(detectLocale('en-US', 'es')).toBe('es')
    expect(detectLocale('es-ES', 'en')).toBe('en')
    expect(detectLocale('es-ES', 'fr')).toBe('es')
  })
})

describe('anclas localizadas', () => {
  it.each([
    ['#inicio', '#home'], ['#sobre', '#about'], ['#contacto', '#contact'],
  ])('traduce %s en ambos sentidos', (spanish, english) => {
    expect(localizedHash(spanish, 'en')).toBe(english)
    expect(localizedHash(english, 'es')).toBe(spanish)
  })

  it('conserva las anclas que no dependen del idioma', () => {
    expect(localizedHash('#gallery', 'es')).toBe('#gallery')
    expect(localizedHash('', 'en')).toBe('')
  })
})
