"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, GitCompare, Trash2, Check, Minus } from "lucide-react";
import type { Kitten } from "@/lib/types/cattery";
import { useCompare } from "./compare-context";
import { useBooking } from "./booking-context";
import { toast } from "sonner";
import { BLUR_DATA_URLS } from "@/lib/blur";

const PERSONALITY_LABEL_RU: Record<string, string> = {
  calm: "Спокойный",
  playful: "Игривый",
  independent: "Независимый",
  affectionate: "Ласковый",
};

const STATUS_LABEL_RU: Record<string, string> = {
  available: "Доступен",
  reserved: "Забронирован",
  adopted: "В семье",
  expected: "Ожидается",
};

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
    const rem = months % 12;
    return rem === 0 ? `${years} г.` : `${years} г. ${rem} мес.`;
  } catch {
    return "—";
  }
}

export function CompareBar() {
  const { ids, remove, clear, max } = useCompare();
  const { openBooking } = useBooking();
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  // Visibility is derived from selection, not stored — avoids sync setState.
  const visible = ids.length > 0;

  useEffect(() => {
    if (ids.length === 0) {
      return;
    }
    let cancelled = false;
    fetch("/api/kittens")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const all: Kitten[] = data.kittens ?? [];
        setKittens(
          ids
            .map((id) => all.find((k) => k.id === id))
            .filter((k): k is Kitten => Boolean(k))
        );
      })
      .catch(() => {
        if (!cancelled) setKittens([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <>
      {/* Floating bar */}
      <div
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-16 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-foreground text-background shadow-2xl ring-1 ring-foreground/20 max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-2 shrink-0">
            <GitCompare className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium hidden sm:inline">
              Сравнение ({ids.length}/{max})
            </span>
          </div>

          {/* Selected thumbs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll max-w-[40vw] sm:max-w-xs">
            {kittens.map((k) => (
              <div
                key={k.id}
                className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden ring-2 ring-secondary/40"
              >
                <Image
                  src={k.imageUrl}
                  alt={k.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URLS.muted}
                />
                <button
                  onClick={() => remove(k.id)}
                  aria-label={`Убрать ${k.name}`}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setDialogOpen(true)}
              disabled={ids.length < 2}
              className="h-8 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs"
            >
              Сравнить
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              className="h-8 text-background/70 hover:text-background hover:bg-background/10 text-xs px-2"
              aria-label="Очистить сравнение"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison dialog */}
      <CompareDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        kittens={kittens}
        onRemove={remove}
        onBook={(k) => {
          setDialogOpen(false);
          openBooking({ id: k.id, name: k.name });
        }}
      />
    </>
  );
}

function CompareDialog({
  open,
  onOpenChange,
  kittens,
  onRemove,
  onBook,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  kittens: Kitten[];
  onRemove: (id: string) => void;
  onBook: (k: Kitten) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Сравнение котят</DialogTitle>
          <DialogDescription>
            Бок о бок: характер, окрас, пол, возраст, цена, статус.
          </DialogDescription>
        </DialogHeader>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-secondary" />
            <h3 className="font-serif text-xl font-semibold text-foreground">
              Сравнение котят
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-auto custom-scroll max-h-[calc(90vh-80px)]">
          {kittens.length < 2 ? (
            <div className="p-10 text-center text-muted-foreground">
              Добавьте хотя бы двух котят для сравнения.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {/* Image row */}
                <tr>
                  <th className="sticky left-0 z-10 bg-background w-32 align-bottom p-3 text-xs uppercase tracking-wide text-muted-foreground font-medium border-b border-border">
                    Фото
                  </th>
                  {kittens.map((k) => (
                    <td key={k.id} className="p-3 align-bottom border-b border-border min-w-[140px]">
                      <div className="relative aspect-square rounded-lg overflow-hidden ring-1 ring-border">
                        <Image
                          src={k.imageUrl}
                          alt={k.name}
                          fill
                          sizes="140px"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URLS.muted}
                        />
                        <button
                          onClick={() => onRemove(k.id)}
                          className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          aria-label={`Убрать ${k.name}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
                {/* Name */}
                <CompareRow label="Имя">
                  {kittens.map((k) => (
                    <CompareCell key={k.id} highlight>
                      <span className="font-serif text-base font-semibold text-foreground">
                        {k.name}
                      </span>
                    </CompareCell>
                  ))}
                </CompareRow>
                {/* Status */}
                <CompareRow label="Статус">
                  {kittens.map((k) => (
                    <CompareCell key={k.id}>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          k.status === "available"
                            ? "bg-primary/10 text-primary"
                            : k.status === "expected"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {STATUS_LABEL_RU[k.status] ?? k.statusLabel}
                      </span>
                    </CompareCell>
                  ))}
                </CompareRow>
                {/* Color */}
                <CompareRow label="Окрас">
                  {kittens.map((k) => (
                    <CompareCell key={k.id}>{k.colorLabel}</CompareCell>
                  ))}
                </CompareRow>
                {/* Gender */}
                <CompareRow label="Пол">
                  {kittens.map((k) => (
                    <CompareCell key={k.id}>
                      {k.gender === "male" ? "Кот" : "Кошка"}
                    </CompareCell>
                  ))}
                </CompareRow>
                {/* Personality */}
                <CompareRow label="Характер">
                  {kittens.map((k) => (
                    <CompareCell key={k.id}>
                      {PERSONALITY_LABEL_RU[k.personality] ?? k.personalityLabel}
                    </CompareCell>
                  ))}
                </CompareRow>
                {/* Age */}
                <CompareRow label="Возраст">
                  {kittens.map((k) => (
                    <CompareCell key={k.id}>{formatAge(k.birthDate)}</CompareCell>
                  ))}
                </CompareRow>
                {/* Vaccinated */}
                <CompareRow label="Привит">
                  {kittens.map((k) => (
                    <CompareCell key={k.id}>
                      {k.vaccinated ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </CompareCell>
                  ))}
                </CompareRow>
                {/* Price */}
                <CompareRow label="Цена">
                  {kittens.map((k) => (
                    <CompareCell key={k.id} highlight>
                      <span className="font-serif text-lg font-semibold text-primary">
                        {k.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </CompareCell>
                  ))}
                </CompareRow>
                {/* Action row */}
                <tr>
                  <th className="sticky left-0 z-10 bg-background w-32 align-top p-3 text-xs uppercase tracking-wide text-muted-foreground font-medium border-b-0" />
                  {kittens.map((k) => (
                    <td key={k.id} className="p-3 align-top border-b-0">
                      <Button
                        size="sm"
                        onClick={() => onBook(k)}
                        disabled={k.status === "adopted"}
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-9"
                      >
                        {k.status === "expected" ? "Лист ожидания" : "Забронировать"}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <th className="sticky left-0 z-10 bg-background w-32 align-top p-3 text-xs uppercase tracking-wide text-muted-foreground font-medium border-b border-border">
        {label}
      </th>
      {children}
    </tr>
  );
}

function CompareCell({
  children,
  highlight,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <td
      className={`p-3 align-top border-b border-border min-w-[140px] text-sm ${
        highlight ? "bg-muted/30" : ""
      }`}
    >
      {children}
    </td>
  );
}

// Silence unused import warning when toast isn't used directly here
void toast;
