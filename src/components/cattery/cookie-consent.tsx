"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X, Check } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "cattery:cookie-consent";

type Consent = "accepted" | "rejected";

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "accepted" || raw === "rejected" ? raw : null;
  } catch {
    return null;
  }
}

function writeConsent(value: Consent) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // ignore
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after a short delay if no decision stored
    const consent = readConsent();
    if (consent === null) {
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = useCallback(() => {
    writeConsent("accepted");
    setVisible(false);
    toast.success("Спасибо! Мы используем только необходимые cookie.", {
      description: "Аналитика и сохранение избранного работают.",
    });
  }, []);

  const handleReject = useCallback(() => {
    writeConsent("rejected");
    setVisible(false);
    toast("Cookie отклонены", {
      description: "Мы не будем сохранять аналитику. Избранное работает в текущей сессии.",
    });
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление об использовании cookie"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:w-[420px] z-[70] animate-[blur-fade-in_0.4s_ease-out]"
    >
      <div className="relative rounded-2xl bg-card ring-1 ring-border shadow-2xl p-5">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Закрыть"
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-1 pr-6">
              Мы используем cookie
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Необходимые — для работы избранного и сравнения. Аналитические —
              чтобы понимать, какие статьи читают. Без передачи данных третьим
              лицам. Согласно 152-ФЗ.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="h-9 text-xs"
          >
            Только необходимые
          </Button>
          <Button
            size="sm"
            onClick={handleAccept}
            className="h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Принять все
          </Button>
        </div>
      </div>
    </div>
  );
}
