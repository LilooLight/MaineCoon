"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import {
  FileDown,
  CheckCircle2,
  Heart,
  Sparkles,
} from "lucide-react";

const CHECKLIST_HIGHLIGHTS = [
  "Кормление: класс корма, расписание, запрещённое",
  "Прививки: расписание по возрастам от 8 недель",
  "Груминг: расчёсывание, когти, купание",
  "Среда: когтеточка, лоток, игры, «своё место»",
];

export function CareChecklist() {
  return (
    <section id="checklist" className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Decorative blob */}
      <div
        className="blob"
        style={{
          bottom: "5%",
          left: "-5%",
          width: "350px",
          height: "350px",
          background: "var(--secondary)",
        }}
      />
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <Reveal>
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-lg">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: copy */}
                <div className="flex flex-col gap-4">
                  <Badge className="w-fit bg-primary/10 text-primary border border-primary/30">
                    <FileDown className="h-3.5 w-3.5 mr-1.5" />
                    Чек-лист для новых владельцев
                  </Badge>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground leading-tight mb-3">
                      Уход за мейн-куном в первый год
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Бесплатный PDF-чек-лист — то, что мы сами делаем со своими
                      котами. Распечатайте, повесьте на холодильник и отмечайте по
                      мере выполнения. Без маркетинга, только проверенный опыт.
                    </p>
                  </div>

                  <ul className="flex flex-col gap-2 mt-1">
                    {CHECKLIST_HIGHLIGHTS.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 h-12">
                      <a href="/download/care-checklist.pdf" download target="_blank" rel="noopener">
                        <FileDown className="h-4 w-4 mr-2" />
                        Скачать PDF · 2 страницы
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary h-12">
                      <a href="/blog/uhod-za-maine-coon-pervyi-god">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Читать статью
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Right: mock PDF preview */}
                <div className="relative">
                  <div className="relative mx-auto max-w-xs">
                    {/* Stacked paper effect */}
                    <div className="absolute inset-0 bg-muted rounded-lg shadow-sm translate-x-2 translate-y-2 ring-1 ring-border" />
                    <div className="absolute inset-0 bg-card rounded-lg shadow translate-x-1 translate-y-1 ring-1 ring-border" />
                    {/* Main sheet */}
                    <div className="relative bg-background rounded-lg shadow-lg ring-1 ring-border p-5 aspect-[1/1.3]">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-primary">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            🐾
                          </div>
                          <div className="leading-tight">
                            <p className="font-serif text-sm font-semibold text-foreground">
                              Тихий Дом
                            </p>
                            <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
                              питомник мейн-кунов
                            </p>
                          </div>
                        </div>
                        <div className="text-[8px] text-muted-foreground text-right leading-tight">
                          Чек-лист<br />нового владельца
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="inline-block px-2 py-0.5 rounded-full text-[8px] bg-accent/10 text-accent border border-accent/30 mb-2">
                          Уход · первый год
                        </div>
                        <h4 className="font-serif text-base font-semibold text-foreground leading-tight">
                          Чек-лист заботливого хозяина
                        </h4>
                      </div>
                      {/* Mock checklist lines */}
                      <div className="space-y-1.5">
                        {[
                          "Корм класса холистик",
                          "Расписание кормления",
                          "Свежая вода ежедневно",
                          "Прививки по возрасту",
                          "Расчёсывание раз в неделю",
                        ].map((line, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 border border-primary rounded-sm shrink-0" />
                            <span className="text-[9px] text-foreground/70 truncate">{line}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-border">
                        <p className="text-[8px] text-muted-foreground text-center">
                          Питомник «Тихий Дом» · +7 495 123-45-67
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Floating heart */}
                  <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-2 ring-background">
                    <Heart className="h-5 w-5 fill-accent-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
