"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "./reveal";
import {
  Heart,
  MessageCircle,
  Clock,
  ShieldCheck,
  GraduationCap,
  HandHeart,
  Phone,
} from "lucide-react";
import { BLUR_DATA_URLS } from "@/lib/blur";

const VALUES = [
  {
    icon: Heart,
    title: "Не «менеджер 24/7», а человек",
    text: "На все вопросы отвечает заводчик лично — та, кто принял роды, выкормила, социализировала. Не колл-центр.",
  },
  {
    icon: Clock,
    title: "Поддержка на всю жизнь",
    text: "Через месяц, год, пять лет — пишите. Корм, поведение, здоровье. Это наши выпускники навсегда.",
  },
  {
    icon: ShieldCheck,
    title: "Честность важнее продажи",
    text: "Покажу документы до брони. Скажу, если котёнок не подходит вашей семье. Верну задаток при сомнениях.",
  },
  {
    icon: GraduationCap,
    title: "Учу, а не отдаю",
    text: "Перед переездом — час по видеосвязи: корм, лоток, груминг, первые дни. Чтобы вы не остались один на один.",
  },
];

export function BreederIntro() {
  return (
    <section id="breeder" className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative blob */}
      <div
        className="blob"
        style={{
          top: "10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          background: "var(--secondary)",
        }}
      />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image side */}
          <Reveal direction="right" className="relative">
            <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-2xl overflow-hidden shadow-xl ring-1 ring-border max-w-md mx-auto lg:max-w-none">
              <Image
                src="/images/cattery/breeder.jpg"
                alt="Заводчик питомника «Тихий Дом» с мейн-куном"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URLS.muted}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Floating signature card */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg ring-1 ring-border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                    <HandHeart className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-base font-semibold text-foreground leading-tight">
                      Мария Тихонова
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      заводчик, основатель «Тихий Дом»
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content side */}
          <div className="flex flex-col gap-6">
            <Reveal direction="left">
              <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
                <HandHeart className="h-3.5 w-3.5 mr-1.5" />
                Заводчик · лицо питомника
              </Badge>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-5">
                За каждым котёнком стоит человек
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Меня зовут Мария. Шесть лет назад я взяла свою первую мейн-куна —
                и поняла, что хочу разводить не «звёзд», а спокойных компаньонов
                для семей. Так появился «Тихий Дом».
              </p>
              <p className="text-muted-foreground leading-relaxed">
                У нас маленький питомник — 3 пары производителей, 2–3 помёта в
                год. Я знаю каждого котёнка по имени, по характеру, по привычкам.
                Поэтому могу честно сказать, подойдёт ли он вашей семье — или
                лучше подождать другого.
              </p>
            </Reveal>

            {/* Values grid */}
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              {VALUES.map((v, i) => {
                const Icon = v.icon;
                return (
                  <Reveal key={v.title} delay={i * 80} direction="up">
                    <Card className="border-border bg-card hover:shadow-sm transition-shadow h-full">
                      <CardContent className="p-4 flex flex-col gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <h3 className="font-serif text-sm font-semibold text-foreground leading-tight">
                          {v.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {v.text}
                        </p>
                      </CardContent>
                    </Card>
                  </Reveal>
                );
              })}
            </div>

            {/* Contact CTA */}
            <Reveal delay={200} className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="tel:+74951234567"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                <Phone className="h-4 w-4" />
                Позвонить Марии
              </a>
              <a
                href="https://wa.me/74951234567"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm font-medium"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                Написать в WhatsApp
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
