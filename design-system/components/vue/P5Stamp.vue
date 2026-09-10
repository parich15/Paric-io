<script setup>
/** Bloque de titular "sellado": fondo sólido, skew + rotación, sombra dura. as: h1|h2|div. tone: paper|ink|red. animate: entra con p5stamp */
defineProps({ as: { type: String, default: 'h2' }, tone: { type: String, default: 'paper' }, size: { type: String, default: 'h2' }, animate: Boolean })
const tones = { paper: 'bg-paper text-ink shadow-hard', ink: 'bg-ink text-paper shadow-hard', red: 'bg-red text-paper shadow-[8px_8px_0_var(--p5-paper)]' }
const sizes = { h1: 'text-h1', h2: 'text-h2', h3: 'text-h3' }
</script>
<template>
  <component :is="as" :class="['inline-block display-p5 m-0 px-[18px] pb-[6px] skew-p5 -rotate-[1.5deg]', tones[tone], sizes[size], animate && 'animate-stamp']"><slot /></component>
</template>