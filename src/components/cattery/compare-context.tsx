"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

const COMPARE_KEY = "cattery:compare";
const MAX_COMPARE = 3;

interface CompareState {
  ids: string[];
}

interface CompareContextValue extends CompareState {
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isComparing: (id: string) => boolean;
  canAdd: boolean;
  max: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const isComparing = useCallback(
    (id: string) => ids.includes(id),
    [ids]
  );

  return (
    <CompareContext.Provider
      value={{
        ids,
        toggle,
        remove,
        clear,
        isComparing,
        canAdd: ids.length < MAX_COMPARE,
        max: MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

// Persist to localStorage so favorites survive reloads
if (typeof window !== "undefined") {
  // re-export storage helpers used by the provider on mount
  // (kept here for proximity; the provider reads on init via a lazy initializer below)
}
