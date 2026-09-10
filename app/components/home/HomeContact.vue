<script setup lang="ts">
const { t, locale } = useI18n()
const contactAnchor = computed(() => locale.value === 'es' ? 'contacto' : 'contact')

/** Los campos pertenecen a una maqueta: su contenido solo vive en esta instancia y nunca se envía. */
const draft = reactive({ name: '', email: '', message: '' })
</script>

<template>
  <section :id="contactAnchor" class="home-contact" aria-labelledby="contact-title">
    <div class="contact-plane" aria-hidden="true"></div>
    <div class="contact-grid">
      <div class="contact-copy" data-motion="rise">
        <span class="contact-number display-p5" aria-hidden="true">04</span>
        <P5Stamp id="contact-title" tone="ink" size="h1">{{ t('contact.title') }}</P5Stamp>
        <p>{{ t('contact.description') }}</p>
        <P5Button href="mailto:oscar@paric.io" variant="paper" size="lg">{{ t('contact.write') }}</P5Button>
        <a class="contact-email label-p5" href="mailto:oscar@paric.io">oscar@paric.io</a>
      </div>
      <div data-motion="rise">
        <form class="contact-form" aria-describedby="contact-notice" @submit.prevent>
          <p id="contact-notice">{{ t('contact.mock') }}</p>
          <P5Input v-model="draft.name" :label="t('contact.name')" :placeholder="t('contact.namePlaceholder')" />
          <P5Input v-model="draft.email" type="email" :label="t('contact.email')" :placeholder="t('contact.emailPlaceholder')" />
          <P5Textarea v-model="draft.message" :label="t('contact.message')" :placeholder="t('contact.messagePlaceholder')" />
          <P5Button type="submit" disabled size="lg">{{ t('contact.submit') }}</P5Button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/components/home-contact.css"></style>
