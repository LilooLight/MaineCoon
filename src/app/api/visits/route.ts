import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendTelegram, formatVisitNotification } from "@/lib/notify";

// In-memory rate limiter: 5 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 min

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

// POST /api/visits — submit a visit request
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
    const { name, contact, visitDate, message, company, elapsedMs } = body;

    // 2. Honeypot — if hidden "company" field is filled → fake success
    if (company) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // 3. Time check — if filled too fast (< 2500ms) → fake success
    if (elapsedMs !== undefined && Number(elapsedMs) < 2500) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // 4. Validation
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

    // Validate date format if provided
    let cleanDate: string | null = null;
    if (visitDate && typeof visitDate === "string") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
        return NextResponse.json(
          { error: "Неверный формат даты" },
          { status: 400 }
        );
        }
      cleanDate = visitDate;

      // 5. Server-side date check — is this date blocked?
      const blocked = await db.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*) as count FROM UnavailableDay WHERE date = ${cleanDate}
      `;
      if (blocked[0]?.count && blocked[0].count > 0) {
        return NextResponse.json(
          { error: "date_unavailable", message: "Эта дата уже занята. Выберите другую." },
          { status: 400 }
        );
      }
    }

    const cleanMessage = typeof message === "string" ? message.slice(0, 500) : null;

    // 6. Save to DB (raw SQL — bypass stale Prisma client)
    await db.$executeRaw`
      INSERT INTO VisitBooking (id, name, contact, visitDate, message, status, createdAt)
      VALUES (
        lower(hex(randomblob(12))),
        ${name.trim()},
        ${contact.trim()},
        ${cleanDate},
        ${cleanMessage},
        'new',
        datetime('now')
      )
    `;

    // 7. Send Telegram notification (best-effort)
    await sendTelegram(
      formatVisitNotification({
        name: name.trim(),
        contact: contact.trim(),
        visitDate: cleanDate || undefined,
        message: cleanMessage || undefined,
      })
    );

    return NextResponse.json(
      { ok: true, message: "Заявка на визит отправлена. Мы свяжемся с вами для подтверждения." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/visits error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}
