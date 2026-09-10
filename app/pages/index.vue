<script setup lang="ts">
const { t } = useI18n()
const root = useTemplateRef<HTMLElement>('root')

const entrance = useMotionEnter(root)
onMounted(() => { void entrance.play() })
useSeoMeta({ title: () => t('meta.homeTitle'), description: () => t('meta.homeDescription') })
</script>

<template>
  <main id="main-content" ref="root" class="home-page" tabindex="-1">
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

<style scoped>
.home-page { overflow-x: clip; background: var(--p5-ink); color: var(--p5-paper); }
.home-marquee { display: flex; gap: var(--space-12); width: 104%; margin-left: -2%; overflow: hidden; padding: var(--space-6) 0; background: var(--p5-paper); color: var(--p5-ink); transform: rotate(-1.5deg); font: clamp(22px, 2.6vw, 36px)/1 var(--type-display); letter-spacing: var(--track-btn); text-transform: uppercase; }
.home-marquee span { flex: none; }
.home-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-7); padding: var(--space-12) var(--page-x) 120px; border-top: var(--border-3) solid var(--p5-paper); color: var(--p5-gray); font-size: var(--size-label); }
</style>
