<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import type { AnimeApi } from '~/plugins/anime.client'

const props = defineProps<{ text: string, active: boolean }>()
// Conserva los nodos de las letras al acortar la palabra para no perder su movimiento.
const letterCount = ref([...props.text].length)
const letters = computed(() => Array.from({ length: Math.max(letterCount.value, [...props.text].length) }, (_, index) => [...props.text][index] ?? ''))
const root = useTemplateRef('root')
const preference = usePreferredReducedMotion()
const nuxtApp = useNuxtApp()
let scope: ReturnType<AnimeApi['createScope']> | undefined
let animations: ReturnType<AnimeApi['animate']>[] = []

function cleanup() {
  scope?.revert()
  scope = undefined
  animations = []
}

function animateLetters() {
  if (preference.value === 'reduce') {
    cleanup()
    return
  }
  if (!props.active) {
    animations.forEach(animation => animation.pause())
    return
  }
  if (scope) {
    animations.forEach(animation => animation.resume())
  }
  if (!root.value) return
  const anime = nuxtApp.$anime
  const timing = anime.readMotion(root.value, '--dur-rise', '--easing-slash')
  scope ??= anime.createScope({ root: root.value })
  scope.add(() => {
    root.value!.querySelectorAll('.outline-letter').forEach((letter, index) => {
      if (animations[index]) return
      const direction = index % 2 ? -1 : 1
      animations.push(anime.animate(letter, {
        x: [{ to: direction * 3 }, { to: -direction * 2 }, { to: 0 }],
        y: [{ to: -direction * 2 }, { to: direction * 3 }, { to: 0 }],
        scaleX: [{ to: .94 }, { to: 1.06 }, { to: 1 }],
        rotate: [{ to: direction * 1.5 }, { to: -direction }, { to: 0 }],
        duration: timing.duration * (5 + index * .7),
        delay: index * timing.duration * .3,
        ease: 'inOutSine', loop: true, alternate: true,
      }))
    })
  })
}

onMounted(animateLetters)
// Las letras cambian de contenido conservando sus nodos y el instante de la secuencia.
watch([() => props.active, preference], animateLetters, { flush: 'post' })
watch(() => props.text, () => {
  letterCount.value = Math.max(letterCount.value, [...props.text].length)
  animateLetters()
}, { flush: 'post' })
onScopeDispose(cleanup)
</script>

<template>
  <span ref="root" class="outline-word" aria-hidden="true"><span class="outline-word-inner"><span v-for="(letter, index) in letters" :key="index" class="outline-letter">{{ letter }}</span></span></span>
</template>

<style scoped src="~/assets/css/components/about-outline.css"></style>
