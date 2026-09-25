<script setup lang="ts">
/** Pista nativa de teclado: `keys` muestra las teclas y el slot describe su acción en el idioma del consumidor. */
defineProps<{ keys?: string }>()
</script>
<template>
  <span class="inline-flex items-center gap-2 label-p5 text-btn-sm tracking-label">
    <kbd class="border-3 border-current px-2 py-[1px] text-label-sm font-label not-italic">
      <!-- Ninguna fuente local incluye ↵: buscar una del sistema bloqueaba ~160 ms la primera vez que aparecía, así que se dibuja. -->
      <template v-if="keys === '↵'"><svg class="inline-block h-[.8em] w-[1em] align-[-.05em]" viewBox="0 0 14 11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M12 1v5H2.5M5.5 3 2.5 6l3 3" /></svg><span class="sr-only">Enter</span></template>
      <template v-else>{{ keys }}</template>
    </kbd><slot></slot>
  </span>
</template>
