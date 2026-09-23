<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const { t } = useI18n()
const marqueeItems = computed(() => t('home.marquee').split('·').map(item => item.trim()).filter(Boolean))
const footer = useTemplateRef<HTMLElement>('footer')
const footerVisible = ref(false)
useIntersectionObserver(footer, ([entry]) => {
  footerVisible.value = !!entry?.isIntersecting && entry.intersectionRatio >= .5
}, { threshold: .5 })
useSeoMeta({
  title: () => t('meta.homeTitle'),
  description: () => t('meta.homeDescription'),
  ogTitle: () => `${t('meta.homeTitle')} · Paric.io`,
  ogDescription: () => t('meta.homeDescription'),
  twitterTitle: () => `${t('meta.homeTitle')} · Paric.io`,
  twitterDescription: () => t('meta.homeDescription'),
})
</script>

<template>
  <main id="main-content" class="home-page" tabindex="-1">
    <HomeHero />
    <div class="home-marquee" aria-hidden="true">
      <div class="home-marquee-track">
        <div v-for="group in 2" :key="group" class="home-marquee-group">
          <span v-for="item in marqueeItems" :key="item">{{ item }}</span>
        </div>
      </div>
    </div>
    <HomeFeatured />
    <HomeAbout />
    <HomeContact />
    <footer ref="footer" class="home-footer label-p5" :class="{ 'is-visible': footerVisible }">
      <span>© 2026 Paric.io · Oscar Paricio</span>
    </footer>
    <QuickMenu />
  </main>
</template>

<style scoped src="~/assets/css/pages/home.css"></style>
