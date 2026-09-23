import { expect, test as base } from '@playwright/test'

/** Cualquier error de ejecución o hidratación convierte el recorrido de navegador en un fallo. */
export const test = base.extend({
  page: async ({ page }, use) => {
    // La flotación en reposo es decorativa y con WebGL por software cada frame headless tarda ~80 ms:
    // sin amplitud, Playwright puede comprobar que los controles están quietos antes de pulsarlos.
    await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style')
      style.textContent = '* { --float-x: 0px !important; --float-y: 0px !important; }'
      document.head.append(style)
    }))
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error' || /hydration|mismatch/i.test(message.text())) errors.push(message.text())
    })
    await use(page)
    expect(errors, 'Errores de ejecución o hidratación').toEqual([])
  },
})

export { expect } from '@playwright/test'
