import { expect, test } from './fixtures'

test.describe('cursor de menú', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('el marco evita el menú rápido, vive bajo el wipe y se suelta al cambiar de vista', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const target = page.locator('.p5-target')
    const launcher = page.locator('.quick-launcher button')
    await launcher.hover()
    await expect(page.locator('.p5-cursor')).toBeVisible()
    await expect(target).not.toHaveClass(/is-on/)
    await launcher.click()
    await expect(page.locator('#quick-menu')).toBeVisible()
    await page.locator('.quick-link').first().hover()
    await expect(target).not.toHaveClass(/is-on/)
    await expect(page.locator('.p5-cursor')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('#quick-menu')).not.toBeVisible()

    const cta = page.getByRole('link', { name: 'Ver proyectos', exact: true })
    await cta.hover()
    await expect(target).toHaveClass(/is-on/)
    const layers = await page.evaluate(() => ({
      frame: Number(getComputedStyle(document.querySelector('.p5-target')!).zIndex),
      wipe: Number(getComputedStyle(document.querySelector('[data-testid="page-wipe"]')!).zIndex),
      header: Number(getComputedStyle(document.querySelector('.app-header')!).zIndex),
    }))
    expect(layers.frame).toBeLessThan(layers.wipe)
    expect(layers.frame).toBeGreaterThan(layers.header)
    await cta.click()
    await expect(page.getByTestId('page-wipe')).toBeVisible()
    await expect(page).toHaveURL(/\/proyectos$/)
    await expect(target).not.toHaveClass(/is-on/)
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()

    const card = page.locator('[data-project-card][aria-current="true"]')
    await card.hover()
    await expect(target).toHaveClass(/is-on/)
    await card.click()
    await expect(page.getByTestId('page-wipe')).toBeVisible()
    await expect(page).toHaveURL(/\/proyectos\/sites-builder/)
    await expect(target).not.toHaveClass(/is-on/)
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()
    await expect(target).not.toHaveClass(/is-on/)
  })
})

test.describe('actualizaciones del cursor', () => {
  test.use({ reducedMotion: 'reduce' })

  test('conserva la última posición de una ráfaga y no reaparece tras usar el teclado', async ({ page }) => {
    await page.goto('/contacto')
    const address = page.locator('.contact-address')
    const cursor = page.locator('.p5-cursor')
    await address.evaluate((element) => {
      for (let x = 100; x <= 200; x++) {
        element.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: x, clientY: 180 }))
      }
    })
    await expect(cursor).toBeVisible()
    await expect(cursor).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 200, 180)')
    await expect(page.locator('.p5-target')).toHaveClass(/is-on/)

    await address.evaluate((element) => {
      element.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: 300, clientY: 180 }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    })
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    await expect(cursor).not.toBeVisible()
    await expect(page.locator('html')).not.toHaveClass(/has-p5-cursor/)
  })

  test('el marco sigue scroll, resize y el color del tema sin perder el foco', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 600 })
    await page.goto('/contacto')
    const address = page.locator('.contact-address')
    await address.hover()
    const frame = page.locator('.p5-target')
    const expectFit = async () => {
      await expect.poll(() => address.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        const overlay = document.querySelector<HTMLElement>('.p5-target')!
        const [x, y] = overlay.style.translate.split(' ').map(Number.parseFloat)
        return Math.max(Math.abs(x! - (rect.x - 6)), Math.abs(y! - (rect.y - 6)), Math.abs(Number.parseFloat(overlay.style.width) - (rect.width + 12)), Math.abs(Number.parseFloat(overlay.style.height) - (rect.height + 12)))
      })).toBeLessThan(.1)
    }
    await expectFit()
    await page.evaluate(() => window.scrollBy(0, 90))
    await expectFit()
    await page.setViewportSize({ width: 1100, height: 650 })
    await expectFit()

    const originalColor = await frame.evaluate(element => getComputedStyle(element).color)
    await page.locator('main').evaluate(element => element.setAttribute('data-theme', 'light'))
    await address.hover()
    await expect.poll(async () => {
      // El tema cambia con transición; cada movimiento vuelve a leer su color actual.
      await address.dispatchEvent('pointermove', { pointerType: 'mouse', clientX: 100, clientY: 180 })
      const actual = await frame.evaluate(element => getComputedStyle(element).color)
      const expected = await address.evaluate(element => getComputedStyle(element).color)
      return actual === expected
    }).toBe(true)
    await expect(frame).not.toHaveCSS('color', originalColor)

    await page.keyboard.press('Tab')
    await expect(page.locator('.p5-cursor')).not.toBeVisible()
    await expect(page.locator(':focus-visible')).toBeFocused()
    await expect(frame).toHaveClass(/is-on/)
  })

  test('descarta el movimiento pendiente al navegar', async ({ page }) => {
    await page.goto('/contacto')
    await page.locator('.contact-address').hover()
    await page.getByRole('link', { name: 'Paric.io', exact: true }).evaluate((element) => {
      element.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: 30, clientY: 30 }))
      if (element instanceof HTMLAnchorElement) element.click()
    })
    await expect(page).toHaveURL('/#inicio')
    await expect(page.locator('.p5-target')).not.toHaveClass(/is-on/)
  })
})
