import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTelegram, formatReservationNotification } from "@/lib/notify";

// In-memory rate limiter (same as visits)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// POST /api/reserve — reserve a kitten
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    // 1. Rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Слишком много заявок. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { kittenId, name, contact, message, company, elapsedMs } = body;

    // 2. Honeypot
    if (company) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // 3. Time check
    if (elapsedMs !== undefined && Number(elapsedMs) < 2500) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // 4. Validation
    if (!kittenId || typeof kittenId !== "string") {
      return NextResponse.json(
        { error: "Не указан котёнок" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: "Имя должно быть от 2 до 100 символов" },
        { status: 400 }
      );
    }

    if (!contact || typeof contact !== "string" || contact.trim().length < 5 || contact.trim().length > 200) {
      return NextResponse.json(
        { error: "Укажите корректный контакт (от 5 до 200 символов)" },
        { status: 400 }
      );
    }

    // 5. Check kitten exists and is available (raw SQL)
    const kittens = await db.$queryRaw<{ id: string; name: string; status: string }[]>`
      SELECT id, name, status FROM Kitten WHERE id = ${kittenId}
    `;

    if (!kittens[0]) {
      return NextResponse.json(
        { error: "Котёнок не найден" },
        { status: 400 }
      );
    }

    if (kittens[0].status !== "available") {
      return NextResponse.json(
        { error: "kitten_unavailable", message: "Этот котёнок уже забронирован или продан." },
        { status: 400 }
      );
    }

    const cleanMessage = typeof message === "string" ? message.slice(0, 500) : null;

    // 6. Save reservation (raw SQL)
    await db.$executeRaw`
      INSERT INTO Reservation (id, kittenId, name, contact, message, status, createdAt)
      VALUES (
        lower(hex(randomblob(12))),
        ${kittenId},
        ${name.trim()},
        ${contact.trim()},
        ${cleanMessage},
        'new',
        datetime('now')
      )
    `;

    // 7. Send Telegram notification (best-effort)
    await sendTelegram(
      formatReservationNotification({
        kittenName: kittens[0].name,
        name: name.trim(),
        contact: contact.trim(),
        message: cleanMessage || undefined,
      })
    );

    return NextResponse.json(
      { ok: true, message: "Заявка на бронирование отправлена. Мы свяжемся с вами." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reserve error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
