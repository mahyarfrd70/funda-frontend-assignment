import { expect, test } from '@playwright/test'

// the <a> that wraps each ListingCard's <article>
const cards = 'a:has(article)'

test.describe('listing results page', () => {
  test('renders the heading, a result count and listing cards', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Woningaanbod/)
    await expect(page.getByRole('heading', { level: 1, name: 'Huizen te koop' })).toBeVisible()
    await expect(page.getByText(/\d+ woningen/)).toBeVisible()

    const first = page.locator(cards).first()
    await expect(first).toBeVisible()
    expect(await page.locator(cards).count()).toBeGreaterThan(0)

    // each card carries a price, an address heading and an availability badge
    await expect(first.getByText(/€|aanvraag/i)).toBeVisible()
    await expect(first.getByRole('heading')).toBeVisible()
    await expect(first.getByText(/beschikbaar|verkocht/i)).toBeVisible()
  })

  test('server-renders the listings into the initial HTML', async ({ request }) => {
    const html = await (await request.get('/')).text()

    expect(html).toContain('Huizen te koop')
    expect(html).toMatch(/<html[^>]*\blang="nl"/)
    expect(html).toMatch(/\d+ woningen/)
    // a fully formed card, present before any client-side hydration
    expect(html).toContain('<article')
    expect(html).toMatch(/\/listings\/[0-9a-f-]{36}/)
  })

  test('opens a listing when its card is clicked', async ({ page }) => {
    await page.goto('/')

    const first = page.locator(cards).first()
    const address = (await first.getByRole('heading').textContent())!.trim()
    await first.click()

    await expect(page).toHaveURL(/\/listings\/[0-9a-f-]{36}$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(address)
  })
})
