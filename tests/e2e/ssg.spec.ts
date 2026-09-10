import { expect, test } from './fixtures'
import { projects } from '../../app/data/projects'

test.use({ javaScriptEnabled: false })

for (const locale of ['es', 'en'] as const) {
  const homePath = locale === 'es' ? '/' : '/en'
  const galleryPath = locale === 'es' ? '/proyectos' : '/en/projects'

  test(`HTML completo sin JavaScript: ${locale}`, async ({ page }) => {
    await page.goto(homePath)
    await expect(page.locator('h1')).toContainText(/Oscar.*Paricio/i)
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'es' ? 'es-ES' : 'en-GB')
    await expect(page.locator('main a[href="mailto:oscar@paric.io"]').first()).toBeVisible()
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(2)

    await page.goto(galleryPath)
    await expect(page.locator('main')).toContainText(/Nocturne Studio/i)
    for (const project of projects) {
      const response = await page.goto(`${galleryPath}/${project.slug}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toContainText(new RegExp(project.title, 'i'))
      await expect(page.locator('main')).toContainText(project.content[locale].description)
      await expect(page.locator('main')).toContainText(project.content[locale].challenge)
      await expect(page.locator('main')).toContainText(project.content[locale].solution)
      await expect(page.locator('html')).toHaveAttribute('lang', locale === 'es' ? 'es-ES' : 'en-GB')
      const alternate = page.locator(`link[rel="alternate"][hreflang="${locale === 'es' ? 'en-GB' : 'es-ES'}"]`)
      await expect(alternate).toHaveAttribute('href', new RegExp(project.slug))
    }
  })
}
