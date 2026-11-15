import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import RepresentationsSection from '@/components/RepresentationsSection';
import DistributionSection from '@/components/DistributionSection';
import PartnersSection from '@/components/PartnersSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f9f9]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <RepresentationsSection />
      <DistributionSection />
      <PartnersSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
