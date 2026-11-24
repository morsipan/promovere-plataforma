'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { navLinks, siteConfig } from '@/data/content';
import { getMediaUrl } from '@/lib/media';

export interface NavItem {
  id?: string;
  label: string;
  href: string;
  newTab?: boolean;
}

export interface NavbarProps {
  data?: {
    logoText?: string;
    tagline?: string;
    logoImage?: any;
    logoTypeImage?: any;
    logoImageTransparent?: any;
    logoTypeImageTransparent?: any;
    navItems?: NavItem[];
    ctaLabel?: string;
    ctaHref?: string;
    ctaShowIcon?: boolean;
  } | null;
}

export default function Navbar({ data }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoText = data?.logoText || siteConfig.name;
  const tagline = data?.tagline || 'Turismo LATAM';
  const isotypeImageUrl = getMediaUrl(data?.logoImage, '');
  const logoTypeImageUrl = getMediaUrl(data?.logoTypeImage, '');
  const isotypeTransparentUrl = getMediaUrl(data?.logoImageTransparent, '');
  const logoTypeTransparentUrl = getMediaUrl(data?.logoTypeImageTransparent, '');

  // Logotipo e isotipo dinámicos: se prioriza la versión para fondo transparente cuando no hay scroll
  const activeLogoTypeUrl = !scrolled && logoTypeTransparentUrl ? logoTypeTransparentUrl : logoTypeImageUrl;
  const activeIsotypeUrl = !scrolled && isotypeTransparentUrl ? isotypeTransparentUrl : isotypeImageUrl;

  const rawItems: Array<{ id?: string; label: string; href: string; newTab?: boolean | null }> =
    data?.navItems && data.navItems.length > 0 ? data.navItems : navLinks;

  // Las Preguntas Frecuentes (FAQs) se ubican exclusivamente en el Footer (AEO)
  const items = rawItems.filter((item) => {
    const hrefLower = (item.href || '').toLowerCase();
    const labelLower = (item.label || '').toLowerCase();
    const isFaqHref = hrefLower === '/faq' || hrefLower === '#faq' || hrefLower.endsWith('/faq');
    const isFaqLabel =
      labelLower === 'faq' ||
      labelLower === 'faqs' ||
      labelLower.includes('preguntas frecuentes');
    return !isFaqHref && !isFaqLabel;
  });
  const ctaLabel = data?.ctaLabel || 'Iniciar Sesión';
  const ctaHref = data?.ctaHref || '/comunidad/login';

  return (
    <header
      suppressHydrationWarning
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Marca */}
          <Link href="/" suppressHydrationWarning className="flex items-center gap-2.5 sm:gap-3 group">
            {/* 1. Isotipo / Ícono */}
            {activeIsotypeUrl ? (
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src={activeIsotypeUrl}
                  alt={logoText || 'Promovêre Isotipo'}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : !activeLogoTypeUrl ? (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center shadow-md shadow-[#1b87c7]/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-white font-black text-base tracking-tight">P</span>
              </div>
            ) : null}

            {/* 2. Logotipo: Imagen O Texto */}
            {activeLogoTypeUrl ? (
              <div className={`relative h-8 sm:h-9 w-32 sm:w-44 transition-all duration-300 ${!scrolled ? 'drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]' : ''}`}>
                <Image
                  src={activeLogoTypeUrl}
                  alt={logoText || 'Promovêre'}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            ) : (
              <div suppressHydrationWarning className="flex flex-col leading-tight">
                <span
                  suppressHydrationWarning
                  className={`font-black text-xl tracking-tight transition-colors ${
                    scrolled ? 'text-[#4d4e4f]' : 'text-white'
                  }`}
                >
                  {logoText}
                </span>
                {tagline ? (
                  <span
                    suppressHydrationWarning
                    className={`text-[10px] font-bold uppercase tracking-widest transition-colors text-[#3cac59]`}
                  >
                    {tagline}
                  </span>
                ) : null}
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav suppressHydrationWarning className="hidden md:flex items-center gap-1 lg:gap-2">
            {items.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.newTab ? '_blank' : undefined}
                rel={link.newTab ? 'noopener noreferrer' : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${scrolled
                  ? 'text-[#4d4e4f] hover:text-[#1b87c7] hover:bg-[#1b87c7]/5'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Iniciar Sesión a Comunidad */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href={ctaHref}
              suppressHydrationWarning
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white font-bold text-sm hover:bg-[#1571a8] active:bg-[#0f5b89] shadow-lg shadow-[#1b87c7]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              {data?.ctaShowIcon !== false && (
                <Sparkles className="w-4 h-4 text-[#3cac59]" />
              )}
              <span suppressHydrationWarning>{ctaLabel}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            suppressHydrationWarning
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled
              ? 'text-[#4d4e4f] hover:bg-gray-100'
              : 'text-white hover:bg-white/10'
              }`}
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="bg-[#f9f9f9] border-t border-gray-200 px-4 py-4 space-y-1 shadow-xl">
          {items.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-[#4d4e4f] hover:text-[#1b87c7] hover:bg-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            <Link
              href={ctaHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1b87c7] text-white font-bold text-sm shadow-md shadow-[#1b87c7]/30"
            >
              {data?.ctaShowIcon !== false && (
                <Sparkles className="w-4 h-4 text-[#3cac59]" />
              )}
              <span>{ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
