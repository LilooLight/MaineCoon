import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/contact — submit a visit planning request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, preferredDates, contactChannel, contactValue, comment } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Укажите имя (минимум 2 символа)" },
        { status: 400 }
      );
    }

    const validChannels = ["phone", "email", "telegram", "vk"];
    if (!validChannels.includes(contactChannel)) {
      return NextResponse.json(
        { error: "Выберите канал связи" },
        { status: 400 }
      );
    }

    if (!contactValue || contactValue.trim().length < 3) {
      return NextResponse.json(
        { error: "Укажите контакт для связи" },
        { status: 400 }
      );
    }

    // Validate contact value based on channel
    if (contactChannel === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue)) {
        return NextResponse.json(
          { error: "Укажите корректный email" },
          { status: 400 }
        );
      }
    }

    // Limit comment to 500 chars
    const cleanComment = (comment || "").slice(0, 500);

    // Serialize dates as JSON string
    const datesJson = JSON.stringify(preferredDates || []);

    // Raw SQL to bypass stale Prisma Client
    await db.$executeRaw`
      INSERT INTO ContactMessage (id, name, preferredDates, contactChannel, contactValue, comment, status, createdAt, updatedAt)
      VALUES (
        lower(hex(randomblob(12))),
        ${name.trim()},
        ${datesJson},
        ${contactChannel},
        ${contactValue.trim()},
        ${cleanComment},
        'new',
        datetime('now'),
        datetime('now')
      )
    `;

    return NextResponse.json(
      {
        success: true,
        message:
          "Заявка на визит отправлена. Мы свяжемся с вами для подтверждения даты.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
