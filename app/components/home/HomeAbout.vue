<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
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
        <div class="about-more"><P5Button :to="localePath('about')">{{ t('home.moreAbout') }}</P5Button></div>
      </div>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/components/home-about.css"></style>
