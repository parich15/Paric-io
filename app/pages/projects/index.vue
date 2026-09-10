<script setup lang="ts">
import { getProjectCopy, getProjects } from '~/data/projects'
import { projectQuery } from '~/utils/carousel'

definePageMeta({ name: 'projects' })

const root = ref<HTMLElement | null>(null)
const interactive = ref(false)
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const carousel = useProjectCarousel(root)
const { category, projects, index, current, query, dragging } = carousel
const copy = computed(() => getProjectCopy(current.value, locale.value))
const categories = (['pro', 'personal'] as const).map(category => ({ category, projects: getProjects(category) }))
const number = computed(() => String(index.value + 1).padStart(2, '0'))
const total = computed(() => String(projects.value.length).padStart(2, '0'))

useSeoMeta({
  title: () => t('meta.projectsTitle'),
  description: () => t('meta.projectsDescription'),
  ogTitle: () => t('meta.projectsTitle'),
  ogDescription: () => t('meta.projectsDescription'),
})

onMounted(async () => {
  interactive.value = true
  await nextTick()
  const target = route.query.slug ? root.value?.querySelector<HTMLElement>('[data-project-card][aria-current="true"]') : root.value
  target?.focus({ preventScroll: true })
})
</script>

<template>
  <main id="main-content" ref="root" :data-theme="category === 'personal' ? 'light' : 'dark'" tabindex="-1" class="projects-page">
    <div class="projects-screen">
      <div class="projects-plane" aria-hidden="true"></div>
      <div class="projects-dots halftone-ink" aria-hidden="true"></div>
      <div class="projects-zigzag zigzag animate-zig" aria-hidden="true"></div>
      <div class="projects-number display-p5 text-stroke-fg" aria-hidden="true">{{ number }}</div>

      <nav class="project-categories" :aria-label="t('projects.chooseCategory')">
        <P5NavItem
          v-for="(item, categoryIndex) in categories" :key="item.category" vertical
          class="project-category" :active="category === item.category" :rotate="categoryIndex ? 2 : -1"
          :aria-pressed="category === item.category" @click="carousel.setCategory(item.category)"
        >{{ t(item.category === 'pro' ? 'projects.professional' : 'projects.personal') }}</P5NavItem>
      </nav>

      <div
        class="project-stage" :class="{ 'is-dragging': dragging }" role="group" :aria-label="t('projects.all')"
        :aria-describedby="'project-drag-hint'"
        @pointerdown="carousel.onPointerDown" @pointermove="carousel.onPointerMove" @pointerup="carousel.onPointerUp"
        @pointercancel="carousel.cancelDrag" @lostpointercapture.self="carousel.cancelDrag" @click.capture="carousel.onClickCapture"
      >
        <ProjectCarouselCard
          v-for="(project, cardIndex) in projects" :key="project.slug" :project="project" :index="cardIndex"
          :distance="carousel.distance(cardIndex)" :active="cardIndex === index"
          :to="localePath({ name: 'projects-slug', params: { slug: project.slug }, query: projectQuery(project, query) })"
          @select="carousel.select"
        />
      </div>
      <span id="project-drag-hint" class="sr-only">{{ t('projects.drag') }}</span>

      <div class="project-caption">
        <div :key="current.slug" data-motion="stamp">
          <h1 :aria-label="current.title"><P5Heading :text="current.title" :offset="1" :plates="category === 'personal'" :shadow="category === 'pro'" aria-hidden="true" /></h1>
        </div>
        <div class="project-description"><p>{{ copy.description }}</p></div>
      </div>

      <div class="project-controls">
        <P5Button variant="outline" class="project-arrow" :aria-label="t('common.previous')" @click="carousel.step(-1)"><span aria-hidden="true">←</span></P5Button>
        <div class="project-counter display-p5" role="status" aria-live="polite" aria-atomic="true">
          <span class="sr-only">{{ t('projects.position', { current: index + 1, total: projects.length }) }} · {{ current.title }}</span>
          <span aria-hidden="true">{{ number }} <small>/ {{ total }}</small></span>
        </div>
        <P5Button variant="outline" class="project-arrow" :aria-label="t('common.next')" @click="carousel.step(1)"><span aria-hidden="true">→</span></P5Button>
      </div>

      <div class="project-keyboard keyboard-hints" aria-hidden="true">
        <P5Kbd keys="←→">{{ t('common.navigate') }}</P5Kbd>
        <P5Kbd keys="↵">{{ t('common.open') }}</P5Kbd>
        <span class="label-p5">{{ t('projects.keyboardCategory') }}</span>
      </div>
    </div>

    <section v-if="!interactive" class="project-static-list" :aria-label="t('projects.all')">
        <div v-for="item in categories" :key="item.category">
          <h2 class="display-p5 text-h2">{{ t(item.category === 'pro' ? 'projects.professional' : 'projects.personal') }}</h2>
          <ul>
            <li v-for="project in item.projects" :key="project.slug">
              <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: project.slug }, query: projectQuery(project) })">{{ project.title }}</NuxtLink>
              <p>{{ getProjectCopy(project, locale).description }}</p>
            </li>
          </ul>
        </div>
    </section>
  </main>
</template>

<style scoped src="~/assets/css/pages/projects.css"></style>
