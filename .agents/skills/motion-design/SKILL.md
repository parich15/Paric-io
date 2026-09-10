---
name: motion-design
description: Implementar entradas, menú y transiciones de Paric.io con Anime.js y movimiento reducido.
---

# motion-design

Leer [DESIGN](../../../DESIGN.md), [DESIGN-SPECS](../../../DESIGN-SPECS.md) y [tokens motion](../../../design-system/tokens/motion.css). Consultar Context7 para la API instalada. Usar plugin cliente tipado, iniciar después de montaje y revertir al desmontar. Anime.js orquesta secuencias, CSS conserva geometría/hover/colores; animar wrappers distintos de skew/rotación. Wipe: tres planos con desfase y sello de destino; navegar cubierto y retirar al completar timeline, sin temporizadores desligados. Introducción una vez por carga; con movimiento reducido, navegar inmediatamente y omitir intro. VueUse para preferencias/listeners; markup SSG estable. Probar animación real y reducida, navegación rápida y desmontaje.
