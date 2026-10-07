"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { Award, Trophy, Star, Sparkles } from "lucide-react";
import type { Producer } from "@/lib/types/cattery";
import { BLUR_DATA_URLS } from "@/lib/blur";

function safeParseTitles(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return iso;
  }
}

export function ShowChampions() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/producers")
      .then((r) => r.json())
      .then((data) => {
        setProducers((data.producers ?? []).filter((p: Producer) => p.hasTitles));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Soft decorative glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl -z-10"
        style={{ background: "radial-gradient(circle, var(--secondary), transparent 70%)" }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
            <Trophy className="h-3.5 w-3.5 mr-1.5" />
            Выставочные звёзды
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
            Трое из шести — с титулами. И мы этому рады.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Титулы — приятный бонус, но не самоцель. Эти трое доказали свой тип
            на выставках. Остальные трое — крепкие, здоровые производители без
            ленточек, и это тоже нормально. Главное — характер и генетика.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {producers.map((p, i) => {
              const titles = safeParseTitles(p.titles);
              return (
                <Reveal key={p.id} delay={i * 130}>
                  <SpotlightCard className="rounded-2xl ring-1 ring-border h-full">
                    <Card className="border-0 shadow-md hover:shadow-xl transition-shadow h-full bg-card overflow-hidden">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={p.imageUrl}
                          alt={`${p.name} — выставочный производитель`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URLS.secondary}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {/* Crown badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm">
                          <Trophy className="h-3.5 w-3.5" />
                          {titles[0] ?? "Титулованный"}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                          <h3 className="font-serif text-2xl font-semibold leading-tight">
                            {p.name}
                          </h3>
                          <p className="text-sm text-background/80">{p.colorLabel}</p>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col gap-3">
                        {/* Award chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {titles.map((t, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-secondary/10 text-secondary-foreground"
                            >
                              <Award className="h-3 w-3" />
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {p.bio}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 text-secondary" />
                            {formatDate(p.birthDate)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-primary">
                            <Sparkles className="h-3 w-3" />
                            Гены чистые
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
