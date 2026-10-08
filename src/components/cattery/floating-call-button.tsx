"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

/**
 * FloatingCallButton — a mobile-only floating "Позвонить" button.
 *
 * Behavior:
 * - Hidden when the user is actively scrolling down (to not cover content)
 * - Shown when scrolling stops or user scrolls up / reaches bottom
 * - On desktop (>=768px) hidden — the call link is in the header instead
 * - Positioned bottom-left to avoid overlapping with BackToTop (bottom-right)
 *   and CompareBar (bottom-center)
 */
export function FloatingCallButton() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY && currentY > 100;

      // Hide while scrolling down, show on scroll up or when scrolling stops
      if (scrollingDown) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // Show again after scrolling stops (1.5s of no scroll)
      if (scrollTimeout) clearTimeout(scrollTimeout);
      const t = setTimeout(() => setVisible(true), 1500);
      setScrollTimeout(t);

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, scrollTimeout]);

  return (
    <a
      href="tel:+74951234567"
      aria-label="Позвонить в питомник"
      className={`md:hidden fixed bottom-5 left-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-accent-foreground shadow-2xl ring-2 ring-accent/30 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-40" />
        <Phone className="h-4 w-4 relative" />
      </span>
      <span className="text-sm font-semibold">Позвонить</span>
    </a>
  );
}
