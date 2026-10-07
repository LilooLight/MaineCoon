"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Trash2, PawPrint, X, CalendarClock } from "lucide-react";
import type { Kitten } from "@/lib/types/cattery";
import { useFavorites } from "@/hooks/use-favorites";
import { useBooking } from "./booking-context";
import { BLUR_DATA_URLS } from "@/lib/blur";

interface FavoritesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesPanel({ open, onOpenChange }: FavoritesPanelProps) {
  const { favorites, remove, clear, hydrated } = useFavorites();
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [loading, setLoading] = useState(false);
  const { openBooking } = useBooking();

  useEffect(() => {
    if (!open || favorites.length === 0) {
      return;
    }
    let cancelled = false;
    // Use a microtask to avoid synchronous setState in effect body
    Promise.resolve().then(() => {
      if (!cancelled) setLoading(true);
    });
    fetch("/api/kittens")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const all: Kitten[] = data.kittens ?? [];
        // preserve favorites order
        const ordered = favorites
          .map((id) => all.find((k) => k.id === id))
          .filter((k): k is Kitten => Boolean(k));
        setKittens(ordered);
      })
      .catch(() => {
        if (!cancelled) setKittens([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, favorites]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-background p-0 flex flex-col"
      >
        <SheetHeader className="p-5 border-b border-border space-y-1">
          <SheetTitle className="font-serif text-xl flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent fill-accent" />
            Избранные котята
          </SheetTitle>
          <SheetDescription className="text-sm">
            {hydrated
              ? favorites.length > 0
                ? `${favorites.length} в списке. Список хранится в вашем браузере.`
                : "Здесь появятся котята, которые вам понравились."
              : "Загрузка..."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto custom-scroll p-4">
          {!hydrated ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <PawPrint className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <div>
                <p className="font-serif text-lg font-semibold text-foreground">
                  Пока пусто
                </p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[15rem]">
                  Нажимайте на сердечко в карточке котёнка, чтобы сохранить его
                  здесь для сравнения.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="mt-2 border-primary text-primary hover:bg-primary/10"
              >
                Посмотреть котят
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {kittens.map((kitten) => (
                <li
                  key={kitten.id}
                  className="group relative flex gap-3 p-3 rounded-xl bg-card ring-1 ring-border hover:ring-primary/30 transition-all"
                >
                  <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={kitten.imageUrl}
                      alt={kitten.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URLS.muted}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-serif text-base font-semibold text-foreground truncate">
                          {kitten.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {kitten.colorLabel} · {kitten.personalityLabel}
                        </p>
                      </div>
                      <span className="font-serif text-sm font-semibold text-primary whitespace-nowrap">
                        {kitten.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          kitten.status === "available"
                            ? "border-primary/30 text-primary"
                            : kitten.status === "expected"
                            ? "border-accent/30 text-accent"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {kitten.statusLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          onOpenChange(false);
                          openBooking({ id: kitten.id, name: kitten.name });
                        }}
                        disabled={kitten.status === "adopted"}
                        className="h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90 px-3"
                      >
                        Забронировать
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(kitten.id)}
                        className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2"
                        aria-label={`Убрать ${kitten.name} из избранного`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {hydrated && favorites.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить список
            </Button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              Сохранено в браузере
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
