import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErrorState from './index.vue'

describe('ListingResultsErrorState', () => {
  it('explains the failure and emits retry when the button is pressed', async () => {
    const wrapper = await mountSuspended(ErrorState)

    expect(wrapper.text()).toContain('Kon het woningaanbod niet laden.')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
