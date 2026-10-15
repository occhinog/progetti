import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PhilosophySection from './components/PhilosophySection';
import BrainSection from './components/BrainSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import MethodSection from './components/MethodSection';
import SupportSection from './components/SupportSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Vai al contenuto
      </a>
      <Navbar />
      <main id="contenuto">
        <Hero />
        <PhilosophySection />
        <BrainSection />
        <CaseStudiesSection />
        <MethodSection />
        <SupportSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
