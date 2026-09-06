<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <ListingDetailSection title="Omschrijving">
    <p class="mt-2 whitespace-pre-line text-foreground-muted">{{ text }}</p>
  </ListingDetailSection>
</template>
