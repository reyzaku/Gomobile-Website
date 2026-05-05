import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { isAdminAuthorized } from '@/lib/auth';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const db = await getDb();
    const post = await db
      .collection('blogs')
      .findOne({ slug }, { projection: { _id: 0 } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const body = await req.json();
    const db = await getDb();

    const result = await db.collection('blogs').findOneAndUpdate(
      { slug },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { _id: 0 } }
    );

    if (!result) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const db = await getDb();
    const result = await db.collection('blogs').deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
