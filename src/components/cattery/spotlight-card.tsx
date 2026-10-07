"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Radius of the spotlight in px. */
  radius?: number;
  /** Spotlight color (CSS var or hex). Defaults to primary. */
  color?: string;
}

/**
 * SpotlightCard — tracks the cursor and renders a soft radial glow that
 * follows the mouse. Pure CSS + a tiny mousemove handler. No deps.
 */
export function SpotlightCard({
  children,
  className,
  radius = 220,
  color = "var(--primary)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);
  };

  const handleEnter = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--spot-opacity", "1");
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.setProperty("--spot-opacity", "0");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group/spot relative overflow-hidden",
        className
      )}
      style={
        {
          "--spot-radius": `${radius}px`,
          "--spot-color": color,
          "--spot-opacity": "0",
        } as React.CSSProperties
      }
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        aria-hidden
        style={{
          background:
            "radial-gradient(var(--spot-radius) circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--spot-color) 14%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
