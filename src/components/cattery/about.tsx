"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShieldCheck, Home, Users, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { BLUR_DATA_URLS } from "@/lib/blur";

const DIFFERENTIATORS = [
  {
    icon: ShieldCheck,
    title: "Прозрачная генетика",
    text: "Все тесты производителей (HCM, PKDef, SMA) — в открытом доступе. Без секретов и «доверьтесь нам».",
    accent: "primary" as const,
  },
  {
    icon: Sparkles,
    title: "Фильтр по характеру",
    text: "Спокойный, игривый, независимый или ласковый — выбирайте котёнка под образ жизни семьи, а не по окрасу.",
    accent: "secondary" as const,
  },
  {
    icon: MessageCircle,
    title: "Поддержка на всю жизнь",
    text: "Личная связь с заводчиком, а не «менеджер 24/7». Отвечаем даже спустя год — потому что это наши выпускники.",
    accent: "accent" as const,
  },
  {
    icon: Home,
    title: "Социализация в доме",
    text: "Котята растут среди людей, звуков, детей и других животных. Не в клетках, не на выставках — в семье.",
    accent: "primary" as const,
  },
];

const ACCENT_CLASSES = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary",
  accent: "bg-accent/10 text-accent",
};

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
            О питомнике
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
            Не бутик, а дом. Не конвейер, а семья.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            «Тихий Дом» — маленький семейный питомник мейн-кунов. У нас 3 пары
            производителей, 4 окраса и 2–3 помёта в год. Из шести производителей
            титулы есть лишь у трёх — и мы этого не скрываем. Потому что главное
            не титулы, а характер, здоровье и психика котят.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            Читать всю историю
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Two-column: image + honest manifesto */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-border order-2 lg:order-1">
            <Image
              src="/images/cattery/about.jpg"
              alt="Уютный интерьер домашнего питомника"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URLS.muted}
            />
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
                Наш честный подход
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Мы разводим <strong className="text-foreground">здоровых, спокойных компаньонов для семьи</strong>,
              а не выставочных звёзд. Титулы для нас — не самоцель, а приятный
              бонус. Главное — крепкая конституция, стабильная психика и
              генетическое здоровье.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Каждый котёнок — событие, а не позиция в каталоге.",
                "Мы не торопим с бронью: даём неделю на раздумья.",
                "Все документы и тесты показываем ДО решения, а не после.",
                "Котята уходят к новым семьям не раньше 12 недель — социализированными.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-foreground/90 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Differentiators grid */}
        <div className="mb-8">
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-2 text-center">
            Чего нет у конкурентов
          </h3>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Четыре вещи, которые делают «Тихий Дом» другим.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DIFFERENTIATORS.map((d, i) => {
            const Icon = d.icon;
            return (
              <Card
                key={i}
                className="group relative overflow-hidden border-border bg-card hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 flex flex-col gap-3 h-full">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${ACCENT_CLASSES[d.accent]} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-foreground leading-tight">
                    {d.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {d.text}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Calm companion banner */}
        <div className="mt-16 lg:mt-20 relative rounded-2xl overflow-hidden ring-1 ring-border shadow-md">
          <div className="grid md:grid-cols-5 items-center">
            <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:h-full min-h-[260px]">
              <Image
                src="/images/cattery/calm-companion.jpg"
                alt="Спокойный мейн-кун рядом с ребёнком"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.muted}
              />
            </div>
            <div className="md:col-span-3 p-6 sm:p-10 bg-muted/40">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-accent uppercase tracking-wide">
                  Для кого мы разводим
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-4 leading-tight">
                Семьям с детьми, удалёнщикам и опытным кошатникам
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Не «купить котёнка», а найти спокойного компаньона. Не «титулы и
                выставки», а характер, здоровье и поддержка. Не «большой выбор», а
                маленький питомник, где каждого знают лично.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Спокойные для детей",
                  "Не навязчивые для удалёнки",
                  "С чистой генетикой для знатоков",
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-secondary/15 text-secondary-foreground border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
