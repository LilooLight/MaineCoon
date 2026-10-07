"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, PawPrint, CalendarClock } from "lucide-react";
import { useBooking } from "./booking-context";
import { toast } from "sonner";

export function BookingDialog() {
  const { isOpen, mode, kittenName, close } = useBooking();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kittenName,
          type: mode === "waiting-list" ? "waiting-list" : "booking",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setSuccess(true);
      toast.success(
        mode === "waiting-list"
          ? "Заявка в лист ожидания принята"
          : "Заявка на бронирование принята",
        { description: "Заводчик свяжется с вами в течение 24 часов." }
      );
    } catch (err) {
      toast.error("Не удалось отправить заявку", {
        description: err instanceof Error ? err.message : "Попробуйте ещё раз",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isWaiting = mode === "waiting-list";

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isWaiting ? "bg-secondary/20 text-secondary" : "bg-accent/10 text-accent"}`}>
              {isWaiting ? <CalendarClock className="h-4 w-4" /> : <PawPrint className="h-4 w-4" />}
            </div>
            <Badge variant="outline" className={isWaiting ? "border-secondary/40 text-secondary" : "border-accent/40 text-accent"}>
              {isWaiting ? "Лист ожидания" : "Бронирование"}
            </Badge>
          </div>
          <DialogTitle className="font-serif text-2xl font-semibold">
            {success
              ? "Заявка принята"
              : isWaiting
              ? "Запись в лист ожидания"
              : kittenName
              ? `Бронирование: ${kittenName}`
              : "Заявка на бронирование"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? "Спасибо за доверие. Мы свяжемся с вами в ближайшее время."
              : isWaiting
              ? "Оставьте контакты — сообщим, когда появится подходящий котёнок под ваш характер."
              : "Оставьте контакты — заводчик лично свяжется с вами в течение 24 часов, без менеджеров."}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <p className="text-foreground/90 leading-relaxed max-w-xs">
              {isWaiting
                ? "Вы в списке. Как только родится котёнок нужного характера — напишем первыми."
                : "Заявка получена. Заводчик ответит лично в течение 24 часов."}
            </p>
            <Button onClick={close} className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90">
              Понятно
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
            <div className="grid gap-1.5">
              <Label htmlFor="bk-name">Как вас зовут</Label>
              <Input
                id="bk-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Анна"
                required
                disabled={submitting}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bk-email">Email</Label>
              <Input
                id="bk-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="anna@example.com"
                required
                disabled={submitting}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bk-phone">Телефон</Label>
              <Input
                id="bk-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 999 123-45-67"
                required
                disabled={submitting}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bk-msg">
                {isWaiting ? "Какого котёнка ждёте?" : "Комментарий (необязательно)"}
              </Label>
              <Textarea
                id="bk-msg"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={
                  isWaiting
                    ? "Например: спокойный серебряный котёнок для семьи с ребёнком"
                    : "Вопросы о котёнке, условия, сроки..."
                }
                rows={3}
                disabled={submitting}
                className="resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-11 mt-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Отправляем...
                </>
              ) : isWaiting ? (
                "Записаться в лист ожидания"
              ) : (
                "Отправить заявку"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Нажимая кнопку, вы соглашаетесь на обработку контактов заводчиком.
              Никакого спама — только личный ответ.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
