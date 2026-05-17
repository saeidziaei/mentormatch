import ConsultationCTA from "../components/ConsultationCTA";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Navbar from "../components/Navbar";
import TutorsCarousel from "../components/TutorsCarousel";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-body text-slate-900">
      <Navbar />
      <Hero />
      <HowItWorks />
      <TutorsCarousel />
      <ConsultationCTA />
      <Footer />
    </div>
  );
}
