<script setup lang="ts">
/** Titular sobre placa de color fijo; `as` aporta la jerarquía semántica independientemente del tamaño visual. */
withDefaults(defineProps<{
  as?: 'h1' | 'h2' | 'h3' | 'div' | 'span'
  tone?: 'paper' | 'ink' | 'red'
  size?: 'h1' | 'h2' | 'h3'
  animate?: boolean
}>(), { as: 'h2', tone: 'paper', size: 'h2', animate: false })
const tones = { paper: 'bg-paper text-ink shadow-hard', ink: 'bg-ink text-paper shadow-hard', red: 'bg-red text-paper shadow-[8px_8px_0_var(--p5-paper)]' }
const sizes = { h1: 'text-h1', h2: 'text-h2', h3: 'text-h3' }
</script>
<template>
  <component :is="as" :class="['inline-block display-p5 m-0 px-[18px] pb-[6px] skew-p5 -rotate-[1.5deg]', tones[tone], sizes[size], animate && 'animate-stamp']"><span class="inline-block unskew-p5"><slot></slot></span></component>
</template>
