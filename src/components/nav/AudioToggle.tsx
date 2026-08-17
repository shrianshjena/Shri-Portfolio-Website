"use client";

import { useAudio } from "@/components/providers/AudioProvider";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { cn } from "@/lib/cn";

/*
 * Play/pause control for the site soundtrack, shared by nav and hero. The
 * optional readout shows "01/03 STRONGER" in mono and scrambles on track
 * change. Icon-only state is mirrored by aria-pressed.
 */
interface AudioToggleProps {
  readonly showTitle?: boolean;
  readonly className?: string;
}

export function AudioToggle({ showTitle = false, className }: AudioToggleProps) {
  const { isPlaying, track, trackIndex, trackCount, toggle } = useAudio();

  const readout = `${String(trackIndex + 1).padStart(2, "0")}/${String(trackCount).padStart(2, "0")} ${track.title}`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
      data-cursor="link"
      className={cn("group flex items-center gap-3", className)}
    >
      <span className="flex size-9 items-center justify-center border border-line-strong transition-colors duration-300 group-hover:border-fg">
        {isPlaying ? (
          <svg aria-hidden="true" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <rect x="0" y="0" width="3" height="12" />
            <rect x="7" y="0" width="3" height="12" />
          </svg>
        ) : (
          <svg aria-hidden="true" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
            <path d="M0 0 L10 6 L0 12 Z" />
          </svg>
        )}
      </span>
      {showTitle ? (
        <ScrambleText
          key={readout}
          as="span"
          trigger="play"
          play
          duration={0.6}
          className="eyebrow hidden !text-[10px] sm:block"
        >
          {readout}
        </ScrambleText>
      ) : null}
    </button>
  );
}
