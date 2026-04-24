import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface RevealOptions {
  stagger?: number;   // delay between each element
  duration?: number;  // reveal duration
  y?: number;         // distance in px
  start?: string;     // ST start
  delay?: number;     // initial delay
}

/**
 * Bidirectional scroll reveal:
 *   scroll down  → enter  : reveal from below (y+)
 *   scroll down  → leave  : hide upward (y-)
 *   scroll up    → enter  : reveal from above (y-)
 *   scroll up    → leave  : hide downward (y+)
 */
export function addReveal(
  container: Element,
  items: Element[] | NodeListOf<Element>,
  opts: RevealOptions = {}
) {
  const {
    stagger = 0.1,
    duration = 1.2,
    y = 70,
    start = "top 82%",
    delay = 0,
  } = opts;

  const els = Array.from(items);
  if (!els.length) return;

  // Start hidden
  gsap.set(els, { y, opacity: 0 });

  ScrollTrigger.create({
    trigger: container,
    start,
    // ── scroll DOWN: element enters viewport ─────────────────────────────
    onEnter: () => {
      gsap.set(els, { y, opacity: 0 });
      gsap.to(els, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        delay,
        ease: "power3.out",
        overwrite: true,
      });
    },
    // ── scroll DOWN: section leaves viewport at top ──────────────────────
    onLeave: () => {
      gsap.to(els, {
        y: -y * 0.7,
        opacity: 0,
        duration: duration * 0.55,
        stagger: stagger * 0.5,
        ease: "power2.in",
        overwrite: true,
      });
    },
    // ── scroll UP: section re-enters viewport from top ───────────────────
    onEnterBack: () => {
      gsap.set(els, { y: -y * 0.7, opacity: 0 });
      gsap.to(els, {
        y: 0,
        opacity: 1,
        duration,
        stagger: { each: stagger, from: "end" }, // reverse order = feels natural
        delay,
        ease: "power3.out",
        overwrite: true,
      });
    },
    // ── scroll UP: section leaves viewport at bottom ─────────────────────
    onLeaveBack: () => {
      gsap.to(els, {
        y,
        opacity: 0,
        duration: duration * 0.55,
        stagger: { each: stagger * 0.5, from: "end" },
        ease: "power2.in",
        overwrite: true,
      });
    },
  });
}
