import { ScrambleText } from "@/components/fx/ScrambleText";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly heading: string;
  readonly headingId: string;
  readonly className?: string;
}

/* Chapter header: mono telemetry eyebrow + architectural display heading,
 * both revealed with the holographic scramble treatment. */
export function SectionHeading({
  eyebrow,
  heading,
  headingId,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("max-w-full", className)}>
      <ScrambleText as="p" className="eyebrow">
        {eyebrow}
      </ScrambleText>
      <ScrambleText
        as="h2"
        id={headingId}
        scanline
        className="display-heading mt-5 text-fg"
      >
        {heading}
      </ScrambleText>
    </header>
  );
}
