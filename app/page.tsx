import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import RepresentationsSection from '@/components/RepresentationsSection';
import PartnersSection from '@/components/PartnersSection';
import DistributionSection from '@/components/DistributionSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <RepresentationsSection />
      <PartnersSection />
      <DistributionSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

