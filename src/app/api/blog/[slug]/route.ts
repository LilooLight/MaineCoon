import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/blog/[slug] — single published post by slug
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await db.blogPost.findFirst({
      where: { slug, published: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Статья не найдена" },
        { status: 404 }
      );
    }

    // Also fetch related posts (same category, excluding current)
    const related = await db.blogPost.findMany({
      where: {
        published: true,
        category: post.category,
        NOT: { id: post.id },
      },
      take: 2,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ post, related });
  } catch (error) {
    console.error("GET /api/blog/[slug] error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить статью" },
      { status: 500 }
    );
  }
}
