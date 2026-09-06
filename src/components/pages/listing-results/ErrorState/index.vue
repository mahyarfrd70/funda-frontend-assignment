<script setup lang="ts">
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="rounded-card border border-border bg-surface p-6 shadow-card">
    <p class="font-medium text-foreground">Kon het woningaanbod niet laden.</p>
    <p class="mt-1 text-sm text-foreground-muted">Probeer het later opnieuw.</p>
    <AtomsButton class="mt-4" variant="secondary" @click="emit('retry')">
      Opnieuw proberen
    </AtomsButton>
  </div>
</template>
