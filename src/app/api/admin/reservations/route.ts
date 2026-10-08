import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/reservations — list kitten reservations
export async function GET() {
  try {
    const rows = await db.$queryRaw`
      SELECT r.id, r.kittenId, r.name, r.contact, r.message, r.status, r.createdAt,
             k.name as kittenName
      FROM Reservation r
      LEFT JOIN Kitten k ON r.kittenId = k.id
      ORDER BY r.createdAt DESC LIMIT 100
    `;
    return NextResponse.json({ reservations: rows });
  } catch (error) {
    console.error("GET /api/admin/reservations error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// PATCH — update status (approve/reject)
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !["new", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
    }
    await db.$executeRaw`
      UPDATE Reservation SET status = ${status} WHERE id = ${id}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/reservations error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    await db.$executeRaw`DELETE FROM Reservation WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/reservations error:", error);
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}
