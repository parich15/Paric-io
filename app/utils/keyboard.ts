/** Los atajos globales nunca interceptan escritura ni controles de edición. */
export function isEditingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))
}
