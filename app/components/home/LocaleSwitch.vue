<script setup lang="ts">
import type { Locale } from '~/data/projects'

const { t } = useI18n()
const { locale, localeTarget, rememberLocale } = usePortfolioLocale()
const languages: Locale[] = ['es', 'en']
</script>

<template>
  <nav class="locale-switch label-p5" :aria-label="t('common.language')">
    <NuxtLink v-for="language in languages" :key="language" :to="localeTarget(language)" :lang="language" :hreflang="language" :aria-current="locale === language ? 'true' : undefined" :aria-label="language.toUpperCase()" @click="rememberLocale(language)">{{ language }}</NuxtLink>
  </nav>
</template>

<style scoped src="~/assets/css/components/locale-switch.css"></style>
