<script setup lang="ts">
/** Opción nativa: el consumidor expresa `aria-current` o `aria-selected` según su uso; `rotate` recibe grados sin sufijo. */
withDefaults(defineProps<{
  active?: boolean
  vertical?: boolean
  rotate?: number | `${number}`
  disabled?: boolean
}>(), { active: false, vertical: false, rotate: -1, disabled: false })
</script>
<template>
  <button
    type="button" :disabled="disabled" :class="['relative border-0 cursor-pointer display-p5 tracking-[0.06em] leading-none px-[22px] pt-[10px] pb-[12px] pop-hover hover:scale-[1.08] hover:-rotate-3 disabled:opacity-40 disabled:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-full after:w-full after:min-h-[44px] after:min-w-[44px] after:-translate-x-1/2 after:-translate-y-1/2',
      active ? 'bg-red text-paper text-[clamp(24px,2.4vw,36px)] shadow-[8px_8px_0_var(--fg)]' : 'bg-fg text-bg text-[clamp(18px,1.8vw,26px)] shadow-[5px_5px_0_var(--bg)]']"
    :style="{ transform: 'skewX(-12deg) rotate(' + (active ? -3 : rotate) + 'deg)', writingMode: vertical ? 'vertical-rl' : 'horizontal-tb' }">
    <span class="block" style="transform: skewX(12deg)"><slot></slot></span>
    <span v-if="active" aria-hidden="true" class="absolute -top-2 -right-2 w-[18px] h-[18px] bg-red border-3 border-bg rotate-45"></span>
  </button>
</template>
