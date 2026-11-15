import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import RepresentationsSection from '@/components/RepresentationsSection';
import DistributionSection from '@/components/DistributionSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getPayload } from 'payload';
import config from '@payload-config';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let homePage = null;

  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
      depth: 2,
    });
    if (docs && docs.length > 0) {
      homePage = docs[0];
    }
  } catch (error) {
    // Si la base de datos aún no fue sembrada, continúa con el contenido estático por defecto
    console.warn('Payload Pages: cargando contenido estático por defecto.');
  }

  // Extracción de bloques de contenido desde Payload si existen
  const layout = (homePage?.layout as any[]) || [];
  const heroBlock = layout.find((b) => b.blockType === 'hero');

  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <Navbar />
      <HeroSection data={heroBlock} />
      <ServicesSection />
      <RepresentationsSection />
      <DistributionSection />
      <PartnersSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
