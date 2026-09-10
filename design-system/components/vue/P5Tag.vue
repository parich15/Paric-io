<script setup lang="ts">
/** Etiqueta técnica con tono semántico; el texto interior compensa los diez grados de la placa. */
withDefaults(defineProps<{ tone?: 'outline' | 'ink' | 'red' }>(), { tone: 'outline' })
const tones = {
  outline: 'text-fg border-2 border-fg bg-bg',
  ink: 'bg-fg text-bg',
  red: 'bg-red text-paper',
}
</script>
<template>
  <span :class="['inline-block label-p5 text-label-xs leading-normal px-[7px] py-[1px] skew-p5 whitespace-nowrap', tones[tone]]"><span class="inline-block unskew-p5"><slot></slot></span></span>
</template>
