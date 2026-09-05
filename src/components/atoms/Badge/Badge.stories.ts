import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './index.vue'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['brand', 'neutral', 'success', 'warning', 'danger', 'info'],
    },
  },
  args: {
    tone: 'neutral',
  },
  render: (args) => ({
    components: { Badge },
    setup() {
      return { args }
    },
    template: '<Badge v-bind="args">Label</Badge>',
  }),
}
export default meta

type Story = StoryObj<typeof Badge>

export const Brand: Story = { args: { tone: 'brand' } }
export const Neutral: Story = { args: { tone: 'neutral' } }
export const Success: Story = { args: { tone: 'success' } }
export const Warning: Story = { args: { tone: 'warning' } }
export const Danger: Story = { args: { tone: 'danger' } }
export const Info: Story = { args: { tone: 'info' } }

/** Every tone with its real-world label, matching how listings actually use them. */
export const AllTones: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <Badge tone="brand">Nieuw</Badge>
        <Badge tone="success">Beschikbaar</Badge>
        <Badge tone="warning">Onder bod</Badge>
        <Badge tone="danger">Verkocht</Badge>
        <Badge tone="info">360°</Badge>
        <Badge tone="neutral">Video</Badge>
      </div>
    `,
  }),
}
