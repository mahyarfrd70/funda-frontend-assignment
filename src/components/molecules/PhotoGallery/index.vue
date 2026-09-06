<script setup lang="ts">
import { ref } from 'vue'

const { photos, alt } = defineProps<{ photos: string[]; alt: string }>()

const current = ref(0)

function step(delta: number) {
  const next = current.value + delta
  if (next >= 0 && next < photos.length) current.value = next
}
</script>

<template>
  <div v-if="photos.length" class="flex flex-col gap-3">
    <div class="relative aspect-[3/2] overflow-hidden rounded-card bg-surface-muted">
      <img
        :key="photos[current]"
        :src="photos[current]"
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

    <ul v-if="photos.length > 1" class="flex gap-2 overflow-x-auto pb-1">
      <li v-for="(photo, index) in photos" :key="photo">
        <button
          type="button"
          :aria-label="`Naar foto ${index + 1}`"
          :aria-current="index === current ? 'true' : undefined"
          class="block h-16 w-20 shrink-0 overflow-hidden rounded-md border-2"
          :class="index === current ? 'border-brand-500' : 'border-transparent'"
          @click="current = index"
        >
          <img
            :src="photo"
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
