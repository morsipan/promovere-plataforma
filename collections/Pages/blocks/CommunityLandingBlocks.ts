import type { Block } from 'payload'
import { createAppearanceField } from '../fields/appearance'

/**
 * Bloques individuales y modulares de la Landing de Comunidad Promovêre.
 * Cada bloque posee su propio configurador de estilos (Apariencia & Colores)
 * para que pueda editarse, reordenarse o reutilizarse en cualquier página o landing.
 */

export const CommunityHeroBlock: Block = {
  slug: 'communityHero',
  labels: {
    singular: 'Comunidad — 1. Hero de Bienvenida',
    plural: 'Comunidad — Heros de Bienvenida',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'verde',
      defaultTheme: 'dark',
      defaultAccentColor: 'blanco',
      defaultButtonColor: 'blanco',
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Título Principal',
      required: true,
      defaultValue: 'Bienvenido a tu espacio',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Descripción / Bajada',
      defaultValue:
        'Tu Comunidad Promovêre es una plataforma exclusiva pensada para potenciar tu gestión turística diaria, acceder a herramientas clave en tiempo real y conectar de forma directa con las mejores marcas, cadenas y destinos de América Latina.',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Texto del Botón Principal',
      defaultValue: 'Iniciá sesión para acceder a tu espacio',
    },
  ],
}

export const CommunityCommercialToolsBlock: Block = {
  slug: 'communityCommercialTools',
  labels: {
    singular: 'Comunidad — 2. Herramientas Comerciales',
    plural: 'Comunidad — Herramientas Comerciales',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blancoHumo',
      defaultTheme: 'light',
      defaultAccentColor: 'azul',
      defaultButtonColor: 'azul',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Etiqueta Superior (Badge)',
      defaultValue: 'Herramientas Operativas',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Herramientas Comerciales en Tiempo Real',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Descripción',
      defaultValue:
        'Consultá requisitos migratorios actualizados y realizá el seguimiento de vuelos de tus pasajeros directamente desde tu panel.',
    },
  ],
}

export const CommunityPromotionsPreviewBlock: Block = {
  slug: 'communityPromotionsPreview',
  labels: {
    singular: 'Comunidad — 3. Promociones, Eventos y Fam Tours',
    plural: 'Comunidad — Promociones y Eventos',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blanco',
      defaultTheme: 'light',
      defaultAccentColor: 'verde',
      defaultButtonColor: 'azul',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Etiqueta Superior (Badge)',
      defaultValue: 'Beneficios Exclusivos',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Promociones, Eventos y Fam Tours',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Descripción',
      defaultValue:
        'Accedé a beneficios comerciales reservados exclusivamente para agencias minoristas y operadores mayoristas registrados.',
    },
  ],
}

export const CommunitySmartToolsBlock: Block = {
  slug: 'communitySmartTools',
  labels: {
    singular: 'Comunidad — 4. Herramientas Inteligentes (IA)',
    plural: 'Comunidad — Herramientas Inteligentes',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blancoHumo',
      defaultTheme: 'light',
      defaultAccentColor: 'azul',
      defaultButtonColor: 'verde',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Etiqueta Superior (Badge)',
      defaultValue: 'Innovación para el Trade',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Herramientas Inteligentes para Vender',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Descripción',
      defaultValue:
        'Ahorrá tiempo operativo armando itinerarios y propuestas personalizadas con nuestra suite de asistencia comercial inteligente.',
    },
  ],
}

export const CommunityFeaturedProductsBlock: Block = {
  slug: 'communityFeaturedProducts',
  labels: {
    singular: 'Comunidad — 5. Productos Destacados y Destinos',
    plural: 'Comunidad — Productos Destacados',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'blanco',
      defaultTheme: 'light',
      defaultAccentColor: 'verde',
      defaultButtonColor: 'azul',
    }),
    {
      name: 'badge',
      type: 'text',
      label: 'Etiqueta Superior (Badge)',
      defaultValue: 'Catálogo Oficial',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      required: true,
      defaultValue: 'Productos Destacados & Destinos Principales',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Descripción',
      defaultValue:
        'Explorá las cadenas hoteleras, DMCs y destinos de excelencia que representamos oficialmente en toda América Latina.',
    },
  ],
}

export const CommunityWhatsAppBlock: Block = {
  slug: 'communityWhatsApp',
  labels: {
    singular: 'Comunidad — 6. Franja de WhatsApp',
    plural: 'Comunidad — Franjas de WhatsApp',
  },
  fields: [
    createAppearanceField({
      defaultBackgroundColor: 'verde',
      defaultTheme: 'dark',
      defaultAccentColor: 'blanco',
      defaultButtonColor: 'blanco',
    }),
    {
      name: 'title',
      type: 'text',
      label: 'Título del Banner de WhatsApp',
      required: true,
      defaultValue: '¡Sumate a nuestra Comunidad de WhatsApp!',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo / Bajada',
      defaultValue:
        'Recibí al instante en tu celular alertas exclusivas de cupos, promociones de último momento, invitaciones a webinars y novedades de destinos de toda América Latina.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          label: 'Texto del Botón',
          defaultValue: 'Unirme a la Comunidad de WhatsApp',
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Número de WhatsApp (con código de país, sin +)',
          defaultValue: '5491145876932',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
