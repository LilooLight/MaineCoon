import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/blog/[slug]/view — increment article view count.
// Respects cookie consent: the client only calls this when the user has
// accepted analytics cookies. No PII is stored — just a counter.
//
// Uses raw SQL because the Prisma Client loaded by the Next.js dev server
// may be stale after a schema migration (the `views` field was added to
// BlogPost but the in-memory client predates it). Raw SQL bypasses the
// client's field validation entirely.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Atomic increment via raw SQL — works regardless of client freshness.
    // Parameterized to prevent SQL injection.
    const result = await db.$executeRaw`
      UPDATE BlogPost
      SET views = views + 1
      WHERE slug = ${slug} AND published = 1
    `;

    if (result === 0) {
      return NextResponse.json(
        { error: "Статья не найдена" },
        { status: 404 }
      );
    }

    // Read back the new count for the response
    const rows = await db.$queryRaw<{ views: number }[]>`
      SELECT views FROM BlogPost WHERE slug = ${slug}
    `;
    const views = rows[0]?.views ?? 0;

    return NextResponse.json({ success: true, views });
  } catch (error) {
    console.error("POST /api/blog/[slug]/view error:", error);
    return NextResponse.json(
      { error: "Не удалось записать просмотр" },
      { status: 500 }
    );
  }
}
