"use client";

import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, CalendarClock, CreditCard, HeartHandshake, FileCheck, Home } from "lucide-react";
import { useBooking } from "./booking-context";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    icon: CalendarClock,
    question: "Когда котёнок готов переехать в новую семью?",
    answer:
      "Не раньше 12 недель. К этому возрасту котёнок социализирован, привит, получил первую профилактику паразитов и привык к людям. Мы не отдаём котят раньше — это вредит их психике.",
  },
  {
    id: "faq-2",
    icon: FileCheck,
    question: "Какие документы получает котёнок?",
    answer:
      "Метрика (родословная заявка), ветеринарный паспорт с отметками о прививках, договор купли-продажи и копии генетических тестов родителей. Всё передаётся в момент переезда, но мы готовы показать документы заранее — до брони.",
  },
  {
    id: "faq-3",
    icon: CreditCard,
    question: "Как проходит бронирование?",
    answer:
      "Вы оставляете заявку через форму — заводчик лично связывается в течение 24 часов. После общения вносится задаток (обычно 30%), и котёнок снимается с продажи. Мы не торопим: даём неделю на раздумья.",
  },
  {
    id: "faq-4",
    icon: Home,
    question: "Можно ли приехать познакомиться с котятами?",
    answer:
      "Да, конечно. Мы приглашаем семьи в наш дом — посмотреть условия, познакомиться с родителями и самим котёнком. Поездка организуется по предварительной договорённости, чтобы не стрессовать животных.",
  },
  {
    id: "faq-5",
    icon: HeartHandshake,
    question: "Что если у котёнка обнаружатся проблемы со здоровьем?",
    answer:
      "В течение первого месяца при подтверждённом ветеринарном диагнозе наследственного характера мы возвращаем стоимость или предлагаем замену из следующего помёта. Но за 6 лет работы такого не было — благодаря тщательному отбору производителей.",
  },
  {
    id: "faq-6",
    icon: HeartHandshake,
    question: "Поддержка после переезда — это реально?",
    answer:
      "Да. Мы отвечаем на вопросы и через месяц, и через год. Корм, поведение, здоровье — пишите в любой мессенджер. Это не «менеджер 24/7», а личная связь с заводчиком. Таков наш подход.",
  },
];

export function FAQ() {
  const { openWaitingList } = useBooking();

  return (
    <section id="faq" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-secondary/40 bg-secondary/5 text-secondary-foreground">
            <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
            Частые вопросы
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            Отвечаем честно, без маркетинга
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Шесть вопросов, которые задают чаще всего. Если вашего нет в списке —
            напишите, ответим лично.
          </p>
        </div>

        {/* FAQ accordion */}
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-border rounded-xl bg-card px-5 shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline py-5 gap-4 items-center">
                  <div className="flex items-center gap-3 text-left flex-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-serif text-base sm:text-lg font-semibold text-foreground">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-0 pl-12 pr-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-4">Не нашли ответ?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={openWaitingList}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Записаться в лист ожидания
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <a href="tel:+74951234567">Позвонить заводчику</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
