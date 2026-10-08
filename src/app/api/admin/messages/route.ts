import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/messages — list contact messages (newest first)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Use raw SQL because ContactMessage was added after the dev server
    // cached the Prisma Client.
    if (status && status !== "all") {
      const rows = await db.$queryRaw<
        { id: string; name: string; preferredDates: string; contactChannel: string; contactValue: string; comment: string; status: string; createdAt: string }[]
      >`SELECT id, name, preferredDates, contactChannel, contactValue, comment, status, createdAt FROM ContactMessage WHERE status = ${status} ORDER BY createdAt DESC LIMIT 100`;
      return NextResponse.json({ messages: rows });
    }

    const rows = await db.$queryRaw<
      { id: string; name: string; preferredDates: string; contactChannel: string; contactValue: string; comment: string; status: string; createdAt: string }[]
    >`SELECT id, name, preferredDates, contactChannel, contactValue, comment, status, createdAt FROM ContactMessage ORDER BY createdAt DESC LIMIT 100`;

    // Stats
    const allRows = await db.$queryRaw<{ status: string }[]>`SELECT status FROM ContactMessage`;
    const stats = {
      total: allRows.length,
      new: allRows.filter((r) => r.status === "new").length,
      read: allRows.filter((r) => r.status === "read").length,
      replied: allRows.filter((r) => r.status === "replied").length,
      closed: allRows.filter((r) => r.status === "closed").length,
    };

    return NextResponse.json({ messages: rows, stats });
  } catch (error) {
    console.error("GET /api/admin/messages error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить сообщения" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/messages — update message status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    }
    const validStatuses = ["new", "read", "replied", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Недопустимый статус" },
        { status: 400 }
      );
    }

    await db.$executeRaw`
      UPDATE ContactMessage SET status = ${status}, updatedAt = datetime('now')
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/messages error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить статус" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/messages?id=...
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    }

    await db.$executeRaw`DELETE FROM ContactMessage WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/messages error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить сообщение" },
      { status: 500 }
    );
  }
}
