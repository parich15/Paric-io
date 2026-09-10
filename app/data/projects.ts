export type Locale = 'es' | 'en'
export type ProjectCategory = 'pro' | 'personal'

export interface ProjectCopy {
  description: string
  challenge: string
  solution: string
  facts: { label: string, value: string }[]
}

export interface Project {
  id: string
  slug: string
  title: string
  year: string
  client: string
  category: ProjectCategory
  tags: string[]
  featured: boolean
  demo: true
  content: Record<Locale, ProjectCopy>
}

/** Demos de los prototipos; sus fichas describen propuestas, no métricas de clientes reales. */
export const projects: Project[] = [
  {
    id: 'nocturne', slug: 'nocturne', title: 'Nocturne Studio', year: '2026', client: 'Nocturne', category: 'pro', tags: ['Nuxt', 'GSAP', 'Sanity'], featured: true, demo: true,
    content: {
      es: { description: 'Web corporativa con transiciones de página y CMS headless para un estudio de fotografía.', challenge: 'Mostrar cientos de fotografías a pantalla completa sin sacrificar rendimiento ni la sensación de galería física.', solution: 'Transiciones compartidas entre rutas, precarga por scroll y un CMS para publicar sin tocar código.', facts: [{ label: 'Rol propuesto', value: 'Front-end lead' }, { label: 'Duración estimada', value: '10 semanas' }, { label: 'Equipo propuesto', value: '3 personas' }, { label: 'Objetivo', value: 'Explorar sin esperas' }] },
      en: { description: 'A photography studio website with page transitions and a headless CMS.', challenge: 'Display hundreds of full-screen photographs while keeping the speed and feel of a physical gallery.', solution: 'Shared route transitions, scroll-aware preloading and a CMS for publishing without editing code.', facts: [{ label: 'Proposed role', value: 'Front-end lead' }, { label: 'Estimated duration', value: '10 weeks' }, { label: 'Proposed team', value: '3 people' }, { label: 'Goal', value: 'Explore without waiting' }] },
    },
  },
  {
    id: 'velvet', slug: 'velvet', title: 'Velvet Commerce', year: '2025', client: 'Velvet', category: 'pro', tags: ['Vue', 'Stripe', 'Node'], featured: true, demo: true,
    content: {
      es: { description: 'Tienda online a medida: checkout en un paso y catálogo filtrable en tiempo real.', challenge: 'Simplificar un proceso de compra largo para que funcione con claridad en móvil.', solution: 'Checkout en un paso, filtros instantáneos en cliente y una composición que respira en pantallas pequeñas.', facts: [{ label: 'Rol propuesto', value: 'Full-stack' }, { label: 'Duración estimada', value: '4 meses' }, { label: 'Equipo propuesto', value: '5 personas' }, { label: 'Objetivo', value: 'Comprar en un paso' }] },
      en: { description: 'A custom online store with one-step checkout and real-time catalogue filters.', challenge: 'Make a lengthy purchase flow clear and usable on mobile.', solution: 'One-step checkout, instant client-side filters and a layout with room to breathe on small screens.', facts: [{ label: 'Proposed role', value: 'Full-stack' }, { label: 'Estimated duration', value: '4 months' }, { label: 'Proposed team', value: '5 people' }, { label: 'Goal', value: 'One-step checkout' }] },
    },
  },
  {
    id: 'pulse', slug: 'pulse', title: 'Pulse Dashboard', year: '2025', client: 'Pulse Fintech', category: 'pro', tags: ['Angular', 'D3', 'WebSockets'], featured: true, demo: true,
    content: {
      es: { description: 'Panel de analítica con gráficos en vivo y modo oscuro para una fintech.', challenge: 'Representar un flujo de operaciones continuo sin bloquear la interacción.', solution: 'Render en canvas, agregación de datos y componentes desacoplados del flujo de actualizaciones.', facts: [{ label: 'Rol propuesto', value: 'Front-end' }, { label: 'Duración estimada', value: '6 meses' }, { label: 'Equipo propuesto', value: '8 personas' }, { label: 'Objetivo', value: 'Datos en tiempo real' }] },
      en: { description: 'A fintech analytics dashboard with live charts and a dark theme.', challenge: 'Show a continuous stream of transactions without blocking interaction.', solution: 'Canvas rendering, data aggregation and components decoupled from the update stream.', facts: [{ label: 'Proposed role', value: 'Front-end' }, { label: 'Estimated duration', value: '6 months' }, { label: 'Proposed team', value: '8 people' }, { label: 'Goal', value: 'Real-time data' }] },
    },
  },
  {
    id: 'atlas', slug: 'atlas', title: 'Atlas Learning', year: '2024', client: 'Atlas', category: 'pro', tags: ['Nuxt', 'PWA', 'Postgres'], featured: false, demo: true,
    content: {
      es: { description: 'Plataforma de cursos con reproductor propio, notas sincronizadas y progreso offline.', challenge: 'Conservar notas y progreso cuando se estudia en trenes o zonas sin cobertura.', solution: 'PWA con sincronización diferida y un reproductor que trata la desconexión como un estado normal.', facts: [{ label: 'Rol propuesto', value: 'Front-end lead' }, { label: 'Duración estimada', value: '8 meses' }, { label: 'Equipo propuesto', value: '6 personas' }, { label: 'Objetivo', value: 'Aprender sin conexión' }] },
      en: { description: 'A learning platform with a custom player, synced notes and offline progress.', challenge: 'Keep notes and progress safe while studying on trains or without network coverage.', solution: 'A PWA with deferred sync and a player that treats being offline as a normal state.', facts: [{ label: 'Proposed role', value: 'Front-end lead' }, { label: 'Estimated duration', value: '8 months' }, { label: 'Proposed team', value: '6 people' }, { label: 'Goal', value: 'Learn offline' }] },
    },
  },
  {
    id: 'synth', slug: 'synth', title: 'Synthwave Lab', year: '2026', client: '', category: 'personal', tags: ['Web Audio', 'Vue', 'Canvas'], featured: false, demo: true,
    content: {
      es: { description: 'Sintetizador en el navegador con secuenciador visual y exportación a WAV.', challenge: 'Explorar la síntesis de audio con una interfaz que invite a tocar y experimentar.', solution: 'Osciladores encadenables y una interfaz que se dibuja al ritmo del secuenciador.', facts: [{ label: 'Rol', value: 'Diseño + código' }, { label: 'Dedicación prevista', value: 'Fines de semana' }, { label: 'Estado', value: 'Demo conceptual' }, { label: 'Exploración', value: 'Audio en navegador' }] },
      en: { description: 'A browser synthesiser with a visual sequencer and WAV export.', challenge: 'Explore sound synthesis through an interface that invites play and experimentation.', solution: 'Chainable oscillators and an interface drawn to the rhythm of the sequencer.', facts: [{ label: 'Role', value: 'Design + code' }, { label: 'Planned schedule', value: 'Weekends' }, { label: 'Status', value: 'Concept demo' }, { label: 'Exploration', value: 'Browser audio' }] },
    },
  },
  {
    id: 'kanji', slug: 'kanji', title: 'Kanji Quest', year: '2025', client: '', category: 'personal', tags: ['Nuxt', 'IndexedDB', 'SVG'], featured: false, demo: true,
    content: {
      es: { description: 'App de repaso espaciado para aprender kanji, con trazos animados y rachas.', challenge: 'Crear una herramienta de estudio cotidiana que funcione sin cuentas ni conexión.', solution: 'Repetición espaciada, trazos SVG animados y almacenamiento en el propio dispositivo.', facts: [{ label: 'Rol', value: 'Diseño + código' }, { label: 'Duración estimada', value: '3 meses' }, { label: 'Estado', value: 'Demo conceptual' }, { label: 'Objetivo', value: 'Un hábito diario' }] },
      en: { description: 'A spaced-repetition kanji app with animated strokes and study streaks.', challenge: 'Create an everyday study tool that works without accounts or an internet connection.', solution: 'Spaced repetition, animated SVG strokes and storage on the device itself.', facts: [{ label: 'Role', value: 'Design + code' }, { label: 'Estimated duration', value: '3 months' }, { label: 'Status', value: 'Concept demo' }, { label: 'Goal', value: 'A daily habit' }] },
    },
  },
  {
    id: 'p5ui', slug: 'p5ui', title: 'Phantom UI Kit', year: '2025', client: '', category: 'personal', tags: ['Vue', 'Motion', 'Storybook'], featured: false, demo: true,
    content: {
      es: { description: 'Kit de componentes con estética de menú de videojuego: sellos, inclinaciones y transiciones.', challenge: 'Llevar la energía de un menú de JRPG a una web que se pueda recorrer con teclado.', solution: 'Componentes con foco visible, movimiento reducible y tipografía enorme sobre tres tintas.', facts: [{ label: 'Rol', value: 'Diseño + código' }, { label: 'Duración estimada', value: '2 meses' }, { label: 'Estado', value: 'Demo conceptual' }, { label: 'Exploración', value: 'Interfaz de juego' }] },
      en: { description: 'A game-menu component kit with stamps, skewed plates and screen transitions.', challenge: 'Bring the energy of a JRPG menu to a website that can be explored with a keyboard.', solution: 'Components with visible focus, reduced motion and oversized type in three inks.', facts: [{ label: 'Role', value: 'Design + code' }, { label: 'Estimated duration', value: '2 months' }, { label: 'Status', value: 'Concept demo' }, { label: 'Exploration', value: 'Game interfaces' }] },
    },
  },
]

export function getProjects(category: ProjectCategory): Project[] {
  return projects.filter(project => project.category === category)
}

export function findProject(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug)
}

export function getProjectCopy(project: Project, locale: string): ProjectCopy {
  return project.content[locale === 'es' ? 'es' : 'en']
}

/** El siguiente proyecto recorre circularmente la misma categoría. */
export function getNextProject(project: Project): Project {
  const categoryProjects = getProjects(project.category)
  const currentIndex = categoryProjects.findIndex(candidate => candidate.id === project.id)
  return categoryProjects[(currentIndex + 1) % categoryProjects.length]!
}
