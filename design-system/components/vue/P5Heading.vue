<script setup>
/** Titular letra a letra: cada carácter rota/salta y algunos llevan placa de tinta o rojo. Es el motivo tipográfico central del sistema. */
import { computed } from 'vue'
const props = defineProps({
  text: { type: String, required: true },
  offset: { type: Number, default: 0 },
  plates: Boolean,           // true = todas las letras con placa (tema claro)
  size: { type: String, default: 'h1' },
  shadow: { type: Boolean, default: true },
})
const sizes = { title: 'text-title', h1: 'text-h1', h2: 'text-h2' }
const letters = computed(() => {
  const pat = props.plates ? ['ink', 'red', 'ink', 'ink', 'red', 'ink', 'ink', 'red'] : [null, null, 'ink', null, 'red', null, null, 'ink']
  return props.text.split('').map((ch, i) => {
    const k = (i + props.offset) % pat.length
    const bg = ch === ' ' ? null : pat[k]
    return { ch, bg, rot: ((i + props.offset) % 3 - 1) * 3.5, dy: ((i + props.offset) % 2) * 6 - 3 }
  })
})
const plate = { ink: 'bg-fg text-bg', red: 'bg-red text-paper' }
</script>
<template>
  <span :class="['inline-flex flex-wrap items-baseline display-p5', sizes[size]]">
    <span v-for="(l, i) in letters" :key="i"
      :class="['inline-block whitespace-pre px-[0.04em]', l.bg ? plate[l.bg] : 'text-fg', shadow && !l.bg && 'text-shadow-hard-lg']"
      :style="{ transform: 'rotate(' + l.rot + 'deg) translateY(' + l.dy + 'px)' }">{{ l.ch }}</span>
  </span>
</template>