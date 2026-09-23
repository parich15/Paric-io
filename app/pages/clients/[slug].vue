<script setup lang="ts">
import { findClient, getClientProjects } from '~/data/clients'
import { getProjectCopy } from '~/data/projects'

definePageMeta({ key: route => String(route.params.slug) })
const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const client = findClient(typeof route.params.slug === 'string' ? route.params.slug : '')
if (!client) throw createError({ statusCode: 404, statusMessage: t('error.title'), fatal: import.meta.client })
const copy = computed(() => client.content[locale.value])
const relatedProjects = getClientProjects(client)
useSeoMeta({ title: () => `${client.name} · ${t('common.clients')}`, description: () => copy.value.description, ogTitle: () => client.name, ogDescription: () => copy.value.description })
</script>

<template>
  <main id="main-content" tabindex="-1" class="client-detail" data-theme="dark">
    <div class="client-detail-plane" aria-hidden="true"></div>
    <div class="client-detail-toolbar"><P5Button :to="localePath('clients')" variant="paper"><span aria-hidden="true">← </span>{{ t('clients.back') }}</P5Button></div>
    <div class="client-dossier">
      <section class="client-identity" aria-labelledby="client-title" data-motion="rise">
        <div class="client-identity-logo"><ClientLogo :client="client" /></div>
        <span class="client-identity-sector label-p5"><span>{{ copy.sector }}</span></span>
        <h1 id="client-title"><P5Heading :text="client.name" size="h1" /></h1>
        <p class="client-description">{{ copy.description }}</p>
        <div class="client-website">
          <span class="label-p5">{{ t('clients.website') }}</span>
          <P5Button v-if="client.website" :href="client.website" variant="outline" target="_blank" rel="noopener noreferrer">{{ t('clients.visitWebsite') }}</P5Button>
          <p v-else>{{ t('clients.noWebsite') }}</p>
        </div>
        <p v-if="client.demo" class="client-demo">{{ t('clients.demoNotice') }}</p>
      </section>
      <section class="client-projects" aria-labelledby="client-projects-title" data-motion="rise">
        <header class="client-projects-heading">
          <P5Stamp id="client-projects-title" as="h2" tone="paper">{{ t('common.projects') }}</P5Stamp>
          <span class="label-p5">{{ t('clients.projectCount', relatedProjects.length) }}</span>
        </header>
        <ul v-if="relatedProjects.length" class="client-project-list">
          <li v-for="project in relatedProjects" :key="project.slug">
            <NuxtLink :to="localePath({ name: 'projects-slug', params: { slug: project.slug } })" class="client-project-link" :aria-label="t('projects.openProject', { title: project.title })">
              <div class="client-project-meta label-p5"><span>{{ project.year }}</span><span v-if="project.demo">{{ t('common.demo') }}</span></div>
              <h3 class="display-p5">{{ project.title }}</h3>
              <p>{{ getProjectCopy(project, locale).description }}</p>
              <div class="client-project-tags"><P5Tag v-for="tag in project.tags" :key="tag">{{ tag }}</P5Tag></div>
              <span class="client-project-open label-p5">{{ t('projects.view') }} <span aria-hidden="true">→</span></span>
            </NuxtLink>
          </li>
        </ul>
        <p v-else>{{ t('clients.noProjects') }}</p>
      </section>
    </div>
  </main>
</template>

<style scoped src="~/assets/css/pages/client-detail.css"></style>
