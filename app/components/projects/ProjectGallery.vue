<script setup lang="ts">
import type { ProjectFrame } from '~/data/projects'

interface GalleryItem {
  src?: string
  type: 'image' | 'video'
  frame?: ProjectFrame
  label: string
  caption?: string
}

/** Galería de capturas; sin JavaScript cada imagen enlaza al archivo y con él se abre un visor sobre <dialog>. */
const props = defineProps<{ items: GalleryItem[], title: string }>()

const { t } = useI18n()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const rotations = [-1.5, 1.5, -1, 1]
/** Las capturas de escritorio forman la rejilla y las de móvil cierran la galería en una fila propia; el visor sigue ese mismo orden. */
const screens = computed(() => props.items.filter(item => item.frame !== 'phone'))
const phones = computed(() => props.items.filter(item => item.frame === 'phone'))
const groups = computed(() => [screens.value, phones.value])
const ordered = computed(() => [...screens.value, ...phones.value])
/** Solo las imágenes se amplían: los vídeos ya se reproducen en su marco y los huecos no tienen archivo. */
const viewable = computed(() => ordered.value.flatMap((item, index) => item.src && item.type === 'image' ? [index] : []))
const position = ref(0)
const active = computed(() => ordered.value[viewable.value[position.value] ?? -1])
let returnFocus: HTMLElement | null = null
let previousOverflow = ''

function open(index: number, event: MouseEvent) {
  const element = dialog.value
  if (!element || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  position.value = Math.max(0, viewable.value.indexOf(index))
  returnFocus = event.currentTarget instanceof HTMLElement ? event.currentTarget : null
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  element.showModal()
}

function close() {
  dialog.value?.close()
}

function onClose() {
  document.body.style.overflow = previousOverflow
  if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
  returnFocus = null
}

function step(delta: number) {
  const total = viewable.value.length
  position.value = (position.value + delta + total) % total
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  event.preventDefault()
  step(event.key === 'ArrowRight' ? 1 : -1)
}

onBeforeUnmount(() => {
  if (dialog.value?.open) {
    dialog.value.close()
    document.body.style.overflow = previousOverflow
  }
})
</script>

<template>
  <section class="project-gallery" aria-labelledby="project-gallery">
    <div data-motion="rise"><P5Stamp id="project-gallery" as="h2" size="h2" tone="paper">{{ t('projects.gallery') }}</P5Stamp></div>
    <ul v-for="(group, groupIndex) in groups" v-show="group.length" :key="groupIndex" :class="groupIndex ? 'gallery-phones' : 'gallery-grid'">
      <li v-for="(item, index) in group" :key="item.src ?? index" class="gallery-item" :class="`gallery-item--${item.frame ?? 'plain'}`" data-motion="rise">
        <a v-if="viewable.includes(index + (groupIndex ? screens.length : 0))" :href="item.src" class="gallery-open" :aria-label="t('projects.enlarge', { label: item.label })" @click="open(index + (groupIndex ? screens.length : 0), $event)">
          <ProjectImage :src="item.src" :frame="item.frame" :label="item.label" :rotation="rotations[index % rotations.length]" />
        </a>
        <ProjectImage v-else :src="item.src" :type="item.type" :frame="item.frame" :label="item.label" :rotation="rotations[index % rotations.length]" />
        <p v-if="item.caption" class="gallery-caption">{{ item.caption }}</p>
      </li>
    </ul>
    <dialog ref="dialog" class="gallery-lightbox" :aria-label="t('projects.lightbox', { title })" @close="onClose" @keydown="onKeydown" @click.self="close">
      <div class="lightbox-plane" aria-hidden="true"></div>
      <p class="lightbox-count display-p5">
        <span class="sr-only">{{ t('projects.imagePosition', { current: position + 1, total: viewable.length }) }}</span>
        <span aria-hidden="true">{{ String(position + 1).padStart(2, '0') }} <small>/ {{ String(viewable.length).padStart(2, '0') }}</small></span>
      </p>
      <button class="lightbox-close label-p5" type="button" @click="close"><kbd>Esc</kbd> {{ t('common.close') }}</button>
      <figure v-if="active" class="lightbox-figure">
        <img :key="active.src" :src="active.src" :alt="active.label" :class="`lightbox-image--${active.frame ?? 'plain'}`" />
        <figcaption v-if="active.caption" class="label-p5">{{ active.caption }}</figcaption>
      </figure>
      <div v-if="viewable.length > 1" class="lightbox-controls">
        <button class="lightbox-arrow display-p5" type="button" :aria-label="t('projects.previousImage')" @click="step(-1)"><span aria-hidden="true">←</span></button>
        <button class="lightbox-arrow display-p5" type="button" :aria-label="t('projects.nextImage')" @click="step(1)"><span aria-hidden="true">→</span></button>
      </div>
    </dialog>
  </section>
</template>

<style scoped src="~/assets/css/components/project-gallery.css"></style>
