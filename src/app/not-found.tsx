import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/cattery/footer";
import { BackToTop } from "@/components/cattery/back-to-top";
import { PawPrint, Home, Search, ArrowLeft, Heart } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Decorative paw prints */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--primary) 2px, transparent 3px), radial-gradient(circle at 70% 60%, var(--secondary) 2px, transparent 3px), radial-gradient(circle at 45% 85%, var(--accent) 2px, transparent 3px)",
            backgroundSize: "180px 180px, 220px 220px, 160px 160px",
          }}
        />

        <div className="relative text-center max-w-lg mx-auto">
          {/* Big paw */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PawPrint className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              {/* Floating question marks */}
              <span className="absolute -top-2 -right-3 font-serif text-2xl text-secondary/60 animate-pulse">
                ?
              </span>
              <span
                className="absolute -bottom-1 -left-3 font-serif text-lg text-accent/50 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              >
                ?
              </span>
            </div>
          </div>

          {/* 404 */}
          <h1 className="font-serif text-6xl sm:text-7xl font-semibold text-foreground leading-none mb-3">
            <span className="text-gradient-warm">404</span>
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
            Этот котёнок убежал
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
            Страница, которую вы ищете, не найдена — возможно, котёнок уже нашёл
            семью. Но не переживайте, вот куда можно вернуться:
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                На главную
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              <Link href="/#kittens">
                <Search className="h-4 w-4 mr-2" />
                Найти котёнка
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-muted-foreground hover:text-foreground">
              <Link href="/#blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                В блог
              </Link>
            </Button>
          </div>

          {/* Honest note */}
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Heart className="h-3 w-3 text-accent" />
            Каждый котёнок — событие. Даже потеряться.
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
