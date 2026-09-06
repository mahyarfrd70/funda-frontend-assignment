<script setup lang="ts">
// fetched via the Nitro proxy so the Funda key stays server-side
const route = useRoute()

const { data: listing, error } = await useFetch(
  () => `/api/listings/${route.params.id}`,
)

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
  ogImage: () => listing.value?.photos[0]?.full,
})
</script>

<template>
  <article v-if="listing" class="mx-auto max-w-5xl px-gutter py-section sm:px-8 lg:px-12">
    <NuxtLink to="/" class="text-sm text-foreground-muted hover:text-foreground">
      ← Terug naar het aanbod
    </NuxtLink>

    <MoleculesPhotoGallery :photos="listing.photos" :alt="listing.address" class="mt-4" />

    <ListingDetailHeader :listing="listing" class="mt-6" />

    <ListingDetailSection title="Kenmerken" sr-only class="mt-8">
      <MoleculesKeyFacts :listing="listing" />
    </ListingDetailSection>

    <ListingDetailDescription v-if="listing.description" :text="listing.description" class="mt-8" />

    <ListingDetailSection v-if="listing.features.length" title="Alle kenmerken" class="mt-8">
      <MoleculesFeatureGroups :groups="listing.features" class="mt-4" />
    </ListingDetailSection>

    <ListingDetailLocation
      :coordinates="listing.coordinates"
      :label="listing.address"
      class="mt-8"
    />
  </article>
</template>
