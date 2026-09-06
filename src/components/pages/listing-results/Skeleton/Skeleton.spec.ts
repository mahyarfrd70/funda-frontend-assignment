import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import Skeleton from './index.vue'

describe('ListingResultsSkeleton', () => {
  it('renders six placeholder tiles', async () => {
    const { container } = await renderSuspended(Skeleton)

    expect(container.querySelectorAll('li')).toHaveLength(6)
  })
})
