<script setup>
/** Ficha de dato (ROL / DURACIÓN / RESULTADO): papel, skew leve, sombra roja. */
defineProps({ label: String, value: String })
</script>
<template>
  <div class="bg-paper text-ink border-3 border-ink shadow-hard-md px-5 pt-[18px] pb-5 skew-p5-xs" style="transform: skewX(-6deg)">
    <div class="label-p5 text-label-sm tracking-label-xwide text-red">{{ label }}</div>
    <div class="display-p5 text-h3 leading-tight mt-[6px]">{{ value }}<slot /></div>
  </div>
</template>