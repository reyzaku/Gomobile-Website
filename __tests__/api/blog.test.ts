/**
 * TDD Tests: /api/blog
 * Tests are written BEFORE implementation.
 * All scenarios: 200, 201, 400, 401, 404, 409, 500
 */

import { MongoClient } from 'mongodb';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeReq(method: string, body?: object, auth?: string): Request {
  return new Request('http://localhost/api/blog', {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function makeSlugReq(
  method: string,
  slug: string,
  body?: object,
  auth?: string
): Request {
  return new Request(`http://localhost/api/blog/${slug}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

const ADMIN = process.env.ADMIN_SECRET ?? 'test-secret-key';

const VALID_POST = {
  slug: 'test-blog-post',
  img: '/assets/test.png',
  category: 'Programmatic',
  title: 'Test Blog Post',
  excerpt: 'A short excerpt for testing.',
  author: 'Test Author',
  authorRole: 'QA Engineer',
  date: 'May 1, 2026',
  readTime: '3 min read',
  body: {
    intro: 'Intro paragraph.',
    sections: [{ heading: 'Section 1', content: 'Content here.' }],
    conclusion: 'Conclusion here.',
  },
  tags: ['PROGRAMMATIC'],
  relatedSlugs: [],
  status: 'published',
};

// ── setup / teardown ──────────────────────────────────────────────────────────

let client: MongoClient;

beforeAll(async () => {
  client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
});

beforeEach(async () => {
  const db = client.db(process.env.MONGODB_DB);
  await db.collection('blogs').deleteMany({});
});

afterAll(async () => {
  await client.close();
});

// ── /api/blog — GET ───────────────────────────────────────────────────────────

describe('GET /api/blog', () => {
  it('200 — returns empty array when no posts', async () => {
    const { GET } = await import('../../app/api/blog/route');
    const res = await GET(makeReq('GET') as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it('200 — returns all published posts', async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('blogs').insertMany([
      { ...VALID_POST, status: 'published' },
      { ...VALID_POST, slug: 'another-post', title: 'Another', status: 'published' },
    ]);
    const { GET } = await import('../../app/api/blog/route');
    const res = await GET(makeReq('GET') as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(2);
  });

  it('200 — returns drafts when ?status=draft with auth', async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('blogs').insertMany([
      { ...VALID_POST, status: 'published' },
      { ...VALID_POST, slug: 'draft-post', status: 'draft' },
    ]);
    const { GET } = await import('../../app/api/blog/route');
    const req = new Request('http://localhost/api/blog?status=draft', {
      headers: { Authorization: `Bearer ${ADMIN}` },
    });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.some((p: any) => p.status === 'draft')).toBe(true);
  });
});

// ── /api/blog — POST ──────────────────────────────────────────────────────────

describe('POST /api/blog', () => {
  it('201 — creates a new post with valid data + auth', async () => {
    const { POST } = await import('../../app/api/blog/route');
    const res = await POST(makeReq('POST', VALID_POST, ADMIN) as any);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.slug).toBe(VALID_POST.slug);
    expect(data.title).toBe(VALID_POST.title);
  });

  it('400 — missing required fields returns errors array', async () => {
    const { POST } = await import('../../app/api/blog/route');
    const res = await POST(makeReq('POST', { title: 'No slug' }, ADMIN) as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.errors).toBeDefined();
    expect(Array.isArray(data.errors)).toBe(true);
  });

  it('401 — no auth header returns unauthorized', async () => {
    const { POST } = await import('../../app/api/blog/route');
    const res = await POST(makeReq('POST', VALID_POST) as any);
    expect(res.status).toBe(401);
  });

  it('401 — wrong token returns unauthorized', async () => {
    const { POST } = await import('../../app/api/blog/route');
    const res = await POST(makeReq('POST', VALID_POST, 'wrong-token') as any);
    expect(res.status).toBe(401);
  });

  it('409 — duplicate slug returns conflict', async () => {
    const { POST } = await import('../../app/api/blog/route');
    await POST(makeReq('POST', VALID_POST, ADMIN) as any);
    const res = await POST(makeReq('POST', VALID_POST, ADMIN) as any);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/slug/i);
  });
});

// ── /api/blog/[slug] — GET ────────────────────────────────────────────────────

describe('GET /api/blog/[slug]', () => {
  it('200 — returns post by slug', async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('blogs').insertOne({ ...VALID_POST });
    const { GET } = await import('../../app/api/blog/[slug]/route');
    const res = await GET(makeSlugReq('GET', VALID_POST.slug) as any, {
      params: { slug: VALID_POST.slug },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slug).toBe(VALID_POST.slug);
  });

  it('404 — unknown slug returns not found', async () => {
    const { GET } = await import('../../app/api/blog/[slug]/route');
    const res = await GET(makeSlugReq('GET', 'non-existent') as any, {
      params: { slug: 'non-existent' },
    });
    expect(res.status).toBe(404);
  });
});

// ── /api/blog/[slug] — PUT ────────────────────────────────────────────────────

describe('PUT /api/blog/[slug]', () => {
  beforeEach(async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('blogs').insertOne({ ...VALID_POST });
  });

  it('200 — updates existing post with auth', async () => {
    const { PUT } = await import('../../app/api/blog/[slug]/route');
    const res = await PUT(
      makeSlugReq('PUT', VALID_POST.slug, { title: 'Updated Title' }, ADMIN) as any,
      { params: { slug: VALID_POST.slug } }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe('Updated Title');
  });

  it('401 — no auth returns unauthorized', async () => {
    const { PUT } = await import('../../app/api/blog/[slug]/route');
    const res = await PUT(
      makeSlugReq('PUT', VALID_POST.slug, { title: 'Updated' }) as any,
      { params: { slug: VALID_POST.slug } }
    );
    expect(res.status).toBe(401);
  });

  it('404 — updating non-existent slug returns not found', async () => {
    const { PUT } = await import('../../app/api/blog/[slug]/route');
    const res = await PUT(
      makeSlugReq('PUT', 'ghost-slug', { title: 'X' }, ADMIN) as any,
      { params: { slug: 'ghost-slug' } }
    );
    expect(res.status).toBe(404);
  });
});

// ── /api/blog/[slug] — DELETE ─────────────────────────────────────────────────

describe('DELETE /api/blog/[slug]', () => {
  beforeEach(async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('blogs').insertOne({ ...VALID_POST });
  });

  it('204 — deletes existing post with auth', async () => {
    const { DELETE } = await import('../../app/api/blog/[slug]/route');
    const res = await DELETE(
      makeSlugReq('DELETE', VALID_POST.slug, undefined, ADMIN) as any,
      { params: { slug: VALID_POST.slug } }
    );
    expect(res.status).toBe(204);
  });

  it('401 — no auth returns unauthorized', async () => {
    const { DELETE } = await import('../../app/api/blog/[slug]/route');
    const res = await DELETE(
      makeSlugReq('DELETE', VALID_POST.slug) as any,
      { params: { slug: VALID_POST.slug } }
    );
    expect(res.status).toBe(401);
  });

  it('404 — deleting non-existent slug returns not found', async () => {
    const { DELETE } = await import('../../app/api/blog/[slug]/route');
    const res = await DELETE(
      makeSlugReq('DELETE', 'ghost-slug', undefined, ADMIN) as any,
      { params: { slug: 'ghost-slug' } }
    );
    expect(res.status).toBe(404);
  });
});
