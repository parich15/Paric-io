<script setup lang="ts">
const { t } = useI18n()
const { address, draft, mailto, compose } = useContactDraft()
const fieldCount = 3
const activeField = ref(0)
const stamped = ref(false)
const step = computed(() => String(activeField.value + 1).padStart(2, '0'))
const total = String(fieldCount).padStart(2, '0')

useSeoMeta({
  title: () => t('meta.contactTitle'),
  description: () => t('meta.contactDescription'),
  ogTitle: () => `${t('meta.contactTitle')} · Paric.io`,
  ogDescription: () => t('meta.contactDescription'),
  twitterTitle: () => `${t('meta.contactTitle')} · Paric.io`,
  twitterDescription: () => t('meta.contactDescription'),
})

/** El contador sella el campo activo como la opción de un menú; conserva el último al salir del formulario. */
function onFocusIn(event: FocusEvent) {
  const control = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-field]') : null
  if (!control) return
  const index = Number(control.dataset.field)
  if (index === activeField.value) return
  activeField.value = index
  stamped.value = true
}
</script>

<template>
  <main id="main-content" tabindex="-1" class="contact-page" data-theme="dark">
    <div class="contact-plane" aria-hidden="true"></div>
    <span class="contact-outline display-p5 text-stroke-fg" aria-hidden="true">{{ t('nav.contactWord') }}</span>

    <header class="contact-intro">
      <div data-motion="stamp">
        <div class="contact-title">
          <h1><P5Heading :text="t('contact.title')" size="h1" /></h1>
        </div>
      </div>
      <div class="contact-copy" data-motion="rise">
        <a class="contact-address label-p5" :href="mailto"><span aria-hidden="true"></span><span>{{ address }}</span></a>
        <p class="contact-lead">{{ t('contact.description') }}</p>
      </div>
    </header>

    <div class="contact-stage" data-motion="rise">
      <form class="contact-sheet" :action="`mailto:${address}`" method="post" enctype="text/plain" aria-describedby="contact-notice" @submit="compose" @focusin="onFocusIn">
        <span :key="activeField" class="contact-step display-p5" :class="{ 'animate-stamp': stamped }" aria-hidden="true">{{ step }} <small>/ {{ total }}</small></span>
        <p id="contact-notice" class="contact-notice">{{ t('contact.notice') }}</p>
        <P5Input v-model="draft.name" name="name" data-field="0" autocomplete="name" :label="t('contact.name')" :placeholder="t('contact.namePlaceholder')" />
        <P5Input v-model="draft.email" name="email" data-field="1" type="email" autocomplete="email" :label="t('contact.email')" :placeholder="t('contact.emailPlaceholder')" />
        <P5Textarea v-model="draft.message" name="message" data-field="2" :rows="4" :label="t('contact.message')" :placeholder="t('contact.messagePlaceholder')" />
        <div class="contact-actions">
          <P5Button type="submit" size="lg">{{ t('contact.compose') }}</P5Button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped src="~/assets/css/pages/contact.css"></style>
