"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Send, PawPrint } from "lucide-react";
import { useBooking } from "./booking-context";

export function FinalCTA() {
  const { openWaitingList } = useBooking();

  return (
    <section className="py-16 sm:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative paw pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, currentColor 1px, transparent 1.5px), radial-gradient(circle at 80% 60%, currentColor 1px, transparent 1.5px), radial-gradient(circle at 45% 80%, currentColor 1px, transparent 1.5px)",
          backgroundSize: "120px 120px, 90px 90px, 150px 150px",
        }}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center gap-5">
          <Badge variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
            <PawPrint className="h-3.5 w-3.5 mr-1.5" />
            Маленький питомник — большие сердца
          </Badge>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight max-w-2xl">
            Готовы найти своего спокойного компаньона?
          </h2>

          <p className="text-lg text-primary-foreground/85 leading-relaxed max-w-xl">
            Посмотрите доступных котят или запишитесь в лист ожидания — мы сообщим,
            когда родится котёнок нужного вам характера. Без давления, без
            «успей купить».
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-7 text-base"
            >
              <a href="#kittens">Смотреть доступных котят</a>
            </Button>
            <Button
              onClick={openWaitingList}
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground h-12 px-7 text-base"
            >
              Лист ожидания
            </Button>
          </div>

          {/* Contact options */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-6 text-sm text-primary-foreground/80">
            <a href="tel:+74951234567" className="inline-flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <Phone className="h-4 w-4" />
              +7 495 123-45-67
            </a>
            <a href="https://wa.me/74951234567" className="inline-flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a href="https://t.me/tiliydom" className="inline-flex items-center gap-1.5 hover:text-primary-foreground transition-colors">
              <Send className="h-4 w-4" />
              Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
