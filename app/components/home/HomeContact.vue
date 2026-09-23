<script setup lang="ts">
const { t, locale } = useI18n()
const contactAnchor = computed(() => locale.value === 'es' ? 'contacto' : 'contact')
const { address, draft, mailto, compose } = useContactDraft()
</script>

<template>
  <section :id="contactAnchor" class="home-contact" aria-labelledby="contact-title">
    <div class="contact-plane" aria-hidden="true"></div>
    <div class="contact-grid">
      <div class="contact-copy" data-motion="rise">
        <span class="contact-number display-p5" aria-hidden="true">04</span>
        <P5Stamp id="contact-title" tone="ink" size="h1">{{ t('contact.title') }}</P5Stamp>
        <p>{{ t('contact.description') }}</p>
        <P5Button :href="mailto" variant="paper" size="lg">{{ t('contact.write') }}</P5Button>
        <a class="contact-email label-p5" :href="mailto">{{ address }}</a>
      </div>
      <div data-motion="rise">
        <form class="contact-form" :action="`mailto:${address}`" method="post" enctype="text/plain" aria-describedby="contact-notice" @submit="compose">
          <p id="contact-notice">{{ t('contact.notice') }}</p>
          <P5Input v-model="draft.name" name="name" autocomplete="name" :label="t('contact.name')" :placeholder="t('contact.namePlaceholder')" />
          <P5Input v-model="draft.email" name="email" type="email" autocomplete="email" :label="t('contact.email')" :placeholder="t('contact.emailPlaceholder')" />
          <P5Textarea v-model="draft.message" name="message" :label="t('contact.message')" :placeholder="t('contact.messagePlaceholder')" />
          <P5Button type="submit" size="lg">{{ t('contact.compose') }}</P5Button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped src="~/assets/css/components/home-contact.css"></style>
