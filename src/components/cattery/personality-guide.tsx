"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "./reveal";
import {
  Moon,
  Sparkles,
  Mountain,
  Heart,
  PawPrint,
  Baby,
  Briefcase,
  Users,
  Cat,
  Check,
  X,
} from "lucide-react";
import type { Personality } from "@/lib/types/cattery";

interface PersonalityDetail {
  type: Personality;
  label: string;
  icon: typeof Moon;
  tagline: string;
  description: string;
  accentClass: string;
  iconBg: string;
  bestFor: { icon: typeof Baby; label: string }[];
  notFor: { label: string }[];
  traits: { label: string; value: "high" | "medium" | "low" }[];
}

const PERSONALITIES: PersonalityDetail[] = [
  {
    type: "calm",
    label: "Спокойный",
    icon: Moon,
    tagline: "Скала в бурлящем мире",
    description:
      "Не суетится, не пугается гостей, мирно спит у батареи. Идеален для семей с маленькими детьми — терпит объятия и не царапается. Передаёт уравновешенность потомству.",
    accentClass: "from-primary/10 to-primary/5 border-primary/20",
    iconBg: "bg-primary text-primary-foreground",
    bestFor: [
      { icon: Baby, label: "Семьи с малышами" },
      { icon: Users, label: "Многодетные семьи" },
      { icon: Moon, label: "Тихий дом" },
    ],
    notFor: [{ label: "Любители активных игр" }],
    traits: [
      { label: "Активность", value: "low" },
      { label: "Ласка", value: "medium" },
      { label: "Терпение", value: "high" },
      { label: "Самостоятельность", value: "medium" },
    ],
  },
  {
    type: "playful",
    label: "Игривый",
    icon: Sparkles,
    tagline: "Вечный котёнок внутри",
    description:
      "Энергичный исследователь квартиры. Обожает мячики, перья и интерактивные игрушки. Подходит семьям с детьми постарше и активным хозяевам — нужен выход энергии.",
    accentClass: "from-secondary/15 to-secondary/5 border-secondary/30",
    iconBg: "bg-secondary text-secondary-foreground",
    bestFor: [
      { icon: Baby, label: "Дети-школьники" },
      { icon: Users, label: "Активные семьи" },
      { icon: Cat, label: "Дом с животными" },
    ],
    notFor: [{ label: "Занятые одинокие хозяева" }],
    traits: [
      { label: "Активность", value: "high" },
      { label: "Ласка", value: "medium" },
      { label: "Терпение", value: "medium" },
      { label: "Самостоятельность", value: "low" },
    ],
  },
  {
    type: "independent",
    label: "Независимый",
    icon: Mountain,
    tagline: "Рядом, но не навязчивый",
    description:
      "Любит быть в комнате с хозяином, но не на коленях. Самостоятельный, преданный одному человеку. Идеален для опытных кошатников и тех, кто много работает.",
    accentClass: "from-muted to-muted/40 border-border",
    iconBg: "bg-muted-foreground text-background",
    bestFor: [
      { icon: Briefcase, label: "Удалёнщики" },
      { icon: Cat, label: "Опытные кошатники" },
      { icon: Moon, label: "Тихий образ жизни" },
    ],
    notFor: [{ label: "Семьи с маленькими детьми" }],
    traits: [
      { label: "Активность", value: "medium" },
      { label: "Ласка", value: "low" },
      { label: "Терпение", value: "medium" },
      { label: "Самостоятельность", value: "high" },
    ],
  },
  {
    type: "affectionate",
    label: "Ласковый",
    icon: Heart,
    tagline: "Мурчит при первом прикосновении",
    description:
      "Невероятно ласковый, идёт на руки к кому угодно. Идеальный компаньон для одинокого человека на удалёнке — мурчит, спит на коленях, встречает у двери.",
    accentClass: "from-accent/10 to-accent/5 border-accent/20",
    iconBg: "bg-accent text-accent-foreground",
    bestFor: [
      { icon: Briefcase, label: "Одиночки на удалёнке" },
      { icon: Users, label: "Пары без детей" },
      { icon: Heart, label: "Любители мурчания" },
    ],
    notFor: [{ label: "Те, кто не любит навязчивость" }],
    traits: [
      { label: "Активность", value: "medium" },
      { label: "Ласка", value: "high" },
      { label: "Терпение", value: "high" },
      { label: "Самостоятельность", value: "low" },
    ],
  },
];

const TRAIT_BAR: Record<"high" | "medium" | "low", { width: string; color: string; label: string }> = {
  high: { width: "100%", color: "bg-primary", label: "высокая" },
  medium: { width: "60%", color: "bg-secondary", label: "средняя" },
  low: { width: "25%", color: "bg-muted-foreground/50", label: "низкая" },
};

export function PersonalityGuide() {
  return (
    <section id="personalities" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
            <PawPrint className="h-3.5 w-3.5 mr-1.5" />
            Гид по характерам · 4 темперамента
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            Какой мейн-кун вам подойдёт?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Не все мейн-куны одинаковы. Мы выделяем четыре ярко выраженных
            темперамента. Выбирайте под образ жизни семьи — а не по окрасу.
            Это и есть наш фильтр по характеру, которого нет у конкурентов.
          </p>
        </div>

        {/* Personality cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERSONALITIES.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.type} delay={i * 120} direction="up">
                <Card
                  className={`overflow-hidden border bg-gradient-to-br ${p.accentClass} hover:shadow-lg transition-shadow h-full flex flex-col`}
                >
                  <CardContent className="p-5 flex flex-col gap-4 flex-1">
                    {/* Icon + name */}
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.iconBg} shadow-sm`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-foreground leading-tight">
                          {p.label}
                        </h3>
                        <p className="text-[11px] text-muted-foreground italic">
                          {p.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {p.description}
                    </p>

                    {/* Traits bars */}
                    <div className="space-y-1.5">
                      {p.traits.map((trait) => {
                        const bar = TRAIT_BAR[trait.value];
                        return (
                          <div key={trait.label} className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground w-28 shrink-0">
                              {trait.label}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${bar.color} transition-all duration-500`}
                                style={{ width: bar.width }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Best for */}
                    <div className="pt-2 border-t border-border/60">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
                        Подойдёт
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {p.bestFor.map((b) => {
                          const BIcon = b.icon;
                          return (
                            <span
                              key={b.label}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-background/80 text-foreground border border-border"
                            >
                              <BIcon className="h-2.5 w-2.5 text-primary" />
                              {b.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Not for */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
                        Не подойдёт
                      </p>
                      {p.notFor.map((n) => (
                        <span
                          key={n.label}
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
                        >
                          <X className="h-3 w-3 text-accent/60" />
                          {n.label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Honesty note */}
        <Reveal delay={300} className="mt-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border max-w-2xl mx-auto">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Честно:</strong> характер — не
              гарантия, а тенденция. Воспитание и социализация в первые 12 недель
              важнее происхождения. Но если родители спокойны — вероятность, что котёнок
              унаследует это, значительно выше.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
