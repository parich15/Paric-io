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

<style scoped>
.locale-switch { display: flex; gap: var(--space-1); background: var(--p5-ink); color: var(--p5-paper); padding: 0 var(--space-1); transform: skewX(var(--skew)); }
.locale-switch a { display: grid; place-items: center; min-width: 44px; min-height: 44px; color: var(--p5-paper); font-size: var(--size-label); }
.locale-switch a[aria-current], .locale-switch a:hover { background: var(--p5-paper); color: var(--p5-ink); }
.locale-switch a:focus-visible { outline: var(--border-3) solid var(--p5-red); outline-offset: 3px; }
</style>
