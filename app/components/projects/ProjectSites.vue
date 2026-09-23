<script setup lang="ts">
import type { ProjectSiteGroup } from '~/data/projects'

/** Muestra de sites en producción agrupados por sector; cada placa abre el site real en otra pestaña. */
defineProps<{ groups: ProjectSiteGroup[], total?: number }>()

const { t, locale } = useI18n()
</script>

<template>
  <section class="project-sites" aria-labelledby="project-sites">
    <div class="sites-header" data-motion="rise">
      <P5Stamp id="project-sites" as="h2" size="h2" tone="paper" class="sites-float">{{ t('projects.sites') }}</P5Stamp>
      <p v-if="total" class="sites-total">
        <span class="display-p5" aria-hidden="true">+{{ total }}</span>
        <span class="label-p5">{{ t('projects.sitesMore', { count: total }) }}</span>
      </p>
    </div>
    <div class="sites-groups">
      <div v-for="group in groups" :key="group.label.en" class="sites-group" data-motion="rise">
        <h3 class="sites-label label-p5">{{ group.label[locale] }}</h3>
        <ul class="sites-list">
          <li v-for="(site, index) in group.sites" :key="site.url" :style="{ '--i': index }">
            <a class="site-link" :href="site.url" target="_blank" rel="noopener noreferrer">
              <span class="site-icon"><img :src="site.icon" alt="" width="96" height="96" loading="lazy" decoding="async" /></span>
              <span class="site-name display-p5">{{ site.name }}</span>
              <span class="site-arrow" aria-hidden="true">↗</span>
              <span class="sr-only">{{ t('common.newTab') }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/components/project-sites.css"></style>
