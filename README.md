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

Castellano: `/` y `/proyectos`; inglés: `/en` y `/en/projects`. Solo una visita inicial a raíz detecta idioma en el navegador, después de hidratar. Las URLs concretas mantienen su idioma. El selector conserva página, slug, query y ancla y recuerda la elección manual.

El contacto es una maqueta: los campos no se envían ni almacenan y nunca se anuncia un envío. El enlace `mailto:oscar@paric.io` es la vía de contacto. Acciones demo sin destino están deshabilitadas.

Guías y trabajo multiagente: [AGENTS.md](AGENTS.md), [DESIGN.md](DESIGN.md), [DESIGN-SPECS.md](DESIGN-SPECS.md). Referencias originales en `references/`, componentes en `app/components/`, CSS y tokens en `app/assets/css/`, y guidelines en `references/guidelines/`. Excepción de contraste: [ADR 001](docs/adr/001-contraste.md).

El blog queda para una ampliación con Nuxt Content y contenido versionado; sin backoffice. CI, remoto y despliegue fuera de este arranque.
