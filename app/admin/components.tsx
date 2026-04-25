'use client';

import { type ReactNode } from 'react';

export function inputCls(err = false) {
  return `w-full bg-white/[0.06] border ${
    err ? 'border-red-500/40' : 'border-white/[0.10]'
  } rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500/40 transition-colors placeholder:text-white/25`;
}

export function Block({
  label,
  icon,
  open,
  onToggle,
  children,
  accent = false,
}: {
  label: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        accent ? 'border-orange-500/20' : 'border-white/[0.08]'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
          accent
            ? 'bg-orange-500/[0.07] hover:bg-orange-500/[0.10]'
            : 'bg-white/[0.03] hover:bg-white/[0.05]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-semibold text-white">{label}</span>
        </div>
        <span className="text-white/30 text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 py-5 bg-white/[0.015] border-t border-white/[0.06]">
          {children}
        </div>
      )}
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-white/40 text-[11px] font-medium uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-white/25 text-xs mt-1">{hint}</p>}
    </div>
  );
}

export function ChipInput({
  chips,
  input,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
  chipStyle = 'orange',
}: {
  chips: string[];
  input: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (v: string) => void;
  placeholder?: string;
  chipStyle?: 'orange' | 'gray';
}) {
  const chipBase =
    chipStyle === 'orange'
      ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
      : 'bg-white/[0.05] border-white/10 text-white/60';

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-3 min-h-[28px]">
        {chips.map((t) => (
          <span
            key={t}
            className={`flex items-center gap-1 border text-xs px-3 py-1 rounded-full ${chipBase}`}
          >
            {t}
            <button
              type="button"
              onClick={() => onRemove(t)}
              className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </span>
        ))}
        {chips.length === 0 && (
          <span className="text-white/20 text-xs self-center">None added yet</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
          className={`${inputCls()} flex-1`}
          placeholder={placeholder ?? 'Type and press Enter'}
        />
        <button
          type="button"
          onClick={onAdd}
          className="border border-white/15 text-white/50 hover:text-white hover:border-white/30 rounded-lg px-3 text-sm transition-all"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export function AdminHeader({
  breadcrumbs,
  onPrimary,
  primaryLabel,
  onCancel,
}: {
  breadcrumbs: string[];
  onPrimary: () => void;
  primaryLabel: string;
  onCancel: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm overflow-hidden">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2 min-w-0">
              {i > 0 && <span className="text-white/20 shrink-0">/</span>}
              <span
                className={`truncate ${
                  i === breadcrumbs.length - 1
                    ? 'text-white/80'
                    : 'text-white/40'
                }`}
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
        <div className="flex gap-2 shrink-0 ml-4">
          <button
            type="button"
            onClick={onCancel}
            className="border border-white/15 text-white/60 hover:text-white hover:border-white/30 rounded-lg px-4 py-1.5 text-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPrimary}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </header>
  );
}
