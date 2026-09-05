import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { FeatureGroup } from '#shared/types/listing'
import FeatureGroups from './index.vue'

const groups: FeatureGroup[] = [
  {
    title: 'Overdracht',
    items: [
      { label: 'Vraagprijs', value: '€ 700.000 kosten koper' },
      { label: 'Aangeboden sinds', value: '4 maanden' },
      { label: 'Status', value: 'Beschikbaar' },
    ],
  },
  {
    title: 'Bouw',
    items: [
      { label: 'Soort woonhuis', value: 'Herenhuis, geschakelde 2-onder-1-kapwoning' },
      { label: 'Bouwjaar', value: '1963' },
      { label: 'Soort dak', value: 'Plat dak bedekt met bitumineuze dakbedekking' },
    ],
  },
  {
    title: 'Oppervlakten en inhoud',
    items: [
      { label: 'Wonen', value: '151 m²' },
      { label: 'Perceel', value: '303 m²' },
      { label: 'Inhoud', value: '638 m³' },
    ],
  },
]

const meta: Meta<typeof FeatureGroups> = {
  title: 'Molecules/FeatureGroups',
  component: FeatureGroups,
  tags: ['autodocs'],
  args: { groups },
  decorators: [() => ({ template: '<div style="max-width: 40rem"><story /></div>' })],
}
export default meta

type Story = StoryObj<typeof FeatureGroups>

export const Default: Story = {}
