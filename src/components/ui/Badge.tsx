import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "default" | "steel" | "amber";

interface BadgeProps {
  readonly children: ReactNode;
  readonly tone?: BadgeTone;
  readonly className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  default: "text-muted border-line",
  steel: "text-steel border-line-strong",
  amber: "text-amber border-amber/40",
};

/* Mono status chip with a hairline border. */
export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-block border px-3 py-1.5 !tracking-[0.18em]",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
