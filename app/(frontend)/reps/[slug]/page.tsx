import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogRichText from '@/components/blocks/BlogRichText';
import { getMediaUrl } from '@/lib/media';

export const revalidate = 3600;

interface RepPageProps {
  params: Promise<{ slug: string }>;
}

function normalizeRepSlug(raw: string): string {
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  return decoded
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchPublishedRep(rawSlug: string) {
  const normalized = normalizeRepSlug(rawSlug);
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: 'representations',
      where: {
        and: [
          {
            or: [{ slug: { equals: normalized } }, { slug: { equals: rawSlug } }],
          },
          { isPublished: { equals: true } },
        ],
      },
      depth: 1,
      limit: 1,
    });
    return (res.docs?.[0] as any) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: RepPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rep = await fetchPublishedRep(slug);

  if (!rep) {
    return {
      title: 'Representación no disponible — Promovêre',
    };
  }

  const imageUrl = getMediaUrl(rep.coverImage, rep.coverImageUrl || '');
  const brandTitle = rep.brand || rep.title;

  return {
    title: `${brandTitle} — Nuestras REPS | Promovêre`,
    description:
      rep.description ||
      `${brandTitle}, representación oficial de Promovêre para el trade turístico de América Latina.`,
    openGraph: {
      title: `${brandTitle} — Nuestras REPS | Promovêre`,
      description: rep.description || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function RepDetailPage({ params }: RepPageProps) {
  const { slug } = await params;

  let headerData: any = null;
  let footerData: any = null;
  let siteSettings: any = null;

  const [rep] = await Promise.all([
    fetchPublishedRep(slug),
    (async () => {
      try {
        const payload = await getPayload({ config });
        const [headerRes, footerRes, settingsRes] = await Promise.all([
          payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'footer', depth: 1 }).catch(() => null),
          payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
        ]);
        headerData = headerRes;
        footerData = footerRes;
        siteSettings = settingsRes;
      } catch {}
    })(),
  ]);

  // Si la Rep está despublicada (isPublished: false) o no existe, devolver 404 limpio
  if (!rep || rep.isPublished !== true) {
    notFound();
  }

  const coverUrl = getMediaUrl(rep.coverImage, rep.coverImageUrl || '');
  const logoUrl = getMediaUrl(rep.logo, '');
  const brandTitle = rep.brand || rep.title;

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#4d4e4f] font-sans">
      <Navbar data={headerData} />

      {/* Encabezado de la Rep */}
      <header className="pt-28 pb-14 sm:pb-16 bg-[#4d4e4f] text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1b87c7]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#3cac59]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#representaciones"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#f9f9f9]/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Nuestras REPS</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            {rep.category ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b87c7]/25 border border-[#1b87c7]/40 text-[#f9f9f9] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[#3cac59]" />
                <span>{rep.category}</span>
              </span>
            ) : null}

            {rep.tag ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3cac59]/20 border border-[#3cac59]/40 text-[#3cac59] text-xs font-bold">
                <span>{rep.tag}</span>
              </span>
            ) : null}

            {rep.country ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f9f9f9]/85">
                <MapPin className="w-3.5 h-3.5 text-[#3cac59]" />
                <span>{rep.country}</span>
              </span>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {logoUrl ? (
              <div className="relative w-20 h-20 rounded-2xl bg-white p-3 shadow-md shrink-0 flex items-center justify-center">
                <Image
                  src={logoUrl}
                  alt={`Logo ${brandTitle}`}
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </div>
            ) : null}

            <div>
              <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
                {brandTitle}
              </h1>
              {rep.description ? (
                <p className="text-base sm:text-lg text-[#f9f9f9]/85 leading-relaxed max-w-3xl">
                  {rep.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido de la Rep (sin tarifas ni precios públicos) */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
            {coverUrl ? (
              <div className="relative w-full aspect-[16/9] max-h-[460px] bg-[#4d4e4f]/10 overflow-hidden">
                <Image
                  src={coverUrl}
                  alt={brandTitle}
                  fill
                  unoptimized
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            ) : null}

            <div className="p-6 sm:p-10 md:p-12">
              <BlogRichText content={rep.content} fallbackText={rep.description} />

              {/* Acciones comerciales B2B sin precios públicos */}
              <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap items-center gap-3">
                <Link
                  href="/comunidad"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#3cac59]" />
                  <span>Acceder a Comunidad Trade</span>
                </Link>

                {rep.websiteUrl ? (
                  <a
                    href={rep.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4d4e4f] hover:bg-[#38393a] text-white text-xs sm:text-sm font-bold transition-colors"
                  >
                    <Globe className="w-4 h-4 text-[#3cac59]" />
                    <span>Sitio web oficial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : null}

                {rep.contactEmail ? (
                  <a
                    href={`mailto:${rep.contactEmail}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-[#f9f9f9] hover:bg-gray-100 text-[#4d4e4f] text-xs sm:text-sm font-bold transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#1b87c7]" />
                    <span>Contacto comercial</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer data={footerData} settings={siteSettings} />
    </main>
  );
}
