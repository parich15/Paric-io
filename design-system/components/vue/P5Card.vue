<script setup lang="ts">
import P5Tag from './P5Tag.vue'
import P5Badge from './P5Badge.vue'
import P5Placeholder from './P5Placeholder.vue'
/** Tarjeta presentacional: el consumidor aporta navegación accesible y el texto alternativo del slot `media` o `mediaLabel` traducido. */
withDefaults(defineProps<{
  num?: string
  title?: string
  year?: string
  kind?: string
  tags?: string[]
  active?: boolean
  mediaLabel?: string
}>(), { num: undefined, title: undefined, year: undefined, kind: undefined, tags: () => [], active: true, mediaLabel: undefined })
</script>
<template>
  <article :aria-label="title" :class="['relative aspect-[16/10] overflow-hidden bg-bg border-4 border-fg transition-shadow duration-500', active ? 'shadow-hard-2xl' : 'shadow-[16px_16px_0_var(--shadow-ink)]']">
    <div aria-hidden="true" class="absolute inset-0 bg-[linear-gradient(135deg,var(--bg-2)_0%,var(--bg)_65%)]"></div>
    <div aria-hidden="true" class="absolute inset-0 halftone-ink opacity-[0.12]" style="background-image: radial-gradient(var(--fg) 1.2px, transparent 1.4px)"></div>
    <div aria-hidden="true" :class="['absolute -left-[22%] -bottom-[35%] w-[72%] h-[95%] skew-p5-lg', active ? 'bg-red' : 'bg-fg/15']" style="transform: skewX(-20deg)"></div>
    <div class="absolute inset-0 grid place-items-center"><slot name="media"><P5Placeholder :label="mediaLabel ?? ('IMAGEN · ' + (title ?? ''))" /></slot></div>
    <span class="absolute left-5 top-[14px] display-p5 text-num text-fg -rotate-6 text-shadow-hard-lg">{{ num }}</span>
    <P5Badge v-if="year" class="absolute top-4 right-4" tone="ink">{{ year }}</P5Badge>
    <footer class="absolute left-0 right-0 bottom-0 flex justify-between items-end gap-3 px-5 py-4">
      <P5Tag v-if="kind" tone="red" class="text-label-sm tracking-label-wide px-[10px] py-[3px]">{{ kind }}</P5Tag>
      <div class="flex flex-wrap justify-end gap-[6px]"><P5Tag v-for="tag in tags" :key="tag">{{ tag }}</P5Tag></div>
    </footer>
  </article>
</template>
