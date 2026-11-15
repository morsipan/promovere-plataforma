'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { navLinks, siteConfig } from '@/data/content';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center shadow-md shadow-[#1b87c7]/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-base tracking-tight">P</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={`font-black text-xl tracking-tight transition-colors ${
                  scrolled ? 'text-[#4d4e4f]' : 'text-white'
                }`}
              >
                {siteConfig.name}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  scrolled ? 'text-[#3cac59]' : 'text-[#3cac59]'
                }`}
              >
                Turismo LATAM
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
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

          {/* CTA & Portal Comunidad */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contacto"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                scrolled
                  ? 'text-[#4d4e4f] hover:text-[#3cac59] hover:bg-[#3cac59]/10'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#3cac59]" />
              Comunidad
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1b87c7] text-white font-semibold text-sm hover:bg-[#1571a8] active:bg-[#0f5b89] shadow-lg shadow-[#1b87c7]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              Contacto
              <ArrowUpRight className="w-4 h-4" />
            </a>
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
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-[#4d4e4f] hover:text-[#1b87c7] hover:bg-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
            <a
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-[#4d4e4f] font-semibold text-sm"
            >
              <Sparkles className="w-4 h-4 text-[#3cac59]" />
              Portal Comunidad
            </a>
            <a
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1b87c7] text-white font-bold text-sm shadow-md shadow-[#1b87c7]/30"
            >
              Contactar a Promovêre
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
