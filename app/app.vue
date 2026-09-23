<script setup lang="ts">
const { t } = useI18n()
const localeHead = useLocaleHead({ seo: true })
const config = useRuntimeConfig()
const shareImage = new URL('/images/retrato-oscar-paricio.jpg', config.public.siteUrl).href
useSeoMeta({
  author: 'Oscar Paricio',
  applicationName: 'Paric.io',
  ogSiteName: 'Paric.io',
  ogType: 'website',
  ogImage: shareImage,
  ogImageAlt: 'Oscar Paricio',
  twitterCard: 'summary',
  twitterImage: shareImage,
  twitterImageAlt: 'Oscar Paricio',
})
useHead(() => ({ htmlAttrs: { lang: localeHead.value.htmlAttrs?.lang }, link: localeHead.value.link, meta: localeHead.value.meta }))
</script>

<template>
  <div>
    <a class="skip-link" href="#main-content">{{ t('common.skip') }}</a>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
    <AppMotion />
    <AppIntro />
    <AppCursor />
  </div>
</template>
