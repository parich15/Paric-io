import type { Locale } from '~/data/projects'
import { localizedHash } from '~/utils/locale'

/** Cambia el idioma conservando ruta, proyecto, selección y ancla, y recuerda la elección manual. */
export function usePortfolioLocale() {
  const { locale, setLocaleCookie } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const route = useRoute()
  const router = useRouter()
  const cookie = useCookie<Locale>('i18n_redirected', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/' })

  function localeTarget(targetLocale: Locale) {
    const localizedRoute = router.resolve(switchLocalePath(targetLocale))
    return { path: localizedRoute.path, query: route.query, hash: localizedHash(route.hash, targetLocale) }
  }

  function rememberLocale(targetLocale: Locale) {
    setLocaleCookie(targetLocale)
    cookie.value = targetLocale
  }

  return { locale, localeTarget, rememberLocale }
}
