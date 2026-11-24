import type { Access, CollectionConfig } from 'payload'

const canReadRegistrations: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role && ['admin', 'editor'].includes(user.role)) return true
  return {
    user: {
      equals: user.id,
    },
  }
}

const isInternalTeam: Access = ({ req: { user } }) =>
  Boolean(user?.role && ['admin', 'editor'].includes(user.role))

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  labels: {
    singular: 'Inscripción a Evento',
    plural: 'Inscripciones a Eventos',
  },
  admin: {
    useAsTitle: 'eventTitle',
    defaultColumns: ['eventTitle', 'brandName', 'userName', 'userEmail', 'userRole', 'status', 'createdAt'],
    group: 'Comunidad',
    description:
      'Registro automático de inscripciones en 1 clic a Webinars y FAM Tours vinculadas al usuario y la marca/evento.',
  },
  access: {
    read: canReadRegistrations,
    create: ({ req: { user } }) => Boolean(user),
    update: isInternalTeam,
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role && ['admin', 'editor'].includes(user.role)) return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          label: 'Usuario Inscripto',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'event',
          type: 'relationship',
          relationTo: 'community-events',
          label: 'Evento / Webinar / FAM Tour',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'representation',
      type: 'relationship',
      relationTo: 'representations',
      label: 'Marca / Representación Vinculada',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'eventTitle',
          type: 'text',
          label: 'Título del Evento',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'eventModality',
          type: 'text',
          label: 'Modalidad',
          admin: { width: '25%' },
        },
        {
          name: 'brandName',
          type: 'text',
          label: 'Marca / Destino',
          admin: { width: '25%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'userName',
          type: 'text',
          label: 'Nombre del Profesional',
          admin: { width: '35%' },
        },
        {
          name: 'userEmail',
          type: 'email',
          label: 'Email del Profesional',
          admin: { width: '35%' },
        },
        {
          name: 'userCompany',
          type: 'text',
          label: 'Agencia / Operador',
          admin: { width: '30%' },
        },
      ],
    },
    {
      name: 'userRole',
      type: 'text',
      label: 'Rol del Usuario',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_er_status',
      label: 'Estado',
      required: true,
      defaultValue: 'registered',
      options: [
        { label: 'Inscripto / Interés Confirmado', value: 'registered' },
        { label: 'Cancelado', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
