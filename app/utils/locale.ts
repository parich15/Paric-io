import type { Locale } from '../data/projects'

/** La preferencia principal española conserva castellano; cualquier otro idioma usa inglés. */
export function detectLocale(browserLanguage: string, savedLocale?: string): Locale {
  if (savedLocale === 'es' || savedLocale === 'en') return savedLocale
  return /^es(?:-|$)/i.test(browserLanguage) ? 'es' : 'en'
}

export function localizedHash(hash: string, locale: Locale): string {
  const anchors: Record<string, Record<Locale, string>> = {
    '#inicio': { es: '#inicio', en: '#home' },
    '#home': { es: '#inicio', en: '#home' },
    '#sobre': { es: '#sobre', en: '#about' },
    '#about': { es: '#sobre', en: '#about' },
    '#contacto': { es: '#contacto', en: '#contact' },
    '#contact': { es: '#contacto', en: '#contact' },
  }
  return anchors[hash]?.[locale] ?? hash
}
