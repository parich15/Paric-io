<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const homeAnchor = computed(() => locale.value === 'es' ? 'inicio' : 'home')
const contactTarget = computed(() => ({ path: localePath('index'), hash: locale.value === 'es' ? '#contacto' : '#contact' }))
</script>

<template>
  <section :id="homeAnchor" class="home-hero" aria-labelledby="hero-title">
    <div class="hero-plane" aria-hidden="true"><div class="halftone-ink"></div></div>
    <div class="hero-ring" aria-hidden="true"></div>
    <div class="hero-content">
      <div data-motion="rise">
        <span class="hero-role label-p5"><span aria-hidden="true"></span>{{ t('home.role') }}</span>
      </div>
      <div data-motion="stamp">
        <h1 id="hero-title" class="hero-title" aria-label="Oscar Paricio">
          <P5Heading text="OSCAR" size="title" :shadow="false" class="hero-name" aria-hidden="true" />
          <P5Heading text="PARICIO" :offset="3" size="title" :shadow="false" class="hero-name" aria-hidden="true" />
        </h1>
      </div>
      <div class="hero-copy" data-motion="rise">
        <p class="hero-tagline">{{ t('home.tagline') }}</p>
        <p>{{ t('home.introText') }}</p>
      </div>
      <div class="hero-actions" data-motion="rise">
        <P5Button :to="localePath('projects')" size="lg">{{ t('home.viewProjects') }}</P5Button>
        <P5Button :to="contactTarget" variant="outline" size="lg">{{ t('home.contactCta') }}</P5Button>
      </div>
      <a class="hero-scroll label-p5" href="#featured">{{ t('home.scroll') }} <span aria-hidden="true">↓</span></a>
    </div>
  </section>
</template>

<style scoped>
.home-hero { position: relative; display: grid; align-content: center; min-height: 100svh; padding: 140px var(--page-x) 100px; isolation: isolate; }
.hero-plane { position: absolute; z-index: -1; top: -10%; right: -12%; width: 52%; height: 130%; background: var(--p5-red); transform: skewX(var(--skew-lg)); overflow: hidden; }
.hero-plane > div { width: 100%; height: 100%; opacity: .25; }
.hero-ring { position: absolute; z-index: -1; top: 22%; right: 8vw; width: min(28vw, 340px); aspect-ratio: 1; border: var(--border-6) dashed var(--p5-ink); border-radius: var(--radius-full); }
.hero-content { min-width: 0; }
.hero-role { display: inline-flex; align-items: center; gap: var(--space-6); padding: var(--space-2) var(--space-7); background: var(--p5-paper); color: var(--p5-ink); transform: rotate(var(--rot-2)) skewX(var(--skew-sm)); font-size: var(--size-btn); letter-spacing: var(--track-label-xwide); }
.hero-role > span { width: 10px; height: 10px; background: var(--p5-red); transform: rotate(45deg); }
.hero-title { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-5); margin: var(--space-12) 0 0; }
.hero-name { flex-wrap: nowrap; font-size: clamp(64px, 12.5vw, 180px); letter-spacing: .01em; line-height: .92; }
.hero-copy { margin-top: 36px; }
.hero-copy p { margin: var(--space-7) 0 0; font-size: clamp(18px, 1.6vw, 22px); font-weight: 600; line-height: 1.45; }
.hero-copy .hero-tagline { font-weight: 800; }
.hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-8); margin-top: 40px; }
.hero-scroll { display: inline-flex; align-items: center; gap: var(--space-5); min-height: 44px; margin-top: var(--space-13); color: var(--p5-paper); font-size: var(--size-label); }
.hero-scroll span { font-size: var(--size-btn-lg); }
@media (width < 760px) {
  .home-hero { padding-top: 120px; padding-bottom: var(--space-15); }
  .hero-plane { right: -35%; width: 70%; }
  .hero-ring { right: -8vw; top: 18%; width: 40vw; }
  .hero-title { flex-direction: column; gap: var(--space-6); }
  .hero-name { font-size: clamp(64px, 15.5vw, 112px); }
  .hero-copy { padding-right: var(--space-5); }
  .hero-actions { gap: var(--space-7); }
}
@media (height < 700px) and (width >= 760px) {
  .home-hero { padding-top: 120px; padding-bottom: var(--space-14); }
  .hero-name { font-size: clamp(64px, 10vw, 150px); }
  .hero-copy { margin-top: var(--space-11); }
  .hero-scroll { margin-top: var(--space-7); }
}
</style>
