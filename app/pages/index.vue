<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: () => t('meta.homeTitle'), description: () => t('meta.homeDescription') })
</script>

<template>
  <main id="main-content" class="home-page" tabindex="-1">
    <HomeHero />
    <div class="home-marquee" aria-hidden="true">
      <span v-for="repeat in 4" :key="repeat">{{ t('home.marquee') }}</span>
    </div>
    <HomeFeatured />
    <HomeAbout />
    <HomeContact />
    <footer class="home-footer label-p5">
      <span>© 2026 Paric.io · Oscar Paricio</span>
      <span>{{ t('home.madeWith') }}</span>
    </footer>
    <QuickMenu />
  </main>
</template>

<style scoped src="~/assets/css/pages/home.css"></style>
