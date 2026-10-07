import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/bookings/list — all bookings for admin (newest first)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: Record<string, string> = {};
    if (status && status !== "all") where.status = status;
    if (type && type !== "all") where.type = type;

    const bookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Stats summary
    const all = await db.booking.findMany();
    const stats = {
      total: all.length,
      new: all.filter((b) => b.status === "new").length,
      contacted: all.filter((b) => b.status === "contacted").length,
      confirmed: all.filter((b) => b.status === "confirmed").length,
      closed: all.filter((b) => b.status === "closed").length,
      waitingList: all.filter((b) => b.type === "waiting-list").length,
      bookings: all.filter((b) => b.type === "booking").length,
    };

    return NextResponse.json({ bookings, stats });
  } catch (error) {
    console.error("GET /api/bookings/list error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings/list — update booking status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    }
    const validStatuses = ["new", "contacted", "confirmed", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Недопустимый статус" },
        { status: 400 }
      );
    }

    const updated = await db.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error("PATCH /api/bookings/list error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить заявку" },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/list — delete a booking
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
    }

    await db.booking.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookings/list error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить заявку" },
      { status: 500 }
    );
  }
}
