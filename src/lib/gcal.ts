import { db } from "./db";

/**
 * Google Calendar iCal import — NO OAuth needed.
 * Reads the "secret iCal address" from Google Calendar settings,
 * extracts busy dates with a regex, and upserts them into UnavailableDay.
 *
 * Direction: calendar → site (one-way). We never write back to Google Calendar.
 */

// Primitve in-memory throttle — no more than once per 10 minutes
let lastAutoImport = 0;
const IMPORT_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Parse an iCal string and extract all DTSTART dates.
 * Returns a Set of "YYYY-MM-DD" strings.
 */
function parseIcalDates(ics: string): Set<string> {
  const dates = new Set<string>();
  for (const m of ics.matchAll(/DTSTART[^:\r\n]*:(\d{8})/g)) {
    const raw = m[1];
    const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    dates.add(date);
  }
  return dates;
}

/**
 * Import busy dates from a Google Calendar iCal URL.
 * Uses raw SQL to bypass stale Prisma Client.
 */
export async function importIcal(url: string): Promise<number> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch iCal: ${res.status}`);
  }
  const ics = await res.text();
  const dates = parseIcalDates(ics);

  for (const date of dates) {
    await db.$executeRaw`
      INSERT OR IGNORE INTO UnavailableDay (id, date, source, note)
      VALUES (lower(hex(randomblob(12))), ${date}, 'gcal', null)
    `;
  }

  return dates.size;
}

/**
 * Auto-import from the stored iCal URL (Setting key "gcal_url").
 * Throttled to once per 10 minutes.
 * Called at the start of GET /api/availability.
 */
export async function autoImportGcal(): Promise<void> {
  const now = Date.now();
  if (now - lastAutoImport < IMPORT_INTERVAL_MS) return;
  lastAutoImport = now;

  try {
    const rows = await db.$queryRaw<{ value: string }[]>`
      SELECT value FROM Setting WHERE key = 'gcal_url'
    `;
    const url = rows[0]?.value;
    if (!url) return;
    await importIcal(url);
  } catch {
    // silent — auto-import failure must not break availability API
  }
}
