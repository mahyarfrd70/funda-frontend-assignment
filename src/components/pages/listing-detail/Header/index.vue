<script setup lang="ts">
import type { ListingDetail } from '#shared/types/listing'

const { listing } = defineProps<{ listing: ListingDetail }>()

const status = computed(() =>
  listing.isSold
    ? { label: 'Verkocht', tone: 'danger' as const }
    : { label: 'Beschikbaar', tone: 'success' as const },
)
</script>

<template>
  <header>
    <p class="text-price font-semibold text-foreground">{{ listing.priceLabel }}</p>
    <h1 class="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">{{ listing.address }}</h1>
    <p class="text-foreground-muted">{{ listing.postcode }} {{ listing.city }}</p>
    <AtomsBadge :tone="status.tone" class="mt-2">{{ status.label }}</AtomsBadge>
  </header>
</template>
