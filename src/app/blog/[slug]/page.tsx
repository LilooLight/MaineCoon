import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackToTop } from "@/components/cattery/back-to-top";
import { Footer } from "@/components/cattery/footer";
import { ArticleViewTracker } from "@/components/cattery/article-view-tracker";
import { BLUR_DATA_URLS } from "@/lib/blur";
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  PawPrint,
  BookOpen,
  Eye,
} from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render known slugs at build time for SSG
export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findFirst({ where: { slug, published: true } });
  if (!post) {
    return { title: "Статья не найдена — Тихий Дом" };
  }
  return {
    title: `${post.title} — блог питомника «Тихий Дом»`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.imageUrl, width: 1344, height: 768 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await db.blogPost.findFirst({ where: { slug, published: true } });

  if (!post) notFound();

  const related = await db.blogPost.findMany({
    where: {
      published: true,
      category: post.category,
      NOT: { id: post.id },
    },
    take: 2,
    orderBy: { createdAt: "desc" },
  });

  // Split content into paragraphs (separated by double newlines in seed)
  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // JSON-LD Article schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    articleSection: post.category,
    author: { "@type": "Organization", name: "Питомник «Тихий Дом»" },
    publisher: {
      "@type": "Organization",
      name: "Питомник «Тихий Дом»",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ArticleViewTracker slug={post.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Mini header (blog article doesn't use the full site header) */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link
            href="/#blog"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Все статьи
          </Link>
          <Link
            href="/#top"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PawPrint className="h-4 w-4" />
            </div>
            <span className="font-serif text-base font-semibold hidden sm:inline">
              Тихий Дом
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <article className="container max-w-3xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="Хлебные крошки"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6"
          >
            <Link href="/#top" className="hover:text-foreground transition-colors">
              Главная
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/#blog" className="hover:text-foreground transition-colors">
              Блог
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate">{post.category}</span>
          </nav>

          {/* Header */}
          <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            {post.category}
          </Badge>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readMinutes} мин чтения
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.views} {pluralizeViews(post.views)}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span>Питомник «Тихий Дом»</span>
          </div>

          {/* Cover image */}
          <div className="relative aspect-[16/8] rounded-2xl overflow-hidden ring-1 ring-border shadow-lg mb-10">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URLS.muted}
            />
          </div>

          {/* Lead paragraph */}
          <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed font-medium mb-8">
            {post.excerpt}
          </p>

          {/* Body */}
          <div className="prose-content space-y-5">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-foreground/80 leading-relaxed text-base sm:text-lg"
              >
                {para}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-primary text-primary-foreground relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, currentColor 1px, transparent 1.5px)",
                backgroundSize: "60px 60px",
              }}
            />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-1">
                  Готовы найти своего котёнка?
                </h2>
                <p className="text-primary-foreground/85 text-sm">
                  Посмотрите доступных котят или задайте вопрос заводчику.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <Link href="/#kittens">Смотреть котят</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/#faq">Вопросы</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="container max-w-3xl px-4 sm:px-6 mt-16">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Похожие статьи
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group flex gap-3 p-4 rounded-xl bg-card ring-1 ring-border hover:ring-primary/30 hover:shadow-md transition-all"
                >
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={rp.imageUrl}
                      alt={rp.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Badge
                      variant="outline"
                      className="text-[10px] mb-1 bg-secondary/5 text-secondary-foreground"
                    >
                      {rp.category}
                    </Badge>
                    <h3 className="font-serif text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {rp.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

function pluralizeViews(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "просмотр";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "просмотра";
  return "просмотров";
}
