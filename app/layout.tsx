import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Promovêre | Representación y Promoción Turística en LATAM',
  description:
    'Especialistas en promoción turística en LATAM. Conectamos destinos, hoteles y marcas de viajes con los mercados más dinámicos de América Latina.',
  keywords:
    'Promovere, representaciones turísticas, marketing turístico, relaciones públicas turismo, Vê REPS, FIT, LATAM turismo, agencias de viajes',
  authors: [{ name: 'Promovêre' }],
  metadataBase: new URL('https://promovere.com.ar'),
  openGraph: {
    title: 'Promovêre | Representación y Promoción Turística en LATAM',
    description:
      'Conectamos destinos, hoteles y marcas turísticas con los mercados más dinámicos de América Latina.',
    url: 'https://promovere.com.ar',
    siteName: 'Promovêre',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-[#f9f9f9] text-[#4d4e4f] antialiased`}>
        {children}
      </body>
    </html>
  );
}
