<script setup lang="ts">
import frontendUrl from '~/assets/img/metro/frontend.png'
import backendUrl from '~/assets/img/metro/backend.png'
import fullstackUrl from '~/assets/img/metro/fullstack.png'

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let dispose: (() => void) | undefined
let unmounted = false

onMounted(async () => {
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
    if (!unmounted && canvas.value) dispose = mountMetroScene(canvas.value, graffitiImages)
  }
  catch {
    // Sin WebGL o sin el chunk, el plano rojo sigue siendo el fondo de la portada.
  }
})

onBeforeUnmount(() => {
  unmounted = true
  dispose?.()
})
</script>

<template>
  <div class="hero-metro" aria-hidden="true">
    <canvas ref="canvas" class="hero-metro__canvas"></canvas>
  </div>
</template>

<style scoped src="~/assets/css/components/home-metro.css"></style>
