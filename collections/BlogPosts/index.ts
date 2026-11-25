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

const isInternalTeam = ({ req: { user } }: { req: { user?: any } }) =>
  Boolean(user?.role && ['admin', 'editor'].includes(user.role))

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Artículo de Blog',
    plural: 'Blog',
  },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'category', 'publishedDate', 'status'],
    group: 'News',
    description:
      'Blog propio de Promovêre: novedades institucionales, lanzamientos y actualizaciones de las marcas representadas.',
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
          revalidatePath('/blog')
        } catch {}
        return doc
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/')
          revalidatePath('/blog')
        } catch {}
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título del Artículo',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumen / Bajada',
      required: true,
      admin: {
        description: 'Bajada breve que se muestra en las tarjetas del Blog y en la Home.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Contenido Completo',
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
          label: 'Imagen de Portada (Media)',
          admin: { width: '50%' },
        },
        {
          name: 'coverImageUrl',
          type: 'text',
          label: 'URL de Imagen Externa (Respaldo opcional)',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Enlace Externo Relacionado (Opcional)',
    },
    // Campos en Sidebar
    {
      name: 'status',
      type: 'select',
      enumName: 'enum_blog_st',
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
      label: 'Fecha de Publicación',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL amigable)',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Categoría Editorial',
      defaultValue: 'Novedades',
      admin: { position: 'sidebar' },
    },
    {
      name: 'brand',
      type: 'text',
      label: 'Marca / Destino Asociado',
      defaultValue: 'Promovêre',
      admin: { position: 'sidebar' },
    },
  ],
}
