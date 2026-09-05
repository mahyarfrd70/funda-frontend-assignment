<script setup lang="ts">
/**
 * Atom: base button. Every visual variant is built from design tokens
 * (brand color, radius, spacing) defined in assets/css/main.css — no
 * one-off colors here, so changing the tokens re-themes every button.
 *
 * Sizes default to `md` (2.75rem / 44px tall), the minimum comfortable
 * touch-target size on mobile — this is a mobile-first app, so the default
 * has to work well with a thumb before it needs to work well with a mouse.
 */

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const { variant = 'primary', size = 'md' } = defineProps<{
  variant?: Variant
  size?: Size
}>()

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-600 text-on-brand hover:bg-brand-700 active:bg-brand-800',
  secondary: 'bg-surface text-brand-700 border border-brand-200 hover:bg-brand-50',
  ghost: 'bg-transparent text-foreground hover:bg-surface-muted',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <slot />
  </button>
</template>
