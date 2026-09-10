# Paric.io

## Entorno y ejecución
Repositorio Git independiente, rama principal `main`. Nuxt 4, Vue 3, TypeScript estricto, Tailwind 4 mediante `@tailwindcss/vite`, VueUse, i18n y Anime.js. Solo SSG: `pnpm generate` produce `.output/public`; producción sirve exclusivamente esa carpeta, sin servidor Nuxt ni endpoints.

Antes de cualquier comando Node, también en shells no interactivas y worktrees:
```bash
eval "$(fnm env --shell bash)"
fnm use
pnpm install --frozen-lockfile
```
`.node-version` fija Node 22 compatible. fnm está instalado en WSL. pnpm y cada worktree usan sus propias dependencias y artefactos. Playwright ya dispone de Chromium en `~/.cache/ms-playwright`; no reinstalar navegadores sin necesidad.

## Normas proporcionales
Resuelve el problema concreto con el cambio más pequeño y convencional que lo complete. No conviertas inventarios, evidencias, decisiones de Jira ni comprobaciones puntuales en código de producto, frameworks, manifests, validadores, gates o abstracciones nuevas. Da por válidos los hechos confirmados por el usuario salvo contradicción real. Antes de añadir tooling, archivos de control o capas ajenas a funcionalidad no solicitados, explica su necesidad y espera aprobación. Si una API se resuelve con código directo y pruebas normales, hazlo así. Cuando el usuario diga que pares, detén inmediatamente lecturas, escrituras, pruebas y acciones externas.

## Guías obligatorias
Leer completos [DESIGN.md](DESIGN.md) y [DESIGN-SPECS.md](DESIGN-SPECS.md) antes de tocar UI. Jerarquía: decisiones del usuario y excepciones documentadas; DESIGN para valores; DESIGN-SPECS para intención; [prototipos](references/) para composición/interacción. La fuente única de tokens es [app/assets/css](app/assets/css/), mapeada en `tailwind.css`. Componentes P5 en `app/components/p5`; specimens y guidelines en `references`. No copiar los tokens a las skills.

Todos los componentes de producto viven en `app/components/`, incluidos los P5 en `app/components/p5/`; todo el CSS vive en `app/assets/css/`, con `main.css` como entrada y `tailwind.css` como mapeo. Los prototipos y guidelines son referencias, no código de producto. Sus instrucciones de demo/CDN no sustituyen convenciones Nuxt de producción. Las fuentes ahora se sirven localmente desde `public/fonts` con sus licencias. Leer el [ADR de contraste](docs/adr/001-contraste.md): conservar colores, tamaños y placas originales. Contacto es una maqueta sin envío; los proyectos son demos sin resultados reales acreditados.

Skills versionadas en `.agents/skills`: frontend-design (dirección), design-system (tokens/componentes), responsive-design (reflujo), motion-design (Anime.js) y visual-qa (capturas). Consultar la correspondiente al trabajo. Para diseño nuevo se pueden investigar referencias Persona 5; comunicar enlace y aplicación propuesta al director antes de extender el lenguaje visual.

## Código
Estructura Nuxt 4: `app/pages` compone vistas, `app/components` presenta e interactúa, `app/composables` encapsula comportamiento reutilizado, `app/plugins` integra dependencias y `app/data` contiene contenido tipado. Composition API y `<script setup lang="ts">`. Props/eventos tipados, nombres claros, funciones concretas, contratos pequeños y composición. SOLID proporcional; no añadir abstracciones especulativas. JSDoc en castellano donde explique contratos, efectos o decisiones relevantes; no comentar cada línea. CSS gestiona geometría y hover, Anime.js secuencias; separar wrappers animados de los que conservan skew/rotación. Limpiar listeners y animaciones al desmontar.

## Idiomas
Castellano predeterminado: `/`, `/proyectos`, `/proyectos/[slug]`. Inglés: `/en`, `/en/projects`, `/en/projects/[slug]`. Slugs estables. Traducir contenido, controles, nombres accesibles y SEO. Datos comunes en `app/data/projects.ts`, textos de interfaz en `i18n/locales`. Detección solo en navegador al entrar por raíz; URL concreta siempre manda. Elección manual persistida en cookie `i18n_redirected`. Mantener proyecto, query y ancla al cambiar idioma. HTML inicial completo y estable; no basar markup SSR en viewport, cookie o movimiento preferido.

## Trabajo por lotes y worktrees
El coordinador es Design Director y propietario de dependencias, lockfile, tokens, traducciones comunes y contratos. Cada lote: brief/base comprometida → revisiones de diseño en paralelo → resolución de contratos → implementación en worktrees desde el mismo commit → commits de especialistas → integración secuencial → pruebas y capturas → correcciones → main.
```bash
git worktree add ../portfolio-worktrees/home -b feature/home main
git worktree add ../portfolio-worktrees/projects -b feature/projects main
git switch -c integration/portfolio main
git merge --no-ff feature/home
git merge --no-ff feature/projects
```
Asignar objetivo, referencias, directorio absoluto, archivos exclusivos y aceptación. Cada agente escribe solo en su worktree. No compartir node_modules ni artefactos. Validar integración antes de incorporar a main. Retirar solo worktrees propios, limpios e integrados con `git worktree remove`; no forzar ni tocar trabajo ajeno. Sin remoto, CI ni despliegue en este arranque.

## Verificación
`pnpm lint`, `pnpm typecheck`, `pnpm test`; tras integrar varias vistas, `pnpm generate && pnpm test:e2e`. Preview estático: `pnpm preview`. Pruebas de comportamiento real (carrusel, retorno, idiomas, teclado/foco, contacto, movimiento, SSG sin JS), no pruebas decorativas. Capturas esperando fuentes, con movimiento estabilizado, ES/EN en escritorio/tablet/móvil desde 360px y pantalla baja. Comparar primeras capturas con referencias antes de aceptarlas. Validar skills con el `quick_validate.py` existente de skill-creator y comprobar sus referencias relativas. No crear CI ni gates adicionales.

## Context7
Consultar Context7 MCP para preguntas o implementación dependientes de bibliotecas, frameworks, SDK, API, CLI o cloud, incluso conocidos. Empezar con `resolve-library-id` (nombre y pregunta completa), elegir coincidencia reputada y relevante, después `query-docs` con ID y pregunta concreta. Usar versión pedida cuando exista. Preferirlo a búsqueda web de documentación. No usar para refactoring, lógica de negocio, scripts propios, revisión de código o conceptos generales.
