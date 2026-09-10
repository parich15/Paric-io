<script setup>
/** Marcador de imagen: borde discontinuo y etiqueta. Sustituir por <img> real. */
defineProps({ label: { type: String, default: 'IMAGEN' } })
</script>
<template>
  <span class="relative label-p5 text-label tracking-label-xwide text-fg border-2 border-dashed border-fg px-[14px] py-2 opacity-85 whitespace-nowrap max-w-[90%] overflow-hidden text-ellipsis"><slot>{{ label }}</slot></span>
</template>