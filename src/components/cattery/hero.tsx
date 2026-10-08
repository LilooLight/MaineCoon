"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, FileCheck, Sparkles, ArrowDown, PawPrint, Stethoscope } from "lucide-react";
import type { CatteryStats } from "@/lib/types/cattery";
import { BLUR_DATA_URLS } from "@/lib/blur";
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
    <section id="top" className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Full-screen background image — Машук (real photos) */}
      <div className="absolute inset-0 z-0">
        {/* Mobile: vertical photo (Mashuk 2) — кот смотрит вправо, текст слева */}
        <Image
          src="/images/cattery/mashuk-2.webp"
          alt="Машук — угольно-чёрный мейн-кун, талисман питомника"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URLS.muted}
          className="object-cover sm:hidden"
        />
        {/* Desktop: horizontal photo (Mashuk 3) — фронтальный взгляд */}
        <Image
          src="/images/cattery/mashuk-3.webp"
          alt="Машук — угольно-чёрный мейн-кун, талисман питомника"
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URLS.muted}
          className="object-cover hidden sm:block"
        />
        {/* Gradient overlay for text readability — dark on left, transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent sm:from-background/90 sm:via-background/50 sm:to-transparent" />
        {/* Bottom gradient for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent sm:hidden" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24 relative z-10">
        <div className="max-w-2xl blur-fade flex flex-col gap-6">
          <Badge
            variant="outline"
            className="w-fit gap-2 border-primary/30 bg-background/80 backdrop-blur-sm text-primary px-4 py-1.5 text-sm"
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
            не выставочных звёзд — с родословными, документами и поддержкой на
            всю жизнь.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 text-sm text-foreground/90 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <FileCheck className="h-4 w-4 text-primary" />
              Родословные и документы
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/90 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <Stethoscope className="h-4 w-4 text-primary" />
              Под наблюдением фелинолога
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/90 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
              <Heart className="h-4 w-4 text-accent" />
              Пожизненная поддержка
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/90 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
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
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary text-base h-12 px-7 bg-background/60 backdrop-blur-sm"
            >
              Записаться в лист ожидания
            </Button>
          </div>

          {/* Stats band */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-border/60">
            <StatItem value={stats?.producers ?? 7} label="производителей" />
            <StatItem value={stats?.graduates ?? 20} label="выпускников" />
            <StatItem value={stats?.yearsWork ?? 6} label="лет работы" suffix="" />
            <StatItem
              value={stats?.producers ?? 7}
              label="родословных"
            />
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
