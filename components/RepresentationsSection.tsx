import Image from 'next/image';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { representationsContent } from '@/data/content';

export default function RepresentationsSection() {
  return (
    <section id="representaciones" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-badge mb-4">{representationsContent.badge}</span>
          <h2 className="section-title mb-4">{representationsContent.title}</h2>
          <p className="section-subtitle">{representationsContent.subtitle}</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {representationsContent.items.map((item, index) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-3xl cursor-pointer ${
                index === 0 ? 'sm:col-span-2 lg:col-span-1 lg:row-span-2' : ''
              }`}
              style={{ minHeight: index === 0 ? '480px' : '280px' }}
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider border border-white/20">
                  {item.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
                  {item.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm mb-4">{item.subtitle}</p>
                <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ExternalLink className="w-4 h-4" />
                  Ver más
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#contacto" className="btn-primary">
            Sumar tu marca
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

