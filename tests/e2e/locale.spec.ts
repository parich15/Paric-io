import { expect, test } from './fixtures'

for (const [language, expectedPath, expectedLang] of [
  ['es-ES', '/', 'es-ES'],
  ['es-MX', '/', 'es-ES'],
  ['en-US', '/en', 'en-GB'],
  ['fr-FR', '/en', 'en-GB'],
]) {
  test.describe(`navegador ${language}`, () => {
    test.use({ locale: language })
    test('entrada por raíz', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveURL(new RegExp(`${expectedPath}$`))
      await expect(page.locator('html')).toHaveAttribute('lang', expectedLang!)
    })
  })
}

test.describe('elección manual con navegador inglés', () => {
  test.use({ locale: 'en-US' })
  test('respeta URLs concretas y recuerda la elección manual', async ({ page, context }) => {
    await page.goto('/proyectos/nocturne')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/projects\/nocturne$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
    await expect(page.getByRole('dialog')).not.toBeVisible()

    await page.getByRole('button', { name: 'Open menu', exact: true }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'ES', exact: true }).click()
    await expect(page).toHaveURL(/\/proyectos\/nocturne$/)
    expect((await context.cookies()).find(cookie => cookie.name === 'i18n_redirected')?.value).toBe('es')
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
    await expect(page).toHaveURL(/\/$/)
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
  })
})

test('selector de idioma conserva ancla y parámetros', async ({ page }) => {
  await page.goto('/?source=portfolio#sobre')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL('/en?source=portfolio#about')
  await expect(page.locator('#about')).toBeInViewport()
})
