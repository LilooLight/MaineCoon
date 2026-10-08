"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { PawPrint, Menu, Phone, Heart, Search } from "lucide-react";
import { useBooking } from "./booking-context";
import { useFavorites } from "@/hooks/use-favorites";
import { ThemeToggle } from "./theme-toggle";
import { FavoritesPanel } from "./favorites-panel";
import { SearchPalette, useSearchShortcut } from "./search-palette";

const NAV_LINKS = [
  { href: "#about", label: "О питомнике" },
  { href: "#producers", label: "Производители" },
  { href: "#kittens", label: "Котята" },
  { href: "#litters", label: "Помёты" },
  { href: "#breeder", label: "Заводчик" },
  { href: "#reviews", label: "Выпускники" },
  { href: "#visit", label: "Визит" },
  { href: "#blog", label: "Блог" },
  { href: "#faq", label: "Вопросы" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openWaitingList } = useBooking();
  const { count, hydrated } = useFavorites();
  useSearchShortcut(() => setSearchOpen(true));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="#top" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <PawPrint className="h-5 w-5" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                Тихий Дом
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground tracking-wide uppercase">
                питомник мейн-кунов
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="inline-flex h-9 items-center gap-2 px-3 rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-muted hover:border-primary/40 hover:text-foreground"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Поиск</span>
              <kbd className="hidden xl:inline-flex h-5 items-center rounded border border-border bg-muted px-1 text-[10px]">
                ⌘K
              </kbd>
            </button>
            {/* Call button — pinned in header on desktop */}
            <a
              href="tel:+74951234567"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors h-9"
            >
              <Phone className="h-4 w-4" />
              Позвонить
            </a>
            <a
              href="tel:+74951234567"
              className="hidden xl:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              <Phone className="h-4 w-4" />
              +7 495 123-45-67
            </a>
            {/* Favorites button */}
            <button
              type="button"
              onClick={() => setFavOpen(true)}
              aria-label="Избранные котята"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-muted hover:border-primary/40"
            >
              <Heart className="h-4 w-4" />
              {hydrated && count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {count}
                </span>
              )}
            </button>
            <ThemeToggle />
            <Button
              onClick={openWaitingList}
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              Лист ожидания
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="#kittens">Смотреть котят</Link>
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="lg:hidden flex items-center gap-1.5">
            {/* Search (mobile) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-4 w-4" />
            </button>
            {/* Favorites (mobile) */}
            <button
              type="button"
              onClick={() => setFavOpen(true)}
              aria-label="Избранные котята"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-muted"
            >
              <Heart className="h-4 w-4" />
              {hydrated && count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                  {count}
                </span>
              )}
            </button>
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Меню">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm bg-background p-0"
              >
                <SheetTitle className="sr-only">Меню навигации</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2.5 p-6 border-b border-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <PawPrint className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="font-serif text-lg font-semibold">Тихий Дом</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        питомник мейн-кунов
                      </span>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-1 p-4 flex-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-border flex flex-col gap-2">
                    <a
                      href="tel:+74951234567"
                      className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground py-2"
                    >
                      <Phone className="h-4 w-4" />
                      +7 495 123-45-67
                    </a>
                    <Button
                      onClick={() => {
                        setMobileOpen(false);
                        openWaitingList();
                      }}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                    >
                      Лист ожидания
                    </Button>
                    <Button
                      asChild
                      onClick={() => setMobileOpen(false)}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Link href="#kittens">Смотреть котят</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <FavoritesPanel open={favOpen} onOpenChange={setFavOpen} />
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
