import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
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

export const Representations: CollectionConfig = {
  slug: 'representations',
  labels: {
    singular: 'Marca / Rep',
    plural: 'Marcas y reps',
  },
  defaultSort: 'order',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['brand', 'slug', 'country', 'isPublished', 'status', 'order'],
    group: 'Comunidad',
    description:
      'Catálogo oficial de Reps y marcas representadas por Promovêre. Controla su publicación en la Home (/reps/[slug]) y en Comunidad.',
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/reps', 'layout')
        } catch {}
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/reps', 'layout')
        } catch {}
        return doc
      },
    ],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    delete: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Destino o Título Principal',
          required: true,
          admin: {
            width: '50%',
            description: 'Ej: Cuba, México, Grecia, Islas Caimán, Estados Unidos.',
          },
        },
        {
          name: 'brand',
          type: 'text',
          label: 'Marca / Cadena / Entidad',
          required: true,
          admin: {
            width: '50%',
            description: 'Ej: Gaviota Hoteles, Atelier de Hoteles, Hellenic Travel Network.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'country',
          type: 'text',
          label: 'País / Región',
          required: true,
          admin: { width: '33.3%' },
        },
        {
          name: 'category',
          type: 'select',
          enumName: 'enum_rep_category',
          label: 'Categoría',
          required: true,
          defaultValue: 'Destino & Hotelería',
          options: [
            { label: 'Destino & Hotelería', value: 'Destino & Hotelería' },
            { label: 'DMC & Circuitos', value: 'DMC & Circuitos' },
            { label: 'Destino de Ultra-Lujo', value: 'Destino de Ultra-Lujo' },
            { label: 'Destino & Lujo All-Inclusive', value: 'Destino & Lujo All-Inclusive' },
            { label: 'Receptivo & Circuitos', value: 'Receptivo & Circuitos' },
            { label: 'Cadena Hotelera', value: 'Cadena Hotelera' },
            { label: 'Cruceros & Navieras', value: 'Cruceros & Navieras' },
            { label: 'Otro', value: 'Otro' },
          ],
          admin: { width: '33.3%' },
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Etiqueta Destacada (Badge)',
          admin: {
            width: '33.3%',
            description: 'Ej: Caribe Histórico, Mediterráneo & Islas.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Resumen / Descripción Comercial',
      required: true,
      admin: {
        description:
          'Resumen de la propuesta de valor y diferencial para el trade turístico (sin tarifas ni precios públicos).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido de la Página de la Rep (/reps/[slug])',
      admin: {
        description:
          'Contenido editorial de la página pública de la Rep (nunca incluir tarifas ni precios públicos).',
      },
      editor: lexicalEditor({
        features: () => [
          ParagraphFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({ enabledCollections: ['media'] }),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
    },
    {
      type: 'row',
      fields: [
        {
          name: 'coverImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de Portada (Upload)',
          admin: {
            width: '50%',
            description: 'Foto principal en alta resolución para la tarjeta del destino/marca.',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logotipo Oficial de la Marca (Opcional)',
          admin: {
            width: '50%',
            description: 'PNG o SVG con fondo transparente.',
          },
        },
      ],
    },
    {
      name: 'coverImageUrl',
      type: 'text',
      label: 'URL de Imagen de Portada Externa (Respaldo)',
      admin: {
        description: 'Se utiliza automáticamente si no se subió una imagen en el campo anterior.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'websiteUrl',
          type: 'text',
          label: 'Sitio Web Oficial (Opcional)',
          admin: { width: '50%' },
        },
        {
          name: 'mediaKitUrl',
          type: 'text',
          label: 'Banco de Fotos / Media Kit (URL Drive/Dropbox)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contactEmail',
          type: 'email',
          label: 'Email de Contacto Comercial',
          defaultValue: 'marketing@promovere.com.ar',
          admin: { width: '50%' },
        },
        {
          name: 'contactWhatsapp',
          type: 'text',
          label: 'Enlace WhatsApp Comercial (Opcional)',
          admin: {
            width: '50%',
            description: 'Ej: https://wa.me/5491112345678',
          },
        },
      ],
    },
    // Sidebar metadata
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Publicado (visible en Home y /reps/[slug])',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Si se desmarca, la Rep desaparece automáticamente de la Home y su página /reps/[slug] devuelve 404.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL pública /reps/[slug])',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Ej: caribe-mexicano, atelier-de-hoteles, hoteles-solaris.',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'URL de Origen (Referencia)',
      admin: {
        position: 'sidebar',
        description: 'URL de referencia de la web anterior para trazabilidad.',
      },
    },
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_rep_status',
      label: 'Estado',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Activa (Visible en Portal)', value: 'active' },
        { label: 'Borrador / Pausada', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacar en Dashboard',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Orden de Visualización',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Menor número aparece primero.',
      },
    },
  ],
}
