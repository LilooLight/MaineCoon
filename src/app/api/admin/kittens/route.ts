import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/kittens — list all kittens for admin (including unpublished fields)
export async function GET() {
  try {
    const kittens = await db.kitten.findMany({
      include: {
        litter: {
          include: {
            father: { select: { name: true } },
            mother: { select: { name: true } },
          },
        },
      },
      orderBy: [{ status: "asc" }, { birthDate: "desc" }],
    });

    const litters = await db.litter.findMany({
      include: {
        father: { select: { name: true, colorLabel: true } },
        mother: { select: { name: true, colorLabel: true } },
      },
      orderBy: { bornAt: "desc" },
    });

    return NextResponse.json({ kittens, litters });
  } catch (error) {
    console.error("GET /api/admin/kittens error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить котят" },
      { status: 500 }
    );
  }
}

// POST /api/admin/kittens — create a new kitten
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["name", "color", "colorLabel", "gender", "personality", "personalityLabel", "litterId", "birthDate", "imageUrl", "statusLabel", "price", "description"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Поле «${field}» обязательно` },
          { status: 400 }
        );
      }
    }

    // Use raw SQL to bypass stale Prisma Client (videoUrl field was added
    // after the dev server cached the client).
    const status = body.status || "available";
    const documented = body.documented !== undefined ? (body.documented ? 1 : 0) : 1;
    const vaccinated = body.vaccinated ? 1 : 0;
    const videoUrl = body.videoUrl || null;

    await db.$executeRaw`
      INSERT INTO Kitten (id, name, color, colorLabel, gender, personality, personalityLabel, litterId, birthDate, imageUrl, videoUrl, status, statusLabel, price, description, vaccinated, documented, createdAt, updatedAt)
      VALUES (
        lower(hex(randomblob(12))),
        ${body.name},
        ${body.color},
        ${body.colorLabel},
        ${body.gender},
        ${body.personality},
        ${body.personalityLabel},
        ${body.litterId},
        ${new Date(body.birthDate).toISOString()},
        ${body.imageUrl},
        ${videoUrl},
        ${status},
        ${body.statusLabel},
        ${Number(body.price)},
        ${body.description},
        ${vaccinated},
        ${documented},
        datetime('now'),
        datetime('now')
      )
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/kittens error:", error);
    return NextResponse.json(
      { error: "Не удалось создать котёнка" },
      { status: 500 }
    );
  }
}
