import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ContactCTA } from "../components/ContactCTA";
import { BackgroundGrain } from "../components/BackgroundGrain";
import { PageHero } from "../components/PageHero";
import { BlogBody } from "./BlogBody";
import { getDbPosts } from "@/lib/db/blog";

export const dynamic = 'force-dynamic';
export const metadata = {
  title: "Blog — Go Mobile",
  description: "Insights on programmatic, performance, and the future of advertising.",
};

export default async function BlogPage() {
  const posts = await getDbPosts('published');

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
      <BlogBody posts={posts} />
      <ContactCTA />
      <Footer />
    </main>
  );
}
