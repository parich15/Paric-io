<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const homeAnchor = computed(() => locale.value === 'es' ? 'inicio' : 'home')
const contactTarget = computed(() => ({ path: localePath('index'), hash: locale.value === 'es' ? '#contacto' : '#contact' }))
</script>

<template>
  <section :id="homeAnchor" class="home-hero" aria-labelledby="hero-title">
    <div class="hero-plane" aria-hidden="true">
      <div class="halftone-ink"></div>
      <HomeMetro />
      <div class="hero-shapes">
        <div class="hero-shape hero-shape--circle">
          <svg viewBox="0 0 120 120" focusable="false"><circle cx="60" cy="60" r="50" /></svg>
        </div>
        <div class="hero-shape hero-shape--hexagon">
          <svg viewBox="0 0 120 120" focusable="false"><polygon points="60,8 105,34 105,86 60,112 15,86 15,34" /></svg>
        </div>
        <div class="hero-shape hero-shape--star">
          <svg viewBox="0 0 120 120" focusable="false"><polygon points="60,8 74,42 111,45 83,69 92,106 60,86 28,106 37,69 9,45 46,42" /></svg>
        </div>
        <div class="hero-shape hero-shape--triangle">
          <svg viewBox="0 0 120 120" focusable="false"><polygon points="60,12 110,104 10,104" /></svg>
        </div>
      </div>
    </div>
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

<style scoped src="~/assets/css/components/home-hero.css"></style>
