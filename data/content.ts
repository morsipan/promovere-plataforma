// ============================================================
// Promovêre — Archivo de contenido centralizado
// Contenido institucional, comercial y estructura del sitio
// ============================================================

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  addressDetail: string;
  socialLinks: {
    linkedin: string;
    instagram: string;
    facebook: string;
  };
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  image?: string;
  icon?: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
}

export interface RepresentationItem {
  id: string;
  title: string;
  brand: string;
  country: string;
  category: string;
  description: string;
  image: string;
  tag: string;
}

export interface PartnerItem {
  name: string;
  logoUrl?: string;
  category: string;
  description: string;
  initials: string;
}

export interface FooterFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  brand: string;
  publishedDate: string;
  excerpt: string;
  image: string;
  externalUrl?: string;
}

export interface PressItem {
  id: string;
  format: 'nota' | 'video';
  mediaOutlet: string;
  title: string;
  publishedDate: string;
  summary: string;
  image: string;
  articleUrl?: string;
  videoUrl?: string;
  duration?: string;
}

export const siteConfig: SiteConfig = {
  name: "Promovêre",
  legalName: "Promovere S.R.L.",
  tagline: "Marketing Turístico",
  description:
    "Con una década de experiencia comercial en el trade de LATAM, conectamos destinos, cadenas hoteleras y marcas de viajes con los principales operadores y agencias de la región.",
  phone: "+54 9 11 4587 6932",
  email: "marketing@promovere.com.ar",
  address: "Av. Roque Sáenz Peña 720",
  addressDetail: "Piso 6 - Of AB, Ciudad Autónoma de Buenos Aires, Argentina",
  socialLinks: {
    linkedin: "https://linkedin.com/company/promovere",
    instagram: "https://instagram.com/promovere",
    facebook: "https://facebook.com/promovere",
  },
};

// Nota: Las Preguntas Frecuentes (FAQs) se ubican exclusivamente en el Footer (AEO).
export const navLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "Representaciones", href: "#representaciones" },
  { label: "Blog", href: "#blog" },
  { label: "Prensa", href: "#prensa" },
  { label: "Contacto", href: "#contacto" },
];

export const heroContent = {
  badge: "Especialistas en Marketing y Representación Turística",
  title: "Somos Promovêre",
  subtitle:
    "Impulsamos marcas turísticas en los mercados de América Latina, promoviendo su presencia comercial y posicionamiento en una amplia red de tour operadores, agencias de viajes y medios especializados / masivos.",
  cta1: { label: "Nuestras Representaciones", href: "#representaciones" },
  cta2: { label: "Comunidad Promovêre", href: "/comunidad" },
  backgroundImage: "/assets/WebP/hero-bg-promovere.webp",
};

export const servicesContent = {
  badge: "Nuestros Servicios",
  title: "Solución integral para tu marca turística",
  subtitle:
    "Ecosistema estratégico 360° para comercializar, posicionar y expandir marcas turísticas internacionales en el trade y público final de América Latina.",
  services: [
    {
      id: "ve-reps",
      image: "/assets/SVG/servicio-reps.svg",
      title: "Representaciones Turísticas (Vê REPS®)",
      subtitle: "Gestión comercial activa",
      description:
        "Visitas comerciales sistemáticas a operadores mayoristas y agencias, capacitaciones presenciales y virtuales, participación en workshops y representación oficial en LATAM.",
      highlights: [
        "Visitas comerciales personalizadas",
        "Capacitación continua al trade",
        "Presencia en eventos sectoriales",
        "Posicionamiento comercial regional",
      ],
    },
    {
      id: "marketing-turistico",
      image: "/assets/SVG/servicio-mkt.svg",
      title: "Marketing Turístico",
      subtitle: "Campañas de alta conversión",
      description:
        "Campañas integrales de promoción y marketing digital omnicanal, branding turístico, captación de leads cualificados y generación de demanda orientada a resultados comerciales.",
      highlights: [
        "Estrategia digital y performance",
        "Campañas de branding turístico",
        "Generación de leads B2B y B2C",
        "Publicidad segmentada LATAM",
      ],
    },
    {
      id: "relaciones-publicas",
      image: "/assets/SVG/servicio-pr.svg",
      title: "Relaciones Públicas",
      subtitle: "Visibilidad en prensa y trade",
      description:
        "Estrategias de comunicación online y offline en medios masivos y prensa especializada del trade turístico, ruedas de prensa, entrevistas y acuerdos con líderes de opinión.",
      highlights: [
        "Cobertura en medios del trade",
        "Notas de prensa y comunicados",
        "Media tours y entrevistas",
        "Gestión de reputación de marca",
      ],
    },
    {
      id: "events",
      image: "/assets/SVG/servicio-events.svg",
      title: "Events",
      subtitle: "Diferenciación y valor para tu marca",
      description:
        "Organización integral de eventos corporativos, caravanas comerciales, roadshows y coordinación logística en ciudades estratégicas de América Latina.",
      highlights: [
        "Caravanas comerciales en ciudades clave",
        "Roadshows y desayunos de trabajo",
        "Eventos de lanzamiento y workshops",
        "Producción y coordinación logística",
      ],
    },
    {
      id: "trade",
      image: "/assets/SVG/servicio-trade.svg",
      title: "Trade",
      subtitle: "Formación especializada y presencia continua",
      description:
        "Capacitación y desarrollo de Producto junto a turoperadores y agencias de viajes: armado de circuitos, fichas técnicas y formación continua para la fuerza de ventas.",
      highlights: [
        "Capacitación y desarrollo de Producto",
        "Webinars y talleres interactivos",
        "Material didáctico y fichas técnicas",
        "Entrenamiento para fuerza de ventas",
      ],
    },
    {
      id: "fams",
      image: "/assets/SVG/servicio-fams.svg",
      title: "FAMS",
      subtitle: "Experiencias memorables de inmersión",
      description:
        "Diseño y coordinación integral de Fam Tours para agentes top producers y Fam Press con periodistas y medios estratégicos para vivir el destino en primera persona.",
      highlights: [
        "Fam Tours con agentes top producers",
        "Fam Press con prensa especializada",
        "Curaduría de agenda e inspecciones",
        "Cobertura editorial y seguimiento trade",
      ],
    },
  ] as ServiceItem[],
};

export const representationsContent = {
  badge: "Nuestras Representaciones",
  title: "Destinos y Marcas Internacionales",
  subtitle:
    "Orgullosos de representar de forma oficial a prestigiosos destinos turísticos, DMC's y cadenas hoteleras líderes.",
  items: [
    {
      id: "cuba-gaviota",
      title: "Cuba",
      brand: "Gaviota Hoteles",
      country: "Cuba",
      category: "Destino & Hotelería",
      description:
        "Representación comercial y posicionamiento de la mayor cadena hotelera de Cuba, con resorts de playa y hoteles históricos en Varadero, Cayos y La Habana.",
      image:
        "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80",
      tag: "Caribe Histórico",
    },
    {
      id: "grecia-hellenic",
      title: "Grecia",
      brand: "Hellenic Travel Network",
      country: "Grecia",
      category: "DMC & Circuitos",
      description:
        "Operador receptivo líder en Grecia y el Mediterráneo oriental, especialista en circuitos arqueológicos, cruceros por las Islas Griegas y hotelería boutique.",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
      tag: "Mediterráneo & Islas",
    },
    {
      id: "islas-caiman",
      title: "Islas Caimán",
      brand: "Departamento de Turismo de Islas Caimán",
      country: "Islas Caimán",
      category: "Destino de Ultra-Lujo",
      description:
        "Promoción turística y comercial del archipiélago en el trade latinoamericano: hotelería de primer nivel, gastronomía de autor y Seven Mile Beach.",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      tag: "Caribe Exclusivo",
    },
    {
      id: "mexico-caribe-atelier",
      title: "México",
      brand: "Caribe Mexicano & Atelier de Hoteles",
      country: "México",
      category: "Destino & Lujo All-Inclusive",
      description:
        "Promoción del Caribe Mexicano y la prestigiosa cadena hotelera ATELIER de Hoteles (Atelier Playa Mujeres), referente en hotelería de lujo 'Handcrafted Hospitality'.",
      image:
        "https://images.unsplash.com/photo-1512815779344-99b39868f763?w=800&q=80",
      tag: "Caribe Mexicano",
    },
    {
      id: "usa-xplorer",
      title: "Estados Unidos",
      brand: "Xplorer USA",
      country: "EE.UU.",
      category: "Receptivo & Circuitos",
      description:
        "Operador receptivo integral en los Estados Unidos, especializado en circuitos guiados en español, parques nacionales, costa este y oeste, y experiencias a medida.",
      image:
        "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&q=80",
      tag: "Norteamérica",
    },
  ],
};

export const partnersContent = {
  badge: "Nuestras Campañas",
  title: "Campañas de marketing y PR",
  subtitle:
    "Trabajamos con marcas globales con el objetivo de acercarlos a los mercados emisivos de Cono Sur y LATAM y potenciar su alcance promocional en la región.",
  ctaLabel: "Quiero mi campaña anual",
  ctaHref: "#contacto",
  partners: [
    {
      name: "Lomas Hospitality",
      category: "Hotelería y Resorts",
      description: "Colección exclusiva de hoteles y experiencias en el Caribe Mexicano.",
      initials: "LH",
    },
    {
      name: "Lifestyle",
      category: "Vacation Resorts",
      description: "Resorts vacacionales y hospitalidad all-inclusive de alta gama.",
      initials: "LS",
    },
    {
      name: "Vila Galé",
      category: "Cadena Hotelera",
      description: "Uno de los mayores grupos hoteleros de Portugal y Brasil.",
      initials: "VG",
    },
    {
      name: "Las Vegas en Tu Idioma",
      category: "Operador Receptivo",
      description: "Servicios receptivos, shows y excursiones personalizadas en Las Vegas.",
      initials: "LV",
    },
    {
      name: "Nueva York en Tu Idioma",
      category: "Operador Receptivo",
      description: "Especialistas en recorridos y experiencias en español en New York.",
      initials: "NY",
    },
    {
      name: "Sun Vista",
      category: "Operador Turístico",
      description: "Servicios integrales y distribución de productos turísticos en LATAM.",
      initials: "SV",
    },
    {
      name: "Coris",
      category: "Asistencia al Viajero",
      description: "Compañía internacional líder en asistencia integral en viaje.",
      initials: "CO",
    },
    {
      name: "Paranair",
      category: "Aerolínea Regional",
      description: "Conectividad aérea ágil y directa en el Cono Sur de América Latina.",
      initials: "PA",
    },
    {
      name: "Doppler",
      category: "Marketing Automation",
      description: "Plataforma líder en Email, Automation Marketing & Data para turismo.",
      initials: "DP",
    },
  ],
};

export const distributionContent = {
  badge: "Alcance Comercial Regional",
  title: "Red de Distribución Turística en LATAM",
  subtitle:
    "Presencia activa y capilar en los principales mercados emisores de América Latina. Conectamos tu producto directamente con quienes deciden la compra turística.",
  stats: [
    { value: "+ 150", label: "Tour operadores mayoristas" },
    { value: "+ 18.000", label: "Agentes de viajes" },
    { value: "+ 2500", label: "Agentes capacitados" },
    { value: "100%", label: "B2B" },
  ],
  countries: [
    "ARGENTINA",
    "BRASIL",
    "CHILE",
    "URUGUAY",
    "PARAGUAY",
    "PERU",
    "BOLIVIA",
    "COLOMBIA",
  ],
  cta1: { label: "Sumar mi marca a la Red", href: "#contacto" },
  cta2: { label: "Explorar Comunidad Trade", href: "/comunidad" },
};

export const blogContent = {
  badge: "Blog Propio",
  title: "Novedades de Promovêre y Nuestras Marcas",
  subtitle:
    "Artículos editoriales, lanzamientos, tendencias del turismo latinoamericano y actualizaciones directas de los destinos y cadenas que representamos.",
  ctaLabel: "Ver todas las notas del Blog",
  ctaHref: "/blog",
  posts: [
    {
      id: "blog-10-anos-promovere",
      slug: "una-decada-conectando-marcas-turisticas-con-latinoamerica",
      title: "Una década conectando marcas turísticas con Latinoamérica",
      category: "Institucional",
      brand: "Promovêre",
      publishedDate: "2026-10-15",
      excerpt:
        "Repasamos una década construyendo puentes comerciales entre cadenas hoteleras, oficinas de turismo, operadores mayoristas y agencias de viajes en toda la región.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    },
    {
      id: "blog-caribe-mexicano-atelier",
      slug: "novedades-temporada-caribe-mexicano-y-atelier",
      title: "Novedades de temporada en Caribe Mexicano y hospitalidad artesanal",
      category: "Marcas Representadas",
      brand: "Caribe Mexicano & Atelier",
      publishedDate: "2026-09-28",
      excerpt:
        "Nuevas experiencias gastronómicas, renovaciones de suites y diferenciales clave para potenciar la venta de resorts de lujo en el canal trade.",
      image:
        "https://images.unsplash.com/photo-1512815779344-99b39868f763?w=800&q=80",
    },
    {
      id: "blog-grecia-circuitos-mediterraneo",
      slug: "claves-para-vender-grecia-y-el-mediterraneo-en-espanol",
      title: "Claves para vender Grecia y el Mediterráneo con operación en español",
      category: "Tendencias Trade",
      brand: "Hellenic Travel Network",
      publishedDate: "2026-09-10",
      excerpt:
        "Cómo estructurar circuitos combinados entre Atenas y las Islas Griegas aprovechando la mejor estacionalidad y conectividad aérea desde Sudamérica.",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    },
  ] as BlogPostItem[],
};

export const pressContent = {
  badge: "Prensa & Medios",
  title: "Promovêre en Prensa, Entrevistas y Videos",
  subtitle:
    "Un único espacio que reúne nuestras apariciones en medios especializados del trade turístico junto con entrevistas, participaciones en ferias y coberturas audiovisuales.",
  allPressLabel: "Ver todas las notas de prensa y medios",
  allPressHref: "/prensa",
  communityBannerTitle: "¿Sos agencia de viajes u operador mayorista?",
  communityBannerSubtitle:
    "Accedé a nuestra Comunidad Promovêre para descargar kits comerciales, fichas técnicas, webinars grabados y novedades exclusivas del trade.",
  communityCtaLabel: "Ir a Comunidad Promovêre",
  communityCtaHref: "/comunidad",
  items: [
    {
      id: "prensa-nota-fit",
      format: "nota",
      mediaOutlet: "Ladevi Medios y Soluciones",
      title: "Promovêre fortalece su estrategia de representación turística en el Cono Sur",
      publishedDate: "2026-10-08",
      summary:
        "Cobertura sobre la agenda comercial, alianzas con operadores mayoristas y las acciones de promoción de destinos internacionales para la próxima temporada.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      articleUrl: "https://promovere.com.ar/prensa",
    },
    {
      id: "prensa-video-entrevista-latam",
      format: "video",
      mediaOutlet: "Entrevista Audiovisual · Trade TV",
      title: "Entrevista: diez años impulsando destinos y hoteles en la región",
      publishedDate: "2026-09-22",
      summary:
        "Conversación en profundidad sobre el rol de la representación comercial B2B, la capacitación a agencias y la evolución de la Comunidad Promovêre.",
      image:
        "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "12:40",
    },
    {
      id: "prensa-nota-caribe",
      format: "nota",
      mediaOutlet: "Mensajero Turístico",
      title: "Roadshows y capacitaciones: el diferencial de Promovêre para el canal minorista",
      publishedDate: "2026-08-30",
      summary:
        "Nota destacada sobre el ciclo anual de encuentros presenciales y webinars orientados a potenciar las ventas de las agencias de viajes de la región.",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      articleUrl: "https://promovere.com.ar/prensa",
    },
    {
      id: "prensa-video-feria-fit",
      format: "video",
      mediaOutlet: "Cobertura en Video · Ferias Internacionales",
      title: "Resumen audiovisual: presencia de nuestras marcas representadas en FIT",
      publishedDate: "2026-08-14",
      summary:
        "Testimonios de directivos de cadenas hoteleras, oficinas de turismo y operadores aliados durante las jornadas profesionales de negocios.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "04:15",
    },
  ] as PressItem[],
};

export const faqContent = {
  title: "Preguntas Frecuentes",
  subtitle:
    "Respuestas claras sobre nuestra representación comercial B2B, alcance en LATAM y acceso a la Comunidad Promovêre.",
  items: [
    {
      question: "¿Qué es Promovêre y qué servicios ofrece en Latinoamérica?",
      answer:
        "Promovêre es una agencia de representación, marketing y relaciones públicas turísticas con una década de experiencia comercial en el trade de LATAM. Conectamos destinos, cadenas hoteleras y DMCs internacionales con operadores mayoristas y agencias de viajes.",
    },
    {
      question: "¿Promovêre comercializa viajes o publica tarifas al pasajero final?",
      answer:
        "No. Nuestro modelo es 100% B2B enfocado en el trade turístico. No realizamos venta directa al consumidor final ni publicamos tarifas públicas; trabajamos junto a operadores mayoristas y agencias minoristas.",
    },
    {
      question: "¿Cómo pueden sumarse las agencias de viajes a la Comunidad Promovêre?",
      answer:
        "Los profesionales de agencias de viajes y operadores mayoristas pueden ingresar a través de la sección Comunidad para acceder a fichas técnicas, capacitaciones, webinars, calendario de eventos y herramientas comerciales.",
    },
    {
      question: "¿Qué diferencia hay entre el Blog de Promovêre y la sección de Prensa?",
      answer:
        "El Blog reúne novedades propias de Promovêre y de las marcas que representamos, mientras que la sección unificada de Prensa agrupa apariciones en medios externos, entrevistas y coberturas en video.",
    },
  ] as FooterFaqItem[],
};

export const contactContent = {
  badge: "Contacto Institucional",
  title: "Potenciemos juntos tu marca en LATAM",
  subtitle:
    "Coordina una reunión con nuestro equipo de profesionales para evaluar las oportunidades de crecimiento y representación de tu marca o destino.",
  info: [
    {
      icon: "MapPin",
      label: "Oficinas Centrales",
      value: "Av. Roque Sáenz Peña 720 - Piso 6 - Of AB\nCiudad Autónoma de Buenos Aires, Argentina",
      href: "https://maps.google.com/?q=Av.+Roque+S%C3%A1enz+Pe%C3%B1a+720+Buenos+Aires",
    },
    {
      icon: "Phone",
      label: "Teléfono Comercial",
      value: "+54 9 11 4587 6932",
      href: "tel:+5491145876932",
    },
    {
      icon: "Mail",
      label: "Correo Institucional",
      value: "marketing@promovere.com.ar",
      href: "mailto:marketing@promovere.com.ar",
    },
    {
      icon: "Clock",
      label: "Horario de Atención",
      value: "Lunes a Viernes: 9:00 a 18:00 hs (ART)",
      href: null,
    },
  ],
  form: {
    title: "Envíanos tu consulta",
    subtitle: "Comunícate directamente con nuestro equipo de desarrollo y marketing.",
    submitLabel: "Enviar mensaje comercial",
  },
};

export const footerContent = {
  description:
    "Promovêre es la agencia de representación y marketing turístico con una década de trayectoria en América Latina, conectando destinos, cadenas hoteleras y operadores con el trade regional.",
  columns: [
    {
      title: "Servicios",
      links: [
        { label: "Representaciones (Vê REPS®)", href: "/servicios/representaciones-turisticas" },
        { label: "Marketing Turístico", href: "/servicios/marketing-turistico" },
        { label: "Relaciones Públicas", href: "/servicios/relaciones-publicas" },
        { label: "Capacitación & Ventas", href: "#servicios" },
        { label: "Desarrollo de Producto", href: "#servicios" },
        { label: "Eventos y Fam Tours", href: "#servicios" },
      ],
    },
    {
      title: "Contenidos & Prensa",
      links: [
        { label: "Prensa (Notas de Prensa)", href: "/prensa#notas-de-prensa" },
        { label: "Coberturas (Entrevistas y Videos)", href: "/prensa#entrevistas-y-coberturas" },
        { label: "Promo News (Blog en Comunidad)", href: "/comunidad/dashboard#herramientas-importantes" },
        { label: "Blog Propio", href: "/blog" },
        { label: "Nuestras Campañas", href: "#partners" },
      ],
    },
    {
      title: "Comunidad & Ayuda",
      links: [
        { label: "Portal Comunidad", href: "/comunidad" },
        { label: "Acceso Trade (Login)", href: "/comunidad/login" },
        { label: "Preguntas Frecuentes", href: "#faq" },
        { label: "Contacto Institucional", href: "#contacto" },
      ],
    },
  ],
  legal: `© ${new Date().getFullYear()} Promovêre. Todos los derechos reservados.`,
};
