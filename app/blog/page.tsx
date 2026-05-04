import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ContactCTA } from "../components/ContactCTA";
import { BackgroundGrain } from "../components/BackgroundGrain";
import { PageHero } from "../components/PageHero";
import { BlogBody } from "./BlogBody";
export const metadata = {
  title: "Blog — Go Mobile",
  description: "Insights on programmatic, performance, and the future of advertising.",
};

export default function BlogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundGrain />
      <Nav />
      <PageHero
        eyebrow="JOURNAL"
        title={
          <>
            Notes from the<br /><span className="text-gradient-animated">trade desk</span>.
          </>
        }
        lede="Working theories, post-mortems, and field notes from buying media every day across SEA."
      />
      <BlogBody />
      <ContactCTA />
      <Footer />
    </main>
  );
}
