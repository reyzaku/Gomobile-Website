/**
 * Reusable skeleton primitives for loading states.
 * Uses animate-pulse from Tailwind for the shimmer effect.
 */

import type { ReactNode } from 'react';

export function SkeletonBox({ className = '', children, style }: { className?: string; children?: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-[16px] ${className}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)', ...style }}
    >
      {children}
    </div>
  );
}

export function SkeletonLine({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-pulse rounded-full ${className}`}
      style={{ background: 'var(--border)', ...style }}
    />
  );
}
