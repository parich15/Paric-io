<script setup lang="ts">
import type { Skill } from '~/data/about'

const props = defineProps<{ skill: Skill, describedBy: string }>()
const emit = defineEmits<{ select: [] }>()
const { locale, t } = useI18n()
const level = computed(() => props.skill.fill === 5 ? 'advanced' : props.skill.fill >= 3 ? 'comfortable' : 'exploring')
</script>

<template>
  <li class="skill-item" @mouseenter="emit('select')" @focusin="emit('select')">
    <button type="button" class="skill-name label-p5" :aria-describedby="describedBy" @click="emit('select')">
      {{ skill.name[locale] }}
    </button>
    <span class="skill-level" role="img" :aria-label="`${skill.name[locale]}: ${t(`about.levels.${level}`)}`">
      <span v-for="segment in 5" :key="segment" class="skill-segment" :class="{ 'is-filled': segment <= skill.fill }" aria-hidden="true">
        <span v-if="segment <= skill.fill" class="skill-segment-fill"></span>
      </span>
    </span>
  </li>
</template>

<style scoped src="~/assets/css/components/about-skill.css"></style>
