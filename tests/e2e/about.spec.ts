import { expect, test } from './fixtures'
import { skillGroups } from '../../app/data/about'

for (const width of [360, 1280]) {
  test(`sobre mí: scroll dentro de la biografía y el cajón en ${width}x600`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('/sobre-mi')
    const biography = page.locator('.about-biography')
    await biography.focus()
    await page.keyboard.press('PageDown')
    await expect.poll(() => biography.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
    if (width < 760) {
      await expect(page.locator('.about-skills-stage')).not.toBeVisible()
      await page.getByRole('button', { name: 'Ver stack' }).click()
    }
    const closedControls = await page.locator('.skill-spine').evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect()
      return { top: rect.top, bottom: rect.bottom, height: rect.height }
    }))
    expect(closedControls.every(rect => rect.height >= 44 && rect.top >= 0 && rect.bottom <= 600)).toBe(true)

    await page.locator('[data-skill-group="frontend"] summary').click()
    const content = page.locator('details[open] .skill-panel-content')
    await content.focus()
    await page.keyboard.press('End')
    await expect.poll(() => content.evaluate(element => element.scrollHeight <= element.clientHeight || element.scrollTop > 0)).toBe(true)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight === innerHeight && document.documentElement.scrollWidth === innerWidth && scrollY === 0)).toBe(true)
    await page.mouse.move(0, 0)
    await page.keyboard.press('Escape')
    await expect(page.locator('details[open]')).toHaveCount(0)
    await expect(page.locator('[data-skill-group="frontend"] summary')).toBeFocused()
  })
}

test('sobre mí: teclado, selección exclusiva y título persistente en inglés', async ({ page }) => {
  await page.goto('/en/about')
  const front = page.locator('[data-skill-group="frontend"] summary')
  const back = page.locator('[data-skill-group="backend"] summary')
  await front.focus()
  await page.keyboard.press('ArrowRight')
  await expect(back).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('details[open]')).toHaveAttribute('data-skill-group', 'backend')
  await expect(page.locator('main h1')).toHaveAccessibleName('About me')
  await page.keyboard.press('Control+Home')
  await expect(back).toBeFocused()
  await page.keyboard.press('End')
  await page.keyboard.press('Space')
  await expect(page.locator('details[open]')).toHaveCount(1)
  await expect(page.locator('details[open]')).toHaveAttribute('data-skill-group', 'misc')
  await expect(page.locator('.outline-misc')).toBeVisible()
  await expect(page.locator('[open] .skill-level').first()).toHaveAccessibleName('Git: Advanced proficiency')
})

test('sobre mí: el grupo abierto tiñe retrato, caja y barras; cerrar recupera el rojo', async ({ page }) => {
  await page.goto('/sobre-mi')
  for (const [group, color, foreground] of [
    ['frontend', 'rgb(230, 0, 18)', 'rgb(245, 245, 245)'],
    ['backend', 'rgb(0, 98, 235)', 'rgb(245, 245, 245)'],
    ['skills', 'rgb(0, 124, 61)', 'rgb(245, 245, 245)'],
    ['misc', 'rgb(255, 217, 0)', 'rgb(10, 10, 10)'],
  ]) {
    const trigger = page.locator(`[data-skill-group="${group}"] summary`)
    await trigger.click()
    await expect(trigger).toHaveCSS('background-color', color!)
    await expect(trigger).toHaveCSS('color', foreground!)
    await expect(page.locator('[open] .skill-segment-fill').first()).toHaveCSS('background-color', color!)
    await expect(page.locator('.about-full-portrait .portrait-color')).toHaveCSS('background-color', color!)
  }
  await page.locator('[data-skill-group="misc"] summary').click()
  await expect(page.locator('details[open]')).toHaveCount(0)
  await expect(page.locator('.about-full-portrait .portrait-color')).toHaveCSS('background-color', 'rgb(230, 0, 18)')
})

test.describe('sobre mí con movimiento', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('la selección es inmediata y permanece visible durante la expansión', async ({ page }) => {
    await page.goto('/sobre-mi')
    await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__)
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const samples = await page.evaluate(async () => {
      const frames: { open: boolean, opacity: string, lastItemOpacity: string }[] = []
      document.querySelector<HTMLElement>('[data-skill-group="frontend"] summary')!.click()
      const deadline = performance.now() + 600
      while (performance.now() < deadline) {
        frames.push({ open: !!document.querySelector('details[open]'), opacity: getComputedStyle(document.querySelector('.skill-panel-reveal')!).opacity, lastItemOpacity: getComputedStyle(document.querySelector('[open] .skill-item:last-child')!).opacity })
        await new Promise(requestAnimationFrame)
      }
      return frames
    })
    expect(samples.every(frame => frame.open && frame.opacity === '1')).toBe(true)
    expect(samples[0]!.lastItemOpacity).toBe('0')
    await expect(page.locator('.about-wipe')).toHaveCount(0)
    await expect(page.getByTestId('page-wipe')).not.toBeVisible()
    await expect(page.locator('[open] .skill-segment-fill').first()).toHaveCSS('transform', 'none')
    await expect(page.locator('[open] .skill-legend')).toBeVisible()
  })

  test('el vaivén solo funciona con todos los cajones cerrados', async ({ page }) => {
    await page.goto('/sobre-mi')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const panel = page.locator('.skill-panel').first()
    await expect(panel).toHaveCSS('animation-name', /about-panel-sway/)
    const initial = await panel.evaluate(element => getComputedStyle(element).transform)
    await expect.poll(() => panel.evaluate(element => getComputedStyle(element).transform)).not.toBe(initial)
    await page.locator('.skill-spine').first().press('Enter')
    for (const item of await page.locator('.skill-panel').all()) await expect(item).toHaveCSS('animation-name', 'none')
    await page.locator('.skill-spine').first().press('Enter')
    await expect(panel).toHaveCSS('animation-name', /about-panel-sway/)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(panel).toHaveCSS('animation-name', 'none')
  })

  test('las letras conservan su animación al cambiar de cajón', async ({ page }) => {
    await page.goto('/sobre-mi')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    await page.locator('[data-skill-group="frontend"] summary').press('Enter')
    const letter = page.locator('.outline-live .outline-letter').first()
    await expect.poll(() => letter.evaluate(element => Math.abs(new DOMMatrix(getComputedStyle(element).transform).m41))).toBeGreaterThan(1)
    const continuity = await page.evaluate(async () => {
      const first = document.querySelector('.outline-live .outline-letter')!
      const before = new DOMMatrix(getComputedStyle(first).transform).m41
      document.querySelector<HTMLElement>('[data-skill-group="backend"] summary')!.click()
      await Promise.resolve()
      const after = document.querySelector('.outline-live .outline-letter')!
      return { sameNode: first === after, text: after.textContent, before, after: new DOMMatrix(getComputedStyle(after).transform).m41 }
    })
    expect(continuity.sameNode).toBe(true)
    expect(continuity.text).toBe('B')
    expect(continuity.after).toBe(continuity.before)
    await page.locator('[data-skill-group="backend"] summary').press('Enter')
    const paused = await letter.evaluate(element => (element as HTMLElement).style.transform)
    await expect.poll(() => letter.evaluate(element => (element as HTMLElement).style.transform)).toBe(paused)
    await page.locator('[data-skill-group="frontend"] summary').press('Enter')
    await expect.poll(() => letter.evaluate(element => (element as HTMLElement).style.transform)).not.toBe(paused)
  })

  test('Escape durante apertura y selección rápida respetan la última intención', async ({ page }) => {
    await page.goto('/sobre-mi')
    await page.waitForFunction(() => !!(document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__)
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const front = page.locator('[data-skill-group="frontend"] summary')
    await front.press('Enter')
    await page.keyboard.press('Escape')
    await expect(page.locator('.about-wipe')).toHaveCount(0)
    await expect(page.locator('details[open]')).toHaveCount(0)
    await expect(front).toBeFocused()
    await page.evaluate(() => {
      document.querySelector<HTMLElement>('[data-skill-group="backend"] summary')!.click()
      document.querySelector<HTMLElement>('[data-skill-group="skills"] summary')!.click()
      document.querySelector<HTMLElement>('[data-skill-group="misc"] summary')!.click()
    })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator('details[open]')).toHaveAttribute('data-skill-group', 'misc')
    await expect(page.locator('.about-wipe')).toHaveCount(0)
    await expect(page.locator('[open] .skill-item').last()).toHaveCSS('opacity', '1')
    await expect(page.locator('.outline-misc .outline-letter').first()).toHaveCSS('transform', 'none')
    await expect(page.locator('.portrait-dots')).toHaveCSS('animation-name', 'none')
  })
})


test('cuadrículas editables, leyendas con teclado y hover de cada categoría', async ({ page }) => {
  await page.goto('/sobre-mi')
  for (const [index, group] of skillGroups.entries()) {
    const trigger = page.locator(`[data-skill-group="${group.id}"] summary`)
    await trigger.hover()
    await expect(trigger).toHaveCSS('background-color', ['rgb(230, 0, 18)', 'rgb(0, 98, 235)', 'rgb(0, 124, 61)', 'rgb(255, 217, 0)'][index]!)
    await expect(page.locator('.about-full-portrait .portrait-color')).toHaveCSS('background-color', 'rgb(230, 0, 18)')
    await trigger.click()
    const items = page.locator('[open] .skill-item')
    await expect(items).toHaveCount(18)
    for (const [skillIndex, skill] of group.skills.entries()) {
      await expect(items.nth(skillIndex).locator('.skill-segment')).toHaveCount(5)
      await expect(items.nth(skillIndex).locator('.skill-segment-fill')).toHaveCount(skill.fill)
    }
    const label = items.first().locator('button')
    const legend = page.locator('[open] .skill-legend')
    await expect(legend).toBeVisible()
    await expect(legend).toContainText(group.skills[0]!.description.es)
    await items.nth(1).locator('button').hover()
    await expect(legend).toContainText(group.skills[1]!.description.es)
    await expect(legend).toContainText('02 / 18')
    await label.focus()
    await expect(legend).toContainText(group.skills[0]!.description.es)
    await expect(label).toHaveAccessibleDescription(group.skills[0]!.description.es)
    await expect(page.locator('details[open]')).toHaveCount(1)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
    await expect(page.locator('details[open]')).toHaveCount(0)
  }
})


for (const locale of ['es', 'en']) {
  test(`stack móvil bajo demanda, retorno y cambio de tamaño: ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 600 })
    await page.goto(locale === 'es' ? '/sobre-mi' : '/en/about')
    const toggle = page.locator('button.mobile-stack-toggle')
    const stack = page.locator('#about-stack')
    await expect(stack).not.toBeVisible()
    await expect(page.locator('.about-biography')).toBeVisible()
    await expect(toggle).toHaveAccessibleName(locale === 'es' ? 'Ver stack' : 'View stack')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await toggle.focus()
    await page.keyboard.press('Enter')
    await expect(stack).toBeVisible()
    await expect(page.locator('.skill-spine').first()).toBeFocused()
    await expect(stack.getByRole('heading', { name: 'Stack', exact: true })).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page.locator('details[open]')).toHaveCount(1)
    await expect(page.locator('[open] .skill-item:visible')).toHaveCount(9)
    await page.getByRole('button', { name: locale === 'es' ? 'Ver más' : 'Show more', exact: true }).click()
    await expect(page.locator('[open] .skill-item:visible')).toHaveCount(18)
    await page.getByRole('button', { name: locale === 'es' ? 'Ver menos' : 'Show less', exact: true }).click()
    await expect(page.locator('[open] .skill-item:visible')).toHaveCount(9)
    await expect(page.locator('[open] .skill-panel-content')).toHaveCSS('scrollbar-width', 'none')
    await page.mouse.move(0, 0)
    await page.keyboard.press('Escape')
    await expect(stack).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(stack).not.toBeVisible()
    await expect(toggle).toBeFocused()
    await toggle.click()
    await page.locator('.skill-spine').last().click()
    await toggle.click()
    await expect(page.locator('.about-biography')).toBeVisible()
    await expect(page.locator('details[open]')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight === innerHeight && document.documentElement.scrollWidth === innerWidth && scrollY === 0)).toBe(true)
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(stack).toBeVisible()
    await expect(toggle).not.toBeVisible()
    await expect(page.locator('.skill-spine').first()).toBeFocused()
    await page.setViewportSize({ width: 360, height: 600 })
    await expect(stack).not.toBeVisible()
    await expect(toggle).toBeFocused()
  })
}

test('stack móvil accesible sin JavaScript', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 360, height: 600 } })
  await page.goto('/sobre-mi')
  await expect(page.locator('#about-stack')).not.toBeVisible()
  await page.getByRole('link', { name: 'Ver stack +' }).click()
  await expect(page.locator('#about-stack')).toBeVisible()
  await page.locator('.skill-spine').first().click()
  await expect(page.locator('[open] .skill-list')).toBeVisible()
  await page.getByRole('link', { name: 'Cerrar ×' }).click()
  await expect(page.locator('#about-stack')).not.toBeVisible()
  await expect(page.locator('.about-biography')).toBeVisible()
  await page.close()
})
