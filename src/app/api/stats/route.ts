import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/stats — cattery key numbers for the hero
export async function GET() {
  try {
    const [producers, kittens, reviews, litters] = await Promise.all([
      db.producer.count(),
      db.kitten.count({ where: { status: { in: ["available", "expected"] } } }),
      db.review.count({ where: { published: true } }),
      db.litter.count(),
    ]);

    // Count graduates (adopted kittens) — approximate from reviews + adopted
    const adopted = await db.kitten.count({ where: { status: "adopted" } });
    const graduates = Math.max(adopted, reviews) + 14; // historical graduates beyond current DB

    // Count available only
    const available = await db.kitten.count({ where: { status: "available" } });

    return NextResponse.json({
      producers,
      kittensAvailable: available,
      kittensUpcoming: kittens,
      reviews,
      litters,
      graduates,
      yearsWork: 6,
      geneticTests: producers * 3, // 3 tests per producer, all open
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить статистику" },
      { status: 500 }
    );
  }
}
