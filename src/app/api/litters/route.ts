import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/litters — all litters with parent names, for the timeline section
export async function GET() {
  try {
    const litters = await db.litter.findMany({
      include: {
        father: { select: { name: true, colorLabel: true, imageUrl: true } },
        mother: { select: { name: true, colorLabel: true, imageUrl: true } },
        _count: { select: { kittens: true } },
      },
      orderBy: { bornAt: "desc" },
    });

    // Count available kittens per litter
    const withAvailability = await Promise.all(
      litters.map(async (l) => {
        const available = await db.kitten.count({
          where: { litterId: l.id, status: "available" },
        });
        return {
          id: l.id,
          name: l.name,
          bornAt: l.bornAt.toISOString(),
          expected: l.expected,
          notes: l.notes,
          father: l.father
            ? { name: l.father.name, colorLabel: l.father.colorLabel, imageUrl: l.father.imageUrl }
            : null,
          mother: l.mother
            ? { name: l.mother.name, colorLabel: l.mother.colorLabel, imageUrl: l.mother.imageUrl }
            : null,
          kittensCount: l._count.kittens,
          availableCount: available,
        };
      })
    );

    return NextResponse.json({ litters: withAvailability });
  } catch (error) {
    console.error("GET /api/litters error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить помёты" },
      { status: 500 }
    );
  }
}
