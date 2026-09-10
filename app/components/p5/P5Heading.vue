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

/** Agrupa palabras para no dejar letras aisladas al refluir, sin reiniciar el patrón de placas. */
const words = computed(() => {
  const pattern = props.plates ? ['ink', 'red', 'ink', 'ink', 'red', 'ink', 'ink', 'red'] as const : [null, null, 'ink', null, 'red', null, null, 'ink'] as const
  let position = Number.isFinite(props.offset) ? Math.trunc(props.offset) : 0
  return (props.text.match(/\S+\s*|\s+/g) ?? []).map(word => [...word].map((character) => {
    const index = position++
    const background = /\s/.test(character) ? null : pattern[wrapIndex(index, pattern.length)]
    return { character, background, rotation: (wrapIndex(index, 3) - 1) * 3.5, displacement: wrapIndex(index, 2) * 6 - 3 }
  }))
})
const plate = { ink: 'bg-fg text-bg', red: 'bg-red text-paper' }
</script>
<template>
  <span :class="['inline-flex max-w-full flex-wrap items-baseline display-p5', sizes[size]]">
    <span class="sr-only">{{ text }}</span>
    <span v-for="(word, wordIndex) in words" :key="wordIndex" aria-hidden="true" class="inline-flex max-w-full flex-wrap items-baseline">
      <span
        v-for="(letter, letterIndex) in word" :key="letterIndex"
        :class="['inline-block whitespace-pre px-[0.04em]', letter.background ? plate[letter.background] : 'text-fg', shadow && !letter.background && 'text-shadow-hard-lg']"
        :style="{ transform: 'rotate(' + letter.rotation + 'deg) translateY(' + letter.displacement + 'px)' }">{{ letter.character }}</span>
    </span>
  </span>
</template>
