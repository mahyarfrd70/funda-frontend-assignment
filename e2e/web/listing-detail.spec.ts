import { expect, test, type Page } from '@playwright/test'

// load the detail page directly (full SSR) so the test doesn't depend on the
// results page having hydrated first
async function openFirstListing(page: Page): Promise<string> {
  await page.goto('/')
  const href = await page.locator('a:has(article)').first().getAttribute('href')
  expect(href).toMatch(/^\/listings\/[0-9a-f-]{36}$/)
  await page.goto(href!)
  return href!
}

test.describe('listing detail page', () => {
  test('shows the gallery, key facts and the location map', async ({ page }) => {
    await openFirstListing(page)

    const heading = page.getByRole('heading', { level: 1 })
    const address = (await heading.textContent())!.trim()
    await expect(page).toHaveTitle(new RegExp(address.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    await expect(page.getByText(/€\s?\d|op aanvraag/i).first()).toBeVisible()

    // gallery — the large image is a `_groot` file
    const hero = page.getByRole('img', { name: /foto 1 van \d+/i })
    await expect(hero).toBeVisible()
    await expect(hero).toHaveAttribute('src', /_groot\.jpg/)

    // key facts (its section heading is for screen readers only)
    await expect(page.getByRole('heading', { name: 'Kenmerken', exact: true })).toBeAttached()
    await expect(page.locator('dl').first()).toBeVisible()

    // map — client-only Leaflet (dynamic import in onMounted), tiles from OpenStreetMap
    const map = page.getByRole('application', { name: /kaart met de locatie/i })
    await expect(map).toBeVisible()
    await expect(map).toHaveClass(/leaflet-container/)
    await expect(map.locator('img.leaflet-tile').first()).toBeAttached({ timeout: 15_000 })
  })

  test('navigates the photo gallery with thumbnails and arrows', async ({ page }) => {
    await openFirstListing(page)

    const counter = page.getByText(/^\d+ \/ \d+$/)
    await expect(counter).toHaveText(/^1 \/ \d+$/)
    const total = Number((await counter.textContent())!.split('/')[1]!.trim())
    test.skip(total < 3, 'this listing has fewer than 3 photos')

    // jump to the 3rd photo via its thumbnail. Retry the click until it lands —
    // it's idempotent, so polling can't overshoot while the page finishes hydrating
    await expect(async () => {
      await page.getByRole('button', { name: 'Naar foto 3', exact: true }).click()
      await expect(counter).toHaveText(`3 / ${total}`, { timeout: 1000 })
    }).toPass()
    await expect(page.getByRole('img', { name: /foto 3 van \d+/i })).toBeVisible()

    // the arrows step relative to the current photo
    await page.getByRole('button', { name: 'Vorige foto' }).click()
    await expect(counter).toHaveText(`2 / ${total}`)
    await page.getByRole('button', { name: 'Volgende foto' }).click()
    await expect(counter).toHaveText(`3 / ${total}`)

    // stepping forward with the arrow keeps the matching thumbnail in view
    const steps = Math.min(total - 3, 6)
    for (let i = 0; i < steps; i++) {
      await page.getByRole('button', { name: 'Volgende foto' }).click()
    }
    await expect(counter).toHaveText(`${3 + steps} / ${total}`)
    await expect(page.locator('[aria-current="true"]')).toBeInViewport()
  })

  test('the back link returns to the results page', async ({ page }) => {
    await openFirstListing(page)

    await page.getByRole('link', { name: /terug naar het aanbod/i }).click()

    await expect(page).toHaveURL(/localhost:\d+\/$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Huizen te koop' })).toBeVisible()
  })

  test('responds with a 404 error page for an unknown listing', async ({ page }) => {
    const response = await page.goto('/listings/not-a-real-listing-id')

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: /niet meer beschikbaar/i })).toBeVisible()
  })
})
