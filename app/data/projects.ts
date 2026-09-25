export type Locale = 'es' | 'en'
export type ProjectCategory = 'pro' | 'personal'
export type ProjectFrame = 'browser' | 'phone'

export interface ProjectCopy {
  description: string
  challenge: string
  solution: string
  facts: { label: string, value: string }[]
  /** Piezas clave del producto, presentadas como tarjetas numeradas. */
  features?: { title: string, text: string }[]
  /** Recorrido principal de quien usa el producto, paso a paso. */
  flow?: string[]
}

/** Minisite publicado: el favicon se sirve en local para no depender del dominio del cliente. */
export interface ProjectSite {
  name: string
  url: string
  icon: string
}

export interface ProjectSiteGroup {
  label: Record<Locale, string>
  sites: ProjectSite[]
}

export interface ProjectMedia {
  src: string
  type: 'image' | 'video'
  /** Marco de presentación: captura de escritorio o de móvil. Sin él, marco genérico. */
  frame?: ProjectFrame
  caption?: Record<Locale, string>
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
  demo: boolean
  website?: string
  designUrl?: string
  cover?: string
  media?: ProjectMedia[]
  /** Muestra de sites en producción y, si se conoce, el total publicado. */
  sites?: ProjectSiteGroup[]
  sitesTotal?: number
  content: Record<Locale, ProjectCopy>
}

/** Selección de proyectos profesionales y personales; el orden es editorial: lo más reciente primero. */
export const projects: Project[] = [
  {
    "id": "sites-builder",
    "slug": "sites-builder",
    "title": "Sites Builder",
    "year": "2025",
    "client": "3D Digital Venue",
    "category": "pro",
    "tags": [
      "Angular",
      "TypeScript",
      "DVM",
      "Nx",
      "Native Federation",
      "Google Analytics"
    ],
    "featured": true,
    "demo": false,
    "website": "https://preview.3ddigitalvenue.com/manutd",
    "designUrl": "https://xd.adobe.com/view/b71261a0-3720-4b10-adc7-44901b2bfa42-e241/grid",
    "cover": "/projects/sites-builder/live-la-angels.webp",
    "media": [
      {
        "src": "/projects/sites-builder/live-la-angels.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "El rediseño en producción: Angel Stadium para Los Angeles Angels.",
          "en": "The redesign in production: Angel Stadium for the Los Angeles Angels."
        }
      },
      {
        "src": "/projects/sites-builder/live-manutd.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Minisite del Manchester United: Old Trafford con localidades regulares y premium.",
          "en": "Manchester United minisite: Old Trafford with regular and premium seating."
        }
      },
      {
        "src": "/projects/sites-builder/live-pabst-theater.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "También teatros: platea y palcos del Pabst Theater.",
          "en": "Theatres too: stalls and boxes at the Pabst Theater."
        }
      },
      {
        "src": "/projects/sites-builder/tigers-map.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Comerica Park, embebido en la web de los Detroit Tigers.",
          "en": "Comerica Park, embedded on the Detroit Tigers website."
        }
      },
      {
        "src": "/projects/sites-builder/dodgers-seats.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Del buscador a la sección 1RS de los Dodgers: zoom hasta cada asiento.",
          "en": "From search to the Dodgers' section 1RS: zooming down to every seat."
        }
      },
      {
        "src": "/projects/sites-builder/design-landing.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Diseño: portada con tutorial guiado y aviso de cookies.",
          "en": "Design: cover with guided tutorial and cookie notice."
        }
      },
      {
        "src": "/projects/sites-builder/design-pano.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Diseño: vista desde el asiento con galería de espacios VIP.",
          "en": "Design: view from the seat with a VIP spaces gallery."
        }
      },
      {
        "src": "/projects/sites-builder/design-popups.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Bloques del sistema: popups sobre el mapa en tema base, claro y oscuro.",
          "en": "System blocks: map popups in base, light and dark themes."
        }
      },
      {
        "src": "/projects/sites-builder/demo-leipzig.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Marca blanca: demo para el RB Leipzig con modo día y noche.",
          "en": "White label: RB Leipzig demo with day and night modes."
        }
      },
      {
        "src": "/projects/sites-builder/demo-camp-nou.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Marca blanca: demo del Spotify Camp Nou.",
          "en": "White label: Spotify Camp Nou demo."
        }
      },
      {
        "src": "/projects/sites-builder/mobile-search.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Buscador por sección, fila y asiento.",
          "en": "Search by section, row and seat."
        }
      },
      {
        "src": "/projects/sites-builder/mobile-manutd.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Old Trafford en móvil.",
          "en": "Old Trafford on mobile."
        }
      },
      {
        "src": "/projects/sites-builder/mobile-seat.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Selector de asiento a pantalla completa.",
          "en": "Full-screen seat picker."
        }
      },
      {
        "src": "/projects/sites-builder/mobile-pano.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Vista desde el asiento y zonas de acceso.",
          "en": "View from the seat and access areas."
        }
      }
    ],
    "sites": [
      {
        "label": {
          "es": "Béisbol",
          "en": "Baseball"
        },
        "sites": [
          {
            "name": "LA Angels",
            "url": "https://preview.3ddigitalvenue.com/la-angels",
            "icon": "/projects/sites-builder/sites/la-angels.webp"
          },
          {
            "name": "LA Dodgers",
            "url": "https://preview.3ddigitalvenue.com/dodgers",
            "icon": "/projects/sites-builder/sites/dodgers.webp"
          },
          {
            "name": "Chicago Cubs",
            "url": "https://preview.3ddigitalvenue.com/chicago-cubs",
            "icon": "/projects/sites-builder/sites/chicago-cubs.webp"
          }
        ]
      },
      {
        "label": {
          "es": "Fútbol",
          "en": "Football"
        },
        "sites": [
          {
            "name": "Real Madrid CF",
            "url": "https://preview.3ddigitalvenue.com/real-madrid-cf",
            "icon": "/projects/sites-builder/sites/real-madrid-cf.webp"
          },
          {
            "name": "Manchester United",
            "url": "https://preview.3ddigitalvenue.com/manutd",
            "icon": "/projects/sites-builder/sites/manutd.webp"
          },
          {
            "name": "Real Valladolid CF",
            "url": "https://preview.3ddigitalvenue.com/realvalladolid",
            "icon": "/projects/sites-builder/sites/realvalladolid.webp"
          }
        ]
      },
      {
        "label": {
          "es": "Fútbol americano",
          "en": "American football"
        },
        "sites": [
          {
            "name": "Carolina Panthers",
            "url": "https://preview.3ddigitalvenue.com/panthers",
            "icon": "/projects/sites-builder/sites/panthers.webp"
          },
          {
            "name": "Cleveland Browns",
            "url": "https://preview.3ddigitalvenue.com/cleveland-browns",
            "icon": "/projects/sites-builder/sites/cleveland-browns.webp"
          },
          {
            "name": "Nissan Stadium",
            "url": "https://preview.3ddigitalvenue.com/nissan-stadium",
            "icon": "/projects/sites-builder/sites/nissan-stadium.webp"
          }
        ]
      },
      {
        "label": {
          "es": "Teatros",
          "en": "Theatres"
        },
        "sites": [
          {
            "name": "Peacock Theater",
            "url": "https://preview.3ddigitalvenue.com/peacock-theater-premium",
            "icon": "/projects/sites-builder/sites/peacock-theater-premium.webp"
          },
          {
            "name": "Mountain Winery",
            "url": "https://preview.3ddigitalvenue.com/mountain-winery",
            "icon": "/projects/sites-builder/sites/mountain-winery.webp"
          },
          {
            "name": "Pabst Theater",
            "url": "https://preview.3ddigitalvenue.com/pabst-theater",
            "icon": "/projects/sites-builder/sites/pabst-theater.webp"
          }
        ]
      }
    ],
    "sitesTotal": 600,
    "content": {
      "es": {
        "description": "Editor y minisites de recintos —más de 600 publicados— con mapa de asientos, vista desde el asiento y beneficios, embebibles en la web de cada equipo.",
        "challenge": "Cada recinto necesitaba publicar su propio minisite de asientos —mapa, vista desde cada localidad, precios y beneficios— sin desarrollo a medida, y que funcionara igual en escritorio, en móvil y embebido en la web del club.",
        "solution": "Construí en Angular el minisite y buena parte del editor: un sistema de configuración y tema que el editor rellena, herramientas registrables, el seatmap sobre DVM con vista 3D, vecinos, minimapa y buscador, y un layout móvil con bottom sheet. Después lo integré en Venue Workspace como remote de Native Federation, reutilizando la sesión autenticada.",
        "facts": [
          {
            "label": "Rol",
            "value": "Front-end · arquitectura"
          },
          {
            "label": "Periodo",
            "value": "2025 – 2026"
          },
          {
            "label": "Empresa",
            "value": "3D Digital Venue"
          },
          {
            "label": "Integración",
            "value": "Iframe · API"
          },
          {
            "label": "Sites publicados",
            "value": "+600"
          }
        ],
        "flow": [
          "Configurar el site en el editor",
          "Publicar el minisite",
          "Embeberlo en la web del club",
          "El aficionado explora cada asiento"
        ],
        "features": [
          {
            "title": "Configuración y tema",
            "text": "Cada site se describe con una configuración que edita el editor: menú, colores, plantillas globales y estilos personalizados."
          },
          {
            "title": "Seatmap y vista 3D",
            "text": "Mapa de secciones y asientos sobre DVM, con panorámicas y vista 3D desde el asiento, minimapa, zoom y vecinos."
          },
          {
            "title": "Buscador",
            "text": "Búsqueda por sección, fila y asiento que lleva directamente a la vista desde esa localidad."
          },
          {
            "title": "Móvil primero",
            "text": "Bottom sheet, menús adaptados y detección programática del dispositivo para que el site funcione en cualquier pantalla."
          },
          {
            "title": "Popovers precisos",
            "text": "Sistema de popovers con middlewares de flip, offset y boundary para que la información nunca se salga del mapa."
          },
          {
            "title": "Embebible y medible",
            "text": "Funciona dentro de un iframe en la web del cliente, conserva los parámetros, copia enlaces a un asiento y envía eventos a Google Analytics."
          }
        ]
      },
      "en": {
        "description": "Venue minisites and their editor —600+ published— with seat map, view from every seat and benefits, embeddable on each team's website.",
        "challenge": "Every venue needed to publish its own seating minisite —map, view from each seat, prices and benefits— without custom development, and it had to work equally well on desktop, on mobile and embedded in the club's website.",
        "solution": "I built the minisite and a large part of the editor in Angular: a configuration and theme system filled in by the editor, registrable tools, the DVM seat map with 3D view, neighbours, minimap and search, and a mobile layout with a bottom sheet. I then brought it into Venue Workspace as a Native Federation remote that reuses the authenticated session.",
        "facts": [
          {
            "label": "Role",
            "value": "Front-end · architecture"
          },
          {
            "label": "Period",
            "value": "2025 – 2026"
          },
          {
            "label": "Company",
            "value": "3D Digital Venue"
          },
          {
            "label": "Integration",
            "value": "Iframe · API"
          },
          {
            "label": "Live sites",
            "value": "600+"
          }
        ],
        "flow": [
          "Set up the site in the editor",
          "Publish the minisite",
          "Embed it on the club's website",
          "Fans explore every seat"
        ],
        "features": [
          {
            "title": "Config and theme",
            "text": "Each site is described by a configuration edited in the editor: menu, colours, global templates and custom styles."
          },
          {
            "title": "Seat map and 3D",
            "text": "Section and seat maps on DVM, with panoramas and a 3D view from the seat, minimap, zoom and neighbours."
          },
          {
            "title": "Seat search",
            "text": "Search by section, row and seat that jumps straight to the view from that seat."
          },
          {
            "title": "Mobile first",
            "text": "Bottom sheet, adapted menus and programmatic device detection so the site works on any screen."
          },
          {
            "title": "Precise popovers",
            "text": "A popover system with flip, offset and boundary middlewares so information never leaves the map."
          },
          {
            "title": "Embeddable and measurable",
            "text": "Runs inside an iframe on the client's website, keeps query parameters, copies links to a seat and sends events to Google Analytics."
          }
        ]
      }
    }
  },
  {
    "id": "seatgeek-sites",
    "slug": "seatgeek-sites",
    "title": "SeatGeek Sites",
    "year": "2024",
    "client": "3D Digital Venue",
    "category": "pro",
    "tags": [
      "Angular",
      "TypeScript",
      "DVM",
      "PrimeNG",
      "SeatGeek API"
    ],
    "featured": false,
    "demo": false,
    "content": {
      "es": {
        "description": "Portales de reubicación y venta de abonos integrados en SeatGeek para equipos de NFL, NBA, MLB y fútbol.",
        "challenge": "Cada temporada, los equipos que venden con SeatGeek abren procesos para que sus abonados cambien de asiento o compren uno nuevo. Cada proceso tiene reglas, precios y plazos propios, y había que lanzarlo en pocas semanas dentro del propio portal de SeatGeek.",
        "solution": "Trabajé sobre una plantilla maestra que se inyecta como iframe en SeatGeek, se alimenta de su API y se configura por cliente con un JSON: flujo, colores y capacidades. En 2025 la convertí en la librería Angular NGX SeatGeek —configuración por injection token, servicio DVM, carrito, asientos aislados y modales— para integrarla en Venue Workspace.",
        "facts": [
          {
            "label": "Rol",
            "value": "Front-end"
          },
          {
            "label": "Periodo",
            "value": "2024 – 2025"
          },
          {
            "label": "Equipos",
            "value": "9 procesos"
          },
          {
            "label": "Plataforma",
            "value": "SeatGeek"
          }
        ],
        "flow": [
          "El abonado entra desde SeatGeek",
          "Elige sección en el mapa",
          "Selecciona sus asientos",
          "Revisa carrito y extras",
          "Paga en SeatGeek"
        ],
        "features": [
          {
            "title": "Plantilla maestra",
            "text": "Un repositorio base del que salen todos los portales: se clona, se configura, se prueba en producción y se documenta."
          },
          {
            "title": "Asientos aislados",
            "text": "La selección detecta cuándo una compra dejaría asientos sueltos y lo impide o avisa, según las reglas del equipo."
          },
          {
            "title": "Carrito y extras",
            "text": "Carrito con upsells como el parking de los Nationals y tasas de servicio fijas como la de las Thorns."
          },
          {
            "title": "Varios procesos",
            "text": "El mismo portal cubre reubicación, nuevas ventas y previews, con tipos de precio distintos en cada proceso."
          },
          {
            "title": "Vista por asiento",
            "text": "Panorámicas por asiento en lugar de por sector, como pidió Rhode Island FC para su integración."
          },
          {
            "title": "NGX SeatGeek",
            "text": "Librería publicada con configuración por injection token, servicio DVM, carrito y modales reutilizables."
          }
        ]
      },
      "en": {
        "description": "Season-ticket relocation and sales portals embedded in SeatGeek for NFL, NBA, MLB and soccer teams.",
        "challenge": "Every season, teams that sell through SeatGeek open processes for their season-ticket holders to move seats or buy new ones. Each process has its own rules, prices and deadlines, and had to launch within weeks inside SeatGeek's own portal.",
        "solution": "I worked on a master template that is injected into SeatGeek as an iframe, feeds on its API and is configured per client with a JSON file: flow, colours and capabilities. In 2025 I turned it into the NGX SeatGeek Angular library —injection-token configuration, DVM service, cart, isolated seats and modals— to integrate it into Venue Workspace.",
        "facts": [
          {
            "label": "Role",
            "value": "Front-end"
          },
          {
            "label": "Period",
            "value": "2024 – 2025"
          },
          {
            "label": "Teams",
            "value": "9 processes"
          },
          {
            "label": "Platform",
            "value": "SeatGeek"
          }
        ],
        "flow": [
          "The holder arrives from SeatGeek",
          "Picks a section on the map",
          "Selects their seats",
          "Reviews cart and add-ons",
          "Pays on SeatGeek"
        ],
        "features": [
          {
            "title": "Master template",
            "text": "A base repository every portal comes from: clone it, configure it, test it in production and document it."
          },
          {
            "title": "Isolated seats",
            "text": "Selection detects when a purchase would leave single seats behind and blocks or warns, following each team's rules."
          },
          {
            "title": "Cart and add-ons",
            "text": "A cart with upsells such as the Nationals' parking and fixed service fees such as the Thorns'."
          },
          {
            "title": "Several processes",
            "text": "The same portal handles relocation, new sales and previews, with different price types in each process."
          },
          {
            "title": "Per-seat view",
            "text": "Panoramas per seat instead of per section, as Rhode Island FC requested for its integration."
          },
          {
            "title": "NGX SeatGeek",
            "text": "A published library with injection-token configuration, a DVM service, cart and reusable modals."
          }
        ]
      }
    }
  },
  {
    "id": "psp-chelsea-fc",
    "slug": "psp-chelsea-fc",
    "title": "PSP Chelsea FC",
    "year": "2023",
    "client": "3D Digital Venue",
    "category": "pro",
    "tags": [
      "Angular",
      "TypeScript",
      "Signals",
      "Tailwind CSS",
      "DVM",
      "Directus",
      "Adyen"
    ],
    "featured": true,
    "demo": false,
    "designUrl": "https://xd.adobe.com/view/4b313918-2c97-467d-a768-0fa78d2ba23c-1e62/grid",
    "cover": "/projects/chelsea/select-seat.webp",
    "media": [
      {
        "src": "/projects/chelsea/select-seat.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Selección de asiento sobre Stamford Bridge con el carrito de entradas.",
          "en": "Seat selection over Stamford Bridge with the ticket basket."
        }
      },
      {
        "src": "/projects/chelsea/mobile-map.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Mapa 3D del estadio y escala de precios en móvil.",
          "en": "3D stadium map and price scale on mobile."
        }
      },
      {
        "src": "/projects/chelsea/stadium-map.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Mapa 3D de Stamford Bridge para elegir sección.",
          "en": "3D map of Stamford Bridge to pick a section."
        }
      },
      {
        "src": "/projects/chelsea/event-schedule.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Calendario de partidos para comprar entradas.",
          "en": "Match schedule to buy tickets."
        }
      },
      {
        "src": "/projects/chelsea/ticket-exchange.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Intercambio de entradas entre abonados.",
          "en": "Ticket exchange between members."
        }
      },
      {
        "src": "/projects/chelsea/friends-family.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Friends & Family: comprar en nombre de miembros asociados.",
          "en": "Friends & Family: buying on behalf of linked members."
        }
      },
      {
        "src": "/projects/chelsea/my-tickets.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "My Account: entradas e historial.",
          "en": "My Account: tickets and history."
        }
      },
      {
        "src": "/projects/chelsea/login.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Acceso de miembros al portal.",
          "en": "Member access to the portal."
        }
      },
      {
        "src": "/projects/chelsea/mobile-login.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Acceso en móvil.",
          "en": "Mobile login."
        }
      },
      {
        "src": "/projects/chelsea/mobile-summary.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Resumen de la compra con el tiempo de reserva.",
          "en": "Order summary with the hold timer."
        }
      },
      {
        "src": "/projects/chelsea/mobile-menu.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Menú del portal en móvil.",
          "en": "Portal menu on mobile."
        }
      }
    ],
    "content": {
      "es": {
        "description": "Portal de venta protegida de Chelsea FC para abonados y miembros: compra, intercambio y gestión de entradas sobre el mapa de Stamford Bridge.",
        "challenge": "Chelsea FC vende gran parte de sus entradas a abonados y miembros con reglas propias: prioridades, zonas familiares, amigos asociados e intercambio de entradas. El portal existente era difícil de mantener y cada rediseño costaba más que el anterior.",
        "solution": "Reconstruí el front-end en Angular sobre servicios compartidos —API, autenticación, DVM y textos desde Directus— y desarrollé los flujos de compra, selección de asiento, paquetes, entradas reservadas e intercambio, con pagos de Adyen. Esa base permitió encadenar seis rediseños y adaptar el portal a móvil y a modo oscuro.",
        "facts": [
          {
            "label": "Rol",
            "value": "Front-end"
          },
          {
            "label": "Periodo",
            "value": "2023 – 2025"
          },
          {
            "label": "Cliente",
            "value": "Chelsea FC"
          },
          {
            "label": "Empresa",
            "value": "3D Digital Venue"
          }
        ],
        "flow": [
          "El miembro inicia sesión",
          "Elige partido o paquete",
          "Asigna asiento y miembro a cada entrada",
          "Paga con Adyen"
        ],
        "features": [
          {
            "title": "Select a seat",
            "text": "Selección de sección y asiento sobre el mapa DVM, con selección múltiple y cada entrada asignada a un miembro y un tipo de comprador."
          },
          {
            "title": "Ticket exchange",
            "text": "Intercambio de entradas entre abonados para los equipos masculino y femenino, con las reglas de la zona familiar."
          },
          {
            "title": "Paquetes y reservas",
            "text": "Venta de paquetes con mejor asiento disponible y entradas reservadas para amigos y familia."
          },
          {
            "title": "Checkout único",
            "text": "Un servicio de checkout común para ventas, paquetes, intercambios y reservas, con pagos de Adyen."
          },
          {
            "title": "My Account",
            "text": "Mis entradas, historial de pedidos, reenvío de entradas y cuentas asociadas."
          },
          {
            "title": "Modo administrador",
            "text": "Takeover para que el equipo de ticketing opere en nombre de un miembro, siempre señalado con un banner."
          }
        ]
      },
      "en": {
        "description": "Chelsea FC's protected sales portal for season-ticket holders and members: buying, exchanging and managing tickets over the Stamford Bridge map.",
        "challenge": "Chelsea FC sells much of its ticketing to season-ticket holders and members under its own rules: priorities, family areas, linked friends and ticket exchange. The existing portal was hard to maintain and every redesign cost more than the last.",
        "solution": "I rebuilt the front end in Angular on shared services —API, authentication, DVM and copy from Directus— and developed the buying, seat selection, packages, reserved tickets and exchange flows, with Adyen payments. That foundation carried six redesigns and brought the portal to mobile and dark mode.",
        "facts": [
          {
            "label": "Role",
            "value": "Front-end"
          },
          {
            "label": "Period",
            "value": "2023 – 2025"
          },
          {
            "label": "Client",
            "value": "Chelsea FC"
          },
          {
            "label": "Company",
            "value": "3D Digital Venue"
          }
        ],
        "flow": [
          "The member signs in",
          "Picks a match or package",
          "Assigns a seat and member to each ticket",
          "Pays with Adyen"
        ],
        "features": [
          {
            "title": "Select a seat",
            "text": "Section and seat selection on the DVM map, with multiple selection and each ticket assigned to a member and a buyer type."
          },
          {
            "title": "Ticket exchange",
            "text": "Ticket exchange between members for the men's and women's teams, following the family-area rules."
          },
          {
            "title": "Packages and holds",
            "text": "Package sales with best available seat and reserved tickets for friends and family."
          },
          {
            "title": "Single checkout",
            "text": "One checkout service shared by sales, packages, exchanges and reservations, with Adyen payments."
          },
          {
            "title": "My Account",
            "text": "My tickets, order history, ticket forwarding and linked accounts."
          },
          {
            "title": "Admin mode",
            "text": "Takeover lets the ticketing team act on behalf of a member, always flagged with a banner."
          }
        ]
      }
    }
  },
  {
    "id": "prh-ecommerce",
    "slug": "prh-ecommerce",
    "title": "Penguin Libros",
    "year": "",
    "client": "Penguin Random House",
    "category": "pro",
    "tags": [
      "PrestaShop",
      "Smarty",
      "PHP",
      "JavaScript",
      "jQuery",
      "CSS"
    ],
    "featured": true,
    "demo": false,
    "website": "https://www.penguinlibros.com/es/",
    "content": {
      "es": {
        "description": "Tienda online de Penguin Random House Grupo Editorial en España —antes megustaleer.com—, con el catálogo de todos sus sellos.",
        "challenge": "Un catálogo enorme de libros, autores y sellos con identidades muy distintas tenía que convivir en una sola tienda clara, rápida en móvil y fácil de mantener por el equipo editorial.",
        "solution": "Trabajé en el front-end de la tienda sobre PrestaShop, con el tema a medida megustaleer y módulos propios: plantillas Smarty, JavaScript y estilos para portada, listados, fichas de libro y compra, desde el equipo de Capitole Consulting.",
        "facts": [
          {
            "label": "Rol",
            "value": "Front-end"
          },
          {
            "label": "Cliente",
            "value": "Penguin Random House"
          },
          {
            "label": "Vía",
            "value": "Capitole Consulting"
          },
          {
            "label": "Plataforma",
            "value": "PrestaShop"
          }
        ],
        "features": [
          {
            "title": "Tema a medida",
            "text": "Tema megustaleer sobre PrestaShop, con módulos propios para las necesidades de la editorial."
          },
          {
            "title": "Catálogo y sellos",
            "text": "Navegación por categorías y temáticas destacadas, con megamenú, filtros y buscador."
          },
          {
            "title": "Fichas de libro",
            "text": "Formatos, precio, fragmento de lectura y compra directa o en otras librerías desde la misma ficha."
          },
          {
            "title": "Móvil",
            "text": "Portada, listados y fichas adaptados a pantallas pequeñas, donde llega buena parte del tráfico."
          }
        ]
      },
      "en": {
        "description": "Penguin Random House Grupo Editorial's online bookshop in Spain —formerly megustaleer.com— with the catalogue of all its imprints.",
        "challenge": "A huge catalogue of books, authors and imprints with very different identities had to live in a single shop that was clear, fast on mobile and easy for the editorial team to maintain.",
        "solution": "I worked on the shop's front end on PrestaShop, with the custom megustaleer theme and bespoke modules: Smarty templates, JavaScript and styles for the home page, listings, book pages and checkout, from the Capitole Consulting team.",
        "facts": [
          {
            "label": "Role",
            "value": "Front-end"
          },
          {
            "label": "Client",
            "value": "Penguin Random House"
          },
          {
            "label": "Via",
            "value": "Capitole Consulting"
          },
          {
            "label": "Platform",
            "value": "PrestaShop"
          }
        ],
        "features": [
          {
            "title": "Custom theme",
            "text": "The megustaleer theme on PrestaShop, with bespoke modules for the publisher’s needs."
          },
          {
            "title": "Catalogue and imprints",
            "text": "Browsing by category and featured topics, with a mega menu, filters and search."
          },
          {
            "title": "Book pages",
            "text": "Formats, price, reading sample and buying directly or from other bookshops on the same page."
          },
          {
            "title": "Mobile",
            "text": "Home, listings and book pages adapted to small screens, where much of the traffic arrives."
          }
        ]
      }
    },
    "cover": "/projects/penguin-libros/home.webp",
    "media": [
      {
        "src": "/projects/penguin-libros/home.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Portada de penguinlibros.com, la tienda de Penguin Random House en España.",
          "en": "Home page of penguinlibros.com, Penguin Random House’s shop in Spain."
        }
      },
      {
        "src": "/projects/penguin-libros/mobile-home.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Portada en móvil.",
          "en": "Home page on mobile."
        }
      },
      {
        "src": "/projects/penguin-libros/book.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Ficha de libro con formatos, fragmento de lectura y opciones de compra.",
          "en": "Book page with formats, reading sample and buying options."
        }
      },
      {
        "src": "/projects/penguin-libros/listing.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Listado por categoría con temáticas destacadas y filtros.",
          "en": "Category listing with featured topics and filters."
        }
      },
      {
        "src": "/projects/penguin-libros/mobile-book.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Ficha de libro en móvil.",
          "en": "Book page on mobile."
        }
      }
    ]
  },
  {
    "id": "revista-lengua",
    "slug": "revista-lengua",
    "title": "Revista Lengua",
    "year": "",
    "client": "Penguin Random House",
    "category": "pro",
    "tags": [
      "PrestaShop",
      "Smarty",
      "JavaScript",
      "CSS"
    ],
    "featured": false,
    "demo": false,
    "website": "https://www.penguinlibros.com/es/revista-lengua/entradas",
    "content": {
      "es": {
        "description": "LENGUA, la revista digital de Penguin Random House dentro de penguinlibros.com: entrevistas, reportajes y recomendaciones de lectura.",
        "challenge": "La editorial quería una revista con voz propia integrada en la tienda, para que la lectura y el catálogo convivieran en el mismo site.",
        "solution": "La revista vive dentro de PrestaShop sobre un módulo de blog adaptado al tema de la tienda. Trabajé en sus plantillas de portada, listado y artículo, con una composición editorial propia.",
        "facts": [
          {
            "label": "Rol",
            "value": "Front-end"
          },
          {
            "label": "Cliente",
            "value": "Penguin Random House"
          },
          {
            "label": "Vía",
            "value": "Capitole Consulting"
          },
          {
            "label": "Plataforma",
            "value": "PrestaShop · blog"
          }
        ],
        "features": [
          {
            "title": "Portada editorial",
            "text": "Cabecera propia con secciones —entrevistas, artículos, especiales y pódcast— y buscador de la revista."
          },
          {
            "title": "Artículos",
            "text": "Plantilla de lectura con sección, autoría, tiempo de lectura y una composición tipográfica cuidada."
          },
          {
            "title": "Dentro de la tienda",
            "text": "Un módulo de blog integrado en PrestaShop: la revista comparte cabecera, cuenta y carrito con la tienda."
          }
        ]
      },
      "en": {
        "description": "LENGUA, Penguin Random House's digital magazine inside penguinlibros.com: interviews, features and reading recommendations.",
        "challenge": "The publisher wanted a magazine with its own voice inside the shop, so reading and the catalogue could live on the same site.",
        "solution": "The magazine lives inside PrestaShop on a blog module adapted to the shop’s theme. I worked on its home, listing and article templates, with an editorial layout of its own.",
        "facts": [
          {
            "label": "Role",
            "value": "Front-end"
          },
          {
            "label": "Client",
            "value": "Penguin Random House"
          },
          {
            "label": "Via",
            "value": "Capitole Consulting"
          },
          {
            "label": "Platform",
            "value": "PrestaShop · blog"
          }
        ],
        "features": [
          {
            "title": "Editorial home",
            "text": "Its own masthead with sections —interviews, articles, specials and podcast— and a magazine search."
          },
          {
            "title": "Articles",
            "text": "A reading template with section, author, reading time and careful typography."
          },
          {
            "title": "Inside the shop",
            "text": "A blog module integrated into PrestaShop: the magazine shares header, account and cart with the shop."
          }
        ]
      }
    },
    "cover": "/projects/revista-lengua/home.webp",
    "media": [
      {
        "src": "/projects/revista-lengua/home.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Cabecera de LENGUA con sus secciones y buscador propio.",
          "en": "LENGUA’s masthead with its own sections and search."
        }
      },
      {
        "src": "/projects/revista-lengua/mobile-home.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "La revista en móvil.",
          "en": "The magazine on mobile."
        }
      },
      {
        "src": "/projects/revista-lengua/listing.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Listado de entradas con sección, autoría y tiempo de lectura.",
          "en": "Post listing with section, author and reading time."
        }
      },
      {
        "src": "/projects/revista-lengua/article.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Plantilla de artículo con composición editorial.",
          "en": "Article template with an editorial layout."
        }
      },
      {
        "src": "/projects/revista-lengua/mobile-article.webp",
        "type": "image",
        "frame": "phone",
        "caption": {
          "es": "Artículo en móvil.",
          "en": "Article on mobile."
        }
      }
    ]
  },
  {
    "id": "hortec",
    "slug": "hortec",
    "title": "Hortec Cooperativa",
    "year": "2020",
    "client": "Hortec",
    "category": "pro",
    "tags": [
      "VueJs",
      "NuxtJs",
      "Bootstrap 4",
      "Scss",
      "NodeJs",
      "Directus",
      "PostgreSQL",
      "Apache",
      "Nginx",
      "Docker"
    ],
    "featured": false,
    "demo": false,
    "website": "http://hortec.org",
    "cover": "/ImgProyectos/hortec.webp",
    "media": [
      {
        "src": "/ImgPortfolio/h1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/h2.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/h3.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "PWA Corporativa + Backend",
        "challenge": "Hortec es una cooperativa catalana ubicada en Mercabarna. Es una empresa pionera y referente en el sector de la distribución de fruta y verdura ecológica, llevándo más de 25 años en el sector y siendo la primera cooperativa catalana exclusiva en el mercado ecológico.",
        "solution": "El proyecto consistió en diseñar y desarrollar una web totalmente vanguardista y con un diseño acorde con los valores de la empresa. Para ello, desarrollé una PWA con Nuxt Js y VueBootstrap que fuese ligera, rápida y escalable. Una solución que permitiese tanto a los potenciales clientes como a los periódicos compradores, acceder a la plataforma on-line de una manera mucho más rápida y ágil; pudiendo incluso, instalarla en sus telefonos. Finalmente, se añadió Directus , un CMS basado en Apis para la creación de nuevo contenido para el blog.",
        "facts": [
          {
            "label": "Cliente",
            "value": "Hortec"
          },
          {
            "label": "Año",
            "value": "2020"
          },
          {
            "label": "Duración",
            "value": "6 meses"
          }
        ]
      },
      "en": {
        "description": "Corporate PWA + Backend",
        "challenge": "Hortec is a Catalan cooperative located in Mercabarna. It is a pioneer and benchmark company in the organic fruit and vegetable distribution sector, having been in the sector for more than 25 years and being the first exclusive Catalan cooperative in the organic market.",
        "solution": "The project consisted of designing and developing a totally avant-garde website with a design in accordance with the values ​​of the company. To do this, I developed a PWA with Nuxt Js and VueBootstrap that was lightweight, fast and scalable. A solution that would allow both potential clients and newspaper buyers to access the online platform in a much faster and more agile way; you can even install it on your phones. Finally, Directus , a CMS based on Apis for the creation of new content for the blog.",
        "facts": [
          {
            "label": "Client",
            "value": "Hortec"
          },
          {
            "label": "Year",
            "value": "2020"
          },
          {
            "label": "Duration",
            "value": "6 months"
          }
        ]
      }
    }
  },
  {
    "id": "captotal",
    "slug": "captotal",
    "title": "Cap Total",
    "year": "2018",
    "client": "CapTotal",
    "category": "pro",
    "tags": [
      "Wordpress",
      "Slider Rev",
      "Bootstrap 4",
      "Muffin Builder",
      "CSS",
      "PhP",
      "G.Web Designer",
      "G.Analytics",
      "G.Ads",
      "G.Tag Manager"
    ],
    "featured": false,
    "demo": false,
    "website": "https://captotal.com",
    "cover": "/ImgProyectos/captotal.webp",
    "media": [
      {
        "src": "/ImgPortfolio/cap1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/cap2.webm",
        "type": "video"
      },
      {
        "src": "/ImgPortfolio/cap3.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "Web Corporativa",
        "challenge": "Cap Total es una empresa dedicada a la formación vial profesional. Realizando cursos para conductores profesionales tanto de camión como de autobus. Además, es la empresa matriz de Car Land.",
        "solution": "Siendo este junto a Car Land mis primeros proyectos en ámbito del desarrollo web, este consistió en la creación de una web corporativa utilizando Wordpress y diseñada acorde al branding de la empresa, que junto a la segmentación de audiencia via Analytics y su posterior uso en campañas SEM en Google Ads permitiría la generación automática de clientes potenciales así como fortalezer su imagen corporativa. En 2021 se estaba llevando a cabo un rediseño completo de la web.",
        "facts": [
          {
            "label": "Cliente",
            "value": "CapTotal"
          },
          {
            "label": "Año",
            "value": "2018"
          },
          {
            "label": "Duración",
            "value": "2 años"
          }
        ]
      },
      "en": {
        "description": "Corporate website",
        "challenge": "Cap Total is a company dedicated to professional road training. Taking courses for professional drivers of both truck and bus. In addition, it is the parent company of Car Land.",
        "solution": "Being this together with Car Land my first projects in the field of web development, this consisted of the creation of a corporate website using Wordpress and designed according to the branding of the company, which, together with audience segmentation via Analytics and its subsequent use in SEM campaigns in Google Ads, would allow the automatic generation of potential customers as well as strengthen its corporate image. A complete redesign was underway in 2021.",
        "facts": [
          {
            "label": "Client",
            "value": "CapTotal"
          },
          {
            "label": "Year",
            "value": "2018"
          },
          {
            "label": "Duration",
            "value": "2 years"
          }
        ]
      }
    }
  },
  {
    "id": "carland",
    "slug": "carland",
    "title": "Car Land",
    "year": "2018",
    "client": "CapTotal",
    "category": "pro",
    "tags": [
      "Wordpress",
      "Slider Rev",
      "Bootstrap 4",
      "Muffin Builder",
      "CSS",
      "PhP",
      "G.Web Designer",
      "G.Analytics",
      "G.Ads",
      "G.Tag Manager"
    ],
    "featured": false,
    "demo": false,
    "website": "https://autoescuelacarland.com",
    "cover": "/ImgProyectos/carland.webp",
    "media": [
      {
        "src": "/ImgPortfolio/car1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/car2.webm",
        "type": "video"
      },
      {
        "src": "/ImgPortfolio/car3.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "Web Corporativa",
        "challenge": "Car Land es una autoescuela ubicada en el Paralelo, Barcelona. En aquel momento, autoescuelas más grandes y con mucha presencia en los medios digitales se estaban llevando la gran mayoría de alumnos y sumado a la huelga de examinadores, necesitaban empezar a generar clientes.",
        "solution": "Fue mi primer proyecto Web junto a Cap Total, y consistió en crear una web corporativa con Wordpress que estuviese totalmente optimizada y con muy buenos resultados en SEO. Junto a diferentes estrategias SEM como campañas de Display y Video en diferentes plataformas, se logró consolidar la marca y empezar a generar clientes de manera automatizada.",
        "facts": [
          {
            "label": "Cliente",
            "value": "CapTotal"
          },
          {
            "label": "Año",
            "value": "2018"
          },
          {
            "label": "Duración",
            "value": "2 años"
          }
        ]
      },
      "en": {
        "description": "Corporate website",
        "challenge": "Car Land is a driving school located in Parallel, Barcelona. At that time, larger driving schools with a strong presence in digital media were taking the vast majority of students and added to the examiners' strike, they needed to start generating clients.",
        "solution": "It was my first Web project together with Cap Total, and it consisted of creating a corporate website with Wordpress that was fully optimized and with very good SEO results. Together with different SEM strategies such as Display and Video campaigns on different platforms, it was possible to consolidate the brand and start generating customers in an automated way.",
        "facts": [
          {
            "label": "Client",
            "value": "CapTotal"
          },
          {
            "label": "Year",
            "value": "2018"
          },
          {
            "label": "Duration",
            "value": "2 years"
          }
        ]
      }
    }
  },
  {
    "id": "cemar",
    "slug": "cemar",
    "title": "Ascensores Cemar",
    "year": "2018",
    "client": "Ascensores Cemar",
    "category": "pro",
    "tags": [
      "Wordpress",
      "Slider Rev",
      "Bootstrap 4",
      "CSS",
      "Php",
      "Google Cloud"
    ],
    "featured": false,
    "demo": false,
    "website": "https://ascensorescemar.com",
    "cover": "/ImgProyectos/cemar.webp",
    "media": [
      {
        "src": "/ImgPortfolio/c1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/c2.webm",
        "type": "video"
      },
      {
        "src": "/ImgPortfolio/c3.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "Web Corporativa",
        "challenge": "Cemar es una empresa familiar dedicada a la instalación y mantenimiento de elevadores y montacargas ubicada en Hospitalet del Llobregat, Barcelona. Después de 20 años trabajando alrededor de Cataluña, decidieron dar el paso y digitalizar su empresa, ya que esta, no contaba con ningún tipo de presencia en el entorno digital. Querían automatizar un embudo de conversión que les hiciese crecer, ser más conocidos y obtener clientes potenciales de manera periódica.",
        "solution": "Para ello, desarrollé una web corporativa utilizando Wordpress y mediante tecnologías como Matomo o Google Tag Manager se empezó a medir todo el tráfico de la web. A su vez, se setearon objetivos en la página que permitieron mejorar la segmentación para finalmente crear campañas SEM y automatizar la captación de clientes.",
        "facts": [
          {
            "label": "Cliente",
            "value": "Ascensores Cemar"
          },
          {
            "label": "Año",
            "value": "2018"
          },
          {
            "label": "Duración",
            "value": "6 meses"
          }
        ]
      },
      "en": {
        "description": "Corporate website",
        "challenge": "Cemar is a family business dedicated to the installation and maintenance of elevators and hoists located in Hospitalet del Llobregat, Barcelona. After 20 years working around Catalonia, they decided to take the step and digitize their company, since it did not have any kind of presence in the digital environment. They wanted to automate a conversion funnel that would make them grow, be more known and get leads on a regular basis.",
        "solution": "For this, I developed a corporate website using Wordpress and using technologies such as Matomo or Google Tag Manager began to measure all web traffic. At the same time, objectives were set on the page that allowed improving segmentation to finally create SEM campaigns and automate customer acquisition.",
        "facts": [
          {
            "label": "Client",
            "value": "Ascensores Cemar"
          },
          {
            "label": "Year",
            "value": "2018"
          },
          {
            "label": "Duration",
            "value": "6 months"
          }
        ]
      }
    }
  },
  {
    "id": "og-stickers",
    "slug": "og-stickers",
    "title": "OG Stickers",
    "year": "2025",
    "client": "OG Stickers",
    "category": "personal",
    "tags": [
      "Nuxt",
      "Vue",
      "E-commerce",
      "i18n"
    ],
    "featured": false,
    "demo": false,
    "website": "https://ogstickers.net",
    "cover": "/projects/og-stickers/home.webp",
    "media": [
      {
        "src": "/projects/og-stickers/home.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Portada de la tienda: stickers, packaging y diseño.",
          "en": "Store home: stickers, packaging and design."
        }
      },
      {
        "src": "/projects/og-stickers/sticker-builder.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Creador de pegatinas: vista previa y precio por unidad según la cantidad.",
          "en": "Sticker builder: preview and unit price by quantity."
        }
      },
      {
        "src": "/projects/og-stickers/portfolio.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Portfolio con los diseños realizados para otras marcas.",
          "en": "Portfolio of designs made for other brands."
        }
      },
      {
        "src": "/projects/og-stickers/contacto.webp",
        "type": "image",
        "frame": "browser",
        "caption": {
          "es": "Contacto: el formulario clasifica cada petición por tipo de encargo.",
          "en": "Contact: the form sorts each request by type of job."
        }
      }
    ],
    "content": {
      "es": {
        "description": "Tienda online de stickers personalizados, packaging y merchandising con un creador de pegatinas en el navegador.",
        "challenge": "OG Stickers vende pegatinas, packaging y merchandising personalizados para marcas pequeñas. El precio de cada pedido depende del material, el tamaño, la forma, el acabado y la cantidad, así que no cabía en una ficha de producto fija.",
        "solution": "Una tienda en Nuxt con catálogo por familias (stickers, packaging, merchandising y plantillas), cuentas de cliente y carrito. El creador de pegatinas permite subir hasta dos imágenes, elegir tamaño, forma y acabado y ver el precio por unidad según la cantidad antes de añadir el pedido al carrito. Un portfolio de diseños y un formulario de contacto por tipo de encargo completan el sitio, en castellano e inglés.",
        "facts": [
          {
            "label": "Cliente",
            "value": "OG Stickers"
          },
          {
            "label": "Año",
            "value": "2025"
          },
          {
            "label": "Web",
            "value": "ogstickers.net"
          },
          {
            "label": "Idiomas",
            "value": "ES / EN"
          }
        ],
        "features": [
          {
            "title": "Creador de pegatinas",
            "text": "Sube tu diseño y elige vinilo, tamaño, forma y acabado con vista previa."
          },
          {
            "title": "Precio por cantidad",
            "text": "Tabla de 50 a 1000 unidades con su descuento, o una cantidad personalizada."
          },
          {
            "title": "Portfolio",
            "text": "Galería de diseños hechos para otras marcas como punto de partida."
          },
          {
            "title": "Contacto por encargo",
            "text": "El formulario separa stickers, packaging, merchandising, diseño y otras peticiones."
          }
        ]
      },
      "en": {
        "description": "Online store for custom stickers, packaging and merchandise, with an in-browser sticker builder.",
        "challenge": "OG Stickers sells custom stickers, packaging and merchandise to small brands. The price of each order depends on the material, size, shape, finish and quantity, so it did not fit a fixed product page.",
        "solution": "A Nuxt store with a catalogue by family (stickers, packaging, merchandise and templates), customer accounts and a cart. The sticker builder lets you upload up to two images, choose size, shape and finish, and see the unit price for each quantity before adding the order to the cart. A design portfolio and a contact form sorted by type of job complete the site, in Spanish and English.",
        "facts": [
          {
            "label": "Client",
            "value": "OG Stickers"
          },
          {
            "label": "Year",
            "value": "2025"
          },
          {
            "label": "Website",
            "value": "ogstickers.net"
          },
          {
            "label": "Languages",
            "value": "ES / EN"
          }
        ],
        "features": [
          {
            "title": "Sticker builder",
            "text": "Upload your design and pick vinyl, size, shape and finish with a live preview."
          },
          {
            "title": "Price by quantity",
            "text": "A table from 50 to 1000 units with each discount, or a custom quantity."
          },
          {
            "title": "Portfolio",
            "text": "A gallery of designs made for other brands as a starting point."
          },
          {
            "title": "Contact by job",
            "text": "The form separates stickers, packaging, merchandise, design and other requests."
          }
        ]
      }
    }
  },
  {
    "id": "snkrz",
    "slug": "snkrz",
    "title": "Snkrz Garden",
    "year": "2020",
    "client": "Snkrz Garden",
    "category": "personal",
    "tags": [
      "VueJs",
      "NuxtJs",
      "Tailwind Css",
      "Aos Js",
      "NodeJs",
      "Strapi",
      "PostgreSQL",
      "Apache",
      "Nginx"
    ],
    "featured": false,
    "demo": false,
    "website": "https://snkrzgarden.com",
    "cover": "/ImgProyectos/snkrz.webp",
    "media": [
      {
        "src": "/ImgPortfolio/s1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/s2.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/s3.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "E-Commerce Pwa",
        "challenge": "Snkrz Garden es una tienda de sneakers exclusivas ubicada en el Borne, Barcelona. En esta tienda se compran y se venden bambas de ediciones limitadas, tanto de marcas urbanas como de más prestigio.",
        "solution": "El proyecto consistió en crear una solución personalizada totalmente desde cero, ya que buscaban una experiencia disruptiva enfocada sobretodo al público adolescente, y que su diseño fuese exclusivo y totalmente diferenciador del resto de tiendas de corte similar. Para ello, diseñé y desarrollé una PWA desde cero, utilizando Nuxt Js , Tailwind Css y Strapi como backend. De este modo, se consiguió realizar una plataforma \"headless\" con un front totalmente personalizado y un sistema de backend configurado a medida y con el cual podrían publicar nuevas sneakers, controlar el stock y organizar los clientes generados mediante la web.",
        "facts": [
          {
            "label": "Cliente",
            "value": "Snkrz Garden"
          },
          {
            "label": "Año",
            "value": "2020"
          },
          {
            "label": "Duración",
            "value": "3 meses"
          }
        ]
      },
      "en": {
        "description": "E-Commerce Pwa",
        "challenge": "Snkrz Garden is an exclusive sneakers store located in El Borne, Barcelona. In this store, limited edition sneakers are bought and sold, both from urban and more prestigious brands.",
        "solution": "The project consisted of creating a customized solution totally from scratch, since they were looking for a disruptive experience focused above all to the adolescent public, and that its design was exclusive and totally differentiating from the rest of stores of a similar cut. To do this, I designed and developed a PWA from scratch, using Nuxt Js , Tailwind Css and Strapi as backend. In this way, it was possible to create a \"headless\" platform with a fully customized front and a system backend configured to measure and with which they could publish new sneakers, control the stock and organize the clients generated through the web.",
        "facts": [
          {
            "label": "Client",
            "value": "Snkrz Garden"
          },
          {
            "label": "Year",
            "value": "2020"
          },
          {
            "label": "Duration",
            "value": "3 months"
          }
        ]
      }
    }
  },
  {
    "id": "moof",
    "slug": "moof",
    "title": "Moof Fisioterapia",
    "year": "2019",
    "client": "Eric H.",
    "category": "personal",
    "tags": [
      "Wordpress",
      "Slider Rev",
      "Bootstrap 4",
      "Amelia",
      "CSS",
      "PhP",
      "WooCommerce",
      "Google Cloud"
    ],
    "featured": false,
    "demo": false,
    "website": "https://moof.es",
    "cover": "/ImgPortfolio/m1.webp",
    "media": [
      {
        "src": "/ImgPortfolio/m1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/m3.webm",
        "type": "video"
      },
      {
        "src": "/ImgPortfolio/m2.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "Web de fisioterapia a domicilio",
        "challenge": "Moof es un proyecto de Fisioterapia a domicilio impulsado por Eric Herrero con la colaboración de gente como Justo Molinero (Radio TeleTaxi) que querían crear una web para solicitar citas a fisioterapeutas que se desplazarían hasta los hogares de los clientes para realizarles el servicio deseado.",
        "solution": "Para ello, desarrollé una web con Wordpress siguiendo un patrón de diseño app-like, y junto al plugin Amelia, se creó una plataforma donde los distintos profesionales de Moof, podrian poner sus horarios disponibles y los clientes solicitar los servicios en las fechas y franjas horarias proporcionadas.",
        "facts": [
          {
            "label": "Cliente",
            "value": "Eric H."
          },
          {
            "label": "Año",
            "value": "2019"
          },
          {
            "label": "Duración",
            "value": "4 meses"
          }
        ]
      },
      "en": {
        "description": "Home physiotherapy website",
        "challenge": "Moof is a Physiotherapy project at home promoted by Eric Herrero with the collaboration of people like Justo Molinero (Radio TeleTaxi) who wanted to create a website to request appointments to physiotherapists who would travel to clients' homes to perform the desired service.",
        "solution": "For this, I developed a website with Wordpress following an app-like design pattern, and together with the Amelia plugin, created a platform where the different Moof professionals could make their schedules available and clients request the services on the dates and time slots provided.",
        "facts": [
          {
            "label": "Client",
            "value": "Eric H."
          },
          {
            "label": "Year",
            "value": "2019"
          },
          {
            "label": "Duration",
            "value": "4 months"
          }
        ]
      }
    }
  },
  {
    "id": "ayc",
    "slug": "ayc",
    "title": "Argenis y Carolina",
    "year": "2020",
    "client": "AyC Project",
    "category": "personal",
    "tags": [
      "Wordpress",
      "Slider Rev",
      "Bootstrap 4",
      "CSS",
      "PhP",
      "LearnDash",
      "WPML",
      "WooCommerce",
      "Google Cloud"
    ],
    "featured": false,
    "demo": false,
    "website": "https://argenisycarolina.com",
    "cover": "/ImgProyectos/ayc.webp",
    "media": [
      {
        "src": "/ImgPortfolio/ayc1.webp",
        "type": "image"
      },
      {
        "src": "/ImgPortfolio/ayc2.webm",
        "type": "video"
      },
      {
        "src": "/ImgPortfolio/ayc3.webp",
        "type": "image"
      }
    ],
    "content": {
      "es": {
        "description": "Web de formación On-line",
        "challenge": "Argenis y Carolina son dos profesores de baile enfocados en la bachata dominicana tradicional. Después de años en la profesión, y habiendo recorrido medio mundo en eventos de baile internacional, se vieron afectados por las inclemencias del covid y fue cuando decidieron lanzar su propia plataforma de cursos online.",
        "solution": "Para llevar a cabo el proyecto, utilicé Wordpress junto al plugin LearnDash para configurar un sitio LMS, Amazon S3 para almacenar los vídeos y finalmente WooCommerce para todo el proceso de registro y venta del curso. De este modo, Argenis y Carolina pueden crear nuevo contenido y venderlo a sus suscriptores de una manera ágil, flexible y escalable.",
        "facts": [
          {
            "label": "Cliente",
            "value": "AyC Project"
          },
          {
            "label": "Año",
            "value": "2020"
          },
          {
            "label": "Duración",
            "value": "5 meses"
          }
        ]
      },
      "en": {
        "description": "Online learning website",
        "challenge": "Argenis and Carolina are two dance teachers focused on traditional Dominican bachata. After years in the profession, and having traveled half the world in international dance events, they were affected by the inclemency of the covid and it was when they decided to launch their own online course platform.",
        "solution": "To carry out the project , I used Wordpress together with the LearnDash to configure an LMS site, Amazon S3 to store the videos and finally WooCommerce for the entire course registration and sale process. In this way, Argenis and Carolina can create new content and sell it to your subscribers in an agile, flexible and scalable way.",
        "facts": [
          {
            "label": "Client",
            "value": "AyC Project"
          },
          {
            "label": "Year",
            "value": "2020"
          },
          {
            "label": "Duration",
            "value": "5 months"
          }
        ]
      }
    }
  }
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
