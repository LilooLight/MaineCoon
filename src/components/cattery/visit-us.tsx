"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  CalendarCheck,
  Home,
  Car,
} from "lucide-react";
import { useBooking } from "./booking-context";

const VISIT_RULES = [
  {
    icon: CalendarCheck,
    title: "Только по записи",
    text: "Заранее договариваемся о времени — чтобы не стрессовать животных и уделить вам внимание.",
  },
  {
    icon: Home,
    title: "Это наш дом",
    text: "Не питомник-вальер, а квартира. Котят растим среди людей, звуков, быта. Приезжаете — как в гости.",
  },
  {
    icon: Car,
    title: "15 минут от метро",
    text: "Рядом с МКАД, есть парковка. Подскажем, как доехать из любого района Москвы.",
  },
];

export function VisitUs() {
  const { openWaitingList } = useBooking();

  return (
    <section id="visit" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            Приехать познакомиться
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            Приезжайте в наш дом
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Не вальер, не питомник-контора — обычная квартира, где живут коты и
            растут котята. Записывайтесь — покажем условия, родителей и самих
            котят.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left: stylized "map" + image */}
          <Reveal direction="right" className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-border h-full min-h-[320px]">
              <Image
                src="/images/cattery/visit.jpg"
                alt="Уютная домашняя обстановка питомника «Тихий Дом»"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating "address" card */}
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg ring-1 ring-border">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-base font-semibold text-foreground leading-tight">
                      Москва, Юго-Западная
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Точный адрес — после записи в лист ожидания
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-primary">
                      <Navigation className="h-3 w-3" />
                      15 мин пешком от метро
                    </div>
                  </div>
                </div>
              </div>

              {/* Top badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-border">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Принимаем гостей
              </div>
            </div>
          </Reveal>

          {/* Right: visit rules + CTA */}
          <div className="flex flex-col gap-5">
            <Reveal direction="left">
              <div className="flex items-center gap-3 mb-1">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                  Как проходит визит
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Мы приглашаем семьи в наш дом — посмотреть условия, познакомиться
                с родителями и самим котёнком. Поездка организуется по
                предварительной договорённости.
              </p>

              <div className="flex flex-col gap-3">
                {VISIT_RULES.map((rule, i) => {
                  const Icon = rule.icon;
                  return (
                    <Reveal key={rule.title} delay={i * 80} direction="up">
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card ring-1 ring-border">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-serif text-sm font-semibold text-foreground leading-tight">
                            {rule.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {rule.text}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={150} className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={openWaitingList}
                className="bg-accent text-accent-foreground hover:bg-accent/90 h-12"
              >
                <CalendarCheck className="h-4 w-4 mr-2" />
                Записаться на визит
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary h-12"
              >
                <a href="tel:+74951234567">
                  <Phone className="h-4 w-4 mr-2" />
                  Позвонить
                </a>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
