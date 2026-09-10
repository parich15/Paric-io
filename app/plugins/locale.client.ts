import { detectLocale, localizedHash } from '~/utils/locale'

/** Detecta el idioma solo al hidratar una entrada por raíz; las rutas concretas siempre mandan. */
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const savedLocale = useCookie<string | undefined>('i18n_redirected')
  const initialPath = window.location.pathname

  nuxtApp.hook('app:mounted', async () => {
    if (initialPath !== '/') return
    const preferredLocale = detectLocale(navigator.language, savedLocale.value)
    if (preferredLocale !== 'en') return
    const route = router.currentRoute.value
    await router.replace({ path: '/en', query: route.query, hash: localizedHash(route.hash, 'en') })
  })
})
