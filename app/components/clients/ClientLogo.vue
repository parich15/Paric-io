<script setup lang="ts">
import type { Client } from '~/data/clients'

/** Usa el logo real cuando está disponible; las demos se identifican con una inicial tipográfica. */
defineProps<{ client: Client }>()
</script>

<template>
  <span class="client-logo" aria-hidden="true">
    <img v-if="client.logo" :src="client.logo" alt="" width="240" height="240" />
    <span v-else class="display-p5">{{ client.initials }}</span>
  </span>
</template>

<style scoped src="~/assets/css/components/client-logo.css"></style>
