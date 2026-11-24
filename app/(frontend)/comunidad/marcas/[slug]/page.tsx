import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  Images,
  Mail,
  MessageCircle,
  Lock,
  Sparkles,
  Calendar,
  FolderOpen,
  ArrowRight,
  Clock,
  Shield,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventRegisterActions from '@/components/comunidad/EventRegisterActions';
import { getMediaUrl } from '@/lib/media';
import { matchesBrandSlug, getBrandSlug } from '@/lib/brands';
import { representationsContent } from '@/data/content';

export const dynamic = 'force-dynamic';

interface BrandLandingPageProps {
  params: Promise<{ slug: string }>;
}

const MONTHS_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function formatDateUtc(dateIso?: string | null): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = MONTHS_ES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

async function resolveBrand(slug: string) {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'representations',
      where: { status: { equals: 'active' } },
      depth: 1,
      limit: 100,
    });
    const matched = (docs || []).find((doc: any) => matchesBrandSlug(doc, slug));
    if (matched) {
      return { brand: matched as any, allBrands: docs as any[], fromCms: true };
    }
  } catch {}

  const fallbackMatched = representationsContent.items.find((item) =>
    matchesBrandSlug(item, slug)
  );
  if (fallbackMatched) {
    return {
      brand: {
        ...fallbackMatched,
        coverImageUrl: fallbackMatched.image,
        contactEmail: 'marketing@promovere.com.ar',
      } as any,
      allBrands: representationsContent.items as any[],
      fromCms: false,
    };
  }

  return null;
}

export async function generateMetadata({ params }: BrandLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = await resolveBrand(slug);
  if (!found) {
    return { title: 'Marca no encontrada — Comunidad Promovêre' };
  }
  return {
    title: `${found.brand.brand} — Comunidad Promovêre`,
    description: found.brand.description,
  };
}

export default async function BrandLandingPage({ params }: BrandLandingPageProps) {
  const { slug } = await params;
  const found = await resolveBrand(slug);

  if (!found) {
    notFound();
  }

  const { brand, allBrands, fromCms } = found;

  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;
  let currentUser: any = null;
  let brandEvents: any[] = [];
  let brandPrivateResources: any[] = [];
  let registeredEventIds = new Set<string>();

  try {
    const payload = await getPayload({ config });
    const headersList = await headers();
    const authRes = await payload.auth({ headers: headersList }).catch(() => ({ user: null }));
    currentUser = authRes?.user || null;

    const [headerRes, footerRes, settingsRes] = await Promise.all([
      payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
      payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    ]);

    headerData = headerRes;
    footerData = footerRes;
    siteSettings = settingsRes;

    // Si el usuario está autenticado, cargamos eventos y recursos privados respetando RBAC estricto
    if (fromCms && brand.id && currentUser) {
      const [eventsRes, contentRes, regsRes] = await Promise.all([
        payload
          .find({
            collection: 'community-events',
            where: {
              and: [
                { representation: { equals: brand.id } },
                { status: { equals: 'active' } },
              ],
            },
            user: currentUser,
            overrideAccess: false,
            depth: 1,
            sort: 'eventDate',
            limit: 10,
          })
          .catch(() => ({ docs: [] })),
        payload
          .find({
            collection: 'community-content',
            where: {
              representation: { equals: brand.id },
            },
            user: currentUser,
            overrideAccess: false, // Aplica canReadCommunityContent: minorista NUNCA ve contratos
            depth: 1,
            limit: 12,
          })
          .catch(() => ({ docs: [] })),
        payload
          .find({
            collection: 'event-registrations',
            where: {
              and: [
                { user: { equals: currentUser.id } },
                { status: { equals: 'registered' } },
              ],
            },
            limit: 100,
            overrideAccess: true,
          })
          .catch(() => ({ docs: [] })),
      ]);

      brandEvents = eventsRes?.docs || [];
      brandPrivateResources = contentRes?.docs || [];
      registeredEventIds = new Set(
        (regsRes?.docs || []).map((r: any) =>
          String(typeof r.event === 'object' && r.event !== null ? r.event.id : r.event)
        )
      );
    }
  } catch (err) {
    console.error('Error cargando landing de marca:', err);
  }

  const coverSrc =
    getMediaUrl(brand.coverImage) ||
    brand.coverImageUrl ||
    '/assets/WebP/hero-bg-promovere.webp';
  const logoSrc = getMediaUrl(brand.logo);
  const contactEmail = brand.contactEmail || 'marketing@promovere.com.ar';
  const contactWhatsapp = brand.contactWhatsapp?.trim() || '';

  const otherBrands = allBrands
    .filter((b: any) => String(b.id) !== String(brand.id))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      <Navbar data={headerData} />

      {/* HERO DE MARCA (ACCESO LIBRE) */}
      <section className="relative pt-28 pb-16 sm:pb-20 bg-[#4d4e4f] text-white overflow-hidden">
        <img
          src={coverSrc}
          alt={brand.brand}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4d4e4f] via-[#4d4e4f]/75 to-[#4d4e4f]/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Link
              href="/comunidad/marcas"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#f9f9f9]/85 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Catálogo de Marcas</span>
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-xs font-semibold text-[#3cac59]">{brand.brand}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              {logoSrc ? (
                <div className="inline-block bg-white/95 rounded-2xl px-4 py-2.5 shadow-lg mb-5">
                  <img
                    src={logoSrc}
                    alt={brand.brand}
                    className="h-10 w-auto max-w-[180px] object-contain"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-[#3cac59]" />
                  <span>{brand.category}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b87c7] text-white text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {brand.country}
                    {brand.title && brand.title !== brand.country ? ` · ${brand.title}` : ''}
                  </span>
                </span>
                {brand.tag ? (
                  <span className="px-3 py-1 rounded-full bg-[#3cac59] text-white text-xs font-bold">
                    {brand.tag}
                  </span>
                ) : null}
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                {brand.brand}
              </h1>

              <p className="text-base sm:text-lg text-[#f9f9f9]/90 leading-relaxed max-w-2xl">
                {brand.description}
              </p>
            </div>

            {/* Acciones públicas rápidas de la marca */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {brand.mediaKitUrl ? (
                <a
                  href={brand.mediaKitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#3cac59] hover:bg-[#2d8d45] text-white font-bold text-sm shadow-lg transition-all"
                >
                  <Images className="w-4 h-4" />
                  <span>Abrir Banco de Fotos / Media Kit</span>
                </a>
              ) : null}

              {brand.websiteUrl ? (
                <a
                  href={brand.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-bold text-sm transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Sitio Web Oficial</span>
                </a>
              ) : null}

              {contactWhatsapp ? (
                <a
                  href={contactWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold text-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contacto Comercial WhatsApp</span>
                </a>
              ) : (
                <a
                  href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                    `Consulta Trade — ${brand.brand}`
                  )}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold text-sm transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Consultar con el Equipo Trade</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CUERPO: ZONA PRIVADA (RESPETANDO SESIÓN Y ROL) + EVENTOS DE LA MARCA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Aviso institucional B2B (sin tarifas públicas) */}
          <div className="rounded-2xl bg-white border border-gray-200/80 p-5 flex items-start gap-3.5 shadow-xs">
            <Shield className="w-5 h-5 text-[#3cac59] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-[#4d4e4f]/85 leading-relaxed">
              <strong>Representación Oficial B2B en LATAM:</strong> Promovêre no publica tarifas ni
              precios al público. Esta landing es de acceso libre para agencias y operadores; las
              herramientas comerciales y acuerdos específicos se muestran según sesión y perfil de
              Comunidad.
            </p>
          </div>

          {currentUser ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Herramientas privadas de esta marca (filtradas por RBAC) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1b87c7] mb-1">
                      <FolderOpen className="w-4 h-4" />
                      <span>Herramientas Privadas ({String(currentUser.role || 'trade')})</span>
                    </span>
                    <h2 className="font-heading text-2xl font-bold text-[#4d4e4f]">
                      Recursos Disponibles para {brand.brand}
                    </h2>
                  </div>
                  <Link
                    href="/comunidad/dashboard#herramientas"
                    className="text-xs font-bold text-[#1b87c7] hover:underline"
                  >
                    Ver panel completo →
                  </Link>
                </div>

                {brandPrivateResources.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm font-semibold text-[#4d4e4f]">
                      Todavía no hay recursos privados asociados directamente a esta marca para tu
                      perfil.
                    </p>
                    <Link
                      href="/comunidad/dashboard"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#1b87c7] hover:underline"
                    >
                      <span>Explorar todas las herramientas en el Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {brandPrivateResources.map((item: any) => (
                      <div
                        key={String(item.id)}
                        className="bg-white rounded-2xl border border-gray-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div>
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#1b87c7]/10 text-[#1b87c7] text-[11px] font-bold uppercase mb-1.5">
                            {item.highlight || item.category}
                          </span>
                          <h3 className="font-heading text-lg font-bold text-[#4d4e4f]">
                            {item.title}
                          </h3>
                        </div>
                        {item.externalUrl ? (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b87c7] text-white text-xs font-bold shrink-0"
                          >
                            <span>{item.ctaLabel || 'Abrir recurso'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <Link
                            href="/comunidad/dashboard#herramientas"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f9f9f9] border border-gray-200 text-[#4d4e4f] text-xs font-bold shrink-0"
                          >
                            <span>Ver en Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Webinars y FAM Tours de esta marca con Inscripción en 1 Clic + Google Calendar */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Agenda de la Marca</span>
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-[#4d4e4f]">
                    Webinars & FAM Tours
                  </h2>
                </div>

                {brandEvents.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 text-center">
                    <p className="text-xs sm:text-sm text-[#4d4e4f]/75">
                      No hay webinars ni FAM Tours programados para esta marca en este momento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {brandEvents.map((ev: any) => (
                      <article
                        key={String(ev.id)}
                        className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#3cac59]/10 text-[#266f39] font-bold uppercase">
                            {ev.modality === 'fam_trip' ? 'FAM Tour' : ev.modality}
                          </span>
                          {ev.eventDate ? (
                            <span className="inline-flex items-center gap-1 text-[#4d4e4f]/70 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-[#1b87c7]" />
                              <span>{formatDateUtc(ev.eventDate)}</span>
                            </span>
                          ) : null}
                        </div>
                        <h3 className="font-heading text-lg font-bold text-[#4d4e4f]">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[#4d4e4f]/80 leading-relaxed line-clamp-3">
                          {ev.description}
                        </p>
                        <EventRegisterActions
                          eventId={ev.id}
                          title={ev.title}
                          modality={ev.modality}
                          eventDate={ev.eventDate}
                          description={ev.description}
                          locationOrPlatform={ev.locationOrPlatform}
                          registrationUrl={ev.registrationUrl}
                          initialRegistered={registeredEventIds.has(String(ev.id))}
                          isAuthenticated={true}
                          compact
                        />
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Bloque de acceso protegido cuando el visitante aún no inició sesión */
            <div className="rounded-3xl bg-white border border-gray-200/90 p-8 sm:p-10 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b87c7]/10 text-[#1b87c7] text-xs font-bold uppercase tracking-wider mb-3">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Área Privada de Comunidad</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#4d4e4f] mb-2">
                  Accedé a herramientas privadas y capacitación en 1 clic de {brand.brand}
                </h2>
                <p className="text-sm text-[#4d4e4f]/80 leading-relaxed">
                  Iniciá sesión con tu cuenta de agencia minorista u operador mayorista para
                  descargar fichas técnicas, inscribirte en 1 clic a webinars y FAM Tours, y
                  consultar los acuerdos comerciales habilitados para tu perfil.
                </p>
              </div>
              <Link
                href="/comunidad/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold text-sm shadow-md transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#3cac59]" />
                <span>Iniciar Sesión en Comunidad</span>
              </Link>
            </div>
          )}

          {/* Otras marcas del catálogo libre */}
          {otherBrands.length > 0 ? (
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-[#4d4e4f]">
                  Otras Marcas Representadas
                </h2>
                <Link
                  href="/comunidad/marcas"
                  className="text-xs sm:text-sm font-bold text-[#1b87c7] hover:underline"
                >
                  Ver todas las marcas →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherBrands.map((item: any) => (
                  <Link
                    key={String(item.id)}
                    href={`/comunidad/marcas/${getBrandSlug(item)}`}
                    className="group bg-white rounded-2xl border border-gray-200/80 hover:border-[#1b87c7]/50 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3cac59]">
                        {item.country}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-[#4d4e4f] group-hover:text-[#1b87c7] transition-colors mt-1 mb-2">
                        {item.brand}
                      </h3>
                      <p className="text-xs text-[#4d4e4f]/75 line-clamp-2">{item.description}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1b87c7]">
                      <span>Ver landing de marca</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
