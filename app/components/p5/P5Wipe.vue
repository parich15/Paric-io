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

<style scoped>
.p5-wipe {
  position: absolute;
  inset: 0;
  z-index: var(--z-wipe);
  overflow: hidden;
  pointer-events: none;
}

.p5-wipe--fixed { position: fixed; }

.p5-wipe__plane {
  position: absolute;
  inset: -20% calc(-20% - 30vh);
  transform: translateX(-130%) skewX(-18deg);
}

.p5-wipe__plane--red { background: var(--p5-red); }
.p5-wipe__plane--ink { background: var(--p5-ink); }
.p5-wipe__plane--paper { background: var(--p5-paper); }

.p5-wipe__center { position: absolute; inset: 0; display: grid; place-items: center; }

.p5-wipe__stamp {
  max-width: 90vw;
  padding: 0 28px 8px;
  background: var(--p5-ink);
  color: var(--p5-paper);
  font-size: var(--size-h1);
  text-align: center;
  overflow-wrap: anywhere;
  opacity: 0;
  transform: rotate(-4deg);
}

@media (prefers-reduced-motion: reduce) {
  .p5-wipe { display: none !important; }
}
</style>
