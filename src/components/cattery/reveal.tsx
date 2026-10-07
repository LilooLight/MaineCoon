"use client";

import { type ReactNode } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the animation starts (useful for staggered groups). */
  delay?: number;
  /** Direction of the reveal. */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Render as a different element (default div). */
  as?: "div" | "section" | "article" | "li" | "span";
}

const DIRECTION_OFFSET: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

/**
 * Reveal — wraps children in a scroll-triggered blur-fade animation.
 * Respects prefers-reduced-motion (handled in the hook).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const offset = DIRECTION_OFFSET[direction];
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
        visible
          ? "opacity-100 blur-0 translate-x-0 translate-y-0"
          : cn("opacity-0 blur-md", offset),
        className
      )}
    >
      {children}
    </Tag>
  );
}
