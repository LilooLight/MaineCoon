import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/search?q=...
// Searches across kittens, producers, and blog posts using raw SQL with
// COLLATE NOCASE for case-insensitive matching (works for Cyrillic too).
// Raw SQL is used because the Prisma Client in the dev server may be stale.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (q.length < 2) {
      return NextResponse.json({
        kittens: [],
        producers: [],
        posts: [],
        total: 0,
      });
    }

    const pattern = `%${q}%`;

    // Search kittens (exclude adopted from top results for relevance)
    const kittens = await db.$queryRaw<
      {
        id: string;
        name: string;
        colorLabel: string;
        personalityLabel: string;
        imageUrl: string;
        statusLabel: string;
        price: number;
      }[]
    >`
      SELECT id, name, colorLabel, personalityLabel, imageUrl, statusLabel, price
      FROM Kitten
      WHERE name LIKE ${pattern} COLLATE NOCASE
         OR colorLabel LIKE ${pattern} COLLATE NOCASE
         OR personalityLabel LIKE ${pattern} COLLATE NOCASE
         OR description LIKE ${pattern} COLLATE NOCASE
      ORDER BY CASE status WHEN 'available' THEN 0 WHEN 'expected' THEN 1 WHEN 'reserved' THEN 2 ELSE 3 END, birthDate DESC
      LIMIT 6
    `;

    const producers = await db.$queryRaw<
      {
        id: string;
        name: string;
        colorLabel: string;
        imageUrl: string;
        role: string;
      }[]
    >`
      SELECT id, name, colorLabel, imageUrl, role
      FROM Producer
      WHERE name LIKE ${pattern} COLLATE NOCASE
         OR colorLabel LIKE ${pattern} COLLATE NOCASE
         OR bio LIKE ${pattern} COLLATE NOCASE
      ORDER BY role ASC
      LIMIT 4
    `;

    const posts = await db.$queryRaw<
      {
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        category: string;
        imageUrl: string;
        readMinutes: number;
      }[]
    >`
      SELECT id, slug, title, excerpt, category, imageUrl, readMinutes
      FROM BlogPost
      WHERE published = 1 AND (
        title LIKE ${pattern} COLLATE NOCASE
        OR excerpt LIKE ${pattern} COLLATE NOCASE
        OR category LIKE ${pattern} COLLATE NOCASE
      )
      ORDER BY createdAt DESC
      LIMIT 4
    `;

    const total = kittens.length + producers.length + posts.length;

    return NextResponse.json({
      kittens,
      producers,
      posts,
      total,
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json(
      { error: "Поиск не удался" },
      { status: 500 }
    );
  }
}
