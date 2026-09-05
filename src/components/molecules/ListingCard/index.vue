<script setup lang="ts">
// Vue composition APIs are imported explicitly (not via Nuxt auto-import),
// so this renders identically in Storybook — which has no auto-import.
import { computed } from 'vue'
import type { ListingSummary } from '#shared/types/listing'

/**
 * Molecule: one listing in the results grid. Pure presentation — takes a
 * normalized `ListingSummary` and renders it. It deliberately doesn't link
 * anywhere: the page wraps it in a `<NuxtLink>`, since route awareness is
 * an organism/page concern, not a molecule's.
 */
const { listing } = defineProps<{ listing: ListingSummary }>()

const features = computed(() => {
  const items: string[] = []
  if (listing.has360Tour) items.push('360°')
  if (listing.hasVideo) items.push('Video')
  if (listing.hasFloorPlan) items.push('Plattegrond')
  return items
})
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card transition-shadow hover:shadow-popover"
  >
    <div class="relative aspect-[4/3] bg-surface-muted">
      <img
        v-if="listing.thumbnail"
        :src="listing.thumbnail"
        :alt="listing.address"
        loading="lazy"
        class="h-full w-full object-cover"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-sm text-foreground-muted"
      >
        Geen foto
      </div>

      <span v-if="listing.isSold" class="absolute top-3 left-3">
        <AtomsBadge tone="danger">Verkocht</AtomsBadge>
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-1 p-4">
      <p class="text-price font-semibold text-foreground">{{ listing.priceLabel }}</p>
      <h2 class="font-medium text-foreground">{{ listing.address }}</h2>
      <p class="text-sm text-foreground-muted">{{ listing.postcode }} {{ listing.city }}</p>

      <p class="mt-2 text-sm text-foreground-muted">
        <span>{{ listing.rooms }} kamers</span>
        <span v-if="listing.livingArea"> · {{ listing.livingArea }} m² wonen</span>
        <span v-if="listing.plotArea"> · {{ listing.plotArea }} m² perceel</span>
      </p>

      <div v-if="features.length" class="mt-2 flex flex-wrap gap-1.5">
        <AtomsBadge v-for="feature in features" :key="feature" tone="neutral">
          {{ feature }}
        </AtomsBadge>
      </div>
    </div>
  </article>
</template>
