import { expect, test } from './fixtures'

const paths = { es: '/contacto', en: '/en/contact' } as const
const titles = { es: '¿Hablamos?', en: 'Let\'s talk' } as const

test('contacto se abre desde ambos menús, deja el foco en la vista y el menú lo marca como activo', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú rápido', exact: true }).click()
  await page.locator('#quick-menu').getByRole('link', { name: 'Contacto', exact: true }).click()
  await expect(page).toHaveURL('/contacto')
  await expect(page.locator('#main-content')).toBeFocused()
  await expect(page.locator('main h1')).toHaveAccessibleName('¿Hablamos?')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await expect(page.locator('#global-menu').getByRole('link', { name: 'Contacto', exact: true })).toBeFocused()
  await expect(page.locator('#global-menu .menu-option.is-active')).toHaveText('Contacto')
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: 'Paric.io', exact: true }).click()
  await expect(page).toHaveURL('/#inicio')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  await page.locator('#global-menu').getByRole('link', { name: 'Contacto', exact: true }).click()
  await expect(page).toHaveURL('/contacto')
  await expect(page.locator('#main-content')).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('el contador sella el campo activo y el cambio de idioma conserva la vista', async ({ page }) => {
  await page.goto('/contacto')
  const step = page.locator('.contact-step')
  await expect(step).toHaveText(/01\s*\/\s*03/)
  await page.getByLabel('Email', { exact: true }).focus()
  await expect(step).toHaveText(/02\s*\/\s*03/)
  await page.getByLabel('Mensaje', { exact: true }).focus()
  await expect(step).toHaveText(/03\s*\/\s*03/)
  await page.keyboard.press('Shift+Tab')
  await expect(step).toHaveText(/02\s*\/\s*03/)
  await page.getByRole('link', { name: 'EN', exact: true }).click()
  await expect(page).toHaveURL('/en/contact')
  await expect(page.locator('main h1')).toHaveAccessibleName(titles.en)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
  await page.getByRole('link', { name: 'ES', exact: true }).click()
  await expect(page).toHaveURL('/contacto')
})

test('el formulario redacta un mailto con el borrador y el sitio nunca envía nada', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => {
    if (request.method() === 'POST') requests.push(request.url())
  })
  await page.goto('/contacto')
  const address = page.locator('.contact-address')
  await expect(address).toHaveAttribute('href', 'mailto:oscar@paric.io')
  await page.getByLabel('Nombre', { exact: true }).fill('Persona de prueba')
  await page.getByLabel('Email', { exact: true }).fill('test@example.com')
  const message = page.getByLabel('Mensaje', { exact: true })
  await message.fill('Una interfaz con carácter')
  await message.press('Enter')
  await message.type('Segunda línea')
  const href = await address.getAttribute('href')
  const url = new URL(href!)
  expect(url.protocol).toBe('mailto:')
  expect(url.pathname).toBe('oscar@paric.io')
  expect(url.searchParams.get('subject')).toBe('Mensaje desde paric.io · Persona de prueba')
  expect(url.searchParams.get('body')).toBe('Una interfaz con carácter\r\nSegunda línea\r\n\r\nPersona de prueba\r\ntest@example.com')
  expect(href).toContain('%20')
  expect(href).not.toContain('+')
  const compose = page.getByRole('button', { name: 'Abrir en tu correo', exact: true })
  await expect(compose).toBeEnabled()
  await expect(page.locator('form')).toContainText('Nada se envía ni se guarda')
  await page.getByLabel('Nombre', { exact: true }).press('Enter')
  await compose.click()
  await expect(page).toHaveURL('/contacto')
  await expect(page.getByLabel('Mensaje', { exact: true })).toHaveValue(/Segunda línea/)
  expect(requests).toEqual([])
  await expect(page.getByText(/enviado|message sent/i)).toHaveCount(0)
})

for (const width of [360, 1024, 1280]) {
  test(`contacto sin desbordar ni pisar controles en ${width}x600`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('/contacto')
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const sheet = page.locator('.contact-sheet')
    await sheet.scrollIntoViewIfNeeded()
    const bounds = (await sheet.boundingBox())!
    expect(bounds.x).toBeGreaterThanOrEqual(0)
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width)
    const controls = await page.locator('.contact-sheet input, .contact-sheet textarea, .contact-actions a').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height))
    expect(controls.every(height => height >= 44)).toBe(true)
    const nameField = page.getByLabel('Nombre', { exact: true })
    await nameField.focus()
    await expect(nameField).toBeInViewport()
  })
}

test.describe('contacto sin JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const locale of ['es', 'en'] as const) {
    test(`HTML completo en ${locale}`, async ({ page }) => {
      const response = await page.goto(paths[locale])
      expect(response?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', locale === 'es' ? 'es-ES' : 'en-GB')
      await expect(page.locator('main h1')).toHaveAccessibleName(titles[locale])
      await expect(page.locator('main a[href="mailto:oscar@paric.io"]').first()).toBeVisible()
      await expect(page.locator('.contact-sheet input, .contact-sheet textarea')).toHaveCount(3)
      await expect(page.locator('form[action="mailto:oscar@paric.io"][method="post"][enctype="text/plain"]')).toHaveCount(1)
      for (const name of ['name', 'email', 'message']) await expect(page.locator(`form [name="${name}"]`)).toHaveCount(1)
      await expect(page.getByRole('button', { name: locale === 'es' ? 'Abrir en tu correo' : 'Open in your email app', exact: true })).toBeEnabled()
      await expect(page.locator(`link[rel="alternate"][hreflang="${locale === 'es' ? 'en-GB' : 'es-ES'}"]`)).toHaveAttribute('href', new RegExp(`${paths[locale === 'es' ? 'en' : 'es']}$`))
    })
  }
})

test.describe('contacto con movimiento', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('el wipe sella el destino y las entradas terminan visibles', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
    await page.locator('#global-menu').getByRole('link', { name: 'Contacto', exact: true }).click()
    const wipe = page.getByTestId('page-wipe')
    await expect(wipe).toBeVisible()
    await expect(wipe).toContainText('Contacto')
    await expect(page).toHaveURL('/contacto')
    await expect(wipe).not.toBeVisible()
    await expect(page.locator('#main-content')).toBeFocused()
    for (const selector of ['.contact-title', '.contact-copy', '.contact-sheet']) await expect(page.locator(selector)).toBeVisible()
    await expect.poll(() => page.locator('[data-motion]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '1'))).toBe(true)
    const stamp = page.locator('.contact-step')
    await page.getByLabel('Email', { exact: true }).focus()
    await expect(stamp).toHaveClass(/animate-stamp/)
    await expect(stamp).toHaveText(/02/)
  })
})
