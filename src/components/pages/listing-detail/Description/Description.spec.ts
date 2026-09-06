import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import Description from './index.vue'

describe('ListingDetailDescription', () => {
  it('renders the description text under an "Omschrijving" heading', async () => {
    await renderSuspended(Description, {
      props: { text: 'Een ruime hoekwoning met vrij uitzicht.' },
    })

    expect(screen.getByRole('heading', { name: 'Omschrijving' })).toBeInTheDocument()
    expect(screen.getByText('Een ruime hoekwoning met vrij uitzicht.')).toBeInTheDocument()
  })
})
