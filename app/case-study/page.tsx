import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ContactCTA } from "../components/ContactCTA";
import { BackgroundGrain } from "../components/BackgroundGrain";
import { PageHero } from "../components/PageHero";
import { CaseStudyBody } from "./CaseStudyBody";
export const metadata = {
  title: "Case Studies — Go Mobile",
  description: "Campaigns that moved the numbers. Real brands, real lift, real results.",
};

export default function CaseStudyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundGrain />
      <Nav />
      <PageHero
        eyebrow="CASE STUDIES"
        title={
          <>
            Campaigns that<br />moved the <span className="text-gradient-animated">numbers</span>.
          </>
        }
        lede="A look at how we plan, buy, and optimize for brands across categories — and the lift we delivered."
      />
      <CaseStudyBody />
      <ContactCTA />
      <Footer />
    </main>
  );
}
