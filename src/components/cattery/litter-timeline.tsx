"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "./reveal";
import {
  Calendar,
  Mars,
  Venus,
  PawPrint,
  Sparkles,
  Gift,
  Heart,
  X,
} from "lucide-react";
import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";

interface LitterParent {
  name: string;
  colorLabel: string;
  imageUrl: string;
}

interface Litter {
  id: string;
  name: string;
  bornAt: string;
  expected: boolean;
  notes: string;
  father: LitterParent | null;
  mother: LitterParent | null;
  kittensCount: number;
  availableCount: number;
}

function formatDate(iso: string): { month: string; year: string; day: string } {
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("ru-RU", { month: "short" }),
    year: String(d.getFullYear()),
  };
}

export function LitterTimeline() {
  const [litters, setLitters] = useState<Litter[]>([]);
  const [loading, setLoading] = useState(true);
  const { openWaitingList } = useBooking();

  useEffect(() => {
    fetch("/api/litters")
      .then((r) => r.json())
      .then((data) => {
        setLitters(data.litters ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Split: upcoming (expected) first, then past by date desc
  const sorted = [...litters].sort((a, b) => {
    if (a.expected !== b.expected) return a.expected ? -1 : 1;
    return new Date(b.bornAt).getTime() - new Date(a.bornAt).getTime();
  });

  return (
    <section id="litters" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            <Gift className="h-3.5 w-3.5 mr-1.5" />
            Помёты · хронология
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            2–3 помёта в год — не конвейер
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Вот какие помёты у нас были и какие ожидаются. Мало — потому что
            каждый котёнок — событие, а не позиция в каталоге.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-muted-foreground">Помёты пока не запланированы.</p>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[27px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:-translate-x-1/2" />

            <ol className="space-y-8">
              {sorted.map((litter, i) => {
                const date = formatDate(litter.bornAt);
                const isLeft = i % 2 === 0;
                return (
                  <Reveal key={litter.id} as="li" delay={i * 100}>
                    <div
                      className={`relative flex flex-col sm:flex-row ${
                        isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                      } gap-4 sm:gap-8 items-start`}
                    >
                      {/* Date marker */}
                      <div className="relative flex items-center gap-3 sm:w-1/2 sm:px-6 z-10">
                        <div
                          className={`flex flex-col items-center justify-center h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full ring-4 ring-muted/30 shadow-md ${
                            litter.expected
                              ? "bg-accent text-accent-foreground"
                              : "bg-primary text-primary-foreground"
                          } ${isLeft ? "sm:ml-auto" : "sm:mr-auto"}`}
                        >
                          <span className="text-xs font-semibold leading-none">
                            {date.day}
                          </span>
                          <span className="text-[10px] uppercase leading-none mt-0.5">
                            {date.month}
                          </span>
                          <span className="text-[9px] opacity-70 leading-none mt-0.5">
                            {date.year}
                          </span>
                        </div>
                        {!litter.expected && (
                          <div className="sm:hidden flex flex-col">
                            <p className="font-serif text-lg font-semibold text-foreground leading-tight">
                              {litter.name}
                            </p>
                            {litter.availableCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground mt-1">
                                {litter.availableCount} доступно
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card */}
                      <div className="sm:w-1/2 sm:px-6 flex-1">
                        <Card
                          className={`overflow-hidden border-border bg-card hover:shadow-md transition-shadow ${
                            litter.expected ? "ring-1 ring-accent/30" : ""
                          }`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                              <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                                {litter.name}
                              </h3>
                              {litter.expected ? (
                                <Badge className="bg-accent/10 text-accent border border-accent/30">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  Ожидается
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {date.day} {date.month} {date.year}
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                              {litter.notes}
                            </p>

                            {/* Parents */}
                            <div className="flex items-center gap-3 mb-4">
                              {litter.father && (
                                <ParentMini
                                  icon={Mars}
                                  label="Отец"
                                  parent={litter.father}
                                />
                              )}
                              <X className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                              {litter.mother && (
                                <ParentMini
                                  icon={Venus}
                                  label="Мать"
                                  parent={litter.mother}
                                />
                              )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3 pt-3 border-t border-border flex-wrap">
                              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                <PawPrint className="h-4 w-4 text-primary" />
                                {litter.kittensCount} котят в помёте
                              </span>
                              {!litter.expected && litter.availableCount > 0 && (
                                <Badge className="bg-primary text-primary-foreground">
                                  {litter.availableCount} доступно
                                </Badge>
                              )}
                              {!litter.expected && litter.availableCount === 0 && (
                                <Badge variant="outline" className="text-muted-foreground">
                                  Все в семьях
                                </Badge>
                              )}
                            </div>

                            {litter.expected && (
                              <Button
                                onClick={openWaitingList}
                                size="sm"
                                className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90 h-9"
                              >
                                <Heart className="h-3.5 w-3.5 mr-1.5" />
                                Записаться в лист ожидания
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function ParentMini({
  icon: Icon,
  label,
  parent,
}: {
  icon: typeof Mars;
  label: string;
  parent: LitterParent;
}) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden ring-2 ring-background">
        <Image
          src={parent.imageUrl}
          alt={parent.name}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1">
          <Icon className="h-2.5 w-2.5" />
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate leading-tight">
          {parent.name}
        </p>
        <p className="text-[11px] text-muted-foreground truncate leading-tight">
          {parent.colorLabel}
        </p>
      </div>
    </div>
  );
}
