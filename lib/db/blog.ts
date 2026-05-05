import { getDb } from '@/lib/mongodb';
import type { BlogPost } from '@/lib/models/blog';

export async function getDbPosts(status: 'published' | 'draft' | 'all' = 'published'): Promise<BlogPost[]> {
  const db = await getDb();
  const query = status === 'all' ? {} : { status };
  return db
    .collection<BlogPost>('blogs')
    .find(query, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getDbPost(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  return db
    .collection<BlogPost>('blogs')
    .findOne({ slug }, { projection: { _id: 0 } });
}

export async function getDbRelatedPosts(slugs: string[]): Promise<BlogPost[]> {
  if (!slugs.length) return [];
  const db = await getDb();
  return db
    .collection<BlogPost>('blogs')
    .find({ slug: { $in: slugs }, status: 'published' }, { projection: { _id: 0 } })
    .toArray();
}
