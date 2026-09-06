<script setup lang="ts">
defineProps<{ title: string; srOnly?: boolean }>()
</script>

<template>
  <section>
    <h2 :class="srOnly ? 'sr-only' : 'font-semibold text-foreground'">{{ title }}</h2>
    <slot />
  </section>
</template>
