<script setup>
/** Campo de texto: borde 3px, sin radio, etiqueta en Barlow Condensed. Foco: sombra dura roja. */
defineProps({ label: String, modelValue: String, placeholder: String, type: { type: String, default: 'text' }, error: String })
defineEmits(['update:modelValue'])
</script>
<template>
  <label class="flex flex-col gap-2">
    <span class="label-p5 text-label tracking-label-xwide text-fg">{{ label }}</span>
    <input :type="type" :value="modelValue" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)"
      :class="['bg-bg text-fg font-body font-semibold text-body px-4 py-3 border-3 outline-none placeholder:text-fg-muted transition-shadow duration-150 focus:shadow-hard-md', error ? 'border-red' : 'border-fg']" />
    <span v-if="error" class="label-p5 text-label-xs text-red">{{ error }}</span>
  </label>
</template>