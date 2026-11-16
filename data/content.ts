// ============================================================
// Promovere — Archivo de contenido centralizado
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
  icon: string;
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

export const siteConfig: SiteConfig = {
  name: "Promovêre",
  legalName: "Promovere S.R.L.",
  tagline: "Agencia de Representación y Promoción Turística en Latinoamérica",
  description:
    "Especialistas en promoción turística en LATAM. Conectamos destinos, cadenas hoteleras y marcas de viajes con los principales operadores y agencias de la región.",
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

export const navLinks: NavLink[] = [
  { label: "Servicios", href: "#servicios" },
  { label: "Representaciones", href: "#representaciones" },
  { label: "Red LATAM", href: "#red" },
  { label: "Partners", href: "#partners" },
  { label: "Contacto", href: "#contacto" },
];

export const heroContent = {
  badge: "Especialistas en Promoción Turística en LATAM",
  title: "Somos Promovêre",
  subtitle:
    "Impulsamos la presencia comercial, el posicionamiento y las ventas de destinos, hoteles y marcas turísticas de clase mundial en los mercados más dinámicos de América Latina.",
  cta1: { label: "Nuestras Representaciones", href: "#representaciones" },
  cta2: { label: "Comunidad Promovêre", href: "#contacto" },
  backgroundImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
};

export const servicesContent = {
  badge: "Nuestros Servicios",
  title: "Solución integral para tu marca turística",
  subtitle:
    "Ecosistema estratégico 360° para comercializar, posicionar y expandir marcas turísticas internacionales en el trade y público final de América Latina.",
  services: [
    {
      id: "ve-reps",
      icon: "Briefcase",
      title: "Representaciones Turísticas (Vê REPS®)",
      subtitle: "Gestión comercial activa",
      description:
        "Visitas comerciales sistemáticas a operadores mayoristas y agencias, capacitaciones presenciales y virtuales, participación en workshops y organización de Fam Tours estratégicos.",
      highlights: [
        "Visitas comerciales personalizadas",
        "Capacitación continua al trade",
        "Presencia en eventos sectoriales",
        "Fam Tours exclusivos",
      ],
    },
    {
      id: "marketing-turistico",
      icon: "Megaphone",
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
      icon: "Users",
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
      id: "capacitacion",
      icon: "GraduationCap",
      title: "Capacitación",
      subtitle: "Formación especializada para el canal",
      description:
        "Programas de formación diseñados para la fuerza de ventas y los departamentos de producto de operadores emisores y agencias de viajes, garantizando conocimiento profundo del destino.",
      highlights: [
        "Webinars y talleres interactivos",
        "Material didáctico y fichas técnicas",
        "Certificaciones de producto",
        "Entrenamiento para fuerza de ventas",
      ],
    },
    {
      id: "desarrollo-producto",
      icon: "Compass",
      title: "Desarrollo de Producto",
      subtitle: "Diferenciación y valor en góndola",
      description:
        "Asesoramiento a turoperadores para el armado de circuitos, paquetes temáticos e itinerarios diferenciales que respondan a los hábitos y preferencias del viajero latinoamericano.",
      highlights: [
        "Diseño de itinerarios y tarifas",
        "Análisis de competitividad en mercado",
        "Curaduría de experiencias únicas",
        "Integración con operadores líderes",
      ],
    },
    {
      id: "eventos-famtours",
      icon: "Calendar",
      title: "Eventos y Fam Tours",
      subtitle: "Experiencias memorables de inmersión",
      description:
        "Organización integral de caravanas comerciales, roadshows, eventos de lanzamiento y viajes de familiarización (Fam Tours) para agentes y tomadores de decisión clave.",
      highlights: [
        "Caravanas comerciales en ciudades clave",
        "Roadshows y desayunos de trabajo",
        "Fam Tours con agentes top producers",
        "Logística y coordinación integral",
      ],
    },
  ],
};

export const representationsContent = {
  badge: "Nuestras Representaciones",
  title: "Destinos y Marcas Internacionales",
  subtitle:
    "Orgullosos de representar de forma oficial a prestigiosos destinos turísticos y cadenas hoteleras líderes en América Latina.",
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
  badge: "Alianzas Estratégicas",
  title: "Partners y Aliados Estratégicos",
  subtitle:
    "Trabajamos en sinergia con marcas globales, cadenas hoteleras, aerolíneas y plataformas líderes que potencian nuestro alcance comercial en la región.",
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
    { value: "+12", label: "Países de cobertura activa en LATAM" },
    { value: "+1.200", label: "Agencias de viajes y operadores capacitados" },
    { value: "+30", label: "Eventos, caravanas y Fam Tours anuales" },
    { value: "100%", label: "Enfoque B2B especializado en turismo" },
  ],
  countries: [
    "Argentina",
    "Brasil",
    "Chile",
    "Uruguay",
    "Paraguay",
    "Perú",
    "Colombia",
    "México",
    "Bolivia",
    "Ecuador",
    "Panamá",
    "Costa Rica",
  ],
  cta1: { label: "Sumar mi marca a la Red", href: "#contacto" },
  cta2: { label: "Contactar a nuestro equipo", href: "#contacto" },
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
    "Promovêre es la agencia de representación y marketing turístico de referencia en América Latina, conectando destinos, cadenas hoteleras y operadores con los mercados más dinámicos de la región.",
  columns: [
    {
      title: "Servicios",
      links: [
        { label: "Representaciones (Vê REPS®)", href: "#servicios" },
        { label: "Marketing Turístico", href: "#servicios" },
        { label: "Relaciones Públicas", href: "#servicios" },
        { label: "Capacitación & Ventas", href: "#servicios" },
        { label: "Desarrollo de Producto", href: "#servicios" },
        { label: "Eventos y Fam Tours", href: "#servicios" },
      ],
    },
    {
      title: "Representaciones",
      links: [
        { label: "Cuba (Gaviota Hoteles)", href: "#representaciones" },
        { label: "Grecia (Hellenic Travel)", href: "#representaciones" },
        { label: "Islas Caimán", href: "#representaciones" },
        { label: "México (Caribe Mexicano & Atelier)", href: "#representaciones" },
        { label: "EE.UU. (Xplorer USA)", href: "#representaciones" },
      ],
    },
    {
      title: "Comunidad & Legal",
      links: [
        { label: "Red de Distribución", href: "#red" },
        { label: "Partners Estratégicos", href: "#partners" },
        { label: "Portal Comunidad", href: "#contacto" },
        { label: "Términos y Condiciones", href: "#" },
      ],
    },
  ],
  legal: `© ${new Date().getFullYear()} Promovêre. Todos los derechos reservados.`,
};
