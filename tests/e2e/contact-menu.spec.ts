import { expect, test } from './fixtures'

test('Clientes se abre desde el menú principal y Sobre mí también desde el rápido', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menú rápido', exact: true }).click()
  const quick = page.locator('#quick-menu')
  await expect(quick.getByRole('link', { name: 'Clientes', exact: true })).toHaveCount(0)
  await quick.getByRole('link', { name: 'Sobre mí', exact: true }).click()
  await expect(page).toHaveURL('/sobre-mi')
  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click()
  const menu = page.locator('#global-menu')
  await expect(menu.getByRole('link', { name: 'Sobre mí', exact: true })).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(menu.getByRole('link', { name: 'Clientes', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/clientes')
  await expect(page.locator('#main-content')).toBeFocused()
})

test.describe('animaciones de los menús', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('la topbar conserva el mismo botón visible durante el telón', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__)
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const result = await page.locator('.header-toggle').evaluate(async (button) => {
      const control = button as HTMLButtonElement
      control.focus()
      control.click()
      const visible: boolean[] = []
      for (let frame = 0; frame < 30; frame++) {
        await new Promise(requestAnimationFrame)
        const controls = [button, ...document.querySelectorAll('#menu-header-actions a')]
        visible.push(controls.every(control => {
          const rect = control.getBoundingClientRect()
          return control.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2))
        }))
      }
      return { visible, sameButton: button === document.querySelector('#menu-header-actions .header-toggle') }
    })
    expect(result.sameButton).toBe(true)
    expect(result.visible.every(Boolean)).toBe(true)
    await page.getByRole('button', { name: 'Cerrar menú', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Abrir menú', exact: true })).toBeFocused()
  })

  test('las opciones parten ocultas y entran escalonadas después de la etiqueta', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__)
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const frames = await page.evaluate(async () => {
      const opacity = (el: Element) => Number(getComputedStyle(el).opacity)
      document.querySelector<HTMLButtonElement>('.quick-launcher button')!.click()
      const samples: { options: number[], ring: number, hint: number }[] = []
      const deadline = performance.now() + 1000
      while (performance.now() < deadline) {
        samples.push({
          options: [...document.querySelectorAll('.quick-menu li')].map(opacity),
          ring: opacity(document.querySelector('.quick-ring')!),
          hint: opacity(document.querySelector('.quick-hint')!),
        })
        await new Promise(requestAnimationFrame)
      }
      return samples
    })
    expect(frames[0]!.options.every(value => value === 0)).toBe(true)
    expect(frames[0]!.ring).toBe(0)
    expect(frames.filter(frame => frame.hint > 0).every(frame => frame.options.every(value => value === 0))).toBe(true)
    expect(frames.some(frame => frame.options[0]! > 0 && frame.options[3] === 0)).toBe(true)
    expect(frames.at(-1)!.options.every(value => value === 1)).toBe(true)
  })

  test('el cierre es breve y después recupera la etiqueta', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__)
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const trigger = page.locator('.quick-launcher button')
    await trigger.click()
    await expect(page.locator('.quick-menu li').last()).toHaveCSS('opacity', '1')
    const duration = await page.evaluate(async () => {
      const start = performance.now()
      document.querySelector<HTMLButtonElement>('.quick-close')!.click()
      while (document.querySelector<HTMLDialogElement>('#quick-menu')!.open && performance.now() - start < 1000) await new Promise(requestAnimationFrame)
      return performance.now() - start
    })
    expect(duration).toBeGreaterThan(80)
    expect(duration).toBeLessThan(300)
    await expect(trigger).toBeFocused()
    await expect(page.locator('.quick-hint')).toHaveCSS('opacity', '1')
  })

  test('cerrar durante la entrada y activar movimiento reducido no bloquea el menú', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__)
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const trigger = page.locator('.quick-launcher button')
    await trigger.click()
    await expect(page.locator('#quick-menu')).toBeVisible()
    await page.keyboard.press('q')
    await expect(page.locator('#quick-menu')).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await page.keyboard.press('Escape')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('#quick-menu')).not.toBeVisible()
    await expect(page.locator('.quick-hint')).toHaveCSS('opacity', '1')
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })
})

for (const locale of ['es', 'en']) {
  test(`menú rápido ${locale}: Q, Escape y navegación`, async ({ page }) => {
    await page.goto(locale === 'es' ? '/' : '/en')
    const trigger = page.getByRole('button', { name: locale === 'es' ? 'Abrir menú rápido' : 'Open quick menu', exact: true })
    const menu = page.getByRole('dialog', { name: locale === 'es' ? 'Menú rápido' : 'Quick menu', exact: true })
    await trigger.focus()
    await page.keyboard.press('q')
    await expect(menu).toBeVisible()
    await expect.poll(() => menu.evaluate(dialog => dialog.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(menu).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await trigger.click()
    await menu.getByRole('link', { name: locale === 'es' ? 'Proyectos' : 'Projects', exact: true }).click()
    await expect(page).toHaveURL(locale === 'es' ? /\/proyectos$/ : /\/en\/projects$/)
    await expect(page.locator('main h1')).toHaveAccessibleName('Sites Builder')
    await expect(page.getByRole('dialog')).not.toBeVisible()
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })
}

test('el menú rápido permite scroll vertical sin desbordar en horizontal', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => { document.body.style.overflow = 'auto' })
  await page.getByRole('button', { name: 'Abrir menú rápido', exact: true }).click()
  const position = await page.evaluate(() => window.scrollY)
  await page.mouse.move(200, 300)
  await page.mouse.wheel(0, 500)
  await page.waitForTimeout(200)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(position)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.locator('body')).toHaveCSS('overflow', 'auto')
  await page.mouse.wheel(0, 500)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(position)
})

test('menú modal: teclado nativo, Escape y restauración del foco', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Abrir menú', exact: true })
  await trigger.click()
  const menu = page.getByRole('dialog')
  await expect(menu).toBeVisible()
  await expect.poll(() => menu.evaluate(dialog => dialog.contains(document.activeElement))).toBe(true)
  for (let index = 0; index < 12; index++) {
    await page.keyboard.press('Tab')
    await expect.poll(() => menu.evaluate(dialog => dialog.contains(document.activeElement) || (!document.hasFocus() && document.activeElement === document.body))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(menu).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('el contacto del inicio redacta el mailto con el borrador y los atajos no interceptan escritura', async ({ page }) => {
  const requests: string[] = []
  page.on('request', request => {
    if (request.method() === 'POST') requests.push(request.url())
  })
  await page.goto('/#contacto')
  const write = page.getByRole('link', { name: 'Escríbeme por correo', exact: true })
  await expect(write).toHaveAttribute('href', 'mailto:oscar@oscarparic.io')
  await page.getByLabel('Nombre', { exact: true }).fill('Persona de prueba')
  await page.getByLabel('Email', { exact: true }).fill('test@example.com')
  const message = page.getByLabel('Mensaje', { exact: true })
  await message.fill('q: una interfaz con carácter')
  await message.press('ArrowLeft')
  await message.press('Enter')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  const url = new URL((await write.getAttribute('href'))!)
  expect(url.searchParams.get('subject')).toBe('Mensaje desde oscarparic.io · Persona de prueba')
  expect(url.searchParams.get('body')).toContain('q: una interfaz con carácte\r\nr\r\n\r\nPersona de prueba\r\ntest@example.com')
  await expect(page.locator('.contact-email')).toHaveAttribute('href', url.href)
  await expect(page.getByRole('button', { name: 'Abrir en tu correo', exact: true })).toBeEnabled()
  await expect(page.locator('form')).toContainText('Nada se envía ni se guarda')
  expect(requests).toEqual([])
  await expect(page.getByText(/enviado|message sent/i)).toHaveCount(0)
})
