import type { CollectionConfig } from 'payload'
import { HeroBlock } from './blocks/Hero'
import { ServicesBlock } from './blocks/Services'
import { RepresentationsBlock } from './blocks/Representations'
import { DistributionBlock } from './blocks/Distribution'
import { PartnersBlock } from './blocks/Partners'
import { ContactBlock } from './blocks/Contact'
import { FAQBlock } from './blocks/FAQ'
import { TestimonialsBlock } from './blocks/Testimonials'
import { CtaBannerBlock } from './blocks/CtaBanner'
import { StatsBlock } from './blocks/Stats'
import { GalleryBlock } from './blocks/Gallery'
import { TimelineBlock } from './blocks/Timeline'
import { RichTextBlock } from './blocks/RichTextBlock'
import { PromovereAnimCounterBlock } from './blocks/PromovereAnimCounter'
import { CommunityLandingBlock } from './blocks/CommunityLanding'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Página',
    plural: 'Páginas',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Web Pública',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Página',
      required: true,
      defaultValue: 'Inicio — One Page Promovêre',
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug / URL',
      required: true,
      unique: true,
      index: true,
      defaultValue: 'home',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Bloques de Contenido de la Página',
      required: true,
      blocks: [
        HeroBlock,
        ServicesBlock,
        RepresentationsBlock,
        DistributionBlock,
        PartnersBlock,
        ContactBlock,
        FAQBlock,
        TestimonialsBlock,
        CtaBannerBlock,
        StatsBlock,
        GalleryBlock,
        TimelineBlock,
        RichTextBlock,
        PromovereAnimCounterBlock,
        CommunityLandingBlock,
      ],
    },
  ],
}
