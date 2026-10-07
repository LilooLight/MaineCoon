"use client";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "./reveal";
import {
  ClipboardList,
  Phone,
  Eye,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { useBooking } from "./booking-context";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Заявка",
    time: "1 минута",
    text: "Оставляете контакты через форму. Никакого «менеджер перезвонит в рабочее время» — заводчик лично.",
  },
  {
    icon: Phone,
    title: "Звонок заводчика",
    time: "24 часа",
    text: "Заводчик звонит, рассказывает о котёнке, родителях, тестах. Отвечает на любые вопросы — без спешки.",
  },
  {
    icon: Eye,
    title: "Знакомство",
    time: "по договорённости",
    text: "Приезжаете в наш дом: смотрите условия, родителей, самого котёнка. Или видеозвонок, если далеко.",
  },
  {
    icon: Handshake,
    title: "Бронь",
    time: "задаток 30%",
    text: "После недели раздумий вносите задаток — котёнок снимается с продажи. Документы показываем заранее.",
  },
];

export function BookingProcess() {
  const { openWaitingList } = useBooking();

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
            Как проходит бронирование
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            Четыре шага — без давления и спешки
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мы не торопим с решением. Даём неделю на раздумья. Это ваш выбор на
            15 лет — он не должен быть импульсивным.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal
                  key={step.title}
                  delay={i * 120}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card ring-1 ring-border shadow-sm text-primary relative z-10">
                      <Icon className="h-6 w-6" />
                    </div>
                    {/* Step number bubble */}
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold ring-2 ring-muted/30 z-20">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mt-4 mb-1">
                    {step.title}
                  </h3>
                  <span className="text-[11px] uppercase tracking-wide text-accent font-medium mb-2">
                    {step.time}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-[14rem]">
                    {step.text}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Honesty note + CTA */}
        <Reveal className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            <strong className="text-foreground">Честно:</strong> если за неделю
            передумали — задаток возвращаем. Нам важнее, чтобы котёнок попал в
            свою семью, а не «закрыть сделку».
          </p>
          <button
            onClick={openWaitingList}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-base font-medium"
          >
            Начать с заявки
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}
