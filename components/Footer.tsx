import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ArrowUpRight, HelpCircle } from 'lucide-react';
import { faqContent, footerContent, siteConfig } from '@/data/content';
import { getMediaUrl } from '@/lib/media';
import FooterFaqAccordion, { type FooterFaqItem } from '@/components/FooterFaqAccordion';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" />
    </svg>
  );
}

export interface FooterColumn {
  title: string;
  links?: {
    label: string;
    href: string;
  }[];
}

export type { FooterFaqItem };

export interface FooterProps {
  data?: {
    logoImage?: any;
    logoTypeImage?: any;
    brandDescription?: string;
    columns?: FooterColumn[];
    copyrightText?: string;
    disclaimerText?: string;
    faqSection?: {
      enabled?: boolean | null;
      title?: string | null;
      subtitle?: string | null;
      items?: FooterFaqItem[] | null;
    } | null;
  } | null;
  settings?: {
    companyName?: string;
    legalName?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    commercialEmail?: string;
    address?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  } | null;
}

export default function Footer({ data, settings }: FooterProps) {
  const companyName = settings?.companyName || siteConfig.name;
  const brandDescription = data?.brandDescription || footerContent.description;
  const phone = settings?.phone || siteConfig.phone;
  const email = settings?.email || siteConfig.email;
  const address = settings?.address || `${siteConfig.address} - ${siteConfig.addressDetail}`;
  const copyrightText = data?.copyrightText || footerContent.legal;
  const disclaimerText = data?.disclaimerText;

  const footerIsotypeUrl = getMediaUrl(data?.logoImage, '');
  const footerLogoTypeUrl =
    getMediaUrl(data?.logoTypeImage, '') || (!footerIsotypeUrl ? '/assets/SVG/logo-footer.svg' : '');

  const rawColumns =
    data?.columns && data.columns.length > 0 ? data.columns : footerContent.columns;

  // Garantizar que ningún enlace de FAQ apunte a rutas inexistentes (/faq -> #faq)
  const columns = rawColumns.map((col) => ({
    ...col,
    links: (col.links || []).map((link) => ({
      ...link,
      href: link.href === '/faq' ? '#faq' : link.href,
    })),
  }));

  const showFaqs = data?.faqSection?.enabled !== false;
  const faqTitle = data?.faqSection?.title || faqContent.title;
  const faqSubtitle = data?.faqSection?.subtitle || faqContent.subtitle;
  const faqItems: FooterFaqItem[] =
    data?.faqSection?.items && data.faqSection.items.length > 0
      ? data.faqSection.items
      : faqContent.items;

  // Schema.org FAQPage JSON-LD para Answer Engine Optimization (AEO)
  const faqJsonLd =
    showFaqs && faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  const socialLinks = [
    { label: 'Instagram', href: settings?.instagram, icon: InstagramIcon },
    { label: 'LinkedIn', href: settings?.linkedin, icon: LinkedinIcon },
    { label: 'Facebook', href: settings?.facebook, icon: FacebookIcon },
    { label: 'YouTube', href: settings?.youtube, icon: YoutubeIcon },
  ].filter((s) => Boolean(s.href));

  return (
    <footer suppressHydrationWarning className="bg-[#4d4e4f] text-[#f9f9f9]/85 border-t border-white/10 font-sans">
      {/* JSON-LD estructurado para AEO (FAQPage) */}
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      {/* Bloque Semántico de Preguntas Frecuentes (AEO) — Ubicado exclusivamente en el Footer */}
      {showFaqs && faqItems.length > 0 ? (
        <section
          id="faq"
          aria-labelledby="footer-faq-heading"
          className="border-b border-white/10 bg-black/15"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3cac59]/15 border border-[#3cac59]/30 text-[#3cac59] text-[11px] font-bold uppercase tracking-wider mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Preguntas Frecuentes</span>
              </div>
              <h2
                id="footer-faq-heading"
                className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight"
              >
                {faqTitle}
              </h2>
              {faqSubtitle ? (
                <p className="text-xs sm:text-sm text-[#f9f9f9]/75 mt-1.5 leading-relaxed">
                  {faqSubtitle}
                </p>
              ) : null}
            </div>

            <FooterFaqAccordion items={faqItems} />
          </div>
        </section>
      ) : null}

      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              {/* Isotipo (solo si está cargado en CMS) */}
              {footerIsotypeUrl ? (
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  <Image
                    src={footerIsotypeUrl}
                    alt={companyName || 'Promovêre Isotipo'}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : null}

              {/* Logotipo Imagen (CMS o SVG oficial) o Texto */}
              {footerLogoTypeUrl ? (
                <div className="relative h-9 w-36 sm:w-48">
                  <Image
                    src={footerLogoTypeUrl}
                    alt={companyName}
                    fill
                    unoptimized
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="flex flex-col leading-tight">
                  <span className="font-heading text-white font-black text-xl tracking-tight">
                    {companyName}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3cac59]">
                    Marketing Turístico
                  </span>
                </div>
              )}
            </Link>

            <p className="text-[#f9f9f9]/75 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              {brandDescription}
            </p>

            {/* Direct Contact */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2.5 text-[#f9f9f9]/85 hover:text-[#3cac59] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#3cac59] flex-shrink-0" />
                  <span>{phone}</span>
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-[#f9f9f9]/85 hover:text-[#1b87c7] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#1b87c7] flex-shrink-0" />
                  <span>{email}</span>
                </a>
              )}
              {address && (
                <div className="flex items-start gap-2.5 text-[#f9f9f9]/80">
                  <MapPin className="w-4 h-4 text-[#3cac59] flex-shrink-0 mt-0.5" />
                  <span>{address}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#f9f9f9]/80 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Links Columns (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-heading text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {(col.links || []).map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-[#f9f9f9]/75 hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center gap-1 group"
                      >
                        <span>{link.label}</span>
                        {link.href.startsWith('#') ? null : (
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f9f9f9]/65">
          <div>
            <p>{copyrightText}</p>
            {disclaimerText && <p className="text-[11px] text-[#f9f9f9]/55 mt-1">{disclaimerText}</p>}
          </div>
          <div className="flex items-center gap-6">
            <span>promovere.com.ar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3cac59]" />
            <span>Buenos Aires, Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
