"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Moon,
  Mountain,
  Heart,
  PawPrint,
  ArrowRight,
  RotateCcw,
  Baby,
  Users,
  Briefcase,
  Home,
  Clock,
  Zap,
  Leaf,
  ChevronRight,
} from "lucide-react";
import type { Personality } from "@/lib/types/cattery";
import { PERSONALITY_DESCRIPTIONS } from "@/lib/types/cattery";
import { useBooking } from "./booking-context";

type Answer = { label: string; scores: Partial<Record<Personality, number>> };

interface Question {
  id: string;
  icon: typeof Baby;
  text: string;
  answers: Answer[];
}

const QUESTIONS: Question[] = [
  {
    id: "household",
    icon: Users,
    text: "Кто будет жить рядом с котом?",
    answers: [
      { label: "Семья с маленькими детьми", scores: { calm: 3, affectionate: 1 } },
      { label: "Семья с детьми-школьниками", scores: { playful: 2, affectionate: 2 } },
      { label: "Один человек на удалёнке", scores: { affectionate: 2, independent: 2 } },
      { label: "Пара без детей", scores: { affectionate: 2, calm: 1 } },
    ],
  },
  {
    id: "presence",
    icon: Home,
    text: "Сколько времени дома кто-то есть?",
    answers: [
      { label: "Почти всегда — я на удалёнке", scores: { affectionate: 2, playful: 1 } },
      { label: "Половина дня", scores: { calm: 2, playful: 1 } },
      { label: "Редко — много работаю", scores: { independent: 3 } },
      { label: "Нерегулярно", scores: { independent: 2, calm: 1 } },
    ],
  },
  {
    id: "pace",
    icon: Zap,
    text: "Какой темп жизни у вашей семьи?",
    answers: [
      { label: "Спокойный, размеренный", scores: { calm: 3 } },
      { label: "Активный, шумный", scores: { playful: 2, calm: 1 } },
      { label: "Смешанный", scores: { affectionate: 2, playful: 1 } },
      { label: "Уединённый", scores: { independent: 3 } },
    ],
  },
  {
    id: "what-matters",
    icon: Heart,
    text: "Что для вас важнее всего?",
    answers: [
      { label: "Чтобы мурчал и ластился", scores: { affectionate: 3 } },
      { label: "Чтобы был спокоен с детьми", scores: { calm: 3 } },
      { label: "Чтобы играл и веселил", scores: { playful: 3 } },
      { label: "Чтобы не навязывался", scores: { independent: 3 } },
    ],
  },
  {
    id: "experience",
    icon: Leaf,
    text: "Есть ли у вас опыт с кошками?",
    answers: [
      { label: "Первая кошка в жизни", scores: { calm: 2, affectionate: 2 } },
      { label: "Была одна раньше", scores: { playful: 1, affectionate: 2 } },
      { label: "Опытный кошатник", scores: { independent: 3 } },
      { label: "В доме уже есть животные", scores: { calm: 2, playful: 1 } },
    ],
  },
];

const PERSONALITY_META: Record<
  Personality,
  { label: string; icon: typeof Moon; color: string; ring: string }
> = {
  calm: {
    label: "Спокойный",
    icon: Moon,
    color: "bg-primary/10 text-primary",
    ring: "ring-primary/30",
  },
  playful: {
    label: "Игривый",
    icon: Sparkles,
    color: "bg-secondary/20 text-secondary-foreground",
    ring: "ring-secondary/40",
  },
  independent: {
    label: "Независимый",
    icon: Mountain,
    color: "bg-muted text-muted-foreground",
    ring: "ring-border",
  },
  affectionate: {
    label: "Ласковый",
    icon: Heart,
    color: "bg-accent/10 text-accent",
    ring: "ring-accent/30",
  },
};

export function PersonalityQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<Personality | null>(null);
  const { openWaitingList } = useBooking();

  const total = QUESTIONS.length;
  const progress = result ? 100 : (step / total) * 100;

  const handleAnswer = (qId: string, answer: Answer) => {
    const next = { ...answers, [qId]: answer };
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      // Tally scores
      const tally: Record<Personality, number> = {
        calm: 0,
        playful: 0,
        independent: 0,
        affectionate: 0,
      };
      Object.values(next).forEach((a) => {
        (Object.keys(a.scores) as Personality[]).forEach((k) => {
          tally[k] += a.scores[k] ?? 0;
        });
      });
      const winner = (Object.keys(tally) as Personality[]).reduce((best, k) =>
        tally[k] > tally[best] ? k : best
      );
      setResult(winner);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  const current = QUESTIONS[step];

  return (
    <section id="quiz" className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 paw-pattern opacity-60" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Подбор по образу жизни · уникально
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
            Какой характер котёнка подойдёт именно вам?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Пять коротких вопросов — и мы подскажем темперамент мейн-куна,
            который впишется в ритм вашей семьи. Это и есть тот самый фильтр по
            характеру, которого нет у конкурентов.
          </p>
        </div>

        {/* Quiz card */}
        <Card className="border-border bg-card shadow-lg overflow-hidden">
          <CardContent className="p-0">
            {/* Progress bar */}
            <div className="px-6 sm:px-10 pt-6">
              <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                <span className="font-medium">
                  {result ? "Готово" : `Вопрос ${step + 1} из ${total}`}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5 [&>div]:bg-accent" />
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10">
              {result ? (
                <ResultView
                  result={result}
                  onBrowse={() => {
                    const el = document.getElementById("kittens");
                    el?.scrollIntoView({ behavior: "smooth" });
                    // Set the personality filter via custom event
                    window.dispatchEvent(
                      new CustomEvent("cattery:setFilter", {
                        detail: { personality: result },
                      })
                    );
                  }}
                  onWaitingList={openWaitingList}
                  onRestart={restart}
                />
              ) : (
                <div key={current.id} className="blur-fade">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <current.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                      {current.text}
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {current.answers.map((ans, i) => {
                      const selected = answers[current.id]?.label === ans.label;
                      return (
                        <button
                          key={ans.label}
                          type="button"
                          onClick={() => handleAnswer(current.id, ans)}
                          className={cn(
                            "group flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5",
                            selected
                              ? "border-accent bg-accent/5 shadow-sm"
                              : "border-border bg-background hover:border-accent/40"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold border",
                                selected
                                  ? "border-accent bg-accent text-accent-foreground"
                                  : "border-border text-muted-foreground group-hover:border-accent/40 group-hover:text-accent"
                              )}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="text-sm sm:text-base font-medium text-foreground">
                              {ans.label}
                            </span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Nav back */}
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="mt-5 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      К предыдущему вопросу
                    </button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick legend */}
        {!result && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Возможные результаты:
            </span>
            {(Object.keys(PERSONALITY_META) as Personality[]).map((p) => {
              const Meta = PERSONALITY_META[p];
              const Icon = Meta.icon;
              return (
                <span
                  key={p}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                    Meta.color
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {Meta.label}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ResultView({
  result,
  onBrowse,
  onWaitingList,
  onRestart,
}: {
  result: Personality;
  onBrowse: () => void;
  onWaitingList: () => void;
  onRestart: () => void;
}) {
  const meta = PERSONALITY_META[result];
  const Icon = meta.icon;

  return (
    <div className="flex flex-col items-center text-center gap-5 py-4">
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full ring-4",
          meta.color,
          meta.ring
        )}
      >
        <Icon className="h-9 w-9" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
          Вам подойдёт характер
        </p>
        <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
          {meta.label}
        </h3>
      </div>
      <p className="text-muted-foreground leading-relaxed max-w-xl">
        {PERSONALITY_DESCRIPTIONS[result]}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
        <Button
          onClick={onBrowse}
          className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-7 text-base"
        >
          <PawPrint className="h-4 w-4 mr-2" />
          Показать таких котят
        </Button>
        <Button
          onClick={onWaitingList}
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 hover:text-primary h-12 px-7 text-base"
        >
          В лист ожидания
        </Button>
      </div>
      <button
        onClick={onRestart}
        className="mt-3 text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Пройти заново
      </button>
    </div>
  );
}
