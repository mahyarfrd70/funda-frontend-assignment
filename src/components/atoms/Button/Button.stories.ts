import type { Meta, StoryObj } from '@storybook/vue3-vite'
import Button from './index.vue'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual style — all three are built from the same brand/surface tokens.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '`md` (44px tall) is the default — the minimum comfortable mobile touch target.',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args }
    },
    template: '<Button v-bind="args">Button</Button>',
  }),
}
export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }

/** All variants side by side — the quick visual reference. */
export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    `,
  }),
}
