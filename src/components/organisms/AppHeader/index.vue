<script setup lang="ts">
/**
 * Sticky, slim header — mobile-first: a single row (logo only) on small
 * screens, with room to grow (search, filters) as the app does.
 * `backdrop-blur` + translucent background keeps content visible as the
 * page scrolls underneath it on mobile.
 */
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-6xl items-center px-gutter sm:h-16 sm:px-8 lg:px-12">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-foreground">
        <span aria-hidden="true" class="text-xl">🏠</span>
        <span>Woningaanbod</span>
      </NuxtLink>
    </div>
  </header>
</template>
