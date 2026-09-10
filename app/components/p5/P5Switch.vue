<script setup lang="ts">
/** Interruptor controlado: conserva un nombre estable con ambas etiquetas traducidas y comunica el estado mediante aria-checked. */
withDefaults(defineProps<{
  modelValue?: boolean
  on?: string
  off?: string
  disabled?: boolean
}>(), { modelValue: false, on: 'ON', off: 'OFF', disabled: false })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
<template>
  <button
    type="button" role="switch" :aria-checked="modelValue" :disabled="disabled"
    class="relative inline-flex border-3 border-fg bg-bg cursor-pointer p-0 skew-p5 pop-hover hover:scale-[1.05] disabled:opacity-40 disabled:pointer-events-none after:absolute after:top-1/2 after:left-1/2 after:h-full after:w-full after:min-h-[44px] after:min-w-[44px] after:-translate-x-1/2 after:-translate-y-1/2"
    @click="!disabled && emit('update:modelValue', !modelValue)"
  >
    <span :class="['label-p5 text-label px-[14px] py-[6px] transition-colors duration-150', !modelValue ? 'bg-fg text-bg' : 'text-fg']"><span class="inline-block unskew-p5">{{ off }}</span></span>
    <span :class="['label-p5 text-label px-[14px] py-[6px] transition-colors duration-150', modelValue ? 'bg-red text-paper' : 'text-fg']"><span class="inline-block unskew-p5">{{ on }}</span></span>
  </button>
</template>
