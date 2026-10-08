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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CalendarCheck,
  Instagram,
  Youtube,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { Footer } from "@/components/cattery/footer";
import { BackToTop } from "@/components/cattery/back-to-top";
import { toast } from "sonner";

const CHANNEL_OPTIONS = [
  { value: "phone", label: "Телефон", placeholder: "+7 999 123-45-67", icon: Phone },
  { value: "email", label: "Электронная почта", placeholder: "anna@example.com", icon: Mail },
  { value: "telegram", label: "Telegram", placeholder: "@nickname", icon: Send },
  { value: "vk", label: "ВКонтакте", placeholder: "Ссылка на профиль", icon: MessageCircle },
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
    contactChannel: "phone",
    contactValue: "",
    comment: "",
  });
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Date picker helpers
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Generate next 30 days for quick selection
  const upcomingDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const toggleDate = (dateStr: string) => {
    setSelectedDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const formatDisplayDate = (d: Date) =>
    d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", weekday: "short" });

  const currentChannel = CHANNEL_OPTIONS.find((c) => c.value === form.contactChannel);

  const handleContactValueChange = (value: string) => {
    if (form.contactChannel === "telegram") {
      // Auto-prepend @ if not present
      let val = value;
      if (val && !val.startsWith("@") && val !== "") {
        val = "@" + val.replace(/^@+/g, "");
      }
      setForm({ ...form, contactValue: val });
    } else {
      setForm({ ...form, contactValue: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Укажите ваше имя");
      return;
    }
    if (selectedDates.length === 0) {
      toast.error("Выберите хотя бы одну удобную дату");
      return;
    }
    if (!form.contactValue.trim()) {
      toast.error("Укажите контакт для связи");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          preferredDates: selectedDates,
          contactChannel: form.contactChannel,
          contactValue: form.contactValue,
          comment: form.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");

      setSuccess(true);
      toast.success("Заявка отправлена!", {
        description: "Мы свяжемся с вами для подтверждения даты визита.",
      });
      setForm({ name: "", contactChannel: "phone", contactValue: "", comment: "" });
      setSelectedDates([]);
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
              <CalendarCheck className="h-3.5 w-3.5 mr-1.5" />
              Запланировать визит
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground leading-tight mb-4">
              Приезжайте познакомиться
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Заполните форму — мы свяжемся с вами и согласуем удобное время.
              Только по записи, чтобы не стрессовать животных.
            </p>
          </div>

          {/* Contact methods grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
            {CONTACT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <a
                  key={method.label}
                  href={method.href}
                  className="group flex flex-col items-center text-center p-4 rounded-xl bg-card ring-1 ring-border hover:ring-primary/30 hover:shadow-md transition-all"
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
                        Заявка отправлена!
                      </h2>
                      <p className="text-muted-foreground">
                        Спасибо! Мы свяжемся с вами для подтверждения даты визита.
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
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <h2 className="font-serif text-xl font-semibold text-foreground">
                      Форма заявки
                    </h2>

                    {/* 1. Name */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="v-name">
                        Ваше имя
                      </Label>
                      <Input
                        id="v-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Анна"
                        disabled={submitting}
                      />
                    </div>

                    {/* 2. Preferred dates — multi-select */}
                    <div className="grid gap-1.5">
                      <Label className="flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Удобные даты
                        <span className="text-[11px] text-muted-foreground font-normal">
                          (выберите одну или несколько)
                        </span>
                      </Label>
                      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto custom-scroll p-1 rounded-lg bg-muted/30">
                        {upcomingDays.map((d) => {
                          const dateStr = formatDate(d);
                          const selected = selectedDates.includes(dateStr);
                          return (
                            <button
                              key={dateStr}
                              type="button"
                              onClick={() => toggleDate(dateStr)}
                              disabled={submitting}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                selected
                                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
                              }`}
                            >
                              {formatDisplayDate(d)}
                            </button>
                          );
                        })}
                      </div>
                      {selectedDates.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-primary font-medium">
                            Выбрано: {selectedDates.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedDates([])}
                            className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-0.5"
                          >
                            <X className="h-3 w-3" />
                            Очистить
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 3. Contact channel + dependent field */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label>Канал связи</Label>
                        <Select
                          value={form.contactChannel}
                          onValueChange={(v) => setForm({ ...form, contactChannel: v, contactValue: "" })}
                          disabled={submitting}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CHANNEL_OPTIONS.map((c) => {
                              const Icon = c.icon;
                              return (
                                <SelectItem key={c.value} value={c.value}>
                                  <span className="inline-flex items-center gap-1.5">
                                    <Icon className="h-3.5 w-3.5" />
                                    {c.label}
                                  </span>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-1.5">
                        <Label>
                          {currentChannel?.label || "Контакт"}
                        </Label>
                        <Input
                          value={form.contactValue}
                          onChange={(e) => handleContactValueChange(e.target.value)}
                          placeholder={currentChannel?.placeholder || ""}
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    {/* 4. Comment (optional, max 500) */}
                    <div className="grid gap-1.5">
                      <Label htmlFor="v-comment" className="flex items-center justify-between">
                        <span>Комментарий</span>
                        <span className="text-[11px] text-muted-foreground font-normal">
                          {form.comment.length}/500
                        </span>
                      </Label>
                      <Textarea
                        id="v-comment"
                        value={form.comment}
                        onChange={(e) => setForm({ ...form, comment: e.target.value.slice(0, 500) })}
                        rows={3}
                        placeholder="Например: хотим приехать с ребёнком 5 лет, интересует серебряный котёнок"
                        disabled={submitting}
                        className="resize-none"
                      />
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
                          Отправить заявку
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

            {/* Right: info */}
            <div className="flex flex-col gap-5">
              <Card className="border-border bg-muted/40">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      Как проходит визит
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Мы перезвоним и согласуем дату из выбранных вами
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Визит длится 30–60 минут — покажем котят, родителей, условия
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Можно приехать с семьёй — детям будет интересно
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      Если не готовы бронировать сразу — можно приехать ещё раз
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint className="h-5 w-5 text-accent" />
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      Мы в соцсетях
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Публикуем фото и видео котят, истории выпускников и
                    советы по уходу.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/74951234567" },
                      { icon: Send, label: "Telegram", href: "https://t.me/tiliydom" },
                      { icon: Instagram, label: "Instagram", href: "https://instagram.com/tiliydom" },
                      { icon: Youtube, label: "YouTube", href: "https://youtube.com/@tiliydom" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {s.label}
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <PawPrint className="h-5 w-5 text-accent" />
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      Прежде чем ехать
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
