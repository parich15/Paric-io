---
name: visual-qa
description: Inspeccionar capturas de Paric.io contra referencias y describir desviaciones observables de diseño.
---

# visual-qa

Leer [DESIGN](../../../DESIGN.md), [DESIGN-SPECS](../../../DESIGN-SPECS.md) y [ADR contraste](../../../docs/adr/001-contraste.md). Comparar con [prototipos](../../../references/), [UI kit](../../../design-system/ui_kits/portfolio/index.html) y [guidelines](../../../design-system/guidelines/). Usar Playwright instalado, esperar document.fonts.ready y estabilizar movimiento. Inspeccionar inicio, menú, ambas categorías y detalle en ES/EN, escritorio, tablet, 360px y pantalla baja. Describir desvíos de tipografía, escala, composición, geometría, textura o movimiento con vista/viewport concretos. No aceptar primeras capturas como baseline sin contraste con referencia. Separar pruebas de secuencias reales y reduced motion; comprobar que overlays se retiran y foco sigue utilizable. No cambiar la excepción de contraste ni generar gates nuevos.
