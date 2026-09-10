<script setup lang="ts">
/** Marco de captura compartido entre la cabecera y la galería, sin simular imágenes reales. */
withDefaults(defineProps<{ label: string, hero?: boolean, rotation?: number }>(), { hero: false, rotation: -2 })
</script>

<template>
  <figure class="project-image" :class="{ 'project-image--hero': hero }" :style="{ rotate: `${rotation}deg` }">
    <div class="project-image__texture halftone-paper" aria-hidden="true"></div>
    <div v-if="hero" class="project-image__wedge" aria-hidden="true"></div>
    <P5Placeholder :label="label" />
  </figure>
</template>

<style scoped src="~/assets/css/components/project-image.css"></style>
