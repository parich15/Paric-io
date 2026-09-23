import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('un detalle inexistente durante la navegación muestra la 404 y permite recuperarse', async ({ page }) => {
  for (const section of ['proyectos', 'clientes']) {
    await page.goto(`/${section}/hortec`)
    await page.waitForLoadState('networkidle')
    await page.evaluate((path) => {
      const root = document.querySelector('#__nuxt') as Element & {
        __vue_app__: { config: { globalProperties: { $router: { push: (path: string) => Promise<void> } } } }
      }
      return root.__vue_app__.config.globalProperties.$router.push(path)
    }, `/${section}/no-existe`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('No encontrado')
    await expect(page).toHaveURL(`/${section}/no-existe`)
    await page.getByRole('link', { name: 'Volver al inicio', exact: true }).click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toHaveAccessibleName('Oscar Paricio')
  }
})

for (const locale of ['es', 'en'] as const) {
  for (const javaScriptEnabled of [false, true]) {
    test.describe(`404 ${locale}, JavaScript ${javaScriptEnabled}`, () => {
      test.use({ javaScriptEnabled, viewport: { width: 360, height: 600 } })

      test('el fallback estático mantiene el idioma y permite volver al inicio', async ({ page }, testInfo) => {
        const prefix = locale === 'en' ? '/en' : ''
        const missing = `${prefix}/pagina-inexistente`
        const errors: string[] = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('console', message => { if (/hydration|mismatch/i.test(message.text())) errors.push(message.text()) })
        // Reproduce la entrega del hosting: conserva la URL solicitada y responde con HTTP 404.
        const body = await readFile(`.output/public${prefix}/404.html`, 'utf8')
        await page.route(`**${missing}`, route => route.fulfill({ status: 404, contentType: 'text/html', body }))
        const response = await page.goto(missing)
        expect(response?.status()).toBe(404)
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(missing)
        await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(locale === 'en' ? 'Not found' : 'No encontrado')
        await expect(page.locator('html')).toHaveAttribute('lang', locale === 'en' ? 'en-GB' : 'es-ES')
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
        const back = page.getByRole('link', { name: locale === 'en' ? 'Back to home' : 'Volver al inicio', exact: true })
        await expect(back).toHaveAttribute('href', prefix || '/')
        await expect(back).toBeInViewport()
        await page.keyboard.press('Tab')
        await expect(back).toBeFocused()
        await page.evaluate(() => document.fonts.ready)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.screenshot({ path: testInfo.outputPath('404-mobile.png'), animations: 'disabled' })
        await page.keyboard.press('Enter')
        await expect(page).toHaveURL(prefix || '/')
        await expect(page.locator('h1')).toHaveAccessibleName('Oscar Paricio')
        expect(errors).toEqual([])
      })
    })
  }
}
