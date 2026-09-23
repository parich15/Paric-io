import { expect, test } from './fixtures'

test.describe('secuencias con animación real', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('los fondos se mueven y se detienen al activar movimiento reducido', async ({ page }) => {
    async function checkLoop(selector: string, property: 'transform' | 'backgroundPosition', pseudo: '::before' | null = null) {
      const element = page.locator(selector)
      const read = (key: 'transform' | 'backgroundPosition' | 'animationDuration') => element.evaluate((target, options) => getComputedStyle(target, options.pseudo)[options.key], { key, pseudo })
      const initial = await read(property)
      await expect.poll(() => read(property)).not.toBe(initial)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expect.poll(() => read('animationDuration')).toBe('0s')
      const stopped = await read(property)
      await page.waitForTimeout(150)
      expect(await read(property)).toBe(stopped)
      await page.emulateMedia({ reducedMotion: 'no-preference' })
    }

    await page.goto('/')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await checkLoop('.hero-shape--circle svg', 'transform')
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await checkLoop('.menu-zigzag', 'transform', '::before')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await page.getByRole('button', { name: 'Abrir menú rápido', exact: true }).click()
    await checkLoop('.quick-ring', 'transform')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await page.goto('/proyectos')
    await checkLoop('.projects-zigzag', 'transform', '::before')
    await page.goto('/proyectos/hortec')
    await checkLoop('.detail-ring', 'transform')
  })

  test('intro una vez, navegación cubierta y vuelta sin overlays bloqueados', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-intro')).toBeVisible()
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click()
    await expect(page.getByTestId('page-wipe')).toBeVisible()
    await expect(page).toHaveURL(/\/proyectos$/)
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()
    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('activar movimiento reducido durante el wipe libera la navegación', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click()
    await expect(page.getByTestId('page-wipe')).toBeVisible()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page).toHaveURL(/\/proyectos$/)
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('una navegación interrumpida deja el foco en el último destino', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await page.getByRole('link', { name: 'Hablemos', exact: true }).click()
    await expect(page.getByTestId('page-wipe')).toBeVisible()
    await page.getByRole('link', { name: 'Paric.io', exact: true }).click()
    await expect(page).toHaveURL('/#inicio')
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()
    await expect(page.locator('#inicio')).toBeFocused()
  })
})

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test.describe(`foco del destino con movimiento ${reducedMotion}`, () => {
    test.use({ reducedMotion })

    test('contacto y sobre mí mantienen el foco sin entrar en el orden de Tab', async ({ page }) => {
      await page.goto('/')
      await expect(page.getByTestId('page-intro')).not.toBeVisible()
      await page.getByRole('link', { name: 'Hablemos', exact: true }).click()
      await expect(page.getByTestId('page-wipe')).not.toBeVisible()
      await expect(page.locator('#contacto')).toBeFocused()
      await page.keyboard.press('Tab')
      await expect(page.getByRole('link', { name: 'Escríbeme por correo', exact: true })).toBeFocused()
      await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
      await page.getByRole('dialog').getByRole('link', { name: 'Sobre mí', exact: true }).click()
      await expect(page.getByTestId('page-wipe')).not.toBeVisible()
      await expect(page).toHaveURL('/sobre-mi')
      await expect(page.locator('#main-content')).toBeFocused()
    })

    test('volver de un detalle enfoca la tarjeta seleccionada', async ({ page }) => {
      await page.goto('/proyectos?category=personal&slug=moof')
      await page.getByRole('link', { name: 'Abrir Moof Fisioterapia', exact: true }).click()
      await expect(page).toHaveURL(/\/proyectos\/moof\?/)
      await expect(page.getByTestId('page-wipe')).not.toBeVisible()
      await page.keyboard.press('Escape')
      await expect(page).toHaveURL(/\/proyectos\?/)
      await expect(page.getByTestId('page-wipe')).not.toBeVisible()
      await expect(page.getByRole('link', { name: 'Abrir Moof Fisioterapia', exact: true })).toBeFocused()
    })
  })
}

test('movimiento reducido omite intro y transiciones', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('page-intro')).not.toBeVisible()
  await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click()
  await expect(page).toHaveURL(/\/proyectos$/)
  await expect(page.getByTestId('page-wipe')).not.toBeVisible()
})
