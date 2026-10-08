import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return sections.map((path) => ({
    url: `${base}/${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : path === "#kittens" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "#kittens" ? 0.9 : 0.7,
  }));
}
