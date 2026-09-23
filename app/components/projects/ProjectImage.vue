<script setup lang="ts">
import type { ProjectFrame } from '~/data/projects'

/** Marco de captura compartido entre la cabecera y la galería; `frame` presenta la captura como navegador o móvil. */
withDefaults(defineProps<{ label: string, src?: string, type?: 'image' | 'video', hero?: boolean, rotation?: number, frame?: ProjectFrame, address?: string }>(), { src: undefined, type: 'image', hero: false, rotation: -2, frame: undefined, address: undefined })
</script>

<template>
  <figure class="project-image" :class="[{ 'project-image--hero': hero }, frame && `project-image--${frame}`]" :style="{ rotate: `${rotation}deg` }">
    <div v-if="frame === 'browser'" class="project-image__bar" aria-hidden="true"><span></span><span></span><span></span><b v-if="address" class="label-p5">{{ address }}</b></div>
    <div v-else-if="frame === 'phone'" class="project-image__notch" aria-hidden="true"></div>
    <div class="project-image__screen">
      <div class="project-image__texture halftone-paper" aria-hidden="true"></div>
      <div v-if="hero && !frame" class="project-image__wedge" aria-hidden="true"></div>
      <video v-if="src && type === 'video'" :src="src" :aria-label="label" controls playsinline preload="none"></video>
      <img v-else-if="src" :src="src" :alt="label" :loading="hero ? 'eager' : 'lazy'" decoding="async" />
      <P5Placeholder v-else :label="label" />
    </div>
  </figure>
</template>

<style scoped src="~/assets/css/components/project-image.css"></style>
