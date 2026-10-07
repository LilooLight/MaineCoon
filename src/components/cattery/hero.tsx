"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShieldCheck, Sparkles, ArrowDown, PawPrint } from "lucide-react";
import type { CatteryStats } from "@/lib/types/cattery";
import { useBooking } from "./booking-context";

export function Hero() {
  const [stats, setStats] = useState<CatteryStats | null>(null);
  const { openWaitingList } = useBooking();

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <section id="top" className="relative overflow-hidden paw-pattern">
      {/* Soft warm background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 via-background to-background" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="blur-fade flex flex-col gap-6">
            <Badge
              variant="outline"
              className="w-fit gap-2 border-primary/30 bg-primary/5 text-primary px-4 py-1.5 text-sm"
            >
              <PawPrint className="h-3.5 w-3.5" />
              Семейный питомник · Москва
            </Badge>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-semibold text-foreground">
              Здоровые, спокойные мейн-куны{" "}
              <span className="text-primary">для вашей семьи</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Маленький питомник, где каждого котёнка знают лично. Мы разводим{" "}
              <span className="text-foreground font-medium">компаньонов</span>, а
              не выставочных звёзд — с прозрачной генетикой, честным подходом и
              поддержкой на всю жизнь.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Гены HCM, PKDef, SMA открыты
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Heart className="h-4 w-4 text-accent" />
                Пожизненная поддержка
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Sparkles className="h-4 w-4 text-secondary" />
                Фильтр по характеру
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base h-12 px-7"
              >
                <Link href="#kittens">Найти своего котёнка</Link>
              </Button>
              <Button
                onClick={openWaitingList}
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary text-base h-12 px-7"
              >
                Записаться в лист ожидания
              </Button>
            </div>

            {/* Stats band */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border">
              <StatItem value={stats?.producers ?? 6} label="производителей" />
              <StatItem value={stats?.graduates ?? 20} label="выпускников" />
              <StatItem value={stats?.yearsWork ?? 6} label="лет работы" suffix="" />
              <StatItem
                value={stats?.geneticTests ?? 18}
                label="открытых тестов"
              />
            </div>
          </div>

          {/* Right: image */}
          <div className="relative blur-fade" style={{ animationDelay: "0.15s" }}>
            <div className="relative aspect-[4/3] sm:aspect-[5/4] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border">
              <Image
                src="/images/cattery/hero.jpg"
                alt="Спокойный мейн-кун на диване в домашней обстановке"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating honesty card */}
            <div className="absolute -bottom-5 -left-3 sm:-left-6 max-w-[230px] bg-card rounded-xl shadow-lg ring-1 ring-border p-4 blur-fade" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                  <Heart className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    У нас мало котят
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    Потому что мы не конвейер. Каждый — событие.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating test card */}
            <div className="absolute -top-3 -right-2 sm:-right-5 max-w-[200px] bg-card rounded-xl shadow-lg ring-1 ring-border p-3.5 blur-fade" style={{ animationDelay: "0.55s" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Генетика чистая</p>
                  <p className="text-[11px] text-muted-foreground">HCM · PKDef · SMA — N/N</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hidden lg:flex justify-center mt-16">
          <Link
            href="#about"
            className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Подробнее</span>
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-serif text-2xl sm:text-3xl font-semibold text-primary tabular-nums">
        {value}
        {suffix}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground leading-tight">
        {label}
      </span>
    </div>
  );
}
