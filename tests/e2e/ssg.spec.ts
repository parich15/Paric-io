import { expect, test } from './fixtures'
import { projects } from '../../app/data/projects'
import { clients } from '../../app/data/clients'

test.use({ javaScriptEnabled: false })

for (const locale of ['es', 'en'] as const) {
  const homePath = locale === 'es' ? '/' : '/en'
  const galleryPath = locale === 'es' ? '/proyectos' : '/en/projects'

  test(`HTML completo sin JavaScript: ${locale}`, async ({ page }) => {
    await page.goto(homePath)
    await expect(page.locator('h1')).toContainText(/Oscar.*Paricio/i)
    await expect(page.locator('html')).toHaveAttribute('lang', locale === 'es' ? 'es-ES' : 'en-GB')
    await expect(page.locator('main a[href="mailto:oscar@oscarparic.io"]').first()).toBeVisible()
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(2)

    await page.goto(galleryPath)
    await expect(page.locator('main')).toContainText(/Hortec Cooperativa/i)
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

  test(`clientes y habilidades funcionan sin JavaScript: ${locale}`, async ({ page }) => {
    const clientsPath = locale === 'es' ? '/clientes' : '/en/clients'
    await page.goto(clientsPath)
    for (const client of clients) {
      await expect(page.locator(`a[href="${clientsPath}/${client.slug}"]`)).toBeVisible()
    }
    await page.locator(`a[href="${clientsPath}/captotal"]`).click()
    await expect(page.locator('main')).toContainText(clients[0]!.content[locale].description)
    await expect(page.locator(`a[href="${galleryPath}/captotal"]`)).toBeVisible()
    await page.goto(locale === 'es' ? '/sobre-mi' : '/en/about')
    const front = page.locator('[data-skill-group="frontend"]')
    const back = page.locator('[data-skill-group="backend"]')
    await front.locator('summary').click()
    await expect(front.locator('.skill-list')).toBeVisible()
    await back.locator('summary').click()
    await expect(back.locator('.skill-list')).toBeVisible()
    await expect(front).not.toHaveAttribute('open', '')
  })
}
