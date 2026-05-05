import { getDb } from '@/lib/mongodb';
import type { CaseStudy } from '@/lib/models/case-study';

export async function getDbCaseStudies(status: 'published' | 'draft' | 'all' = 'published'): Promise<CaseStudy[]> {
  const db = await getDb();
  const query = status === 'all' ? {} : { status };
  return db
    .collection<CaseStudy>('case_studies')
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getDbCaseStudy(slug: string): Promise<CaseStudy | null> {
  const db = await getDb();
  return db
    .collection<CaseStudy>('case_studies')
    .findOne({ slug }, { projection: { _id: 0 } });
}
