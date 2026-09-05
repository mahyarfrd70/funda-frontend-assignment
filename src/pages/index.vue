<script setup lang="ts">
/**
 * Temporary showcase page — proves the design tokens, Tailwind pipeline, and
 * first atoms work end-to-end before Step 3 replaces this with the real
 * search results page.
 */
</script>

<template>
  <div class="mx-auto max-w-6xl px-gutter py-section sm:px-8 lg:px-12">
    <h1 class="text-2xl font-semibold text-foreground sm:text-3xl">Design tokens & atoms</h1>
    <p class="mt-2 max-w-prose text-foreground-muted">
      This page exists only to verify Tailwind, the token layer, and the first atoms render
      correctly — mobile-first, then enhanced at <code>sm:</code> and up.
    </p>

    <section class="mt-8 flex flex-col gap-3 sm:flex-row">
      <AtomsButton variant="primary">Primary</AtomsButton>
      <AtomsButton variant="secondary">Secondary</AtomsButton>
      <AtomsButton variant="ghost">Ghost</AtomsButton>
    </section>

    <section class="mt-6 flex flex-wrap gap-2">
      <AtomsBadge tone="brand">Nieuw</AtomsBadge>
      <AtomsBadge tone="success">Beschikbaar</AtomsBadge>
      <AtomsBadge tone="warning">Onder bod</AtomsBadge>
      <AtomsBadge tone="danger">Verkocht</AtomsBadge>
      <AtomsBadge tone="info">360°</AtomsBadge>
      <AtomsBadge tone="neutral">Video</AtomsBadge>
    </section>

    <p class="mt-6 text-price font-semibold text-foreground">€ 450.000 k.k.</p>
  </div>
</template>
