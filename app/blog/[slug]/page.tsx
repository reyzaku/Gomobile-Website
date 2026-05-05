import { notFound } from "next/navigation";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { ContactCTA } from "../../components/ContactCTA";
import { BackgroundGrain } from "../../components/BackgroundGrain";
import { BlogPostDetail } from "./BlogPostDetail";
import { getDbPost, getDbRelatedPosts } from "@/lib/db/blog";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getDbPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Go Mobile Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getDbPost(slug);
  if (!post) notFound();

  const related = await getDbRelatedPosts(post.relatedSlugs ?? []);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundGrain />
      <Nav />
      <BlogPostDetail post={post} related={related} />
      <ContactCTA />
      <Footer />
    </main>
  );
}
