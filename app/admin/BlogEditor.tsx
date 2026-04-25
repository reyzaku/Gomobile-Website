'use client';

import { useState } from 'react';
import type { BlogPost } from '@/app/blog/data';
import { Block, Field, ChipInput, AdminHeader, inputCls } from './components';

const CATEGORIES = ['Programmatic', 'Creative', 'CTV', 'Measurement', 'Industry'];
const ASSETS = [
  '/assets/featured-case-1.png',
  '/assets/featured-case-2.png',
  '/assets/featured-case-3.png',
  '/assets/service-thumb-programmatic.png',
  '/assets/service-thumb-video.png',
  '/assets/service-thumb-richmedia.png',
  '/assets/service-thumb-social.png',
];

function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Props {
  initial: BlogPost;
  allBlogSlugs: string[];
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

export default function BlogEditor({ initial, allBlogSlugs, onSave, onCancel }: Props) {
  const [post, setPost] = useState<BlogPost>(initial);
  const [tagInput, setTagInput] = useState('');
  const [slugLocked, setSlugLocked] = useState(!!initial.slug);
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    info: true,
    body: true,
    tags: false,
    related: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) =>
    setPost((p) => ({ ...p, [k]: v }));

  const setBody = <K extends keyof BlogPost['body']>(k: K, v: BlogPost['body'][K]) =>
    setPost((p) => ({ ...p, body: { ...p.body, [k]: v } }));

  const toggle = (name: string) =>
    setOpenBlocks((prev) => ({ ...prev, [name]: !prev[name] }));

  function handleTitleChange(val: string) {
    set('title', val);
    if (!slugLocked) set('slug', toSlug(val));
  }

  function addSection() {
    setBody('sections', [...post.body.sections, { heading: '', content: '' }]);
  }

  function removeSection(i: number) {
    setBody(
      'sections',
      post.body.sections.filter((_, idx) => idx !== i)
    );
  }

  function setSection(i: number, k: 'heading' | 'content', v: string) {
    setBody(
      'sections',
      post.body.sections.map((s, idx) => (idx === i ? { ...s, [k]: v } : s))
    );
  }

  function addTag() {
    const t = tagInput.trim().toUpperCase();
    if (t && !post.tags.includes(t)) set('tags', [...post.tags, t]);
    setTagInput('');
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!post.title.trim()) e.title = 'Title is required';
    if (!post.slug.trim()) e.slug = 'Slug is required';
    if (!post.excerpt.trim()) e.excerpt = 'Excerpt is required';
    if (!post.author.trim()) e.author = 'Author is required';
    if (!post.body.intro.trim()) e.intro = 'Intro is required';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setOpenBlocks({ info: true, body: true, tags: false, related: false });
    }
    return Object.keys(e).length === 0;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminHeader
        breadcrumbs={['Blog Posts', post.title || 'New Post']}
        onPrimary={() => validate() && onSave(post)}
        primaryLabel="Save Post"
        onCancel={onCancel}
      />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-3">
        {/* ── Block 1: Post Information ── */}
        <Block label="Post Information" icon="📝" open={openBlocks.info} onToggle={() => toggle('info')}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title" error={errors.title} className="col-span-2">
              <input
                value={post.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={inputCls(!!errors.title)}
                placeholder="Post title"
              />
            </Field>

            <Field label="Slug (URL path)" error={errors.slug}>
              <div className="relative">
                <input
                  value={post.slug}
                  onChange={(e) => {
                    set('slug', toSlug(e.target.value));
                    setSlugLocked(true);
                  }}
                  className={inputCls(!!errors.slug)}
                  placeholder="post-url-slug"
                />
              </div>
              {!errors.slug && (
                <p className="text-white/25 text-[10px] mt-1">
                  {post.slug ? `/blog/${post.slug}` : 'Auto-generated from title'}
                </p>
              )}
            </Field>

            <Field label="Category">
              <select
                value={post.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls()}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Author" error={errors.author}>
              <input
                value={post.author}
                onChange={(e) => set('author', e.target.value)}
                className={inputCls(!!errors.author)}
                placeholder="e.g. Reza Adhi"
              />
            </Field>

            <Field label="Author Role">
              <input
                value={post.authorRole}
                onChange={(e) => set('authorRole', e.target.value)}
                className={inputCls()}
                placeholder="e.g. Head of Programmatic"
              />
            </Field>

            <Field label="Date">
              <input
                value={post.date}
                onChange={(e) => set('date', e.target.value)}
                className={inputCls()}
                placeholder="Apr 18, 2026"
              />
            </Field>

            <Field label="Read Time">
              <input
                value={post.readTime}
                onChange={(e) => set('readTime', e.target.value)}
                className={inputCls()}
                placeholder="8 min read"
              />
            </Field>

            <Field label="Cover Image" className="col-span-2">
              <select
                value={post.img}
                onChange={(e) => set('img', e.target.value)}
                className={inputCls()}
              >
                {ASSETS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <div className="mt-2 h-24 rounded-lg overflow-hidden border border-white/[0.07]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.img}
                  alt=""
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
            </Field>

            <Field label="Excerpt" error={errors.excerpt} className="col-span-2">
              <textarea
                value={post.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                className={`${inputCls(!!errors.excerpt)} resize-none`}
                rows={2}
                placeholder="A one or two sentence summary shown in the blog listing..."
              />
            </Field>
          </div>
        </Block>

        {/* ── Block 2: Body Content ── */}
        <Block label="Body Content" icon="✍️" open={openBlocks.body} onToggle={() => toggle('body')}>
          <div className="space-y-5">
            <Field label="Introduction" error={errors.intro}>
              <textarea
                value={post.body.intro}
                onChange={(e) => setBody('intro', e.target.value)}
                className={`${inputCls(!!errors.intro)} resize-none`}
                rows={5}
                placeholder="Opening paragraph that sets the scene. This appears before the sections."
              />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">
                  Body Sections
                </span>
                <button
                  type="button"
                  onClick={addSection}
                  className="text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors"
                >
                  + Add section
                </button>
              </div>
              <div className="space-y-3">
                {post.body.sections.map((sec, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-orange-400/50 font-semibold uppercase tracking-widest">
                        Section {i + 1}
                      </span>
                      {post.body.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(i)}
                          className="text-white/25 hover:text-red-400 text-xs transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Field label="Heading">
                        <input
                          value={sec.heading}
                          onChange={(e) => setSection(i, 'heading', e.target.value)}
                          className={inputCls()}
                          placeholder="Section heading"
                        />
                      </Field>
                      <Field label="Content">
                        <textarea
                          value={sec.content}
                          onChange={(e) => setSection(i, 'content', e.target.value)}
                          className={`${inputCls()} resize-none`}
                          rows={5}
                          placeholder="Section body text..."
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Field label="Conclusion">
              <textarea
                value={post.body.conclusion}
                onChange={(e) => setBody('conclusion', e.target.value)}
                className={`${inputCls()} resize-none`}
                rows={4}
                placeholder="Closing paragraph — the key takeaway..."
              />
            </Field>
          </div>
        </Block>

        {/* ── Block 3: Tags ── */}
        <Block label="Tags" icon="🏷️" open={openBlocks.tags} onToggle={() => toggle('tags')}>
          <ChipInput
            chips={post.tags}
            input={tagInput}
            onInputChange={setTagInput}
            onAdd={addTag}
            onRemove={(t) => set('tags', post.tags.filter((x) => x !== t))}
            placeholder="e.g. PROGRAMMATIC (press Enter)"
            chipStyle="orange"
          />
        </Block>

        {/* ── Block 4: Related Posts ── */}
        <Block label="Related Posts" icon="🔗" open={openBlocks.related} onToggle={() => toggle('related')}>
          <div>
            <div className="flex gap-2 flex-wrap mb-3 min-h-[28px]">
              {post.relatedSlugs.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 bg-white/[0.05] border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full font-mono"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        'relatedSlugs',
                        post.relatedSlugs.filter((x) => x !== s)
                      )
                    }
                    className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </span>
              ))}
              {post.relatedSlugs.length === 0 && (
                <span className="text-white/20 text-xs self-center">None selected</span>
              )}
            </div>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value && !post.relatedSlugs.includes(e.target.value)) {
                  set('relatedSlugs', [...post.relatedSlugs, e.target.value]);
                }
              }}
              className={inputCls()}
            >
              <option value="">Select a related post...</option>
              {allBlogSlugs
                .filter((s) => s !== post.slug && !post.relatedSlugs.includes(s))
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
            <p className="text-white/25 text-[10px] mt-1.5">
              Select up to 3 related posts. These appear at the bottom of the article.
            </p>
          </div>
        </Block>
      </main>
    </div>
  );
}
