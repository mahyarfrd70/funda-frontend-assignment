<template>
  <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="n in 6" :key="n" class="aspect-[4/3] animate-pulse rounded-card bg-surface-muted" />
  </ul>
</template>
