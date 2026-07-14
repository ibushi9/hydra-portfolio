import Preloader from "@/components/Preloader";
import SiteNav from "@/components/SiteNav";
import Hero from "@/components/Hero";
import MarqueeBand from "@/components/MarqueeBand";
import VideoCarousel from "@/components/VideoCarousel";
import StatsBar from "@/components/StatsBar";
import ServicesSection from "@/components/ServicesSection";
import CaseStudies from "@/components/CaseStudies";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <GrainOverlay />
      <Preloader />
      <SiteNav />
      <Hero />
      <MarqueeBand />
      <VideoCarousel />
      <StatsBar />
      <ServicesSection />
      <CaseStudies />
      <ContactSection />
      <Footer />
    </>
  );
}
