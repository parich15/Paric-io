<script setup>
/** Opción de menú / selector de categoría. Activa: rojo, más grande, rombo rojo en la esquina. */
defineProps({ active: Boolean, vertical: Boolean, rotate: { type: [Number, String], default: -1 } })
</script>
<template>
  <button type="button" :class="['relative border-0 cursor-pointer display-p5 tracking-[0.06em] leading-none px-[22px] pt-[10px] pb-[12px] pop-hover hover:scale-[1.08] hover:-rotate-3',
      active ? 'bg-red text-paper text-[clamp(24px,2.4vw,36px)] shadow-[8px_8px_0_var(--fg)]' : 'bg-fg text-bg text-[clamp(18px,1.8vw,26px)] shadow-[5px_5px_0_var(--bg)]']"
    :style="{ transform: 'skewX(-12deg) rotate(' + (active ? -3 : rotate) + 'deg)', writingMode: vertical ? 'vertical-rl' : 'horizontal-tb' }">
    <span class="block" style="transform: skewX(12deg)"><slot /></span>
    <span v-if="active" class="absolute -top-2 -right-2 w-[18px] h-[18px] bg-red border-3 border-bg rotate-45"></span>
  </button>
</template>