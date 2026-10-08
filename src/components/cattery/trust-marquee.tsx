"use client";

import { Heart, ShieldCheck, Home, PawPrint, Star, Stethoscope } from "lucide-react";

const ITEMS = [
  { icon: Heart, text: "Пожизненная поддержка заводчика" },
  { icon: ShieldCheck, text: "Родословные WCF · документы открыты" },
  { icon: Stethoscope, text: "Котята под наблюдением фелинолога" },
  { icon: PawPrint, text: "2–3 помёта в год — не конвейер" },
  { icon: Home, text: "Социализация в домашних условиях" },
  { icon: Star, text: "20+ выпускников в любящих семьях" },
  { icon: Heart, text: "Каждый котёнок — событие" },
  { icon: ShieldCheck, text: "Прикреплены к монопородному клубу" },
];

export function TrustMarquee() {
  // Duplicate items so the marquee loops seamlessly
  const items = [...ITEMS, ...ITEMS];

  return (
    <section className="py-6 bg-primary text-primary-foreground overflow-hidden border-y border-primary/20">
      <div className="relative flex">
        <div className="flex animate-marquee gap-8 pr-8 shrink-0">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 whitespace-nowrap"
              >
                <Icon className="h-4 w-4 text-secondary shrink-0" />
                <span className="text-sm font-medium tracking-wide">
                  {item.text}
                </span>
                <span className="text-primary-foreground/30 ml-4">·</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
