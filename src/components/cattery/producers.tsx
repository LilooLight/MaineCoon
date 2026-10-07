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
  Dna,
  Award,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Mars,
  Venus,
  Heart,
  Info,
} from "lucide-react";
import type { Producer, Personality } from "@/lib/types/cattery";
import { PERSONALITY_DESCRIPTIONS } from "@/lib/types/cattery";

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
            <Dna className="h-3.5 w-3.5 mr-1.5" />
            Производители · открытая генетика
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
            6 производителей. Все тесты — на виду.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Из шести кошек и котов титулы есть лишь у трёх. Мы не скрываем это —
            потому что титул не гарантирует здорового котёнка. Гарантируют чистые
            тесты HCM, PKDef и SMA. Они — ниже, у каждого производителя.
          </p>
        </div>

        {/* Honesty note */}
        <div className="mb-10 flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
          <p className="text-sm text-secondary-foreground/90 leading-relaxed">
            <strong>Честно:</strong> три производителя из шести не имеют
            выставочных титулов. Зато все шестеро прошли генетическое
            тестирование на три ключевых заболевания породы — и результаты у всех
            чистые (N/N). Это важнее ленточек.
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

      {/* Detail dialog with full genetic tests */}
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
        const titles = safeParseTitles(p.titles);
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
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Title badge */}
              {p.hasTitles ? (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary/90 text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                  <Award className="h-3 w-3" />
                  {titles[0] ?? "Титулованный"}
                </div>
              ) : (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/90 text-muted-foreground px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-border">
                  <Heart className="h-3 w-3" />
                  Без титулов — честно
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
              {/* Mini genetic tests */}
              <div className="flex items-center gap-2 flex-wrap">
                <MiniTest label="HCM" value={p.testHCM} />
                <MiniTest label="PKDef" value={p.testPKDef} />
                <MiniTest label="SMA" value={p.testSMA} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-primary hover:bg-primary/10 hover:text-primary"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Смотреть тесты и родословную
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function MiniTest({ label, value }: { label: string; value: string }) {
  const isClean = value === "N/N";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
        isClean
          ? "bg-primary/10 text-primary"
          : "bg-accent/10 text-accent"
      }`}
    >
      <CheckCircle2 className="h-3 w-3" />
      {label}: {value}
    </span>
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
  const titles = safeParseTitles(producer.titles);
  const personality = PERSONALITY_BADGE[producer.personality];

  return (
    <Dialog open={!!producer} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto custom-scroll bg-background p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{producer.name} — карточка производителя</DialogTitle>
          <DialogDescription>
            Полная информация о производителе, генетических тестах и родословной.
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
            />
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
                {producer.hasTitles ? (
                  <Badge className="bg-secondary text-secondary-foreground gap-1">
                    <Award className="h-3 w-3" />
                    Титулованный
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground gap-1">
                    <Heart className="h-3 w-3" />
                    Без титулов
                  </Badge>
                )}
              </div>
              <h3 className="font-serif text-3xl font-semibold text-foreground">
                {producer.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {producer.role === "male" ? "Кот-производитель" : "Кошка-производительница"} · {producer.registry}
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

            {/* Titles */}
            {titles.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  Выставочные титулы
                </p>
                <div className="flex flex-wrap gap-2">
                  {titles.map((t, i) => (
                    <Badge key={i} variant="outline" className="bg-secondary/10 text-secondary-foreground">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Genetic tests — the key transparency */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h4 className="font-serif text-lg font-semibold text-foreground">
                  Генетические тесты
                </h4>
                <span className="text-xs text-muted-foreground ml-auto">
                  от {producer.testDate}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <FullTest label="HCM" value={producer.testHCM} desc="Гипертрофическая кардиомиопатия" />
                <FullTest label="PKDef" value={producer.testPKDef} desc="Дефицит пируваткиназы" />
                <FullTest label="SMA" value={producer.testSMA} desc="Спинальная мышечная атрофия" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                <CheckCircle2 className="h-3 w-3 inline mr-1 text-primary" />
                Все тесты чистые (N/N) — производитель не носит мутаций и не передаст их котятам.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FullTest({ label, value, desc }: { label: string; value: string; desc: string }) {
  const isClean = value === "N/N";
  return (
    <div
      className={`rounded-lg p-3 text-center border ${
        isClean ? "border-primary/30 bg-primary/5" : "border-accent/30 bg-accent/5"
      }`}
    >
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="font-serif text-lg font-semibold text-primary mt-0.5">{value}</p>
      <p className="text-[10px] text-muted-foreground leading-tight mt-1">{desc}</p>
    </div>
  );
}

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
