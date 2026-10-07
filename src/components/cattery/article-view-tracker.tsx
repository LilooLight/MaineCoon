"use client";

import { useEffect } from "react";

const CONSENT_KEY = "cattery:cookie-consent";

/**
 * ArticleViewTracker — fires a POST to /api/blog/[slug]/view exactly once
 * per article visit, but only if the visitor has accepted analytics cookies
 * (the "Принять все" choice). No PII is sent — just an increment.
 *
 * Render this once inside an article page. It renders nothing.
 */
export function ArticleViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Check cookie consent
    let consent: string | null = null;
    try {
      consent = window.localStorage.getItem(CONSENT_KEY);
    } catch {
      // localStorage unavailable — skip tracking
      return;
    }

    // Only track if the user explicitly accepted all cookies.
    if (consent !== "accepted") return;

    // Fire and forget
    fetch(`/api/blog/${slug}/view`, { method: "POST" }).catch(() => {
      // silent — tracking failures must not break the UX
    });
  }, [slug]);

  return null;
}
