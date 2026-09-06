<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ListingPhoto } from '#shared/types/listing'

const { photos, alt } = defineProps<{ photos: ListingPhoto[]; alt: string }>()

const current = ref(0)
const thumbStrip = ref<HTMLUListElement | null>(null)

// the big image loads `_groot`; only the photo on screen is in the DOM, so the
// large file for a given photo is fetched the moment it's opened, not before.
// `current` is always a valid index here — the template guards on photos.length
const selectedImage = computed(() => photos[current.value]!)

function step(delta: number) {
  const next = current.value + delta
  if (next >= 0 && next < photos.length) current.value = next
}

// keep the active thumbnail visible when navigating with the arrows
watch(
  current,
  (index) => {
    const thumb = thumbStrip.value?.children[index] as HTMLElement | undefined
    thumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  },
  { flush: 'post' },
)
</script>

<template>
  <div v-if="photos.length" class="flex flex-col gap-3">
    <div class="relative aspect-[3/2] overflow-hidden rounded-card bg-surface-muted">
      <img
        :key="selectedImage.full"
        :src="selectedImage.full"
        :alt="`${alt} — foto ${current + 1} van ${photos.length}`"
        width="900"
        height="600"
        fetchpriority="high"
        class="h-full w-full object-contain"
      />

      <button
        v-if="current > 0"
        type="button"
        aria-label="Vorige foto"
        class="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-surface/90 px-3 py-1.5 text-lg shadow-card"
        @click="step(-1)"
      >
        ‹
      </button>
      <button
        v-if="current < photos.length - 1"
        type="button"
        aria-label="Volgende foto"
        class="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-surface/90 px-3 py-1.5 text-lg shadow-card"
        @click="step(1)"
      >
        ›
      </button>

      <span
        class="absolute right-2 bottom-2 rounded-full bg-surface/90 px-2 py-0.5 text-xs text-foreground"
      >
        {{ current + 1 }} / {{ photos.length }}
      </span>
    </div>

    <ul v-if="photos.length > 1" ref="thumbStrip" class="flex gap-2 overflow-x-auto pb-1">
      <li v-for="(photo, index) in photos" :key="photo.thumb">
        <button
          type="button"
          :aria-label="`Naar foto ${index + 1}`"
          :aria-current="index === current ? 'true' : undefined"
          class="block h-16 w-20 shrink-0 overflow-hidden rounded-md border-2"
          :class="index === current ? 'border-brand-500' : 'border-transparent'"
          @click="current = index"
        >
          <img
            :src="photo.thumb"
            alt=""
            width="80"
            height="64"
            loading="lazy"
            class="h-full w-full object-cover"
          />
        </button>
      </li>
    </ul>
  </div>

  <div
    v-else
    class="flex aspect-[3/2] items-center justify-center rounded-card bg-surface-muted text-sm text-foreground-muted"
  >
    Geen foto's beschikbaar
  </div>
</template>
