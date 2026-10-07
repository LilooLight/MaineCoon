"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — observes an element and returns whether it has entered
 * the viewport. Used by the <Reveal /> wrapper to trigger blur-fade animation.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean }
) {
  const ref = useRef<T | null>(null);
  // If user prefers reduced motion, show immediately (no animation).
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [visible, setVisible] = useState(prefersReduced);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;
    const {
      threshold = 0.15,
      rootMargin = "0px 0px -10% 0px",
      once = true,
    } = options ?? {};

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options, prefersReduced]);

  return { ref, visible };
}
