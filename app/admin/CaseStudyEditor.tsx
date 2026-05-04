'use client';

import { useState, useRef, useEffect } from 'react';
import type { CaseStudy } from '@/app/case-study/data';
import { Field, ChipInput, AdminHeader, inputCls } from './components';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Travel', 'FMCG', 'Banking', 'Lifestyle', 'Technology', 'Retail', 'E-Commerce'];

const OBJECTIVES = ['Brand Awareness', 'Performance', 'Reach & Frequency', 'Conversion', 'Retargeting', 'App Install'];

const ASSETS = [
  '/assets/featured-case-1.png',
  '/assets/featured-case-2.png',
  '/assets/featured-case-3.png',
  '/assets/service-thumb-programmatic.png',
  '/assets/service-thumb-video.png',
  '/assets/service-thumb-richmedia.png',
  '/assets/service-thumb-social.png',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function autoResize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

const emptyMetric = { v: '', l: '', desc: '' };

// ─── SidebarSection ───────────────────────────────────────────────────────────

function SidebarSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-3 border-b border-white/[0.05] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-2 text-left"
      >
        <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">{title}</span>
        <span className="text-white/20 text-[9px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}

// ─── CanvasSection ────────────────────────────────────────────────────────────

function CanvasSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <span className="text-base">{icon}</span>
        <h2 className="text-sm font-semibold text-white/80 tracking-tight">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({
  index,
  metric,
  onChange,
}: {
  index: number;
  metric: CaseStudy['metrics'][0];
  onChange: (k: keyof CaseStudy['metrics'][0], v: string) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (taRef.current) autoResize(taRef.current); }, [metric.desc]);

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
      <div className="text-[10px] text-orange-400/50 font-semibold uppercase tracking-widest mb-3">
        Metric {index + 1}
      </div>
      <div className="space-y-2.5">
        <Field label="Value">
          <input
            value={metric.v}
            onChange={(e) => onChange('v', e.target.value)}
            className={inputCls()}
            placeholder="+38% or 2.4×"
          />
        </Field>
        <Field label="Label">
          <input
            value={metric.l}
            onChange={(e) => onChange('l', e.target.value)}
            className={inputCls()}
            placeholder="Search Lift"
          />
        </Field>
        <Field label="Description">
          <textarea
            ref={taRef}
            value={metric.desc}
            onChange={(e) => { onChange('desc', e.target.value); autoResize(e.target); }}
            className={`${inputCls()} resize-none`}
            rows={2}
            placeholder="What this number means..."
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Main: CaseStudyEditor ────────────────────────────────────────────────────

interface Props {
  initial: CaseStudy;
  onSave: (cs: CaseStudy) => void;
  onCancel: () => void;
}

export default function CaseStudyEditor({ initial, onSave, onCancel }: Props) {
  const [cs, setCs] = useState<CaseStudy>(() => {
    const metrics = [...initial.metrics];
    while (metrics.length < 4) metrics.push({ ...emptyMetric });
    return { ...initial, metrics };
  });

  const [tagInput, setTagInput] = useState('');
  const [channelInput, setChannelInput] = useState('');
  const [slugLocked, setSlugLocked] = useState(!!initial.slug);
  const [hasTestimonial, setHasTestimonial] = useState(!!initial.testimonial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof CaseStudy>(k: K, v: CaseStudy[K]) =>
    setCs((c) => ({ ...c, [k]: v }));

  function handleBrandChange(val: string) {
    set('brand', val);
    if (!slugLocked) set('slug', toSlug(val));
  }

  function setMetric(i: number, k: keyof CaseStudy['metrics'][0], v: string) {
    set('metrics', cs.metrics.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)));
  }

  function setOverview(k: keyof CaseStudy['overview'], v: string) {
    set('overview', { ...cs.overview, [k]: v });
  }

  function setApproach(i: number, k: keyof CaseStudy['approach'][0], v: string) {
    set('approach', cs.approach.map((a, idx) => (idx === i ? { ...a, [k]: v } : a)));
  }

  function addApproach() {
    set('approach', [...cs.approach, { title: '', desc: '' }]);
  }

  function removeApproach(i: number) {
    set('approach', cs.approach.filter((_, idx) => idx !== i));
  }

  function setTestimonial(k: keyof NonNullable<CaseStudy['testimonial']>, v: string) {
    set('testimonial', { ...(cs.testimonial ?? { quote: '', name: '', role: '' }), [k]: v });
  }

  function addTag() {
    const t = tagInput.trim().toUpperCase();
    if (t && !cs.tags.includes(t)) set('tags', [...cs.tags, t]);
    setTagInput('');
  }

  function addChannel() {
    const c = channelInput.trim();
    if (c && !cs.channels.includes(c)) set('channels', [...cs.channels, c]);
    setChannelInput('');
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!cs.brand.trim()) e.brand = 'Brand is required';
    if (!cs.slug.trim()) e.slug = 'Slug is required';
    if (!cs.headline.trim()) e.headline = 'Headline is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ ...cs, testimonial: hasTestimonial ? cs.testimonial : undefined });
  }

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      <AdminHeader
        breadcrumbs={['Case Studies', cs.brand || 'New Case Study']}
        onPrimary={handleSave}
        primaryLabel="Save Case Study"
        onCancel={onCancel}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-72 shrink-0 border-r border-white/[0.07] bg-[#0c0c0c] flex flex-col">
          <div className="px-4 py-2 border-b border-white/[0.07] shrink-0">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider py-1">
              Case Study Settings
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-4">
            {/* Cover image */}
            <SidebarSection title="Cover Image">
              <select
                value={cs.img}
                onChange={(e) => set('img', e.target.value)}
                className={inputCls()}
              >
                {ASSETS.map((a) => (
                  <option key={a} value={a}>{a.split('/').pop()}</option>
                ))}
              </select>
              <div className="relative h-20 rounded-lg overflow-hidden border border-white/[0.07]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cs.img} alt="" className="w-full h-full object-cover opacity-70" />
              </div>
            </SidebarSection>

            {/* Client info */}
            <SidebarSection title="Client Info">
              <Field label="Brand / Client" error={errors.brand}>
                <input
                  value={cs.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className={inputCls(!!errors.brand)}
                  placeholder="e.g. Singapore Airlines"
                />
              </Field>
              <Field label="Slug (URL)" error={errors.slug}>
                <input
                  value={cs.slug}
                  onChange={(e) => { set('slug', toSlug(e.target.value)); setSlugLocked(true); }}
                  className={inputCls(!!errors.slug)}
                  placeholder="singapore-airlines"
                />
                {!errors.slug && cs.slug && (
                  <p className="text-white/20 text-[10px] mt-0.5">/case-study/{cs.slug}</p>
                )}
              </Field>
            </SidebarSection>

            {/* Campaign details */}
            <SidebarSection title="Campaign Details">
              <Field label="Category">
                <select
                  value={cs.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={inputCls()}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Campaign Objective">
                <select
                  value={cs.objective ?? ''}
                  onChange={(e) => set('objective', e.target.value || undefined)}
                  className={inputCls()}
                >
                  <option value="">Select objective...</option>
                  {OBJECTIVES.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Campaign Period">
                <input
                  value={cs.period}
                  onChange={(e) => set('period', e.target.value)}
                  className={inputCls()}
                  placeholder="Q3 2025 · 12 weeks"
                />
              </Field>
              <Field label="Region / Markets">
                <input
                  value={cs.region ?? ''}
                  onChange={(e) => set('region', e.target.value || undefined)}
                  className={inputCls()}
                  placeholder="e.g. SG, MY, ID, TH"
                />
              </Field>
            </SidebarSection>

            {/* Tags */}
            <SidebarSection title="Tags" defaultOpen={false}>
              <ChipInput
                chips={cs.tags}
                input={tagInput}
                onInputChange={setTagInput}
                onAdd={addTag}
                onRemove={(t) => set('tags', cs.tags.filter((x) => x !== t))}
                placeholder="e.g. CTV, PROGRAMMATIC"
                chipStyle="orange"
              />
            </SidebarSection>

            {/* Channels */}
            <SidebarSection title="Channels Used" defaultOpen={false}>
              <ChipInput
                chips={cs.channels}
                input={channelInput}
                onInputChange={setChannelInput}
                onAdd={addChannel}
                onRemove={(c) => set('channels', cs.channels.filter((x) => x !== c))}
                placeholder="e.g. CTV, GoNet DSP, TikTok"
                chipStyle="gray"
              />
            </SidebarSection>

            {/* Testimonial */}
            <SidebarSection title="Client Testimonial" defaultOpen={false}>
              <label className="flex items-center gap-3 cursor-pointer select-none mb-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = !hasTestimonial;
                    setHasTestimonial(next);
                    if (next && !cs.testimonial) set('testimonial', { quote: '', name: '', role: '' });
                  }}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
                    hasTestimonial ? 'bg-orange-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      hasTestimonial ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </button>
                <span className="text-sm text-white/60">
                  {hasTestimonial ? 'Testimonial included' : 'Add testimonial'}
                </span>
              </label>

              {hasTestimonial && (
                <div className="space-y-3">
                  <Field label="Quote">
                    <textarea
                      value={cs.testimonial?.quote ?? ''}
                      onChange={(e) => setTestimonial('quote', e.target.value)}
                      className={`${inputCls()} resize-none`}
                      rows={3}
                      placeholder="Client quote in their words..."
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Name">
                      <input
                        value={cs.testimonial?.name ?? ''}
                        onChange={(e) => setTestimonial('name', e.target.value)}
                        className={inputCls()}
                        placeholder="Marcus Tan"
                      />
                    </Field>
                    <Field label="Role">
                      <input
                        value={cs.testimonial?.role ?? ''}
                        onChange={(e) => setTestimonial('role', e.target.value)}
                        className={inputCls()}
                        placeholder="Head of Marketing"
                      />
                    </Field>
                  </div>
                </div>
              )}
            </SidebarSection>
          </div>
        </aside>

        {/* ── Main canvas ── */}
        <main className="flex-1 overflow-y-auto bg-[#0e0e0e]">
          <div className="max-w-[760px] mx-auto px-8 py-10 space-y-6">
            {/* Hero / headline block */}
            <div className="bg-white/[0.025] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="text-base">🏷️</span>
                <h2 className="text-sm font-semibold text-white/80 tracking-tight">Headlines & Identity</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-white/35 mb-1.5">
                    Brand / Client
                  </label>
                  <p className={`font-bricolage font-bold text-[32px] leading-tight ${
                    cs.brand ? 'text-white/90' : 'text-white/15'
                  }`}>
                    {cs.brand || 'Brand name'}
                  </p>
                </div>

                <Field label="Headline" error={errors.headline}>
                  <textarea
                    value={cs.headline}
                    onChange={(e) => set('headline', e.target.value)}
                    className={`${inputCls(!!errors.headline)} resize-none text-base`}
                    rows={2}
                    placeholder="Key result headline — e.g. 'Premium video drove a 38% lift in flight searches across SEA.'"
                  />
                </Field>

                <Field label="Sub-headline (optional)">
                  <input
                    value={cs.subheadline ?? ''}
                    onChange={(e) => set('subheadline', e.target.value || undefined)}
                    className={inputCls()}
                    placeholder="Additional context or secondary result..."
                  />
                </Field>

                {/* Campaign badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {cs.category && (
                    <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-medium">
                      {cs.category}
                    </span>
                  )}
                  {cs.objective && (
                    <span className="bg-white/[0.06] border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full">
                      {cs.objective}
                    </span>
                  )}
                  {cs.period && (
                    <span className="bg-white/[0.06] border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full">
                      📅 {cs.period}
                    </span>
                  )}
                  {cs.region && (
                    <span className="bg-white/[0.06] border border-white/10 text-white/50 text-xs px-3 py-1 rounded-full">
                      🌏 {cs.region}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <CanvasSection title="Key Metrics" icon="📈">
              <div className="grid grid-cols-2 gap-3">
                {cs.metrics.map((m, i) => (
                  <MetricCard
                    key={i}
                    index={i}
                    metric={m}
                    onChange={(k, v) => setMetric(i, k, v)}
                  />
                ))}
              </div>
            </CanvasSection>

            {/* Campaign Overview */}
            <CanvasSection title="Campaign Overview" icon="🎯">
              <div className="space-y-5">
                {(
                  [
                    ['challenge', 'The Challenge', 'What problem did the client face? What was the brief?'],
                    ['solution',  'The Solution',  'How did Go Mobile solve it? What strategy was deployed?'],
                    ['result',    'The Result',    'What were the outcomes? Quote the numbers.'],
                  ] as [keyof CaseStudy['overview'], string, string][]
                ).map(([k, label, placeholder]) => (
                  <div key={k}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        k === 'challenge' ? 'bg-red-500/60' :
                        k === 'solution'  ? 'bg-blue-500/60' : 'bg-green-500/60'
                      }`} />
                      <label className="text-xs font-semibold text-white/55 uppercase tracking-wider">
                        {label}
                      </label>
                    </div>
                    <textarea
                      value={cs.overview[k]}
                      onChange={(e) => setOverview(k, e.target.value)}
                      className={`${inputCls()} resize-none`}
                      rows={4}
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                {/* Key Takeaway */}
                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500/60 shrink-0" />
                    <label className="text-xs font-semibold text-white/55 uppercase tracking-wider">
                      Key Takeaway (optional)
                    </label>
                  </div>
                  <textarea
                    value={cs.keyTakeaway ?? ''}
                    onChange={(e) => set('keyTakeaway', e.target.value || undefined)}
                    className={`${inputCls()} resize-none`}
                    rows={2}
                    placeholder="One sentence distillation of the key insight or learning from this campaign..."
                  />
                </div>
              </div>
            </CanvasSection>

            {/* Approach Steps */}
            <CanvasSection title="Our Approach" icon="🔧">
              <div className="space-y-3">
                {cs.approach.map((a, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-[10px] text-orange-400/50 font-semibold uppercase tracking-widest">
                          Step {i + 1}
                        </span>
                      </div>
                      {cs.approach.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeApproach(i)}
                          className="text-white/20 hover:text-red-400 text-xs transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Field label="Step Title">
                        <input
                          value={a.title}
                          onChange={(e) => setApproach(i, 'title', e.target.value)}
                          className={inputCls()}
                          placeholder="e.g. Audience Architecture"
                        />
                      </Field>
                      <Field label="Description">
                        <textarea
                          value={a.desc}
                          onChange={(e) => setApproach(i, 'desc', e.target.value)}
                          className={`${inputCls()} resize-none`}
                          rows={3}
                          placeholder="Describe what was done in this step..."
                        />
                      </Field>
                    </div>
                  </div>
                ))}

                {cs.approach.length < 6 && (
                  <button
                    type="button"
                    onClick={addApproach}
                    className="w-full border border-dashed border-white/10 rounded-xl py-3 text-white/30 hover:text-white/55 hover:border-white/20 text-sm transition-all"
                  >
                    + Add step
                  </button>
                )}
              </div>
            </CanvasSection>

            <div className="h-16" />
          </div>
        </main>
      </div>
    </div>
  );
}
