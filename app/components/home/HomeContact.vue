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

<style scoped>
.home-contact { position: relative; padding: 140px var(--page-x) 120px; isolation: isolate; overflow: hidden; }
.contact-plane { position: absolute; z-index: -1; top: -10%; left: -15%; width: 45%; height: 130%; background: var(--p5-red); transform: skewX(var(--skew-lg)); }
.contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); gap: 56px; align-items: center; }
.contact-copy { display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-11); min-width: 0; }
.contact-number { font-size: clamp(36px, 4vw, 60px); }
.contact-copy h2 { max-width: 100%; font-size: clamp(44px, 6.5vw, 120px); overflow-wrap: anywhere; }
.contact-copy p { margin: 0; font-size: 20px; line-height: 1.45; font-weight: 600; max-width: 420px; }
.contact-email { display: inline-flex; align-items: center; min-height: 44px; color: var(--p5-paper); font-size: var(--size-btn); }
.contact-email:hover { color: var(--p5-ink); }
.contact-form { display: flex; flex-direction: column; gap: var(--space-8); padding: var(--space-13); background: var(--p5-ink); border: var(--border-3) solid var(--p5-paper); box-shadow: var(--hard-xl); }
.contact-form > p { margin: 0 0 var(--space-2); color: var(--p5-gray); font-size: var(--size-body); line-height: 1.45; }
.contact-form > button { align-self: flex-start; max-width: 100%; margin-top: var(--space-3); }
@media (width < 760px) { .home-contact { padding-top: var(--space-17); padding-bottom: var(--space-17); } .contact-plane { width: 65%; left: -32%; } .contact-form { padding: var(--space-9); } .contact-grid { gap: var(--space-14); } }
</style>
