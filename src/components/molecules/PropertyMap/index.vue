<script setup lang="ts">
// client-only — Leaflet needs the DOM, so it's imported dynamically in onMounted
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { Map as LeafletMap } from 'leaflet'
import type { Coordinates } from '#shared/types/listing'

const { coordinates, label } = defineProps<{
  coordinates: Coordinates | null
  label: string
}>()

const container = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null
let destroyed = false

onMounted(async () => {
  if (!coordinates || !container.value) return

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  if (destroyed || !container.value) return // unmounted while the imports resolved

  map = L.map(container.value).setView([coordinates.lat, coordinates.lng], 15)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  L.marker([coordinates.lat, coordinates.lng], {
    icon: L.divIcon({
      className: '',
      html: '<span class="block h-4 w-4 rounded-full border-2 border-white bg-brand-600 shadow"></span>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    }),
  })
    .addTo(map)
    .bindPopup(label)
})

onBeforeUnmount(() => {
  destroyed = true
  map?.remove()
  map = null
})
</script>

<template>
  <div
    v-if="coordinates"
    ref="container"
    role="application"
    :aria-label="`Kaart met de locatie van ${label}`"
    class="h-64 w-full overflow-hidden rounded-card border border-border sm:h-80"
  />
  <p v-else class="text-sm text-foreground-muted">Locatie niet beschikbaar.</p>
</template>
