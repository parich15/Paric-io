<script setup lang="ts">
/** Pareja de término y valor; el slot añade contenido al valor y ambos compensan el skew original de seis grados. */
defineProps<{ label?: string, value?: string }>()
</script>
<template>
  <dl class="m-0 bg-paper text-ink border-3 border-ink shadow-hard-md px-5 pt-[18px] pb-5 skew-p5-xs" style="transform: skewX(-6deg)">
    <dt class="label-p5 text-label-sm tracking-label-xwide text-red" style="transform: skewX(6deg)">{{ label }}</dt>
    <dd class="m-0 display-p5 text-h3 leading-tight mt-[6px]" style="transform: skewX(6deg)">{{ value }}<slot></slot></dd>
  </dl>
</template>
