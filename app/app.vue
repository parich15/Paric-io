<script setup lang="ts">
const { t } = useI18n()
const localeHead = useLocaleHead({ seo: true })
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
  </div>
</template>
