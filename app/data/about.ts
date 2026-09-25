import type { Locale } from './projects'

export interface Skill {
  name: Record<Locale, string>
  description: Record<Locale, string>
  fill: 1 | 2 | 3 | 4 | 5
  /** Habilidad que la portada muestra en la carta de confidente, en el orden de sus grupos. */
  featured?: boolean
}

interface SkillGroup {
  id: string
  title: string
  skills: Skill[]
}

/** Demos editables: fill indica cuántos de los cinco segmentos se rellenan. */
export const skillGroups: SkillGroup[] = [
  { id: 'frontend', title: 'FrontEnd', skills: [
    { name: { es: 'Vue / Nuxt', en: 'Vue / Nuxt' }, featured: true, fill: 5, description: { es: 'Interfaces reactivas y aplicaciones web con renderizado estático.', en: 'Reactive interfaces and web apps with static rendering.' } },
    { name: { es: 'Angular', en: 'Angular' }, featured: true, fill: 5, description: { es: 'Framework para construir aplicaciones web estructuradas.', en: 'A framework for building structured web applications.' } },
    { name: { es: 'TypeScript', en: 'TypeScript' }, featured: true, fill: 4, description: { es: 'JavaScript con tipos para trabajar con mayor claridad.', en: 'JavaScript with types for clearer application code.' } },
    { name: { es: 'HTML / CSS', en: 'HTML / CSS' }, fill: 5, description: { es: 'Estructura semántica y estilos adaptables para la web.', en: 'Semantic structure and responsive styling for the web.' } },
    { name: { es: 'Anime.js', en: 'Anime.js' }, fill: 4, description: { es: 'Animaciones y secuencias de movimiento en interfaces.', en: 'Interface animations and motion sequences.' } },
    { name: { es: 'JavaScript', en: 'JavaScript' }, fill: 5, description: { es: 'Lógica e interacción en el navegador.', en: 'Logic and interaction in the browser.' } },
    { name: { es: 'Tailwind', en: 'Tailwind' }, fill: 4, description: { es: 'Utilidades CSS para componer interfaces.', en: 'CSS utilities for composing interfaces.' } },
    { name: { es: 'Sass', en: 'Sass' }, fill: 3, description: { es: 'Herramientas para organizar y reutilizar estilos.', en: 'Tools for organising and reusing styles.' } },
    { name: { es: 'Vite', en: 'Vite' }, fill: 3, description: { es: 'Entorno de desarrollo y compilación para la web.', en: 'A development and build tool for the web.' } },
    { name: { es: 'jQuery', en: 'jQuery' }, fill: 4, description: { es: 'Utilidades para manipular el DOM y gestionar eventos.', en: 'Utilities for DOM manipulation and event handling.' } },
    { name: { es: 'Bootstrap', en: 'Bootstrap' }, fill: 4, description: { es: 'Componentes y rejilla CSS para interfaces adaptables.', en: 'Components and a CSS grid for responsive interfaces.' } },
    { name: { es: 'React', en: 'React' }, fill: 3, description: { es: 'Interfaces compuestas a partir de componentes.', en: 'Interfaces composed from components.' } },
    { name: { es: 'Next.js', en: 'Next.js' }, fill: 3, description: { es: 'Aplicaciones web sobre React con distintas formas de renderizado.', en: 'React web applications with different rendering strategies.' } },
    { name: { es: 'Svelte', en: 'Svelte' }, fill: 2, description: { es: 'Componentes de interfaz compilados para el navegador.', en: 'Interface components compiled for the browser.' } },
    { name: { es: 'Astro', en: 'Astro' }, fill: 3, description: { es: 'Sitios centrados en contenido con componentes interactivos.', en: 'Content-focused sites with interactive components.' } },
    { name: { es: 'Pinia', en: 'Pinia' }, fill: 4, description: { es: 'Estado compartido entre componentes de Vue.', en: 'Shared state between Vue components.' } },
    { name: { es: 'Storybook', en: 'Storybook' }, fill: 3, description: { es: 'Desarrollo y documentación de componentes aislados.', en: 'Development and documentation of isolated components.' } },
    { name: { es: 'Three.js', en: 'Three.js' }, fill: 2, description: { es: 'Escenas y gráficos 3D en el navegador.', en: '3D scenes and graphics in the browser.' } },
  ] },
  { id: 'backend', title: 'Backend', skills: [
    { name: { es: 'Node.js', en: 'Node.js' }, featured: true, fill: 4, description: { es: 'Ejecución de JavaScript fuera del navegador.', en: 'Running JavaScript outside the browser.' } },
    { name: { es: 'APIs REST', en: 'REST APIs' }, fill: 4, description: { es: 'Comunicación entre aplicaciones mediante recursos HTTP.', en: 'Communication between applications through HTTP resources.' } },
    { name: { es: 'SQL', en: 'SQL' }, fill: 3, description: { es: 'Consultas y organización de datos relacionales.', en: 'Querying and organising relational data.' } },
    { name: { es: 'CMS headless', en: 'Headless CMS' }, fill: 2, description: { es: 'Gestión de contenido independiente de la interfaz.', en: 'Content management independent of the interface.' } },
    { name: { es: 'Express', en: 'Express' }, fill: 3, description: { es: 'Rutas y servicios HTTP sobre Node.js.', en: 'HTTP routes and services on Node.js.' } },
    { name: { es: 'PostgreSQL', en: 'PostgreSQL' }, fill: 3, description: { es: 'Base de datos relacional para información estructurada.', en: 'A relational database for structured information.' } },
    { name: { es: 'MongoDB', en: 'MongoDB' }, fill: 2, description: { es: 'Base de datos orientada a documentos.', en: 'A document-oriented database.' } },
    { name: { es: 'GraphQL', en: 'GraphQL' }, fill: 2, description: { es: 'Consultas de API que solicitan los datos necesarios.', en: 'API queries that request the data needed.' } },
    { name: { es: 'Redis', en: 'Redis' }, fill: 1, description: { es: 'Almacenamiento en memoria para caché y datos temporales.', en: 'In-memory storage for caching and temporary data.' } },
    { name: { es: 'Laravel', en: 'Laravel' }, fill: 3, description: { es: 'Framework PHP para aplicaciones y servicios web.', en: 'A PHP framework for web applications and services.' } },
    { name: { es: 'AdonisJS', en: 'AdonisJS' }, fill: 3, description: { es: 'Framework de servidor basado en TypeScript.', en: 'A server framework built around TypeScript.' } },
    { name: { es: 'PHP', en: 'PHP' }, fill: 3, description: { es: 'Lenguaje para lógica y renderizado en el servidor.', en: 'A language for server-side logic and rendering.' } },
    { name: { es: 'Python', en: 'Python' }, fill: 2, description: { es: 'Lenguaje para automatización y desarrollo de servicios.', en: 'A language for automation and service development.' } },
    { name: { es: 'FastAPI', en: 'FastAPI' }, fill: 2, description: { es: 'APIs en Python basadas en anotaciones de tipos.', en: 'Python APIs built around type annotations.' } },
    { name: { es: 'Prisma', en: 'Prisma' }, fill: 3, description: { es: 'Acceso tipado a bases de datos desde la aplicación.', en: 'Typed database access from application code.' } },
    { name: { es: 'SQLite', en: 'SQLite' }, fill: 3, description: { es: 'Base de datos relacional contenida en un archivo.', en: 'A relational database contained in a file.' } },
    { name: { es: 'Firebase', en: 'Firebase' }, fill: 2, description: { es: 'Servicios para datos, autenticación y alojamiento.', en: 'Services for data, authentication and hosting.' } },
    { name: { es: 'WebSockets', en: 'WebSockets' }, fill: 3, description: { es: 'Comunicación persistente entre cliente y servidor.', en: 'Persistent communication between client and server.' } },
  ] },
  { id: 'skills', title: 'Skills', skills: [
    { name: { es: 'Motion UI', en: 'Motion UI' }, featured: true, fill: 5, description: { es: 'Movimiento que ayuda a entender y recorrer una interfaz.', en: 'Motion that helps people understand and navigate an interface.' } },
    { name: { es: 'Accesibilidad', en: 'Accessibility' }, fill: 4, description: { es: 'Interfaces utilizables con distintas capacidades y dispositivos.', en: 'Interfaces usable across different abilities and devices.' } },
    { name: { es: 'Rendimiento', en: 'Performance' }, fill: 4, description: { es: 'Carga y respuesta ágiles en la experiencia web.', en: 'Fast loading and responsive web experiences.' } },
    { name: { es: 'Diseño UI', en: 'UI design' }, featured: true, fill: 4, description: { es: 'Jerarquía, composición y estados de una interfaz.', en: 'Hierarchy, composition and interface states.' } },
    { name: { es: 'Responsive', en: 'Responsive' }, fill: 4, description: { es: 'Composiciones adaptadas a distintos tamaños de pantalla.', en: 'Layouts adapted to different screen sizes.' } },
    { name: { es: 'Testing', en: 'Testing' }, fill: 3, description: { es: 'Pruebas para verificar el comportamiento del producto.', en: 'Tests that verify product behaviour.' } },
    { name: { es: 'Sistemas UI', en: 'UI systems' }, fill: 3, description: { es: 'Componentes y reglas visuales compartidos.', en: 'Shared components and visual rules.' } },
    { name: { es: 'SEO técnico', en: 'Technical SEO' }, fill: 3, description: { es: 'Estructura y metadatos que facilitan la indexación.', en: 'Structure and metadata that support indexing.' } },
    { name: { es: 'Colaboración', en: 'Collaboration' }, fill: 4, description: { es: 'Comunicación y revisión compartida durante el desarrollo.', en: 'Communication and shared review during development.' } },
    { name: { es: 'Debugging', en: 'Debugging' }, fill: 4, description: { es: 'Investigación de errores y sus causas.', en: 'Investigating errors and their causes.' } },
    { name: { es: 'Code review', en: 'Code review' }, fill: 4, description: { es: 'Revisión compartida de claridad y comportamiento del código.', en: 'Shared review of code clarity and behaviour.' } },
    { name: { es: 'Prototipado', en: 'Prototyping' }, fill: 3, description: { es: 'Exploración rápida de ideas antes de desarrollarlas.', en: 'Quick exploration of ideas before development.' } },
    { name: { es: 'Arquitectura', en: 'Architecture' }, fill: 3, description: { es: 'Organización de responsabilidades y dependencias.', en: 'Organising responsibilities and dependencies.' } },
    { name: { es: 'Refactoring', en: 'Refactoring' }, fill: 4, description: { es: 'Mejora de la estructura interna conservando el comportamiento.', en: 'Improving internal structure while preserving behaviour.' } },
    { name: { es: 'Documentación', en: 'Documentation' }, fill: 4, description: { es: 'Explicaciones que facilitan usar y mantener el producto.', en: 'Explanations that make a product easier to use and maintain.' } },
    { name: { es: 'i18n', en: 'i18n' }, fill: 4, description: { es: 'Interfaces preparadas para varios idiomas y formatos.', en: 'Interfaces prepared for multiple languages and formats.' } },
    { name: { es: 'CI / CD', en: 'CI / CD' }, fill: 3, description: { es: 'Automatización de pruebas, compilación y entrega.', en: 'Automating testing, builds and delivery.' } },
    { name: { es: 'Git workflows', en: 'Git workflows' }, fill: 4, description: { es: 'Coordinación de ramas, cambios y revisiones.', en: 'Coordinating branches, changes and reviews.' } },
  ] },
  { id: 'misc', title: 'Misc.', skills: [
    { name: { es: 'Git', en: 'Git' }, fill: 5, description: { es: 'Control de versiones y trabajo en ramas.', en: 'Version control and branch-based collaboration.' } },
    { name: { es: 'Figma', en: 'Figma' }, fill: 4, description: { es: 'Diseño y prototipado colaborativo de interfaces.', en: 'Collaborative interface design and prototyping.' } },
    { name: { es: 'Linux', en: 'Linux' }, fill: 4, description: { es: 'Entorno de trabajo y herramientas de sistema.', en: 'A working environment and system tools.' } },
    { name: { es: 'Docker', en: 'Docker' }, fill: 2, description: { es: 'Entornos de ejecución reproducibles en contenedores.', en: 'Reproducible runtime environments in containers.' } },
    { name: { es: 'VS Code', en: 'VS Code' }, fill: 5, description: { es: 'Editor de código y herramientas de desarrollo.', en: 'A code editor and development tools.' } },
    { name: { es: 'Terminal', en: 'Terminal' }, fill: 4, description: { es: 'Automatización y trabajo mediante línea de comandos.', en: 'Automation and work through the command line.' } },
    { name: { es: 'Postman', en: 'Postman' }, fill: 3, description: { es: 'Exploración y comprobación de APIs.', en: 'Exploring and checking APIs.' } },
    { name: { es: 'Affinity', en: 'Affinity' }, fill: 2, description: { es: 'Edición y composición de recursos gráficos.', en: 'Editing and composing graphic assets.' } },
    { name: { es: 'Blender', en: 'Blender' }, fill: 1, description: { es: 'Modelado y experimentación con gráficos 3D.', en: 'Modelling and experimenting with 3D graphics.' } },
    { name: { es: 'Photoshop', en: 'Photoshop' }, fill: 3, description: { es: 'Edición y composición de imágenes.', en: 'Image editing and composition.' } },
    { name: { es: 'Illustrator', en: 'Illustrator' }, fill: 2, description: { es: 'Creación y edición de gráficos vectoriales.', en: 'Creating and editing vector graphics.' } },
    { name: { es: 'Inkscape', en: 'Inkscape' }, fill: 3, description: { es: 'Ilustración y edición vectorial de código abierto.', en: 'Open-source vector illustration and editing.' } },
    { name: { es: 'GIMP', en: 'GIMP' }, fill: 3, description: { es: 'Retoque y preparación de imágenes.', en: 'Retouching and preparing images.' } },
    { name: { es: 'Obsidian', en: 'Obsidian' }, fill: 3, description: { es: 'Notas enlazadas y organización de conocimiento.', en: 'Linked notes and knowledge organisation.' } },
    { name: { es: 'Notion', en: 'Notion' }, fill: 3, description: { es: 'Documentación y organización del trabajo.', en: 'Documentation and work organisation.' } },
    { name: { es: 'DBeaver', en: 'DBeaver' }, fill: 3, description: { es: 'Exploración y administración de bases de datos.', en: 'Database exploration and administration.' } },
    { name: { es: 'npm / pnpm', en: 'npm / pnpm' }, fill: 4, description: { es: 'Gestión de dependencias y scripts de proyectos.', en: 'Managing project dependencies and scripts.' } },
    { name: { es: 'DevTools', en: 'DevTools' }, fill: 5, description: { es: 'Inspección del navegador para depurar y medir interfaces.', en: 'Browser inspection for debugging and measuring interfaces.' } },
  ] },
]

/** Habilidades de la carta de la portada con el nombre de su grupo. */
export const featuredSkills = skillGroups.flatMap(group => group.skills.filter(skill => skill.featured).map(skill => ({ ...skill, group: group.title })))
