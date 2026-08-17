import Image from "next/image";
import type { Platform } from "@/content/types";
import { Badge } from "@/components/ui/Badge";
import { ArrowLink } from "@/components/ui/ArrowLink";

/*
 * One live-platform card, shared by both Chapter 05 displays: the accessible
 * grid (default / SSR / lite / reduce) and the decorative 3D helix (full tier,
 * aria-hidden). The whole card is clickable through a stretched overlay anchor
 * carrying data-cursor="view"; the overlay is aria-hidden and tab-skipped so
 * the single accessible, keyboard-reachable link is the ArrowLink in the
 * footer. The helix variant renders no focusable content at all because its
 * stage is aria-hidden entirely.
 *
 * One engine per property: GSAP owns the helix arm opacity and rotation on
 * WRAPPER elements; the only CSS transition here is the image filter on hover.
 */

export type PlatformCardVariant = "grid" | "helix";

export interface PlatformCardProps {
  readonly platform: Platform;
  readonly variant?: PlatformCardVariant;
}

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 750;
const GRID_SIZES = "(min-width: 640px) 45vw, 90vw";
const HELIX_SIZES = "360px";

export function PlatformCard({ platform, variant = "grid" }: PlatformCardProps) {
  const isDecorative = variant === "helix";

  return (
    <article className="group relative flex h-full flex-col border border-line bg-ink p-6">
      <div className="overflow-hidden">
        <Image
          src={platform.image}
          alt={isDecorative ? "" : `${platform.title} interface preview`}
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          sizes={isDecorative ? HELIX_SIZES : GRID_SIZES}
          className="aspect-[16/10] w-full object-cover grayscale-[30%] transition-[filter] duration-500 group-hover:grayscale-0"
        />
      </div>

      <h3 className="mt-6 text-2xl uppercase text-fg">{platform.title}</h3>
      <p className="eyebrow mt-2 text-steel">{platform.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        {platform.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
        <Badge tone="steel">{platform.status}</Badge>
        {isDecorative ? (
          <span className="eyebrow flex items-center gap-2 pb-1 !text-xs text-fg">
            VISIT
            <span className="text-steel">↗</span>
          </span>
        ) : (
          <ArrowLink href={platform.url} external className="relative z-10">
            VISIT
          </ArrowLink>
        )}
      </div>

      {/* Stretched click target for the whole card. Decorative for assistive
          tech; the footer ArrowLink is the accessible link in grid mode. */}
      <a
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden="true"
        tabIndex={-1}
        data-cursor="view"
        className="absolute inset-0"
      />
    </article>
  );
}
