<script setup lang="ts">
import { getProjectCopy, projects } from '~/data/projects'

const { t, locale } = useI18n()
const localePath = useLocalePath()

/** La portada selecciona las demos compartidas sin duplicar sus textos ni su orden editorial. */
const featuredProjects = computed(() => projects.filter(project => project.featured).map(project => ({
  ...project,
  copy: getProjectCopy(project, locale.value),
})))
</script>

<template>
  <section id="featured" class="home-featured" aria-labelledby="featured-title">
    <div class="featured-header" data-motion="rise">
      <span class="featured-number display-p5" aria-hidden="true">02</span>
      <div>
        <p class="label-p5">{{ t('home.featuredLabel') }}</p>
        <P5Stamp id="featured-title" size="h1">{{ t('home.featured') }}</P5Stamp>
      </div>
    </div>
    <div class="featured-grid">
      <div v-for="(project, index) in featuredProjects" :key="project.id" data-motion="rise">
        <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })" class="featured-project" :aria-label="t('projects.openProject', { title: project.title })">
          <P5Card :num="String(index + 1).padStart(2, '0')" :title="project.title" :year="project.year" :kind="t('common.demo')" class="featured-card">
            <template #media><P5Placeholder :label="t('common.image')" /></template>
          </P5Card>
          <div class="featured-copy">
            <h3 class="display-p5">{{ project.title }}</h3>
            <p>{{ project.copy.description }}</p>
            <div class="featured-tags"><P5Tag v-for="tag in project.tags" :key="tag">{{ tag }}</P5Tag></div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="featured-action" data-motion="rise"><P5Button :to="localePath('projects')" variant="outline" size="lg">{{ t('home.allProjects') }} <span aria-hidden="true">→</span></P5Button></div>
  </section>
</template>

<style scoped>
.home-featured { position: relative; padding: 120px var(--page-x); }
.featured-header { display: flex; align-items: flex-end; gap: var(--space-11); margin-bottom: 56px; }
.featured-number { color: var(--p5-red); font-size: clamp(40px, 5vw, 72px); }
.featured-header p { margin: 0 0 var(--space-7); font-size: var(--size-label); }
.featured-header h2 { max-width: 100%; overflow-wrap: anywhere; }
.featured-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: var(--space-13); }
.featured-grid > div { min-width: 0; }
.featured-project { display: flex; flex-direction: column; height: 100%; border: var(--border-3) solid var(--p5-paper); color: var(--p5-paper); background: var(--p5-ink); transition: transform var(--dur-hover) var(--easing-pop), box-shadow var(--dur-hover); }
.featured-project:hover { color: var(--p5-paper); transform: translate(-6px, -6px) rotate(var(--rot-1)); box-shadow: var(--hard-xl); }
.featured-card { border: 0; border-bottom: var(--border-3) solid var(--p5-paper); box-shadow: none; aspect-ratio: 4/3; }
.featured-copy { display: flex; flex-direction: column; gap: var(--space-5); padding: var(--space-10) var(--space-10) 26px; flex: 1; }
.featured-copy h3 { margin: 0; font-size: 30px; line-height: 1.05; }
.featured-copy p { margin: 0; color: var(--p5-gray); font-size: var(--size-body); line-height: 1.45; font-weight: 600; }
.featured-tags { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: auto; padding-top: var(--space-2); }
.featured-action { display: flex; justify-content: flex-end; margin-top: var(--space-14); }
@media (width < 760px) {
  .home-featured { padding-top: var(--space-16); padding-bottom: var(--space-16); }
  .featured-header { gap: var(--space-6); }
  .featured-header h2 { font-size: clamp(32px, 7.5vw, 56px); }
  .featured-number { font-size: 40px; }
  .featured-action { justify-content: flex-start; }
}
</style>
