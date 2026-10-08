"use client";

import Link from "next/link";
import { PawPrint, Phone, Mail, MapPin, MessageCircle, Send, Heart } from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Питомник",
    links: [
      { href: "/about", label: "О нас" },
      { href: "#producers", label: "Производители" },
      { href: "#kittens", label: "Котята" },
      { href: "#reviews", label: "Выпускники" },
    ],
  },
  {
    title: "Информация",
    links: [
      { href: "#blog", label: "Блог" },
      { href: "#faq", label: "Вопросы и ответы" },
      { href: "#kittens", label: "Бронирование" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 lg:gap-8 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="#top" className="flex items-center gap-2.5 w-fit group">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <PawPrint className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-xl font-semibold text-background">
                  Тихий Дом
                </span>
                <span className="text-xs text-background/60 tracking-wide uppercase">
                  питомник мейн-кунов
                </span>
              </div>
            </Link>
            <p className="text-sm text-background/70 leading-relaxed max-w-sm">
              Маленький семейный питомник мейн-кунов в Москве. Здоровые, спокойные
              котята-компаньоны для семьи. Родословные и документы, честный подход,
              поддержка на всю жизнь.
            </p>

            {/* Contacts */}
            <div className="flex flex-col gap-2 mt-2">
              <a
                href="tel:+74951234567"
                className="inline-flex items-center gap-2.5 text-sm text-background/80 hover:text-background transition-colors w-fit"
              >
                <Phone className="h-4 w-4 text-secondary" />
                +7 495 123-45-67
              </a>
              <a
                href="mailto:hello@tiliydom.ru"
                className="inline-flex items-center gap-2.5 text-sm text-background/80 hover:text-background transition-colors w-fit"
              >
                <Mail className="h-4 w-4 text-secondary" />
                hello@tiliydom.ru
              </a>
              <div className="inline-flex items-center gap-2.5 text-sm text-background/80">
                <MapPin className="h-4 w-4 text-secondary" />
                Москва, Россия · по предварительной записи
              </div>
            </div>

            {/* Messengers */}
            <div className="flex gap-2 mt-2">
              <a
                href="https://wa.me/74951234567"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/tiliydom"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
              >
                <Send className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-2 flex flex-col gap-3">
              <h4 className="font-serif text-base font-semibold text-background">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Promise column */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-serif text-base font-semibold text-background">
              Наше обещание
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                Документы открыты — родословные WCF
              </li>
              <li className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                Поддержка заводчика пожизненно
              </li>
              <li className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                Никакого «успей купить»
              </li>
              <li className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                Котята — не раньше 12 недель
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-background/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <p>© {new Date().getFullYear()} Питомник «Тихий Дом». Все права защищены.</p>
          <p className="flex items-center gap-1.5">
            Сделано с <Heart className="h-3 w-3 text-accent fill-accent" /> для здоровых котят
          </p>
        </div>
      </div>
    </footer>
  );
}
