<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import type { HTMLAttributes, TextareaHTMLAttributes } from 'vue'

defineOptions({ inheritAttrs: false })

/** Texto multilínea con error asociado; `class` estiliza el contenedor y los demás atributos llegan al textarea. */
const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  id?: string
  label?: string
  modelValue?: string
  placeholder?: string
  rows?: number
  error?: string
}>(), { class: undefined, id: undefined, label: undefined, modelValue: undefined, placeholder: undefined, rows: 4, error: undefined })

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const attrs = useAttrs() as TextareaHTMLAttributes
const generatedId = useId()
const controlId = computed(() => props.id ?? generatedId)

function handleInput(event: Event) {
  const control = event.currentTarget as HTMLTextAreaElement
  if (!control.disabled) emit('update:modelValue', control.value)
}
</script>
<template>
  <div :class="['flex flex-col gap-2', props.class]">
    <label v-if="label" :for="controlId" class="label-p5 text-label tracking-label-xwide text-fg">{{ label }}</label>
    <textarea
      v-bind="attrs"
      :id="controlId"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="error ? true : attrs['aria-invalid']"
      :aria-describedby="[attrs['aria-describedby'], error ? `${controlId}-error` : undefined].filter(Boolean).join(' ') || undefined"
      :class="['bg-bg text-fg font-body font-semibold text-body px-4 py-3 border-3 resize-y placeholder:text-fg-muted transition-shadow duration-150 focus:shadow-hard-md disabled:opacity-40 disabled:pointer-events-none', error ? 'border-red' : 'border-fg']"
      @input="handleInput"
    ></textarea>
    <span v-if="error" :id="`${controlId}-error`" class="label-p5 text-label-xs text-red">{{ error }}</span>
  </div>
</template>
