import type { Metadata } from 'next';
import { Baloo_Da_2, Roboto } from 'next/font/google';
import '../globals.css';

const balooDa2 = Baloo_Da_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-baloo-da-2',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
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

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${balooDa2.variable} ${roboto.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body
        className="font-sans bg-[#f9f9f9] text-[#4d4e4f] antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
