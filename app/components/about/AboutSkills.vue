<script setup lang="ts">
import { skillGroups } from '~/data/about'

const { t, locale } = useI18n()
const enhanced = ref(false)
const expandedGroups = ref<string[]>([])
/** Skill destacado por grupo: el que está bajo el puntero o con foco; sin selección, el primero. */
const currentSkill = reactive<Record<string, number>>({})
onMounted(() => { enhanced.value = true })

function toggleMore(group: string) {
  expandedGroups.value = expandedGroups.value.includes(group)
    ? expandedGroups.value.filter(id => id !== group)
    : [...expandedGroups.value, group]
}

function current(group: typeof skillGroups[number]) {
  return group.skills[currentSkill[group.id] ?? 0]!
}

/** Los details nativos conservan teclado y apertura exclusiva incluso sin JavaScript. */
function navigateGroups(event: KeyboardEvent, index: number) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? skillGroups.length - 1 : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + skillGroups.length) % skillGroups.length
  const summary = (event.currentTarget as HTMLElement).closest('.skills-accordion')?.querySelectorAll<HTMLElement>('summary')[next]
  summary?.focus({ preventScroll: true })
}
</script>

<template>
  <section class="about-skills-stage" :data-enhanced="enhanced" :aria-label="t('about.skillsTitle')">
    <h2 class="skills-title" data-motion="stamp"><P5Heading :text="t('about.stack')" plates size="h2" /></h2>
    <div class="skills-accordion">
      <details v-for="(group, index) in skillGroups" :key="group.id" name="about-skills" class="skill-panel" :data-skill-group="group.id">
        <summary :id="`skill-trigger-${group.id}`" class="skill-spine" @keydown="navigateGroups($event, index)">
          <span class="skill-spine-title display-p5">{{ group.title }}</span>
          <span class="skill-spine-arrow display-p5" aria-hidden="true">+</span>
        </summary>
        <div class="skill-panel-content" role="region" tabindex="0" :aria-labelledby="`skill-trigger-${group.id}`">
          <div class="skill-panel-unskew">
            <div class="skill-panel-reveal">
              <ul :id="`skill-grid-${group.id}`" class="skill-list" :class="{ 'is-expanded': expandedGroups.includes(group.id) }">
                <AboutSkill
                  v-for="(skill, skillIndex) in group.skills" :key="skill.name.en"
                  :skill="skill" :described-by="`skill-legend-text-${group.id}`"
                  :class="{ 'is-current': (currentSkill[group.id] ?? 0) === skillIndex }"
                  @select="currentSkill[group.id] = skillIndex"
                />
              </ul>
              <div v-if="enhanced" class="skill-more">
                <P5Button variant="paper" size="sm" :aria-expanded="expandedGroups.includes(group.id)" :aria-controls="`skill-grid-${group.id}`" @click="toggleMore(group.id)">
                  {{ t(expandedGroups.includes(group.id) ? 'about.viewLess' : 'about.viewMore') }}
                </P5Button>
              </div>
            </div>
            <p class="skill-legend" role="status">
              <span class="skill-legend-name label-p5">{{ current(group).name[locale] }}</span>
              <span :id="`skill-legend-text-${group.id}`" class="skill-legend-text">{{ current(group).description[locale] }}</span>
              <span class="skill-legend-count display-p5" aria-hidden="true">{{ String((currentSkill[group.id] ?? 0) + 1).padStart(2, '0') }} <small>/ {{ group.skills.length }}</small></span>
            </p>
          </div>
        </div>
      </details>
    </div>
    <div v-if="enhanced" class="skills-keyboard keyboard-hints" aria-hidden="true">
      <P5Kbd keys="←→">{{ t('common.category') }}</P5Kbd>
      <P5Kbd keys="↵">{{ t('common.open') }}</P5Kbd>
      <P5Kbd keys="Esc">{{ t('common.close') }}</P5Kbd>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/components/about-skills.css"></style>
