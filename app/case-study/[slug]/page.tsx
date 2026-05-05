import { notFound } from "next/navigation";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { ContactCTA } from "../../components/ContactCTA";
import { BackgroundGrain } from "../../components/BackgroundGrain";
import { getDbCaseStudy, getDbCaseStudies } from "@/lib/db/case-study";
import { CaseStudyDetail } from "./CaseStudyDetail";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getDbCaseStudy(slug);
  if (!c) return {};
  return {
    title: `${c.brand} Case Study — Go Mobile`,
    description: c.headline,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getDbCaseStudy(slug);
  if (!data) notFound();

  const allCases = await getDbCaseStudies('published');
  const idx = allCases.findIndex((c) => c.slug === slug);
  const nextCase = allCases[(idx + 1) % allCases.length] ?? null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundGrain />
      <Nav />
      <CaseStudyDetail data={data} nextCase={nextCase} />
      <ContactCTA />
      <Footer />
    </main>
  );
}
