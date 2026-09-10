<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: () => t('meta.notFound'), robots: 'noindex' })
</script>

<template>
  <main id="main-content" class="error-page" tabindex="-1">
    <span class="error-number display-p5" aria-hidden="true">{{ error.statusCode }}</span>
    <h1><P5Heading :text="t('error.title')" /></h1>
    <p>{{ t('error.description') }}</p>
    <P5Button :href="localePath('/')" variant="paper">{{ t('error.back') }}</P5Button>
  </main>
</template>

<style scoped src="~/assets/css/pages/error.css"></style>
