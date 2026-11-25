import type { CollectionConfig } from 'payload'

const isInternalTeam = ({ req: { user } }: { req: { user?: any } }) =>
  Boolean(user?.role && ['admin', 'editor'].includes(user.role))

const isAdminOnly = ({ req: { user } }: { req: { user?: any } }) =>
  Boolean(user?.role === 'admin')

export const AnalyticsEvents: CollectionConfig = {
  slug: 'analytics-events',
  labels: {
    singular: 'Evento de Analítica',
    plural: 'Eventos de Analítica',
  },
  defaultSort: '-createdAt',
  admin: {
    hidden: true,
    useAsTitle: 'label',
    defaultColumns: ['eventType', 'path', 'label', 'device', 'createdAt'],
  },
  access: {
    read: isInternalTeam,
    create: isInternalTeam,
    update: () => false,
    delete: isAdminOnly,
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      enumName: 'enum_ae_type',
      label: 'Tipo de Evento',
      required: true,
      index: true,
      options: [
        { label: 'Visita de Página', value: 'page_view' },
        { label: 'Clic', value: 'click' },
        { label: 'Conversión', value: 'conversion' },
      ],
    },
    {
      name: 'path',
      type: 'text',
      label: 'Ruta',
      required: true,
      index: true,
    },
    {
      name: 'label',
      type: 'text',
      label: 'Etiqueta / Elemento',
      required: true,
    },
    {
      name: 'bannerId',
      type: 'text',
      label: 'ID de Banner (Opcional)',
      index: true,
    },
    {
      name: 'section',
      type: 'text',
      label: 'Sección (Opcional)',
    },
    {
      name: 'device',
      type: 'select',
      enumName: 'enum_ae_dev',
      label: 'Dispositivo',
      required: true,
      defaultValue: 'desktop',
      options: [
        { label: 'Escritorio', value: 'desktop' },
        { label: 'Móvil', value: 'mobile' },
      ],
    },
  ],
}
