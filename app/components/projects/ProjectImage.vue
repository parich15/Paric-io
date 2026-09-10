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

<style scoped>
.project-image {
  position: relative;
  display: grid;
  place-items: center;
  margin: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--bg);
  border: var(--border-4) solid var(--border-strong);
  transition: transform var(--dur-hover) var(--easing-pop), box-shadow var(--dur-hover);
}
.project-image--hero { aspect-ratio: 16 / 11; box-shadow: var(--hard-2xl); }
.project-image__texture { position: absolute; inset: 0; opacity: 0.14; }
.project-image__wedge {
  position: absolute;
  left: -20%;
  bottom: -30%;
  width: 70%;
  height: 90%;
  background: var(--accent);
  transform: skewX(var(--skew-xl));
}
@media (hover: hover) {
  .project-image:not(.project-image--hero):hover { transform: scale(1.03); box-shadow: var(--hard-lg); }
}
</style>
