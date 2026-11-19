import type { Access, CollectionConfig, Where } from 'payload'

const canReadPromotions: Access = ({ req: { user } }) => {
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

const canManagePromotions: Access = ({ req: { user } }) => {
  return Boolean(user?.role && ['admin', 'editor'].includes(user.role))
}

export const CommunityPromotions: CollectionConfig = {
  slug: 'community-promotions',
  labels: {
    singular: 'Promoción / Incentivo Trade',
    plural: 'Promociones e Incentivos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'promoType', 'benefitBadge', 'validUntil', 'status'],
    group: 'Comunidad Trade',
    description:
      'Promociones vigentes, comisiones especiales, incentivos de venta y Fam Trips con control automático de vigencia.',
  },
  access: {
    read: canReadPromotions,
    create: canManagePromotions,
    update: canManagePromotions,
    delete: canManagePromotions,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Promoción o Incentivo',
      required: true,
      admin: {
        description: 'Ej: Early Booking Verano 2026 — Hasta 35% OFF + Noches Libres.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'promoType',
          type: 'select',
          enumName: 'enum_cp_type',
          label: 'Tipo de Beneficio',
          required: true,
          defaultValue: 'descuento',
          options: [
            { label: 'Descuento Especial', value: 'descuento' },
            { label: 'Comisión Extra', value: 'comision' },
            { label: 'Incentivo por Ventas', value: 'incentivo' },
            { label: 'Fam Trip / Cupo Especial', value: 'fam_trip' },
            { label: 'Early Booking / Preventa', value: 'early_booking' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'benefitBadge',
          type: 'text',
          label: 'Etiqueta de Beneficio Destacado',
          admin: {
            width: '50%',
            description: 'Ej: +2% Comisión, Hasta 35% OFF, Cupos Limitados.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción de la Promoción',
      required: true,
    },
    {
      name: 'conditions',
      type: 'textarea',
      label: 'Condiciones / Ventana de Viaje (Opcional)',
      admin: {
        description: 'Ej: Válido para reservas emitidas hasta el 30/06. Aplica a estadías mínimas de 4 noches.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'validFrom',
          type: 'date',
          label: 'Vigente Desde (Opcional)',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
          },
        },
        {
          name: 'validUntil',
          type: 'date',
          label: 'Vigente Hasta',
          required: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'dd/MM/yyyy',
            },
            description: 'El portal calculará automáticamente los días restantes y marcará vencimiento.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Texto del Botón CTA',
          defaultValue: 'Consultar Promoción',
          admin: { width: '40%' },
        },
        {
          name: 'ctaUrl',
          type: 'text',
          label: 'Enlace del CTA (Reserva, WhatsApp, Tally o Email)',
          admin: {
            width: '60%',
            description: 'Ej: https://wa.me/... o mailto:reservas@...',
          },
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen / Flyer de la Promoción (Opcional)',
    },
    {
      name: 'visibleFor',
      type: 'select',
      enumName: 'enum_cp_vis',
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
      label: 'Marca / Representación Asociada',
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_cp_status',
      label: 'Estado',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Publicada (Visible)', value: 'active' },
        { label: 'Borrador / Pausada', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar Promoción',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
