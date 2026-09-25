import { expect, test } from './fixtures'
import { projects } from '../../app/data/projects'

/** Fracción visible de la ruta roja según el trazo que escribe createDrawable. */
function drawnRoute(route: SVGPolylineElement) {
  const length = Number(route.getAttribute('pathLength'))
  const [dash] = (route.getAttribute('stroke-dasharray') ?? '0').split(' ').map(Number)
  return length ? dash! / length : 1
}

test.describe('obras con movimiento', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('la ruta se dibuja con el scroll y las paradas enlazan a los destacados', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('page-intro')).not.toBeVisible()
    const route = page.locator('polyline.map-route:not(.map-route--shadow)')
    await expect(route).toHaveAttribute('pathLength', /\d/)
    expect(await route.evaluate(drawnRoute)).toBeLessThan(.05)
    await page.locator('.featured-map').evaluate(map => map.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await expect.poll(() => route.evaluate(drawnRoute)).toBeGreaterThan(.95)

    const stops = page.locator('.featured-stops a')
    const featured = projects.filter(project => project.featured)
    await expect(stops).toHaveCount(featured.length)
    for (const [index, project] of featured.entries()) {
      await expect(stops.nth(index)).toHaveAttribute('href', `/proyectos/${project.slug}`)
    }
    await stops.nth(1).hover()
    await expect(page.locator('.map-stop').nth(1)).toHaveClass(/is-active/)
  })
})

test('con movimiento reducido la ruta ya está completa', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('polyline.map-route').first()).not.toHaveAttribute('pathLength', /./)
  await expect(page.getByRole('link', { name: /Todos los proyectos/ })).toHaveAttribute('href', '/proyectos')
})

test('la carta cambia de habilidad con las estrellas y con las flechas', async ({ page }) => {
  await page.goto('/')
  const abilities = page.getByRole('radiogroup', { name: 'Habilidades' })
  const panel = page.locator('.ability-panel:visible')
  await expect(abilities.getByRole('radio')).toHaveCount(6)
  await expect(panel).toHaveCount(1)
  await expect(panel).toContainText('Vue / Nuxt')
  await abilities.getByRole('radio', { name: 'Rango 3: TypeScript' }).check()
  await expect(panel).toContainText('TypeScript')
  await expect(panel.locator('.ability-rank-value')).toHaveText('3')
  await page.keyboard.press('ArrowRight')
  await expect(abilities.getByRole('radio', { name: 'Rango 4: Node.js' })).toBeChecked()
  await expect(panel).toContainText('Node.js')
})

test('las estrellas de la carta usan el cursor de acción, no el de texto', async ({ page }) => {
  await page.goto('/')
  await page.locator('.ability-star').nth(2).hover()
  await expect(page.locator('.p5-cursor')).toHaveClass(/p5-cursor--action/)
})

test.describe('sin JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('la carta y el plano funcionan en el HTML generado', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('polyline.map-route').first()).not.toHaveAttribute('pathLength', /./)
    const abilities = page.getByRole('radiogroup', { name: 'Abilities' })
    await abilities.getByRole('radio', { name: 'Rank 2: Angular' }).check()
    await expect(page.locator('.ability-panel:visible')).toContainText('Angular')
  })
})
