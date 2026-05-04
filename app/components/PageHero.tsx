"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useDemo } from "../context/DemoMode";

interface PageHeroProps {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  /** Optional lorem overrides — shown when demo mode is active */
  loremEyebrow?: string;
  loremTitle?: React.ReactNode;
  loremLede?: string;
}

export function PageHero({ eyebrow, title, lede, loremEyebrow, loremTitle, loremLede }: PageHeroProps) {
  const { isDemo } = useDemo();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ph-eyebrow", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(".ph-title", { y: 50, opacity: 0, duration: 1, delay: 0.1, ease: "power3.out" });
      gsap.from(".ph-lede", { y: 30, opacity: 0, duration: 0.9, delay: 0.35, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  const displayEyebrow = isDemo ? (loremEyebrow ?? 'LOREM IPSUM') : eyebrow;
  const displayTitle   = isDemo
    ? (loremTitle ?? <>Lorem ipsum dolor<br /><span className="text-gradient-animated">sit amet</span>.</>)
    : title;
  const displayLede    = isDemo
    ? (loremLede ?? (lede ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' : undefined))
    : lede;

  return (
    <section
      ref={ref}
      className="relative pt-[160px] md:pt-[240px] pb-12 md:pb-20 px-6 md:px-[150px]"
    >
      <p
        className="ph-eyebrow font-helvetica font-bold text-xs tracking-[9px] mb-4"
        style={{ color: "#ef6600" }}
      >
        {displayEyebrow}
      </p>
      <h1
        className="ph-title font-bricolage font-semibold text-5xl md:text-[80px] leading-none tracking-[-2.88px] max-w-[900px]"
        style={{ color: "var(--fg)" }}
      >
        {displayTitle}
      </h1>
      {displayLede && (
        <p
          className="ph-lede mt-8 max-w-[640px] font-nunitoSans text-base md:text-lg leading-[1.5]"
          style={{ color: "var(--muted)" }}
        >
          {displayLede}
        </p>
      )}
    </section>
  );
}
