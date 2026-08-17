import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionShellProps {
  readonly anchor: string;
  readonly labelledBy?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/* Standard chapter wrapper: anchor id, aria wiring, section rhythm. */
export function SectionShell({
  anchor,
  labelledBy,
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={anchor}
      aria-labelledby={labelledBy}
      className={cn("relative px-6 py-28 md:px-12 md:py-40 lg:px-20", className)}
    >
      {children}
    </section>
  );
}
