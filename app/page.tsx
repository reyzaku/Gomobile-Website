import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { TrustedBy } from "./components/TrustedBy";
import { Services } from "./components/Services";
import { CaseStudies } from "./components/CaseStudies";
import { GoNetDSP } from "./components/GoNetDSP";
import { HowWeWork } from "./components/HowWeWork";
import { ContactCTA } from "./components/ContactCTA";
import { Footer } from "./components/Footer";
import { BackgroundGrain } from "./components/BackgroundGrain";
export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundGrain />
      <Nav />
      <Hero />
      <TrustedBy />
      <Services />
      <CaseStudies />
      <GoNetDSP />
      <HowWeWork />
      <ContactCTA />
      <Footer />
    </main>
  );
}
