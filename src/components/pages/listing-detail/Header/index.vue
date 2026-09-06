<script setup lang="ts">
import type { ListingDetail } from '#shared/types/listing'

defineProps<{ listing: ListingDetail }>()
</script>

<template>
  <header>
    <p class="text-price font-semibold text-foreground">{{ listing.priceLabel }}</p>
    <h1 class="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">{{ listing.address }}</h1>
    <p class="text-foreground-muted">{{ listing.postcode }} {{ listing.city }}</p>
    <AtomsBadge v-if="listing.isSold" tone="danger" class="mt-2">Verkocht</AtomsBadge>
  </header>
</template>
