# Paric.io Design System

Sistema de diseño del portfolio de **Oscar Paricio (paric.io)**: una web personal con estética de menú de videojuego JRPG (referencia declarada: la UI de *Persona 5*). Interfaz en español, tono directo, todo en mayúsculas cuando es display. Implementado con **Tailwind 4 (tokens en `@theme inline`) y componentes Vue 3 (SFC)**.

## Fuentes de este sistema
Extraído de los prototipos de este mismo proyecto: `Paricio Portfolio v2.dc.html` (inicio, menú overlay, contacto), `Proyectos.dc.html` (carrusel 3D, detalle de proyecto) y `Menu Boceto.dc.html`. No hay Figma ni repositorio; los valores (px, grados, easings) se copiaron literalmente de esos archivos.

## Uso en un proyecto Vue 3 + Tailwind 4
```css
/* src/main.css */
@import "../app/assets/css/main.css";
```
```vue
<script setup>
import { P5Button, P5Heading, P5Card } from '../app/components/p5'
</script>
<template>
  <P5Heading text="NOCTURNE STUDIO" :offset="1" />
  <P5Button size="lg" href="/nocturne">Ver en vivo</P5Button>
</template>
```
Tema claro: `<html data-theme="light">` (o en cualquier subárbol). Solo cambian tinta/papel; el rojo es constante.

## FUNDAMENTOS DE CONTENIDO
- **Idioma**: español. Segunda persona cercana pero sin exclamaciones ("Cuéntame qué tienes en mente").
- **Casing**: display, botones, etiquetas y tags SIEMPRE en mayúsculas (`text-transform: uppercase`, lo aplican `display-p5` y `label-p5`). Los párrafos en frase normal.
- **Longitud**: titulares de 1–2 palabras (PROYECTOS, EL RETO, LA SOLUCIÓN). Descripciones de una frase, ≤ 560px de ancho. Fichas "ETIQUETA / valor" (ROL · Front-end lead).
- **Vocabulario de juego**: "MENÚ:", "CARGANDO", pistas de teclado (←→ Navegar · ↵ Abrir · TAB Categoría), numeración 01/03.
- **Sin emoji.** Los únicos glifos son flechas ← → ↵ y el rombo ◆ (un cuadrado rotado 45°) como viñeta.
- Ejemplos reales: "VOLVER A PROYECTOS", "SIGUIENTE PROYECTO", "TRABAJOS PROFESIONALES", "+42% tiempo en página".

## FUNDAMENTOS VISUALES
- **Color**: tres tintas — tinta `#0A0A0A`, papel `#F5F5F5`, rojo `#E60012` (oscuros `#B3000E`, `#8F000B` solo para vetas). Neutros mínimos para cuñas inactivas y texto atenuado. Sin gradientes suaves; el único gradiente es lineal duro dentro de tarjetas (`--bg-2 → --bg`).
- **Dos temas**: oscuro (sección PROFESIONAL, por defecto) y claro (PERSONAL), invirtiendo tinta/papel. Transición de tema `.6s ease`.
- **Tipografía**: Anton (display y números), Barlow Condensed 800 (etiquetas, tracking .14–.30em), Barlow 400/600 (cuerpo 18–22px, lh 1.5). Display fluido con `clamp()`.
- **Motivo central**: el titular letra a letra (`P5Heading`): cada carácter rota ±3.5°, salta ±3px y cada 3ª/5ª letra lleva placa de tinta o rojo. En tema claro todas llevan placa.
- **Geometría**: TODO se inclina (`skewX` −6…−20°) y gira levemente (−1…−6°); el texto dentro se des-inclina. Botones primarios con `clip-path` trapezoidal. Radio **0** en todo; solo anillos decorativos son redondos.
- **Sombras**: duras, sin blur: `Npx Npx 0 color` (4–16px). Rojo sobre tinta/papel; tinta sobre papel/rojo; también en texto (`text-shadow`).
- **Bordes**: 2/3/4/6px sólidos del color de la tinta. Placeholders de imagen con borde discontinuo 2px + etiqueta.
- **Fondos**: planos inclinados a sangre (rojo o tinta) + zigzag B/N animado + halftone de puntos (12–18px) a opacidad .12–.32 + vetas rojas en el menú. Número de proyecto gigante en outline al fondo (opacidad .18).
- **Movimiento**: hover = scale 1.06–1.08 + rotate −2° con muelle `cubic-bezier(.2,1.4,.3,1)` en .2s; los primarios invierten color (rojo → papel). Entradas: *stamp* (sello, .45s), *rise* (.5s), *in* (diagonal .4s). Cambio de pantalla: *wipe* de 3 planos (rojo, tinta, papel) 1.1s + sello con el destino. `prefers-reduced-motion` anula duraciones.
- **Tarjetas**: borde 4px, sombra dura 16px (roja si activa), número Anton gigante arriba-izquierda, badge de año girado 3° arriba-derecha, cuña roja inclinada abajo-izquierda, tags abajo-derecha.
- **Layout**: cabecera fija (padding 20px 28px) con marca a la izquierda y "MENÚ:" + botón rojo a la derecha; selector de categoría vertical a la izquierda (`writing-mode: vertical-rl`); contenido con padding `6vw`; rejillas `repeat(auto-fit, minmax(min(100%, 220–380px), 1fr))`.
- **Transparencia/blur**: no se usa blur. Solo opacidad en texturas y en la sombra del número de fondo.
- **Imagen**: retrato con filtro duotono rojo/tinta y halftone multiplicado (ver `Paricio Portfolio v2`). Capturas de proyecto en marcos con borde 4px y sombra roja.
- **Foco**: `outline: 3px solid var(--accent)` con offset 3px.

## ICONOGRAFÍA
No hay set de iconos ni fuente de iconos. Todo icono es tipográfico o geométrico: flechas ← → ↵ en Anton, hamburguesa de 3 barras (`box-shadow` de currentColor), rombo (cuadrado rotado 45°), anillos discontinuos. Si hiciera falta un set, usar **Lucide** con `stroke-width: 3` (coincide con los bordes de 3px) — **no incluido**, decisión pendiente del usuario. Sin emoji. La marca es tipográfica ("PARIC.IO" en Anton sobre placa); no existe logotipo gráfico y no se ha creado ninguno.

## Tokens
`../app/assets/css/main.css` → `../app/assets/css/*.css` (custom properties en `:root`). Prefijos: `--p5-*` color base, `--bg/--fg/--accent` semánticos, `--type-*` familias, `--size-*` tamaños, `--track-*`, `--lh-*`, `--hard-*` sombras, `--skew-*`, `--rot-*`, `--clip-*`, `--easing-*`, `--dur-*`, `--space-*`, `--z-*`.
`../app/assets/css/tailwind.css` mapea esos tokens a utilidades (`bg-ink`, `text-paper`, `shadow-hard-lg`, `text-h1`, `font-display`, `ease-pop`, `animate-stamp`) y añade utilidades propias: `skew-p5[-xs|-md|-lg]`, `unskew-p5`, `clip-slant`, `text-shadow-hard[-lg]`, `text-shadow-ink`, `text-stroke-fg`, `halftone-ink|paper`, `zigzag`, `stripes-red`, `label-p5`, `display-p5`, `pop-hover`.

## Componentes (Vue 3, `../app/components/p5/`)
| Componente | Props clave |
|---|---|
| P5Button | variant primary/outline/paper/ghost · size sm/md/lg · href · disabled |
| P5Tag | tone outline/ink/red |
| P5Badge | tone ink/red/paper · rotate |
| P5Stamp | as · tone paper/ink/red · size h1/h2/h3 · animate |
| P5Heading | text · offset · plates · size title/h1/h2 · shadow |
| P5Card | num · title · year · kind · tags · active · slot media |
| P5FactCard | label · value |
| P5Input / P5Textarea | label · v-model · placeholder · error |
| P5NavItem | active · vertical · rotate |
| P5Kbd | keys |
| P5Switch | v-model · on · off |
| P5Wipe | show · label · fixed |
| P5Placeholder | label |

Intentional additions: **P5Placeholder** (marcador de imagen; los prototipos lo usan en todas las tarjetas) y **P5Switch** (formaliza el cambio Profesional/Personal).

## Índice
- [Persona 5 · Game UI Database](persona-5-game-ui-database.md) — referencia aportada por Oscar, capturas conservadas, análisis y aplicaciones propuestas al portfolio.
- `../app/assets/css/main.css`, `../app/assets/css/` — tokens CSS y `tailwind.css` (entrada Tailwind 4)
- `../app/components/p5/` — SFC + `index.ts` (barril) · `components/cards/` — specimens
- `ui_kits/portfolio/index.html` — pantalla Proyectos + detalle, interactiva (←→, ↵, TAB, Esc)
- `guidelines/` — specimens de color, tipo, espaciado, efectos, movimiento, marca
- `assets/retrato-oscar-paricio.jpg` — retrato usado en el menú
- `ds-browser.js` — cargador para previsualizar sin build (Tailwind browser + Vue + SFC loader por CDN)
- `SKILL.md`
- `../DESIGN.md` — reglas y tokens para agentes de código · `../DESIGN-SPECS.md` — filosofía, dirección artística y cómo extender el sistema

## Caveats
- Fuentes locales en ../public/fonts con sus licencias; las importaciones Google Fonts solo se conservan dentro de los prototipos originales.
- Los componentes son Vue; el compilador de este entorno solo empaqueta React (`.jsx` + `.d.ts`), así que no aparecen como "starting points" de componente. Las cards y el UI kit se renderizan con Vue por CDN.

Los archivos .dc.html de esta carpeta son los prototipos autónomos de composición e interacción. El UI kit y sus specimens se conservan como fuentes de referencia; el cargador CDN original no sustituye el entorno Nuxt de los componentes de producción.
