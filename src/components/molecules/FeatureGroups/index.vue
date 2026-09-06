<script setup lang="ts">
import type { FeatureGroup } from '#shared/types/listing'

defineProps<{ groups: FeatureGroup[] }>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <section v-for="group in groups" :key="group.title">
      <h3 class="font-semibold text-foreground">{{ group.title }}</h3>
      <dl class="mt-2 divide-y divide-border">
        <div
          v-for="item in group.items"
          :key="item.label"
          class="flex justify-between gap-4 py-2 text-sm"
        >
          <dt class="text-foreground-muted">{{ item.label }}</dt>
          <dd class="text-right font-medium text-foreground">{{ item.value }}</dd>
        </div>
      </dl>
    </section>
  </div>
</template>
