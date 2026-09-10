import tailwindcss from '@tailwindcss/vite'
import { projects } from './app/data/projects'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-10',
  devtools: { enabled: false },
  modules: ['@nuxtjs/i18n', '@vueuse/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: { plugins: [tailwindcss()] },
  typescript: { strict: true },
  app: { head: { titleTemplate: '%s · Paric.io', meta: [{ name: 'theme-color', content: '#0A0A0A' }] } },
  i18n: {
    baseUrl: 'https://paric.io',
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    locales: [{ code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' }, { code: 'en', language: 'en-GB', name: 'English', file: 'en.json' }],
    detectBrowserLanguage: false,
    customRoutes: 'config',
    pages: {
      projects: { es: '/proyectos', en: '/projects' },
      'projects-slug': { es: '/proyectos/[slug]', en: '/projects/[slug]' },
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/en', '/proyectos', '/en/projects', ...projects.flatMap(project => [`/proyectos/${project.slug}`, `/en/projects/${project.slug}`])],
    },
  },
})
