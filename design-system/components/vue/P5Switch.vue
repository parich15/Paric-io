<script setup>
/** Interruptor de dos estados con etiquetas (PROFESIONAL / PERSONAL, oscuro / claro). */
defineProps({ modelValue: Boolean, on: { type: String, default: 'ON' }, off: { type: String, default: 'OFF' } })
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <button type="button" role="switch" :aria-checked="modelValue" @click="emit('update:modelValue', !modelValue)"
    class="inline-flex border-3 border-fg bg-bg cursor-pointer p-0 skew-p5 pop-hover hover:scale-[1.05]">
    <span :class="['label-p5 text-label px-[14px] py-[6px] transition-colors duration-150', !modelValue ? 'bg-fg text-bg' : 'text-fg']"><span class="inline-block unskew-p5">{{ off }}</span></span>
    <span :class="['label-p5 text-label px-[14px] py-[6px] transition-colors duration-150', modelValue ? 'bg-red text-paper' : 'text-fg']"><span class="inline-block unskew-p5">{{ on }}</span></span>
  </button>
</template>