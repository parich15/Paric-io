# Paric.io

Portfolio bilingüe de Oscar Paricio, inspirado en los prototipos Persona 5 proporcionados. Nuxt 4 + Vue 3 + TypeScript + Tailwind 4, i18n, VueUse y Anime.js. Las siete fichas son demos identificadas; no se presentan como encargos ni resultados verificados.

## Arranque en WSL
```bash
eval "$(fnm env --shell bash)"
fnm use
pnpm install --frozen-lockfile
pnpm dev
```

## Verificar y generar
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm generate
pnpm test:e2e
pnpm preview
```
Playwright usa el Chromium instalado en WSL; `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` permite elegir otro binario compatible. Sus pruebas arrancan el servidor estático en el puerto 4173. Las capturas se guardan en `test-results/`.

La entrega de producción es únicamente `.output/public`: HTML, JS, CSS, fuentes e imágenes. Servir directorios con su `index.html` y `404.html` para rutas inexistentes; no requiere Node en producción. No ejecutar `nuxt preview` como servidor de producción. `pnpm generate` genera inicio, galería y siete detalles en los dos idiomas.

La página de error se genera con HTML completo: usar `/en/404.html` como fallback para rutas inexistentes bajo `/en/` y `/404.html` para el resto, conservando la URL solicitada y el estado HTTP 404. Ambos archivos incluyen el mensaje y un enlace de vuelta al inicio incluso sin JavaScript.

Castellano: `/`, `/proyectos`, `/sobre-mi`, `/clientes` y `/contacto`; inglés: `/en`, `/en/projects`, `/en/about`, `/en/clients` y `/en/contact`. Solo una visita inicial a raíz detecta idioma en el navegador, después de hidratar. Las URLs concretas mantienen su idioma. El selector conserva página, slug, query y ancla y recuerda la elección manual.

El contacto (`/contacto`, sección `#contacto` del inicio) no envía ni guarda nada en el sitio: el formulario redacta un `mailto:oscar@oscarparic.io` con asunto y cuerpo a partir del borrador y lo abre en la aplicación de correo del visitante; sin JavaScript el propio formulario apunta a ese `mailto:`. Nunca se anuncia un envío. Acciones demo sin destino están deshabilitadas.

Guías y trabajo multiagente: [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), [DESIGN-SPECS.md](DESIGN-SPECS.md). Referencias originales en `references/`, componentes en `app/components/`, CSS y tokens en `app/assets/css/`, y guidelines en `references/guidelines/`. Excepción de contraste: [ADR 001](docs/adr/001-contraste.md).

El blog queda para una ampliación con Nuxt Content y contenido versionado; sin backoffice. CI, remoto y despliegue fuera de este arranque.
