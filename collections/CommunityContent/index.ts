import type { Access, CollectionConfig, Where } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  HeadingFeature,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

/**
 * Control de Acceso para Lectura (Read Access Control):
 * - Administradores y Editores de Promovêre: Visibilidad total (auditoría y gestión).
 * - Usuarios no autenticados: CERO visibilidad (bloqueo total).
 * - Operadores Mayoristas: Visualizan contenidos donde 'visibleFor' incluye 'mayorista'.
 * - Agencias Minoristas: Visualizan contenidos donde 'visibleFor' incluye 'minorista',
 *   con EXCLUSIÓN ESTRICTA Y ABSOLUTA de contenidos clasificados como 'contratos'
 *   o títulos que contengan tarifarios confidenciales.
 */
export const canReadCommunityContent: Access = ({ req: { user } }) => {
  if (!user) return false

  // Administradores y Editores internos tienen acceso completo
  if (user.role && ['admin', 'editor'].includes(user.role)) {
    return true
  }

  // Operadores mayoristas ven contenido segmentado para su rol
  if (user.role === 'mayorista') {
    const mayoristaQuery: Where = {
      visibleFor: {
        contains: 'mayorista',
      },
    }
    return mayoristaQuery
  }

  // Agencias minoristas: Solo contenido permitido expresamente para minoristas
  // Regla de Negocio: Bajo ninguna circunstancia pueden acceder a contratos ni tarifarios
  if (user.role === 'minorista') {
    const minoristaQuery: Where = {
      and: [
        {
          visibleFor: {
            contains: 'minorista',
          },
        },
        {
          category: {
            not_equals: 'contratos',
          },
        },
        {
          title: {
            not_like: '%tarif%',
          },
        },
      ],
    }
    return minoristaQuery
  }

  return false
}

/**
 * Control de Acceso para Mutaciones (Create, Update, Delete):
 * Restringido exclusivamente al equipo interno de Promovêre (admin y editor).
 */
export const canManageCommunityContent: Access = ({ req: { user } }) => {
  return Boolean(user?.role && ['admin', 'editor'].includes(user.role))
}

export const CommunityContent: CollectionConfig = {
  slug: 'community-content',
  labels: {
    singular: 'Contenido Privado de Comunidad',
    plural: 'Contenidos Privados de Comunidad',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'visibleFor', 'updatedAt'],
    group: 'Comunidad Trade',
    description:
      'Recursos privados, herramientas comerciales y documentación para la Comunidad Promovêre (Operadores Mayoristas y Agencias Minoristas).',
  },
  access: {
    read: canReadCommunityContent,
    create: canManageCommunityContent,
    update: canManageCommunityContent,
    delete: canManageCommunityContent,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        const isContract = data.category === 'contratos'
        const titleHasTariff = Boolean(
          data.title &&
          /(tarif|tarifa|precios?|contrato|acuerdo|confidencial)/i.test(data.title)
        )

        // Regla de Negocio Estricta:
        // Contenidos categorizados como "contratos" o que contengan tarifarios
        // quedan estrictamente limitados por defecto al rol "mayorista".
        if (isContract || titleHasTariff) {
          data.visibleFor = ['mayorista']
        } else if (!data.visibleFor || (Array.isArray(data.visibleFor) && data.visibleFor.length === 0)) {
          data.visibleFor = ['mayorista', 'minorista']
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Publicación',
      required: true,
      admin: {
        description: 'Nombre descriptivo del recurso, herramienta, promoción o contrato.',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría de Contenido',
      required: true,
      defaultValue: 'novedades',
      options: [
        { label: 'Herramientas Comerciales', value: 'herramientas_comerciales' },
        { label: 'Herramientas Inteligentes', value: 'herramientas_inteligentes' },
        { label: 'Notas de Blog (Herramientas Importantes)', value: 'blog' },
        { label: 'Herramientas (General)', value: 'herramientas' },
        { label: 'Material Comercial', value: 'material_comercial' },
        { label: 'Novedades', value: 'novedades' },
        { label: 'Promociones', value: 'promociones' },
        { label: 'Contratos (Exclusivo Mayoristas)', value: 'contratos' },
      ],
      admin: {
        description:
          'Seleccioná la categoría. Aviso: Los contratos y acuerdos quedan automáticamente restringidos al rol Mayorista.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descripción / Contenido (Rich Text Restringido)',
      required: true,
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({
            enabledCollections: ['media'],
          }),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
      admin: {
        description:
          'Texto estructurado, especificaciones comerciales e instrucciones para el canal.',
      },
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Archivos Adjuntos (Upload / Media Descargables)',
      admin: {
        description:
          'Adjuntá los documentos comerciales, PDFs, fichas técnicas, contratos o kits descargables.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de Portada / Thumbnail (Opcional)',
      admin: {
        description: 'Imagen visual para destacar esta publicación o herramienta en el dashboard.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'externalUrl',
          type: 'text',
          label: 'Enlace Externo (Drive, Cotizador, Zoom, Formulario, Web)',
          admin: {
            width: '60%',
            description: 'URL externa si el recurso vive en Drive, Dropbox, YouTube, Tally o motor de reservas.',
          },
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del Botón Externo',
          defaultValue: 'Abrir Recurso',
          admin: {
            width: '40%',
            description: 'Ej: Abrir Banco de Fotos, Ir al Cotizador.',
          },
        },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Enlace de Video (YouTube / Vimeo — Opcional)',
      admin: {
        description: 'Link de webinar grabado, capacitación o video promocional.',
      },
    },
    {
      name: 'visibleFor',
      type: 'select',
      hasMany: true,
      label: 'Restricción de Visibilidad (Roles Permitidos)',
      required: true,
      defaultValue: ['mayorista', 'minorista'],
      options: [
        { label: 'Operador Mayorista (mayorista)', value: 'mayorista' },
        { label: 'Agencia Minorista (minorista)', value: 'minorista' },
      ],
      admin: {
        description:
          'Selecciona qué perfiles de la Comunidad pueden visualizar y descargar este recurso.',
      },
    },
    // Metadatos complementarios para potenciar la experiencia del dashboard
    {
      name: 'representation',
      type: 'relationship',
      relationTo: 'representations',
      label: 'Marca / Representación Asociada',
      admin: {
        position: 'sidebar',
        description: 'Vinculá este recurso a una marca oficial para filtrarlo en el portal.',
      },
    },
    {
      name: 'brand',
      type: 'text',
      label: 'Marca / Cadena (Texto libre opcional)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Tag Destacado (ej: Nuevo, Vigente, Cupos Limitados)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar en Dashboard',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
