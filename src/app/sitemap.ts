import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://tiliydom.ru";
  const now = new Date();

  const sections = [
    "",
    "/about",
    "/contacts",
    "#about",
    "#producers",
    "#kittens",
    "#litters",
    "#reviews",
    "#blog",
    "#faq",
    "#quiz",
  ];

  const sectionEntries: MetadataRoute.Sitemap = sections.map((path) => ({
    url: `${base}/${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : path === "#kittens" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "#kittens" ? 0.9 : 0.7,
  }));

  // Include all published blog articles
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    blogEntries = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    // DB may not be ready at build time — skip silently
  }

  return [...sectionEntries, ...blogEntries];
}
