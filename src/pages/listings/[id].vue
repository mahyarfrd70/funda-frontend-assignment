<script setup lang="ts">
/**
 * Listing detail. Data is fetched server-side via the Nitro proxy
 * (`/api/listings/:id`) — the Funda key never reaches the browser, and the
 * SSR HTML already contains the facts, description and (LCP) main photo.
 *
 * A sold/removed listing comes back as a 404 from the route; we re-throw it
 * as a fatal error so Nuxt renders the error page with the right status.
 */
const route = useRoute()
const id = String(route.params.id)

const { data: listing, error } = await useFetch(`/api/listings/${id}`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage:
      error.value.statusCode === 404
        ? 'Deze woning is niet meer beschikbaar'
        : 'De woning kon niet worden geladen',
    fatal: true,
  })
}

useSeoMeta({
  title: () => (listing.value ? `${listing.value.address}, ${listing.value.city}` : 'Woning'),
  description: () => (listing.value ? listing.value.description.slice(0, 160) : ''),
  ogImage: () => listing.value?.photos[0],
})
</script>

<template>
  <article v-if="listing" class="mx-auto max-w-5xl px-gutter py-section sm:px-8 lg:px-12">
    <NuxtLink to="/" class="text-sm text-foreground-muted hover:text-foreground">
      ← Terug naar het aanbod
    </NuxtLink>

    <MoleculesPhotoGallery :photos="listing.photos" :alt="listing.address" class="mt-4" />

    <header class="mt-6">
      <p class="text-price font-semibold text-foreground">{{ listing.priceLabel }}</p>
      <h1 class="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">{{ listing.address }}</h1>
      <p class="text-foreground-muted">{{ listing.postcode }} {{ listing.city }}</p>
      <AtomsBadge v-if="listing.isSold" tone="danger" class="mt-2">Verkocht</AtomsBadge>
    </header>

    <section class="mt-8">
      <h2 class="sr-only">Kenmerken</h2>
      <MoleculesKeyFacts :listing="listing" />
    </section>

    <section v-if="listing.description" class="mt-8">
      <h2 class="font-semibold text-foreground">Omschrijving</h2>
      <p class="mt-2 whitespace-pre-line text-foreground-muted">{{ listing.description }}</p>
    </section>

    <section v-if="listing.features.length" class="mt-8">
      <h2 class="font-semibold text-foreground">Alle kenmerken</h2>
      <MoleculesFeatureGroups :groups="listing.features" class="mt-4" />
    </section>

    <section class="mt-8">
      <h2 class="font-semibold text-foreground">Locatie</h2>
      <ClientOnly>
        <MoleculesPropertyMap
          :coordinates="listing.coordinates"
          :label="listing.address"
          class="mt-4"
        />
        <template #fallback>
          <div class="mt-4 h-64 animate-pulse rounded-card bg-surface-muted sm:h-80" />
        </template>
      </ClientOnly>
    </section>
  </article>
</template>
