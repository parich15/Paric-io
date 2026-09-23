<script setup lang="ts">
import { getProjectCopy, projects } from '~/data/projects'

const { t, locale } = useI18n()
const localePath = useLocalePath()

/** La portada selecciona los proyectos compartidos sin duplicar sus textos ni su orden editorial. */
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
        <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })" class="featured-project">
          <P5Card :num="String(index + 1).padStart(2, '0')" :title="project.title" :year="project.year" :kind="t(project.category === 'pro' ? 'projects.professional' : 'projects.personal')" class="featured-card">
            <template #media><img v-if="project.cover" :src="project.cover" alt="" loading="lazy" class="project-cover" /><P5Placeholder v-else :label="t('common.image')" /></template>
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

<style scoped src="~/assets/css/components/home-featured.css"></style>
