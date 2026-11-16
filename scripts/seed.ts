import { getPayload } from 'payload'
import config from '../payload.config'
import {
  servicesContent,
  representationsContent,
  partnersContent,
  distributionContent,
  contactContent,
  heroContent,
  siteConfig,
} from '../data/content'

async function seed() {
  console.log('🌱 Iniciando seed integral de datos para Promovêre...')

  try {
    const payload = await getPayload({ config })

    // 1. Usuarios con Control de Roles Estricto
    const usersToSeed = [
      {
        email: 'admin@promovere.com.ar',
        password: 'PromovereAdmin2026!',
        name: 'Lucas (Admin Promovêre)',
        role: 'admin' as const,
        company: 'Promovêre S.R.L.',
        phone: '+54 9 11 4587 6932',
        country: 'Argentina',
        verified: true,
      },
      {
        email: 'editor@promovere.com.ar',
        password: 'PromovereEditor2026!',
        name: 'Cata (Editora de Contenidos)',
        role: 'editor' as const,
        company: 'Promovêre S.R.L.',
        phone: '+54 9 11 4587 6932',
        country: 'Argentina',
        verified: true,
      },
      {
        email: 'mayorista@promovere.com.ar',
        password: 'PromovereMayorista2026!',
        name: 'Martín Gómez (Operador Mayorista)',
        role: 'mayorista' as const,
        company: 'Mayorista de Viajes Cono Sur',
        phone: '+54 9 11 5555 1111',
        country: 'Argentina',
        verified: true,
      },
      {
        email: 'minorista@promovere.com.ar',
        password: 'PromovereMinorista2026!',
        name: 'Sofía Rossi (Agencia Minorista)',
        role: 'minorista' as const,
        company: 'Agencia Boutique Travel',
        phone: '+54 9 11 5555 2222',
        country: 'Argentina',
        verified: true,
      },
    ]

    for (const user of usersToSeed) {
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: user.email } },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: user,
        })
        console.log(`✅ Usuario creado: ${user.email} (${user.role})`)
      } else {
        // Actualizar rol en caso de que existiera con rol previo
        await payload.update({
          collection: 'users',
          id: existing.docs[0].id,
          data: { role: user.role, name: user.name },
        })
        console.log(`🔄 Usuario actualizado: ${user.email} (${user.role})`)
      }
    }

    // 2. Contenido de Comunidad (Portal Privado)
    const communityItems = [
      {
        title: 'Manual de Ventas: Cadenas Hoteleras All-Inclusive Caribe 2026',
        category: 'manuales' as const,
        accessibleTo: 'all' as const,
        description:
          'Guía completa con especificaciones de propiedades, categorías de habitaciones, amenidades y argumentos de venta para clientes exigentes.',
        highlight: 'Imprescindible',
        downloadableFiles: [
          {
            name: 'Manual_Ventas_Caribe_2026.pdf',
            url: 'https://promovere.com.ar/docs/manual-caribe-2026.pdf',
            fileType: 'PDF' as const,
          },
          {
            name: 'Presentacion_Comercial_Caribe.pptx',
            url: 'https://promovere.com.ar/docs/presentacion-caribe.pptx',
            fileType: 'PPTX' as const,
          },
        ],
        featured: true,
      },
      {
        title: 'Estrategia de Emisión & Cupos Exclusivos Mayoristas Q1/Q2',
        category: 'promociones' as const,
        accessibleTo: 'mayorista' as const,
        description:
          'Detalles de acuerdos comerciales, fechas de release y coordinación de grupos cerrados para operadores mayoristas de la región.',
        highlight: 'Exclusivo Mayoristas',
        downloadableFiles: [
          {
            name: 'Condiciones_Cupos_Mayoristas_2026.pdf',
            url: 'https://promovere.com.ar/docs/cupos-mayoristas.pdf',
            fileType: 'PDF' as const,
          },
        ],
        featured: true,
      },
      {
        title: 'Kit de Redes Sociales & Piezas Gráficas para Mostrador',
        category: 'marketing' as const,
        accessibleTo: 'minorista' as const,
        description:
          'Plantillas editables, creatividades para Instagram/Facebook y folletos listos para imprimir y entregar al pasajero en agencia.',
        highlight: 'Kit para Agencias',
        downloadableFiles: [
          {
            name: 'Social_Media_Kit_Instagram_Stories.zip',
            url: 'https://promovere.com.ar/assets/social-kit.zip',
            fileType: 'ZIP' as const,
          },
        ],
        featured: false,
      },
    ]

    for (const item of communityItems) {
      const existing = await payload.find({
        collection: 'community-content',
        where: { title: { equals: item.title } },
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'community-content',
          data: item,
        })
        console.log(`✅ Contenido de comunidad creado: ${item.title} (${item.accessibleTo})`)
      }
    }

    // 3. One Page Principal (Home) 100% Administrable con Bloques
    const homeLayout = [
      {
        blockType: 'hero' as const,
        badge: heroContent.badge,
        title: heroContent.title,
        subtitle: heroContent.subtitle,
        cta1Label: heroContent.cta1.label,
        cta1Href: heroContent.cta1.href,
        cta2Label: heroContent.cta2.label,
        cta2Href: '/comunidad/login',
        backgroundImage: heroContent.backgroundImage,
      },
      {
        blockType: 'services' as const,
        badge: servicesContent.badge,
        title: servicesContent.title,
        subtitle: servicesContent.subtitle,
        servicesList: servicesContent.services.map((s) => ({
          title: s.title,
          subtitle: s.subtitle,
          description: s.description,
          icon: s.icon as any,
          highlights: s.highlights.map((h) => ({ item: h })),
        })),
      },
      {
        blockType: 'representations' as const,
        badge: representationsContent.badge,
        title: representationsContent.title,
        subtitle: representationsContent.subtitle,
        items: representationsContent.items.map((r) => ({
          title: r.title,
          brand: r.brand,
          country: r.country,
          category: r.category,
          tag: r.tag,
          description: r.description,
          image: r.image,
        })),
      },
      {
        blockType: 'distribution' as const,
        badge: distributionContent.badge,
        title: distributionContent.title,
        subtitle: distributionContent.subtitle,
        cta1Label: distributionContent.cta1.label,
        cta1Href: distributionContent.cta1.href,
        cta2Label: distributionContent.cta2.label,
        cta2Href: distributionContent.cta2.href,
        stats: distributionContent.stats.map((st) => ({
          value: st.value,
          label: st.label,
        })),
        channels: [
          {
            title: 'Operadores Mayoristas',
            description: 'Canal de comercialización directo con líderes del trade regional.',
            coverage: 'Cono Sur, Región Andina y Centroamérica',
          },
          {
            title: 'Red de Agencias Minoristas',
            description: 'Capacitaciones continuas, webinars y provisión de material comercial.',
            coverage: '+1.200 agencias activas',
          },
        ],
      },
      {
        blockType: 'partners' as const,
        badge: partnersContent.badge,
        title: partnersContent.title,
        subtitle: partnersContent.subtitle,
        partnersList: partnersContent.partners.map((p) => ({
          name: p.name,
          category: p.category,
          description: p.description,
          initials: p.initials,
        })),
      },
      {
        blockType: 'contact' as const,
        badge: contactContent.badge,
        title: contactContent.title,
        subtitle: contactContent.subtitle,
        email: siteConfig.email,
        phone: siteConfig.phone,
        address: siteConfig.address,
        addressDetail: siteConfig.addressDetail,
        schedule: 'Lunes a Viernes 09:00 - 18:00 (GMT-3)',
      },
    ] as any

    const existingPage = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    if (existingPage.docs.length === 0) {
      await payload.create({
        collection: 'pages',
        data: {
          title: 'Inicio — One Page Promovêre',
          slug: 'home',
          layout: homeLayout,
        },
      })
      console.log('✅ Página principal (home) creada con los bloques completos de la One Page')
    } else {
      await payload.update({
        collection: 'pages',
        id: existingPage.docs[0].id,
        data: {
          layout: homeLayout,
        },
      })
      console.log('🔄 Página principal (home) actualizada con los bloques completos y administrables')
    }

    console.log('\n✨ Seed integral completado con éxito.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error)
    process.exit(1)
  }
}

seed()
