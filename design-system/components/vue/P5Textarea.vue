<script setup>
defineProps({ label: String, modelValue: String, placeholder: String, rows: { type: Number, default: 4 } })
defineEmits(['update:modelValue'])
</script>
<template>
  <label class="flex flex-col gap-2">
    <span class="label-p5 text-label tracking-label-xwide text-fg">{{ label }}</span>
    <textarea :rows="rows" :value="modelValue" :placeholder="placeholder" @input="$emit('update:modelValue', $event.target.value)"
      class="bg-bg text-fg font-body font-semibold text-body px-4 py-3 border-3 border-fg outline-none resize-y placeholder:text-fg-muted transition-shadow duration-150 focus:shadow-hard-md"></textarea>
  </label>
</template>