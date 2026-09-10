<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const { t } = useI18n()
const localePath = useLocalePath()
useSeoMeta({ title: () => t('meta.notFound'), robots: 'noindex' })
</script>

<template>
  <main id="main-content" class="error-page" tabindex="-1">
    <span class="error-number display-p5" aria-hidden="true">{{ error.statusCode }}</span>
    <h1><P5Heading :text="t('error.title')" /></h1>
    <p>{{ t('error.description') }}</p>
    <P5Button :href="localePath('/')" variant="paper">{{ t('error.back') }}</P5Button>
  </main>
</template>

<style scoped>
.error-page { min-height: 100svh; overflow: hidden; padding: 15vh var(--page-x); display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 32px; position: relative; }
.error-number { position: absolute; right: 3vw; bottom: 0; font-size: 50vw; color: transparent; -webkit-text-stroke: 3px var(--fg); opacity: .18; transform: rotate(-6deg); z-index: -1; }
p { font-size: var(--size-body-lg); }
</style>
