import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/producers — all breeding cats (raw SQL to bypass stale Prisma client)
export async function GET() {
  try {
    const producers = await db.$queryRaw<
      {
        id: string;
        name: string;
        role: string;
        color: string;
        colorLabel: string;
        birthDate: string;
        imageUrl: string;
        bio: string;
        personality: string;
        retired: number;
        registry: string;
        documents: string;
      }[]
    >`SELECT id, name, role, color, colorLabel, birthDate, imageUrl, bio, personality, retired, registry, documents FROM Producer ORDER BY role ASC, birthDate ASC`;

    // Convert retired from 0/1 to boolean
    const result = producers.map((p) => ({
      ...p,
      retired: Boolean(p.retired),
    }));

    return NextResponse.json({ producers: result });
  } catch (error) {
    console.error("GET /api/producers error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить производителей" },
      { status: 500 }
    );
  }
}
