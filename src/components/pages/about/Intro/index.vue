<script setup lang="ts">
/**
 * Page component: only ever used by pages/about.vue. Lives in
 * pageComponents/about/ rather than components/, so it never gets pulled
 * into "shared molecule" territory by mistake — if a second page ever
 * needs this, that's the signal to promote it into components/ instead.
 *
 * It's still built entirely from atoms (Atoms*) and design tokens, same as
 * any shared component would be.
 */
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-foreground sm:text-3xl">About this project</h1>
    <p class="mt-2 max-w-prose text-foreground-muted">
      This is a plain static route — <code>src/pages/about.vue</code> → <code>/about</code>. Its
      content lives here, in <code>pageComponents/about/</code>, reusing the same atoms and tokens
      as the home page.
    </p>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <AtomsBadge tone="brand">Page component</AtomsBadge>
      <NuxtLink to="/">
        <AtomsButton variant="secondary">← Back home</AtomsButton>
      </NuxtLink>
    </div>
  </div>
</template>
