"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "./reveal";
import { Sparkles, CalendarClock, Heart, PawPrint } from "lucide-react";
import { useBooking } from "./booking-context";

interface Litter {
  id: string;
  name: string;
  bornAt: string;
  expected: boolean;
  notes: string;
  father: { name: string; colorLabel: string; imageUrl: string } | null;
  mother: { name: string; colorLabel: string; imageUrl: string } | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  };
}

export function ExpectedCountdown() {
  const [litter, setLitter] = useState<Litter | null>(null);
  const [loading, setLoading] = useState(true);
  // `now` ticks every second; timeLeft is derived in render (no setState in effect).
  const [now, setNow] = useState(() => Date.now());
  const { openWaitingList } = useBooking();

  useEffect(() => {
    fetch("/api/litters")
      .then((r) => r.json())
      .then((data) => {
        const expected = (data.litters ?? []).find((l: Litter) => l.expected);
        setLitter(expected ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Tick `now` every second only when we have an expected litter.
  useEffect(() => {
    if (!litter) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [litter]);

  // Derive timeLeft from `now` + litter — no sync setState.
  const timeLeft = litter ? calcTimeLeft(new Date(litter.bornAt)) : null;

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!litter || !timeLeft) return null;

  // Reference `now` to satisfy the derivation dependency (no-op use).
  void now;

  const isBorn = timeLeft.total === 0;
  const target = new Date(litter.bornAt);
  const targetStr = target.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="py-8 sm:py-12 bg-background">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Card className="overflow-hidden border-accent/30 bg-gradient-to-br from-accent/5 via-background to-secondary/5 shadow-lg">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: info */}
                <div className="flex flex-col gap-4">
                  <Badge className="w-fit bg-accent/10 text-accent border border-accent/30">
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                    Ожидается помёт
                  </Badge>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground leading-tight mb-2">
                      {litter.name.replace(" (ожидается)", "")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {litter.notes}
                    </p>
                  </div>

                  {/* Parents mini */}
                  {litter.father && litter.mother && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <PawPrint className="h-4 w-4 text-primary" />
                      <span>
                        Родители: <strong className="text-foreground">{litter.father.name}</strong> ×{" "}
                        <strong className="text-foreground">{litter.mother.name}</strong>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4 text-primary" />
                    Ожидаемая дата: <strong className="text-foreground">{targetStr}</strong>
                  </div>
                </div>

                {/* Right: countdown */}
                <div className="flex flex-col items-center gap-4">
                  {isBorn ? (
                    <div className="text-center py-6">
                      <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10 mb-3">
                        <Heart className="h-8 w-8 text-primary fill-primary" />
                      </div>
                      <p className="font-serif text-2xl font-semibold text-foreground">
                        Помёт родился!
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Следите за обновлениями в каталоге.
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">
                        До рождения осталось
                      </p>
                      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
                        <TimeUnit value={timeLeft.days} label="дней" />
                        <TimeUnit value={timeLeft.hours} label="часов" />
                        <TimeUnit value={timeLeft.minutes} label="минут" />
                        <TimeUnit value={timeLeft.seconds} label="секунд" />
                      </div>
                      <button
                        onClick={openWaitingList}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium mt-2 w-full justify-center"
                      >
                        <Heart className="h-4 w-4" />
                        Записаться в лист ожидания
                      </button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center p-2 sm:p-3 rounded-xl bg-card ring-1 ring-border">
      <span className="font-serif text-2xl sm:text-3xl font-semibold text-primary tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}
