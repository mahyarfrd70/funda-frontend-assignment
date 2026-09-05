<script setup lang="ts">
import { computed } from 'vue'
import type { ListingDetail } from '#shared/types/listing'

/**
 * Molecule: the key facts grid on the detail page. Pure presentation —
 * takes a normalized ListingDetail, shows the facts it actually has
 * (skips missing/zero values rather than rendering "0 m²" or "—").
 */
const { listing } = defineProps<{ listing: ListingDetail }>()

const facts = computed(() => {
  const rows: { label: string; value: string }[] = []
  if (listing.livingArea) rows.push({ label: 'Woonoppervlakte', value: `${listing.livingArea} m²` })
  if (listing.plotArea) rows.push({ label: 'Perceeloppervlakte', value: `${listing.plotArea} m²` })
  if (listing.rooms) rows.push({ label: 'Kamers', value: String(listing.rooms) })
  if (listing.bedrooms) rows.push({ label: 'Slaapkamers', value: String(listing.bedrooms) })
  if (listing.bathrooms) rows.push({ label: 'Badkamers', value: String(listing.bathrooms) })
  if (listing.yearBuilt) rows.push({ label: 'Bouwjaar', value: String(listing.yearBuilt) })
  if (listing.listedSince) rows.push({ label: 'Aangeboden sinds', value: listing.listedSince })
  if (listing.agent) rows.push({ label: 'Makelaar', value: listing.agent })
  return rows
})
</script>

<template>
  <dl class="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
    <div v-for="fact in facts" :key="fact.label">
      <dt class="text-sm text-foreground-muted">{{ fact.label }}</dt>
      <dd class="font-medium text-foreground">{{ fact.value }}</dd>
    </div>

    <div v-if="listing.energyLabel">
      <dt class="text-sm text-foreground-muted">Energielabel</dt>
      <dd class="mt-0.5">
        <AtomsBadge tone="success">{{ listing.energyLabel }}</AtomsBadge>
      </dd>
    </div>
  </dl>
</template>
