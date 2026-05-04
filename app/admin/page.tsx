'use client';

import { useState, useEffect, useCallback } from 'react';
import type { BlogPost } from '@/app/blog/data';
import type { CaseStudy } from '@/app/case-study/data';
import { BLOG_POSTS } from '@/app/blog/data';
import { CASE_STUDIES } from '@/app/case-study/data';
import BlogEditor from './BlogEditor';
import CaseStudyEditor from './CaseStudyEditor';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const ADMIN_PASS = 'gomobile@2024';
const LS_BLOG = 'gm_admin_blogs';
const LS_CASE = 'gm_admin_cases';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Tab = 'blog' | 'case-study';
type View = 'list' | 'blog-editor' | 'case-editor';

/* ─── Default templates ──────────────────────────────────────────────────── */

const defaultBlog: BlogPost = {
  slug: '',
  img: '/assets/featured-case-1.png',
  category: 'Programmatic',
  title: '',
  excerpt: '',
  author: '',
  authorRole: '',
  date: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  readTime: '5 min read',
  body: { intro: '', sections: [], conclusion: '' },
  blocks: [],
  tags: [],
  relatedSlugs: [],
};

const defaultCase: CaseStudy = {
  slug: '',
  brand: '',
  category: 'Travel',
  headline: '',
  img: '/assets/featured-case-1.png',
  period: '',
  tags: [],
  metrics: Array(4)
    .fill(null)
    .map(() => ({ v: '', l: '', desc: '' })),
  overview: { challenge: '', solution: '', result: '' },
  approach: [{ title: '', desc: '' }],
  channels: [],
};

/* ─── Root component ─────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('gm_admin') === '1') setAuthed(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASS) {
      sessionStorage.setItem('gm_admin', '1');
      setAuthed(true);
    } else {
      setPwErr('Incorrect password. Try again.');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('gm_admin');
    setAuthed(false);
    setPw('');
    setPwErr('');
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-xl font-bold text-white font-bricolage">
              Go Mobile{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                CMS
              </span>
            </h1>
            <p className="text-white/40 text-sm mt-1">Sign in to manage content</p>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value);
                  setPwErr('');
                }}
                className="w-full bg-white/[0.06] border border-white/[0.10] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/40 transition-colors placeholder:text-white/20"
                placeholder="••••••••••••"
                autoFocus
              />
              {pwErr && <p className="text-red-400 text-xs mt-1.5">{pwErr}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('blog');
  const [view, setView] = useState<View>('list');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [adminBlogs, setAdminBlogs] = useState<BlogPost[]>([]);
  const [adminCases, setAdminCases] = useState<CaseStudy[]>([]);
  const [exportCode, setExportCode] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    try {
      const b = localStorage.getItem(LS_BLOG);
      const c = localStorage.getItem(LS_CASE);
      if (b) setAdminBlogs(JSON.parse(b));
      if (c) setAdminCases(JSON.parse(c));
    } catch {}
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  function saveBlogs(posts: BlogPost[]) {
    setAdminBlogs(posts);
    localStorage.setItem(LS_BLOG, JSON.stringify(posts));
  }

  function saveCases(cases: CaseStudy[]) {
    setAdminCases(cases);
    localStorage.setItem(LS_CASE, JSON.stringify(cases));
  }

  function handleSaveBlog(post: BlogPost) {
    const idx = adminBlogs.findIndex((b) => b.slug === post.slug);
    saveBlogs(
      idx >= 0 ? adminBlogs.map((b, i) => (i === idx ? post : b)) : [...adminBlogs, post]
    );
    setView('list');
    setEditingBlog(null);
    showToast('Blog post saved to drafts ✓');
  }

  function handleSaveCase(cs: CaseStudy) {
    const idx = adminCases.findIndex((c) => c.slug === cs.slug);
    saveCases(
      idx >= 0 ? adminCases.map((c, i) => (i === idx ? cs : c)) : [...adminCases, cs]
    );
    setView('list');
    setEditingCase(null);
    showToast('Case study saved to drafts ✓');
  }

  function handleDeleteBlog(slug: string) {
    saveBlogs(adminBlogs.filter((b) => b.slug !== slug));
    setDeleteConfirm(null);
    showToast('Draft deleted');
  }

  function handleDeleteCase(slug: string) {
    saveCases(adminCases.filter((c) => c.slug !== slug));
    setDeleteConfirm(null);
    showToast('Draft deleted');
  }

  if (view === 'blog-editor') {
    return (
      <BlogEditor
        initial={editingBlog ?? defaultBlog}
        allBlogSlugs={[...BLOG_POSTS, ...adminBlogs].map((b) => b.slug)}
        onSave={handleSaveBlog}
        onCancel={() => {
          setView('list');
          setEditingBlog(null);
        }}
      />
    );
  }

  if (view === 'case-editor') {
    return (
      <CaseStudyEditor
        initial={editingCase ?? defaultCase}
        onSave={handleSaveCase}
        onCancel={() => {
          setView('list');
          setEditingCase(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold font-bricolage text-sm">
              Go Mobile{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                CMS
              </span>
            </span>
            <nav className="flex gap-1">
              {(
                [
                  ['blog', 'Blog Posts'],
                  ['case-study', 'Case Studies'],
                ] as [Tab, string][]
              ).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    tab === t
                      ? 'bg-orange-500/15 text-orange-400 font-semibold'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={onLogout}
            className="text-white/35 hover:text-white/70 text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === 'blog' && (
          <ContentSection
            title="Blog Posts"
            draftCount={adminBlogs.length}
            publishedCount={BLOG_POSTS.length}
            onNew={() => {
              setEditingBlog(null);
              setView('blog-editor');
            }}
            onExportAll={
              adminBlogs.length > 0
                ? () => setExportCode(blogExport(adminBlogs))
                : undefined
            }
            newLabel="+ New Blog Post"
          >
            {/* Drafts */}
            {adminBlogs.length > 0 && (
              <PostGroup label="Drafts" accent>
                {adminBlogs.map((post) => (
                  <PostRow
                    key={post.slug}
                    title={post.title || '(Untitled)'}
                    meta={[post.category, post.date].filter(Boolean).join(' · ')}
                    status="draft"
                    slug={post.slug}
                    onEdit={() => {
                      setEditingBlog(post);
                      setView('blog-editor');
                    }}
                    onDelete={() => setDeleteConfirm(`blog:${post.slug}`)}
                    onExport={() => setExportCode(blogExport([post]))}
                  />
                ))}
              </PostGroup>
            )}

            {/* Published */}
            <PostGroup label="Published" dimmed>
              {BLOG_POSTS.map((post) => (
                <PostRow
                  key={post.slug}
                  title={post.title}
                  meta={[post.category, post.date].filter(Boolean).join(' · ')}
                  status="published"
                  slug={post.slug}
                  onDuplicate={() => {
                    setEditingBlog({
                      ...post,
                      slug: post.slug + '-copy',
                      title: post.title + ' (Copy)',
                    });
                    setView('blog-editor');
                  }}
                />
              ))}
            </PostGroup>
          </ContentSection>
        )}

        {tab === 'case-study' && (
          <ContentSection
            title="Case Studies"
            draftCount={adminCases.length}
            publishedCount={CASE_STUDIES.length}
            onNew={() => {
              setEditingCase(null);
              setView('case-editor');
            }}
            onExportAll={
              adminCases.length > 0
                ? () => setExportCode(caseExport(adminCases))
                : undefined
            }
            newLabel="+ New Case Study"
          >
            {/* Drafts */}
            {adminCases.length > 0 && (
              <PostGroup label="Drafts" accent>
                {adminCases.map((cs) => (
                  <PostRow
                    key={cs.slug}
                    title={cs.brand ? `${cs.brand}${cs.headline ? ' — ' + cs.headline : ''}` : '(Untitled)'}
                    meta={[cs.category, cs.period].filter(Boolean).join(' · ')}
                    status="draft"
                    slug={cs.slug}
                    onEdit={() => {
                      setEditingCase(cs);
                      setView('case-editor');
                    }}
                    onDelete={() => setDeleteConfirm(`case:${cs.slug}`)}
                    onExport={() => setExportCode(caseExport([cs]))}
                  />
                ))}
              </PostGroup>
            )}

            {/* Published */}
            <PostGroup label="Published" dimmed>
              {CASE_STUDIES.map((cs) => (
                <PostRow
                  key={cs.slug}
                  title={`${cs.brand} — ${cs.headline}`}
                  meta={[cs.category, cs.period].filter(Boolean).join(' · ')}
                  status="published"
                  slug={cs.slug}
                  onDuplicate={() => {
                    setEditingCase({
                      ...cs,
                      slug: cs.slug + '-copy',
                      brand: cs.brand + ' (Copy)',
                    });
                    setView('case-editor');
                  }}
                />
              ))}
            </PostGroup>
          </ContentSection>
        )}
      </main>

      {/* ── Export info banner ── */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.02] flex items-start gap-3">
          <span className="text-lg shrink-0">💡</span>
          <div className="text-white/40 text-xs leading-relaxed">
            <strong className="text-white/60">Publishing workflow:</strong> Draft posts are saved in your browser.
            Click{' '}
            <span className="text-orange-400/80">Export</span> on any draft to generate TypeScript, then paste
            it into <code className="bg-white/[0.08] px-1 py-0.5 rounded text-white/60">app/blog/data.ts</code>{' '}
            or{' '}
            <code className="bg-white/[0.08] px-1 py-0.5 rounded text-white/60">app/case-study/data.ts</code>,
            commit, and Vercel will rebuild automatically.
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-green-500/30 text-green-400 text-sm px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toast}
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-white font-semibold mb-2">Delete draft?</h3>
            <p className="text-white/50 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="border border-white/15 text-white/60 hover:text-white rounded-lg px-4 py-2 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.startsWith('blog:'))
                    handleDeleteBlog(deleteConfirm.replace('blog:', ''));
                  else handleDeleteCase(deleteConfirm.replace('case:', ''));
                }}
                className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-lg px-4 py-2 text-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Export modal ── */}
      {exportCode && <ExportModal code={exportCode} onClose={() => setExportCode(null)} />}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function ContentSection({
  title,
  draftCount,
  publishedCount,
  onNew,
  onExportAll,
  newLabel,
  children,
}: {
  title: string;
  draftCount: number;
  publishedCount: number;
  onNew: () => void;
  onExportAll?: () => void;
  newLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-white/35 text-sm mt-0.5">
            {publishedCount} published
            {draftCount > 0 && (
              <>
                {' '}·{' '}
                <span className="text-orange-400/70">
                  {draftCount} draft{draftCount !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {onExportAll && (
            <button
              onClick={onExportAll}
              className="border border-white/15 text-white/60 hover:text-white hover:border-white/30 rounded-lg px-4 py-2 text-sm transition-all"
            >
              Export all drafts
            </button>
          )}
          <button
            onClick={onNew}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {newLabel}
          </button>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function PostGroup({
  label,
  accent = false,
  dimmed = false,
  children,
}: {
  label: string;
  accent?: boolean;
  dimmed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${
          accent ? 'text-orange-400/60' : dimmed ? 'text-white/25' : 'text-white/40'
        }`}
      >
        {label}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function PostRow({
  title,
  meta,
  status,
  slug,
  onEdit,
  onDelete,
  onExport,
  onDuplicate,
}: {
  title: string;
  meta: string;
  status: 'draft' | 'published';
  slug: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onDuplicate?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-white/[0.04] transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-white/35 truncate">{meta}</span>
          {slug && (
            <span className="text-[10px] text-white/20 font-mono hidden sm:inline">
              /{slug}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-white/50 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all"
          >
            Edit
          </button>
        )}
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="text-white/40 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all"
          >
            Duplicate
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="text-orange-400/60 hover:text-orange-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-orange-500/[0.08] transition-all"
          >
            Export
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-white/25 hover:text-red-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/[0.08] transition-all"
          >
            Delete
          </button>
        )}
      </div>
      <span
        className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
          status === 'draft'
            ? 'bg-orange-500/15 text-orange-400'
            : 'bg-green-500/12 text-green-400'
        }`}
      >
        {status === 'draft' ? 'DRAFT' : 'LIVE'}
      </span>
    </div>
  );
}

function ExportModal({ code, onClose }: { code: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div>
            <p className="text-sm font-semibold text-white">Export TypeScript</p>
            <p className="text-[11px] text-white/35 mt-0.5">
              Copy → paste into the data.ts file → commit → Vercel deploys
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copy}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                copied
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy code'}
            </button>
            <button
              onClick={onClose}
              className="text-white/35 hover:text-white px-3 py-1.5 text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <pre className="p-5 text-[11px] text-white/70 font-mono overflow-auto max-h-[55vh] leading-relaxed whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </div>
  );
}

/* ─── Export generators ──────────────────────────────────────────────────── */

function blogExport(posts: BlogPost[]): string {
  const entries = posts.map((p) => JSON.stringify(p, null, 2)).join(',\n');
  return `// ─── Paste into app/blog/data.ts → inside the BLOG_POSTS array ───
// Add a comma after the last existing entry before pasting.

${entries}`;
}

function caseExport(cases: CaseStudy[]): string {
  const entries = cases.map((c) => JSON.stringify(c, null, 2)).join(',\n');
  return `// ─── Paste into app/case-study/data.ts → inside the CASE_STUDIES array ───
// Add a comma after the last existing entry before pasting.

${entries}`;
}
