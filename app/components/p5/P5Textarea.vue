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
  <div :class="['p5-field', { 'has-error': error }, props.class]">
    <label v-if="label" :for="controlId" class="p5-field-label label-p5 text-label tracking-label-xwide"><span>{{ label }}</span></label>
    <div class="p5-field-panel">
      <span class="p5-field-comma" aria-hidden="true"></span>
      <textarea
        v-bind="attrs"
        :id="controlId"
        :rows="rows"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-invalid="error ? true : attrs['aria-invalid']"
        :aria-describedby="[attrs['aria-describedby'], error ? `${controlId}-error` : undefined].filter(Boolean).join(' ') || undefined"
        class="p5-field-control font-body font-semibold text-body placeholder:text-fg-muted"
        @input="handleInput"
      ></textarea>
    </div>
    <span v-if="error" :id="`${controlId}-error`" class="label-p5 text-label-xs text-red">{{ error }}</span>
  </div>
</template>

<style src="~/assets/css/components/p5-field.css"></style>
