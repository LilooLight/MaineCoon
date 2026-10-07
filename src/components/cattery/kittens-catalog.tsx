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
  GitCompare,
  Play,
  Pause,
  Video,
  Share2,
} from "lucide-react";
import type { Kitten, Personality } from "@/lib/types/cattery";
import {
  COLOR_OPTIONS,
  GENDER_OPTIONS,
  PERSONALITY_OPTIONS,
  PERSONALITY_DESCRIPTIONS,
} from "@/lib/types/cattery";
import { useBooking } from "./booking-context";
import { SpotlightCard } from "./spotlight-card";
import { useFavorites } from "@/hooks/use-favorites";
import { useCompare } from "./compare-context";
import { LiveAvailability } from "./live-availability";
import { toast } from "sonner";
import { BLUR_DATA_URLS } from "@/lib/blur";

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

  // Listen for filter requests from the personality quiz
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        personality?: Personality;
      };
      if (detail?.personality) {
        setFilters((f) => ({ ...f, personality: detail.personality! }));
      }
    };
    window.addEventListener("cattery:setFilter", handler);
    return () => window.removeEventListener("cattery:setFilter", handler);
  }, []);

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
          <div className="mt-5">
            <LiveAvailability />
          </div>
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
          <div
            key={`${filters.color}-${filters.gender}-${filters.personality}-${filters.status}`}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {kittens.map((kitten, i) => (
              <div
                key={kitten.id}
                className="kitten-card-enter"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <KittenCard
                  kitten={kitten}
                  onSelect={() => setSelected(kitten)}
                  onBook={() => openBooking({ id: kitten.id, name: kitten.name })}
                />
              </div>
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
  const { isFavorite, toggle: toggleFav } = useFavorites();
  const { isComparing, toggle: toggleCompare, canAdd, max } = useCompare();

  const fav = isFavorite(kitten.id);
  const comparing = isComparing(kitten.id);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFav(kitten.id);
    toast(fav ? "Убрано из избранного" : "Добавлено в избранное", {
      description: fav ? undefined : `${kitten.name} теперь в вашем списке.`,
    });
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!comparing && !canAdd) {
      toast.warning(`Можно сравнить максимум ${max} котят`, {
        description: "Уберите одного, чтобы добавить другого.",
      });
      return;
    }
    toggleCompare(kitten.id);
    toast(comparing ? "Убрано из сравнения" : "Добавлено к сравнению", {
      description: comparing ? undefined : `${kitten.name} в списке для сравнения.`,
    });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#kittens`;
    const shareData = {
      title: `${kitten.name} — ${kitten.colorLabel} мейн-кун | Тихий Дом`,
      text: `Посмотрите котёнка ${kitten.name} — ${kitten.personalityLabel.toLowerCase()}, ${kitten.colorLabel.toLowerCase()}. ${kitten.price.toLocaleString("ru-RU")} ₽`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Ссылка скопирована", {
          description: `Поделитесь котёнком ${kitten.name} с близкими.`,
        });
      }
    } catch {
      // user cancelled share — no toast
    }
  };

  return (
    <SpotlightCard className="rounded-2xl ring-1 ring-border h-full">
    <Card className="group overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300 flex flex-col h-full">
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
          placeholder="blur"
          blurDataURL={BLUR_DATA_URLS.muted}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Action buttons (top-right): favorite + compare */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleFav}
            aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
            aria-pressed={fav}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border text-foreground hover:bg-background hover:scale-110 transition-all shadow-sm"
          >
            <Heart
              className={`h-4 w-4 transition-all ${
                fav ? "fill-accent text-accent scale-110" : "text-foreground"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={handleCompare}
            aria-label={comparing ? "Убрать из сравнения" : "Добавить к сравнению"}
            aria-pressed={comparing}
            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm border transition-all shadow-sm ${
              comparing
                ? "bg-secondary text-secondary-foreground border-secondary scale-110"
                : "bg-background/90 border-border text-foreground hover:bg-background hover:scale-110"
            }`}
          >
            <GitCompare className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Поделиться"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border border-border text-foreground hover:bg-background hover:scale-110 transition-all shadow-sm"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Personality badge (top-left) */}
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
    </SpotlightCard>
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
  return (
    <Dialog open={!!kitten} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scroll bg-background p-0">
        {kitten && (
          <KittenDialogContent
            // Remount on kitten change → gallery state resets to 0 naturally
            key={kitten.id}
            kitten={kitten}
            onClose={onClose}
            onBook={onBook}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function KittenDialogContent({
  kitten,
  onBook,
}: {
  kitten: Kitten;
  onClose: () => void;
  onBook: (k: Kitten) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);

  // Build gallery: main kitten image + parent images (as "family" angles)
  const gallery: { src: string; alt: string }[] = [
    { src: kitten.imageUrl, alt: kitten.name },
    ...(kitten.litter?.father
      ? [{ src: kitten.litter.father.imageUrl, alt: `Отец — ${kitten.litter.father.name}` }]
      : []),
    ...(kitten.litter?.mother
      ? [{ src: kitten.litter.mother.imageUrl, alt: `Мать — ${kitten.litter.mother.name}` }]
      : []),
  ];

  const PersonalityIcon = PERSONALITY_ICON[kitten.personality];
  const gender = GENDER_LABEL[kitten.gender];
  const GenderIcon = gender.icon;

  return (
    <>
        <DialogHeader className="sr-only">
          <DialogTitle>{kitten.name} — карточка котёнка</DialogTitle>
          <DialogDescription>
            Подробная информация о котёнке, характере, родителях и условиях.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2">
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-auto sm:min-h-[420px]">
              <Image
                src={gallery[activeImg]?.src ?? kitten.imageUrl}
                alt={gallery[activeImg]?.alt ?? kitten.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-opacity duration-300"
                key={activeImg}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.muted}
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[kitten.status]}`}
              >
                {kitten.statusLabel}
              </span>
            </div>
            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto custom-scroll">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Фото ${i + 1}: ${img.alt}`}
                    className={`relative h-14 w-14 shrink-0 rounded-lg overflow-hidden ring-2 transition-all ${
                      activeImg === i
                        ? "ring-primary scale-105"
                        : "ring-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="56px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URLS.muted}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Behavior preview — Ken Burns animated image with play button */}
            <BehaviorPreview kitten={kitten} />
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
    </>
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

const BEHAVIOR_LABELS: Record<Personality, string> = {
  calm: "Спокойно наблюдает за комнатой — типичное поведение",
  playful: "Активно играет и исследует — типичное поведение",
  independent: "Самостоятельно гуляет по комнате — типичное поведение",
  affectionate: "Ласкается и мурчит — типичное поведение",
};

/**
 * BehaviorPreview — shows a "behavior video" style preview.
 * If kitten.videoUrl is set, plays a real <video>. Otherwise, renders the
 * kitten image with a Ken Burns zoom-pan animation (looping) that simulates
 * a behavior clip, with a play/pause toggle.
 */
function BehaviorPreview({ kitten }: { kitten: Kitten }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center gap-2 mb-2">
        <Video className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground">
          Поведение в движении
        </span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          ~30 сек
        </span>
      </div>
      <div
        className="relative aspect-video rounded-lg overflow-hidden ring-1 ring-border bg-muted/40 cursor-pointer group"
        onClick={() => setPlaying((p) => !p)}
        role="button"
        tabIndex={0}
        aria-label={playing ? "Пауза превью поведения" : "Воспроизвести превью поведения"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setPlaying((p) => !p);
          }
        }}
      >
        {kitten.videoUrl ? (
          // Real video
          <video
            src={kitten.videoUrl}
            poster={kitten.imageUrl}
            className="w-full h-full object-cover"
            autoPlay={playing}
            loop
            muted
            playsInline
            controls={false}
          />
        ) : (
          // Ken Burns animated image as a behavior preview
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute inset-0 transition-transform duration-[8000ms] ease-out ${
                playing ? "ken-burns-zoom" : "scale-100"
              }`}
            >
              <Image
                src={kitten.imageUrl}
                alt={`${kitten.name} — превью поведения`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.muted}
              />
            </div>
            {/* Soft vignette to make it look like video */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
            {/* Timecode bar (decorative) */}
            {playing && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                <div className="h-full bg-accent ken-burns-progress" />
              </div>
            )}
          </div>
        )}

        {/* Play/Pause overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 text-accent-foreground shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </div>
          </div>
        )}
        {playing && (
          <div className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <Pause className="h-4 w-4" />
          </div>
        )}

        {/* Caption */}
        <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
          <p className="text-[10px] text-background/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded inline-block">
            {BEHAVIOR_LABELS[kitten.personality]}
          </p>
        </div>
      </div>
    </div>
  );
}

