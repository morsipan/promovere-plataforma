import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
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
import { FullWidthImageBlock } from './blocks/FullWidthImage'
import { ImpactBannerBlock } from './blocks/ImpactBanner'

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
    livePreview: {
      url: ({ data, req }) => {
        const slug = data?.slug || 'home'
        const path = slug === 'home' ? '' : `/${slug}`

        // 1. Detectar dinámicamente el protocolo y host del editor en el admin
        if (req?.headers) {
          const headers = req.headers as any
          const host =
            typeof headers.get === 'function'
              ? headers.get('x-forwarded-host') || headers.get('host')
              : headers['x-forwarded-host'] || headers['host']
          const proto =
            (typeof headers.get === 'function'
              ? headers.get('x-forwarded-proto')
              : headers['x-forwarded-proto']) || (host?.includes('localhost') ? 'http' : 'https')
          if (host) {
            return `${proto}://${host}${path || '/'}`
          }
        }

        // 2. Vercel deployment URLs si están presentes en runtime
        if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
          return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}${path || '/'}`
        }
        if (process.env.VERCEL_URL) {
          return `https://${process.env.VERCEL_URL}${path || '/'}`
        }

        // 3. Fallback relativo (el navegador resuelve automáticamente el dominio actual)
        return path || '/'
      },
      breakpoints: [
        {
          label: 'Mobile (375px)',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet (768px)',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop (1440px)',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    update: ({ req: { user } }) => Boolean(user?.role && ['admin', 'editor'].includes(user.role)),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          const path = doc?.slug === 'home' ? '/' : `/${doc?.slug || ''}`;
          revalidatePath(path);
          if (doc?.slug === 'home') {
            revalidatePath('/');
          }
        } catch (e) { }
        return doc;
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          const path = doc?.slug === 'home' ? '/' : `/${doc?.slug || ''}`;
          revalidatePath(path);
        } catch (e) { }
        return doc;
      },
    ],
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
        FullWidthImageBlock,
        ImpactBannerBlock,
      ],
    },
  ],
}
