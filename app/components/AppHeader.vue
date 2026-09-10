<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const menu = useTemplateRef('menu')
const menuOpen = ref(false)
const section = ref('home')
const contextLabel = computed(() => t(`common.${String(route.name).startsWith('projects') ? 'projects' : section.value}`))
const homeTarget = computed(() => ({ path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' }))

/** El hash solo se lee tras montar para que la cabecera inicial coincida con el HTML estático. */
function updateContext() {
  section.value = ['#sobre', '#about'].includes(route.hash) ? 'about' : ['#contacto', '#contact'].includes(route.hash) ? 'contact' : 'home'
}

onMounted(updateContext)
watch(() => route.fullPath, updateContext)
</script>

<template>
  <header class="app-header">
    <NuxtLink :to="homeTarget" class="header-brand display-p5" aria-label="Paric.io">Paric.io</NuxtLink>
    <div class="header-controls">
      <div class="header-context display-p5">{{ t('common.menu') }}: <span>{{ contextLabel }}</span></div>
      <LocaleSwitch />
      <button class="header-toggle label-p5" type="button" :aria-label="t('common.openMenu')" aria-haspopup="dialog" aria-controls="global-menu" :aria-expanded="menuOpen" @click="menu?.open()">
        <span>{{ t('common.menu') }}</span><span class="header-bars" aria-hidden="true"></span>
      </button>
    </div>
  </header>
  <GlobalMenu ref="menu" @change="menuOpen = $event" />
</template>

<style scoped src="~/assets/css/components/app-header.css"></style>
