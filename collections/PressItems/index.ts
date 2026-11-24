import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

const isInternalTeam = ({ req: { user } }: { req: { user?: any } }) =>
  Boolean(user?.role && ['admin', 'editor'].includes(user.role))

export const PressItems: CollectionConfig = {
  slug: 'press-items',
  labels: {
    singular: 'Cobertura de Prensa',
    plural: 'Prensa',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaOutlet', 'format', 'publishedDate', 'status'],
    group: 'Sitios',
    description:
      'Sección unificada de Prensa: gestioná notas en medios externos, entrevistas y coberturas en video.',
  },
  access: {
    read: () => true,
    create: isInternalTeam,
    update: isInternalTeam,
    delete: isInternalTeam,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/prensa')
        } catch {}
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/prensa')
        } catch {}
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titular de la Nota o Entrevista',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mediaOutlet',
          type: 'text',
          label: 'Medio / Fuente',
          required: true,
          admin: {
            width: '55%',
            description: 'Ej: Ladevi Medios, Mensajero Turístico, Trade TV.',
          },
        },
        {
          name: 'format',
          type: 'select',
          enumName: 'enum_press_fmt',
          label: 'Tipo de Cobertura',
          required: true,
          defaultValue: 'nota',
          options: [
            { label: 'Nota en Medio Externo', value: 'nota' },
            { label: 'Entrevista / Cobertura en Video', value: 'video' },
          ],
          admin: { width: '45%' },
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Resumen de la Cobertura',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'articleUrl',
          type: 'text',
          label: 'Enlace a Nota Externa (si es Nota)',
          admin: { width: '45%' },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'URL de Video YouTube / Vimeo (si es Video)',
          admin: { width: '40%' },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duración (ej: 08:30)',
          admin: { width: '15%' },
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
          label: 'Imagen / Miniatura (Media)',
          admin: { width: '50%' },
        },
        {
          name: 'coverImageUrl',
          type: 'text',
          label: 'URL de Imagen / Miniatura (Respaldo opcional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'mediaFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Archivo / Media Adjunto (Opcional)',
      admin: {
        description: 'PDF de recorte de prensa, dossier o archivo multimedia descargable.',
      },
    },
    // Campos en Sidebar
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_press_st',
      label: 'Estado de Publicación',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Publicado', value: 'published' },
        { label: 'Borrador', value: 'draft' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Fecha de Cobertura',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
  ],
}
