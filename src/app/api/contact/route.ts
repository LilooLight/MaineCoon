import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/contact — submit a contact message from the contacts page
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

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
    if (!subject || subject.trim().length < 3) {
      return NextResponse.json(
        { error: "Укажите тему обращения" },
        { status: 400 }
      );
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Сообщение слишком короткое (минимум 10 символов)" },
        { status: 400 }
      );
    }

    // Use raw SQL to avoid stale Prisma Client issues (the ContactMessage
    // model was added after the dev server cached the client).
    await db.$executeRaw`
      INSERT INTO ContactMessage (id, name, email, phone, subject, message, status, createdAt, updatedAt)
      VALUES (
        lower(hex(randomblob(12))),
        ${name.trim()},
        ${email.trim()},
        ${phone?.trim() || null},
        ${subject.trim()},
        ${message.trim()},
        'new',
        datetime('now'),
        datetime('now')
      )
    `;

    return NextResponse.json(
      {
        success: true,
        message:
          "Сообщение отправлено. Заводчик свяжется с вами в течение 24 часов.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить сообщение. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
