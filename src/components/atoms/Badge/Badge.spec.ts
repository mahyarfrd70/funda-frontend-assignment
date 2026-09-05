import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import Badge from './index.vue'

describe('Badge', () => {
  it('renders its slot content', async () => {
    await renderSuspended(Badge, { slots: { default: () => 'Nieuw' } })

    expect(screen.getByText('Nieuw')).toBeInTheDocument()
  })

  it('defaults to the neutral tone', async () => {
    await renderSuspended(Badge, { slots: { default: () => 'Label' } })

    expect(screen.getByText('Label').className).toContain('bg-surface-muted')
  })

  it.each([
    ['brand', 'bg-brand-50'],
    ['success', 'bg-success/10'],
    ['warning', 'bg-warning/10'],
    ['danger', 'bg-danger/10'],
    ['info', 'bg-info/10'],
  ] as const)('applies the %s tone classes', async (tone, expectedClass) => {
    await renderSuspended(Badge, { props: { tone }, slots: { default: () => tone } })

    expect(screen.getByText(tone).className).toContain(expectedClass)
  })
})
