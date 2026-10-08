import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { autoImportGcal } from "@/lib/gcal";

// GET /api/availability — returns busy dates (today and future)
// Auto-imports from Google Calendar iCal (throttled to once per 10 min)
export async function GET() {
  try {
    // Auto-import iCal (throttled internally)
    await autoImportGcal();

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const rows = await db.$queryRaw<{ date: string }[]>`
      SELECT date FROM UnavailableDay WHERE date >= ${today} ORDER BY date ASC
    `;

    return NextResponse.json({
      dates: rows.map((r) => r.date),
    });
  } catch (error) {
    console.error("GET /api/availability error:", error);
    // Return empty array on error — form still works, just no blocked dates
    return NextResponse.json({ dates: [] });
  }
}
