'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import type { BlogPost } from '@/app/blog/data';
import type { CaseStudy } from '@/app/case-study/data';
import { BLOG_POSTS } from '@/app/blog/data';
import { CASE_STUDIES } from '@/app/case-study/data';
import BlogEditor from './BlogEditor';
import CaseStudyEditor from './CaseStudyEditor';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const ADMIN_PASS = 'gomobile@2024';
const LS_BLOG = 'gm_admin_blogs';
const LS_CASE = 'gm_admin_cases';

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
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
  metrics: Array(4).fill(null).map(() => ({ v: '', l: '', desc: '' })),
  overview: { challenge: '', solution: '', result: '' },
  approach: [{ title: '', desc: '' }],
  channels: [],
};

/* ─── Root ───────────────────────────────────────────────────────────────── */

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
      <div className="min-h-screen bg-[#080808] flex overflow-hidden">
        {/* Left decorative panel */}
        <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-900/10 to-transparent" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-64 h-64 bg-red-600/8 rounded-full blur-3xl" />
          <div className="relative">
            <Image src="/assets/gomobile-darkmode.svg" alt="Go Mobile" width={140} height={36} className="opacity-90" />
          </div>
          <div className="relative">
            <p className="text-[10px] font-bold tracking-[4px] uppercase text-orange-500 mb-3">CONTENT MANAGEMENT</p>
            <h2 className="font-bricolage font-bold text-3xl text-white leading-[1.15]">
              Publish smarter.<br />Move faster.
            </h2>
            <p className="text-white/35 text-sm mt-3 leading-relaxed max-w-xs">
              Manage your blog posts and case studies. Changes go live on Vercel automatically.
            </p>
          </div>
          <div className="relative flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/30 text-xs">ISR enabled · Auto-deploys active</span>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8">
              <Image src="/assets/gomobile-darkmode.svg" alt="Go Mobile" width={120} height={30} />
            </div>
            <div className="mb-8">
              <h1 className="font-bricolage font-bold text-2xl text-white">Welcome back</h1>
              <p className="text-white/40 text-sm mt-1">Sign in to manage your content</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs font-medium uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => { setPw(e.target.value); setPwErr(''); }}
                  className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-white/20"
                  placeholder="Enter your password"
                  autoFocus
                />
                {pwErr && <p className="text-red-400 text-xs mt-1.5">{pwErr}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </form>

            <p className="text-white/15 text-xs mt-8 text-center">Go Mobile CMS · Internal use only</p>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>('list');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [adminBlogs, setAdminBlogs] = useState<BlogPost[]>([]);
  const [adminCases, setAdminCases] = useState<CaseStudy[]>([]);
  const [exportCode, setExportCode] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const blogRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef<HTMLDivElement>(null);

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
    saveBlogs(idx >= 0 ? adminBlogs.map((b, i) => (i === idx ? post : b)) : [...adminBlogs, post]);
    setView('list');
    setEditingBlog(null);
    showToast('Blog post saved to drafts ✓');
  }

  function handleSaveCase(cs: CaseStudy) {
    const idx = adminCases.findIndex((c) => c.slug === cs.slug);
    saveCases(idx >= 0 ? adminCases.map((c, i) => (i === idx ? cs : c)) : [...adminCases, cs]);
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
        onCancel={() => { setView('list'); setEditingBlog(null); }}
      />
    );
  }

  if (view === 'case-editor') {
    return (
      <CaseStudyEditor
        initial={editingCase ?? defaultCase}
        onSave={handleSaveCase}
        onCancel={() => { setView('list'); setEditingCase(null); }}
      />
    );
  }

  const totalDrafts = adminBlogs.length + adminCases.length;

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-56 shrink-0 bg-[#0c0c0c] border-r border-white/[0.06] flex flex-col">
        {/* Logo */}
        <div className="h-16 shrink-0 border-b border-white/[0.06] flex items-center px-5">
          <Image src="/assets/gomobile-darkmode.svg" alt="Go Mobile" width={110} height={28} />
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-2.5 space-y-0.5">
          <NavLabel>Overview</NavLabel>
          <NavItem icon="⊞" label="Dashboard" active />

          <NavLabel>Content</NavLabel>
          <NavItem
            icon="✦"
            label="Blog Posts"
            badge={BLOG_POSTS.length}
            draftCount={adminBlogs.length}
            onClick={() => blogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          />
          <NavItem
            icon="◈"
            label="Case Studies"
            badge={CASE_STUDIES.length}
            draftCount={adminCases.length}
            onClick={() => caseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          />

          <NavLabel>Quick Add</NavLabel>
          <NavItem
            icon="+"
            label="New Blog Post"
            onClick={() => { setEditingBlog(null); setView('blog-editor'); }}
          />
          <NavItem
            icon="+"
            label="New Case Study"
            onClick={() => { setEditingCase(null); setView('case-editor'); }}
          />

          <NavLabel>Account</NavLabel>
          <NavItem icon="→" label="Sign Out" danger onClick={onLogout} />
        </nav>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-white/30 text-[10px]">Vercel · ISR Live</span>
          </div>
          <p className="text-white/15 text-[9px]">Go Mobile CMS v1.0</p>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-white/[0.06] flex items-center justify-between px-8 bg-[#0a0a0a]/95 backdrop-blur-xl">
          <div>
            <h1 className="text-sm font-semibold text-white/80">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {totalDrafts > 0 && (
              <span className="bg-orange-500/15 border border-orange-500/20 text-orange-400 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                {totalDrafts} draft{totalDrafts !== 1 ? 's' : ''} pending
              </span>
            )}
            <button
              onClick={() => { setEditingBlog(null); setView('blog-editor'); }}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              + Blog Post
            </button>
            <button
              onClick={() => { setEditingCase(null); setView('case-editor'); }}
              className="border border-white/15 text-white/55 hover:text-white hover:border-white/30 rounded-lg px-4 py-1.5 text-xs transition-all"
            >
              + Case Study
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-8 py-7 space-y-7 max-w-5xl">

            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/[0.07] px-8 py-7">
              <div className="absolute -right-20 -top-20 w-72 h-72 bg-gradient-to-br from-orange-500/15 to-red-600/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 bottom-0 w-48 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[4px] uppercase text-orange-500 mb-2">
                    CONTENT MANAGEMENT
                  </p>
                  <h2 className="font-bricolage font-bold text-[28px] text-white leading-tight">
                    {getGreeting()}, Admin 🔥
                  </h2>
                  <p className="text-white/40 text-sm mt-2 max-w-md">
                    {totalDrafts > 0
                      ? `You have ${totalDrafts} draft${totalDrafts !== 1 ? 's' : ''} pending export. Export and commit to publish.`
                      : 'All content is published and live. Create something new!'}
                  </p>
                </div>
                <a
                  href="/blog"
                  target="_blank"
                  className="shrink-0 flex items-center gap-2 border border-white/15 text-white/50 hover:text-white hover:border-white/30 rounded-xl px-4 py-2.5 text-xs transition-all"
                >
                  <span>View Live Blog</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                value={BLOG_POSTS.length}
                label="Blog Posts"
                sub="Published live"
                icon="✦"
              />
              <StatCard
                value={CASE_STUDIES.length}
                label="Case Studies"
                sub="Published live"
                icon="◈"
              />
              <StatCard
                value={totalDrafts}
                label="Drafts"
                sub={totalDrafts > 0 ? 'Pending export' : 'All clear'}
                icon="✎"
                accent={totalDrafts > 0}
              />
              <StatCard
                value="ISR"
                label="Blog Caching"
                sub="Revalidates / 1h"
                icon="⚡"
                green
              />
            </div>

            {/* Blog Posts */}
            <div ref={blogRef}>
              <SectionHeader
                title="Blog Posts"
                published={BLOG_POSTS.length}
                drafts={adminBlogs.length}
                primaryLabel="+ New Blog Post"
                onPrimary={() => { setEditingBlog(null); setView('blog-editor'); }}
                onExportAll={adminBlogs.length > 0 ? () => setExportCode(blogExport(adminBlogs)) : undefined}
              />

              <div className="space-y-4 mt-4">
                {adminBlogs.length > 0 && (
                  <PostGroup label="Drafts" accent>
                    {adminBlogs.map((post) => (
                      <PostRow
                        key={post.slug}
                        title={post.title || '(Untitled)'}
                        meta={[post.category, post.date].filter(Boolean).join(' · ')}
                        img={post.img}
                        status="draft"
                        onEdit={() => { setEditingBlog(post); setView('blog-editor'); }}
                        onDelete={() => setDeleteConfirm(`blog:${post.slug}`)}
                        onExport={() => setExportCode(blogExport([post]))}
                      />
                    ))}
                  </PostGroup>
                )}

                <PostGroup label="Published">
                  {BLOG_POSTS.map((post) => (
                    <PostRow
                      key={post.slug}
                      title={post.title}
                      meta={[post.category, post.date].filter(Boolean).join(' · ')}
                      img={post.img}
                      status="published"
                      onDuplicate={() => {
                        setEditingBlog({ ...post, slug: post.slug + '-copy', title: post.title + ' (Copy)' });
                        setView('blog-editor');
                      }}
                    />
                  ))}
                </PostGroup>
              </div>
            </div>

            {/* Case Studies */}
            <div ref={caseRef}>
              <SectionHeader
                title="Case Studies"
                published={CASE_STUDIES.length}
                drafts={adminCases.length}
                primaryLabel="+ New Case Study"
                onPrimary={() => { setEditingCase(null); setView('case-editor'); }}
                onExportAll={adminCases.length > 0 ? () => setExportCode(caseExport(adminCases)) : undefined}
              />

              <div className="space-y-4 mt-4">
                {adminCases.length > 0 && (
                  <PostGroup label="Drafts" accent>
                    {adminCases.map((cs) => (
                      <PostRow
                        key={cs.slug}
                        title={cs.brand ? `${cs.brand}${cs.headline ? ' — ' + cs.headline : ''}` : '(Untitled)'}
                        meta={[cs.category, cs.period].filter(Boolean).join(' · ')}
                        img={cs.img}
                        status="draft"
                        onEdit={() => { setEditingCase(cs); setView('case-editor'); }}
                        onDelete={() => setDeleteConfirm(`case:${cs.slug}`)}
                        onExport={() => setExportCode(caseExport([cs]))}
                      />
                    ))}
                  </PostGroup>
                )}

                <PostGroup label="Published">
                  {CASE_STUDIES.map((cs) => (
                    <PostRow
                      key={cs.slug}
                      title={`${cs.brand} — ${cs.headline}`}
                      meta={[cs.category, cs.period].filter(Boolean).join(' · ')}
                      img={cs.img}
                      status="published"
                      onDuplicate={() => {
                        setEditingCase({ ...cs, slug: cs.slug + '-copy', brand: cs.brand + ' (Copy)' });
                        setView('case-editor');
                      }}
                    />
                  ))}
                </PostGroup>
              </div>
            </div>

            {/* Workflow hint */}
            <div className="border border-white/[0.06] rounded-2xl p-5 bg-white/[0.015] flex items-start gap-3 mb-8">
              <span className="text-base shrink-0 mt-0.5">💡</span>
              <div className="text-white/35 text-xs leading-relaxed">
                <strong className="text-white/55">Publishing workflow:</strong> Drafts are saved in your browser.
                Click <span className="text-orange-400/80 font-medium">Export</span> on a draft → copy the TypeScript
                → paste into{' '}
                <code className="bg-white/[0.07] px-1.5 py-0.5 rounded text-white/50">app/blog/data.ts</code>{' '}
                or{' '}
                <code className="bg-white/[0.07] px-1.5 py-0.5 rounded text-white/50">app/case-study/data.ts</code>
                {' '}→ commit → Vercel auto-deploys via ISR.
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-green-500/30 text-green-400 text-sm px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-xl">
          {toast}
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
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
                  if (deleteConfirm.startsWith('blog:')) handleDeleteBlog(deleteConfirm.replace('blog:', ''));
                  else handleDeleteCase(deleteConfirm.replace('case:', ''));
                }}
                className="bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 rounded-lg px-4 py-2 text-sm transition-all"
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

/* ─── Sidebar primitives ─────────────────────────────────────────────────── */

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/22 px-3 pt-3 pb-1">
      {children}
    </p>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  danger = false,
  badge,
  draftCount,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  draftCount?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
        active
          ? 'bg-gradient-to-r from-orange-500/15 to-red-600/8 text-white border border-orange-500/20'
          : danger
          ? 'text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.07]'
          : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
      }`}
    >
      <span className={`text-sm w-4 text-center shrink-0 ${active ? 'text-orange-400' : ''}`}>{icon}</span>
      <span className="flex-1 text-xs font-medium">{label}</span>
      {badge !== undefined && (
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
            draftCount && draftCount > 0
              ? 'bg-orange-500/20 text-orange-400'
              : 'bg-white/[0.06] text-white/30'
          }`}
        >
          {draftCount && draftCount > 0 ? `${draftCount}d / ${badge}` : badge}
        </span>
      )}
    </button>
  );
}

/* ─── Dashboard components ───────────────────────────────────────────────── */

function StatCard({
  value,
  label,
  sub,
  icon,
  accent = false,
  green = false,
}: {
  value: string | number;
  label: string;
  sub: string;
  icon: string;
  accent?: boolean;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? 'bg-orange-500/[0.07] border-orange-500/20'
          : green
          ? 'bg-green-500/[0.05] border-green-500/12'
          : 'bg-white/[0.025] border-white/[0.07]'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-base ${
            accent
              ? 'bg-orange-500/15 text-orange-400'
              : green
              ? 'bg-green-500/12 text-green-400'
              : 'bg-white/[0.06] text-white/50'
          }`}
        >
          {icon}
        </span>
        <span
          className={`font-bricolage font-bold text-3xl leading-none ${
            accent ? 'text-orange-400' : green ? 'text-green-400' : 'text-white'
          }`}
        >
          {value}
        </span>
      </div>
      <p className="text-sm font-semibold text-white/75">{label}</p>
      <p className="text-[11px] text-white/30 mt-0.5">{sub}</p>
    </div>
  );
}

function SectionHeader({
  title,
  published,
  drafts,
  primaryLabel,
  onPrimary,
  onExportAll,
}: {
  title: string;
  published: number;
  drafts: number;
  primaryLabel: string;
  onPrimary: () => void;
  onExportAll?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-base font-bold text-white">{title}</h2>
        <p className="text-white/30 text-xs mt-0.5">
          {published} published
          {drafts > 0 && (
            <span className="text-orange-400/70">
              {' '}· {drafts} draft{drafts !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        {onExportAll && (
          <button
            onClick={onExportAll}
            className="border border-white/12 text-white/50 hover:text-white hover:border-white/25 rounded-lg px-3 py-1.5 text-xs transition-all"
          >
            Export all drafts
          </button>
        )}
        <button
          onClick={onPrimary}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg px-4 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}

function PostGroup({
  label,
  accent = false,
  children,
}: {
  label: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.12em] mb-2 ${
          accent ? 'text-orange-400/60' : 'text-white/20'
        }`}
      >
        {label}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function PostRow({
  title,
  meta,
  img,
  status,
  onEdit,
  onDelete,
  onExport,
  onDuplicate,
}: {
  title: string;
  meta: string;
  img?: string;
  status: 'draft' | 'published';
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onDuplicate?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 bg-white/[0.025] border border-white/[0.06] rounded-xl px-4 py-3 hover:bg-white/[0.04] transition-colors group">
      {/* Thumbnail */}
      {img && (
        <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 border border-white/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="w-full h-full object-cover opacity-60" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/85 truncate">{title}</p>
        <p className="text-xs text-white/30 mt-0.5 truncate">{meta}</p>
      </div>

      {/* Status badge */}
      <span
        className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide ${
          status === 'draft'
            ? 'bg-orange-500/15 text-orange-400'
            : 'bg-green-500/12 text-green-400'
        }`}
      >
        {status === 'draft' ? 'Draft' : 'Live'}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-white/45 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all"
          >
            Edit
          </button>
        )}
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            className="text-white/35 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all"
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
            className="text-white/20 hover:text-red-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/[0.08] transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Export modal ───────────────────────────────────────────────────────── */

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
            <p className="text-[11px] text-white/30 mt-0.5">
              Copy → paste into data.ts → commit → Vercel deploys
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
            <button onClick={onClose} className="text-white/35 hover:text-white px-3 py-1.5 text-sm transition-colors">
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
  return `// ─── Paste into app/blog/data.ts → inside the BLOG_POSTS array ───\n// Add a comma after the last existing entry before pasting.\n\n${entries}`;
}

function caseExport(cases: CaseStudy[]): string {
  const entries = cases.map((c) => JSON.stringify(c, null, 2)).join(',\n');
  return `// ─── Paste into app/case-study/data.ts → inside the CASE_STUDIES array ───\n// Add a comma after the last existing entry before pasting.\n\n${entries}`;
}
