<script setup lang="ts">
/**
 * Listing results — the app's home page.
 *
 * Data is fetched with `useFetch('/api/listings')` (the Nitro proxy — the
 * Funda key never reaches the browser). On the first load this runs during
 * SSR, so the HTML already contains the full list; on a later client-side
 * visit it fetches from our own origin (no CORS, still no key exposure).
 */
const { data: listings, status, error, refresh } = await useFetch('/api/listings')

useSeoMeta({
  title: 'Woningaanbod — huizen te koop',
  description: 'Actuele koopwoningen, opgehaald via de Funda Partner API.',
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-gutter py-section sm:px-8 lg:px-12">
    <h1 class="text-2xl font-semibold text-foreground sm:text-3xl">Huizen te koop</h1>

    <div v-if="error" class="mt-8 rounded-card border border-border bg-surface p-6 shadow-card">
      <p class="font-medium text-foreground">Kon het woningaanbod niet laden.</p>
      <p class="mt-1 text-sm text-foreground-muted">Probeer het later opnieuw.</p>
      <AtomsButton class="mt-4" variant="secondary" @click="refresh()"
        >Opnieuw proberen</AtomsButton
      >
    </div>

    <!-- Only ever seen on a client-side refetch — SSR delivers data with the HTML. -->
    <ul
      v-else-if="status === 'pending'"
      class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="n in 6"
        :key="n"
        class="aspect-[4/3] animate-pulse rounded-card bg-surface-muted"
      />
    </ul>

    <p v-else-if="!listings?.length" class="mt-8 text-foreground-muted">
      Er zijn op dit moment geen woningen beschikbaar.
    </p>

    <template v-else>
      <p class="mt-1 text-sm text-foreground-muted">{{ listings.length }} woningen</p>
      <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="listing in listings" :key="listing.id">
          <NuxtLink
            :to="`/listings/${listing.id}`"
            class="block rounded-card focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <MoleculesListingCard :listing="listing" />
          </NuxtLink>
        </li>
      </ul>
    </template>
  </div>
</template>
