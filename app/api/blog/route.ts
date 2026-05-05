import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { validateBlogPost } from '@/lib/models/blog';
import { isAdminAuthorized } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    let query: Record<string, any> = { status: 'published' };

    if (statusFilter && isAdminAuthorized(req)) {
      query = statusFilter === 'all' ? {} : { status: statusFilter };
    }

    const posts = await db
      .collection('blogs')
      .find(query, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const errors = validateBlogPost(body);
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection('blogs').findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const now = new Date();
    const post = { ...body, createdAt: now, updatedAt: now };
    await db.collection('blogs').insertOne(post);

    const { _id, ...result } = post as any;
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
