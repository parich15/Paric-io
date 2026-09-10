import { expect, test } from '@playwright/test'

test('menú modal: teclado nativo, Escape y restauración del foco', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Abrir menú', exact: true })
  await trigger.click()
  const menu = page.getByRole('dialog')
  await expect(menu).toBeVisible()
  await expect.poll(() => menu.evaluate(dialog => dialog.contains(document.activeElement))).toBe(true)
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab')
    await expect.poll(() => menu.evaluate(dialog => dialog.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(menu).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('contacto es una maqueta y los atajos no interceptan escritura', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => {
    if (request.method() === 'POST') requests.push(request.url())
  })
  await page.goto('/#contacto')
  await page.getByLabel('Nombre', { exact: true }).fill('Persona de prueba')
  await page.getByLabel('Email', { exact: true }).fill('test@example.com')
  const message = page.getByLabel('Mensaje', { exact: true })
  await message.fill('q: una interfaz con carácter')
  await message.press('ArrowLeft')
  await message.press('Enter')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Envío no disponible', exact: true })).toBeDisabled()
  await expect(page.locator('form')).toContainText('Formulario de maqueta')
  await expect(page.locator('a[href="mailto:oscar@paric.io"]').first()).toBeVisible()
  expect(requests).toEqual([])
  await expect(page.getByText(/enviado|message sent/i)).toHaveCount(0)
})
