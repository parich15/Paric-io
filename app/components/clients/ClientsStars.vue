<script setup lang="ts">
/**
 * Trama de estrellas concéntricas del menú de Persona 5 para el plano de Clientes.
 *
 * Cada parche apila `RING_COUNT` estrellas numeradas con `--i`; la estrella `i` vale
 * `scale((i - 1) / RING_COUNT)` en reposo, de modo que el patrón nace ya crecido en el
 * primer fotograma (sin JavaScript ni aparición escalonada).
 *
 * El bucle no salta porque cada ciclo desplaza cada estrella exactamente dos anillos:
 * `(i - 1) / N` → `(i + 1) / N`. Al reiniciar, la estrella `i` vuelve a donde estaba la
 * `i - 2`, que comparte paridad y por tanto color, así que el conjunto de radios y colores
 * visibles es idéntico al del fotograma inicial. El orden de apilado tampoco cambia: los
 * radios son monótonos en `i` y se pintan de mayor a menor, dejando la más pequeña encima.
 * Cada parche se recorta además con la misma estrella al 80 %, así que los dos anillos que
 * nacen en el centro y los dos que mueren en el borde quedan siempre fuera del recorte: el
 * fotograma final del ciclo es idéntico al inicial. Los parches `shrink` reproducen la misma
 * animación en `reverse`.
 */
type StarPatch = { x: number; y: number; size: number; rot: number; scale: number; mode: 'grow' | 'shrink' }

const RING_COUNT = 10

/** Índices pintados de mayor a menor: la estrella más pequeña queda la última y encima. */
const rings = Array.from({ length: RING_COUNT }, (_, index) => RING_COUNT - 1 - index)

/** Posiciones deterministas (el markup SSG debe ser estable): sin `Math.random()`. */
const patches: StarPatch[] = [
  { x: 8, y: 6, size: 260, rot: 12, scale: 1, mode: 'grow' },
  { x: 34, y: 14, size: 200, rot: 143, scale: .7, mode: 'grow' },
  { x: 62, y: 4, size: 300, rot: 58, scale: 1, mode: 'shrink' },
  { x: 12, y: 26, size: 180, rot: 96, scale: 1, mode: 'grow' },
  { x: 44, y: 32, size: 280, rot: 27, scale: 1, mode: 'grow' },
  { x: 76, y: 24, size: 220, rot: 170, scale: 1, mode: 'grow' },
  { x: 6, y: 48, size: 300, rot: 74, scale: 1, mode: 'shrink' },
  { x: 34, y: 54, size: 240, rot: 132, scale: 1, mode: 'grow' },
  { x: 66, y: 46, size: 190, rot: 15, scale: .7, mode: 'grow' },
  { x: 20, y: 70, size: 280, rot: 108, scale: 1, mode: 'grow' },
  { x: 52, y: 74, size: 220, rot: 44, scale: 1, mode: 'grow' },
  { x: 82, y: 66, size: 260, rot: 155, scale: 1, mode: 'shrink' },
  { x: 10, y: 92, size: 240, rot: 88, scale: 1, mode: 'grow' },
  { x: 58, y: 96, size: 300, rot: 22, scale: 1, mode: 'grow' },
  { x: 88, y: 88, size: 200, rot: 120, scale: .7, mode: 'grow' },
]
</script>

<template>
  <div class="clients-stars" aria-hidden="true">
    <div
      v-for="(patch, index) in patches"
      :key="index"
      class="clients-star-patch"
      :data-mode="patch.mode"
      :style="{ '--x': `${patch.x}%`, '--y': `${patch.y}%`, '--size': `${patch.size}px`, '--rot': `${patch.rot}deg`, '--scale': `${patch.scale}` }"
    >
      <span
        v-for="ring in rings"
        :key="ring"
        class="clients-star"
        :class="{ 'clients-star-paper': ring % 2 === 0 }"
        :style="{ '--i': `${ring}` }"
      ></span>
    </div>
  </div>
</template>

<style scoped src="~/assets/css/components/clients-stars.css"></style>
