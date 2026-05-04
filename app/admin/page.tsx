'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
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

type View = 'dashboard' | 'blog-editor' | 'case-editor';
type Section = 'overview' | 'blog' | 'cases';

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
  channels: [],
  tags: [],
  metrics: [],
  overview: { challenge: '', solution: '', result: '' },
  approach: [],
  testimonial: { quote: '', name: '', role: '' },
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

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
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* Left decorative panel */}
        <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-12 bg-[#0d0d0d] border-r border-white/[0.06] relative overflow-hidden">
          {/* Gradient blob */}
          <div
            className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ef6600 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[280px] h-[280px] rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #cb0000 0%, transparent 70%)' }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <Image
              src="/assets/gomobile-darkmode.svg"
              alt="Go Mobile"
              width={120}
              height={36}
              className="h-8 w-auto"
            />
          </div>

          {/* Copy */}
          <div className="relative z-10 flex flex-col gap-4">
            <h2 className="font-bricolage font-bold text-3xl leading-tight text-white">
              Your content,<br />
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                your control.
              </span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">
              Draft blog posts and case studies, export TypeScript, and ship to production in minutes.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-white/30 text-xs">ISR active — pages revalidate hourly</span>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-white/20 text-xs">
            Go Mobile CMS · Internal use only
          </div>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <div className="mb-8">
              {/* Mobile logo */}
              <div className="lg:hidden mb-6">
                <Image
                  src="/assets/gomobile-darkmode.svg"
                  alt="Go Mobile"
                  width={100}
                  height={30}
                  className="h-7 w-auto"
                />
              </div>
              <h1 className="text-2xl font-bold text-white font-bricolage">Sign in to CMS</h1>
              <p className="text-white/40 text-sm mt-1">Enter your password to continue</p>
            </div>

            <div className="flex flex-col gap-4">
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
                  className="w-full bg-white/[0.06] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-white/20"
                  placeholder="••••••••••••"
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
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>('dashboard');
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [adminBlogs, setAdminBlogs] = useState<BlogPost[]>([]);
  const [adminCases, setAdminCases] = useState<CaseStudy[]>([]);
  const [exportCode, setExportCode] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const blogRef = useRef<HTMLDivElement>(null);
  const caseRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

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
    setView('dashboard');
    setEditingBlog(null);
    showToast('Blog post saved to drafts ✓');
  }

  function handleSaveCase(cs: CaseStudy) {
    const idx = adminCases.findIndex((c) => c.slug === cs.slug);
    saveCases(idx >= 0 ? adminCases.map((c, i) => (i === idx ? cs : c)) : [...adminCases, cs]);
    setView('dashboard');
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

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function navTo(section: Section) {
    setActiveSection(section);
    if (section === 'blog') setTimeout(() => scrollTo(blogRef), 50);
    if (section === 'cases') setTimeout(() => scrollTo(caseRef), 50);
    if (section === 'overview') {
      mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* Editor full-screen takeovers */
  if (view === 'blog-editor') {
    return (
      <BlogEditor
        initial={editingBlog ?? defaultBlog}
        allBlogSlugs={[...BLOG_POSTS, ...adminBlogs].map((b) => b.slug)}
        onSave={handleSaveBlog}
        onCancel={() => { setView('dashboard'); setEditingBlog(null); }}
      />
    );
  }

  if (view === 'case-editor') {
    return (
      <CaseStudyEditor
        initial={editingCase ?? defaultCase}
        onSave={handleSaveCase}
        onCancel={() => { setView('dashboard'); setEditingCase(null); }}
      />
    );
  }

  const totalDrafts = adminBlogs.length + adminCases.length;

  /* ── Main layout ── */
  return (
    <div className="h-screen flex overflow-hidden bg-[#0a0a0a] text-white">

      {/* ── Left sidebar ── */}
      <aside className="w-56 shrink-0 flex flex-col bg-[#0c0c0c] border-r border-white/[0.06] overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06] shrink-0">
          <Image
            src="/assets/gomobile-darkmode.svg"
            alt="Go Mobile"
            width={100}
            height={30}
            className="h-7 w-auto"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 px-3 flex flex-col gap-6">
          {/* Overview */}
          <div>
            <NavLabel>Overview</NavLabel>
            <NavItem
              icon="⊞"
              label="Dashboard"
              active={activeSection === 'overview'}
              onClick={() => navTo('overview')}
            />
          </div>

          {/* Content */}
          <div>
            <NavLabel>Content</NavLabel>
            <NavItem
              icon="✍"
              label="Blog Posts"
              active={activeSection === 'blog'}
              badge={adminBlogs.length}
              onClick={() => navTo('blog')}
            />
            <NavItem
              icon="📊"
              label="Case Studies"
              active={activeSection === 'cases'}
              badge={adminCases.length}
              onClick={() => navTo('cases')}
            />
          </div>

          {/* Quick add */}
          <div>
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
          </div>

          {/* Account */}
          <div className="mt-auto">
            <NavLabel>Account</NavLabel>
            <NavItem
              icon="→"
              label="Sign Out"
              danger
              onClick={onLogout}
            />
          </div>
        </nav>

        {/* ISR status */}
        <div className="px-4 py-3 border-t border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
            <span className="text-[10px] text-white/30 leading-tight">ISR · revalidates hourly</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 h-14 border-b border-white/[0.06] bg-[#0c0c0c]/80 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-white/80">
              {activeSection === 'overview' && 'Dashboard'}
              {activeSection === 'blog' && 'Blog Posts'}
              {activeSection === 'cases' && 'Case Studies'}
            </h1>
            {totalDrafts > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/15 text-orange-400 text-[10px] font-bold rounded-full">
                {totalDrafts} pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setEditingBlog(null); setView('blog-editor'); }}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              + New Post
            </button>
            <button
              onClick={() => { setEditingCase(null); setView('case-editor'); }}
              className="border border-white/15 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:border-white/30 transition-all"
            >
              + Case Study
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div ref={mainScrollRef} className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-8 py-8 flex flex-col gap-8 max-w-5xl mx-auto w-full">

            {/* Welcome banner */}
            <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-white/[0.07] px-8 py-7">
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-25 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ef6600 0%, transparent 70%)' }}
              />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-1">
                    {getGreeting()}
                  </p>
                  <h2 className="font-bricolage font-bold text-2xl text-white leading-tight">
                    Go Mobile CMS
                  </h2>
                  {totalDrafts > 0 ? (
                    <p className="text-white/50 text-sm mt-1.5">
                      You have{' '}
                      <span className="text-orange-400 font-semibold">{totalDrafts} draft{totalDrafts !== 1 ? 's' : ''}</span>{' '}
                      waiting to be exported and published.
                    </p>
                  ) : (
                    <p className="text-white/50 text-sm mt-1.5">
                      All caught up — create a new post or case study to get started.
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-3xl">✦</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                value={BLOG_POSTS.length}
                label="Blog Posts"
                sub="published"
                icon="✍"
              />
              <StatCard
                value={CASE_STUDIES.length}
                label="Case Studies"
                sub="published"
                icon="📊"
              />
              <StatCard
                value={totalDrafts}
                label="Drafts"
                sub="pending export"
                icon="⏳"
                accent={totalDrafts > 0}
              />
              <StatCard
                value="1h"
                label="ISR Cache"
                sub="revalidation"
                icon="⟳"
                green
              />
            </div>

            {/* Blog Posts section */}
            <div ref={blogRef} className="flex flex-col gap-4">
              <SectionHeader
                title="Blog Posts"
                published={BLOG_POSTS.length}
                drafts={adminBlogs.length}
                primaryLabel="+ New Blog Post"
                onPrimary={() => { setEditingBlog(null); setView('blog-editor'); }}
                onExportAll={adminBlogs.length > 0 ? () => setExportCode(blogExport(adminBlogs)) : undefined}
              />

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

              <PostGroup label="Published" dimmed>
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

            {/* Case Studies section */}
            <div ref={caseRef} className="flex flex-col gap-4 pb-10">
              <SectionHeader
                title="Case Studies"
                published={CASE_STUDIES.length}
                drafts={adminCases.length}
                primaryLabel="+ New Case Study"
                onPrimary={() => { setEditingCase(null); setView('case-editor'); }}
                onExportAll={adminCases.length > 0 ? () => setExportCode(caseExport(adminCases)) : undefined}
              />

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

              <PostGroup label="Published" dimmed>
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

            {/* Workflow hint */}
            <div className="border border-white/[0.06] rounded-xl p-4 bg-white/[0.015] flex items-start gap-3">
              <span className="text-base shrink-0 mt-0.5">💡</span>
              <p className="text-white/30 text-xs leading-relaxed">
                <strong className="text-white/50">Publishing workflow:</strong> Draft posts live in your browser.
                Click <span className="text-orange-400/70">Export</span> to copy TypeScript, paste into{' '}
                <code className="bg-white/[0.07] px-1 py-0.5 rounded text-white/50">app/blog/data.ts</code> or{' '}
                <code className="bg-white/[0.07] px-1 py-0.5 rounded text-white/50">app/case-study/data.ts</code>,
                commit, and Vercel rebuilds automatically.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1a1a1a] border border-green-500/30 text-green-400 text-sm px-4 py-2.5 rounded-xl shadow-xl backdrop-blur-xl">
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

/* ─── Sidebar primitives ─────────────────────────────────────────────────── */

function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-2 mb-1">
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
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  danger?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left text-sm transition-all ${
        active
          ? 'bg-orange-500/15 text-orange-400 font-semibold'
          : danger
          ? 'text-white/30 hover:text-red-400 hover:bg-red-500/[0.07]'
          : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
      }`}
    >
      <span className="text-[13px] shrink-0 w-4 text-center leading-none">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-400 text-[10px] font-bold rounded-full shrink-0">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ─── Dashboard primitives ───────────────────────────────────────────────── */

function StatCard({
  value,
  label,
  sub,
  icon,
  accent = false,
  green = false,
}: {
  value: number | string;
  label: string;
  sub: string;
  icon: string;
  accent?: boolean;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-3 ${
        accent
          ? 'bg-orange-500/[0.07] border-orange-500/20'
          : green
          ? 'bg-green-500/[0.05] border-green-500/15'
          : 'bg-white/[0.025] border-white/[0.06]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-base">{icon}</span>
        <span className={`text-xs font-medium ${accent ? 'text-orange-400/60' : green ? 'text-green-400/60' : 'text-white/25'}`}>
          {sub}
        </span>
      </div>
      <div>
        <p className={`text-3xl font-bold font-bricolage leading-none ${accent ? 'text-orange-400' : green ? 'text-green-400' : 'text-white'}`}>
          {value}
        </p>
        <p className="text-xs text-white/40 mt-1">{label}</p>
      </div>
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
            <> · <span className="text-orange-400/70">{drafts} draft{drafts !== 1 ? 's' : ''}</span></>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        {onExportAll && (
          <button
            onClick={onExportAll}
            className="border border-white/12 text-white/50 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:border-white/25 transition-all"
          >
            Export all
          </button>
        )}
        <button
          onClick={onPrimary}
          className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
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
      <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 px-1 ${
        accent ? 'text-orange-400/60' : dimmed ? 'text-white/20' : 'text-white/35'
      }`}>
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
    <div className="flex items-center gap-3 bg-white/[0.025] border border-white/[0.06] rounded-xl px-3 py-2.5 hover:bg-white/[0.04] transition-colors group">
      {/* Thumbnail */}
      {img && (
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/[0.05]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-white/30 truncate mt-0.5">{meta}</p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button onClick={onEdit} className="text-white/50 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all">
            Edit
          </button>
        )}
        {onDuplicate && (
          <button onClick={onDuplicate} className="text-white/40 hover:text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/[0.07] transition-all">
            Duplicate
          </button>
        )}
        {onExport && (
          <button onClick={onExport} className="text-orange-400/60 hover:text-orange-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-orange-500/[0.08] transition-all">
            Export
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-white/25 hover:text-red-400 text-xs px-2.5 py-1.5 rounded-lg hover:bg-red-500/[0.08] transition-all">
            Delete
          </button>
        )}
      </div>
      <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold ${
        status === 'draft' ? 'bg-orange-500/15 text-orange-400' : 'bg-green-500/12 text-green-400'
      }`}>
        {status === 'draft' ? 'DRAFT' : 'LIVE'}
      </span>
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
