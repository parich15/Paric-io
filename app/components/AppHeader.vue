<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const menu = useTemplateRef('menu')
const menuOpen = ref(false)
const homeTarget = computed(() => ({ path: localePath('index'), hash: locale.value === 'es' ? '#inicio' : '#home' }))

</script>

<template>
  <header class="app-header">
    <AppBrand :to="homeTarget" class="header-brand display-p5" />
    <div class="header-controls">
      <Teleport defer to="#menu-header-actions" :disabled="!menuOpen">
      <LocaleSwitch />
      <button class="header-toggle label-p5" :class="{ 'is-open': menuOpen }" type="button" :aria-label="t(menuOpen ? 'common.closeMenu' : 'common.openMenu')" aria-haspopup="dialog" aria-controls="global-menu" :aria-expanded="menuOpen" @click="menuOpen ? menu?.close() : menu?.open()">
        <span class="header-toggle-label" aria-hidden="true">
          <span class="header-label-open"><span v-for="(letter, index) in t('common.menu')" :key="index" :style="{ '--letter-index': index }">{{ letter }}</span></span>
          <span class="header-label-close"><span v-for="(letter, index) in t('common.close')" :key="index" :style="{ '--letter-index': index }">{{ letter }}</span></span>
        </span>
        <span class="header-bars" aria-hidden="true"></span>
      </button>
      </Teleport>
    </div>
  </header>
  <GlobalMenu ref="menu" @change="menuOpen = $event" />
</template>

<style scoped src="~/assets/css/components/app-header.css"></style>
