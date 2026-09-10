<script setup>
/** Etiqueta técnica (stack, categoría). tone: outline (borde 2px) | ink | red */
defineProps({ tone: { type: String, default: 'outline' } })
const tones = {
  outline: 'text-fg border-2 border-fg bg-bg',
  ink: 'bg-fg text-bg',
  red: 'bg-red text-paper',
}
</script>
<template>
  <span :class="['inline-block label-p5 text-label-xs leading-normal px-[7px] py-[1px] skew-p5 whitespace-nowrap', tones[tone]]"><slot /></span>
</template>