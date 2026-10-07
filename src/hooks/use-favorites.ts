"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cattery:favorites";

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    // Notify other components in the same tab
    window.dispatchEvent(new CustomEvent("cattery:favoritesChange"));
  } catch {
    // ignore quota / private mode errors
  }
}

/**
 * useFavorites — persistent list of favorited kitten IDs (localStorage).
 * Shared across components via a custom event for same-tab sync.
 */
export function useFavorites() {
  // Lazy init: read from localStorage on first client render to avoid
  // a synchronous setState-in-effect.
  const [favorites, setFavorites] = useState<string[]>(() => readFromStorage());
  const [hydrated, setHydrated] = useState(() => typeof window !== "undefined");

  useEffect(() => {
    // Subscribe to cross-tab + same-tab storage changes. Initial state is
    // already read via the lazy useState initializer above.
    const sync = () => setFavorites(readFromStorage());
    window.addEventListener("storage", sync);
    window.addEventListener("cattery:favoritesChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cattery:favoritesChange", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = readFromStorage();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    writeToStorage(next);
    setFavorites(next);
  }, []);

  const remove = useCallback((id: string) => {
    const next = readFromStorage().filter((x) => x !== id);
    writeToStorage(next);
    setFavorites(next);
  }, []);

  const clear = useCallback(() => {
    writeToStorage([]);
    setFavorites([]);
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return { favorites, isFavorite, toggle, remove, clear, hydrated, count: favorites.length };
}
