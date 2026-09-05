<script setup lang="ts">
/**
 * Sticky, slim header — mobile-first: a single row (logo only) on small
 * screens, with room to grow (nav, search box) as later pages are added.
 * `backdrop-blur` + translucent background keeps content visible as the
 * page scrolls underneath it on mobile.
 */
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
    <div
      class="mx-auto flex h-14 max-w-6xl items-center justify-between px-gutter sm:h-16 sm:px-8 lg:px-12"
    >
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-foreground">
        <span aria-hidden="true" class="text-xl">🏠</span>
        <span>Woningaanbod</span>
      </NuxtLink>

      <!-- Temporary routing demo — replaced by real search/nav in a later step -->
      <nav class="flex items-center gap-4 text-sm text-foreground-muted">
        <NuxtLink to="/about" class="hover:text-foreground" active-class="text-brand-700">
          About
        </NuxtLink>
        <NuxtLink
          to="/listings/demo-123"
          class="hover:text-foreground"
          active-class="text-brand-700"
        >
          Sample listing
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
