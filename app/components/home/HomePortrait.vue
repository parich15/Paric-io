<script setup lang="ts">
/** Retrato compartido por la sección personal y la previsualización del menú, con tratamiento duotono. */
withDefaults(defineProps<{ decorative?: boolean }>(), { decorative: false })
</script>

<template>
  <figure class="home-portrait">
    <img src="/images/retrato-oscar-paricio.jpg" :alt="decorative ? '' : 'Oscar Paricio'" width="800" height="1000" loading="lazy" />
    <div class="portrait-color" aria-hidden="true"></div>
    <div class="portrait-dots" aria-hidden="true"></div>
    <figcaption v-if="!decorative" class="display-p5">Oscar Paricio</figcaption>
  </figure>
</template>

<style scoped>
.home-portrait { position: relative; width: 100%; aspect-ratio: 4/5; margin: 0; overflow: hidden; background: var(--p5-ink); border: var(--border-4) solid var(--p5-ink); box-shadow: var(--hard-2xl); transform: rotate(var(--rot-2)); }
.home-portrait img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: 50% 20%; filter: grayscale(1) contrast(1.3); }
.portrait-color, .portrait-dots { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: multiply; }
.portrait-color { background: var(--p5-red); }
.portrait-dots { background-image: var(--halftone-ink); background-size: 7px 7px; opacity: .32; }
figcaption { position: absolute; bottom: var(--space-8); left: -10px; padding: var(--space-1) var(--space-10) var(--space-2); background: var(--p5-red); color: var(--p5-paper); transform: skewX(var(--skew-md)) rotate(var(--rot-2)); font-size: 26px; }
</style>
