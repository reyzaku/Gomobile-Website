'use client';

import { useState } from 'react';
import type { CaseStudy } from '@/app/case-study/data';
import { Block, Field, ChipInput, AdminHeader, inputCls } from './components';

const CATEGORIES = ['Travel', 'FMCG', 'Banking', 'Lifestyle', 'Technology', 'Retail', 'E-Commerce'];
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

const emptyMetric = { v: '', l: '', desc: '' };

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
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    info: true,
    tags: false,
    metrics: true,
    overview: true,
    approach: true,
    channels: false,
    testimonial: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof CaseStudy>(k: K, v: CaseStudy[K]) =>
    setCs((c) => ({ ...c, [k]: v }));

  const toggle = (name: string) =>
    setOpenBlocks((prev) => ({ ...prev, [name]: !prev[name] }));

  function handleBrandChange(val: string) {
    set('brand', val);
    if (!slugLocked) set('slug', toSlug(val));
  }

  function setMetric(i: number, k: keyof CaseStudy['metrics'][0], v: string) {
    set(
      'metrics',
      cs.metrics.map((m, idx) => (idx === i ? { ...m, [k]: v } : m))
    );
  }

  function setOverview(k: keyof CaseStudy['overview'], v: string) {
    set('overview', { ...cs.overview, [k]: v });
  }

  function setApproach(i: number, k: keyof CaseStudy['approach'][0], v: string) {
    set(
      'approach',
      cs.approach.map((a, idx) => (idx === i ? { ...a, [k]: v } : a))
    );
  }

  function addApproach() {
    set('approach', [...cs.approach, { title: '', desc: '' }]);
  }

  function removeApproach(i: number) {
    set(
      'approach',
      cs.approach.filter((_, idx) => idx !== i)
    );
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

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!cs.brand.trim()) e.brand = 'Brand is required';
    if (!cs.slug.trim()) e.slug = 'Slug is required';
    if (!cs.headline.trim()) e.headline = 'Headline is required';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setOpenBlocks((prev) => ({ ...prev, info: true }));
    }
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const toSave: CaseStudy = {
      ...cs,
      testimonial: hasTestimonial ? cs.testimonial : undefined,
    };
    onSave(toSave);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminHeader
        breadcrumbs={['Case Studies', cs.brand || 'New Case Study']}
        onPrimary={handleSave}
        primaryLabel="Save Case Study"
        onCancel={onCancel}
      />

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-3">
        {/* ── Block 1: Study Information ── */}
        <Block label="Study Information" icon="📊" open={openBlocks.info} onToggle={() => toggle('info')}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand / Client" error={errors.brand} className="col-span-2">
              <input
                value={cs.brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className={inputCls(!!errors.brand)}
                placeholder="e.g. Singapore Airlines"
              />
            </Field>

            <Field label="Slug (URL path)" error={errors.slug}>
              <input
                value={cs.slug}
                onChange={(e) => {
                  set('slug', toSlug(e.target.value));
                  setSlugLocked(true);
                }}
                className={inputCls(!!errors.slug)}
                placeholder="singapore-airlines"
              />
              {!errors.slug && (
                <p className="text-white/25 text-[10px] mt-1">
                  {cs.slug ? `/case-study/${cs.slug}` : 'Auto-generated from brand'}
                </p>
              )}
            </Field>

            <Field label="Category">
              <select
                value={cs.category}
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

            <Field label="Headline" error={errors.headline} className="col-span-2">
              <textarea
                value={cs.headline}
                onChange={(e) => set('headline', e.target.value)}
                className={`${inputCls(!!errors.headline)} resize-none`}
                rows={2}
                placeholder="Key result headline, e.g. 'Premium video drove a 38% lift in flight searches across SEA.'"
              />
            </Field>

            <Field label="Campaign Period">
              <input
                value={cs.period}
                onChange={(e) => set('period', e.target.value)}
                className={inputCls()}
                placeholder="Q3 2025 · 12 weeks"
              />
            </Field>

            <Field label="Cover Image">
              <select
                value={cs.img}
                onChange={(e) => set('img', e.target.value)}
                className={inputCls()}
              >
                {ASSETS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </Field>

            <div className="col-span-2 mt-1 h-24 rounded-lg overflow-hidden border border-white/[0.07]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cs.img} alt="" className="w-full h-full object-cover opacity-70" />
            </div>
          </div>
        </Block>

        {/* ── Block 2: Tags ── */}
        <Block label="Tags" icon="🏷️" open={openBlocks.tags} onToggle={() => toggle('tags')}>
          <ChipInput
            chips={cs.tags}
            input={tagInput}
            onInputChange={setTagInput}
            onAdd={addTag}
            onRemove={(t) => set('tags', cs.tags.filter((x) => x !== t))}
            placeholder="e.g. CTV, PROGRAMMATIC (press Enter)"
            chipStyle="orange"
          />
        </Block>

        {/* ── Block 3: Metrics ── */}
        <Block label="Key Metrics (4 numbers)" icon="📈" open={openBlocks.metrics} onToggle={() => toggle('metrics')}>
          <div className="grid grid-cols-2 gap-3">
            {cs.metrics.map((m, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4"
              >
                <div className="text-[10px] text-orange-400/50 font-semibold uppercase tracking-widest mb-3">
                  Metric {i + 1}
                </div>
                <div className="space-y-2">
                  <Field label="Value">
                    <input
                      value={m.v}
                      onChange={(e) => setMetric(i, 'v', e.target.value)}
                      className={inputCls()}
                      placeholder="+38% or 2.4×"
                    />
                  </Field>
                  <Field label="Label">
                    <input
                      value={m.l}
                      onChange={(e) => setMetric(i, 'l', e.target.value)}
                      className={inputCls()}
                      placeholder="Search Lift"
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      value={m.desc}
                      onChange={(e) => setMetric(i, 'desc', e.target.value)}
                      className={`${inputCls()} resize-none`}
                      rows={2}
                      placeholder="What this metric represents..."
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </Block>

        {/* ── Block 4: Overview ── */}
        <Block label="Campaign Overview" icon="🎯" open={openBlocks.overview} onToggle={() => toggle('overview')}>
          <div className="space-y-4">
            {(
              [
                ['challenge', 'The Challenge', 'What problem did the client face?'],
                ['solution', 'The Solution', 'How did Go Mobile solve it?'],
                ['result', 'The Result', 'What were the outcomes?'],
              ] as [keyof CaseStudy['overview'], string, string][]
            ).map(([k, label, placeholder]) => (
              <Field key={k} label={label}>
                <textarea
                  value={cs.overview[k]}
                  onChange={(e) => setOverview(k, e.target.value)}
                  className={`${inputCls()} resize-none`}
                  rows={3}
                  placeholder={placeholder}
                />
              </Field>
            ))}
          </div>
        </Block>

        {/* ── Block 5: Approach ── */}
        <Block label="Approach Steps" icon="🔧" open={openBlocks.approach} onToggle={() => toggle('approach')}>
          <div className="space-y-3">
            {cs.approach.map((a, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-orange-400/50 font-semibold uppercase tracking-widest">
                    Step {i + 1}
                  </span>
                  {cs.approach.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeApproach(i)}
                      className="text-white/25 hover:text-red-400 text-xs transition-colors"
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
                      placeholder="Describe the approach taken in this step..."
                    />
                  </Field>
                </div>
              </div>
            ))}
            {cs.approach.length < 4 && (
              <button
                type="button"
                onClick={addApproach}
                className="w-full border border-dashed border-white/15 rounded-xl py-3 text-white/35 hover:text-white/60 hover:border-white/25 text-sm transition-all"
              >
                + Add step
              </button>
            )}
          </div>
        </Block>

        {/* ── Block 6: Channels ── */}
        <Block label="Channels Used" icon="📡" open={openBlocks.channels} onToggle={() => toggle('channels')}>
          <ChipInput
            chips={cs.channels}
            input={channelInput}
            onInputChange={setChannelInput}
            onAdd={addChannel}
            onRemove={(c) => set('channels', cs.channels.filter((x) => x !== c))}
            placeholder="e.g. CTV, GoNet DSP, TikTok"
            chipStyle="gray"
          />
        </Block>

        {/* ── Block 7: Testimonial ── */}
        <Block
          label="Client Testimonial"
          icon="💬"
          open={openBlocks.testimonial}
          onToggle={() => toggle('testimonial')}
          accent={hasTestimonial}
        >
          <div>
            <label className="flex items-center gap-3 mb-5 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => {
                  const next = !hasTestimonial;
                  setHasTestimonial(next);
                  if (next && !cs.testimonial) {
                    set('testimonial', { quote: '', name: '', role: '' });
                  }
                }}
                className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
                  hasTestimonial ? 'bg-orange-500' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                    hasTestimonial ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
              <span className="text-sm text-white/60">
                {hasTestimonial ? 'Testimonial included' : 'Include a client testimonial'}
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
                    placeholder="Client testimonial in their words..."
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Client Name">
                    <input
                      value={cs.testimonial?.name ?? ''}
                      onChange={(e) => setTestimonial('name', e.target.value)}
                      className={inputCls()}
                      placeholder="Marcus Tan"
                    />
                  </Field>
                  <Field label="Client Role">
                    <input
                      value={cs.testimonial?.role ?? ''}
                      onChange={(e) => setTestimonial('role', e.target.value)}
                      className={inputCls()}
                      placeholder="Head of Marketing, Brand"
                    />
                  </Field>
                </div>
              </div>
            )}
          </div>
        </Block>
      </main>
    </div>
  );
}
