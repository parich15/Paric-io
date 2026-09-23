import { CONTACT_EMAIL, buildContactMailto } from '~/utils/contact'

/** Borrador de contacto: solo vive en la vista y se vuelca en un mailto que abre el correo del visitante; el sitio no envía ni guarda nada. */
export function useContactDraft() {
  const { t } = useI18n()
  const draft = reactive({ name: '', email: '', message: '' })
  const subject = computed(() => draft.name.trim() ? t('contact.subjectFrom', { name: draft.name.trim() }) : t('contact.subject'))
  const mailto = computed(() => buildContactMailto(draft, subject.value))

  /** Sin JavaScript el formulario ya apunta al mailto; con él se redactan asunto y cuerpo antes de abrir el correo. */
  function compose(event: Event) {
    event.preventDefault()
    window.location.assign(mailto.value)
  }

  return { address: CONTACT_EMAIL, draft, mailto, compose }
}
