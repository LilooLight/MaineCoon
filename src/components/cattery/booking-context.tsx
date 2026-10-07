"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface BookingState {
  isOpen: boolean;
  kittenId: string | null;
  kittenName: string | null;
  mode: "booking" | "waiting-list";
}

interface BookingContextValue extends BookingState {
  openBooking: (kitten?: { id: string; name: string }) => void;
  openWaitingList: () => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>({
    isOpen: false,
    kittenId: null,
    kittenName: null,
    mode: "booking",
  });

  const openBooking = useCallback((kitten?: { id: string; name: string }) => {
    setState({
      isOpen: true,
      kittenId: kitten?.id ?? null,
      kittenName: kitten?.name ?? null,
      mode: "booking",
    });
  }, []);

  const openWaitingList = useCallback(() => {
    setState({
      isOpen: true,
      kittenId: null,
      kittenName: null,
      mode: "waiting-list",
    });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, isOpen: false }));
  }, []);

  return (
    <BookingContext.Provider value={{ ...state, openBooking, openWaitingList, close }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
