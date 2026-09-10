import { expect, test as base } from '@playwright/test'

/** Cualquier error de ejecución o hidratación convierte el recorrido de navegador en un fallo. */
export const test = base.extend({
  page: async ({ page }, use) => {
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
