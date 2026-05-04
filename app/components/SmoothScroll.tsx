"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const tickerCbRef = useRef<((time: number) => void) | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    // Destroy existing instance whenever pathname changes
    if (tickerCbRef.current) {
      gsap.ticker.remove(tickerCbRef.current);
      tickerCbRef.current = null;
    }
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // Don't run Lenis on admin pages — they use inner overflow-y-auto scroll
    if (isAdmin) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCb = (time: number) => lenis.raf(time * 1000);
    tickerCbRef.current = tickerCb;
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (tickerCbRef.current) {
        gsap.ticker.remove(tickerCbRef.current);
        tickerCbRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdmin]);

  // Scroll to top instantly on non-admin route changes
  useEffect(() => {
    if (!isAdmin) {
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
  }, [pathname, isAdmin]);

  return null;
}
