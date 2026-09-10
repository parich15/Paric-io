<script setup lang="ts">
/** Pista nativa de teclado: `keys` muestra las teclas y el slot describe su acción en el idioma del consumidor. */
defineProps<{ keys?: string }>()
</script>
<template>
  <span class="inline-flex items-center gap-2 label-p5 text-btn-sm tracking-label">
    <kbd class="border-3 border-current px-2 py-[1px] text-label-sm font-label not-italic">{{ keys }}</kbd><slot></slot>
  </span>
</template>
