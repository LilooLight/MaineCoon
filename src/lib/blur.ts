/**
 * Brand-aligned blur placeholder data URLs for next/image.
 *
 * Real blurDataURL requires a tiny (~8×8) base64 image. We generate solid-color
 * placeholders in the warm palette so images fade in from a soft tinted blur
 * instead of a harsh white flash.
 *
 * Usage:
 *   <Image src={...} placeholder="blur" blurDataURL={BLUR_DATA_URLS.muted} />
 */

// Helper: build an 8×8 solid-color PNG as a base64 data URL.
// (kept tiny so it inlines cheaply in the HTML.)
function solidColorPng(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Minimal 1×1 PNG of a solid color, then rely on CSS blur + scaling.
  // Using 1×1 keeps the data URL minimal (~100 bytes).
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
    0x00, 0x00, 0x00, 0x0d, // IHDR length
    0x49, 0x48, 0x44, 0x52, // "IHDR"
    0x00, 0x00, 0x00, 0x01, // width 1
    0x00, 0x00, 0x00, 0x01, // height 1
    0x08, 0x06, // bit depth 8, color type 6 (RGBA)
    0x00, 0x00, 0x00, // compression, filter, interlace
    0x1f, 0x15, 0xc4, 0x89, // CRC
    0x00, 0x00, 0x00, 0x0a, // IDAT length
    0x49, 0x44, 0x41, 0x54, // "IDAT"
    0x78, 0x9c, 0x62, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // zlib data
    // We'll override the pixel below via a cleaner approach.
  ]);

  // Simpler: use a hardcoded minimal RGBA PNG with the color baked in.
  // Build via a minimal valid PNG manually is error-prone; instead use the
  // SVG-as-data-URL trick which next/image accepts for blurDataURL.
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${hex}"/></svg>`
  ).toString("base64")}`;
}

export const BLUR_DATA_URLS = {
  // Milk background (default for most images)
  background: solidColorPng("#FBF8F3"),
  // Muted beige — for cards
  muted: solidColorPng("#F2EDE4"),
  // Sage green — for primary accents
  primary: solidColorPng("#4A6B57"),
  // Sandy — for secondary accents
  secondary: solidColorPng("#C9A77C"),
  // Terracotta — for accent images
  accent: solidColorPng("#B86B4B"),
  // Dark — for dark-mode-friendly placeholders
  dark: solidColorPng("#34392F"),
} as const;

// Re-export a sensible default.
export const DEFAULT_BLUR = BLUR_DATA_URLS.muted;
