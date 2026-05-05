/**
 * TDD Tests: /api/case-study
 * Tests are written BEFORE implementation.
 * All scenarios: 200, 201, 400, 401, 404, 409, 500
 */

import { MongoClient } from 'mongodb';

// ── helpers ───────────────────────────────────────────────────────────────────

function makeReq(method: string, body?: object, auth?: string): Request {
  return new Request('http://localhost/api/case-study', {
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
  return new Request(`http://localhost/api/case-study/${slug}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

const ADMIN = process.env.ADMIN_SECRET ?? 'test-secret-key';

const VALID_CASE = {
  slug: 'test-case-study',
  brand: 'Test Brand',
  category: 'Travel',
  headline: 'Test headline drove 50% lift.',
  img: '/assets/test.png',
  period: 'Q1 2026 · 8 weeks',
  tags: ['CTV', 'PROGRAMMATIC'],
  metrics: [{ v: '+50%', l: 'Lift', desc: 'Brand awareness lift' }],
  overview: {
    challenge: 'The challenge.',
    solution: 'The solution.',
    result: 'The result.',
  },
  approach: [{ title: 'Step 1', desc: 'We did this.' }],
  channels: ['CTV', 'Programmatic'],
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
  await db.collection('case_studies').deleteMany({});
});

afterAll(async () => {
  await client.close();
});

// ── /api/case-study — GET ─────────────────────────────────────────────────────

describe('GET /api/case-study', () => {
  it('200 — returns empty array when no case studies', async () => {
    const { GET } = await import('../../app/api/case-study/route');
    const res = await GET(makeReq('GET') as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it('200 — returns all published case studies', async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('case_studies').insertMany([
      { ...VALID_CASE },
      { ...VALID_CASE, slug: 'another-case', brand: 'Another Brand' },
    ]);
    const { GET } = await import('../../app/api/case-study/route');
    const res = await GET(makeReq('GET') as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(2);
  });

  it('200 — filters by category via ?category=Travel', async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('case_studies').insertMany([
      { ...VALID_CASE, category: 'Travel' },
      { ...VALID_CASE, slug: 'banking-case', category: 'Banking' },
    ]);
    const { GET } = await import('../../app/api/case-study/route');
    const req = new Request('http://localhost/api/case-study?category=Travel');
    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.every((c: any) => c.category === 'Travel')).toBe(true);
  });
});

// ── /api/case-study — POST ────────────────────────────────────────────────────

describe('POST /api/case-study', () => {
  it('201 — creates case study with valid data + auth', async () => {
    const { POST } = await import('../../app/api/case-study/route');
    const res = await POST(makeReq('POST', VALID_CASE, ADMIN) as any);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.slug).toBe(VALID_CASE.slug);
    expect(data.brand).toBe(VALID_CASE.brand);
  });

  it('400 — missing required fields returns errors array', async () => {
    const { POST } = await import('../../app/api/case-study/route');
    const res = await POST(makeReq('POST', { brand: 'No slug' }, ADMIN) as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.errors).toBeDefined();
    expect(Array.isArray(data.errors)).toBe(true);
  });

  it('401 — no auth returns unauthorized', async () => {
    const { POST } = await import('../../app/api/case-study/route');
    const res = await POST(makeReq('POST', VALID_CASE) as any);
    expect(res.status).toBe(401);
  });

  it('401 — wrong token returns unauthorized', async () => {
    const { POST } = await import('../../app/api/case-study/route');
    const res = await POST(makeReq('POST', VALID_CASE, 'bad-token') as any);
    expect(res.status).toBe(401);
  });

  it('409 — duplicate slug returns conflict', async () => {
    const { POST } = await import('../../app/api/case-study/route');
    await POST(makeReq('POST', VALID_CASE, ADMIN) as any);
    const res = await POST(makeReq('POST', VALID_CASE, ADMIN) as any);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/slug/i);
  });
});

// ── /api/case-study/[slug] — GET ─────────────────────────────────────────────

describe('GET /api/case-study/[slug]', () => {
  it('200 — returns case study by slug', async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('case_studies').insertOne({ ...VALID_CASE });
    const { GET } = await import('../../app/api/case-study/[slug]/route');
    const res = await GET(makeSlugReq('GET', VALID_CASE.slug) as any, {
      params: Promise.resolve({ slug: VALID_CASE.slug }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.slug).toBe(VALID_CASE.slug);
  });

  it('404 — unknown slug returns not found', async () => {
    const { GET } = await import('../../app/api/case-study/[slug]/route');
    const res = await GET(makeSlugReq('GET', 'no-such-case') as any, {
      params: Promise.resolve({ slug: 'no-such-case' }),
    });
    expect(res.status).toBe(404);
  });
});

// ── /api/case-study/[slug] — PUT ─────────────────────────────────────────────

describe('PUT /api/case-study/[slug]', () => {
  beforeEach(async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('case_studies').insertOne({ ...VALID_CASE });
  });

  it('200 — updates existing case study with auth', async () => {
    const { PUT } = await import('../../app/api/case-study/[slug]/route');
    const res = await PUT(
      makeSlugReq('PUT', VALID_CASE.slug, { headline: 'Updated Headline' }, ADMIN) as any,
      { params: Promise.resolve({ slug: VALID_CASE.slug }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.headline).toBe('Updated Headline');
  });

  it('401 — no auth returns unauthorized', async () => {
    const { PUT } = await import('../../app/api/case-study/[slug]/route');
    const res = await PUT(
      makeSlugReq('PUT', VALID_CASE.slug, { headline: 'X' }) as any,
      { params: Promise.resolve({ slug: VALID_CASE.slug }) }
    );
    expect(res.status).toBe(401);
  });

  it('404 — updating non-existent slug returns not found', async () => {
    const { PUT } = await import('../../app/api/case-study/[slug]/route');
    const res = await PUT(
      makeSlugReq('PUT', 'ghost', { headline: 'X' }, ADMIN) as any,
      { params: Promise.resolve({ slug: 'ghost' }) }
    );
    expect(res.status).toBe(404);
  });
});

// ── /api/case-study/[slug] — DELETE ──────────────────────────────────────────

describe('DELETE /api/case-study/[slug]', () => {
  beforeEach(async () => {
    const db = client.db(process.env.MONGODB_DB);
    await db.collection('case_studies').insertOne({ ...VALID_CASE });
  });

  it('204 — deletes existing case study with auth', async () => {
    const { DELETE } = await import('../../app/api/case-study/[slug]/route');
    const res = await DELETE(
      makeSlugReq('DELETE', VALID_CASE.slug, undefined, ADMIN) as any,
      { params: Promise.resolve({ slug: VALID_CASE.slug }) }
    );
    expect(res.status).toBe(204);
  });

  it('401 — no auth returns unauthorized', async () => {
    const { DELETE } = await import('../../app/api/case-study/[slug]/route');
    const res = await DELETE(
      makeSlugReq('DELETE', VALID_CASE.slug) as any,
      { params: Promise.resolve({ slug: VALID_CASE.slug }) }
    );
    expect(res.status).toBe(401);
  });

  it('404 — deleting non-existent slug returns not found', async () => {
    const { DELETE } = await import('../../app/api/case-study/[slug]/route');
    const res = await DELETE(
      makeSlugReq('DELETE', 'ghost', undefined, ADMIN) as any,
      { params: Promise.resolve({ slug: 'ghost' }) }
    );
    expect(res.status).toBe(404);
  });
});
