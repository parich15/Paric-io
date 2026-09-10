import { expect, test } from '@playwright/test'

for (const [language, expectedPath, expectedLang] of [
  ['es-ES', '/', 'es-ES'],
  ['es-MX', '/', 'es-ES'],
  ['en-US', '/en', 'en-GB'],
  ['fr-FR', '/en', 'en-GB'],
]) {
  test(`entrada por raíz con navegador ${language}`, async ({ browser }) => {
    const context = await browser.newContext({ locale: language, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page).toHaveURL(new RegExp(`${expectedPath}$`))
    await expect(page.locator('html')).toHaveAttribute('lang', expectedLang!)
    await context.close()
  })
}

test('respeta el idioma de URLs concretas y la elección manual persistida', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US', reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/proyectos/nocturne')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/projects\/nocturne$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page.getByRole('dialog')).not.toBeVisible()

  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await page.getByRole('link', { name: 'ES', exact: true }).click()
  await expect(page).toHaveURL(/\/proyectos\/nocturne$/)
  expect((await context.cookies()).find(cookie => cookie.name === 'i18n_redirected')?.value).toBe('es')
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
  await expect(page).toHaveURL(/\/$/)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
  await context.close()
})

test('selector de idioma conserva ancla y parámetros', async ({ page }) => {
  await page.goto('/?source=portfolio#sobre')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL('/en?source=portfolio#about')
  await expect(page.locator('#about')).toBeInViewport()
})
