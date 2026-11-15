import { getPayload } from 'payload'
import config from '../payload.config'

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

    // 3. Página One Page (Pages)
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
          layout: [
            {
              blockType: 'hero',
              badge: 'Especialistas en Promoción Turística en LATAM',
              title: 'Somos Promovêre',
              subtitle:
                'Impulsamos la presencia comercial, el posicionamiento y las ventas de destinos, hoteles y marcas turísticas de clase mundial en los mercados más dinámicos de América Latina.',
              cta1Label: 'Nuestras Representaciones',
              cta1Href: '#representaciones',
              cta2Label: 'Comunidad Promovêre',
              cta2Href: '/comunidad/login',
              backgroundImage:
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
            },
            {
              blockType: 'services',
              badge: 'Nuestros Servicios',
              title: 'Solución integral para tu marca turística',
              subtitle:
                'Ecosistema estratégico 360° para comercializar, posicionar y expandir marcas turísticas internacionales en el trade y público final de América Latina.',
              servicesList: [
                {
                  title: 'Representaciones Turísticas (Vê REPS®)',
                  subtitle: 'Gestión comercial activa',
                  description:
                    'Desarrollo y ejecución del plan comercial integral en mercados emisores de LATAM.',
                  icon: 'Briefcase',
                  highlights: [
                    { item: 'Fuerza de ventas dedicada' },
                    { item: 'Negociación con operadores clave' },
                  ],
                },
              ],
            },
            {
              blockType: 'representations',
              badge: 'Nuestras Representaciones',
              title: 'Marcas y Destinos de Excelencia',
              subtitle:
                'Cadenas hoteleras y marcas internacionales que confían en Promovêre.',
              items: [],
            },
            {
              blockType: 'partners',
              badge: 'Nuestros Aliados',
              title: 'Empresas y Cadenas que Confían en Nosotros',
              subtitle:
                'Trabajamos con los operadores mayoristas más prestigiosos de la región.',
              partnersList: [],
            },
            {
              blockType: 'contact',
              badge: 'Conversemos',
              title: '¿Listo para expandir tu presencia turística en LATAM?',
              subtitle:
                'Nuestro equipo está a disposición para coordinar acciones estratégicas.',
              email: 'marketing@promovere.com.ar',
              phone: '+54 9 11 4587 6932',
              address: 'Av. Roque Sáenz Peña 720',
              addressDetail: 'Piso 6 - Of AB, CABA, Argentina',
            },
          ],
        },
      })
      console.log('✅ Página principal (home) creada con los bloques de la One Page')
    }

    console.log('\n✨ Seed integral completado con éxito.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error)
    process.exit(1)
  }
}

seed()
