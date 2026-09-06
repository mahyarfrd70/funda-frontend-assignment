<script setup lang="ts">
// fetched via the Nitro proxy so the Funda key stays server-side
const { data: listings, status, error, refresh } = await useFetch('/api/listings')

useSeoMeta({
  title: 'Woningaanbod — huizen te koop',
  description: 'Actuele koopwoningen, opgehaald via de Funda Partner API.',
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-gutter py-section sm:px-8 lg:px-12">
    <h1 class="text-2xl font-semibold text-foreground sm:text-3xl">Huizen te koop</h1>

    <ListingResultsErrorState v-if="error" class="mt-8" @retry="refresh()" />
    <ListingResultsSkeleton v-else-if="status === 'pending'" class="mt-8" />
    <p v-else-if="!listings?.length" class="mt-8 text-foreground-muted">
      Er zijn op dit moment geen woningen beschikbaar.
    </p>
    <ListingResultsGrid v-else :listings="listings" class="mt-1" />
  </div>
</template>
