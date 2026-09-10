<script setup lang="ts">
import { computed } from 'vue'

/** Fragmento de titular: el consumidor aporta el h1/h2 y pasa `plates` explícitamente según el tema. */
const props = withDefaults(defineProps<{
  text: string
  offset?: number
  plates?: boolean
  size?: 'title' | 'h1' | 'h2'
  shadow?: boolean
}>(), {
  offset: 0,
  plates: false,
  size: 'h1',
  shadow: true,
})
const sizes = { title: 'text-title', h1: 'text-h1', h2: 'text-h2' }

/** Repite cada patrón también hacia atrás, conservando los límites originales de giro y desplazamiento. */
function wrapIndex(position: number, length: number) {
  return ((position % length) + length) % length
}

const letters = computed(() => {
  const pattern = props.plates ? ['ink', 'red', 'ink', 'ink', 'red', 'ink', 'ink', 'red'] as const : [null, null, 'ink', null, 'red', null, null, 'ink'] as const
  const offset = Number.isFinite(props.offset) ? Math.trunc(props.offset) : 0
  return props.text.split('').map((character, index) => {
    const position = index + offset
    const background = character === ' ' ? null : pattern[wrapIndex(position, pattern.length)]
    return { character, background, rotation: (wrapIndex(position, 3) - 1) * 3.5, displacement: wrapIndex(position, 2) * 6 - 3 }
  })
})
const plate = { ink: 'bg-fg text-bg', red: 'bg-red text-paper' }
</script>
<template>
  <span :class="['inline-flex flex-wrap items-baseline display-p5', sizes[size]]">
    <span class="sr-only">{{ text }}</span>
    <span
      v-for="(letter, index) in letters" :key="index"
      aria-hidden="true"
      :class="['inline-block whitespace-pre px-[0.04em]', letter.background ? plate[letter.background] : 'text-fg', shadow && !letter.background && 'text-shadow-hard-lg']"
      :style="{ transform: 'rotate(' + letter.rotation + 'deg) translateY(' + letter.displacement + 'px)' }">{{ letter.character }}</span>
  </span>
</template>
