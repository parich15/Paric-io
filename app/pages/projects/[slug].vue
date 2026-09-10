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

<style scoped>
.project-detail { position: relative; isolation: isolate; min-height: 100svh; overflow: clip; padding: var(--page-top) var(--page-x) var(--space-16); background: var(--bg); color: var(--fg); }
.detail-plane { position: absolute; top: -10%; left: -14%; width: 42%; height: 130%; background: var(--accent); transform: skewX(var(--skew-lg)); }
.detail-plane::after { content: ''; position: absolute; inset: 0; background-image: var(--halftone-ink); background-size: var(--halftone-size-lg); opacity: 0.25; }
.detail-ring { position: absolute; right: -6vw; top: 6vh; width: min(30vw, 380px); aspect-ratio: 1; border: var(--border-6) dashed var(--fg); border-radius: var(--radius-full); opacity: 0.3; }
.detail-content { position: relative; z-index: 1; }
.detail-toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-7); margin-bottom: var(--space-14); }
.detail-back { display: inline-flex; align-items: center; gap: var(--space-4); min-height: 44px; padding: var(--space-3) var(--space-8); background: var(--p5-paper); color: var(--p5-ink); border: var(--border-3) solid var(--p5-ink); box-shadow: var(--hard-ink); font-family: var(--type-label); font-weight: 800; font-size: var(--size-btn-sm); text-transform: uppercase; letter-spacing: var(--track-label-wide); transform: skewX(var(--skew)); transition: transform var(--dur-hover) var(--easing-pop); }
.detail-back:hover { color: var(--p5-ink); transform: skewX(var(--skew)) scale(1.06) rotate(var(--rot-2)); }
.detail-identification { display: flex; gap: var(--space-5); align-items: center; }
.detail-number { font-family: var(--type-display); font-size: clamp(28px, 3.5vw, 52px); line-height: 1; }
.detail-hero { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); gap: var(--space-14); align-items: center; }
.detail-introduction { display: flex; flex-direction: column; gap: var(--space-11); min-width: 0; }
.detail-client { display: inline-flex; align-self: flex-start; align-items: center; gap: var(--space-5); padding: var(--space-2) var(--space-6); font-size: var(--size-btn-sm); letter-spacing: var(--track-label-xwide); background: var(--p5-paper); color: var(--p5-ink); transform: rotate(var(--rot-2)) skewX(var(--skew-sm)); }
.detail-client > span { width: 10px; height: 10px; flex: none; rotate: 45deg; background: var(--accent); }
.detail-introduction h1 { margin: 0; }
.detail-introduction h1 :deep(span) { text-shadow: var(--text-shadow-ink); }
.detail-description { margin: 0; font-size: clamp(18px, 1.6vw, 22px); line-height: 1.45; font-weight: 600; }
.detail-tags, .detail-actions { display: flex; flex-wrap: wrap; gap: var(--space-7); }
.detail-tags { gap: var(--space-3); }
.detail-demo p, .detail-unavailable { margin: var(--space-5) 0 0; font-size: var(--size-body); line-height: 1.5; }
.detail-unavailable { margin: 0; }
.detail-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: var(--space-11); margin-top: var(--space-16); }
.detail-story { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: var(--space-14); margin-top: var(--space-16); }
.detail-story section { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-8); }
.detail-story p { margin: 0; max-width: 520px; font-size: var(--size-body); line-height: 1.5; font-weight: 600; }
.detail-gallery { margin-top: var(--space-15); }
.detail-images { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: var(--space-12); margin-top: var(--space-14); }
.detail-next { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-9); margin-top: var(--space-17); padding: var(--space-12) var(--space-13); background: var(--p5-paper); color: var(--p5-ink); box-shadow: var(--hard-xl); transform: skewX(var(--skew-xs)); transition: transform var(--dur-hover) var(--easing-pop), background var(--dur-hover), color var(--dur-hover); }
.detail-next > span { transform: skewX(calc(-1 * var(--skew-xs))); }
.detail-next .label-p5 { font-size: var(--size-btn-sm); letter-spacing: var(--track-label-xwide); }
.detail-next .display-p5 { font-size: clamp(30px, 5vw, 72px); line-height: 0.95; overflow-wrap: anywhere; }
.detail-next:hover { background: var(--accent); color: var(--accent-fg); transform: skewX(var(--skew-xs)) scale(1.01); }
@media (max-width: 759px) {
  .detail-toolbar { margin-bottom: var(--space-13); }
  .detail-introduction { gap: var(--space-9); }
  .detail-next { padding-inline: var(--space-9); }
}
</style>
