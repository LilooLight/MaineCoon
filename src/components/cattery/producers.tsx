"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileCheck,
  Calendar,
  CheckCircle2,
  FileText,
  Mars,
  Venus,
  Heart,
} from "lucide-react";
import type { Producer, Personality } from "@/lib/types/cattery";
import { PERSONALITY_DESCRIPTIONS } from "@/lib/types/cattery";
import { BLUR_DATA_URLS } from "@/lib/blur";

const PERSONALITY_BADGE: Record<Personality, { label: string; class: string }> = {
  calm: { label: "Спокойный", class: "bg-primary/10 text-primary" },
  playful: { label: "Игривый", class: "bg-secondary/20 text-secondary-foreground" },
  independent: { label: "Независимый", class: "bg-muted text-muted-foreground" },
  affectionate: { label: "Ласковый", class: "bg-accent/10 text-accent" },
};

export function Producers() {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [selected, setSelected] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/producers")
      .then((r) => r.json())
      .then((data) => {
        setProducers(data.producers ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const males = producers.filter((p) => p.role === "male");
  const females = producers.filter((p) => p.role === "female");

  return (
    <section id="producers" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            <FileCheck className="h-3.5 w-3.5 mr-1.5" />
            Производители · открытые документы
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
            7 производителей. Каждый — с родословной и документами.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            У каждого нашего кота и кошки есть родословная WCF, ветеринарный
            паспорт и необходимые прививки. Документы показываем ДО решения о
            бронировании — никаких «доверьтесь нам на слово».
          </p>
        </div>

        {/* Tabs: males / females */}
        <Tabs defaultValue="males" className="w-full">
          <TabsList className="bg-background border border-border h-auto p-1.5 flex-wrap">
            <TabsTrigger value="males" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Mars className="h-4 w-4" />
              Коты ({males.length})
            </TabsTrigger>
            <TabsTrigger value="females" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Venus className="h-4 w-4" />
              Кошки ({females.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="males" className="mt-8">
            <ProducerGrid producers={males} onSelect={setSelected} loading={loading} />
          </TabsContent>
          <TabsContent value="females" className="mt-8">
            <ProducerGrid producers={females} onSelect={setSelected} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail dialog with documents */}
      <ProducerDialog producer={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function ProducerGrid({
  producers,
  onSelect,
  loading,
}: {
  producers: Producer[];
  onSelect: (p: Producer) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 rounded-2xl bg-card animate-pulse ring-1 ring-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {producers.map((p) => {
        const personality = PERSONALITY_BADGE[p.personality];
        return (
          <Card
            key={p.id}
            className="group overflow-hidden border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
            onClick={() => onSelect(p)}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={p.imageUrl}
                alt={`${p.name} — ${p.colorLabel} ${p.role === "male" ? "кот" : "кошка"}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.muted}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Retired badge */}
              {p.retired && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary/20 text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-secondary/30">
                  <Heart className="h-3 w-3" />
                  На пенсии · талисман
                </div>
              )}
              {/* Name + color */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-2xl font-semibold leading-tight">{p.name}</h4>
                    <p className="text-sm text-background/80">{p.colorLabel}</p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium ${personality.class}`}>
                    {personality.label}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {p.bio}
              </p>
              {/* Pedigree badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/10 text-primary">
                  <FileCheck className="h-3 w-3" />
                  Родословная WCF
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Смотреть родословную и документы
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ProducerDialog({
  producer,
  onClose,
}: {
  producer: Producer | null;
  onClose: () => void;
}) {
  if (!producer) return null;
  const personality = PERSONALITY_BADGE[producer.personality];
  const docs = safeParseDocuments(producer.documents);

  return (
    <Dialog open={!!producer} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scroll bg-background p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{producer.name} — карточка производителя</DialogTitle>
          <DialogDescription>
            Полная информация о производителе, родословной и документах.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] sm:aspect-auto sm:min-h-[500px]">
            <Image
              src={producer.imageUrl}
              alt={producer.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URLS.muted}
            />
            {producer.retired && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary/90 text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                <Heart className="h-3 w-3" />
                На пенсии · талисман
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className={personality.class}>
                  {personality.label}
                </Badge>
                <Badge variant="secondary" className="bg-secondary/15">
                  {producer.colorLabel}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {producer.role === "male" ? "Кот" : "Кошка"}
                </Badge>
              </div>
              <h3 className="font-serif text-3xl font-semibold text-foreground">
                {producer.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {producer.retired
                  ? "Талисман питомника · на пенсии"
                  : producer.role === "male"
                  ? "Кот-производитель"
                  : "Кошка-производительница"}{" "}
                · {producer.registry}
              </p>
            </div>

            <p className="text-foreground/90 leading-relaxed">{producer.bio}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Родился: {formatDate(producer.birthDate)}
            </div>

            {/* Personality description */}
            <div className="p-3 rounded-lg bg-muted/60">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                Характер
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {PERSONALITY_DESCRIPTIONS[producer.personality]}
              </p>
            </div>

            {/* Documents — replaces genetic tests */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="h-5 w-5 text-primary" />
                <h4 className="font-serif text-lg font-semibold text-foreground">
                  Документы
                </h4>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-3">
                <p className="text-xs uppercase tracking-wide text-primary mb-1">
                  Родословная
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {producer.registry}
                </p>
              </div>
              <ul className="space-y-2">
                {docs.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {doc}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                <FileText className="h-3 w-3 inline mr-1 text-primary" />
                Все документы показываем до брони. Котёнок приезжает с метрикой,
                ветеринарным паспортом и договором.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function safeParseDocuments(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
