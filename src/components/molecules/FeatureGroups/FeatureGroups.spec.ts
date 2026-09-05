import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import type { FeatureGroup } from '#shared/types/listing'
import FeatureGroups from './index.vue'

const groups: FeatureGroup[] = [
  {
    title: 'Overdracht',
    items: [
      { label: 'Vraagprijs', value: '€ 700.000 kosten koper' },
      { label: 'Status', value: 'Beschikbaar' },
    ],
  },
  {
    title: 'Bouw',
    items: [{ label: 'Bouwjaar', value: '1963' }],
  },
]

describe('FeatureGroups', () => {
  it('renders each group as a titled section with its items', async () => {
    await renderSuspended(FeatureGroups, { props: { groups } })

    expect(screen.getByRole('heading', { name: 'Overdracht' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bouw' })).toBeInTheDocument()
    expect(screen.getByText('Vraagprijs')).toBeInTheDocument()
    expect(screen.getByText('€ 700.000 kosten koper')).toBeInTheDocument()
    expect(screen.getByText('Bouwjaar')).toBeInTheDocument()
  })

  it('renders nothing for an empty groups array', async () => {
    await renderSuspended(FeatureGroups, { props: { groups: [] } })

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
