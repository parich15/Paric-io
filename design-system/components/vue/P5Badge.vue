<script setup lang="ts">
/** Sello de año o estado; `rotate` admite grados numéricos sin sufijo y `ink` sigue la tinta semántica del tema. */
withDefaults(defineProps<{
  tone?: 'ink' | 'red' | 'paper'
  rotate?: number | `${number}`
}>(), { tone: 'ink', rotate: 3 })
const tones = { ink: 'bg-fg text-bg', red: 'bg-red text-paper', paper: 'bg-paper text-ink border-3 border-ink' }
</script>
<template>
  <span :class="['inline-block label-p5 text-label tracking-label-wide px-[10px] py-[3px] leading-normal', tones[tone]]" :style="{ transform: 'rotate(' + rotate + 'deg)' }"><slot></slot></span>
</template>
