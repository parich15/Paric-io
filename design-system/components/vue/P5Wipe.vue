<script setup>
/** Barrido de transición: tres planos (rojo, tinta, papel) cruzan la pantalla y un sello con el destino. show: true para lanzar. */
defineProps({ show: Boolean, label: String, fixed: { type: Boolean, default: true } })
</script>
<template>
  <div v-if="show" :class="[fixed ? 'fixed' : 'absolute', 'inset-0 z-[150] pointer-events-none overflow-hidden']">
    <div class="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-red animate-wipe"></div>
    <div class="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-ink animate-wipe [animation-delay:.08s]"></div>
    <div class="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-paper animate-wipe [animation-delay:.16s]"></div>
    <div class="absolute inset-0 grid place-items-center">
      <div class="display-p5 text-h1 text-paper bg-ink px-7 pb-2 -rotate-[5deg] animate-stamp [animation-delay:.35s] text-center max-w-[90vw]">{{ label }}</div>
    </div>
  </div>
</template>