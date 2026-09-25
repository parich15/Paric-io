<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { Project } from '~/data/projects'

const props = defineProps<{ project: Project, index: number, distance: number, active: boolean, to: string }>()
const emit = defineEmits<{ select: [index: number] }>()
const { t } = useI18n()
const opacity = computed(() => props.distance >= 0 ? Math.max(0, 1 - props.distance * 0.28) : Math.max(0, 1 + props.distance * 1.15))
const geometry = computed<CSSProperties>(() => {
  const distance = props.distance
  const outgoing = Math.min(1, -distance)
  return {
    '--card-x': distance >= 0 ? distance * 30 : -85 * outgoing,
    '--card-y': distance >= 0 ? -5 * distance : 70 * outgoing,
    '--mobile-x': distance >= 0 ? distance * 20 : -110 * outgoing,
    '--mobile-y': distance >= 0 ? -3 * distance : 60 * outgoing,
    '--card-depth': `${distance >= 0 ? -420 * distance : 360 * outgoing}px`,
    '--mobile-depth': `${distance >= 0 ? -260 * distance : 360 * outgoing}px`,
    '--card-yaw': `${distance >= 0 ? -26 * Math.min(distance, 1) : 0}deg`,
    '--card-rotation': `${distance >= 0 ? 2 * distance : -24 * outgoing}deg`,
    opacity: opacity.value,
    zIndex: distance >= 0 ? 20 - Math.round(distance) : 30,
    pointerEvents: opacity.value < 0.05 ? 'none' : 'auto',
  }
})

function activate(event: MouseEvent) {
  if (!props.active && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault()
    emit('select', props.index)
  }
}
</script>

<template>
  <NuxtLink
    :to="to" class="carousel-card" :style="geometry" data-project-card
    :aria-current="active ? 'true' : undefined" :aria-hidden="opacity < 0.05 ? true : undefined"
    :aria-label="t(active ? 'projects.openProject' : 'projects.select', { title: project.title })"
    :tabindex="active ? 0 : -1" :draggable="false" @click="activate"
  >
    <P5Card
      :num="String(index + 1).padStart(2, '0')" :title="project.title" :year="project.year"
      :kind="t(project.category === 'pro' ? 'projects.professional' : 'projects.personal')" :tags="project.tags.slice(0, 3)" :active="active"
    >
      <template #media>
        <!-- Velo de puntillismo: dos mitades que se abren hacia los lados cuando la tarjeta pasa a ser la principal. -->
        <span class="card-media" :class="{ 'is-open': active }">
          <img v-if="project.cover" :src="project.cover" alt="" loading="lazy" class="project-cover" /><P5Placeholder v-else :label="`${t('common.image')} · ${project.title}`" />
          <span class="card-dots card-dots--left" aria-hidden="true"></span>
          <span class="card-dots card-dots--right" aria-hidden="true"></span>
        </span>
      </template>
    </P5Card>
  </NuxtLink>
</template>

<style scoped src="~/assets/css/components/project-carousel-card.css"></style>
