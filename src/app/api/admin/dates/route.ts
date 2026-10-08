import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { importIcal } from "@/lib/gcal";

// GET /api/admin/dates — list all unavailable days
export async function GET() {
  try {
    const rows = await db.$queryRaw`
      SELECT id, date, note, source FROM UnavailableDay ORDER BY date ASC
    `;
    return NextResponse.json({ dates: rows });
  } catch (error) {
    console.error("GET /api/admin/dates error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// POST — add a manual unavailable day
export async function POST(req: NextRequest) {
  try {
    const { date, note } = await req.json();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Неверная дата" }, { status: 400 });
    }
    await db.$executeRaw`
      INSERT OR IGNORE INTO UnavailableDay (id, date, source, note)
      VALUES (lower(hex(randomblob(12))), ${date}, 'admin', ${note || null})
    `;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/dates error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// DELETE — remove an unavailable day
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    await db.$executeRaw`DELETE FROM UnavailableDay WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/dates error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
