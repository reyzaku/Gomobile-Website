'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface DemoCtx {
  isDemo: boolean;
  toggle: () => void;
  isUnlocked: boolean;
}

const Ctx = createContext<DemoCtx>({ isDemo: false, toggle: () => {}, isUnlocked: false });

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo]       = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Visiting ?demo (or ?demo=1) unlocks the toggle for this session
    if (new URLSearchParams(window.location.search).has('demo')) {
      sessionStorage.setItem('gm-demo-unlocked', '1');
    }
    setIsUnlocked(sessionStorage.getItem('gm-demo-unlocked') === '1');
    setIsDemo(sessionStorage.getItem('gm-demo-active') === '1');
  }, []);

  function toggle() {
    const next = !isDemo;
    setIsDemo(next);
    sessionStorage.setItem('gm-demo-active', next ? '1' : '0');
  }

  return <Ctx.Provider value={{ isDemo, toggle, isUnlocked }}>{children}</Ctx.Provider>;
}

export function useDemo() {
  return useContext(Ctx);
}

/**
 * <L lorem="Placeholder text">Real content</L>
 * Renders lorem when demo mode is active, real content otherwise.
 */
export function L({
  children,
  lorem,
}: {
  children: React.ReactNode;
  lorem: React.ReactNode;
}) {
  const { isDemo } = useDemo();
  return <>{isDemo ? lorem : children}</>;
}
