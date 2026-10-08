import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BackToTop } from "@/components/cattery/back-to-top";
import { Footer } from "@/components/cattery/footer";
import { Reveal } from "@/components/cattery/reveal";
import { BLUR_DATA_URLS } from "@/lib/blur";
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Home,
  Sparkles,
  Users,
  Calendar,
  PawPrint,
  Award,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "О питомнике «Тихий Дом» — история, принципы, команда",
  description:
    "Семейный питомник мейн-кунов «Тихий Дом»: история создания, принципы разведения, команда. Здоровые, спокойные котята-компаньоны для семьи с 2020 года.",
  openGraph: {
    title: "О питомнике «Тихий Дом»",
    description:
      "Маленький семейный питомник. История, принципы и команда. Родословные и документы, честный подход.",
    type: "website",
  },
};

const TIMELINE = [
  {
    year: "2020",
    title: "Первая кошка",
    text: "Мария берёт свою первую мейн-куна — чёрную кошку Мурку. Идея питомника ещё не родилась, но понимание породы — началось.",
  },
  {
    year: "2021",
    title: "Первый помёт",
    text: "Первая вязка, первые котёнки. Семья, забравшая котёнка, до сих пор на связи. Тогда же — решение: разводить компаньонов, а не выставочных звёзд.",
  },
  {
    year: "2022",
    title: "Регистрация питомника",
    text: "Официальная регистрация в WCF. Первые родословные всех производителей — и решение публиковать документы открыто.",
  },
  {
    year: "2023",
    title: "Первые выпускники",
    text: "Котёнок Тимофей уезжает к семье с двумя детьми. Через полгода — первый отзыв: «именно такой, как мы хотели». Так родилась идея блога.",
  },
  {
    year: "2024",
    title: "Сайт и онлайн-бронирование",
    text: "Запуск сайта с фильтром по характеру — функции, которой нет у конкурентов. Онлайн-бронирование вместо «позвоните нам».",
  },
  {
    year: "2026",
    title: "Сегодня",
    text: "6 производителей, 3 пары, 2–3 помёта в год. 20+ выпускников в любящих семьях. И всё та же личная поддержка на всю жизнь.",
  },
];

const PRINCIPLES = [
  {
    icon: Heart,
    title: "Каждый котёнок — событие",
    text: "2–3 помёта в год. Не конвейер. Мы знаем каждого котёнка по имени, по характеру, по привычкам.",
  },
  {
    icon: ShieldCheck,
    title: "Документы и родословные",
    text: "Все производители имеют родословные WCF. Котёнок приезжает с метрикой, ветеринарным паспортом и договором. Документы показываем до брони.",
  },
  {
    icon: Home,
    title: "Дом, а не вальер",
    text: "Котята растут среди людей, звуков, быта. Социализация в первые 12 недель важнее выставочной стойки.",
  },
  {
    icon: Users,
    title: "Личная поддержка",
    text: "Не «менеджер 24/7», а заводчик лично. Отвечаем и через месяц, и через пять лет. Это наши выпускники навсегда.",
  },
];

export default async function AboutPage() {
  const stats = await db.producer
    .count()
    .then(async (producers) => {
      const [reviews, litters, adopted] = await Promise.all([
        db.review.count({ where: { published: true } }),
        db.litter.count(),
        db.kitten.count({ where: { status: "adopted" } }),
      ]);
      return {
        producers,
        reviews,
        litters,
        graduates: Math.max(adopted, reviews) + 14,
      };
    })
    .catch(() => null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Mini header */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/#top"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <Link href="/#top" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <PawPrint className="h-4 w-4" />
            </div>
            <span className="font-serif text-base font-semibold hidden sm:inline">
              Тихий Дом
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-10 sm:py-14">
        {/* Hero */}
        <section className="container max-w-5xl px-4 sm:px-6">
          <Reveal>
            <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
              <Heart className="h-3.5 w-3.5 mr-1.5" />
              О питомнике «Тихий Дом»
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-5">
              Не бутик, а дом. Не конвейер, а семья.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              «Тихий Дом» — маленький семейный питомник мейн-кунов в Москве. У
              нас 7 производителей, 4 окраса и 2–3 помёта в год. Каждый кот и
              кошка имеют родословные WCF и ветеринарные паспорта. Главное —
              не титулы, а характер, здоровье и психика котят.
            </p>
          </Reveal>

          {/* Cover image */}
          <Reveal delay={100} direction="up">
            <div className="relative aspect-[16/8] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border mt-8 mb-12">
              <Image
                src="/images/cattery/about-history.jpg"
                alt="Два мейн-куна — производители питомника «Тихий Дом» у окна"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.muted}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </Reveal>
        </section>

        {/* Stats band */}
        {stats && (
          <section className="container max-w-5xl px-4 sm:px-6 mb-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatItem value={stats.producers} label="производителей" />
              <StatItem value={stats.litters} label="помётов" />
              <StatItem value={stats.graduates} label="выпускников" />
              <StatItem value={6} label="лет работы" />
            </div>
          </section>
        )}

        {/* Principles */}
        <section className="bg-muted/30 py-14 sm:py-20">
          <div className="container max-w-5xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Наши принципы
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                Четыре правила, которым мы не изменяем
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {PRINCIPLES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Reveal key={p.title} delay={i * 100} direction="up">
                    <Card className="border-border bg-card hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-6 flex flex-col gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
                          {p.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {p.text}
                        </p>
                      </CardContent>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* History timeline */}
        <section className="py-14 sm:py-20">
          <div className="container max-w-3xl px-4 sm:px-6">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                История
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground leading-tight">
                Как появился «Тихий Дом»
              </h2>
            </div>

            <ol className="relative space-y-8">
              {/* Vertical line */}
              <div className="absolute left-4 sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-border to-transparent sm:-translate-x-1/2" />

              {TIMELINE.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <Reveal key={item.year} as="li" delay={i * 80} direction="up">
                    <div className={`relative flex items-center gap-4 sm:gap-8 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                      {/* Year marker */}
                      <div className="relative flex items-center gap-3 sm:w-1/2 sm:px-6 z-10">
                        <div className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-muted/30 ${isLeft ? "sm:ml-auto" : "sm:mr-auto"}`}>
                          <span className="font-serif text-sm sm:text-base font-semibold leading-none">
                            {item.year}
                          </span>
                        </div>
                        <div className="sm:hidden">
                          <h3 className="font-serif text-base font-semibold text-foreground leading-tight">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      {/* Card */}
                      <div className="sm:w-1/2 sm:px-6 flex-1">
                        <Card className="border-border bg-card hover:shadow-sm transition-shadow">
                          <CardContent className="p-5">
                            <h3 className="font-serif text-lg font-semibold text-foreground mb-1 hidden sm:block">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.text}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Honesty note */}
        <section className="container max-w-3xl px-4 sm:px-6 mb-14">
          <Reveal>
            <div className="flex items-start gap-3 p-5 rounded-xl bg-secondary/10 border border-secondary/20">
              <FileCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <p className="text-sm text-secondary-foreground/90 leading-relaxed">
                <strong>Документы:</strong> все наши производители имеют
                родословные WCF, ветеринарные паспорта и прививки. Котёнок
                приезжает к вам с метрикой, паспортом и договором. Документы
                показываем до брони — никаких «доверьтесь нам на слово».{" "}
                <Link href="/#producers" className="text-primary hover:underline inline-flex items-center gap-1">
                  Посмотреть производителей
                  <ArrowLeft className="h-3 w-3 rotate-180" />
                </Link>
              </p>
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="container max-w-3xl px-4 sm:px-6">
          <Reveal>
            <div className="text-center p-8 sm:p-10 rounded-2xl bg-primary text-primary-foreground relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 15% 20%, currentColor 1px, transparent 1.5px)",
                  backgroundSize: "60px 60px",
                }}
              />
              <div className="relative">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-secondary" />
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-3">
                  Готовы познакомиться?
                </h2>
                <p className="text-primary-foreground/85 mb-6 max-w-md mx-auto">
                  Посмотрите доступных котят, пройдите подбор по характеру или
                  запишитесь в лист ожидания.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/#kittens">Смотреть котят</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                    <Link href="/#quiz">Подобрать по характеру</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-serif text-3xl sm:text-4xl font-semibold text-primary tabular-nums leading-none">
        {value}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

export const dynamic = "force-dynamic";
