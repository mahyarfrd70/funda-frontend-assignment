import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import AboutIntro from './index.vue'

describe('AboutIntro', () => {
  it('renders the page heading', async () => {
    await renderSuspended(AboutIntro)

    expect(
      screen.getByRole('heading', { level: 1, name: /about this project/i }),
    ).toBeInTheDocument()
  })

  it('renders the auto-imported atoms (badge + button) correctly', async () => {
    await renderSuspended(AboutIntro)

    expect(screen.getByText('Page component')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back home/i })).toHaveAttribute('href', '/')
  })
})
