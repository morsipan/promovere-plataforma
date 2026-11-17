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
    navItems?: NavItem[];
    ctaLabel?: string;
    ctaHref?: string;
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
  const logoImageUrl = getMediaUrl(data?.logoImage, '');
  const items: Array<{ id?: string; label: string; href: string; newTab?: boolean | null }> =
    data?.navItems && data.navItems.length > 0 ? data.navItems : navLinks;
  const ctaLabel = data?.ctaLabel || 'Iniciar Sesión';
  const ctaHref = data?.ctaHref || '/comunidad/login';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {logoImageUrl ? (
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                <Image src={logoImageUrl} alt={logoText} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center shadow-md shadow-[#1b87c7]/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-base tracking-tight">P</span>
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span
                className={`font-black text-xl tracking-tight transition-colors ${
                  scrolled ? 'text-[#4d4e4f]' : 'text-white'
                }`}
              >
                {logoText}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  scrolled ? 'text-[#3cac59]' : 'text-[#3cac59]'
                }`}
              >
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {items.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.newTab ? '_blank' : undefined}
                rel={link.newTab ? 'noopener noreferrer' : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white font-bold text-sm hover:bg-[#1571a8] active:bg-[#0f5b89] shadow-lg shadow-[#1b87c7]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-[#3cac59]" />
              <span>{ctaLabel}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled
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
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
              <Sparkles className="w-4 h-4 text-[#3cac59]" />
              <span>{ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
