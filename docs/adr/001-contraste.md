# ADR 001 — Conservar el contraste del diseño original

Estado: aceptado por decisión explícita del usuario.

Se conservan exactamente la paleta, los tamaños y las placas de los prototipos. En particular, papel `#F5F5F5` sobre rojo `#E60012` no alcanza el umbral AA de 4,5:1 exigido al texto pequeño. No se modifica el rojo, se agranda el texto ni se cambia su placa para corregir esta limitación.

Esta excepción se limita a esa combinación de texto pequeño. No constituye una declaración de conformidad AA del sitio. Permanecen exigibles semántica, nombres accesibles, foco visible, objetivos táctiles, teclado, gestión y restauración del foco, HTML legible sin JavaScript y respeto del movimiento reducido.

Otras adaptaciones autorizadas del arranque: fuentes locales con licencia, interfaz bilingüe, datos demo explícitos y contacto sin envío ni confirmación ficticia. El menú rápido circular se conserva como en el prototipo. El CSS de composición de las vistas puede ser scoped; los tokens y componentes compartidos conservan su fuente única.

