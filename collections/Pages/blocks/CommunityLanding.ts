import type { Block } from 'payload';

export const CommunityLandingBlock: Block = {
  slug: 'communityLanding',
  labels: {
    singular: 'Landing Comunidad Trade B2B',
    plural: 'Landings Comunidad Trade',
  },
  fields: [
    // 1. Hero
    {
      type: 'collapsible',
      label: 'Configuración: Hero Principal',
      fields: [
        {
          name: 'heroTitle',
          type: 'text',
          label: 'Título del Hero',
          defaultValue: 'Bienvenido a tu espacio',
          required: true,
        },
        {
          name: 'heroSubtitle',
          type: 'textarea',
          label: 'Subtítulo / Bajada',
          defaultValue:
            'Tu Comunidad Promovêre es una plataforma exclusiva pensada para potenciar tu gestión turística diaria, acceder a herramientas clave en tiempo real y conectar de forma directa con las mejores marcas, cadenas y destinos de América Latina.',
        },
        {
          name: 'heroCtaText',
          type: 'text',
          label: 'Texto del Botón CTA Principal',
          defaultValue: 'Iniciá sesión para acceder a tu espacio',
        },
      ],
    },

    // 2. Herramientas Comerciales
    {
      type: 'collapsible',
      label: 'Configuración: Herramientas Comerciales (Pasaportes & FlightAware)',
      fields: [
        {
          name: 'toolsBadge',
          type: 'text',
          label: 'Badge Superior',
          defaultValue: 'Herramientas Operativas',
        },
        {
          name: 'toolsTitle',
          type: 'text',
          label: 'Título de la Sección',
          defaultValue: 'Herramientas Comerciales en Tiempo Real',
        },
        {
          name: 'toolsSubtitle',
          type: 'textarea',
          label: 'Subtítulo',
          defaultValue:
            'Consultá requisitos migratorios actualizados y realizá el seguimiento de vuelos de tus pasajeros directamente desde tu panel.',
        },
      ],
    },

    // 3. Promociones y Eventos
    {
      type: 'collapsible',
      label: 'Configuración: Promociones & Fam Tours',
      fields: [
        {
          name: 'promotionsBadge',
          type: 'text',
          label: 'Badge Superior',
          defaultValue: 'Oportunidades Comerciales',
        },
        {
          name: 'promotionsTitle',
          type: 'text',
          label: 'Título de la Sección',
          defaultValue: 'Promociones, Eventos y Fam Tours Exclusivos',
        },
        {
          name: 'promotionsSubtitle',
          type: 'textarea',
          label: 'Subtítulo',
          defaultValue:
            'Accedé a convocatorias para viajes de familiarización, desayunos de capacitación y acuerdos comerciales reservados para nuestra red.',
        },
      ],
    },

    // 4. Herramientas IA
    {
      type: 'collapsible',
      label: 'Configuración: Armador de Itinerarios con IA',
      fields: [
        {
          name: 'smartToolsBadge',
          type: 'text',
          label: 'Badge Superior',
          defaultValue: 'Inteligencia Artificial Trade',
        },
        {
          name: 'smartToolsTitle',
          type: 'text',
          label: 'Título de la Sección',
          defaultValue: 'Herramientas Inteligentes para Vender Más Rápido',
        },
        {
          name: 'smartToolsSubtitle',
          type: 'textarea',
          label: 'Subtítulo',
          defaultValue:
            'Tecnología desarrollada a medida para agencias de viajes. Armá propuestas comerciales completas día por día en cuestión de segundos.',
        },
      ],
    },

    // 5. Productos Destacados & Destinos
    {
      type: 'collapsible',
      label: 'Configuración: Productos Destacados & Destinos',
      fields: [
        {
          name: 'productsBadge',
          type: 'text',
          label: 'Badge Superior',
          defaultValue: 'Productos y Destinos',
        },
        {
          name: 'productsTitle',
          type: 'text',
          label: 'Título de la Sección',
          defaultValue: 'Productos Destacados & Destinos',
        },
        {
          name: 'productsSubtitle',
          type: 'textarea',
          label: 'Subtítulo',
          defaultValue:
            'Descubrí las marcas, cadenas y regiones preferidas por los viajeros de Latinoamérica.',
        },
      ],
    },

    // 6. WhatsApp Banner
    {
      type: 'collapsible',
      label: 'Configuración: Franja de WhatsApp',
      fields: [
        {
          name: 'whatsappTitle',
          type: 'text',
          label: 'Título de WhatsApp',
          defaultValue: '¡Sumate a nuestra Comunidad de WhatsApp!',
        },
        {
          name: 'whatsappSubtitle',
          type: 'textarea',
          label: 'Subtítulo',
          defaultValue:
            'Recibí al instante en tu celular alertas exclusivas de cupos, promociones de último momento, invitaciones a webinars y novedades de destinos de toda América Latina.',
        },
        {
          name: 'whatsappCtaText',
          type: 'text',
          label: 'Texto del Botón de WhatsApp',
          defaultValue: 'Unirme a la Comunidad de WhatsApp',
        },
        {
          name: 'whatsappPhone',
          type: 'text',
          label: 'Número de WhatsApp (con código de país)',
          defaultValue: '5491145876932',
        },
      ],
    },
  ],
};
