<script setup lang="ts">
import { useEventListener, usePreferredReducedMotion } from '@vueuse/core'
import type { AnimeApi } from '~/plugins/anime.client'
import { isEditingTarget } from '~/utils/keyboard'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const root = useTemplateRef<HTMLDialogElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const hint = useTemplateRef<HTMLSpanElement>('hint')
const preference = usePreferredReducedMotion()
const nuxtApp = useNuxtApp()
let scope: ReturnType<AnimeApi['createScope']> | undefined
let timeline: ReturnType<AnimeApi['createTimeline']> | undefined
let labelReveal: ReturnType<AnimeApi['animate']> | undefined
const isOpen = ref(false)
const closing = ref(false)
let returnFocus: HTMLElement | null = null

/** Oculta la etiqueta antes de desplegar el anillo y las opciones. */
function animateOpen() {
  const element = root.value
  const label = hint.value
  if (!element || !label || preference.value === 'reduce') return
  const anime = nuxtApp.$anime
  labelReveal?.revert()
  labelReveal = undefined
  const options = [...element.querySelectorAll<HTMLElement>('[data-menu-item]')]
  const ring = element.querySelector<HTMLElement>('.quick-ring')!
  const icon = element.querySelector<HTMLElement>('.quick-close > span')!
  const hintTiming = anime.readMotion(element, '--dur-hover', '--easing-slash')
  const menuTiming = anime.readMotion(element, '--dur-hover', '--easing-slash')
  const stagger = menuTiming.duration / 5
  scope = anime.createScope()
  scope.add(() => {
    // Los tramos futuros de una timeline no ocultan sus elementos hasta arrancar.
    anime.utils.set(options, { opacity: 0, x: -60 })
    anime.utils.set(ring, { opacity: 0 })
    timeline = anime.createTimeline({ autoplay: false })
      .add(label, { ...hintTiming, ease: 'inOut(2)', opacity: [1, 0], y: [0, 6] }, 0)
      .add(icon, { ...hintTiming, ease: 'inOut(2)', rotate: [0, 135] }, 0)
      .add(ring, {
        ...menuTiming,
        duration: menuTiming.duration + (options.length - 1) * stagger,
        ease: 'linear',
        opacity: [0, 1],
      }, hintTiming.duration)
      .add(options, {
        ...menuTiming,
        ease: 'inOut(2)',
        x: [-60, 0],
        opacity: [0, 1],
        delay: anime.stagger(stagger),
      }, hintTiming.duration)
    timeline.play()
  })
}

const items = computed(() => [
  { key: 'home', to: { path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' } },
  { key: 'projects', to: { path: localePath('projects') } },
  { key: 'about', to: { path: localePath('about') } },
  { key: 'contact', to: { path: localePath('contact') } },
])

/** El acceso rápido usa otro diálogo nativo; Q nunca interrumpe formularios ni un menú modal distinto. */
function open() {
  if (!root.value || root.value.open || document.querySelector('dialog[open]')) return
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger.value
  root.value.showModal()
  isOpen.value = true
  animateOpen()
}

function close() {
  if (!root.value?.open || closing.value) return
  closing.value = true
  if (!timeline || preference.value === 'reduce') { root.value.close(); return }
  timeline.cancel()
  const element = root.value
  const timing = { ...nuxtApp.$anime.readMotion(element, '--dur-fast', '--easing-slash'), ease: 'in(2)' }
  scope!.add(() => {
    nuxtApp.$anime.createTimeline({ onComplete: () => element.close() })
      .add(element.querySelectorAll('[data-menu-item]'), { ...timing, opacity: 0, x: -20 }, 0)
      .add(element.querySelector('.quick-ring')!, { ...timing, opacity: 0 }, 0)
      .add(element.querySelector('.quick-close > span')!, { ...timing, rotate: 0 }, 0)
  })
}

function finishClose() {
  scope?.revert()
  scope = undefined
  timeline = undefined
  isOpen.value = false
  closing.value = false
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
  if (hint.value?.isConnected && preference.value !== 'reduce') {
    labelReveal = nuxtApp.$anime.animate(hint.value, {
      ...nuxtApp.$anime.readMotion(hint.value, '--dur-hover', '--easing-slash'),
      ease: 'inOut(2)', opacity: [0, 1], y: [6, 0],
    })
  }
}

function onNavigate(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  root.value?.close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || isEditingTarget(event.target) || event.key.toLowerCase() !== 'q') return
  if (document.querySelector('dialog[open]') && !root.value?.open) return
  event.preventDefault()
  if (root.value?.open) void close()
  else open()
}

watch(() => route.fullPath, () => { if (root.value?.open) root.value.close() })
watch(preference, (value) => {
  if (value !== 'reduce') return
  labelReveal?.revert()
  scope?.revert()
  scope = undefined
  timeline = undefined
  if (closing.value) root.value?.close()
})
useEventListener('keydown', onKeydown)
onBeforeUnmount(() => {
  labelReveal?.revert()
  scope?.revert()
  root.value?.close()
})
</script>

<template>
  <span ref="hint" class="quick-hint keyboard-hints label-p5" :class="{ 'is-open': isOpen }"><span class="quick-hint-plate"><span>Q · {{ t('nav.quick') }}</span></span></span>
  <div class="quick-launcher" data-cursor="plain">
    <button ref="trigger" class="quick-toggle" type="button" :aria-label="t('nav.openQuick')" aria-haspopup="dialog" aria-controls="quick-menu" :aria-expanded="isOpen" @click="open"><span aria-hidden="true">✦</span></button>
  </div>
  <dialog id="quick-menu" ref="root" class="quick-menu" data-cursor="plain" :aria-label="t('nav.quick')" @cancel.prevent="close" @close="finishClose" @click.self="close">
    <nav :aria-label="t('nav.quick')">
      <div class="quick-ring animate-spin-slow" aria-hidden="true"></div>
      <ul>
        <li v-for="(item, index) in items" :key="item.key" data-menu-item>
          <NuxtLink :to="item.to" class="quick-link" @click="onNavigate"><span class="quick-key" aria-hidden="true">{{ String.fromCharCode(65 + index) }}</span><span class="display-p5">{{ t(`common.${item.key}`) }}</span></NuxtLink>
        </li>
      </ul>
      <button class="quick-toggle quick-close" type="button" :aria-label="t('nav.closeQuick')" @click="close"><span aria-hidden="true">✦</span></button>
    </nav>
  </dialog>
</template>

<style scoped src="~/assets/css/components/quick-menu.css"></style>
