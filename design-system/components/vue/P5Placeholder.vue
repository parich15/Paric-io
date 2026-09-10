<script setup lang="ts">
/** Marcador de imagen ausente: el consumidor traduce `label` o reemplaza el texto mediante el slot. */
withDefaults(defineProps<{ label?: string }>(), { label: 'IMAGEN' })
</script>
<template>
  <span class="relative label-p5 text-label tracking-label-xwide text-fg border-2 border-dashed border-fg px-[14px] py-2 opacity-85 whitespace-nowrap max-w-[90%] overflow-hidden text-ellipsis"><slot>{{ label }}</slot></span>
</template>
