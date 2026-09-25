import tailwindcss from '@tailwindcss/vite'
import { projects } from './app/data/projects'
import { clients } from './app/data/clients'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://oscarparic.io'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-10',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n', '@vueuse/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  runtimeConfig: { public: { siteUrl } },
  app: {
    head: {
      titleTemplate: '%s · Paric.io',
      meta: [{ name: 'theme-color', content: '#111111' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '16x16 24x24 32x32 48x48 64x64 128x128 256x256' },
        ...[16, 24, 32, 48, 64, 96, 128, 192, 256, 512, 1024].map(size => ({
          rel: 'icon', type: 'image/png', sizes: `${size}x${size}`, href: `/favicon-${size}x${size}.png`,
        } as const)),
        ...[120, 152, 167].map(size => ({
          rel: 'apple-touch-icon', sizes: `${size}x${size}`, href: `/apple-touch-icon-${size}x${size}.png`,
        } as const)),
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest', crossorigin: 'use-credentials' },
        // Las dos familias del primer pantallazo: el titular (Anton) y el párrafo que marca el LCP (Barlow 600).
        ...['anton-400', 'barlow-600'].map(font => ({
          rel: 'preload', as: 'font', type: 'font/woff2', href: `/fonts/${font}.woff2`, crossorigin: '',
        } as const)),
      ],
    },
  },
  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    locales: [{ code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' }, { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' }],
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      about: { es: '/sobre-mi', en: '/about' },
      clients: { es: '/clientes', en: '/clients' },
      contact: { es: '/contacto', en: '/contact' },
      'clients-slug': { es: '/clientes/[slug]', en: '/clients/[slug]' },
      projects: { es: '/proyectos', en: '/projects' },
      'projects-slug': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
    },
  },
  nitro: {
    hooks: {
      'prerender:routes'(routes) {
        // Nuxt 4.5 genera un shell vacío para /404.html; renderizamos error.vue por idioma.
        routes.add('/404')
        routes.add('/en/404')
      },
      'prerender:generate'(route) {
        if (route.route === '/404.html') route.skip = true
        if ((route.route === '/404' || route.route === '/en/404') && route.error?.statusCode === 404) {
          route.fileName = `${route.route}.html`
          route.error = undefined
        }
      },
    },
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/en', '/proyectos', '/en/projects', '/sobre-mi', '/en/about', '/clientes', '/en/clients', '/contacto', '/en/contact', ...clients.flatMap(client => [`/clientes/${client.slug}`, `/en/clients/${client.slug}`]), ...projects.flatMap(project => [`/proyectos/${project.slug}`, `/en/projects/${project.slug}`])],
    },
  },
})
