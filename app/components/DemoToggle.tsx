'use client';

import { useDemo } from '../context/DemoMode';

export function DemoToggle() {
  const { isDemo, toggle, isUnlocked } = useDemo();

  if (!isUnlocked) return null;

  return (
    <button
      onClick={toggle}
      title={isDemo ? 'Switch back to real content' : 'Switch to lorem ipsum placeholder'}
      className={`fixed bottom-6 left-6 z-[9999] flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wide shadow-xl transition-all border backdrop-blur-md select-none ${
        isDemo
          ? 'bg-orange-500 text-white border-orange-400/60 shadow-orange-900/30'
          : 'bg-[#111]/90 text-white/50 border-white/10 hover:text-white/80 hover:border-white/25'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
          isDemo ? 'bg-white' : 'bg-white/25'
        }`}
      />
      DEMO MODE{isDemo ? ': ON' : ': OFF'}
    </button>
  );
}
