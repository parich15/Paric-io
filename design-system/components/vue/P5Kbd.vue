<script setup>
/** Pista de teclado ("←→ Navegar"). Se agrupa dentro de una barra de tinta. */
defineProps({ keys: String })
</script>
<template>
  <span class="inline-flex items-center gap-2 label-p5 text-btn-sm tracking-label">
    <kbd class="border-3 border-current px-2 py-[1px] text-label-sm font-label not-italic">{{ keys }}</kbd><slot />
  </span>
</template>