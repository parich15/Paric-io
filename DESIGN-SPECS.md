# DESIGN-SPECS.md — Paric.io · Filosofía, dirección artística y cómo extender el sistema

> `DESIGN.md` dice **qué** es el sistema (tokens, componentes, reglas). Este documento dice **por qué** es así y **cómo pensar** cuando hay que diseñar algo que todavía no existe: una vista nueva, un estado no previsto, un componente que falta. Léelo antes de inventar.

---

## 1. Filosofía

### 1.1 La web como menú de juego
Un portfolio es una lista de cosas para elegir. Los menús de JRPG llevan décadas resolviendo exactamente eso con una energía que la web corporativa nunca se permitió: opciones enormes, feedback inmediato, transiciones que se sienten, una sola acción importante a la vez. Paric.io toma ese lenguaje al pie de la letra. Cada pantalla es un **menú** con una opción activa; cada cambio de pantalla es un **golpe**; cada dato es un **sello**.

Consecuencia práctica: cuando diseñes una vista nueva, pregúntate primero *"¿cuál es la opción activa aquí y cómo se nota a diez metros?"*. Si la respuesta no es obvia, la vista aún no está diseñada.

### 1.2 Máximo contraste, mínima paleta
Tres tintas bastan porque el trabajo lo hacen la forma y el tamaño, no el color. El rojo es un recurso escaso: marca **la** acción, **el** elemento activo, **la** sombra que da profundidad. Si en una vista hay más de tres o cuatro cosas rojas, alguna sobra.

### 1.3 Nada es recto porque nada está quieto
La inclinación no es decoración: comunica que la interfaz es un objeto con inercia, que puede moverse, que responde. Un bloque recto en este sistema parece roto. La rotación leve alternada (−2°, +2°, −1°) evita que la composición parezca simplemente torcida: es un collage pegado a mano, no una página impresa girada.

### 1.4 Grita, pero se entiende
La exageración está al servicio de la claridad, no en su contra. Tipografía enorme = jerarquía inequívoca. Sombra dura = profundidad sin ambigüedad. Barrido de pantalla = el usuario siempre sabe que ha cambiado de sitio y a dónde (el sello con el destino). Si una decisión hace la vista más espectacular pero menos legible, se descarta.

### 1.5 Honestidad
Placeholders que dicen qué falta. Datos concretos ("+42% tiempo en página") en vez de adjetivos. Copy en español directo sin exclamaciones. El sistema no promete; muestra.

---

## 2. Dirección artística

### 2.1 Referencias y qué tomamos de cada una
- **Menús de *Persona 5*** (Atlus, 2016): la opción activa que crece y se inclina, el rojo/negro/blanco, los recortes de letras a distintos tamaños, las transiciones de barrido. Tomamos la *gramática*, no los assets: ningún elemento gráfico se copia.
- **Cartelería punk / xerox**: sombras duras, halftone, pegado a mano, alternancia de rotaciones.
- **Señalética y tipografía de estadio**: Anton como condensada de impacto, etiquetas condensadas con tracking abierto.
- **Lo que NO somos**: brutalismo web frío (monoespaciadas, bordes 1px, gris), neón/synthwave (degradados, glow), corporativo SaaS (radios, sombras difusas, Inter).

### 2.2 Vocabulario formal
Cinco piezas construyen todo el sistema. Cualquier vista nueva debe poder describirse con ellas:

| Pieza | Qué es | Reglas |
|---|---|---|
| **Plano** | Un bloque de color a sangre, inclinado −14…−16°, que define la composición del fondo | 1–2 por vista, siempre sobresalen del viewport, uno puede llevar textura |
| **Placa** | Un rectángulo sólido con texto encima (tinta con papel, papel con tinta, rojo con papel), skew −10…−12°, rot −1…−4°, sombra dura | Toda unidad de texto no-párrafo va en una placa o con sombra dura |
| **Sello** | Una placa que aparece con `stamp` (grande → pequeño, girada −4°) | Marca el momento: destino del wipe, número del proyecto, titular activo |
| **Cuña** | Un bloque inclinado −20° que asoma por una esquina dentro de un contenedor | Da profundidad a tarjetas y marcos; roja si activo, neutra si no |
| **Textura** | Halftone / zigzag / vetas a baja opacidad | Solo sobre planos, nunca sobre texto ni sobre toda la vista |

### 2.3 Composición de una vista
El esqueleto que se repite (ver `references/ui_kits/portfolio/`):

1. **Fondo**: un plano rojo o tinta inclinado ocupando ~45% de un lado; opcionalmente un plano texturizado más estrecho en el lado opuesto; un elemento gigante en outline (número, letra) a opacidad .18 anclado a una esquina.
2. **Cabecera fija**: marca a la izquierda, contexto ("MENÚ: SECCIÓN" + subtítulo) y botón MENÚ rojo a la derecha. Es idéntica en todas las vistas: es el ancla.
3. **Navegación lateral** (si hay categorías): columna vertical a la izquierda. En móvil, fila inferior.
4. **Protagonista**: una sola cosa grande y centrada (tarjeta, retrato, formulario). Ligeramente descentrada hacia arriba para dejar sitio al titular.
5. **Titular + descripción**: abajo-izquierda, letra a letra, con una placa de una línea debajo.
6. **Controles**: abajo-derecha (contador, flechas). Pista de teclado centrada abajo, solo en escritorio alto.
7. **Wipe** cubriéndolo todo al entrar/salir.

Los pesos: fondo grande y quieto · protagonista grande y con vida (hover, drag) · texto enorme pero en una esquina · controles pequeños y con borde.

### 2.4 Ritmo y jerarquía
- Una vista = **un** protagonista, **un** titular, **una** acción primaria roja. Todo lo demás es secundario y va en tinta/papel.
- Escala en saltos grandes: si el titular mide 120px, la etiqueta mide 14px. Los tamaños intermedios (24–40px) se reservan a botones grandes y valores de ficha. No hay "h4, h5".
- Densidad baja: mucho aire alrededor de pocas cosas grandes. Una vista con más de ~7 grupos visuales necesita dividirse.

### 2.5 Movimiento como dirección artística
- **Entrar** = sellar (stamp) o subir (rise) con escalonado de .1–.15s entre bloques. Nunca fade puro.
- **Cambiar de sitio** = barrido de tres planos + sello con el destino. El usuario debe poder decir a dónde ha ido sin leer la nueva vista.
- **Tocar** = muelle (crece 6–8%, gira −2°). Los primarios invierten color: la sensación es de pulsador físico.
- **Esperar** = "CARGANDO" parpadeando en `steps(2)`, nunca spinner circular suave.
- **Reposo** = el fondo puede tener un movimiento lento y continuo (zigzag 3s, anillo 30s). Máximo un elemento en bucle por vista.
- Todo respeta `prefers-reduced-motion`: las entradas y el wipe pasan a instantáneo; el hover conserva el cambio de color.

### 2.6 Imagen y fotografía
- Retratos y capturas se tratan como **carteles pegados**: marco con borde 4px, sombra dura roja/tinta, rotación ±2°, cuña roja asomando.
- Fotografía en **duotono** rojo/tinta con halftone multiplicado. La foto nunca compite en color con la interfaz.
- Cuando el asset no existe, `P5Placeholder` con etiqueta descriptiva. Un hueco honesto es parte de la estética; un gris vacío no.

---

## 3. Cómo extender el sistema

### 3.1 Antes de crear algo nuevo
1. **Búscalo.** ¿Existe un componente o un token que lo resuelva al 80%? Úsalo y ajusta con `class`.
2. **Descríbelo con el vocabulario formal** (§2.2). Si no puedes decir "es una placa con…" o "es un sello que…", no encaja todavía.
3. **Encuentra su análogo en un menú de juego.** ¿Una tabla? → lista de opciones con la fila activa como placa roja. ¿Un modal? → sello grande sobre un plano oscuro, no una caja centrada con radio. ¿Un toast? → placa que entra con `in` desde la izquierda y se va con `wipe` pequeño. ¿Una pestaña? → `P5NavItem`.
4. **Decide qué es rojo.** Una cosa. Si nada, la vista no tiene acción principal y hay que replanteárselo.

### 3.2 Añadir un token
- Vive en `app/assets/css/<concern>.css` como `--nombre` en `:root`. Nombres en inglés, prefijo por familia (`--size-`, `--hard-`, `--skew-`…).
- Si Tailwind debe exponerlo, mapéalo en `app/assets/css/tailwind.css` dentro de `@theme inline` (`--color-*`, `--text-*`, `--shadow-*`, `--ease-*`, `--animate-*`) o como `@utility` si es una combinación.
- Valores exactos de los prototipos, no redondeados a una rejilla. Si no viene de ningún sitio, justifícalo en un comentario de una línea.
- Añade un specimen en `references/guidelines/` con `<!-- @dsCard group="…" -->` si el token es visible.

### 3.3 Añadir un componente Vue
- `app/components/p5/P5Nombre.vue`, `<script setup>`, props tipadas con `default`, comentario JSDoc de una línea encima de `defineProps` diciendo qué es y cuándo.
- Estilos solo con utilidades Tailwind del tema (`bg-fg`, `shadow-hard`, `skew-p5`, `label-p5`…). Sin CSS scoped salvo para `@keyframes` propios (que deberían ir a `app/assets/css/motion.css`).
- Debe funcionar en ambos temas sin código extra: usa semánticos (`bg-bg`, `text-fg`), no base (`bg-ink`) salvo cuando el color es intencionalmente fijo (el rojo, o un overlay que siempre es tinta).
- Texto en mayúsculas mediante utilidades, no en el contenido: el slot recibe "Ver en vivo" y el componente lo pone en mayúsculas.
- Estados mínimos: default, hover (muelle), focus-visible (outline 3px), disabled (`opacity-40 pointer-events-none`). Activo/inactivo si aplica.
- Expórtalo en `app/components/p5/index.ts` y añádelo a la tabla de `DESIGN.md`. Crea o amplía un specimen en `references/components/cards/`; el loader original `references/ds-browser.js` es solo una referencia, no el runtime de producto.

### 3.4 Diseñar una vista nueva
Plantilla mental, en orden:

1. **Nombre de menú.** ¿Cómo aparece en "MENÚ: ___" y en el sello del wipe? Una o dos palabras en mayúsculas.
2. **Tema.** ¿Oscuro (profesional, default) o claro (personal, íntimo)? El tema comunica registro.
3. **Plano de fondo.** ¿Qué lado, qué color, con qué textura? Elemento gigante en outline: ¿cuál?
4. **Protagonista.** Una sola cosa. ¿Cómo responde al hover/drag/teclado?
5. **Titular letra a letra + placa de una línea.**
6. **Acción primaria roja** y sus secundarias en outline.
7. **Controles y pistas de teclado.** ¿Qué hacen ←→, ↵, TAB, Esc?
8. **Entrada y salida.** Orden de los `rise` escalonados; texto del sello del wipe al salir.
9. **Móvil.** Selector a fila inferior, protagonista al 82vw, teclado oculto, titular más pequeño pero aún letra a letra.

Ejemplos de vistas futuras resueltas con este método:

- **SOBRE MÍ**: tema claro; plano tinta a la derecha con halftone; retrato duotono como protagonista (marco 4px, rot +2°); titular "OSCAR" letra a letra con placas; tres `P5FactCard` (Base · Años · Stack); primaria "DESCARGAR CV" (roja), secundaria "CONTACTO" (outline).
- **CONTACTO**: tema oscuro; plano rojo a la izquierda con vetas; formulario (`P5Input` ×2 + `P5Textarea`) como protagonista, inclinado −6° como una ficha; titular "HABLEMOS"; primaria "ENVIAR"; al enviar, wipe con sello "ENVIADO" y vuelta a inicio.
- **BLOG / NOTAS** (si existiera): lista vertical de placas grandes tipo `P5NavItem` horizontal, la activa roja; a la derecha vista previa como tarjeta; ↵ abre el artículo con wipe; el artículo es un detalle con la misma estructura que el de proyecto (fichas: FECHA · LECTURA · TEMA).
- **404**: número "404" gigante en outline como fondo, sello rojo "NO ENCONTRADO", una sola acción papel "VOLVER AL MENÚ".
- **Estado vacío** (categoría sin proyectos): `P5Placeholder` grande con "PRÓXIMAMENTE", sin fingir contenido.
- **Error de formulario**: borde del campo en rojo + etiqueta `label-p5` roja debajo, sin iconos, sin toast.

### 3.5 Lo que nunca se añade
- Colores nuevos, gradientes suaves, blur, radios, sombras difusas.
- Familias tipográficas nuevas. Iconos decorativos, emoji, ilustraciones "amigables".
- Fades como transición de pantalla. Spinners circulares.
- Modales con caja centrada y esquinas redondeadas. Tooltips flotantes con flechita.
- Texto gris "de ayuda" a media opacidad. Texto de relleno.
- Más de una acción roja por vista.

### 3.6 Cuándo romper las reglas
Solo si la ruptura hace la vista **más clara** para el usuario y se documenta aquí como excepción con motivo. Ejemplo válido: un párrafo largo de artículo puede ir sin skew en su contenedor (la legibilidad manda), pero su titular y sus fichas siguen inclinados. Ejemplo inválido: "queda más limpio sin sombra".

En la rama experimental `experiment/metro-3d`, por petición del usuario, el plano rojo de inicio contiene un metro 3D oscuro inspirado en Persona 5, con pasadas consecutivas en cuatro sentidos diagonales y grafitis FRONT END, BACKEND, FULL STACK y AI EDGERUNNER. Solo hay un tren a la vez. Su geometría admite curvatura y sombreado; las ventanillas son de gris claro neutro, sin dispersión. Por encima hay formas discontinuas muy translúcidas con deriva lenta e irregular. Con movimiento reducido, tren y formas se presentan estáticos.

---

## 4. Glosario

- **Tinta / papel**: negro `#0A0A0A` y blanco roto `#F5F5F5`. Se invierten con el tema.
- **Rojo**: `#E60012`. El único acento.
- **Plano, placa, sello, cuña, textura**: ver §2.2.
- **Letra a letra**: titular donde cada carácter rota y algunos llevan placa (`P5Heading`).
- **Wipe**: barrido de tres planos con sello de destino (`P5Wipe`).
- **Stamp / rise / in / pop**: animaciones de entrada (`app/assets/css/motion.css`).
- **Muelle**: easing `cubic-bezier(.2,1.4,.3,1)` de hover.
- **Pista de teclado**: barra de tinta con `P5Kbd` que enseña los atajos de la vista.

---

## 5. Relación con el resto de documentos

- `DESIGN.md` — reglas y tokens concretos. Si este documento y aquel discrepan en un valor, gana `DESIGN.md`; si discrepan en intención, gana este.
- `README.md` — arranque e índice de documentación.
- `AGENTS.md` y `.agents/skills/` — convenciones y skills para agentes.
- `references/ui_kits/portfolio/index.html` — la vista de referencia; cualquier vista nueva debería sentirse hermana suya.
