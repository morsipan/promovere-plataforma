import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { footerContent, siteConfig } from '@/data/content';

export default function Footer() {
  return (
    <footer className="bg-[#4d4e4f] text-gray-300 border-t border-white/10">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b87c7] to-[#3cac59] flex items-center justify-center shadow-md">
                <span className="text-white font-black text-base">P</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-black text-xl tracking-tight">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#3cac59]">
                  Turismo LATAM
                </span>
              </div>
            </Link>

            <p className="text-gray-300/80 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              {footerContent.description}
            </p>

            {/* Direct Contact */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 text-gray-300 hover:text-[#3cac59] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#3cac59] flex-shrink-0" />
                <span>{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2.5 text-gray-300 hover:text-[#1b87c7] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#1b87c7] flex-shrink-0" />
                <span>{siteConfig.email}</span>
              </a>
              <div className="flex items-start gap-2.5 text-gray-300/90">
                <MapPin className="w-4 h-4 text-[#3cac59] flex-shrink-0 mt-0.5" />
                <span>
                  {siteConfig.address} - {siteConfig.addressDetail}
                </span>
              </div>
            </div>
          </div>

          {/* Links Columns (8 cols: 3 + 3 + 2) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerContent.columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-gray-300/80 hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center gap-1 group"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>{footerContent.legal}</p>
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
