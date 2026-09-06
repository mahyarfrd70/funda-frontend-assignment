import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Badge from './index.vue'

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['neutral', 'success', 'danger'],
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

export const Neutral: Story = { args: { tone: 'neutral' } }
export const Success: Story = { args: { tone: 'success' } }
export const Danger: Story = { args: { tone: 'danger' } }

/** Every tone with its real-world label, matching how listings actually use them. */
export const AllTones: Story = {
  render: () => ({
    components: { Badge },
    template: `
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <Badge tone="danger">Verkocht</Badge>
        <Badge tone="success">Energielabel C</Badge>
        <Badge tone="neutral">Plattegrond</Badge>
      </div>
    `,
  }),
}
