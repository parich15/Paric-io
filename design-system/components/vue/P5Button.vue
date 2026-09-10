<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ButtonHTMLAttributes } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { NuxtLink } from '#components'

defineOptions({ inheritAttrs: false })

/** Acción nativa o enlace: `to` interno tiene prioridad sobre `href`; solo `type="submit"` envía formularios. */
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'outline' | 'paper' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  href?: string
  to?: RouteLocationRaw
  type?: ButtonHTMLAttributes['type']
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  type: 'button',
  href: undefined,
  to: undefined,
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()
const attrs = useAttrs()
const isLink = computed(() => props.to !== undefined || props.href !== undefined)
const element = computed(() => props.to !== undefined && !props.disabled ? NuxtLink : isLink.value ? 'a' : 'button')

/** Retira el destino de los enlaces deshabilitados y evita también las activaciones programáticas. */
function handleClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}

/** El área transparente alcanza 44px sin agrandar la placa; el recorte del fondo deja visible el foco exterior. */
const base = 'relative isolate inline-flex items-center gap-3 uppercase cursor-pointer select-none border-0 pop-hover focus-visible:outline-3 focus-visible:outline-accent focus-visible:outline-offset-3 after:absolute after:top-1/2 after:left-1/2 after:h-full after:w-full after:min-h-[44px] after:min-w-[44px] after:-translate-x-1/2 after:-translate-y-1/2'
const sizes = {
  sm: 'font-label font-extrabold text-btn-sm tracking-label-wide px-[18px] py-[8px]',
  md: 'font-label font-extrabold text-btn tracking-label-wide px-[22px] py-[10px]',
  lg: 'font-display text-btn-lg tracking-btn px-[30px] pt-[10px] pb-[12px]',
}
const variants = {
  primary: 'text-paper before:absolute before:inset-0 before:-z-10 before:clip-slant before:bg-red before:pop-hover hover:scale-[1.07] hover:-rotate-2 hover:before:bg-paper hover:text-ink',
  outline: 'bg-transparent text-fg border-3 border-fg skew-p5 hover:scale-[1.07] hover:bg-fg hover:text-bg',
  paper: 'bg-paper text-ink border-3 border-ink skew-p5 shadow-hard-ink hover:scale-[1.06] hover:-rotate-2',
  ghost: 'bg-transparent text-fg hover:text-accent skew-p5',
}
</script>
<template>
  <component
    :is="element"
    v-bind="attrs"
    :to="to !== undefined && !disabled ? to : undefined"
    :href="to === undefined && !disabled ? href : undefined"
    :type="!isLink ? type : undefined"
    :disabled="!isLink ? disabled : undefined"
    :role="isLink && disabled ? 'link' : attrs.role"
    :aria-disabled="disabled ? true : attrs['aria-disabled']"
    :tabindex="isLink && disabled ? -1 : attrs.tabindex"
    :class="[base, sizes[size], variants[variant], disabled && 'opacity-40 pointer-events-none']"
    @click="handleClick"
  >
    <span :class="variant !== 'primary' && 'unskew-p5 inline-block'"><slot></slot></span>
  </component>
</template>
