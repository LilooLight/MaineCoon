"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * useIsMounted — returns `true` when running on the client, `false` during SSR.
 * Implemented with useSyncExternalStore so there's no synchronous setState
 * in an effect (avoids the react-hooks/set-state-in-effect lint rule) and
 * no hydration mismatch (server snapshot is always `false`).
 */
export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
