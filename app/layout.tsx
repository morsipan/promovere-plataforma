import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Promovere | Representación Turística LATAM',
  description:
    'Conectamos destinos, hoteles y marcas turísticas con los mercados más dinámicos de América Latina.',
  keywords: 'representación turística, agencia turismo, LATAM, turismo Argentina, marketing turístico',
  authors: [{ name: 'Promovere' }],
  openGraph: {
    title: 'Promovere | Representación Turística LATAM',
    description:
      'Conectamos destinos, hoteles y marcas turísticas con los mercados más dinámicos de América Latina.',
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
      <body className={`${inter.variable} font-sans bg-white`}>
        {children}
      </body>
    </html>
  );
}
