"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Moon,
  Sparkles,
  Mountain,
  Heart,
  PawPrint,
  Mars,
  Venus,
  Syringe,
  FileCheck,
  CalendarDays,
  Users,
  ChevronRight,
  Filter,
  X,
  Dna,
} from "lucide-react";
import type { Kitten, Personality } from "@/lib/types/cattery";
import {
  COLOR_OPTIONS,
  GENDER_OPTIONS,
  PERSONALITY_OPTIONS,
  PERSONALITY_DESCRIPTIONS,
} from "@/lib/types/cattery";
import { useBooking } from "./booking-context";

const PERSONALITY_ICON: Record<Personality, typeof Moon> = {
  calm: Moon,
  playful: Sparkles,
  independent: Mountain,
  affectionate: Heart,
};

const STATUS_STYLES: Record<string, string> = {
  available: "bg-primary text-primary-foreground",
  reserved: "bg-secondary text-secondary-foreground",
  adopted: "bg-muted-foreground text-background",
  expected: "bg-accent text-accent-foreground",
};

const GENDER_LABEL: Record<string, { label: string; icon: typeof Mars }> = {
  male: { label: "Кот", icon: Mars },
  female: { label: "Кошка", icon: Venus },
};

export function KittensCatalog() {
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    color: "all",
    gender: "all",
    personality: "all",
    status: "all",
  });
  const [activeCount, setActiveCount] = useState(0);
  const [selected, setSelected] = useState<Kitten | null>(null);
  const { openBooking } = useBooking();

  const fetchKittens = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "all") params.set(k, v);
    });
    try {
      const res = await fetch(`/api/kittens?${params.toString()}`);
      const data = await res.json();
      setKittens(data.kittens ?? []);
    } catch {
      setKittens([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchKittens, 150);
    return () => clearTimeout(t);
  }, [fetchKittens]);

  useEffect(() => {
    setActiveCount(
      Object.values(filters).filter((v) => v !== "all").length
    );
  }, [filters]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ color: "all", gender: "all", personality: "all", status: "all" });
  };

  const availableCount = kittens.filter((k) => k.status === "available").length;

  return (
    <section id="kittens" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
            <PawPrint className="h-3.5 w-3.5 mr-1.5" />
            Каталог котят · с фильтрами
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
            Найдите котёнка под характер семьи
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Фильтр по характеру — то, чего нет ни у одного конкурента. Выбирайте
            не по окрасу, а по темпераменту: спокойный для детей, игривый для
            подростков, ласковый для одинокого хозяина.
          </p>
        </div>

        {/* Filters panel */}
        <div className="rounded-2xl bg-muted/40 ring-1 ring-border p-4 sm:p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Фильтры
              </h3>
              {activeCount > 0 && (
                <Badge className="bg-primary text-primary-foreground ml-1">
                  {activeCount}
                </Badge>
              )}
            </div>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Сбросить
              </Button>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Color filter */}
            <FilterGroup label="Окрас">
              <div className="flex flex-wrap gap-1.5">
                {COLOR_OPTIONS.map((opt) => (
                  <FilterChip
                    key={opt.value}
                    active={filters.color === opt.value}
                    onClick={() => updateFilter("color", opt.value)}
                  >
                    {opt.label}
                  </FilterChip>
                ))}
              </div>
            </FilterGroup>

            {/* Gender filter */}
            <FilterGroup label="Пол">
              <div className="flex flex-wrap gap-1.5">
                {GENDER_OPTIONS.map((opt) => (
                  <FilterChip
                    key={opt.value}
                    active={filters.gender === opt.value}
                    onClick={() => updateFilter("gender", opt.value)}
                  >
                    {opt.label}
                  </FilterChip>
                ))}
              </div>
            </FilterGroup>

            {/* Personality filter — the key differentiator */}
            <FilterGroup label="Характер" highlight>
              <div className="flex flex-wrap gap-1.5">
                {PERSONALITY_OPTIONS.map((opt) => {
                  const Icon =
                    opt.icon === "Moon" ? Moon :
                    opt.icon === "Sparkles" ? Sparkles :
                    opt.icon === "Mountain" ? Mountain :
                    opt.icon === "Heart" ? Heart : PawPrint;
                  return (
                    <FilterChip
                      key={opt.value}
                      active={filters.personality === opt.value}
                      onClick={() => updateFilter("personality", opt.value)}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {opt.label}
                    </FilterChip>
                  );
                })}
              </div>
            </FilterGroup>

            {/* Status filter */}
            <FilterGroup label="Статус">
              <div className="flex flex-wrap gap-1.5">
                <FilterChip
                  active={filters.status === "all"}
                  onClick={() => updateFilter("status", "all")}
                >
                  Все
                </FilterChip>
                <FilterChip
                  active={filters.status === "available"}
                  onClick={() => updateFilter("status", "available")}
                >
                  Доступны
                </FilterChip>
                <FilterChip
                  active={filters.status === "expected"}
                  onClick={() => updateFilter("status", "expected")}
                >
                  Ожидаются
                </FilterChip>
              </div>
            </FilterGroup>
          </div>

          {/* Result count */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                "Загрузка..."
              ) : (
                <>
                  Найдено: <span className="font-semibold text-foreground">{kittens.length}</span> котят
                  {availableCount > 0 && (
                    <>, из них <span className="font-semibold text-primary">{availableCount}</span> доступно</>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Kittens grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl" />
            ))}
          </div>
        ) : kittens.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-muted/30 ring-1 ring-border">
            <PawPrint className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              Котят по фильтрам не нашлось
            </h3>
            <p className="text-muted-foreground mb-5 max-w-md mx-auto">
              Попробуйте смягчить фильтры или запишитесь в лист ожидания — мы
              сообщим, когда появится подходящий котёнок.
            </p>
            <Button onClick={resetFilters} variant="outline">
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kittens.map((kitten) => (
              <KittenCard
                key={kitten.id}
                kitten={kitten}
                onSelect={() => setSelected(kitten)}
                onBook={() => openBooking({ id: kitten.id, name: kitten.name })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Kitten detail dialog */}
      <KittenDialog
        kitten={selected}
        onClose={() => setSelected(null)}
        onBook={(k) => openBooking({ id: k.id, name: k.name })}
      />
    </section>
  );
}

function FilterGroup({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <p className={`text-xs uppercase tracking-wide font-medium ${highlight ? "text-accent" : "text-muted-foreground"}`}>
          {label}
        </p>
        {highlight && (
          <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">
            уникально
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function KittenCard({
  kitten,
  onSelect,
  onBook,
}: {
  kitten: Kitten;
  onSelect: () => void;
  onBook: () => void;
}) {
  const PersonalityIcon = PERSONALITY_ICON[kitten.personality];
  const gender = GENDER_LABEL[kitten.gender];
  const GenderIcon = gender.icon;
  const isAvailable = kitten.status === "available";
  const isExpected = kitten.status === "expected";

  return (
    <Card className="group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 flex flex-col">
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={onSelect}
      >
        <Image
          src={kitten.imageUrl}
          alt={`${kitten.name} — ${kitten.colorLabel}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${STATUS_STYLES[kitten.status]}`}
        >
          {kitten.statusLabel}
        </span>

        {/* Personality badge */}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-background/90 text-foreground backdrop-blur-sm border border-border">
          <PersonalityIcon className="h-3 w-3 text-accent" />
          {kitten.personalityLabel}
        </span>

        {/* Name + price on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
          <div className="text-background">
            <h4 className="font-serif text-xl font-semibold leading-tight">{kitten.name}</h4>
            <p className="text-xs text-background/80">{kitten.colorLabel}</p>
          </div>
          <div className="text-background text-right">
            <p className="font-serif text-lg font-semibold leading-tight">
              {kitten.price.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col gap-3">
        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <GenderIcon className="h-3.5 w-3.5" />
            {gender.label}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatAge(kitten.birthDate)}
          </span>
          {kitten.vaccinated && (
            <span className="inline-flex items-center gap-1 text-primary">
              <Syringe className="h-3.5 w-3.5" />
              Привит
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {kitten.description}
        </p>

        {/* Parents mini */}
        {kitten.litter && (kitten.litter.father || kitten.litter.mother) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 rounded-md px-2.5 py-1.5">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Родители: {kitten.litter.father?.name ?? "—"} × {kitten.litter.mother?.name ?? "—"}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelect}
          className="flex-1 text-muted-foreground hover:text-foreground"
        >
          Подробнее
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        <Button
          size="sm"
          onClick={onBook}
          disabled={kitten.status === "adopted"}
          className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          {isExpected ? "Лист ожидания" : isAvailable ? "Забронировать" : "Узнать"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function KittenDialog({
  kitten,
  onClose,
  onBook,
}: {
  kitten: Kitten | null;
  onClose: () => void;
  onBook: (k: Kitten) => void;
}) {
  if (!kitten) return null;
  const PersonalityIcon = PERSONALITY_ICON[kitten.personality];
  const gender = GENDER_LABEL[kitten.gender];
  const GenderIcon = gender.icon;

  return (
    <Dialog open={!!kitten} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scroll bg-background p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{kitten.name} — карточка котёнка</DialogTitle>
          <DialogDescription>
            Подробная информация о котёнке, характере, родителях и условиях.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[500px]">
            <Image
              src={kitten.imageUrl}
              alt={kitten.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
            <span
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[kitten.status]}`}
            >
              {kitten.statusLabel}
            </span>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-4 overflow-y-auto custom-scroll max-h-[60vh] sm:max-h-[90vh]">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-accent/10 text-accent gap-1">
                  <PersonalityIcon className="h-3 w-3" />
                  {kitten.personalityLabel}
                </Badge>
                <Badge variant="secondary" className="bg-secondary/15">
                  {kitten.colorLabel}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <GenderIcon className="h-3 w-3" />
                  {gender.label}
                </Badge>
              </div>
              <h3 className="font-serif text-3xl font-semibold text-foreground">
                {kitten.name}
              </h3>
              <p className="text-2xl font-serif font-semibold text-primary mt-1">
                {kitten.price.toLocaleString("ru-RU")} ₽
              </p>
            </div>

            {/* Personality description */}
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-xs uppercase tracking-wide text-accent mb-1 flex items-center gap-1.5">
                <PersonalityIcon className="h-3.5 w-3.5" />
                Что значит «{kitten.personalityLabel.toLowerCase()}»
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {PERSONALITY_DESCRIPTIONS[kitten.personality]}
              </p>
            </div>

            <p className="text-foreground/90 leading-relaxed">{kitten.description}</p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <MetaItem icon={CalendarDays} label="Возраст" value={formatAge(kitten.birthDate)} />
              <MetaItem icon={GenderIcon} label="Пол" value={gender.label} />
              <MetaItem icon={Syringe} label="Прививки" value={kitten.vaccinated ? "Готовы" : "В процессе"} />
              <MetaItem icon={FileCheck} label="Документы" value={kitten.documented ? "Метрика" : "—"} />
            </div>

            {/* Parents */}
            {kitten.litter && (kitten.litter.father || kitten.litter.mother) && (
              <div className="border-t border-border pt-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Dna className="h-3.5 w-3.5" />
                  Родители — проверенные производители
                </p>
                <div className="flex gap-2">
                  {kitten.litter.father && (
                    <ParentTag label="Отец" name={kitten.litter.father.name} color={kitten.litter.father.colorLabel} />
                  )}
                  {kitten.litter.mother && (
                    <ParentTag label="Мать" name={kitten.litter.mother.name} color={kitten.litter.mother.colorLabel} />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Оба родителя прошли генетические тесты HCM, PKDef, SMA — все чистые (N/N).
                </p>
              </div>
            )}

            <Button
              onClick={() => {
                onBook(kitten);
                onClose();
              }}
              disabled={kitten.status === "adopted"}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-base mt-2"
            >
              {kitten.status === "expected"
                ? "Записаться в лист ожидания"
                : kitten.status === "available"
                ? "Забронировать этого котёнка"
                : "Узнать о наличии"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Moon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function ParentTag({ label, name, color }: { label: string; name: string; color: string }) {
  return (
    <div className="flex-1 rounded-lg bg-muted/60 p-2.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="text-[11px] text-muted-foreground">{color}</p>
    </div>
  );
}

function formatAge(iso: string): string {
  try {
    const birth = new Date(iso);
    const now = new Date();
    const months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    if (months <= 0) return "новорождённый";
    if (months < 12) return `${months} мес.`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths === 0
      ? `${years} ${years === 1 ? "год" : "года"}`
      : `${years} г. ${remMonths} мес.`;
  } catch {
    return "—";
  }
}
