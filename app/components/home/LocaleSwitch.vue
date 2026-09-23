<script setup lang="ts">
import type { Locale } from '~/data/projects'

const { t } = useI18n()
const { locale, localeTarget, pendingLocale, rememberLocale } = usePortfolioLocale()
const languages: Locale[] = ['es', 'en']
</script>

<template>
  <nav class="locale-switch label-p5" :class="{ 'is-loading': pendingLocale }" :aria-label="t('common.language')" :aria-busy="pendingLocale ? 'true' : undefined">
    <NuxtLink v-for="language in languages" :key="language" :to="localeTarget(language)" :lang="language" :hreflang="language" :aria-current="locale === language ? 'true' : undefined" :aria-label="language.toUpperCase()" :class="{ 'is-pending': pendingLocale === language }" @click="rememberLocale(language, $event)">{{ language }}</NuxtLink>
    <span class="locale-switch-status" role="status">{{ pendingLocale ? t('common.loading') : '' }}</span>
  </nav>
</template>

<style scoped src="~/assets/css/components/locale-switch.css"></style>
