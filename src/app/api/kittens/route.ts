import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/kittens?color=black&gender=male&personality=calm&status=available
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const color = searchParams.get("color");
    const gender = searchParams.get("gender");
    const personality = searchParams.get("personality");
    const status = searchParams.get("status");

    const where: Record<string, string> = {};
    if (color && color !== "all") where.color = color;
    if (gender && gender !== "all") where.gender = gender;
    if (personality && personality !== "all") where.personality = personality;
    if (status && status !== "all") where.status = status;

    const kittens = await db.kitten.findMany({
      where,
      include: {
        litter: {
          include: {
            father: true,
            mother: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { birthDate: "desc" }],
    });

    return NextResponse.json({ kittens });
  } catch (error) {
    console.error("GET /api/kittens error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить котят" },
      { status: 500 }
    );
  }
}
