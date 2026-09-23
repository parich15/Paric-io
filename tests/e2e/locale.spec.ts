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
    await page.goto('/proyectos/hortec')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'EN', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/projects\/hortec$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
    await expect(page.getByRole('dialog')).not.toBeVisible()

    await page.getByRole('button', { name: 'Open menu', exact: true }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'ES', exact: true }).click()
    await expect(page).toHaveURL(/\/proyectos\/hortec$/)
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

test('las vistas nuevas conservan ficha y parámetros al cambiar de idioma', async ({ page }) => {
  await page.goto('/clientes/hortec?source=portfolio')
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL('/en/clients/hortec?source=portfolio')
  await expect(page.locator('h1')).toContainText('Hortec')
  await page.getByRole('button', { name: 'Open menu', exact: true }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'About me', exact: true }).click()
  await expect(page).toHaveURL('/en/about')
  await page.getByRole('link', { name: 'ES', exact: true }).click()
  await expect(page).toHaveURL('/sobre-mi')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es-ES')
})

test('el selector avisa mientras descarga el idioma y despeja al terminar', async ({ page }) => {
  await page.goto('/proyectos/hortec')
  await page.route('**/_i18n/**/en/messages.json', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    await route.continue()
  })
  const status = page.locator('.locale-switch').getByRole('status')
  const target = page.getByRole('link', { name: 'EN', exact: true })
  await target.click()
  await expect(target).toHaveClass(/is-pending/)
  await expect(status).toHaveText('Cargando')
  await expect(status).toHaveCSS('opacity', '1')
  await expect(page).toHaveURL(/\/en\/projects\/hortec$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(status).toBeEmpty()
  await expect(target).not.toHaveClass(/is-pending/)
  await expect(status).toHaveCSS('opacity', '0')
})

test('si la descarga del idioma falla, se carga la URL destino completa', async ({ page }) => {
  await page.goto('/clientes/hortec?source=portfolio')
  let failed = false
  await page.route('**/_i18n/**/en/messages.json', (route) => {
    if (failed) return route.continue()
    failed = true
    return route.fulfill({ status: 200, contentType: 'application/json', body: 'null' })
  })
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL('/en/clients/hortec?source=portfolio')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await expect(page.locator('h1')).toContainText('Hortec')
  expect(failed).toBe(true)
})
