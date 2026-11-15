import Link from 'next/link';
import { footerContent, siteConfig } from '@/data/content';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
                <span className="text-white font-black text-sm">P</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              {footerContent.description}
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors"
              >
                <span>{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors"
              >
                <span>{siteConfig.email}</span>
              </a>
              <p className="text-sm text-gray-600">{siteConfig.address}</p>
            </div>
          </div>

          {/* Nav columns */}
          {footerContent.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-brand-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">{footerContent.legal}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Privacidad
            </a>
            <span className="text-xs text-gray-700">
              Hecho con ♥ en Argentina
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
