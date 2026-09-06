<script setup lang="ts">
import type { Coordinates } from '#shared/types/listing'

defineProps<{ coordinates: Coordinates | null; label: string }>()
</script>

<template>
  <ListingDetailSection title="Locatie">
    <ClientOnly>
      <MoleculesPropertyMap :coordinates="coordinates" :label="label" class="mt-4" />
      <template #fallback>
        <div class="mt-4 h-64 animate-pulse rounded-card bg-surface-muted sm:h-80" />
      </template>
    </ClientOnly>
  </ListingDetailSection>
</template>
