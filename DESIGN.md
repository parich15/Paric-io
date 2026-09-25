# DESIGN.md — Paric.io

> Guía de diseño para agentes de código (Claude Code, Codex, Hermes…) y personas. Léela entera antes de tocar UI. Cuando dudes entre "sutil" y "exagerado", elige exagerado: este sistema es un menú de JRPG, no un dashboard SaaS.

---

## 0. En una frase

Portfolio personal de **Oscar Paricio** con la energía visual de un menú de *Persona 5*: tres tintas (negro, papel, rojo), tipografía enorme en mayúsculas, todo inclinado y girado, sombras duras sin desenfoque, y transiciones de barrido que hacen sentir cada cambio de pantalla como un golpe.

**Stack:** Vue 3 (SFC, `<script setup>`) + Tailwind 4 (`@theme inline`). Tokens en `app/assets/css/*.css`, utilidades en `app/assets/css/tailwind.css`, componentes en `app/components/p5/`.

---

## 1. Principios (en orden de prioridad)

1. **Contraste absoluto.** Tinta sobre papel, papel sobre tinta, rojo como golpe. Nunca grises "suaves" para texto principal; nunca gradientes sutiles; nunca transparencias para atenuar texto (usa `--fg-muted`).
2. **Nada es recto.** Todo bloque de UI lleva `skewX` (−6° a −20°) y muchos una rotación leve (−1° a −6°). El texto interior se des-inclina (`unskew-p5`) para seguir siendo legible. Las esquinas son **siempre rectas**: `border-radius: 0`.
3. **Sombras duras, no blur.** `Npx Npx 0 color`. Rojo sobre tinta/papel, tinta sobre papel/rojo. También en texto (`text-shadow`). Cero `blur()`, cero `backdrop-filter`.
4. **Mayúsculas en todo lo que no sea párrafo.** Titulares, botones, etiquetas, tags, badges, pistas de teclado. Los párrafos van en frase normal, cortos, ≤ 560px.
5. **Movimiento con muelle.** Hover = crece y gira un poco con `cubic-bezier(.2,1.4,.3,1)`. Entradas = sello (*stamp*). Cambio de pantalla = barrido de tres planos (*wipe*). Respeta `prefers-reduced-motion`.
6. **Vocabulario de juego.** "MENÚ:", "CARGANDO", numeración `01 / 03`, pistas `←→ Navegar · ↵ Abrir · TAB Categoría`. Sin emoji, sin iconos decorativos.
7. **Accesible aunque grite.** Foco visible (`outline 3px rojo`), contraste AA mínimo (la paleta lo garantiza), hit targets ≥ 44px, `aria-label` en botones de solo glifo.

---

## 2. Color

Tres tintas y una escala neutra mínima. **No inventes colores.** Si necesitas un tono nuevo, pide permiso; mientras tanto usa `oklch` variando solo la luminosidad de estos.

| Token | Hex | Uso |
|---|---|---|
| `--p5-ink` | `#0A0A0A` | Fondo oscuro, texto sobre papel, bordes, sombras sobre papel/rojo |
| `--p5-paper` | `#F5F5F5` | Fondo claro, texto sobre tinta/rojo |
| `--p5-red` | `#E60012` | Acento único: botones primarios, sombras, placas, cuñas, selección |
| `--p5-red-dark` / `--p5-red-deep` | `#B3000E` / `#8F000B` | **Solo** en las vetas del fondo del menú (`--stripes-red`) |
| `--p5-ink-2` / `--p5-ink-3` | `#1C1C1C` / `#2A2A2A` | Gradiente duro interno de tarjetas; cuñas inactivas (tema oscuro) |
| `--p5-paper-2` / `--p5-paper-3` | `#E4E4E4` / `#CFCFCF` | Ídem en tema claro |
| `--p5-gray` / `--p5-gray-2` | `#C9C9C9` / `#5A5A5A` | Texto atenuado (oscuro / claro). Nunca para texto principal |

### Tokens semánticos (úsalos en componentes, no los base)

```
--bg  --bg-2  --fg  --fg-muted  --accent  --accent-fg  --surface-card  --border-strong  --shadow-ink
```

Tailwind: `bg-bg`, `text-fg`, `text-fg-muted`, `bg-accent`, `border-fg`… y los base `bg-ink`, `bg-paper`, `bg-red`, `text-gray`.

### Dos temas

- **Oscuro** (por defecto) = sección PROFESIONAL: fondo tinta, texto papel.
- **Claro** = sección PERSONAL: `[data-theme="light"]` invierte tinta/papel. **El rojo no cambia nunca.**
- El cambio de tema anima `background`/`color` en `.6s ease` (`--dur-theme`).
- Regla: en tema claro, el motivo de puntillismo (halftone) sube a opacidad `.32`; en oscuro es `0`. Los zigzags bajan a `.12–.16`.

### Prohibido
Gradientes suaves de dos colores, tonos pastel, azules/morados, sombras con blur, opacidad para atenuar texto, bordes de color "sutil" (`rgba`), fondos blancos puros `#FFF` (excepto `::selection`).

---

## 3. Tipografía

Tres familias, tres trabajos. Todas locales, procedentes de Google Fonts (`app/assets/css/fonts.css`).

| Rol | Familia | Token | Peso | Reglas |
|---|---|---|---|---|
| **Display** | Anton | `--type-display` / `font-display` | 400 | Siempre mayúsculas, `line-height .9`, `letter-spacing .04em`. Números, titulares, botones grandes, marca |
| **Etiqueta** | Barlow Condensed | `--type-label` / `font-label` | **800** | Mayúsculas, tracking abierto `.14–.30em`. Tags, badges, kbd, botones md/sm, subtítulos, claves de fichas |
| **Cuerpo** | Barlow | `--type-body` / `font-body` | 400 / **600** | Frase normal, 18–22px, `line-height 1.5`, máx. 560px. Descripciones y párrafos |

### Escala

Display fluido con `clamp()`; UI fija en px exactos.

```
--size-hero   clamp(64px, 14vw, 180px)   intro / marca gigante
--size-title  clamp(52px, 8.5vw, 150px)  h1 de detalle
--size-h1     clamp(40px, 7vw, 120px)    titular activo
--size-h2     clamp(32px, 4vw, 56px)     "EL RETO", "LA SOLUCIÓN"
--size-h3     clamp(22px, 2vw, 30px)     valor de ficha
--size-num    clamp(48px, 7vw, 110px)    número de tarjeta
--size-btn-lg 22px · --size-btn 18px · --size-btn-sm 16px
--size-body-lg 22px · --size-body 18px
--size-label 14px · --size-label-sm 13px · --size-label-xs 12px
```

Tracking: `--track-label .14em` (tags) · `-wide .18em` (badges, botones) · `-xwide .24em` (subtítulos, claves) · `-loader .30em` ("CARGANDO").

### El motivo central: titular letra a letra (`P5Heading`)

Cada carácter es un `<span>` que rota `±3.5°`, se desplaza `±3px` en Y, y según su posición lleva placa de tinta o rojo detrás (patrón de 8: `[—, —, tinta, —, rojo, —, —, tinta]`). En tema claro **todas** las letras llevan placa (patrón `[tinta, rojo, tinta, tinta, rojo, tinta, tinta, rojo]`). Las letras sin placa llevan `text-shadow: 5px 5px 0 rojo`. **No reimplementes esto a mano: usa el componente.**

### Utilidades compuestas

- `display-p5` = Anton + mayúsculas + lh .9 + tracking .04em
- `label-p5` = Barlow Condensed 800 + mayúsculas + tracking .14em

---

## 4. Geometría: inclinación, giro, recorte

| Token | Valor | Dónde |
|---|---|---|
| `--skew-xs` | −6° | Fichas, botón "Siguiente proyecto" |
| `--skew-sm` | −8° | Pill de fecha/cliente |
| `--skew` | −10° | Botones outline/paper, tags, badges de descripción, contador |
| `--skew-md` | −12° | Marca, selector de categoría, pista de teclado |
| `--skew-lg` | −16° | Planos de fondo a sangre |
| `--skew-xl` | −20° | Cuña roja dentro de tarjetas |
| `--rot-1…-6` | −1°…−6° | Giro leve acumulado al skew. Sellos y stamps a −4/−5°. Números gigantes a −6° |
| `--rot-pos-2/3` | +2° / +3° | Badges de año, marco de captura (contrapunto) |
| `--clip-slant` | `polygon(8% 0,100% 0,92% 100%,0 100%)` | Botones primarios rojos (sin skew: el trapecio ya inclina) |

Reglas:
- Un elemento inclinado **contiene** texto des-inclinado: `transform: skewX(-10deg)` fuera, `skewX(10deg)` dentro (`unskew-p5`).
- Alterna signos de rotación entre vecinos (−2°, +2°, −1°) para que la composición vibre y no parezca simplemente torcida.
- Los planos de fondo sobresalen del viewport (`top:-10%; height:130%; right:-14%`) para que el skew no deje esquinas vacías.

---

## 5. Bordes, sombras, texturas

**Bordes:** 2px (tags), 3px (botones, inputs, fichas, kbd), 4px (tarjetas, marcos de imagen), 6px (anillos decorativos). Siempre sólidos y del color de la tinta actual (`border-fg`). Discontinuo (`dashed`) solo en placeholders de imagen y anillos.

**Sombras duras** (`shadow-hard-*`):
```
--hard-sm 4px · --hard 5px · --hard-md 6px · --hard-lg 8px · --hard-xl 12px · --hard-2xl 16px   (rojas)
--hard-ink 5px · --hard-ink-lg 8px                                                              (tinta)
--text-shadow-hard 4px · --text-shadow-hard-lg 5px (rojo) · --text-shadow-ink 6px (tinta)
```
Escala con el elemento: tags sin sombra; botones 5–6px; stamps 8px; tarjetas 16px; CTA de página 12px.

**Texturas** (siempre a baja opacidad, siempre sobre un plano inclinado, nunca sobre texto):
- `halftone-ink` / `halftone-paper`: puntos radiales 12–18px, opacidad `.12–.32`.
- `zigzag`: chevrones B/N de 60px (`--zigzag-period`), opacidad `.12–.16`. El patrón es una única baldosa SVG (`--zigzag-mask`) aplicada como `mask` a una lámina `::before` de tinta una baldosa más alta: un solo tile no deja costuras al inclinarse ni al animarse, como sí hacían varios gradientes superpuestos. `animate-zig` la desplaza con `transform` lineal e infinito (`--dur-zig` 3s), nunca con `background-position`.
- El halftone del plano de portada se desplaza igual: una capa un paso más grande (`--halftone-step`) movida con `transform`, para que la animación vaya en el compositor.
- `stripes-red`: vetas diagonales en tres rojos, solo fondo del menú.
- Número de proyecto gigante en outline (`text-stroke-fg`, 3px), opacidad `.18`, −6°, anclado abajo-derecha.

**Radio:** 0. Sin excepciones salvo `border-radius: 50%` en anillos decorativos.

---

## 6. Espaciado y layout

Valores exactos, no una rejilla de 8. Escala `--space-1…17`: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 48, 72, 80, 96.

- **Cabecera** fija: padding `20px 28px`; marca (placa tinta, skew −12°, rot −2°, sombra roja 5px) a la izquierda; a la derecha bloque "MENÚ: SECCIÓN" + botón rojo `clip-slant-tight` con hamburguesa de tres barras.
- **Página**: padding horizontal `6vw` (`--page-x`), superior `110px` (`--page-top`) para dejar sitio a la cabecera.
- **Selector de categoría**: columna vertical pegada a la izquierda (`left 2.5vw`, `writing-mode: vertical-rl`); en móvil (<760px) pasa a fila inferior.
- **Rejillas**: `repeat(auto-fit, minmax(min(100%, N), 1fr))` con N = 220px (fichas), 300px (piezas clave), 340px (reto/solución), 380px (cabecera de detalle). La galería usa 12 columnas: capturas de escritorio de dos en dos (la impar final, centrada y más grande) y los móviles en una fila propia. Gaps 24–48px.
- **Párrafos**: `max-width 560px` (`--content-max`), 520px dentro de columnas.
- **Capas z**: `--z-bg 0 · --z-stage 10 · --z-ui 30 · --z-nav 40 · --z-detail 100 · --z-header 120 · --z-wipe 150 · --z-intro 200`.
- **Pista de teclado**: solo en escritorio con alto ≥ 700px. Se oculta en móvil y pantallas bajas para no pisar el titular.

---

## 7. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--easing-pop` | `cubic-bezier(.2,1.4,.3,1)` | Hover/press (rebote) |
| `--easing-slash` | `cubic-bezier(.2,.9,.2,1)` | Entradas diagonales, planos de intro |
| `--easing-wipe` | `cubic-bezier(.7,0,.3,1)` | Barrido de pantalla |
| `--easing-stamp` | `cubic-bezier(.2,1.2,.3,1)` | Sellos |
| `--dur-hover .2s` · `--dur-stamp .45s` · `--dur-rise .5s` · `--dur-theme .6s` · `--dur-wipe 1.1s` | | |

**Hover:** `scale(1.06–1.08) rotate(-2deg)` manteniendo el skew previo. Botones primarios invierten color (rojo → papel/tinta); botones outline se rellenan con la tinta. Nada de cambios de opacidad ni subrayados.

**Press:** no hay estado press distinto; el muelle del hover ya da la respuesta. Foco: `outline: 3px solid var(--accent); outline-offset: 3px`.

**Entradas** (`@keyframes` en `app/assets/css/motion.css`, utilidades `animate-*`):
- `stamp`: de `scale(2.2) rotate(-14deg)` a `scale(1) rotate(-4deg)`. Titulares, números, sello del wipe.
- `rise`: 30px hacia arriba + fade. Bloques de contenido, escalonados `.2s / .3s / .45s / .55s`.
- `in`: 60px desde la izquierda + fade, sin skew (se aplica al wrapper, la opción ya va inclinada). Opciones del menú en móvil, escalonadas `.08s` desde `--i`.
- `pop`: `scale(0) rotate(-30deg)` → `rotate(-6deg)`. Badges que aparecen.
- `blink`: `steps(2)` .8s. Solo "CARGANDO".
- `spin-slow`: 30s lineal. Anillos discontinuos decorativos.
- Cursor (`AppCursor`, solo puntero fino): un marco dashed de 2px encaja con muelle en el elemento bajo el puntero o con foco de teclado; tinta/papel del tema, acento y 3px sobre la acción primaria o la opción activa; sella al pulsar. Mientras rodea al elemento con foco sustituye al `outline`.
- `zig`: desplaza la lámina `::before` del `zigzag` una baldosa por ciclo (`--dur-zig` 3s, lineal, infinito). Bucle de reposo, siempre lineal para que no frene en cada vuelta.
- `float` (`p5float`, utilidad `animate-float`): reposo de las piezas de interfaz como los menús de P5. Solo anima `translate`, así convive con el skew/rotate de `transform`, con el hover y con las entradas sin wrappers extra. Amplitud `--float-x` 2px / `--float-y` −5px (hasta −12px en el póster del menú), `--dur-float` 3.4s `ease-in-out`, con desfases negativos distintos por pieza para que no floten al unísono. Con movimiento reducido quedan quietas.

**Cambio de pantalla (`P5Wipe`):** tres planos (rojo, tinta, papel) con `skewX(-18deg)` barren de izquierda a derecha con desfase `.08s`; a los `.35s` aparece un sello con el nombre del destino; el contenido cambia a los `.5s`; todo termina a `1.15s`. Úsalo para **cada** cambio de sección o apertura de detalle. Nunca un fade.

`prefers-reduced-motion: reduce` pone las duraciones de entrada/wipe a 0. Respétalo: no añadas animaciones fuera de los tokens.

---

## 8. Componentes (`app/components/p5/`)

Importa desde el barril: `import { P5Button, P5Card } from '~/components/p5'`. Todos aceptan `class` para posicionamiento externo. **No dupliques estilos que ya viven en un componente.**

| Componente | Cuándo | Props |
|---|---|---|
| `P5Button` | Cualquier acción. `primary` (rojo, trapecio) para la acción principal de la vista — **una por vista**; `outline` secundaria; `paper` para "volver"; `ghost` para enlaces menores | `variant`, `size sm/md/lg`, `href`, `disabled` |
| `P5Tag` | Stack técnico, categoría corta | `tone outline/ink/red` |
| `P5Badge` | Año, estado, número pequeño; siempre ligeramente girado | `tone ink/red/paper`, `rotate` |
| `P5Stamp` | Titulares de sección sobre placa sólida ("EL RETO") | `as`, `tone paper/ink/red`, `size h1/h2/h3`, `animate` |
| `P5Heading` | Titular protagonista letra a letra | `text`, `offset`, `plates`, `size title/h1/h2`, `shadow` |
| `P5Card` | Tarjeta de proyecto (16:10) | `num`, `title`, `year`, `kind`, `tags`, `active`, slot `media` |
| `P5FactCard` | Ficha clave/valor (ROL · Front-end lead) | `label`, `value` |
| `P5Input` / `P5Textarea` | Formularios (contacto) | `label`, `v-model`, `placeholder`, `error` |
| `P5NavItem` | Opción de menú o categoría; la activa es roja, mayor y con rombo | `active`, `vertical`, `rotate` |
| `P5Kbd` | Pista de teclado dentro de una barra de tinta. `↵` se dibuja en SVG con trazo cuadrado: ninguna fuente local lo trae y la fuente del sistema costaba ~160 ms al aparecer | `keys` |
| `P5Switch` | Dos estados con etiqueta (Profesional/Personal) | `v-model`, `on`, `off` |
| `P5Wipe` | Transición entre pantallas | `show`, `label`, `fixed` |
| `P5Placeholder` | Hueco de imagen mientras no hay asset real | `label` |

### Recetas rápidas

```vue
<!-- Cabecera de detalle -->
<span class="inline-flex items-center gap-3 bg-paper text-ink label-p5 text-btn-sm tracking-label-xwide px-[14px] py-[5px]"
      style="transform: rotate(-2deg) skewX(-8deg)">
  <span class="w-[10px] h-[10px] bg-red rotate-45"></span>2026 · Nocturne
</span>
<h1 class="m-0"><P5Heading text="NOCTURNE STUDIO" size="title" /></h1>
<p class="font-body font-semibold text-body-lg leading-[1.45] max-w-[560px]">…</p>
<div class="flex gap-4"><P5Button size="lg">Ver en vivo</P5Button><P5Button size="lg" variant="outline">Código</P5Button></div>
```

```vue
<!-- Fondo de sección -->
<div class="absolute -top-[10%] -right-[14%] w-[46%] h-[130%] bg-red" style="transform: skewX(-16deg)"></div>
<div class="absolute inset-0 halftone-ink" style="opacity:.14"></div>
```

---

## 9. Contenido y tono

- **Español**, segunda persona cercana, sin exclamaciones ni jerga de marketing. "Cuéntame qué tienes en mente", no "¡Hablemos!".
- Titulares de 1–2 palabras. Descripciones de una frase que dicen qué es y para quién: *"Web corporativa con transiciones de página y CMS headless para un estudio de fotografía."*
- Fichas con dato concreto: "+42% tiempo en página", "60 fps con 10k puntos", "1.2k activos". Nada de "resultados increíbles".
- Reto / Solución en dos párrafos cortos, uno cada uno.
- CTA en imperativo o infinitivo corto: "VER EN VIVO", "CÓDIGO", "VOLVER A PROYECTOS", "SIGUIENTE PROYECTO".
- Nunca emoji. Los únicos glifos: `← → ↵`, la hamburguesa de tres barras y el rombo.

---

## 10. Iconografía e imagen

- **No hay set de iconos.** Los iconos son tipográficos (flechas en Anton) o geométricos (barras, rombo, anillo). Si un caso lo exige de verdad, usa Lucide con `stroke-width: 3` y `stroke-linecap: square` para casar con los bordes de 3px — y documéntalo.
- **La marca es tipográfica**: "PARIC.IO" en Anton sobre placa tinta/papel, skew −12°, rot −2°, sombra roja. No existe logotipo gráfico; no dibujes uno.
- **Fotografía**: duotono rojo/tinta (`filter: grayscale(1) contrast(1.3)` + capa roja `mix-blend-mode: multiply`) con halftone de 7px multiplicado. Marcos con borde 4px y sombra roja 16px, rotados ±2°.
- **Miniaturas de la portada** (paradas de Obras): en blanco y negro (`grayscale(1) contrast(1.3)`); al pasar o enfocar, capa roja y halftone de 7px multiplicados, como la fotografía. La placa sigue en tinta: el rojo lo ponen borde, sombra y duotono.
- **Carrusel de proyectos** (`ProjectCarouselCard`): la portada va en blanco y negro. Las tarjetas vecinas la tapan con un velo de puntillismo: dos mitades de tinta enmascaradas por la trama SVG `--dots-mask`, con una franja `--dots-edge-mask` cuyos puntos menguan hacia el corte. Al pasar a principal, las mitades se abren hacia los lados con `transform` y el hover de una vecina las entreabre.
- **Capturas de producto** (`ProjectImage`): sin duotono, porque la interfaz real es el contenido. Marco `browser` (barra tinta con tres píldoras inclinadas y el dominio del enlace público) o `phone` (muesca), borde 4px, sombra dura y rotación ±2°. En el detalle, el móvil se superpone a la captura principal.
- **Visor de galería** (`ProjectGallery`): `<dialog>` nativo a pantalla completa en tinta con cuña roja, contador `NN / NN`, cierre papel con `Esc` y flechas ←→ en placas inclinadas. Devuelve el foco a la miniatura. Sin JavaScript cada miniatura enlaza a su archivo.
- **Sites en producción** (`ProjectSites`): placas de papel con el favicon del cliente en un cuadro de papel fijo, nombre en Anton y `↗`; hover rojo con muelle, abren en otra pestaña. Se agrupan por sector bajo etiquetas de tinta y una placa roja da el total publicado. Los favicons se sirven en local.
- **Imágenes ausentes**: `P5Placeholder` con etiqueta descriptiva en mayúsculas ("CAPTURA PRINCIPAL"), nunca un gris vacío.

---

## 11. Checklist antes de entregar UI

- [ ] ¿Solo tinta, papel y rojo? ¿Ningún color inventado, ningún gradiente suave, ningún blur?
- [ ] ¿Cada bloque está inclinado/girado y su texto des-inclinado? ¿Radio 0 en todo?
- [ ] ¿Display y etiquetas en mayúsculas con Anton / Barlow Condensed 800? ¿Párrafos ≤ 560px en Barlow?
- [ ] ¿Sombras duras proporcionales al tamaño del elemento?
- [ ] ¿Hover con muelle (`ease-pop`) y foco visible de 3px?
- [ ] ¿Cambio de pantalla con `P5Wipe`, entradas con `stamp`/`rise`? ¿`prefers-reduced-motion` respetado?
- [ ] ¿Una sola acción primaria roja por vista?
- [ ] ¿Funciona en tema claro (`data-theme="light"`) sin tocar código?
- [ ] ¿Hit targets ≥ 44px, `aria-label` en botones de glifo, pista de teclado oculta en móvil/pantallas bajas?
- [ ] ¿Cero emoji, cero iconos decorativos, cero texto de relleno?

---

## 12. Mapa de archivos

```
app/assets/css/main.css                 → @import de todos los tokens (:root)
app/assets/css/colors.css          → tintas, neutros, semánticos, [data-theme="light"]
app/assets/css/typography.css      → familias, escala, tracking, pesos
app/assets/css/spacing.css         → escala px, padding de página, z-index
app/assets/css/effects.css         → sombras duras, bordes, skew/rot, clip, texturas
app/assets/css/motion.css          → easings, duraciones, @keyframes, reduced-motion
app/assets/css/fonts.css           → fuentes locales con licencias en public/fonts (Anton, Barlow, Barlow Condensed)
app/assets/css/tailwind.css        → @import "tailwindcss" + @theme inline + @utility propias  ← entrada Tailwind 4
app/components/p5/*.vue       → 14 SFC + index.ts (barril)
references/components/cards/*.html    → specimens de componentes
references/guidelines/*.html          → specimens de fundamentos
references/ui_kits/portfolio/         → pantalla Proyectos + detalle, referencia de composición
references/ds-browser.js   → loader original de specimens (no sustituye al runtime Nuxt)
README.md · AGENTS.md      → arranque y convenciones para agentes
.agents/skills/            → skills de diseño y verificación
DESIGN-SPECS.md            → filosofía, dirección artística y método para extender el sistema
```
