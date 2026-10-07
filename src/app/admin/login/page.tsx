"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClipboardList, Lock, ArrowLeft, Loader2, PawPrint, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to /admin
    fetch("/api/admin/auth")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");
      toast.success("Добро пожаловать, Мария!");
      router.replace("/admin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground mb-3">
            <ClipboardList className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Кабинет заводчика
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Войдите, чтобы управлять заявками
          </p>
        </div>

        <Card className="border-border bg-card shadow-md">
          <CardHeader className="space-y-1 pb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              Защищённый вход
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    required
                    disabled={loading}
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Входим...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Войти
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-[11px] text-secondary-foreground leading-relaxed">
                <PawPrint className="h-3 w-3 inline mr-1" />
                Демо-пароль: <code className="font-mono bg-background/60 px-1 py-0.5 rounded">tihiy-dom-2026</code>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-1" />
              На сайт
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
