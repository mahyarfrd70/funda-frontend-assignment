<script setup lang="ts">
type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const { tone = 'neutral' } = defineProps<{
  tone?: Tone
}>()

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  neutral: 'bg-surface-muted text-foreground-muted',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
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
