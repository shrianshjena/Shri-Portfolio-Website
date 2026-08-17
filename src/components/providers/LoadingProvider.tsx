"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/*
 * Preloader state machine shared between the Preloader overlay (which drives
 * it) and the hero (which plays its intro when status flips to "done").
 * The initial state is identical on server and client; skip logic runs in an
 * effect inside the Preloader, never at render time.
 */
export type LoadingStatus = "loading" | "exiting" | "done";

interface LoadingContextValue {
  readonly status: LoadingStatus;
  readonly setStatus: (status: LoadingStatus) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [status, setStatusState] = useState<LoadingStatus>("loading");

  const setStatus = useCallback((next: LoadingStatus) => {
    setStatusState(next);
  }, []);

  const value = useMemo(() => ({ status, setStatus }), [status, setStatus]);

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used inside LoadingProvider");
  }
  return context;
}
