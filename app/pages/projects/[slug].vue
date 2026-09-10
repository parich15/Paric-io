<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { findProject, getNextProject, getProjectCopy, getProjects } from '~/data/projects'
import { carouselReturnQuery } from '~/utils/carousel'
import { isEditingTarget } from '~/utils/keyboard'

definePageMeta({ key: route => String(route.params.slug) })

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
const project = findProject(slug)
if (!project) throw createError({ statusCode: 404, statusMessage: t('error.title') })

const copy = computed(() => getProjectCopy(project, locale.value))
const next = getNextProject(project)
const number = String(getProjects(project.category).findIndex(candidate => candidate.slug === project.slug) + 1).padStart(2, '0')
const returnQuery = ref(carouselReturnQuery({}, project))
onMounted(() => { returnQuery.value = carouselReturnQuery(route.query, project) })
watch(() => route.query, query => { returnQuery.value = carouselReturnQuery(query, project) })
const backTarget = computed(() => localePath({ name: 'projects', query: returnQuery.value }))
const nextTarget = computed(() => localePath({ name: 'projects-slug', params: { slug: next.slug }, query: returnQuery.value }))
const images = ['common.mainImage', 'common.detailImage', 'common.mobileImage'] as const

/** Escape vuelve al origen desde cualquier foco, pero deja prioridad a edición y diálogos. */
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || isEditingTarget(event.target)) return
  const target = event.target instanceof HTMLElement ? event.target : null
  if (document.querySelector('dialog[open]') || target?.closest('dialog, [role="dialog"], [role="menu"], [aria-modal="true"]')) return
  event.preventDefault()
  void router.push(backTarget.value)
}

useEventListener('keydown', onEscape)

useSeoMeta({
  title: () => `${project.title} · ${t('meta.projectsTitle')}`,
  description: () => copy.value.description,
  ogTitle: () => `${project.title} · ${t('meta.projectsTitle')}`,
  ogDescription: () => copy.value.description,
})
</script>

<template>
  <main id="main-content" tabindex="-1" class="project-detail" data-theme="dark">
    <div class="detail-plane" aria-hidden="true"></div>
    <div class="detail-ring animate-spin-slow" aria-hidden="true"></div>
    <div class="detail-content">
      <div class="detail-toolbar">
        <NuxtLink :to="backTarget" class="detail-back"><span aria-hidden="true">←</span> {{ t('projects.back') }}</NuxtLink>
        <div class="detail-identification">
          <P5Badge tone="paper" :rotate="2">{{ t(project.category === 'pro' ? 'projects.professional' : 'projects.personal') }}</P5Badge>
          <div data-motion="stamp"><P5Badge tone="red" class="detail-number">{{ number }}</P5Badge></div>
        </div>
      </div>

      <div class="detail-hero">
        <div class="detail-introduction" data-motion="rise">
          <div class="detail-client label-p5"><span aria-hidden="true"></span>{{ project.year }} · {{ project.client || t('common.ownProject') }}</div>
          <h1 :aria-label="project.title"><P5Heading :text="project.title" size="title" :shadow="false" aria-hidden="true" /></h1>
          <p class="detail-description">{{ copy.description }}</p>
          <div class="detail-tags"><P5Tag v-for="tag in project.tags" :key="tag">{{ tag }}</P5Tag></div>
          <div class="detail-demo">
            <P5Badge tone="paper">{{ t('common.demo') }}</P5Badge>
            <p>{{ t('projects.demoNotice') }}</p>
          </div>
          <div class="detail-actions">
            <P5Button size="lg" disabled aria-describedby="demo-destination">{{ t('projects.live') }}</P5Button>
            <P5Button size="lg" variant="outline" disabled aria-describedby="demo-destination">{{ t('projects.code') }}</P5Button>
          </div>
          <p id="demo-destination" class="detail-unavailable">{{ t('projects.noDestination') }}</p>
        </div>
        <div data-motion="rise"><ProjectImage :label="t('common.mainImage')" hero :rotation="2" /></div>
      </div>

      <section class="detail-facts" :aria-label="t('projects.details')" data-motion="rise">
        <P5FactCard v-for="fact in copy.facts" :key="fact.label" :label="fact.label" :value="fact.value" />
      </section>

      <div class="detail-story">
        <section aria-labelledby="project-challenge" data-motion="rise">
          <P5Stamp id="project-challenge" as="h2" size="h2" tone="paper">{{ t('projects.challenge') }}</P5Stamp>
          <p>{{ copy.challenge }}</p>
        </section>
        <section aria-labelledby="project-solution" data-motion="rise">
          <P5Stamp id="project-solution" as="h2" size="h2" tone="red">{{ t('projects.solution') }}</P5Stamp>
          <p>{{ copy.solution }}</p>
        </section>
      </div>

      <section class="detail-gallery" aria-labelledby="project-gallery">
        <div data-motion="rise"><P5Stamp id="project-gallery" as="h2" size="h2" tone="paper">{{ t('projects.gallery') }}</P5Stamp></div>
        <div class="detail-images">
          <div v-for="(image, imageIndex) in images" :key="image" data-motion="rise">
            <ProjectImage :label="t(image)" :rotation="imageIndex % 2 ? 2 : -2" />
          </div>
        </div>
      </section>

      <div data-motion="rise">
        <NuxtLink :to="nextTarget" class="detail-next">
          <span class="label-p5">{{ t('projects.next') }}</span>
          <span class="display-p5">{{ next.title }} <span aria-hidden="true">→</span></span>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<style scoped src="~/assets/css/pages/project-detail.css"></style>
