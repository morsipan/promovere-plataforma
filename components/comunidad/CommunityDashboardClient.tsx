'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  FileText,
  Download,
  Sparkles,
  Shield,
  FolderOpen,
  Lock,
  MapPin,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Search,
  ExternalLink,
  PlayCircle,
  Megaphone,
  MessageCircle,
  Globe,
  Images,
  X,
  Filter,
  Tag,
  Calendar,
  Clock,
  Video,
  UserCheck,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';

export interface DashboardPromotion {
  id: string | number;
  title: string;
  promoType: string;
  benefitBadge?: string | null;
  description: string;
  conditions?: string | null;
  validFrom?: string | null;
  validUntil: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  coverImage?: any;
  representation?: any;
  featured?: boolean | null;
}

export interface DashboardEvent {
  id: string | number;
  title: string;
  modality: 'webinar' | 'presencial' | 'on_demand' | string;
  eventDate?: string | null;
  locationOrPlatform?: string | null;
  speaker?: string | null;
  description: string;
  registrationUrl?: string | null;
  recordingUrl?: string | null;
  coverImage?: any;
  materialAttachment?: any;
  representation?: any;
}

export interface DashboardRepresentation {
  id: string | number;
  title: string;
  brand: string;
  country: string;
  category: string;
  tag?: string | null;
  description: string;
  coverImage?: any;
  coverImageUrl?: string | null;
  logo?: any;
  websiteUrl?: string | null;
  mediaKitUrl?: string | null;
  contactEmail?: string | null;
  contactWhatsapp?: string | null;
}

export interface DashboardContentItem {
  id: string | number;
  title: string;
  category: string;
  plainDescription: string;
  attachments?: any[];
  coverImage?: any;
  externalUrl?: string | null;
  ctaLabel?: string | null;
  videoUrl?: string | null;
  representation?: any;
  brand?: string | null;
  highlight?: string | null;
  featured?: boolean | null;
  createdAt?: string;
}

export interface DashboardCommunitySettings {
  alertBanner?: {
    enabled?: boolean | null;
    message?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
  };
  welcomeBanner?: {
    badge?: string | null;
    subtitle?: string | null;
    b2bPolicyTitle?: string | null;
    b2bPolicyText?: string | null;
  };
  whatsappChannel?: {
    enabled?: boolean | null;
    title?: string | null;
    buttonLabel?: string | null;
    description?: string | null;
    whatsappUrl?: string | null;
  };
}

export interface CommunityDashboardClientProps {
  userName: string;
  userRole: string;
  representations: DashboardRepresentation[];
  contentItems: DashboardContentItem[];
  promotions?: DashboardPromotion[];
  events?: DashboardEvent[];
  settings?: DashboardCommunitySettings | null;
}

const PROMO_TYPE_LABELS: Record<string, string> = {
  descuento: 'Descuento Especial',
  comision: 'Comisión Extra',
  incentivo: 'Incentivo por Ventas',
  fam_trip: 'Fam Trip',
  early_booking: 'Early Booking',
};

const MODALITY_META: Record<string, { label: string; badgeClass: string }> = {
  webinar: {
    label: 'Webinar en Vivo',
    badgeClass: 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/25',
  },
  presencial: {
    label: 'Evento Presencial',
    badgeClass: 'bg-[#3cac59]/10 text-[#266f39] border-[#3cac59]/25',
  },
  on_demand: {
    label: 'Grabado On-Demand',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

function getDaysRemaining(dateIso?: string | null): number | null {
  if (!dateIso) return null;
  const target = new Date(dateIso);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diffMs = target.setHours(23, 59, 59, 999) - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatDateAR(dateIso?: string | null, includeTime = false): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

const CATEGORY_META: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  novedades: {
    label: 'Novedades',
    badgeClass: 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/20',
    dotClass: 'bg-[#1b87c7]',
  },
  promociones: {
    label: 'Promociones',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  material_comercial: {
    label: 'Material Comercial',
    badgeClass: 'bg-[#3cac59]/10 text-[#2d8d45] border-[#3cac59]/25',
    dotClass: 'bg-[#3cac59]',
  },
  herramientas: {
    label: 'Herramientas',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  contratos: {
    label: 'Contratos Mayoristas',
    badgeClass: 'bg-slate-800 text-white border-slate-700',
    dotClass: 'bg-slate-800',
  },
};

export default function CommunityDashboardClient({
  userName,
  userRole,
  representations,
  contentItems,
  promotions = [],
  events = [],
  settings,
}: CommunityDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRepId, setSelectedRepId] = useState<string>('all');
  const [showExpiredPromos, setShowExpiredPromos] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'on_demand'>('all');

  // Promociones vigentes vs vencidas
  const { activePromotions, expiredPromotionsCount } = useMemo(() => {
    const active: DashboardPromotion[] = [];
    let expiredCount = 0;
    for (const promo of promotions) {
      const days = getDaysRemaining(promo.validUntil);
      if (days !== null && days < 0) {
        expiredCount += 1;
        if (showExpiredPromos) active.push(promo);
      } else {
        active.push(promo);
      }
    }
    return { activePromotions: active, expiredPromotionsCount: expiredCount };
  }, [promotions, showExpiredPromos]);

  // Eventos filtrados por modalidad
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    if (eventFilter === 'on_demand') {
      return events.filter((ev) => ev.modality === 'on_demand' || Boolean(ev.recordingUrl));
    }
    return events.filter((ev) => ev.modality !== 'on_demand');
  }, [events, eventFilter]);

  const canSeeContracts = userRole !== 'minorista';

  // Contar recursos asociados por cada Representación
  const resourceCountByRep = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of contentItems) {
      const repId =
        typeof item.representation === 'object' && item.representation !== null
          ? String(item.representation.id)
          : item.representation
          ? String(item.representation)
          : null;
      if (repId) {
        counts[repId] = (counts[repId] || 0) + 1;
      }
    }
    return counts;
  }, [contentItems]);

  // Filtrado en tiempo real de la biblioteca
  const filteredContent = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return contentItems.filter((item) => {
      // Filtro de categoría
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Filtro de marca/representación
      if (selectedRepId !== 'all') {
        const repId =
          typeof item.representation === 'object' && item.representation !== null
            ? String(item.representation.id)
            : item.representation
            ? String(item.representation)
            : '';
        if (repId !== selectedRepId) return false;
      }

      // Filtro de búsqueda textual
      if (q) {
        const repTitle =
          typeof item.representation === 'object' && item.representation !== null
            ? `${item.representation.title || ''} ${item.representation.brand || ''}`
            : '';
        const haystack = [
          item.title,
          item.plainDescription,
          item.brand || '',
          item.highlight || '',
          repTitle,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [contentItems, searchQuery, selectedCategory, selectedRepId]);

  const handleFilterByRep = (repId: string | number) => {
    setSelectedRepId(String(repId));
    setSelectedCategory('all');
    const el = document.getElementById('herramientas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRepId('all');
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedCategory !== 'all' || selectedRepId !== 'all';

  const alertBanner = settings?.alertBanner;
  const welcome = settings?.welcomeBanner;
  const whatsapp = settings?.whatsappChannel;

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'novedades', label: 'Novedades' },
    { value: 'promociones', label: 'Promociones' },
    { value: 'material_comercial', label: 'Material Comercial' },
    { value: 'herramientas', label: 'Herramientas' },
    ...(canSeeContracts ? [{ value: 'contratos', label: 'Contratos' }] : []),
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* ==================================================================== */}
      {/* 0. AVISO URGENTE / CINTILLO SUPERIOR (Opcional desde CommunitySettings) */}
      {/* ==================================================================== */}
      {alertBanner?.enabled && alertBanner?.message && (
        <div className="rounded-2xl bg-gradient-to-r from-[#3cac59] to-[#1b87c7] text-white px-5 py-3.5 shadow-lg shadow-[#1b87c7]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-snug">
              {alertBanner.message}
            </p>
          </div>
          {alertBanner.ctaUrl && (
            <a
              href={alertBanner.ctaUrl}
              target={alertBanner.ctaUrl.startsWith('http') ? '_blank' : undefined}
              rel={alertBanner.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#1b87c7] font-bold text-xs hover:bg-[#f9f9f9] transition-colors shrink-0"
            >
              <span>{alertBanner.ctaLabel || 'Ver más'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. BANNER DE BIENVENIDA Y POLÍTICA B2B (Editable desde CommunitySettings) */}
      {/* ==================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#113d5b] via-[#0e496d] to-[#1b87c7] text-white p-7 sm:p-10 shadow-xl shadow-[#113d5b]/10">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
            <span>
              {welcome?.badge || 'Portal Exclusivo para Profesionales de Turismo'}
            </span>
          </div>
          <h1
            suppressHydrationWarning
            className="font-baloo text-2xl sm:text-4xl font-extrabold tracking-tight mb-3"
          >
            {`Bienvenido, ${userName}`}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light mb-6">
            {welcome?.subtitle ||
              'Espacio exclusivo para Operadores Mayoristas y Agencias de Viajes. Aquí encontrarás el catálogo oficial de destinos representados, fichas técnicas, promociones vigentes y herramientas comerciales de apoyo.'}
          </p>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/20 border border-white/15 backdrop-blur-sm text-xs sm:text-sm text-slate-200">
            <Shield className="w-5 h-5 text-[#3cac59] shrink-0 mt-0.5" />
            <span>
              <strong>{welcome?.b2bPolicyTitle || 'Política de Seguridad B2B:'}</strong>{' '}
              {welcome?.b2bPolicyText ||
                'Por normativas de confidencialidad del trade, este portal no publica tarifas ni precios confidenciales al público. Los materiales están destinados a soporte de ventas, formación y cotización directa con operadores habilitados.'}
            </span>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* ==================================================================== */}
      {/* 2. CATÁLOGO DE REPRESENTACIONES OFICIALES (100% desde Payload CMS)    */}
      {/* ==================================================================== */}
      <section id="representaciones" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-1">
              <Compass className="w-4 h-4" />
              <span>Marcas y Destinos de Excelencia</span>
            </div>
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
              Catálogo de Representaciones Oficiales
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {representations.length}{' '}
            {representations.length === 1
              ? 'Representación Activa'
              : 'Representaciones Activas en LATAM'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {representations.map((item) => {
            const imgSrc =
              getMediaUrl(item.coverImage) ||
              item.coverImageUrl ||
              'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=800&q=80';
            const logoSrc = getMediaUrl(item.logo);
            const repResourceCount = resourceCountByRep[String(item.id)] || 0;
            const contactHref =
              item.contactWhatsapp?.trim() ||
              `mailto:${item.contactEmail || 'marketing@promovere.com.ar'}?subject=${encodeURIComponent(
                `Consulta Trade - ${item.title} (${item.brand})`
              )}`;

            return (
              <div
                key={String(item.id)}
                className="group relative overflow-hidden rounded-3xl bg-[#4d4e4f] shadow-md hover:shadow-xl transition-all duration-300 min-h-[390px] flex flex-col justify-between border border-slate-200"
              >
                {/* Imagen de fondo */}
                <img
                  src={imgSrc}
                  alt={`${item.title} - ${item.brand}`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a2b2c] via-[#4d4e4f]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />

                {/* Badges superiores */}
                <div className="relative z-10 p-5 flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold uppercase tracking-wider border border-white/20">
                    <Building2 className="w-3.5 h-3.5 text-[#3cac59]" />
                    {item.category}
                  </span>
                  {item.tag && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1b87c7] text-white text-[11px] font-bold shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Contenido inferior */}
                <div className="relative z-10 p-5 sm:p-6">
                  {logoSrc && (
                    <div className="mb-3 inline-block bg-white/95 rounded-xl px-3 py-1.5 shadow-sm">
                      <img
                        src={logoSrc}
                        alt={item.brand}
                        className="h-6 w-auto max-w-[120px] object-contain"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#3cac59] uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.country}</span>
                  </div>

                  <h3 className="font-baloo text-xl sm:text-2xl font-black text-white mb-0.5 leading-tight group-hover:text-[#3cac59] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-white/90 mb-2">{item.brand}</p>

                  <p className="text-xs text-white/80 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>

                  {/* Accesos rápidos de la Marca */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {repResourceCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleFilterByRep(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3cac59] hover:bg-[#32964c] text-white text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Ver recursos ({repResourceCount})</span>
                      </button>
                    )}

                    {item.mediaKitUrl && (
                      <a
                        href={item.mediaKitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[11px] font-semibold transition-colors"
                      >
                        <Images className="w-3.5 h-3.5" />
                        <span>Banco de Fotos</span>
                      </a>
                    )}

                    {item.websiteUrl && (
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-[11px] font-semibold transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Web</span>
                      </a>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 text-[#3cac59] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Representación Activa
                    </span>
                    <a
                      href={contactHref}
                      target={contactHref.startsWith('http') ? '_blank' : undefined}
                      rel={contactHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 font-bold text-white hover:text-[#7bc1ea] transition-colors"
                    >
                      <span>{item.contactWhatsapp ? 'WhatsApp' : 'Solicitar Material'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2B. PROMOCIONES E INCENTIVOS TRADE (Vigencia Automática)              */}
      {/* ==================================================================== */}
      <section id="promociones" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Tag className="w-4 h-4" />
              <span>Beneficios Comerciales Vigentes</span>
            </div>
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
              Promociones e Incentivos Trade
            </h2>
          </div>

          {expiredPromotionsCount > 0 && (
            <button
              type="button"
              onClick={() => setShowExpiredPromos((prev) => !prev)}
              className="text-xs font-bold text-[#1b87c7] hover:underline cursor-pointer self-start sm:self-auto"
            >
              {showExpiredPromos
                ? 'Ocultar promociones vencidas'
                : `Ver también vencidas (${expiredPromotionsCount})`}
            </button>
          )}
        </div>

        {activePromotions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm font-semibold text-[#4d4e4f]">
              No hay promociones vigentes en este momento.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Las nuevas campañas e incentivos aparecerán aquí apenas se publiquen desde /admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePromotions.map((promo) => {
              const daysLeft = getDaysRemaining(promo.validUntil);
              const isExpired = daysLeft !== null && daysLeft < 0;
              const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
              const coverSrc = getMediaUrl(promo.coverImage);
              const repLabel =
                typeof promo.representation === 'object' && promo.representation !== null
                  ? `${promo.representation.title} — ${promo.representation.brand}`
                  : null;

              let expiryBadge = {
                text: `Vigente hasta ${formatDateAR(promo.validUntil)}`,
                cls: 'bg-[#3cac59]/10 text-[#266f39] border-[#3cac59]/25',
              };
              if (isExpired) {
                expiryBadge = {
                  text: `Vencida (${formatDateAR(promo.validUntil)})`,
                  cls: 'bg-slate-100 text-slate-500 border-slate-200',
                };
              } else if (daysLeft === 0) {
                expiryBadge = {
                  text: '¡Último día hoy!',
                  cls: 'bg-red-50 text-red-700 border-red-200',
                };
              } else if (isUrgent) {
                expiryBadge = {
                  text: `Vence en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}`,
                  cls: 'bg-amber-50 text-amber-700 border-amber-200',
                };
              }

              return (
                <article
                  key={String(promo.id)}
                  className={`bg-white rounded-3xl border shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between ${
                    isExpired
                      ? 'border-slate-200 opacity-75'
                      : promo.featured
                      ? 'border-[#1b87c7]/40 ring-1 ring-[#1b87c7]/15'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div>
                    {coverSrc && (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={coverSrc}
                          alt={promo.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                        {promo.benefitBadge && (
                          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#1b87c7] to-[#3cac59] text-white text-xs font-extrabold shadow-md">
                            {promo.benefitBadge}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-[#1b87c7]/10 text-[#1b87c7] text-[11px] font-bold uppercase tracking-wide">
                            {PROMO_TYPE_LABELS[promo.promoType] || promo.promoType}
                          </span>
                          {!coverSrc && promo.benefitBadge && (
                            <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#1b87c7] to-[#3cac59] text-white text-[11px] font-extrabold">
                              {promo.benefitBadge}
                            </span>
                          )}
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${expiryBadge.cls}`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{expiryBadge.text}</span>
                        </span>
                      </div>

                      {repLabel && (
                        <p className="text-xs font-semibold text-[#1b87c7] flex items-center gap-1 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{repLabel}</span>
                        </p>
                      )}

                      <h3 className="font-baloo text-xl font-extrabold text-[#4d4e4f] leading-snug mb-2">
                        {promo.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        {promo.description}
                      </p>

                      {promo.conditions && (
                        <p className="text-[11px] text-slate-400 bg-slate-50 rounded-xl p-3 border border-slate-100 leading-relaxed">
                          <strong className="text-slate-500">Condiciones:</strong> {promo.conditions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Hasta {formatDateAR(promo.validUntil)}
                    </span>
                    {promo.ctaUrl && !isExpired && (
                      <a
                        href={promo.ctaUrl}
                        target={promo.ctaUrl.startsWith('http') ? '_blank' : undefined}
                        rel={promo.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b87c7] to-[#3cac59] hover:from-[#156d9f] hover:to-[#32964c] text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <span>{promo.ctaLabel || 'Consultar Promoción'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 2C. EVENTOS, WEBINARS Y CAPACITACIONES (Agenda + On-Demand)           */}
      {/* ==================================================================== */}
      <section id="eventos" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1b87c7] mb-1">
              <Calendar className="w-4 h-4" />
              <span>Formación Continua & Agenda</span>
            </div>
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
              Eventos, Webinars y Capacitaciones
            </h2>
          </div>

          {/* Filtro rápido de modalidad */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'upcoming', label: 'En Vivo / Presencial' },
              { id: 'on_demand', label: 'On-Demand' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEventFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  eventFilter === tab.id
                    ? 'bg-[#1b87c7] text-white shadow-xs'
                    : 'text-[#4d4e4f]/75 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm font-semibold text-[#4d4e4f]">
              No hay eventos o capacitaciones en esta categoría por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((ev) => {
              const modMeta = MODALITY_META[ev.modality] || {
                label: ev.modality,
                badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
              };
              const coverSrc = getMediaUrl(ev.coverImage);
              const materialUrl = getMediaUrl(ev.materialAttachment);
              const repLabel =
                typeof ev.representation === 'object' && ev.representation !== null
                  ? `${ev.representation.title} (${ev.representation.brand})`
                  : null;

              return (
                <article
                  key={String(ev.id)}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {coverSrc && (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={coverSrc}
                          alt={ev.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${modMeta.badgeClass}`}
                        >
                          {ev.modality === 'on_demand' ? (
                            <Video className="w-3 h-3" />
                          ) : (
                            <Calendar className="w-3 h-3" />
                          )}
                          <span>{modMeta.label}</span>
                        </span>

                        {ev.eventDate && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4d4e4f] bg-slate-100 px-2.5 py-1 rounded-lg">
                            <Clock className="w-3 h-3 text-[#1b87c7]" />
                            <span>{formatDateAR(ev.eventDate, true)} hs</span>
                          </span>
                        )}
                      </div>

                      {repLabel && (
                        <p className="text-xs font-semibold text-[#1b87c7] flex items-center gap-1 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{repLabel}</span>
                        </p>
                      )}

                      <h3 className="font-baloo text-xl font-extrabold text-[#4d4e4f] leading-snug mb-2">
                        {ev.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {ev.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                        {ev.locationOrPlatform && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#3cac59]" />
                            <span>{ev.locationOrPlatform}</span>
                          </span>
                        )}
                        {ev.speaker && (
                          <span className="inline-flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-[#1b87c7]" />
                            <span>{ev.speaker}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    {ev.registrationUrl && ev.modality !== 'on_demand' && (
                      <a
                        href={ev.registrationUrl}
                        target={ev.registrationUrl.startsWith('http') ? '_blank' : undefined}
                        rel={ev.registrationUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white text-xs font-bold transition-colors"
                      >
                        <span>Inscribirme</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {ev.recordingUrl && (
                      <a
                        href={ev.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4d4e4f] hover:bg-[#38393a] text-white text-xs font-bold transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-[#3cac59]" />
                        <span>Ver Grabación</span>
                      </a>
                    )}

                    {materialUrl && (
                      <a
                        href={materialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#4d4e4f] text-xs font-bold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#1b87c7]" />
                        <span>Presentación</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 3. BIBLIOTECA DE RECURSOS, NOVEDADES Y HERRAMIENTAS (Con Filtros)     */}
      {/* ==================================================================== */}
      <section id="herramientas" className="scroll-mt-24">
        <div id="novedades" className="scroll-mt-24" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1b87c7] mb-1">
              <FolderOpen className="w-4 h-4" />
              <span>Biblioteca Trade B2B</span>
            </div>
            <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
              Recursos, Novedades y Herramientas
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Mostrando {filteredContent.length} de {contentItems.length} recursos disponibles para tu rol
          </span>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar manuales, promociones, marcas, fichas técnicas..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all text-[#4d4e4f]"
              />
            </div>

            {/* Selector de Marca / Representación */}
            <div className="relative md:w-64">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedRepId}
                onChange={(e) => setSelectedRepId(e.target.value)}
                aria-label="Filtrar por marca o representación"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all text-[#4d4e4f] font-medium cursor-pointer"
              >
                <option value="all">Todas las Marcas</option>
                {representations.map((rep) => (
                  <option key={String(rep.id)} value={String(rep.id)}>
                    {rep.title} — {rep.brand}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          {/* Pills de Categoría */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1b87c7] text-white shadow-sm'
                      : 'bg-slate-100 text-[#4d4e4f]/80 hover:bg-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Contenidos */}
        {filteredContent.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1b87c7]/10 text-[#1b87c7] flex items-center justify-center mx-auto mb-3">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="font-baloo text-lg font-bold text-[#4d4e4f] mb-1">
              {hasActiveFilters
                ? 'No encontramos recursos con esos filtros'
                : 'Aún no hay recursos publicados'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
              {hasActiveFilters
                ? 'Probá quitando alguno de los filtros o buscando con otra palabra clave.'
                : 'El equipo de Promovêre puede cargar novedades, promociones, kits y herramientas desde /admin → Contenidos Privados de Comunidad.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white text-xs font-bold hover:bg-[#156d9f] transition-colors cursor-pointer"
              >
                Ver todos los recursos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => {
              const catMeta = CATEGORY_META[item.category] || {
                label: item.category,
                badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
                dotClass: 'bg-slate-400',
              };
              const coverSrc = getMediaUrl(item.coverImage);
              const repLabel =
                typeof item.representation === 'object' && item.representation !== null
                  ? `${item.representation.title} (${item.representation.brand})`
                  : item.brand || null;
              const attachments = Array.isArray(item.attachments) ? item.attachments : [];

              return (
                <article
                  key={String(item.id)}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Imagen de portada opcional */}
                    {coverSrc && (
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                        <img
                          src={coverSrc}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center"
                        />
                        {item.highlight && (
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#3cac59] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {item.highlight}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-5 sm:p-6">
                      {/* Categoría & Destacado */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${catMeta.badgeClass}`}
                        >
                          {item.category === 'contratos' ? (
                            <Lock className="w-3 h-3" />
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dotClass}`} />
                          )}
                          <span>{catMeta.label}</span>
                        </span>

                        {!coverSrc && item.highlight && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#3cac59]/10 text-[#2d8d45] text-[10px] font-bold uppercase">
                            {item.highlight}
                          </span>
                        )}
                      </div>

                      {/* Marca relacionada */}
                      {repLabel && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1b87c7] mb-1.5">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{repLabel}</span>
                        </div>
                      )}

                      <h3 className="font-baloo text-lg font-extrabold text-[#4d4e4f] leading-snug mb-2">
                        {item.title}
                      </h3>

                      {item.plainDescription && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                          {item.plainDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer de Acciones: Enlace externo, Video y Descargas */}
                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 space-y-2.5">
                    {(item.externalUrl || item.videoUrl) && (
                      <div className="flex flex-wrap gap-2">
                        {item.externalUrl && (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b87c7] hover:bg-[#156d9f] text-white text-xs font-bold transition-colors"
                          >
                            <span>{item.ctaLabel || 'Abrir Recurso'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {item.videoUrl && (
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4d4e4f] hover:bg-[#3a3b3c] text-white text-xs font-bold transition-colors"
                          >
                            <PlayCircle className="w-3.5 h-3.5 text-[#3cac59]" />
                            <span>Ver Video</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Archivos descargables */}
                    {attachments.length > 0 && (
                      <div className="space-y-1.5">
                        {attachments.map((file: any, idx: number) => {
                          const fileUrl = getMediaUrl(file);
                          if (!fileUrl) return null;
                          const fileName =
                            (typeof file === 'object' && (file.filename || file.alt)) ||
                            `Documento adjunto ${idx + 1}`;
                          return (
                            <a
                              key={`att-${item.id}-${idx}`}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#f9f9f9] hover:bg-[#f0f7fc] border border-slate-200/70 hover:border-[#1b87c7]/40 text-xs font-semibold text-[#4d4e4f] hover:text-[#1b87c7] transition-all group"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <FileText className="w-3.5 h-3.5 text-[#1b87c7] shrink-0" />
                                <span className="truncate">{fileName}</span>
                              </span>
                              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1b87c7] shrink-0" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================================== */}
      {/* 4. CANAL DE WHATSAPP TRADE (Editable desde CommunitySettings)         */}
      {/* ==================================================================== */}
      {whatsapp?.enabled !== false && whatsapp?.whatsappUrl && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#266f39] via-[#3cac59] to-[#1b87c7] text-white p-7 sm:p-9 shadow-xl shadow-[#3cac59]/15">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Canal Directo Trade</span>
              </div>
              <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">
                {whatsapp.title || 'Sumate al Canal Oficial de WhatsApp Trade'}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                {whatsapp.description ||
                  'Recibí alertas instantáneas de promociones, cupos de Fam Tours, lanzamientos hoteleros y novedades comerciales directo en tu teléfono.'}
              </p>
            </div>

            <a
              href={whatsapp.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#266f39] font-bold text-sm shadow-lg hover:bg-[#f9f9f9] hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{whatsapp.buttonLabel || 'Unirme por WhatsApp'}</span>
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
