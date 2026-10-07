import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/admin/kittens/[id] — update a kitten
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.kitten.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Котёнок не найден" },
        { status: 404 }
      );
    }

    // Build the update data, only including provided fields
    const data: Record<string, unknown> = {};
    const allowedFields = [
      "name", "color", "colorLabel", "gender", "personality",
      "personalityLabel", "litterId", "imageUrl", "videoUrl",
      "status", "statusLabel", "price", "description", "vaccinated", "documented",
    ];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }
    if (body.birthDate !== undefined) {
      data.birthDate = new Date(body.birthDate);
    }
    if (body.price !== undefined) {
      data.price = Number(body.price);
    }
    if (body.vaccinated !== undefined) {
      data.vaccinated = Boolean(body.vaccinated);
    }
    if (body.documented !== undefined) {
      data.documented = Boolean(body.documented);
    }
    if (body.videoUrl === "") {
      data.videoUrl = null;
    }

    const updated = await db.kitten.update({ where: { id }, data });
    return NextResponse.json({ kitten: updated });
  } catch (error) {
    console.error("PATCH /api/admin/kittens/[id] error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить котёнка" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/kittens/[id] — delete a kitten
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.kitten.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Котёнок не найден" },
        { status: 404 }
      );
    }

    await db.kitten.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/kittens/[id] error:", error);
    return NextResponse.json(
      { error: "Не удалось удалить котёнка" },
      { status: 500 }
    );
  }
}
