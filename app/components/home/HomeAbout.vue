<script setup lang="ts">
const { t, locale } = useI18n()
const aboutAnchor = computed(() => locale.value === 'es' ? 'sobre' : 'about')
const skills = computed(() => ['Vue / Nuxt', 'Angular', 'TypeScript', 'Motion UI', 'Node', t('home.design')])
</script>

<template>
  <section :id="aboutAnchor" class="home-about" data-theme="light" aria-labelledby="about-title">
    <div class="about-grid">
      <div data-motion="rise"><HomePortrait class="about-portrait" /></div>
      <div class="about-copy" data-motion="rise">
        <div class="about-heading"><span class="display-p5" aria-hidden="true">03</span><P5Stamp id="about-title" tone="ink" size="h1">{{ t('common.about') }}</P5Stamp></div>
        <p>{{ t('home.aboutText') }}</p>
        <h3 class="label-p5">{{ t('home.skills') }}</h3>
        <ul class="about-skills">
          <li v-for="skill in skills" :key="skill"><span class="display-p5">{{ skill }}</span><span aria-hidden="true"></span></li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-about { padding: 120px var(--page-x) 140px; background: var(--bg); color: var(--fg); clip-path: polygon(0 4vw, 100% 0, 100% 100%, 0 calc(100% - 3vw)); }
.about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 56px; align-items: center; padding-top: 40px; }
.about-portrait { max-width: 440px; margin-inline: auto; }
.about-copy { min-width: 0; }
.about-heading { display: flex; flex-wrap: wrap; align-items: flex-end; gap: var(--space-9); margin-bottom: var(--space-12); }
.about-heading > span { color: var(--p5-red); font-size: clamp(36px, 4vw, 60px); }
.about-heading h2 { font-size: clamp(40px, 6vw, 92px); }
.about-copy p { margin: 0; font-size: clamp(18px, 1.4vw, 20px); line-height: 1.5; font-weight: 600; }
.about-copy h3 { margin: var(--space-13) 0 var(--space-7); color: var(--p5-red); font-size: var(--size-btn-sm); letter-spacing: var(--track-label-xwide); }
.about-skills { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-6) var(--space-11); margin: 0; padding: 0; list-style: none; }
.about-skills li { display: flex; flex-direction: column; gap: var(--space-3); }
.about-skills .display-p5 { font-size: var(--size-btn-lg); line-height: 1.2; }
.about-skills li > span:last-child { height: 6px; background: var(--fg); transform: skewX(var(--skew-xl)); }
@media (width < 760px) { .home-about { padding-top: var(--space-15); padding-bottom: var(--space-17); } .about-grid { gap: var(--space-14); } .about-portrait { max-width: 340px; } }
</style>
