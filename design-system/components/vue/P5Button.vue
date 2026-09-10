<script setup>
/** Botón sello. variant: primary (rojo, clip trapezoidal) | outline (borde 3px, skew) | paper (papel sobre tinta) | ghost. size: sm | md | lg */
const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: Boolean,
  href: String,
})
const base = 'inline-flex items-center gap-3 uppercase cursor-pointer select-none border-0 pop-hover focus-visible:outline-3 focus-visible:outline-accent'
const sizes = {
  sm: 'font-label font-extrabold text-btn-sm tracking-label-wide px-[18px] py-[8px]',
  md: 'font-label font-extrabold text-btn tracking-label-wide px-[22px] py-[10px]',
  lg: 'font-display text-btn-lg tracking-btn px-[30px] pt-[10px] pb-[12px]',
}
const variants = {
  primary: 'bg-red text-paper clip-slant hover:scale-[1.07] hover:-rotate-2 hover:bg-paper hover:text-ink',
  outline: 'bg-transparent text-fg border-3 border-fg skew-p5 hover:scale-[1.07] hover:bg-fg hover:text-bg',
  paper: 'bg-paper text-ink border-3 border-ink skew-p5 shadow-hard-ink hover:scale-[1.06] hover:-rotate-2',
  ghost: 'bg-transparent text-fg hover:text-accent skew-p5',
}
</script>
<template>
  <component :is="href ? 'a' : 'button'" :href="href" :disabled="disabled"
    :class="[base, sizes[size], variants[variant], disabled && 'opacity-40 pointer-events-none']">
    <span :class="variant !== 'primary' && 'unskew-p5 inline-block'"><slot /></span>
  </component>
</template>