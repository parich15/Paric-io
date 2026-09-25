<script setup lang="ts">
import frontendUrl from '~/assets/img/metro/frontend.webp'
import backendUrl from '~/assets/img/metro/backend.webp'
import fullstackUrl from '~/assets/img/metro/fullstack.webp'
import type { mountMetroScene } from './metro-scene'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const menuOpen = useState('menu:open', () => false)
let scene: ReturnType<typeof mountMetroScene> | undefined
let unmounted = false
let idleHandle: number | undefined
let idleTimer: ReturnType<typeof setTimeout> | undefined

async function mount() {
  try {
    // El modelo y WebGL se descargan aparte del HTML y del código inicial de la página.
    const [{ mountMetroScene }, graffitiImages] = await Promise.all([
      import('./metro-scene'),
      Promise.all([frontendUrl, backendUrl, fullstackUrl].map(async (url) => {
        const image = new Image()
        image.src = url
        await image.decode()
        return image
      })),
      document.fonts.load('800 66px "Barlow Condensed"'),
    ])
    if (!unmounted && canvas.value) {
      scene = mountMetroScene(canvas.value, graffitiImages)
      scene.setPaused(menuOpen.value)
    }
  }
  catch {
    // Sin WebGL o sin el chunk, el plano rojo sigue siendo el fondo de la portada.
  }
}

function whenIdle(callback: () => void) {
  if ('requestIdleCallback' in window) idleHandle = window.requestIdleCallback(callback, { timeout: 1500 })
  else idleTimer = setTimeout(callback, 600)
}

/** WebGL arranca en reposo, sin competir con la hidratación; con intro, su carga queda oculta bajo la cortina en lugar de coincidir con el primer gesto. */
onMounted(() => whenIdle(() => { if (!unmounted) void mount() }))
watch(menuOpen, open => scene?.setPaused(open))

onBeforeUnmount(() => {
  unmounted = true
  if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle)
  if (idleTimer) clearTimeout(idleTimer)
  scene?.dispose()
})
</script>

<template>
  <div class="hero-metro" aria-hidden="true">
    <canvas ref="canvas" class="hero-metro__canvas"></canvas>
  </div>
</template>

<style scoped src="~/assets/css/components/home-metro.css"></style>
