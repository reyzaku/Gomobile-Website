"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "./ThemeProvider";

const LOGOS = [
  "maybank", "ocbc", "jago", "sharp", "singaporeairlines",
  "coolgate", "mandiri", "iqos", "Indofood", "chitato", "indomilk",
];

export function TrustedBy() {
  const { theme } = useTheme();
  const mode = theme === "dark" ? "darkmode" : "lightmode";
  const track = [...LOGOS, ...LOGOS];
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // wait one frame so layout is measured
    const id = requestAnimationFrame(() => {
      const trackW = el.scrollWidth / 2;
      gsap.set(el, { x: 0 });
      const tween = gsap.to(el, {
        x: -trackW,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % -trackW),
        },
      });

      const onEnter = () => gsap.to(tween, { timeScale: 0.2, duration: 0.4 });
      const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      // store cleanup on element
      (el as any)._cleanup = () => {
        tween.kill();
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => {
      cancelAnimationFrame(id);
      const cleanup = (el as any)._cleanup;
      if (cleanup) cleanup();
    };
  }, [mode]);

  return (
    <section className="py-16 md:py-24">
      <p className="text-center font-bricolage font-bold text-lg mb-10" style={{ color: "var(--muted)" }}>
        We are trusted by
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div ref={trackRef} className="marquee-track flex gap-12 md:gap-20 w-max items-center">
          {track.map((n, i) => (
            <div key={`${n}-${i}`} className="shrink-0 h-10 md:h-12 relative" style={{ width: 140 }}>
              <Image
                src={`/assets/clientlogo-${mode}/${n}-${mode}.png`}
                alt={n}
                fill
                sizes="140px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
