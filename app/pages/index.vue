<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('meta.homeTitle'), description: () => t('meta.homeDescription') })
</script>

<template>
  <main id="main-content" tabindex="-1"><h1>Oscar Paricio</h1></main>
</template>
