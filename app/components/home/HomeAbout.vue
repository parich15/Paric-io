<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { featuredSkills } from '~/data/about'
import type { Locale } from '~/data/projects'
import type { AnimeApi } from '~/plugins/anime.client'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const nuxtApp = useNuxtApp()
const preference = usePreferredReducedMotion()
const root = useTemplateRef<HTMLElement>('root')
const aboutAnchor = computed(() => locale.value === 'es' ? 'sobre' : 'about')
const lang = computed(() => locale.value as Locale)

let entrance: ReturnType<AnimeApi['createTimeline']> | undefined
let rankUp: ReturnType<AnimeApi['createScope']> | undefined

function cleanup() {
  entrance?.revert()
  entrance = undefined
  rankUp?.revert()
  rankUp = undefined
}

/** Reparte la carta como una subida de rango, una sola vez al entrar en pantalla; se animan los wrappers, no las piezas inclinadas. */
function playEntrance() {
  cleanup()
  const element = root.value
  if (!element || preference.value === 'reduce') return
  const anime = nuxtApp.$anime
  const stamp = anime.readMotion(element, '--dur-stamp', '--easing-stamp')
  const slash = anime.readMotion(element, '--dur-rise', '--easing-slash')
  const timeline = anime.createTimeline({
    autoplay: anime.onScroll({ target: element.querySelector('.confidant')!, enter: 'bottom-=20% top', repeat: false }),
    onComplete: () => timeline.revert(),
  })
  timeline
    .add(element.querySelector('.about-band')!, { ...slash, scaleX: [0, 1] }, 0)
    .add(element.querySelector('.confidant-card-motion')!, { ...stamp, duration: stamp.duration * 1.3, rotateY: [-90, 0], scale: [.8, 1] }, 120)
    .add(element.querySelectorAll('[data-confidant-plate]'), { ...slash, x: [-60, 0], opacity: [0, 1], delay: anime.stagger(80) }, 260)
    .add(element.querySelectorAll('.ability-star'), { ...stamp, scale: [0, 1], rotate: [-30, 0], delay: anime.stagger(50) }, 480)
    .add(element.querySelector('.ability:has(input:checked) .ability-panel')!, { ...slash, y: [24, 0], opacity: [0, 1] }, 620)
    .init()
  entrance = timeline
}

/** Cada estrella sube el rango: la placa nueva entra y el número se sella; sin JavaScript los radios cambian igual. */
function playRankUp(event: Event) {
  const ability = (event.target as Element).closest('.ability')
  const element = root.value
  if (!ability || !element || preference.value === 'reduce') return
  rankUp?.revert()
  const anime = nuxtApp.$anime
  const stamp = anime.readMotion(element, '--dur-stamp', '--easing-stamp')
  const slash = anime.readMotion(element, '--dur-rise', '--easing-slash')
  rankUp = anime.createScope({ root: element })
  rankUp.add(() => {
    anime.animate(ability.querySelector('.ability-panel')!, { ...slash, x: [28, 0], opacity: [0, 1] })
    anime.animate(ability.querySelector('.ability-rank-value')!, {
      ...stamp,
      keyframes: {
        '0%': { scale: 2.2, rotate: -14, opacity: 0 },
        '55%': { scale: .94, rotate: 0, opacity: 1 },
        '100%': { scale: 1, rotate: 0, opacity: 1 },
      },
    })
    anime.animate(ability.querySelector('.ability-star')!, { ...stamp, scale: [1.5, 1] })
  })
}

onMounted(playEntrance)
watch(preference, playEntrance)
onBeforeUnmount(cleanup)
</script>

<template>
  <section :id="aboutAnchor" ref="root" class="home-about" data-theme="light" aria-labelledby="about-title">
    <div class="about-heading" data-motion="rise"><span class="display-p5" aria-hidden="true">03</span><P5Stamp id="about-title" tone="ink" size="h1">{{ t('common.about') }}</P5Stamp></div>
    <div class="confidant">
      <div class="about-band" aria-hidden="true"></div>
      <div class="confidant-card-motion">
        <div class="confidant-card">
          <span class="card-numeral display-p5" aria-hidden="true">I</span>
          <HomePortrait decorative class="card-portrait" />
          <span class="card-title display-p5" aria-hidden="true">Le Bateleur</span>
        </div>
      </div>
      <div class="confidant-panel">
        <div class="confidant-identity">
          <div data-confidant-plate><p class="identity-kicker label-p5">{{ t('home.confidant') }}</p></div>
          <div data-confidant-plate><p class="identity-name display-p5">Oscar Paricio</p></div>
          <div data-confidant-plate><p class="identity-arcana"><span class="label-p5">{{ t('home.arcana') }}</span><span class="display-p5">{{ t('home.arcanaName') }}</span></p></div>
        </div>
        <p class="confidant-text" data-confidant-plate>{{ t('home.aboutText') }}</p>
        <div class="confidant-abilities" role="radiogroup" :aria-label="t('home.abilities')" @change="playRankUp">
          <div v-for="(skill, index) in featuredSkills" :key="skill.name.es" class="ability" :style="{ '--star': index + 1 }">
            <label class="ability-star">
              <input type="radio" name="home-ability" :value="index" :checked="index === 0" :aria-label="t('home.abilityOption', { rank: index + 1, name: skill.name[lang] })" />
              <span aria-hidden="true"></span>
            </label>
            <div class="ability-panel">
              <div class="ability-plate">
                <div class="ability-copy">
                  <p class="ability-kicker label-p5">{{ t('home.newAbility') }} · {{ skill.group }}</p>
                  <p class="ability-name display-p5">{{ skill.name[lang] }}</p>
                  <p class="ability-text">{{ skill.description[lang] }}</p>
                </div>
                <p class="ability-rank" aria-hidden="true"><span class="label-p5">{{ t('home.rank') }}</span><span class="ability-rank-value display-p5">{{ index + 1 }}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div class="about-more" data-confidant-plate><P5Button :to="localePath('about')" size="lg">{{ t('home.moreAbout') }} <span aria-hidden="true">→</span></P5Button></div>
      </div>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/components/home-about.css"></style>
