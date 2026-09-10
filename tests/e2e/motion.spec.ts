import { expect, test } from './fixtures'

test.describe('secuencias con animación real', () => {
  test.use({ reducedMotion: 'no-preference' })

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
})

test('movimiento reducido omite intro y transiciones', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('page-intro')).not.toBeVisible()
  await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click()
  await expect(page).toHaveURL(/\/proyectos$/)
  await expect(page.getByTestId('page-wipe')).not.toBeVisible()
})
