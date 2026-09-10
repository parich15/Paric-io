<script setup>
/** Sello girado (año, tipo, estado). Ligeramente rotado, tinta o rojo. */
defineProps({ tone: { type: String, default: 'ink' }, rotate: { type: [Number, String], default: 3 } })
const tones = { ink: 'bg-fg text-bg', red: 'bg-red text-paper', paper: 'bg-paper text-ink border-3 border-ink' }
</script>
<template>
  <span :class="['inline-block label-p5 text-label tracking-label-wide px-[10px] py-[3px] leading-normal', tones[tone]]" :style="{ transform: 'rotate(' + rotate + 'deg)' }"><slot /></span>
</template>