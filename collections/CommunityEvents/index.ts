import type { Access, CollectionConfig, Where } from 'payload'

const canReadEvents: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role && ['admin', 'editor'].includes(user.role)) return true

  if (user.role === 'mayorista' || user.role === 'minorista') {
    const query: Where = {
      and: [
        {
          status: { equals: 'active' },
        },
        {
          visibleFor: { contains: user.role },
        },
      ],
    }
    return query
  }

  return false
}

const canManageEvents: Access = ({ req: { user } }) => {
  return Boolean(user?.role && ['admin', 'editor'].includes(user.role))
}

export const CommunityEvents: CollectionConfig = {
  slug: 'community-events',
  labels: {
    singular: 'Fam / Capacitación',
    plural: 'Fams & Caps',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'modality', 'eventDate', 'locationOrPlatform', 'status'],
    group: 'Comunidad',
    description:
      'Agenda de webinars en vivo, workshops presenciales y capacitaciones grabadas (On-Demand) para la Comunidad Trade.',
  },
  access: {
    read: canReadEvents,
    create: canManageEvents,
    update: canManageEvents,
    delete: canManageEvents,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título del Evento o Capacitación',
      required: true,
      admin: {
        description: 'Ej: Webinar: Novedades de Atelier Playa Mujeres 2026.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'modality',
          type: 'select',
          enumName: 'enum_ce_modality',
          label: 'Modalidad',
          required: true,
          defaultValue: 'webinar',
          options: [
            { label: 'Webinar en Vivo', value: 'webinar' },
            { label: 'Evento / Workshop Presencial', value: 'presencial' },
            { label: 'Fam Tour / Fam Trip', value: 'fam_trip' },
            { label: 'Capacitación Grabada (On-Demand)', value: 'on_demand' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'eventDate',
          type: 'date',
          label: 'Fecha y Hora (Para Webinars / Presenciales)',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayAndTime',
              displayFormat: 'dd/MM/yyyy HH:mm',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'locationOrPlatform',
          type: 'text',
          label: 'Plataforma o Lugar',
          defaultValue: 'Zoom (Online)',
          admin: {
            width: '50%',
            description: 'Ej: Zoom, Google Meet, Buenos Aires — Hotel Alvear, YouTube.',
          },
        },
        {
          name: 'speaker',
          type: 'text',
          label: 'Disertante / Anfitrión (Opcional)',
          admin: {
            width: '50%',
            description: 'Ej: Equipo Comercial Promovêre & Atelier.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción y Temario',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'registrationUrl',
          type: 'text',
          label: 'Enlace de Inscripción (Zoom / Tally / Meet)',
          admin: {
            width: '50%',
            description: 'Botón "Inscribirme" para eventos próximos.',
          },
        },
        {
          name: 'recordingUrl',
          type: 'text',
          label: 'Enlace de Grabación (YouTube / Vimeo)',
          admin: {
            width: '50%',
            description: 'Botón "Ver Grabación" para capacitaciones On-Demand o ya realizadas.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Flyer / Imagen del Evento (Opcional)',
          admin: { width: '50%' },
        },
        {
          name: 'materialAttachment',
          type: 'upload',
          relationTo: 'media',
          label: 'Presentación / Material de Apoyo (PDF Opcional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'visibleFor',
      type: 'select',
      enumName: 'enum_ce_vis',
      hasMany: true,
      label: 'Visible para Roles',
      required: true,
      defaultValue: ['mayorista', 'minorista'],
      options: [
        { label: 'Operador Mayorista (mayorista)', value: 'mayorista' },
        { label: 'Agencia Minorista (minorista)', value: 'minorista' },
      ],
    },
    // Sidebar
    {
      name: 'representation',
      type: 'relationship',
      relationTo: 'representations',
      label: 'Marca / Representación Anfitriona',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_ce_status',
      label: 'Estado',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Publicado (Visible)', value: 'active' },
        { label: 'Borrador / Oculto', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar Evento (Columna Derecha)',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Muestra este evento en el listado destacado junto al calendario.',
      },
    },
  ],
}
