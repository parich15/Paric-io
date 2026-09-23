<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { findProject, getNextProject, getProjectCopy, getProjects } from '~/data/projects'
import { carouselReturnQuery } from '~/utils/carousel'
import { isEditingTarget } from '~/utils/keyboard'
import { findProjectClient } from '~/data/clients'

definePageMeta({ key: route => String(route.params.slug) })

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
const project = findProject(slug)
if (!project) throw createError({ statusCode: 404, statusMessage: t('error.title'), fatal: import.meta.client })

const copy = computed(() => getProjectCopy(project, locale.value))
const next = getNextProject(project)
const client = findProjectClient(project.slug)
const number = String(getProjects(project.category).findIndex(candidate => candidate.slug === project.slug) + 1).padStart(2, '0')
const returnQuery = ref(carouselReturnQuery({}, project))
onMounted(() => { returnQuery.value = carouselReturnQuery(route.query, project) })
watch(() => route.query, query => { returnQuery.value = carouselReturnQuery(query, project) })
const backTarget = computed(() => localePath({ name: 'projects', query: returnQuery.value }))
const nextTarget = computed(() => localePath({ name: 'projects-slug', params: { slug: next.slug }, query: returnQuery.value }))
/** Dirección visible en la barra del navegador: solo el dominio del enlace público. */
const address = project.website ? new URL(project.website).host.replace(/^www\./, '') : undefined
const heroMedia = project.media?.[0]
const heroPhone = project.media?.find(media => media.frame === 'phone' && media !== heroMedia)
const imageLabels = ['common.mainImage', 'common.detailImage', 'common.mobileImage'] as const
/** Las demos sin capturas enseñan huecos etiquetados en lugar de ocultar la galería. */
const galleryItems = computed(() => (project.media ?? (project.demo ? imageLabels.map(() => ({ src: undefined, type: 'image' as const, frame: undefined, caption: undefined })) : []))
  .map((media, index) => ({
    src: media.src,
    type: media.type,
    frame: media.frame,
    caption: media.caption?.[locale.value],
    label: media.caption?.[locale.value] ?? `${t(imageLabels[index] ?? 'common.detailImage')} · ${project.title}`,
  })))

/** Escape vuelve al origen desde cualquier foco, pero deja prioridad a edición y diálogos. */
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || event.repeat || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || isEditingTarget(event.target)) return
  const target = event.target instanceof HTMLElement ? event.target : null
  if (document.querySelector('dialog[open]') || target?.closest('dialog[open], [role="dialog"], [role="menu"], [aria-modal="true"]')) return
  event.preventDefault()
  void router.push(backTarget.value)
}

useEventListener('keydown', onEscape)

useSeoMeta({
  title: () => `${project.title} · ${t('meta.projectsTitle')}`,
  description: () => copy.value.description,
  ogTitle: () => `${project.title} · Paric.io`,
  ogDescription: () => copy.value.description,
  twitterTitle: () => `${project.title} · Paric.io`,
  twitterDescription: () => copy.value.description,
})
</script>

<template>
  <main id="main-content" tabindex="-1" class="project-detail" data-theme="dark">
    <div class="detail-plane" aria-hidden="true"></div>
    <div class="detail-ring animate-spin-slow" aria-hidden="true"></div>
    <span class="detail-bignum display-p5" aria-hidden="true">{{ number }}</span>
    <div class="detail-content">
      <div class="detail-toolbar">
        <NuxtLink :to="backTarget" class="detail-back"><span aria-hidden="true">←</span> {{ t('projects.back') }}</NuxtLink>
        <div class="detail-identification">
          <P5Badge tone="paper" :rotate="2" class="detail-float">{{ t(project.category === 'pro' ? 'projects.professional' : 'projects.personal') }}</P5Badge>
          <div data-motion="stamp"><P5Badge tone="red" class="detail-number detail-float">{{ number }}</P5Badge></div>
        </div>
      </div>

      <div class="detail-hero">
        <div class="detail-introduction" data-motion="rise">
          <div class="detail-client label-p5"><span aria-hidden="true"></span><template v-if="project.year">{{ project.year }} · </template>{{ project.client || t('common.ownProject') }}</div>
          <NuxtLink v-if="client" class="detail-client-link label-p5" :to="localePath({ name: 'clients-slug', params: { slug: client.slug } })">{{ t('clients.viewClient') }} <span aria-hidden="true">→</span></NuxtLink>
          <h1 :aria-label="project.title"><P5Heading :text="project.title" size="title" :shadow="false" aria-hidden="true" /></h1>
          <p class="detail-description">{{ copy.description }}</p>
          <div class="detail-tags"><P5Tag v-for="tag in project.tags" :key="tag">{{ tag }}</P5Tag></div>
          <div v-if="project.demo" class="detail-demo">
            <P5Badge tone="paper">{{ t('common.demo') }}</P5Badge>
            <p>{{ t('projects.demoNotice') }}</p>
          </div>
          <div class="detail-actions">
            <P5Button size="lg" :href="project.website" :disabled="!project.website" :aria-describedby="!project.website ? 'demo-destination' : undefined">{{ t('projects.live') }}</P5Button>
            <P5Button v-if="project.designUrl" size="lg" variant="outline" :href="project.designUrl">{{ t('projects.design') }}</P5Button>
            <P5Button v-else size="lg" variant="outline" disabled aria-describedby="demo-destination">{{ t('projects.code') }}</P5Button>
          </div>
          <p id="demo-destination" class="detail-unavailable">{{ t(project.demo ? 'projects.noDestination' : 'projects.noRepository') }}</p>
        </div>
        <div class="detail-visual" :class="{ 'detail-visual--phone': heroPhone }" data-motion="rise">
          <ProjectImage :src="heroMedia?.src" :type="heroMedia?.type" :frame="heroMedia?.frame" :address="address" :label="heroMedia?.caption?.[locale] ?? `${t('common.mainImage')} · ${project.title}`" hero :rotation="2" />
          <ProjectImage v-if="heroPhone" class="detail-phone" :src="heroPhone.src" frame="phone" :label="heroPhone.caption?.[locale] ?? `${t('common.mobileImage')} · ${project.title}`" :rotation="-4" />
        </div>
      </div>

      <section class="detail-facts" :aria-label="t('projects.details')" data-motion="rise">
        <P5FactCard v-for="fact in copy.facts" :key="fact.label" :label="fact.label" :value="fact.value" />
      </section>

      <div v-if="copy.challenge || copy.solution" class="detail-story">
        <section v-if="copy.challenge" aria-labelledby="project-challenge" data-motion="rise">
          <P5Stamp id="project-challenge" as="h2" size="h2" tone="paper" class="detail-float">{{ t('projects.challenge') }}</P5Stamp>
          <p>{{ copy.challenge }}</p>
        </section>
        <section v-if="copy.solution" aria-labelledby="project-solution" data-motion="rise">
          <P5Stamp id="project-solution" as="h2" size="h2" tone="red" class="detail-float">{{ t('projects.solution') }}</P5Stamp>
          <p>{{ copy.solution }}</p>
        </section>
      </div>

      <section v-if="copy.flow?.length" class="detail-flow" aria-labelledby="project-flow">
        <div data-motion="rise"><P5Stamp id="project-flow" as="h2" size="h2" tone="ink" class="detail-float">{{ t('projects.flow') }}</P5Stamp></div>
        <ol class="detail-flow-steps" data-motion="rise">
          <li v-for="(stepLabel, index) in copy.flow" :key="stepLabel" :style="{ '--i': index }">
            <span class="display-p5" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="label-p5">{{ stepLabel }}</span>
          </li>
        </ol>
      </section>

      <section v-if="copy.features?.length" class="detail-features" aria-labelledby="project-features">
        <div data-motion="rise"><P5Stamp id="project-features" as="h2" size="h2" tone="red" class="detail-float">{{ t('projects.features') }}</P5Stamp></div>
        <ul class="detail-feature-grid">
          <li v-for="(feature, index) in copy.features" :key="feature.title" class="detail-feature" data-motion="rise">
            <span class="detail-feature-number display-p5" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="display-p5">{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </li>
        </ul>
      </section>

      <ProjectSites v-if="project.sites?.length" :groups="project.sites" :total="project.sitesTotal" />

      <ProjectGallery v-if="galleryItems.length" :items="galleryItems" :title="project.title" />

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
