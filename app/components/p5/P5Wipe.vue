<script setup lang="ts">
/** Planos persistentes; AppMotion controla su timeline y la retirada mediante show. */
withDefaults(defineProps<{ show?: boolean, label?: string, fixed?: boolean }>(), { show: false, label: '', fixed: true })

const root = useTemplateRef('root')
const stamp = useTemplateRef('stamp')

function getElements() {
  if (!root.value || !stamp.value) return null
  return { root: root.value, stamp: stamp.value, planes: [...root.value.querySelectorAll<HTMLElement>('[data-wipe-plane]')] }
}

defineExpose({ getElements })
</script>

<template>
  <div v-show="show" ref="root" data-testid="page-wipe" class="p5-wipe" :class="{ 'p5-wipe--fixed': fixed }" aria-hidden="true" inert>
    <div v-for="tone in ['red', 'ink', 'paper']" :key="tone" data-wipe-plane class="p5-wipe__plane" :class="`p5-wipe__plane--${tone}`"></div>
    <div class="p5-wipe__center">
      <div ref="stamp" class="p5-wipe__stamp display-p5">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped src="~/assets/css/components/p5-wipe.css"></style>
