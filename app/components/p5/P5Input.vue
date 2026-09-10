<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'

defineOptions({ inheritAttrs: false })

/** Campo de cadena: `class` pertenece al contenedor; atributos y eventos nativos pertenecen al input. */
const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  id?: string
  label?: string
  modelValue?: string
  placeholder?: string
  type?: InputHTMLAttributes['type']
  error?: string
}>(), { class: undefined, id: undefined, label: undefined, modelValue: undefined, placeholder: undefined, type: 'text', error: undefined })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs() as InputHTMLAttributes
const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)

/** Emite siempre una cadena, también para inputs numéricos. */
function handleInput(event: Event) {
  const control = event.currentTarget as HTMLInputElement
  if (!control.disabled) emit('update:modelValue', control.value)
}
</script>
<template>
  <div :class="['flex flex-col gap-2', props.class]">
    <label v-if="label" :for="controlId" class="label-p5 text-label tracking-label-xwide text-fg">{{ label }}</label>
    <input
      v-bind="attrs"
      :id="controlId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="error ? true : attrs['aria-invalid']"
      :aria-describedby="[attrs['aria-describedby'], error ? `${controlId}-error` : undefined].filter(Boolean).join(' ') || undefined"
      :class="['bg-bg text-fg font-body font-semibold text-body px-4 py-3 border-3 placeholder:text-fg-muted transition-shadow duration-150 focus:shadow-hard-md disabled:opacity-40 disabled:pointer-events-none', error ? 'border-red' : 'border-fg']"
      @input="handleInput"
    />
    <span v-if="error" :id="`${controlId}-error`" class="label-p5 text-label-xs text-red">{{ error }}</span>
  </div>
</template>
