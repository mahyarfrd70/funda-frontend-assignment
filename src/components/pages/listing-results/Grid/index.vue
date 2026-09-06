<script setup lang="ts">
import type { ListingSummary } from '#shared/types/listing'

defineProps<{ listings: ListingSummary[] }>()
</script>

<template>
  <div>
    <p class="text-sm text-foreground-muted">{{ listings.length }} woningen</p>
    <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="listing in listings" :key="listing.id">
        <NuxtLink
          :to="`/listings/${listing.id}`"
          class="block rounded-card focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          :prefetch="false"
        >
          <MoleculesListingCard :listing="listing" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
