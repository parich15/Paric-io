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

<style scoped src="~/assets/css/components/home-portrait.css"></style>
