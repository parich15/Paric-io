import { projects, type Locale } from './projects'

export interface Client {
  slug: string
  name: string
  initials: string
  logo?: string
  website?: string
  demo: boolean
  projectSlugs: string[]
  content: Record<Locale, { sector: string, description: string }>
}

/** Clientes y proyectos asociados según la selección del portfolio. */
export const clients: Client[] = [
  {
    "slug": "captotal",
    "name": "CapTotal",
    "initials": "CT",
    "demo": false,
    "projectSlugs": [
      "captotal",
      "carland"
    ],
    "content": {
      "es": {
        "sector": "Formación vial",
        "description": "Formación vial profesional y autoescuela: CapTotal y Car Land."
      },
      "en": {
        "sector": "Driver training",
        "description": "Professional driver training and driving school: CapTotal and Car Land."
      }
    },
    "logo": "/logoPortfolio/7.webp"
  },
  {
    "slug": "cemar",
    "name": "Ascensores Cemar",
    "initials": "AC",
    "demo": false,
    "projectSlugs": [
      "cemar"
    ],
    "content": {
      "es": {
        "sector": "Ascensores",
        "description": "Instalación y mantenimiento de ascensores y montacargas."
      },
      "en": {
        "sector": "Lifts",
        "description": "Installation and maintenance of lifts and goods lifts."
      }
    },
    "logo": "/logoPortfolio/4.webp"
  },
  {
    "slug": "hortec",
    "name": "Hortec",
    "initials": "H",
    "demo": false,
    "projectSlugs": [
      "hortec"
    ],
    "content": {
      "es": {
        "sector": "Alimentación ecológica",
        "description": "Cooperativa de distribución de fruta y verdura ecológica en Mercabarna."
      },
      "en": {
        "sector": "Organic food",
        "description": "An organic fruit and vegetable distribution cooperative in Mercabarna."
      }
    },
    "logo": "/logoPortfolio/1.webp"
  },
  {
    "slug": "penguin-random-house",
    "name": "Penguin Random House",
    "initials": "PRH",
    "demo": false,
    "projectSlugs": [
      "prh-ecommerce",
      "revista-lengua"
    ],
    "content": {
      "es": {
        "sector": "Editorial · vía Capitole Consulting",
        "description": "La tienda penguinlibros.com y su revista LENGUA, vía Capitole Consulting."
      },
      "en": {
        "sector": "Publishing · via Capitole Consulting",
        "description": "The penguinlibros.com shop and its LENGUA magazine, via Capitole Consulting."
      }
    }
  },
  {
    "slug": "3d-digital-venue",
    "name": "3D Digital Venue",
    "initials": "3D",
    "demo": false,
    "projectSlugs": [
      "sites-builder",
      "seatgeek-sites",
      "psp-chelsea-fc"
    ],
    "content": {
      "es": {
        "sector": "Tecnología para recintos",
        "description": "Tecnología de mapas de asientos y vistas 3D para clubes y recintos: Sites Builder, portales de SeatGeek y el portal de venta de Chelsea FC."
      },
      "en": {
        "sector": "Venue technology",
        "description": "Seat map and 3D view technology for clubs and venues: Sites Builder, SeatGeek portals and Chelsea FC’s sales portal."
      }
    }
  }
]

export function findClient(slug: string): Client | undefined {
  return clients.find(client => client.slug === slug)
}

/** Una empresa puede reunir tantos proyectos como slugs tenga asociados, en el orden editorial indicado. */
export function getClientProjects(client: Client) {
  return client.projectSlugs.flatMap(slug => projects.filter(project => project.slug === slug))
}

export function findProjectClient(projectSlug: string): Client | undefined {
  return clients.find(client => client.projectSlugs.includes(projectSlug))
}
