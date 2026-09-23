import type { Locale } from '~/data/projects'
import { localizedHash } from '~/utils/locale'

interface PendingLocale { locale: Locale, path: string }

/** Cambia el idioma conservando ruta, proyecto, selección y ancla, recuerda la elección manual y expone el cambio en curso. */
export function usePortfolioLocale() {
  const { locale, setLocaleCookie } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const route = useRoute()
  const router = useRouter()
  const cookie = useCookie<Locale>('i18n_redirected', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/' })
  const hydrated = ref(false)
  const pending = useState<PendingLocale | null>('locale:pending', () => null)
  onMounted(() => { hydrated.value = true })

  /** El HTML estático no conoce query ni hash: se incorporan al enlace después de hidratar. */
  function localeTarget(targetLocale: Locale) {
    const localizedRoute = router.resolve(switchLocalePath(targetLocale))
    return { path: localizedRoute.path, query: hydrated.value ? route.query : {}, hash: hydrated.value ? localizedHash(route.hash, targetLocale) : '' }
  }

  /** Solo un clic normal navega en esta pestaña; con teclas modificadoras el enlace abre otra y no hay espera que mostrar. */
  function rememberLocale(targetLocale: Locale, event?: MouseEvent) {
    setLocaleCookie(targetLocale)
    cookie.value = targetLocale
    if (targetLocale === locale.value || !event || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    pending.value = { locale: targetLocale, path: localeTarget(targetLocale).path }
  }

  /**
   * Los mensajes del idioma se descargan dentro del middleware de i18n, así que la navegación no se confirma hasta tenerlos.
   * Si esa descarga falla (por ejemplo, un hash de despliegue anterior), NuxtLink silencia el error y la página quedaría igual:
   * en ese caso se carga la URL destino completa, que en un sitio estático siempre existe.
   */
  if (import.meta.client) {
    const removeHooks = [
      router.afterEach((to) => { if (pending.value && to.path === pending.value.path) pending.value = null }),
      router.onError((_error, to) => {
        if (!pending.value || to.path !== pending.value.path) return
        pending.value = null
        window.location.assign(to.fullPath)
      }),
    ]
    onScopeDispose(() => removeHooks.forEach(remove => remove()))
  }

  return { locale, localeTarget, rememberLocale, pendingLocale: computed(() => pending.value?.locale ?? null) }
}
