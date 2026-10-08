"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  PawPrint,
  FileText,
  Trophy,
  Loader2,
  CornerDownLeft,
  ArrowRight,
  SearchX,
} from "lucide-react";
import { BLUR_DATA_URLS } from "@/lib/blur";
import { useRouter } from "next/navigation";

interface SearchKitten {
  id: string;
  name: string;
  colorLabel: string;
  personalityLabel: string;
  imageUrl: string;
  statusLabel: string;
  price: number;
}

interface SearchProducer {
  id: string;
  name: string;
  colorLabel: string;
  imageUrl: string;
  role: string;
}

interface SearchPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  readMinutes: number;
}

interface SearchResults {
  kittens: SearchKitten[];
  producers: SearchProducer[];
  posts: SearchPost[];
  total: number;
}

interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchPalette({ open, onOpenChange }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => performSearch(query), 250);
    return () => clearTimeout(t);
  }, [query, performSearch]);

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults(null);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build flat list of all results for keyboard navigation
  const flatResults = results
    ? [
        ...results.kittens.map((k) => ({ type: "kitten" as const, item: k })),
        ...results.producers.map((p) => ({ type: "producer" as const, item: p })),
        ...results.posts.map((p) => ({ type: "post" as const, item: p })),
      ]
    : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const handleSelect = (index: number) => {
    const entry = flatResults[index];
    if (!entry) return;
    onOpenChange(false);
    if (entry.type === "kitten") {
      router.push("/#kittens");
    } else if (entry.type === "producer") {
      router.push("/#producers");
    } else if (entry.type === "post") {
      router.push(`/blog/${entry.item.slug}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(activeIndex);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-background" onKeyDown={handleKeyDown}>
        <DialogTitle className="sr-only">Поиск по сайту</DialogTitle>
        <DialogDescription className="sr-only">
          Найдите котят, производителей и статьи по названию или описанию.
        </DialogDescription>

        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск котят, производителей, статей..."
            className="border-0 px-0 h-9 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
          {!loading && query && (
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] text-muted-foreground shrink-0">
              ESC
            </kbd>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto custom-scroll">
          {query.trim().length < 2 ? (
            <div className="p-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Введите минимум 2 символа для поиска
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {["спокойный", "серебряный", "Север", "документы", "уход"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : !results || results.total === 0 ? (
            <div className="p-8 text-center">
              <SearchX className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-serif text-lg font-semibold text-foreground">
                Ничего не нашлось
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                По запросу «{query}» нет результатов. Попробуйте другое слово.
              </p>
            </div>
          ) : (
            <div className="p-2">
              {results.kittens.length > 0 && (
                <SearchGroup label="Котята" count={results.kittens.length} icon={PawPrint}>
                  {results.kittens.map((kitten, i) => {
                    const idx = i;
                    return (
                      <SearchResultRow
                        key={kitten.id}
                        active={activeIndex === idx}
                        onClick={() => handleSelect(idx)}
                        onHover={() => setActiveIndex(idx)}
                        image={kitten.imageUrl}
                        title={kitten.name}
                        subtitle={`${kitten.colorLabel} · ${kitten.personalityLabel}`}
                        badge={kitten.statusLabel}
                        price={`${kitten.price.toLocaleString("ru-RU")} ₽`}
                      />
                    );
                  })}
                </SearchGroup>
              )}
              {results.producers.length > 0 && (
                <SearchGroup label="Производители" count={results.producers.length} icon={Trophy}>
                  {results.producers.map((producer, i) => {
                    const idx = results.kittens.length + i;
                    return (
                      <SearchResultRow
                        key={producer.id}
                        active={activeIndex === idx}
                        onClick={() => handleSelect(idx)}
                        onHover={() => setActiveIndex(idx)}
                        image={producer.imageUrl}
                        title={producer.name}
                        subtitle={`${producer.colorLabel} · ${producer.role === "male" ? "Кот" : "Кошка"}`}
                      />
                    );
                  })}
                </SearchGroup>
              )}
              {results.posts.length > 0 && (
                <SearchGroup label="Статьи" count={results.posts.length} icon={FileText}>
                  {results.posts.map((post, i) => {
                    const idx = results.kittens.length + results.producers.length + i;
                    return (
                      <SearchResultRow
                        key={post.id}
                        active={activeIndex === idx}
                        onClick={() => handleSelect(idx)}
                        onHover={() => setActiveIndex(idx)}
                        image={post.imageUrl}
                        title={post.title}
                        subtitle={post.excerpt}
                        badge={post.category}
                        trailing={`${post.readMinutes} мин`}
                      />
                    );
                  })}
                </SearchGroup>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {results && results.total > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 w-4 items-center justify-center rounded border border-border bg-background">↑</kbd>
                <kbd className="inline-flex h-4 w-4 items-center justify-center rounded border border-border bg-background">↓</kbd>
                навигация
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 items-center justify-center rounded border border-border bg-background">↵</kbd>
                выбрать
              </span>
            </div>
            <span>{results.total} результат(ов)</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SearchGroup({
  label,
  count,
  icon: Icon,
  children,
}: {
  label: string;
  count: number;
  icon: typeof PawPrint;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
        <Icon className="h-3 w-3" />
        {label}
        <span className="text-muted-foreground/60">({count})</span>
      </div>
      {children}
    </div>
  );
}

function SearchResultRow({
  active,
  onClick,
  onHover,
  image,
  title,
  subtitle,
  badge,
  price,
  trailing,
}: {
  active: boolean;
  onClick: () => void;
  onHover: () => void;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  price?: string;
  trailing?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
        active ? "bg-primary/10" : "hover:bg-muted/60"
      }`}
    >
      <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden ring-1 ring-border">
        <Image
          src={image}
          alt={title}
          fill
          sizes="40px"
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URLS.muted}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">{title}</span>
          {badge && (
            <Badge variant="outline" className="text-[9px] shrink-0">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
      {price && (
        <span className="font-serif text-sm font-semibold text-primary shrink-0">
          {price}
        </span>
      )}
      {trailing && (
        <span className="text-[11px] text-muted-foreground shrink-0">{trailing}</span>
      )}
      {active && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
    </button>
  );
}

// Hook to register the Ctrl+K / Cmd+K keyboard shortcut globally
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
