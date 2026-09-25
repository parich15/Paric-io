export const CONTACT_EMAIL = 'oscar@oscarparic.io'

export interface ContactDraft { name: string, email: string, message: string }

/** Codifica según RFC 6068: espacios como %20 y saltos de línea como %0D%0A, que los clientes de correo sí interpretan. */
function encodeMailtoValue(value: string): string {
  return encodeURIComponent(value.replace(/\r?\n/g, '\r\n'))
}

/** Vuelca el borrador en un mailto con asunto y cuerpo; sin contenido devuelve la dirección desnuda para que el HTML estático no cambie. */
export function buildContactMailto(draft: ContactDraft, subject: string): string {
  const name = draft.name.trim()
  const email = draft.email.trim()
  const message = draft.message.trim()
  if (!name && !email && !message) return `mailto:${CONTACT_EMAIL}`
  const signature = [name, email].filter(Boolean).join('\n')
  const body = [message, signature].filter(Boolean).join('\n\n')
  const params = [subject && `subject=${encodeMailtoValue(subject)}`, body && `body=${encodeMailtoValue(body)}`].filter(Boolean)
  return `mailto:${CONTACT_EMAIL}?${params.join('&')}`
}
