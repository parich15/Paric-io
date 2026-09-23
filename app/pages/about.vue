<script setup lang="ts">
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'
import type { AnimeApi } from '~/plugins/anime.client'

const { t } = useI18n()
const localePath = useLocalePath()
const nuxtApp = useNuxtApp()
const preference = usePreferredReducedMotion()
const root = useTemplateRef('root')
const activeGroup = ref<string | null>(null)
const mounted = ref(false)
const mobile = useMediaQuery('(width < 760px)')
const mobileStackOpen = ref(false)
const lastFocused = shallowRef<HTMLElement | null>(null)
const outlineWords: Record<string, string> = { frontend: 'Front', backend: 'Back', skills: 'Skill', misc: 'Misc' }
const outlineText = computed(() => outlineWords[activeGroup.value ?? 'frontend']!)
onMounted(() => {
  mobileStackOpen.value = window.location.hash === '#about-stack'
  mounted.value = true
})
let scope: ReturnType<AnimeApi['createScope']> | undefined

useSeoMeta({ title: () => t('meta.aboutTitle'), description: () => t('meta.aboutDescription'), ogTitle: () => t('meta.aboutTitle'), ogDescription: () => t('meta.aboutDescription') })

function cleanup() {
  scope?.revert()
  scope = undefined
}

/** La selección cambia al pulsar; details conserva el mismo comportamiento sin JavaScript. */
function selectPanel(panel: HTMLDetailsElement | null) {
  root.value?.querySelectorAll<HTMLDetailsElement>('.skill-panel').forEach((item) => {
    if (item !== panel) item.open = false
  })
  if (panel) panel.open = true
  activeGroup.value = panel?.dataset.skillGroup ?? null
}

function toggleSkill(event: MouseEvent) {
  const trigger = (event.target as Element).closest<HTMLElement>('.skill-spine')
  const panel = trigger?.closest<HTMLDetailsElement>('.skill-panel')
  const element = root.value
  if (!panel || !element) return
  event.preventDefault()
  const next = panel.open ? null : panel
  cleanup()
  selectPanel(next)
  if (preference.value === 'reduce') return

  const anime = nuxtApp.$anime
  const timing = anime.readMotion(element, '--dur-base', '--easing-slash')
  scope = anime.createScope({ root: element })
  scope.add(() => {
    const timeline = anime.createTimeline({ autoplay: false, onComplete: cleanup })
    if (next) {
      timeline.add(next.querySelector('.skill-panel-reveal')!, {
        x: [16, 0], ...timing,
      }, 0)
      next.querySelectorAll('.skill-item').forEach((item, index) => {
        const start = index * timing.duration * .3
        timeline.add(item, { y: [8, 0], opacity: [0, 1], ...timing }, start)
        timeline.add(item.querySelectorAll('.skill-segment-fill'), {
          scaleX: [0, 1], delay: anime.stagger(timing.duration * .16), ...timing,
        }, start + timing.duration * .3)
      })
    }
    else {
      timeline.add(element.querySelector('.about-biography-inner')!, {
        x: [-8, 0], ...timing,
      }, 0)
    }
    timeline.init().play()
  })
}


async function toggleMobileStack() {
  mobileStackOpen.value = !mobileStackOpen.value
  if (!mobileStackOpen.value) {
    cleanup()
    selectPanel(null)
  }
  await nextTick()
  const selector = mobileStackOpen.value ? '.skill-panel summary' : '.mobile-stack-toggle'
  root.value?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true })
}

// El cambio de breakpoint no debe dejar el foco dentro de una sección oculta.
watch(mobile, async (isMobile) => {
  const focused = document.activeElement === document.body && lastFocused.value?.getClientRects().length === 0 ? lastFocused.value : document.activeElement
  const focusedStack = !!focused?.closest('.about-skills-stage')
  const focusedToggle = !!focused?.closest('.mobile-stack-toggle')
  const focusedBiography = !!focused?.closest('.about-biography')
  if (isMobile && !mobileStackOpen.value) {
    cleanup()
    selectPanel(null)
  }
  await nextTick()
  if (isMobile && !mobileStackOpen.value && focusedStack) root.value?.querySelector<HTMLElement>('.mobile-stack-toggle')?.focus({ preventScroll: true })
  if (isMobile && mobileStackOpen.value && focusedBiography) root.value?.querySelector<HTMLElement>('.skill-panel summary')?.focus({ preventScroll: true })
  if (!isMobile && focusedToggle) root.value?.querySelector<HTMLElement>('.skill-panel summary')?.focus({ preventScroll: true })
})

function closeSkill(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  const trigger = root.value?.querySelector<HTMLElement>('.skill-panel[open] summary')
  if (!trigger) {
    if (mobile.value && mobileStackOpen.value) {
      event.preventDefault()
      event.stopPropagation()
      toggleMobileStack()
    }
    return
  }
  event.preventDefault()
  event.stopPropagation()
  trigger.click()
  trigger.focus({ preventScroll: true })
}

watch(preference, () => {
  if (preference.value !== 'reduce') return
  cleanup()
}, { flush: 'sync' })
onScopeDispose(cleanup)
</script>

<template>
  <main id="main-content" ref="root" tabindex="-1" class="about-page" :class="{ 'mobile-stack-open': mobileStackOpen }" :data-enhanced="mounted" data-theme="light" @click="toggleSkill" @keydown.esc="closeSkill" @focusin="lastFocused = $event.target as HTMLElement">
    <h1 id="about-page-title" class="sr-only">{{ t('common.about') }}</h1>
    <div class="about-personal">
      <div class="about-photo">
        <HomePortrait class="about-full-portrait" />
        <div class="about-outline display-p5" aria-hidden="true">
          <AboutOutline v-if="mounted" :text="outlineText" :class="`outline-${outlineText.toLowerCase()} outline-live`" :active="activeGroup !== null" />
          <template v-else>
            <AboutOutline text="Front" class="outline-front" :active="false" />
            <AboutOutline text="Back" class="outline-back" :active="false" />
            <AboutOutline text="Skill" class="outline-skill" :active="false" />
            <AboutOutline text="Misc" class="outline-misc" :active="false" />
          </template>
        </div>
      </div>
      <section class="about-biography" tabindex="0" aria-labelledby="about-page-title">
        <div class="about-biography-inner" data-motion="rise">
          <div class="about-title" aria-hidden="true" data-motion="stamp"><P5Heading :text="t('common.about')" plates size="h1" /></div>
          <p class="about-role label-p5"><span>{{ t('home.role') }}</span></p>
          <p class="about-lead">{{ t('home.aboutText') }}</p>
          <p>{{ t('about.approach') }}</p>
          <p>{{ t('about.interests') }}</p>
          <div class="about-links"><P5Button :to="localePath('projects')">{{ t('home.viewProjects') }}</P5Button></div>
        </div>
      </section>
    </div>
    <AboutSkills id="about-stack" />
    <P5Button v-if="mounted" class="mobile-stack-toggle" variant="paper" :aria-expanded="mobileStackOpen" aria-controls="about-stack" @click="toggleMobileStack">
      {{ t(mobileStackOpen ? 'about.hideStack' : 'about.viewStack') }} <span aria-hidden="true">{{ mobileStackOpen ? '×' : '+' }}</span>
    </P5Button>
    <template v-else>
      <P5Button class="mobile-stack-toggle mobile-stack-show" variant="paper" href="#about-stack">{{ t('about.viewStack') }} +</P5Button>
      <P5Button class="mobile-stack-toggle mobile-stack-hide" variant="paper" href="#about-page-title">{{ t('about.hideStack') }} ×</P5Button>
    </template>
  </main>
</template>

<style scoped src="~/assets/css/pages/about.css"></style>
