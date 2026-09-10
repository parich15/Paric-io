import { expect, test } from './fixtures'

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 360, height: 740 },
  { width: 1280, height: 600 },
]) {
  for (const locale of ['es', 'en']) {
    test(`composición ${locale} ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport)
      const homePath = locale === 'es' ? '/' : '/en'
      const galleryPath = locale === 'es' ? '/proyectos' : '/en/projects'

      async function capture(name: string) {
        await page.evaluate(() => document.fonts.ready)
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
        await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: true, animations: 'disabled' })
      }

      await page.goto(homePath)
      await capture('home')
      await page.getByRole('button', { name: locale === 'es' ? 'Abrir menú' : 'Open menu', exact: true }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await capture('menu')
      await page.keyboard.press('Escape')
      await page.goto(galleryPath)
      await capture('professional')
      await page.goto(`${galleryPath}?category=personal&slug=kanji`)
      await expect(page.locator('main h1')).toHaveAccessibleName('Kanji Quest')
      await capture('personal')
      await page.goto(`${galleryPath}/nocturne`)
      await capture('detail')
    })
  }
}
