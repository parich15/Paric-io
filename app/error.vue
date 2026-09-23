<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => t(notFound.value ? 'error.title' : 'error.unavailable'))
// El mismo fallback sirve para cualquier URL: el router debe conservar la dirección del visitante.
if (import.meta.prerender) delete useNuxtApp().payload.path
useSeoMeta({ title: () => notFound.value ? t('meta.notFound') : title.value, robots: 'noindex, nofollow' })
useHead(() => ({ htmlAttrs: { lang: locale.value === 'en' ? 'en-GB' : 'es-ES' } }))
</script>

<template>
  <main id="main-content" class="error-page" tabindex="-1" aria-labelledby="error-title">
    <div class="error-plane" aria-hidden="true"><div class="halftone-ink"></div></div>
    <P5Heading :text="String(error.statusCode)" :offset="2" size="title" class="error-number" aria-hidden="true" />
    <div class="error-content">
      <p class="error-code label-p5">{{ t('error.code', { code: error.statusCode }) }}</p>
      <h1 id="error-title" class="error-title" :aria-label="title"><P5Heading :text="title" class="error-heading" aria-hidden="true" /></h1>
      <p class="error-description">{{ t(notFound ? 'error.description' : 'error.retry') }}</p>
      <P5Button :href="localePath('/')" variant="paper" size="lg">{{ t('error.back') }}</P5Button>
    </div>
  </main>
</template>

<style scoped src="~/assets/css/pages/error.css"></style>
