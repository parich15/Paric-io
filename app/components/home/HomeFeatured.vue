<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { projects } from '~/data/projects'
import type { AnimeApi } from '~/plugins/anime.client'

const { t } = useI18n()
const localePath = useLocalePath()
const nuxtApp = useNuxtApp()
const preference = usePreferredReducedMotion()
const map = useTemplateRef<SVGSVGElement>('map')

/** Ruta del plano en coordenadas del viewBox: salida, tres paradas y el objetivo final tras un último quiebro. */
const route = [[84, 92], [360, 214], [178, 420], [486, 486], [392, 624], [590, 668]] as const
const routePoints = route.map(point => point.join(',')).join(' ')
const shadowPoints = route.map(([x, y]) => `${x + 8},${y + 8}`).join(' ')
const [start, ...waypoints] = route
const target = waypoints.at(-1)!

/** Momento de cada punto en el timeline (0–1000): la fracción de ruta recorrida hasta él. */
const legs = route.slice(1).map(([x, y], index) => Math.hypot(x - route[index]![0], y - route[index]![1]))
const routeLength = legs.reduce((total, leg) => total + leg, 0)
const arrivals = legs.map((_, index) => legs.slice(0, index + 1).reduce((total, leg) => total + leg, 0) / routeLength * 1000)

/** Las paradas son los proyectos destacados en su orden editorial; los recuentos salen de los datos. */
const stops = projects.filter(project => project.featured).slice(0, 3).map((project, index) => ({
  project,
  num: String(index + 1).padStart(2, '0'),
  point: waypoints[index]!,
  arrival: arrivals[index]!,
}))
const counts = {
  total: projects.length,
  pro: projects.filter(project => project.category === 'pro').length,
  personal: projects.filter(project => project.category === 'personal').length,
}
const activeStop = ref<number | null>(null)

let timeline: ReturnType<AnimeApi['createTimeline']> | undefined

/** Devuelve el plano a su estado completo: sin JavaScript o con movimiento reducido la ruta ya está dibujada. */
function resetMap() {
  timeline?.revert()
  timeline = undefined
  map.value?.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach((line) => {
    ['pathLength', 'stroke-dasharray', 'stroke-dashoffset'].forEach(name => line.removeAttribute(name))
    line.style.removeProperty('stroke-linecap')
  })
}

/** El scroll dibuja la ruta: empieza al asomar el plano y termina cuando queda centrado en pantalla. */
function play() {
  resetMap()
  const element = map.value
  if (!element || preference.value === 'reduce') return
  const anime = nuxtApp.$anime
  const [shadow, line, ...speed] = anime.svg.createDrawable(element.querySelectorAll('[data-draw]'))
  const scrubbed = anime.createTimeline({
    autoplay: anime.onScroll({ target: element, enter: 'bottom top', leave: 'center center', sync: .25 }),
    defaults: { ease: 'linear' },
  })
  scrubbed
    .add([shadow!, line!], { draw: ['0 0', '0 1'], duration: 1000 }, 0)
    .add(element.querySelector('.map-start')!, { scale: [0, 1], duration: 60, ease: 'out(3)' }, 0)
  element.querySelectorAll('.map-stop').forEach((stopElement, index) => {
    scrubbed.add(stopElement, { scale: [0, 1.25, 1], rotate: [-30, 0], duration: 90 }, stops[index]!.arrival - 30)
  })
  scrubbed
    .add(element.querySelector('.map-target')!, { scale: [0, 1.15, 1], rotate: [-32, 0], duration: 110 }, 960)
    .add(speed, { draw: ['0 0', '0 1'], duration: 80 }, 1040)
  timeline = scrubbed
}

onMounted(play)
watch(preference, play)
onBeforeUnmount(resetMap)
</script>

<template>
  <section id="featured" class="home-featured" aria-labelledby="featured-title">
    <div class="featured-header" data-motion="rise">
      <span class="featured-number display-p5" aria-hidden="true">02</span>
      <div>
        <p class="label-p5">{{ t('home.featuredLabel') }}</p>
        <P5Stamp id="featured-title" size="h1">{{ t('home.featured') }}</P5Stamp>
      </div>
    </div>
    <p class="featured-text" data-motion="rise">{{ t('home.featuredText', counts) }}</p>

    <!-- Plano decorativo: las paradas y su destino se leen en la lista enlazada. -->
    <div class="featured-map" aria-hidden="true">
      <svg ref="map" viewBox="0 0 720 780" focusable="false">
        <defs>
          <pattern id="featured-dots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="1.6" /></pattern>
        </defs>
        <polygon class="map-shadow" points="58,62 704,40 690,774 44,752" />
        <polygon class="map-sheet" points="40,44 686,22 672,756 26,734" />
        <g class="map-blocks">
          <polygon points="70,78 250,72 246,176 66,182" />
          <polygon points="282,70 452,64 448,170 278,176" />
          <polygon points="66,214 180,210 176,330 62,334" />
          <polygon points="212,206 430,198 426,318 208,326" />
          <polygon points="462,194 650,188 646,312 458,318" />
          <polygon points="60,366 156,362 152,520 56,524" />
          <polygon points="190,358 380,352 376,452 186,458" />
          <polygon points="412,346 648,338 644,450 408,458" />
          <polygon points="186,490 360,484 356,720 182,724" />
          <polygon points="394,488 646,480 640,590 390,598" />
        </g>
        <polygon class="map-dots" points="56,556 150,552 146,710 52,714" />
        <g class="map-title">
          <polygon points="480,48 664,42 660,84 476,90" />
          <text x="570" y="74">{{ t('home.mapTitle') }}</text>
        </g>
        <polyline class="map-plan" :points="routePoints" />
        <polyline class="map-route map-route--shadow" :points="shadowPoints" data-draw />
        <polyline class="map-route" :points="routePoints" data-draw />
        <g :transform="`translate(${start[0]} ${start[1]})`">
          <g class="map-start"><circle r="15" /><circle class="map-start-dot" r="5" /></g>
        </g>
        <g v-for="(stop, index) in stops" :key="stop.project.id" :transform="`translate(${stop.point[0]} ${stop.point[1]})`">
          <g class="map-stop" :class="{ 'is-active': activeStop === index }">
            <rect x="-21" y="-21" width="42" height="42" transform="rotate(45)" />
            <text y="1">{{ stop.num }}</text>
          </g>
        </g>
        <path class="map-speed" d="M552 566 532 516" data-draw />
        <path class="map-speed" d="M596 558 594 498" data-draw />
        <path class="map-speed" d="M640 568 662 520" data-draw />
        <g :transform="`translate(${target[0]} ${target[1]})`">
          <g class="map-target">
            <polygon points="0,-92 17,-60 50,-78 44,-42 82,-40 60,-12 92,8 58,24 72,58 36,54 30,90 0,66 -26,90 -34,54 -72,62 -58,26 -92,8 -60,-12 -80,-42 -44,-44 -50,-80 -18,-60" />
            <text class="map-target-count" y="12">{{ counts.total }}</text>
            <text class="map-target-label" y="42">{{ t('nav.projectsWord') }}</text>
          </g>
        </g>
      </svg>
    </div>

    <div class="featured-stops" data-motion="rise">
      <h3 class="label-p5">{{ t('home.stops') }}</h3>
      <ol>
        <li v-for="(stop, index) in stops" :key="stop.project.id">
          <NuxtLink
            :to="localePath({ name: 'projects-slug', params: { slug: stop.project.slug } })" class="featured-stop"
            @pointerenter="activeStop = index" @pointerleave="activeStop = null" @focus="activeStop = index" @blur="activeStop = null"
          >
            <span class="stop-media">
              <img v-if="stop.project.cover" :src="stop.project.cover" alt="" width="160" height="100" loading="lazy" decoding="async" />
              <span class="stop-num display-p5" aria-hidden="true">{{ stop.num }}</span>
            </span>
            <span class="stop-title display-p5">{{ stop.project.title }}</span>
            <span class="stop-meta label-p5">{{ [stop.project.year, stop.project.client].filter(Boolean).join(' · ') }}</span>
          </NuxtLink>
        </li>
      </ol>
    </div>
    <div class="featured-action" data-motion="rise"><P5Button :to="localePath('projects')" size="lg">{{ t('home.allProjects') }} <span aria-hidden="true">→</span></P5Button></div>
  </section>
</template>

<style scoped src="~/assets/css/components/home-featured.css"></style>
