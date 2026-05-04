"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { addReveal } from "../utils/scrollReveal";
import { useDemo } from "../context/DemoMode";
import { LOREM_CASES } from "../demo/lorem-data";

const CATEGORIES = ["All", "Travel", "FMCG", "Banking", "Tech", "Lifestyle"];

const CASES = [
  {
    slug: "singapore-airlines",
    img: "/assets/featured-case-1.png",
    brand: "Singapore Airlines",
    category: "Travel",
    headline: "Premium video drove a 38% lift in flight searches across SEA.",
    metrics: [
      { v: "+38%", l: "Search Lift" },
      { v: "2.4×", l: "ROAS" },
      { v: "12M", l: "Reach" },
    ],
    tags: ["CTV", "PROGRAMMATIC", "VIDEO"],
  },
  {
    slug: "indofood",
    img: "/assets/featured-case-2.png",
    brand: "Indofood",
    category: "FMCG",
    headline: "Gamified rich media outperformed display CTR by 6× across in-app inventory.",
    metrics: [
      { v: "6.1×", l: "vs Display CTR" },
      { v: "27s", l: "Avg Engagement" },
      { v: "₹0.04", l: "Cost per Engagement" },
    ],
    tags: ["RICH MEDIA", "IN-APP", "GAMIFIED"],
  },
  {
    slug: "bank-jago",
    img: "/assets/featured-case-3.png",
    brand: "Bank Jago",
    category: "Banking",
    headline: "Always-on programmatic delivered a 22% lower CAC than social-only baselines.",
    metrics: [
      { v: "-22%", l: "CAC" },
      { v: "+58%", l: "Acquisitions" },
      { v: "98.7%", l: "Brand Safe" },
    ],
    tags: ["PROGRAMMATIC", "NATIVE", "DISPLAY"],
  },
  {
    slug: "maybank",
    img: "/assets/featured-case-1.png",
    brand: "Maybank",
    category: "Banking",
    headline: "Cross-channel orchestration drove a 1.8× lift in qualified leads.",
    metrics: [
      { v: "1.8×", l: "Qualified Leads" },
      { v: "-31%", l: "CPL" },
      { v: "4.2M", l: "Reach" },
    ],
    tags: ["DISPLAY", "META", "VIDEO"],
  },
  {
    slug: "iqos",
    img: "/assets/featured-case-2.png",
    brand: "IQOS",
    category: "Lifestyle",
    headline: "Audience-first targeting cut wasted impressions by 41% in launch markets.",
    metrics: [
      { v: "-41%", l: "Wasted Impressions" },
      { v: "+62%", l: "Brand Recall" },
      { v: "3.1×", l: "Engagement" },
    ],
    tags: ["NATIVE", "AUDIENCE", "TIKTOK"],
  },
  {
    slug: "ocbc",
    img: "/assets/featured-case-3.png",
    brand: "OCBC",
    category: "Banking",
    headline: "Sequential CTV + mobile retargeting lifted product application starts by 47%.",
    metrics: [
      { v: "+47%", l: "App Starts" },
      { v: "-19%", l: "CPA" },
      { v: "9.6M", l: "Reach" },
    ],
    tags: ["CTV", "MOBILE", "PROGRAMMATIC"],
  },
];

export function CaseStudyBody() {
  const { isDemo } = useDemo();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("All");

  const allCases = isDemo ? LOREM_CASES : CASES;
  const filtered = active === "All" ? allCases : allCases.filter((c) => c.category === active);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;
    addReveal(el, el.querySelectorAll(".filter-bar"), { duration: 1, y: 30, start: "top 90%" });
  }, []);

  // Re-run reveal when filter changes
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll(".cs-card");
    gsap.fromTo(
      cards,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }
    );
  }, [active]);

  return (
    <div ref={ref}>
      {/* Filter bar */}
      <section className="px-6 md:px-[136px]">
        <div className="filter-bar flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className="px-5 py-2 rounded-full text-xs font-bold tracking-tight transition"
                style={{
                  background: isActive ? "var(--fg)" : "transparent",
                  color: isActive ? "var(--bg)" : "var(--fg)",
                  border: `1px solid ${isActive ? "var(--fg)" : "var(--border)"}`,
                }}
              >
                {c.toUpperCase()}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cases grid */}
      <section className="px-6 md:px-[136px] py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <Link key={c.brand + c.headline} href={`/case-study/${c.slug}`}>
            <article
              className="cs-card relative rounded-[28px] overflow-hidden h-[480px] md:h-[520px] group"
            >
              <Image src={c.img} alt={c.brand} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover scale-[1.01] transition-transform duration-700 group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-7 md:p-9 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold tracking-[2px] text-white/80 uppercase">
                    {c.category}
                  </span>
                  <div className="flex gap-1.5 flex-wrap justify-end max-w-[60%]">
                    {c.tags.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <h3 className="font-bricolage font-bold text-2xl md:text-[32px] leading-[1.1] tracking-tight text-white max-w-[480px]">
                    {c.brand}
                  </h3>
                  <p className="text-sm md:text-base text-white/90 leading-[1.5] max-w-[520px]">
                    {c.headline}
                  </p>
                  <div className="flex gap-6 md:gap-10 mt-2 pt-5 border-t border-white/15">
                    {c.metrics.map((m) => (
                      <div key={m.l} className="flex flex-col">
                        <p className="font-bricolage font-extrabold text-2xl md:text-3xl leading-none tracking-tight text-gradient-animated">
                          {m.v}
                        </p>
                        <p className="text-[11px] uppercase tracking-[1.5px] text-white/70 mt-1.5">
                          {m.l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
