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
        @pointercancel="carousel.cancelDrag" @lostpointercapture="carousel.cancelDrag" @click.capture="carousel.onClickCapture"
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

<style scoped>
.projects-page { background: var(--bg); color: var(--fg); transition: background var(--dur-theme), color var(--dur-theme); }
.projects-screen { position: relative; isolation: isolate; height: 100svh; min-height: 560px; overflow: hidden; }
.projects-plane {
  position: absolute;
  top: -10%;
  right: -14%;
  width: 46%;
  height: 130%;
  background: var(--accent);
  transform: skewX(var(--skew-lg));
  transition: background var(--dur-theme);
}
.projects-plane::after { content: ''; position: absolute; inset: 0; background-image: var(--halftone-ink); background-size: var(--halftone-size-lg); opacity: 0.25; }
[data-theme='light'] .projects-plane { background: var(--fg); }
[data-theme='light'] .projects-plane::after { background-image: var(--halftone-paper); }
.projects-dots { position: absolute; inset: 0 42% 0 -10%; transform: skewX(var(--skew-lg)); opacity: 0; transition: opacity var(--dur-theme); }
[data-theme='light'] .projects-dots { opacity: 0.32; }
.projects-zigzag { position: absolute; top: -10%; left: -8%; width: 22%; height: 130%; transform: skewX(-14deg); opacity: 0.12; }
[data-theme='light'] .projects-zigzag { opacity: 0.16; }
.projects-number { position: absolute; right: 4vw; bottom: -4vh; font-size: clamp(180px, 38vw, 560px); line-height: 0.8; rotate: var(--rot-6); opacity: 0.18; pointer-events: none; user-select: none; }
.project-categories { position: absolute; z-index: var(--z-nav); left: 2.5vw; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-8); }
.project-category { padding: var(--space-4) var(--space-10) var(--space-5); }
.project-stage { position: absolute; inset: 0; z-index: var(--z-stage); perspective: 1400px; perspective-origin: 50% 45%; cursor: grab; touch-action: pan-y; user-select: none; }
.project-stage.is-dragging { cursor: grabbing; }
.project-stage.is-dragging :deep(.carousel-card) { transition: none; }
.project-caption { position: absolute; left: max(9vw, 120px); bottom: 9vh; z-index: var(--z-ui); display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-6); max-width: 70vw; pointer-events: none; }
.project-caption h1 { margin: 0; transform: rotate(var(--rot-4)); }
.project-description { max-width: min(520px, 80vw); background: var(--fg); color: var(--bg); padding: var(--space-1) var(--space-6); border: var(--border-3) solid var(--bg); box-shadow: var(--hard-sm); transform: skewX(var(--skew)) rotate(var(--rot-1)); }
.project-description p { margin: 0; font-family: var(--type-label); font-weight: 800; font-size: clamp(14px, 1.4vw, 20px); letter-spacing: 0.06em; line-height: 1.3; transform: skewX(calc(-1 * var(--skew))); }
.project-controls { position: absolute; right: 4vw; bottom: 10vh; z-index: var(--z-ui); display: flex; align-items: center; gap: var(--space-6); }
.project-arrow { width: 52px; height: 52px; padding: 0; justify-content: center; font-family: var(--type-display); font-size: 26px; background: var(--bg); }
.project-arrow:hover { background: var(--accent); color: var(--accent-fg); }
.project-counter { color: var(--accent-fg); text-shadow: var(--text-shadow-hard); font-size: clamp(24px, 3vw, 40px); white-space: nowrap; }
.project-counter small { font-size: 0.6em; color: var(--p5-gray); text-shadow: none; }
.project-keyboard { position: absolute; left: 50%; bottom: max(16px, calc(5vh - var(--space-11))); z-index: var(--z-ui); display: flex; align-items: center; gap: var(--space-10); padding: var(--space-2) var(--space-8); background: var(--fg); color: var(--bg); border: var(--border-3) solid var(--bg); box-shadow: var(--hard-md); transform: translateX(-50%) skewX(var(--skew)); white-space: nowrap; pointer-events: none; }
.project-static-list { padding: var(--space-14) var(--page-x); }
.project-static-list li { margin-block: var(--space-11); }
.project-static-list a { display: inline-block; padding-block: var(--space-5); text-decoration: underline; }
@media (min-width: 760px) and (max-height: 699px) {
  .project-caption { bottom: 6vh; }
}
@media (max-width: 759px) {
  .projects-screen { height: auto; min-height: 100svh; display: flex; flex-direction: column; padding-top: var(--page-top); }
  .project-stage { position: relative; inset: auto; flex: none; width: 100%; height: max(280px, 68vw); max-height: 500px; perspective: 900px; }
  .project-caption { position: relative; inset: auto; margin: -12px 5vw 0; max-width: 90vw; gap: var(--space-6); }
  .project-caption :deep(.text-h1) { font-size: clamp(40px, 7vw, 54px); }
  .project-description { max-width: 88vw; }
  .project-controls { position: relative; inset: auto; justify-content: flex-end; margin: var(--space-11) 5vw var(--space-7); }
  .project-counter { padding: var(--space-3); background: var(--bg); color: var(--fg); }
  .project-counter small { color: var(--fg-muted); }
  .project-categories { position: relative; inset: auto; order: 4; transform: none; flex-direction: row; justify-content: center; align-items: center; gap: var(--space-4); margin-top: auto; padding: var(--space-11) 5vw var(--space-13); }
  .project-category { writing-mode: horizontal-tb !important; font-size: 18px; min-height: 44px; padding-inline: var(--space-6); }
  .project-category[aria-pressed='true'] { font-size: 22px; }
  .projects-number { bottom: 12%; }
}
</style>
