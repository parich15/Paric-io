<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { isEditingTarget } from '~/utils/keyboard'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const root = useTemplateRef<HTMLDialogElement>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const motion = useMenuMotion(root)
const isOpen = ref(false)
const closing = ref(false)
let returnFocus: HTMLElement | null = null

const items = computed(() => [
  { key: 'home', to: { path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' } },
  { key: 'projects', to: { path: localePath('projects') } },
  { key: 'about', to: { path: localePath('index'), hash: locale.value === 'es' ? '#sobre' : '#about' } },
  { key: 'contact', to: { path: localePath('index'), hash: locale.value === 'es' ? '#contacto' : '#contact' } },
])

/** El acceso rápido usa otro diálogo nativo; Q nunca interrumpe formularios ni un menú modal distinto. */
function open() {
  if (!root.value || root.value.open || document.querySelector('dialog[open]')) return
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger.value
  root.value.showModal()
  isOpen.value = true
  motion.open()
}

async function close() {
  if (!root.value?.open || closing.value) return
  closing.value = true
  try { await motion.close() }
  finally { root.value?.close() }
}

function finishClose() {
  isOpen.value = false
  closing.value = false
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
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
useEventListener('keydown', onKeydown)
onBeforeUnmount(() => {
  root.value?.close()
})
</script>

<template>
  <div class="quick-launcher">
    <span class="quick-hint keyboard-hints label-p5">Q · {{ t('nav.quick') }}</span>
    <button ref="trigger" class="quick-toggle" type="button" :aria-label="t('nav.openQuick')" aria-haspopup="dialog" aria-controls="quick-menu" :aria-expanded="isOpen" @click="open"><span aria-hidden="true">✦</span></button>
  </div>
  <dialog id="quick-menu" ref="root" class="quick-menu" :aria-label="t('nav.quick')" @cancel.prevent="close" @close="finishClose" @click.self="close">
    <nav :aria-label="t('nav.quick')">
      <div class="quick-ring" aria-hidden="true"></div>
      <ul>
        <li v-for="(item, index) in items" :key="item.key" data-menu-item>
          <NuxtLink :to="item.to" class="quick-link" @focus="motion.select(index)" @pointerenter="motion.select(index)" @click="onNavigate"><span class="quick-key" aria-hidden="true">{{ String.fromCharCode(65 + index) }}</span><span class="display-p5">{{ t(`common.${item.key}`) }}</span></NuxtLink>
        </li>
      </ul>
      <button class="quick-toggle quick-close" type="button" :aria-label="t('nav.closeQuick')" @click="close"><span aria-hidden="true">✦</span></button>
    </nav>
  </dialog>
</template>

<style scoped src="~/assets/css/components/quick-menu.css"></style>
