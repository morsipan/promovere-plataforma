'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  Clock,
  Settings,
  Video,
  BookOpen,
  Cpu,
  Briefcase,
} from 'lucide-react';
import { getMediaUrl } from '@/lib/media';
import CommunityEventsCalendar from './CommunityEventsCalendar';
import CommunityAdBannerSlot from './CommunityAdBannerSlot';
import { DEFAULT_DASHBOARD_ORDER } from './ProfileSettingsClient';

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
  modality: 'webinar' | 'presencial' | 'fam_trip' | 'on_demand' | string;
  eventDate?: string | null;
  locationOrPlatform?: string | null;
  speaker?: string | null;
  description: string;
  registrationUrl?: string | null;
  recordingUrl?: string | null;
  coverImage?: any;
  materialAttachment?: any;
  representation?: any;
  featured?: boolean | null;
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
  designStyles?: {
    welcomeTheme?: 'azul-oscuro' | 'gradiente-marca' | 'azul' | 'verde' | 'grisOscuro' | null;
    alertStyle?: 'gradiente' | 'azul' | 'verde' | 'grisOscuro' | null;
    whatsappStyle?: 'verde-gradiente' | 'verde' | 'azul' | 'grisOscuro' | null;
    cardStyle?: 'elevated' | 'bordered' | 'soft' | null;
    accentColor?: 'azul' | 'verde' | null;
  };
  adBannerTop?: any[] | null;
  adBannerMiddle?: any[] | null;
  adBannerBottom?: any[] | null;
}

export interface CommunityDashboardClientProps {
  userName: string;
  userRole: string;
  dashboardOrder?: string[] | null;
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

const CATEGORY_META: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  herramientas_comerciales: {
    label: 'Herramienta Comercial',
    badgeClass: 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/25',
    dotClass: 'bg-[#1b87c7]',
  },
  herramientas_inteligentes: {
    label: 'Herramienta Inteligente',
    badgeClass: 'bg-[#3cac59]/10 text-[#266f39] border-[#3cac59]/25',
    dotClass: 'bg-[#3cac59]',
  },
  blog: {
    label: 'Nota de Blog',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
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
    badgeClass: 'bg-[#1b87c7]/10 text-[#1b87c7] border-[#1b87c7]/25',
    dotClass: 'bg-[#1b87c7]',
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

function getDaysRemaining(dateIso?: string | null): number | null {
  if (!dateIso) return null;
  const target = new Date(dateIso);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const diffMs = target.setHours(23, 59, 59, 999) - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatDateAR(dateIso?: string | null): string {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function normalizeSectionOrder(customOrder?: string[] | null): string[] {
  const validSet = new Set<string>(DEFAULT_DASHBOARD_ORDER);
  const cleaned = Array.isArray(customOrder) ? customOrder.filter((k) => validSet.has(k)) : [];
  const missing = DEFAULT_DASHBOARD_ORDER.filter((k) => !cleaned.includes(k));
  return [...cleaned, ...missing];
}

export default function CommunityDashboardClient({
  userName,
  userRole,
  dashboardOrder,
  representations,
  contentItems,
  promotions = [],
  events = [],
  settings,
}: CommunityDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [toolTab, setToolTab] = useState<'all' | 'comerciales' | 'inteligentes' | 'contratos'>('all');
  const [selectedRepId, setSelectedRepId] = useState<string>('all');
  const [showExpiredPromos, setShowExpiredPromos] = useState(false);
  const [activeBlogNote, setActiveBlogNote] = useState<DashboardContentItem | null>(null);

  const canSeeContracts = userRole !== 'minorista';
  const orderedSections = useMemo(() => normalizeSectionOrder(dashboardOrder), [dashboardOrder]);

  // =========================================================================
  // Estilos configurables desde Configuración de la Comunidad
  // =========================================================================
  const styles = settings?.designStyles;
  const accentIsGreen = styles?.accentColor === 'verde';
  const accentBtnClass = accentIsGreen
    ? 'bg-[#3cac59] hover:bg-[#32964c] text-white'
    : 'bg-[#1b87c7] hover:bg-[#156d9f] text-white';
  const accentTextClass = accentIsGreen ? 'text-[#3cac59]' : 'text-[#1b87c7]';

  const welcomeBgClass = {
    'azul-oscuro': 'bg-gradient-to-r from-[#113d5b] via-[#0e496d] to-[#1b87c7]',
    'gradiente-marca': 'bg-gradient-to-r from-[#1b87c7] via-[#1b87c7] to-[#3cac59]',
    azul: 'bg-[#1b87c7]',
    verde: 'bg-[#3cac59]',
    grisOscuro: 'bg-[#4d4e4f]',
  }[styles?.welcomeTheme || 'azul-oscuro'];

  const alertBgClass = {
    gradiente: 'bg-gradient-to-r from-[#3cac59] to-[#1b87c7]',
    azul: 'bg-[#1b87c7]',
    verde: 'bg-[#3cac59]',
    grisOscuro: 'bg-[#4d4e4f]',
  }[styles?.alertStyle || 'gradiente'];

  const whatsappBgClass = {
    'verde-gradiente': 'bg-gradient-to-r from-[#266f39] via-[#3cac59] to-[#1b87c7]',
    verde: 'bg-[#3cac59]',
    azul: 'bg-[#1b87c7]',
    grisOscuro: 'bg-[#4d4e4f]',
  }[styles?.whatsappStyle || 'verde-gradiente'];

  const cardSurfaceClass = {
    elevated: 'bg-white border border-slate-200/80 shadow-xs hover:shadow-lg',
    bordered: 'bg-white border-2 border-slate-200 hover:border-[#1b87c7]/50',
    soft: 'bg-[#f9f9f9] border border-slate-200/60 hover:bg-white hover:shadow-md',
  }[styles?.cardStyle || 'elevated'];

  // =========================================================================
  // Separación de Herramientas vs Notas de Blog (Herramientas Importantes)
  // =========================================================================
  const blogNotes = useMemo(
    () => contentItems.filter((item) => item.category === 'blog' || item.category === 'novedades'),
    [contentItems]
  );

  const toolItems = useMemo(
    () => contentItems.filter((item) => item.category !== 'blog'),
    [contentItems]
  );

  const webinarItems = useMemo(
    () =>
      events.filter(
        (ev) => ev.modality === 'webinar' || ev.modality === 'on_demand' || Boolean(ev.recordingUrl)
      ),
    [events]
  );

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

  // Recursos por marca
  const resourceCountByRep = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of toolItems) {
      const repId =
        typeof item.representation === 'object' && item.representation !== null
          ? String(item.representation.id)
          : item.representation
          ? String(item.representation)
          : null;
      if (repId) counts[repId] = (counts[repId] || 0) + 1;
    }
    return counts;
  }, [toolItems]);

  // Filtrado de Herramientas Comerciales & Inteligentes
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return toolItems.filter((item) => {
      if (toolTab === 'comerciales') {
        if (
          !['herramientas_comerciales', 'material_comercial', 'herramientas'].includes(
            item.category
          )
        ) {
          return false;
        }
      } else if (toolTab === 'inteligentes') {
        if (item.category !== 'herramientas_inteligentes') return false;
      } else if (toolTab === 'contratos') {
        if (item.category !== 'contratos') return false;
      }

      if (selectedRepId !== 'all') {
        const repId =
          typeof item.representation === 'object' && item.representation !== null
            ? String(item.representation.id)
            : item.representation
            ? String(item.representation)
            : '';
        if (repId !== selectedRepId) return false;
      }

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
  }, [toolItems, toolTab, selectedRepId, searchQuery]);

  const handleFilterByRep = (repId: string | number) => {
    setSelectedRepId(String(repId));
    setToolTab('all');
    const el = document.getElementById('herramientas');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const clearToolFilters = () => {
    setSearchQuery('');
    setToolTab('all');
    setSelectedRepId('all');
  };

  const hasActiveToolFilters =
    searchQuery.trim().length > 0 || toolTab !== 'all' || selectedRepId !== 'all';

  const alertBanner = settings?.alertBanner;
  const welcome = settings?.welcomeBanner;
  const whatsapp = settings?.whatsappChannel;

  // =========================================================================
  // Renderizadores de cada sección ordenable
  // =========================================================================
  const renderSection = (key: string) => {
    switch (key) {
      case 'representaciones':
        return (
          <section key="representaciones" id="representaciones" className="scroll-mt-24">
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
                    <img
                      src={imgSrc}
                      alt={`${item.title} - ${item.brand}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a2b2c] via-[#4d4e4f]/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />

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

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {repResourceCount > 0 && (
                          <button
                            type="button"
                            onClick={() => handleFilterByRep(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3cac59] hover:bg-[#32964c] text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Ver herramientas ({repResourceCount})</span>
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
        );

      case 'promociones':
        return (
          <section key="promociones" id="promociones" className="scroll-mt-24">
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
                  className={`text-xs font-bold ${accentTextClass} hover:underline cursor-pointer self-start sm:self-auto`}
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
                      className={`rounded-3xl transition-all overflow-hidden flex flex-col justify-between ${cardSurfaceClass} ${
                        isExpired ? 'opacity-75' : ''
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
                              <strong className="text-slate-500">Condiciones:</strong>{' '}
                              {promo.conditions}
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1b87c7] to-[#3cac59] hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all"
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
        );

      case 'eventos':
        return <CommunityEventsCalendar key="eventos" events={events} />;

      case 'herramientas':
        return (
          <section key="herramientas" id="herramientas" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div
                  className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${accentTextClass} mb-1`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Herramientas Comerciales & Inteligentes</span>
                </div>
                <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
                  Herramientas de la Comunidad
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {filteredTools.length} de {toolItems.length} herramientas disponibles
              </span>
            </div>

            {/* Tabs Herramientas Comerciales vs Inteligentes + Buscador + Marca */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setToolTab('all')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    toolTab === 'all'
                      ? accentBtnClass + ' shadow-sm'
                      : 'bg-slate-100 text-[#4d4e4f]/80 hover:bg-slate-200/80'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Todas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setToolTab('comerciales')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    toolTab === 'comerciales'
                      ? 'bg-[#1b87c7] text-white shadow-sm'
                      : 'bg-slate-100 text-[#4d4e4f]/80 hover:bg-slate-200/80'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Herramientas Comerciales</span>
                </button>
                <button
                  type="button"
                  onClick={() => setToolTab('inteligentes')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    toolTab === 'inteligentes'
                      ? 'bg-[#3cac59] text-white shadow-sm'
                      : 'bg-slate-100 text-[#4d4e4f]/80 hover:bg-slate-200/80'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Herramientas Inteligentes</span>
                </button>
                {canSeeContracts && (
                  <button
                    type="button"
                    onClick={() => setToolTab('contratos')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      toolTab === 'contratos'
                        ? 'bg-[#4d4e4f] text-white shadow-sm'
                        : 'bg-slate-100 text-[#4d4e4f]/80 hover:bg-slate-200/80'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Contratos Mayoristas</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar brochures, cotizadores, bancos de fotos, fichas..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-[#f9f9f9] focus:bg-white focus:ring-2 focus:ring-[#1b87c7] focus:border-transparent outline-none transition-all text-[#4d4e4f]"
                  />
                </div>

                <div className="relative md:w-64">
                  <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={selectedRepId}
                    onChange={(e) => setSelectedRepId(e.target.value)}
                    aria-label="Filtrar herramientas por marca"
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

                {hasActiveToolFilters && (
                  <button
                    type="button"
                    onClick={clearToolFilters}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>
                )}
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
                <p className="font-baloo text-lg font-bold text-[#4d4e4f] mb-1">
                  No encontramos herramientas con esos filtros
                </p>
                {hasActiveToolFilters && (
                  <button
                    type="button"
                    onClick={clearToolFilters}
                    className={`mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${accentBtnClass}`}
                  >
                    Ver todas las herramientas
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((item) => {
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
                      className={`rounded-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between ${cardSurfaceClass}`}
                    >
                      <div>
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

                      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 space-y-2.5">
                        {(item.externalUrl || item.videoUrl) && (
                          <div className="flex flex-wrap gap-2">
                            {item.externalUrl && (
                              <a
                                href={item.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${accentBtnClass}`}
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
        );

      case 'webinars':
        return (
          <section key="webinars" id="webinars" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                  <Video className="w-4 h-4" />
                  <span>Capacitaciones en Video & On-Demand</span>
                </div>
                <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
                  Webinars Exclusivos
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Hacé clic en cualquier webinar para verlo completo y descubrir sugerencias
              </span>
            </div>

            {webinarItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm font-semibold text-[#4d4e4f]">
                  Aún no hay webinars publicados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinarItems.map((w) => {
                  const coverSrc = getMediaUrl(w.coverImage);
                  const repLabel =
                    typeof w.representation === 'object' && w.representation !== null
                      ? `${w.representation.title} (${w.representation.brand})`
                      : null;

                  return (
                    <Link
                      key={`webinar-card-${w.id}`}
                      href={`/comunidad/dashboard/webinars/${w.id}`}
                      className={`group rounded-3xl overflow-hidden flex flex-col justify-between transition-all ${cardSurfaceClass}`}
                    >
                      <div>
                        <div className="relative h-44 bg-gradient-to-br from-[#113d5b] via-[#1b87c7] to-[#3cac59] overflow-hidden flex items-center justify-center">
                          {coverSrc ? (
                            <img
                              src={coverSrc}
                              alt={w.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <Video className="w-12 h-12 text-white/35" />
                          )}
                          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/95 text-[#1b87c7] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <PlayCircle className="w-7 h-7" />
                            </div>
                          </div>
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                            {w.modality === 'on_demand' ? 'On-Demand' : 'Webinar en Vivo'}
                          </span>
                        </div>

                        <div className="p-5">
                          {repLabel && (
                            <span className="text-[11px] font-semibold text-[#1b87c7] flex items-center gap-1 mb-1">
                              <Building2 className="w-3 h-3" />
                              {repLabel}
                            </span>
                          )}
                          <h3 className="font-baloo text-lg font-extrabold text-[#4d4e4f] group-hover:text-[#1b87c7] transition-colors leading-snug mb-2 line-clamp-2">
                            {w.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                            {w.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1b87c7]">
                        <span className="text-slate-400 font-medium truncate">
                          {w.speaker || w.locationOrPlatform || 'Promovêre Trade'}
                        </span>
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <span>Ver Webinar</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        );

      case 'blog':
        return (
          <section
            key="blog"
            id="herramientas-importantes"
            className="scroll-mt-24"
          >
            <div id="novedades" className="scroll-mt-24" />
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3cac59] mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Notas de Blog & Información Clave</span>
                </div>
                <h2 className="font-baloo text-2xl sm:text-3xl font-extrabold text-[#4d4e4f] tracking-tight">
                  Herramientas Importantes
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {blogNotes.length} {blogNotes.length === 1 ? 'nota publicada' : 'notas publicadas'}
              </span>
            </div>

            {blogNotes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm font-semibold text-[#4d4e4f]">
                  Aún no hay notas de blog publicadas.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Publicá notas con la categoría &ldquo;Notas de Blog (Herramientas Importantes)&rdquo;
                  desde /admin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogNotes.map((note) => {
                  const coverSrc = getMediaUrl(note.coverImage);
                  const repLabel =
                    typeof note.representation === 'object' && note.representation !== null
                      ? `${note.representation.title} (${note.representation.brand})`
                      : note.brand || null;

                  return (
                    <article
                      key={`blog-${note.id}`}
                      className={`rounded-3xl overflow-hidden flex flex-col justify-between transition-all ${cardSurfaceClass}`}
                    >
                      <div>
                        {coverSrc && (
                          <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                            <img
                              src={coverSrc}
                              alt={note.title}
                              loading="lazy"
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2.5 py-1 rounded-lg bg-[#3cac59]/10 text-[#266f39] text-[11px] font-bold uppercase tracking-wide">
                              {note.highlight || 'Nota de Blog'}
                            </span>
                            {note.createdAt && (
                              <span className="text-[11px] text-slate-400 font-medium">
                                {formatDateAR(note.createdAt)}
                              </span>
                            )}
                          </div>

                          {repLabel && (
                            <p className="text-[11px] font-semibold text-[#1b87c7] flex items-center gap-1 mb-1">
                              <Building2 className="w-3 h-3" />
                              <span>{repLabel}</span>
                            </p>
                          )}

                          <h3 className="font-baloo text-lg font-extrabold text-[#4d4e4f] leading-snug mb-2">
                            {note.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4">
                            {note.plainDescription}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveBlogNote(note)}
                          className={`inline-flex items-center gap-1.5 text-xs font-bold ${accentTextClass} hover:underline cursor-pointer`}
                        >
                          <span>Leer nota completa</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {note.externalUrl && (
                          <a
                            href={note.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-[#1b87c7]"
                          >
                            <span>Enlace</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 0. AVISO URGENTE / CINTILLO SUPERIOR */}
      {alertBanner?.enabled && alertBanner?.message && (
        <div
          className={`rounded-2xl ${alertBgClass} text-white px-5 py-3.5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold leading-snug">{alertBanner.message}</p>
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

      {/* 1. PRIMER ELEMENTO: BANNER DE BIENVENIDA + CONFIGURACIÓN DE PERFIL Y ORDEN */}
      <div
        className={`relative overflow-hidden rounded-3xl ${welcomeBgClass} text-white p-7 sm:p-10 shadow-xl`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
              <span>{welcome?.badge || 'Portal Exclusivo para Profesionales de Turismo'}</span>
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

            <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/20 border border-white/15 backdrop-blur-sm text-xs sm:text-sm text-slate-100">
              <Shield className="w-5 h-5 text-[#3cac59] shrink-0 mt-0.5" />
              <span>
                <strong>{welcome?.b2bPolicyTitle || 'Política de Seguridad B2B:'}</strong>{' '}
                {welcome?.b2bPolicyText ||
                  'Por normativas de confidencialidad del trade, este portal no publica tarifas ni precios confidenciales al público. Los materiales están destinados a soporte de ventas, formación y cotización directa con operadores habilitados.'}
              </span>
            </div>
          </div>

          {/* Botón directo de Configuración de Perfil y Orden del Panel */}
          <div className="shrink-0">
            <Link
              href="/comunidad/dashboard/perfil"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Configurar mi perfil y orden</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* ESPACIO PUBLICITARIO 1 (SUPERIOR) */}
      <CommunityAdBannerSlot blocks={settings?.adBannerTop} />

      {/* SECCIONES DINÁMICAS EN EL ORDEN PERSONALIZADO POR EL USUARIO */}
      {orderedSections.slice(0, 3).map((sectionKey) => renderSection(sectionKey))}

      {/* ESPACIO PUBLICITARIO 2 (INTERMEDIO) */}
      <CommunityAdBannerSlot blocks={settings?.adBannerMiddle} />

      {orderedSections.slice(3).map((sectionKey) => renderSection(sectionKey))}

      {/* ESPACIO PUBLICITARIO 3 (INFERIOR) */}
      <CommunityAdBannerSlot blocks={settings?.adBannerBottom} />

      {/* CANAL DE WHATSAPP TRADE */}
      {whatsapp?.enabled !== false && whatsapp?.whatsappUrl && (
        <section
          className={`relative overflow-hidden rounded-3xl ${whatsappBgClass} text-white p-7 sm:p-9 shadow-xl`}
        >
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

      {/* MODAL DE LECTURA COMPLETA PARA NOTAS DE BLOG */}
      {activeBlogNote && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveBlogNote(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {getMediaUrl(activeBlogNote.coverImage) && (
              <div className="h-52 w-full overflow-hidden bg-slate-100">
                <img
                  src={getMediaUrl(activeBlogNote.coverImage)}
                  alt={activeBlogNote.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#3cac59]/10 text-[#266f39] text-xs font-bold uppercase">
                  {activeBlogNote.highlight || 'Herramienta Importante · Blog'}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveBlogNote(null)}
                  aria-label="Cerrar nota"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#4d4e4f] hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="font-baloo text-2xl font-extrabold text-[#4d4e4f] mb-4 leading-tight">
                {activeBlogNote.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line mb-6">
                {activeBlogNote.plainDescription}
              </p>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {activeBlogNote.externalUrl && (
                  <a
                    href={activeBlogNote.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold ${accentBtnClass}`}
                  >
                    <span>{activeBlogNote.ctaLabel || 'Abrir enlace relacionado'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveBlogNote(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#4d4e4f] text-xs font-bold cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
