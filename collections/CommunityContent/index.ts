import type { Access, CollectionConfig } from 'payload'

// Control de acceso para lectura del contenido de comunidad
export const canReadCommunityContent: Access = ({ req: { user } }) => {
  if (!user) return false

  // Administradores y Editores de Promovêre tienen visibilidad completa
  if (['admin', 'editor'].includes(user.role)) return true

  // Operadores mayoristas ven contenido general y exclusivo mayorista
  if (user.role === 'mayorista') {
    return {
      accessibleTo: {
        in: ['all', 'mayorista'],
      },
    }
  }

  // Agencias minoristas ven contenido general y exclusivo minorista
  if (user.role === 'minorista') {
    return {
      accessibleTo: {
        in: ['all', 'minorista'],
      },
    }
  }

  return false
}

// Control de mutaciones: Solo administradores y editores internos
export const canManageCommunityContent: Access = ({ req: { user } }) => {
  return Boolean(user?.role && ['admin', 'editor'].includes(user.role))
}

export const CommunityContent: CollectionConfig = {
  slug: 'community-content',
  labels: {
    singular: 'Contenido de Comunidad',
    plural: 'Contenidos de Comunidad',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'accessibleTo', 'updatedAt'],
    description:
      'Recursos comerciales, manuales y herramientas para la Comunidad Promovêre. (Aviso: No publicar tarifas ni precios confidenciales).',
  },
  access: {
    read: canReadCommunityContent,
    create: canManageCommunityContent,
    update: canManageCommunityContent,
    delete: canManageCommunityContent,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título del Recurso / Novedad',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría de Contenido',
      required: true,
      defaultValue: 'promociones',
      options: [
        { label: 'Promociones & Acciones Trade', value: 'promociones' },
        { label: 'Fichas Técnicas de Hoteles & Destinos', value: 'fichas' },
        { label: 'Manuales de Venta & Presentaciones', value: 'manuales' },
        { label: 'Capacitaciones & Webinars', value: 'capacitaciones' },
        { label: 'Kits de Marketing & Redes Sociales', value: 'marketing' },
      ],
    },
    {
      name: 'accessibleTo',
      type: 'select',
      label: 'Nivel de Acceso / Segmentación',
      required: true,
      defaultValue: 'all',
      options: [
        {
          label: 'Toda la Comunidad (Mayoristas y Minoristas)',
          value: 'all',
        },
        {
          label: 'Exclusivo para Operadores Mayoristas',
          value: 'mayorista',
        },
        {
          label: 'Exclusivo para Agencias Minoristas',
          value: 'minorista',
        },
      ],
      admin: {
        description:
          'Define qué perfiles de la Comunidad pueden visualizar y descargar este recurso.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción / Instrucciones Comerciales',
      required: true,
    },
    {
      name: 'highlight',
      type: 'text',
      label: 'Destacado / Tag (ej: Nuevo, Temporada 2026, Cupos Limitados)',
    },
    {
      name: 'downloadableFiles',
      type: 'array',
      label: 'Archivos y Recursos Descargables',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nombre del Archivo / Documento',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL de Descarga directa (PDF, Presentación, Drive, etc.)',
          required: true,
        },
        {
          name: 'fileType',
          type: 'select',
          label: 'Tipo de Formato',
          defaultValue: 'PDF',
          options: [
            { label: 'Documento PDF', value: 'PDF' },
            { label: 'Presentación PPTX', value: 'PPTX' },
            { label: 'Carpeta de Imágenes / Assets', value: 'ZIP' },
            { label: 'Enlace / Video Webinar', value: 'VIDEO' },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar en el Inicio del Dashboard',
      defaultValue: false,
    },
  ],
}
