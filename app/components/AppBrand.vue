<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import type { RouteLocationRaw } from 'vue-router'
import type { AnimeApi } from '~/plugins/anime.client'

defineProps<{ to: RouteLocationRaw }>()
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const nuxtApp = useNuxtApp()
const preference = usePreferredReducedMotion()
const reflection = useTemplateRef<HTMLElement>('reflection')
const activation = useState('brand:activation', () => 0)
let animation: ReturnType<AnimeApi['animate']> | undefined
let hoverTimer: ReturnType<typeof setTimeout> | undefined

function reset() {
  animation?.revert()
  animation = undefined
}

/** Ambas marcas comparten el destello para conservarlo al cerrar el diálogo. */
function play() {
  reset()
  if (!reflection.value || preference.value === 'reduce') return
  const anime = nuxtApp.$anime
  animation = anime.animate(reflection.value, {
    ...anime.readMotion(reflection.value, '--dur-theme', '--easing-slash'),
    backgroundPositionX: ['100%', '0%'],
    ease: 'inOut(2)',
    onComplete: reset,
  })
}

function activate(event: MouseEvent) {
  if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) activation.value++
  emit('click', event)
}

function onMouseEnter(event: MouseEvent) {
  const target = event.currentTarget as HTMLElement
  clearTimeout(hoverTimer)
  play()

  function repeat() {
    hoverTimer = setTimeout(() => {
      if (!target.matches(':hover')) return
      play()
      repeat()
    }, 5000)
  }

  repeat()
}

watch(activation, play)
watch(preference, () => { if (preference.value === 'reduce') reset() })
onBeforeUnmount(() => {
  clearTimeout(hoverTimer)
  reset()
})
</script>

<template>
  <NuxtLink :to="to" @mouseenter="onMouseEnter" @click="activate">
    <span class="brand-wordmark">
      <span>Paric.io</span>
      <span ref="reflection" class="brand-reflection" aria-hidden="true">Paric.io</span>
    </span>
  </NuxtLink>
</template>

<style scoped src="~/assets/css/components/app-brand.css"></style>
