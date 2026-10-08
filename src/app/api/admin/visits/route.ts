import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/visits — list visit bookings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const today = new Date().toISOString().split("T")[0];

    if (status && status !== "all") {
      const rows = await db.$queryRaw`
        SELECT id, name, contact, visitDate, message, status, createdAt
        FROM VisitBooking WHERE status = ${status}
        ORDER BY createdAt DESC LIMIT 100
      `;
      return NextResponse.json({ visits: rows });
    }

    const rows = await db.$queryRaw`
      SELECT id, name, contact, visitDate, message, status, createdAt
      FROM VisitBooking ORDER BY createdAt DESC LIMIT 100
    `;

    const allRows = await db.$queryRaw`SELECT status FROM VisitBooking`;
    const stats = {
      total: (allRows as unknown[]).length,
      new: (allRows as { status: string }[]).filter((r) => r.status === "new").length,
      confirmed: (allRows as { status: string }[]).filter((r) => r.status === "confirmed").length,
      closed: (allRows as { status: string }[]).filter((r) => r.status === "closed").length,
    };

    return NextResponse.json({ visits: rows, stats });
  } catch (error) {
    console.error("GET /api/admin/visits error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// PATCH — update status
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !["new", "confirmed", "closed"].includes(status)) {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }
    await db.$executeRaw`
      UPDATE VisitBooking SET status = ${status} WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/visits error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// DELETE — delete visit
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    await db.$executeRaw`DELETE FROM VisitBooking WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/visits error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
