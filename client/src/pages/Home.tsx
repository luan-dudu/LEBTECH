import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Solutions from '@/components/Solutions';
import PortfolioSection from '@/components/PortfolioSection';
import StatsCharts from '@/components/StatsCharts';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Solutions />
        <PortfolioSection />
        <StatsCharts />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
