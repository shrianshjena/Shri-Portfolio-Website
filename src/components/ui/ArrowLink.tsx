import type { ReactNode } from "react";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { cn } from "@/lib/cn";

interface ArrowLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly external?: boolean;
  readonly arrow?: "down" | "out";
  readonly className?: string;
}

/* Square text CTA: mono uppercase label + arrow, hairline underline on
 * hover, magnetic on fine pointers. The site's only rounded element is the
 * contact pill, so this stays square. */
export function ArrowLink({
  href,
  children,
  external,
  arrow = "out",
  className,
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      data-cursor="link"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("group inline-block", className)}
    >
      <MagneticButton>
        <span className="eyebrow flex items-center gap-2 border-b border-transparent pb-1 !text-xs text-fg transition-colors duration-300 group-hover:border-line-strong">
          {children}
          <span aria-hidden="true" className="text-steel">
            {arrow === "down" ? "↓" : "↗"}
          </span>
        </span>
      </MagneticButton>
    </a>
  );
}
