import { expect, test } from './fixtures'

test('clientes: flechas, límites, Tab nativo, ficha e idioma', async ({ page }) => {
  await page.goto('/clientes')
  const rows = page.locator('.client-row')
  await expect(rows).toHaveCount(5)
  await page.locator('main').focus()
  await page.keyboard.press('ArrowUp')
  await expect(rows.last()).toBeFocused()
  await expect(rows.last()).toHaveAttribute('data-active', 'true')
  await page.keyboard.press('ArrowDown')
  await expect(rows.first()).toBeFocused()
  await page.keyboard.press('End')
  await expect(rows.last()).toBeFocused()
  await page.keyboard.press('Home')
  await expect(rows.first()).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(rows.nth(1)).toBeFocused()
  await page.keyboard.press('Shift+ArrowDown')
  await expect(rows.nth(1)).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(rows.nth(2)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/clientes\/hortec$/)
  await expect(page.locator('main h1')).toHaveAccessibleName('Hortec')
  await expect(page.locator('.client-website')).toContainText('Todavía no disponible')
  await expect(page.locator('.client-project-link')).toHaveCount(1)
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/clients\/hortec$/)
  await expect(page.locator('.client-description')).toContainText('organic fruit and vegetable')
  await page.getByRole('link', { name: 'Open Hortec Cooperativa', exact: true }).click()
  await expect(page).toHaveURL(/\/en\/projects\/hortec$/)
  await expect(page.locator('main h1')).toHaveAccessibleName('Hortec Cooperativa')
})

test('Enter desde el índice abre la selección y las estrellas respetan movimiento reducido', async ({ page }) => {
  await page.goto('/clientes')
  const star = () => page.locator('.clients-star').first().evaluate(element => {
    const style = getComputedStyle(element)
    return { name: style.animationName, iterations: style.animationIterationCount, transform: style.transform }
  })
  const scaleOf = (transform: string) => Number(transform.match(/matrix\(([-\d.]+)/)?.[1] ?? 0)
  await expect(page.locator('.clients-star')).toHaveCount(150)
  expect((await star()).name).toBe('none')
  expect(scaleOf((await star()).transform)).toBeGreaterThan(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect.poll(async () => (await star()).iterations).toBe('infinite')
  const firstTransform = (await star()).transform
  await expect.poll(async () => (await star()).transform).not.toBe(firstTransform)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect((await star()).name).toBe('none')
  expect(scaleOf((await star()).transform)).toBeGreaterThan(0)
  await page.locator('main').focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/clientes\/captotal$/)
})

test.describe('clientes sin JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const locale of ['es', 'en'] as const) {
    test(`directorio y ficha completos en ${locale}`, async ({ page }) => {
      const basePath = locale === 'es' ? '/clientes' : '/en/clients'
      await page.goto(basePath)
      await expect(page.locator('.client-row')).toHaveCount(5)
      await page.locator('.client-row').first().click()
      await expect(page).toHaveURL(new RegExp(`${basePath}/captotal$`))
      await expect(page.locator('main h1')).toHaveAccessibleName('CapTotal')
      await expect(page.locator('.client-description')).toContainText(locale === 'es' ? 'Formación vial' : 'Professional driver training')
      await expect(page.locator('.client-identity-logo')).toBeVisible()
      await expect(page.locator('.client-project-link').first()).toHaveAttribute('href', locale === 'es' ? '/proyectos/captotal' : '/en/projects/captotal')
      await expect(page.locator('.client-detail-toolbar a')).toHaveAttribute('href', basePath)
    })
  }
})


for (const width of [360, 1024, 1440]) {
  test(`solo la lista de clientes se desplaza en ${width}x600`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('/clientes')
    const list = page.locator('.clients-list')
    const intro = page.locator('.clients-intro')
    const before = await intro.boundingBox()
    await list.focus()
    await page.keyboard.press('PageDown')
    await expect.poll(() => list.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
    await page.keyboard.press('End')
    await expect(page.locator('.client-row').last()).toBeFocused()
    const bounds = await list.boundingBox()
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(600)
    expect(await intro.boundingBox()).toEqual(before)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight === innerHeight && document.documentElement.scrollWidth === innerWidth && scrollY === 0)).toBe(true)
    await page.keyboard.press('Home')
    await expect(page.locator('.client-row').first()).toBeFocused()
  })
}
