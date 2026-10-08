"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  Loader2,
  PawPrint,
} from "lucide-react";
import { Footer } from "@/components/cattery/footer";
import { BackToTop } from "@/components/cattery/back-to-top";
import { toast } from "sonner";

const SUBJECTS = [
  "Вопрос о котёнке",
  "Запись на визит",
  "Консультация по уходу",
  "Сотрудничество",
  "Другое",
];

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: "Телефон",
    value: "+7 495 123-45-67",
    href: "tel:+74951234567",
    hint: "Ежедневно 9:00–21:00",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+7 495 123-45-67",
    href: "https://wa.me/74951234567",
    hint: "Отвечаем быстро",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@tiliydom.ru",
    href: "mailto:hello@tiliydom.ru",
    hint: "В течение 24 часов",
  },
  {
    icon: MapPin,
    label: "Адрес",
    value: "Москва, Юго-Западная",
    href: "#",
    hint: "Точный адрес — по записи",
  },
];

export default function ContactsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setSuccess(true);
      toast.success("Сообщение отправлено!", {
        description: "Заводчик свяжется с вами в течение 24 часов.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: SUBJECTS[0],
        message: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setSubmitting(false);
    }
  };

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
        <div className="container max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-4 border-accent/30 bg-accent/5 text-accent">
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              Контакты
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight mb-4">
              Напишите нам
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Не «менеджер 24/7», а заводчик лично. Отвечаем на все вопросы —
              о котятах, породе, уходе. Без спешки и без давления.
            </p>
          </div>

          {/* Contact methods grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {CONTACT_METHODS.map((method, i) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.label}
                  href={method.href}
                  className="group flex flex-col items-center text-center p-4 rounded-xl bg-card ring-1 ring-border hover:ring-primary/30 hover:shadow-md transition-all"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    {method.label}
                  </p>
                  <p className="font-serif text-sm font-semibold text-foreground mt-0.5">
                    {method.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {method.hint}
                  </p>
                </a>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: form */}
            <Card className="border-border bg-card shadow-md">
              <CardContent className="p-6 sm:p-8">
                {success ? (
                  <div className="flex flex-col items-center text-center py-8 gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-semibold text-foreground mb-1">
                        Сообщение отправлено!
                      </h2>
                      <p className="text-muted-foreground">
                        Спасибо за обращение. Заводчик ответит в течение 24
                        часов.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSuccess(false)}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      Отправить ещё
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      Форма обращения
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label htmlFor="c-name">Имя *</Label>
                        <Input
                          id="c-name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Анна"
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="c-phone">Телефон</Label>
                        <Input
                          id="c-phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+7 999 123-45-67"
                          disabled={submitting}
                        />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="c-email">Email *</Label>
                      <Input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="anna@example.com"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="c-subject">Тема обращения *</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {SUBJECTS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setForm({ ...form, subject: s })}
                            disabled={submitting}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              form.subject === s
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:border-primary/40"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="c-message">Сообщение *</Label>
                      <Textarea
                        id="c-message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        placeholder="Расскажите, что вас интересует. Например: ищем спокойного котёнка для семьи с ребёнком 5 лет."
                        required
                        disabled={submitting}
                        className="resize-none"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Минимум 10 символов
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Отправляем...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Отправить сообщение
                        </>
                      )}
                    </Button>
                    <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                      Нажимая кнопку, вы соглашаетесь на обработку контактов
                      заводчиком. Никакого спама.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Right: image + info */}
            <div className="flex flex-col gap-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-border">
                <Image
                  src="/images/cattery/contacts.jpg"
                  alt="Рабочее место заводчика с мейн-куном рядом"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNGMkVERUQiLz48L3N2Zz4="
                />
              </div>

              <Card className="border-border bg-muted/40">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      Время ответа
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      WhatsApp / Telegram — обычно в течение часа
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Звонки — ежедневно 9:00–21:00
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Email — в течение 24 часов
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Форма ниже — на email заводчика
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint className="h-5 w-5 text-accent" />
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      Прежде чем писать
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Возможно, ответ уже есть в{" "}
                    <Link href="/#faq" className="text-primary hover:underline">
                      разделе вопросов
                    </Link>{" "}
                    или в{" "}
                    <Link href="/#blog" className="text-primary hover:underline">
                      блоге
                    </Link>
                    . Там — про документы, социализацию и уход. Если нет —
                    пишите, ответим лично.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
