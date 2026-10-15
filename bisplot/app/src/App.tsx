import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import SolutionsSection from './components/SolutionsSection';
import HumanFactorSection from './components/HumanFactorSection';
import MethodSection from './components/MethodSection';
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
        <ProblemSection />
        <SolutionsSection />
        <HumanFactorSection />
        <MethodSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
