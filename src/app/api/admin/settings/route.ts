import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { importIcal } from "@/lib/gcal";

// GET /api/admin/settings — get all settings
export async function GET() {
  try {
    const rows = await db.$queryRaw<{ key: string; value: string }[]>`
      SELECT key, value FROM Setting
    `;
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ settings: {} });
  }
}

// POST /api/admin/settings — save a setting (key-value)
// Special: if key is "gcal_url", also triggers an immediate iCal import
export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();
    if (!key || typeof value !== "string") {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }

    // Upsert setting (raw SQL)
    await db.$executeRaw`
      INSERT INTO Setting (key, value) VALUES (${key}, ${value})
      ON CONFLICT(key) DO UPDATE SET value = ${value}
    `;

    // If this is the gcal_url, trigger import immediately
    if (key === "gcal_url" && value) {
      try {
        const count = await importIcal(value);
        return NextResponse.json({ success: true, importedDates: count });
      } catch {
        return NextResponse.json({
          success: true,
          warning: "Настройка сохранена, но импорт iCal не удался. Проверьте ссылку.",
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
