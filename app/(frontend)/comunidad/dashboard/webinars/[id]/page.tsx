import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Building2,
  Download,
  ArrowUpRight,
  PlayCircle,
  Video,
  Sparkles,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';
import EventRegisterActions from '@/components/comunidad/EventRegisterActions';

export const dynamic = 'force-dynamic';

function getVideoEmbedUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const url = rawUrl.trim();
  if (!url) return null;

  // YouTube watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  }

  // Vimeo vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

function formatDateAR(dateIso?: string | null): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const MODALITY_LABELS: Record<string, string> = {
  webinar: 'Webinar en Vivo',
  on_demand: 'Capacitación On-Demand',
  presencial: 'Evento Presencial',
  fam_trip: 'Fam Tour',
};

interface WebinarPageProps {
  params: Promise<{ id: string }>;
}

export default async function WebinarDetailPage({ params }: WebinarPageProps) {
  const { id } = await params;

  const payload = await getPayload({ config });
  const headersList = await headers();
  const { user } = await payload.auth({ headers: headersList });

  if (!user) {
    redirect('/comunidad/login');
  }

  let webinar: any = null;
  try {
    webinar = await payload.findByID({
      collection: 'community-events',
      id,
      user,
      overrideAccess: false,
      depth: 2,
    });
  } catch {
    webinar = null;
  }

  if (!webinar) {
    notFound();
  }

  // Buscar otros webinars para "Sugerencias para continuar viendo" (3 relacionados)
  let relatedWebinars: any[] = [];
  try {
    const allRes = await payload.find({
      collection: 'community-events',
      user,
      overrideAccess: false,
      depth: 1,
      limit: 30,
      sort: '-createdAt',
    });

    const currentRepId =
      typeof webinar.representation === 'object' && webinar.representation !== null
        ? String(webinar.representation.id)
        : webinar.representation
        ? String(webinar.representation)
        : null;

    const candidates = (allRes.docs || []).filter(
      (doc: any) =>
        String(doc.id) !== String(webinar.id) &&
        (doc.modality === 'webinar' || doc.modality === 'on_demand' || Boolean(doc.recordingUrl))
    );

    // Priorizar los que comparten la misma Marca/Representación
    candidates.sort((a: any, b: any) => {
      const aRep =
        typeof a.representation === 'object' && a.representation !== null
          ? String(a.representation.id)
          : a.representation
          ? String(a.representation)
          : null;
      const bRep =
        typeof b.representation === 'object' && b.representation !== null
          ? String(b.representation.id)
          : b.representation
          ? String(b.representation)
          : null;
      const aScore = currentRepId && aRep === currentRepId ? 1 : 0;
      const bScore = currentRepId && bRep === currentRepId ? 1 : 0;
      return bScore - aScore;
    });

    relatedWebinars = candidates.slice(0, 3);
  } catch {}

  // Verificar si el usuario ya está inscripto a este webinar/evento
  let isAlreadyRegistered = false;
  try {
    const regCheck = await payload.find({
      collection: 'event-registrations',
      where: {
        and: [
          { user: { equals: user.id } },
          { event: { equals: webinar.id } },
          { status: { equals: 'registered' } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });
    isAlreadyRegistered = regCheck.docs.length > 0;
  } catch {}

  const embedUrl = getVideoEmbedUrl(webinar.recordingUrl);
  const coverSrc = getMediaUrl(webinar.coverImage);
  const materialUrl = getMediaUrl(webinar.materialAttachment);
  const repObj =
    typeof webinar.representation === 'object' && webinar.representation !== null
      ? webinar.representation
      : null;

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/comunidad/dashboard#webinars"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Webinars y Capacitaciones</span>
        </Link>
      </div>

      {/* ==================================================================== */}
      {/* LAYOUT 2 COLUMNAS: Video (Izquierda) + Detalles (Derecha)             */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Columna Izquierda: Reproductor del Webinar */}
        <div className="lg:col-span-8 space-y-5">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#111827] shadow-xl border border-slate-200">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={webinar.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white">
                {coverSrc && (
                  <>
                    <img
                      src={coverSrc}
                      alt={webinar.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                  </>
                )}
                <div className="relative z-10 max-w-md space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center mx-auto">
                    <PlayCircle className="w-9 h-9 text-[#3cac59]" />
                  </div>
                  <h2 className="font-baloo text-xl sm:text-2xl font-extrabold">
                    {webinar.recordingUrl
                      ? 'Video disponible en plataforma externa'
                      : 'Transmisión en Vivo Programada'}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/85">
                    {webinar.recordingUrl
                      ? 'Hacé clic abajo para abrir la grabación completa en una nueva pestaña.'
                      : 'Este webinar se transmitirá en vivo. Reservá tu lugar ahora para recibir el link de acceso.'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    {webinar.recordingUrl && (
                      <a
                        href={webinar.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3cac59] hover:bg-[#32964c] text-white font-bold text-sm shadow-lg transition-all"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Abrir Video</span>
                      </a>
                    )}
                    {webinar.registrationUrl && (
                      <a
                        href={webinar.registrationUrl}
                        target={webinar.registrationUrl.startsWith('http') ? '_blank' : undefined}
                        rel={
                          webinar.registrationUrl.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b87c7] hover:bg-[#156d9f] text-white font-bold text-sm shadow-lg transition-all"
                      >
                        <span>Inscribirme al Webinar</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Título y Descripción completa */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
            {repObj && (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b87c7] uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>
                  {repObj.title} — {repObj.brand}
                </span>
              </div>
            )}
            <h1 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] leading-tight mb-3">
              {webinar.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {webinar.description}
            </p>
          </div>
        </div>

        {/* Columna Derecha: Detalles del Webinar */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-baloo text-lg font-extrabold text-[#4d4e4f]">
              Detalles del Webinar
            </h2>
            <span className="px-2.5 py-1 rounded-lg bg-[#1b87c7]/10 text-[#1b87c7] text-[11px] font-bold">
              {MODALITY_LABELS[webinar.modality] || webinar.modality}
            </span>
          </div>

          <dl className="space-y-3.5 text-sm">
            {webinar.eventDate && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1b87c7]/10 text-[#1b87c7] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-slate-400">Fecha y Hora</dt>
                  <dd className="text-xs sm:text-sm font-semibold text-[#4d4e4f]">
                    {formatDateAR(webinar.eventDate)} hs
                  </dd>
                </div>
              </div>
            )}

            {webinar.locationOrPlatform && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#3cac59]/10 text-[#3cac59] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-slate-400">
                    Plataforma / Lugar
                  </dt>
                  <dd className="text-xs sm:text-sm font-semibold text-[#4d4e4f]">
                    {webinar.locationOrPlatform}
                  </dd>
                </div>
              </div>
            )}

            {webinar.speaker && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-slate-400">Disertante</dt>
                  <dd className="text-xs sm:text-sm font-semibold text-[#4d4e4f]">
                    {webinar.speaker}
                  </dd>
                </div>
              </div>
            )}

            {repObj && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-slate-400">
                    Marca / Destino
                  </dt>
                  <dd className="text-xs sm:text-sm font-semibold text-[#4d4e4f]">
                    {repObj.title} ({repObj.brand})
                  </dd>
                </div>
              </div>
            )}
          </dl>

          {/* Acciones del Webinar (Inscripción 1 Clic + Google Calendar) */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <EventRegisterActions
              eventId={webinar.id}
              title={webinar.title}
              modality={webinar.modality}
              eventDate={webinar.eventDate}
              description={webinar.description}
              locationOrPlatform={webinar.locationOrPlatform}
              registrationUrl={webinar.registrationUrl}
              initialRegistered={isAlreadyRegistered}
              isAuthenticated={true}
              fullWidth
            />

            {materialUrl && (
              <a
                href={materialUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#4d4e4f] text-xs font-bold transition-colors"
              >
                <Download className="w-4 h-4 text-[#1b87c7]" />
                <span>Descargar Presentación (PDF)</span>
              </a>
            )}

            <a
              href={`mailto:marketing@promovere.com.ar?subject=${encodeURIComponent(
                `Consulta sobre Webinar: ${webinar.title}`
              )}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#1b87c7] text-[#4d4e4f] hover:text-[#1b87c7] text-xs font-bold transition-colors"
            >
              <span>Consultar con nuestro equipo</span>
            </a>
          </div>
        </aside>
      </div>

      {/* ==================================================================== */}
      {/* SUGERENCIAS PARA CONTINUAR VIENDO (3 Webinars relacionados)           */}
      {/* ==================================================================== */}
      <section className="pt-6 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seguí capacitándote</span>
            </div>
            <h2 className="font-baloo text-xl sm:text-2xl font-extrabold text-[#4d4e4f]">
              Sugerencias para continuar viendo
            </h2>
          </div>
          <Link
            href="/comunidad/dashboard#webinars"
            className="text-xs font-bold text-[#1b87c7] hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {relatedWebinars.length === 0 ? (
          <p className="text-sm text-slate-500">
            No hay otros webinars disponibles por el momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedWebinars.map((item: any) => {
              const itemCover = getMediaUrl(item.coverImage);
              const itemRep =
                typeof item.representation === 'object' && item.representation !== null
                  ? `${item.representation.title} (${item.representation.brand})`
                  : null;

              return (
                <Link
                  key={String(item.id)}
                  href={`/comunidad/dashboard/webinars/${item.id}`}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#1b87c7]/50 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative h-36 bg-gradient-to-br from-[#113d5b] via-[#1b87c7] to-[#3cac59] overflow-hidden flex items-center justify-center">
                    {itemCover ? (
                      <img
                        src={itemCover}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Video className="w-10 h-10 text-white/40" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/90 text-[#1b87c7] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {itemRep && (
                        <span className="text-[10px] font-bold text-[#1b87c7] uppercase tracking-wider block mb-1">
                          {itemRep}
                        </span>
                      )}
                      <h3 className="font-baloo text-base font-extrabold text-[#4d4e4f] group-hover:text-[#1b87c7] transition-colors line-clamp-2 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#1b87c7]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {MODALITY_LABELS[item.modality] || item.modality}
                      </span>
                      <span>Ver webinar →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
