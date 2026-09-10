import type { Locale } from '~/data/projects'
import { localizedHash } from '~/utils/locale'

/** Cambia el idioma conservando ruta, proyecto, selección y ancla, y recuerda la elección manual. */
export function usePortfolioLocale() {
  const { locale, setLocaleCookie } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const route = useRoute()
  const router = useRouter()
  const cookie = useCookie<Locale>('i18n_redirected', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/' })
  const hydrated = ref(false)
  onMounted(() => { hydrated.value = true })

  /** El HTML estático no conoce query ni hash: se incorporan al enlace después de hidratar. */
  function localeTarget(targetLocale: Locale) {
    const localizedRoute = router.resolve(switchLocalePath(targetLocale))
    return { path: localizedRoute.path, query: hydrated.value ? route.query : {}, hash: hydrated.value ? localizedHash(route.hash, targetLocale) : '' }
  }

  function rememberLocale(targetLocale: Locale) {
    setLocaleCookie(targetLocale)
    cookie.value = targetLocale
  }

  return { locale, localeTarget, rememberLocale }
}
