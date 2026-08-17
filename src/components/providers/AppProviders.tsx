"use client";

import type { ReactNode } from "react";
import { SmoothScrollProvider } from "./SmoothScrollProvider";
import { LoadingProvider } from "./LoadingProvider";
import { AudioProvider } from "./AudioProvider";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { GrainOverlay } from "@/components/fx/GrainOverlay";

/* Client shell composing the app-wide systems; server-rendered page content
 * passes through as children. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <LoadingProvider>
        <AudioProvider>
          {children}
          <CustomCursor />
          <GrainOverlay />
        </AudioProvider>
      </LoadingProvider>
    </SmoothScrollProvider>
  );
}
