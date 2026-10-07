import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/bookings — online reservation or waiting list (the differentiator)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, kittenId, kittenName, message, type } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Укажите имя (минимум 2 символа)" },
        { status: 400 }
      );
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Укажите корректный email" },
        { status: 400 }
      );
    }
    if (!phone || phone.trim().length < 6) {
      return NextResponse.json(
        { error: "Укажите корректный телефон" },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        kittenId: kittenId || null,
        kittenName: kittenName || null,
        message: (message || "").trim(),
        type: type === "waiting-list" ? "waiting-list" : "booking",
        status: "new",
      },
    });

    return NextResponse.json(
      {
        success: true,
        id: booking.id,
        message:
          type === "waiting-list"
            ? "Заявка в лист ожидания принята. Мы свяжемся с вами, когда появится подходящий котёнок."
            : "Заявка на бронирование принята. Заводчик свяжется с вами в течение 24 часов.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
