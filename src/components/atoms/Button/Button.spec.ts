import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import Button from './index.vue'

describe('Button', () => {
  it('renders its slot content as a real <button>', async () => {
    await renderSuspended(Button, { slots: { default: () => 'Click me' } })

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('defaults to the primary variant and md size', async () => {
    await renderSuspended(Button)

    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-brand-600') // primary
    expect(button.className).toContain('h-11') // md
  })

  it('applies the secondary variant classes when asked', async () => {
    await renderSuspended(Button, { props: { variant: 'secondary' } })

    const button = screen.getByRole('button')
    expect(button.className).toContain('border-brand-200')
    expect(button.className).not.toContain('bg-brand-600')
  })

  it('applies size classes for sm and lg', async () => {
    const { unmount } = await renderSuspended(Button, { props: { size: 'sm' } })
    expect(screen.getByRole('button').className).toContain('h-9')
    unmount()

    await renderSuspended(Button, { props: { size: 'lg' } })
    expect(screen.getByRole('button').className).toContain('h-12')
  })

  it('forwards native attributes via Vue attribute fallthrough', async () => {
    await renderSuspended(Button, { attrs: { disabled: true, type: 'submit' } })

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('type', 'submit')
  })
})
