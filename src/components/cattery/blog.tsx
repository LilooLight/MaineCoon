"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types/cattery";
import { Reveal } from "./reveal";
import { useBooking } from "./booking-context";
import { BLUR_DATA_URLS } from "@/lib/blur";

const CATEGORY_COLORS: Record<string, string> = {
  "Здоровье": "bg-primary/10 text-primary",
  "Характер": "bg-accent/10 text-accent",
  "Уход": "bg-secondary/20 text-secondary-foreground",
  "Выбор": "bg-muted text-muted-foreground",
};

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { openWaitingList } = useBooking();

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const [featured, ...rest] = posts;

  return (
    <section id="blog" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10 lg:mb-14">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Блог · честные ответы
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
              Читайте, прежде чем выбирать
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Статьи под информационные запросы: как выбрать котёнка, что значат
              генетические тесты, как проходит социализация. Без маркетинга.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-2xl bg-card animate-pulse ring-1 ring-border" />
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-card animate-pulse ring-1 ring-border" />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? null : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured post */}
            {featured && (
              <Reveal>
                <Link href={`/blog/${featured.slug}`} className="group block h-full">
                  <Card className="overflow-hidden border-border bg-card hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={featured.imageUrl}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URLS.muted}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                        <Badge
                          className={`mb-2 ${CATEGORY_COLORS[featured.category] ?? "bg-primary/20 text-primary"}`}
                        >
                          {featured.category}
                        </Badge>
                        <h3 className="font-serif text-2xl font-semibold leading-tight mb-2">
                          {featured.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-background/80">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {featured.readMinutes} мин чтения
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <p className="text-muted-foreground leading-relaxed line-clamp-2">
                        {featured.excerpt}
                      </p>
                      <span className="inline-flex items-center mt-3 text-sm text-primary hover:text-primary/80 transition-colors">
                        Читать статью
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            )}

            {/* Other posts list */}
            <div className="flex flex-col gap-4">
              {rest.slice(0, 3).map((post, i) => (
                <Reveal key={post.id} delay={i * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <Card className="overflow-hidden border-border bg-card hover:shadow-md transition-shadow flex sm:flex-row flex-col h-full">
                      <div className="relative sm:w-32 h-32 sm:h-auto shrink-0 overflow-hidden">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          sizes="128px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URLS.muted}
                        />
                      </div>
                      <CardContent className="p-4 flex flex-col gap-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-[10px] ${CATEGORY_COLORS[post.category] ?? "bg-primary/20 text-primary"}`}
                          >
                            {post.category}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readMinutes} мин
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              ))}
              <Reveal delay={300} className="text-center pt-2">
                <Button
                  onClick={openWaitingList}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Записаться в лист ожидания
                </Button>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
