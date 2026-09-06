<script setup lang="ts">
type Tone = 'neutral' | 'success' | 'danger'

const { tone = 'neutral' } = defineProps<{
  tone?: Tone
}>()

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-surface-muted text-foreground-muted',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      toneClasses[tone],
    ]"
  >
    <slot />
  </span>
</template>
