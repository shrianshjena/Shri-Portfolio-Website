"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";
import { useAudio } from "@/components/providers/AudioProvider";
import { AudioToggle } from "@/components/nav/AudioToggle";

/*
 * Bottom-center hero music CTA: the shared AudioToggle stacked over an
 * invitation label. While idle the label breathes once (single down-up
 * opacity cycle, GSAP only, no CSS transition on opacity) then settles at
 * full opacity; once playing, the label yields to the AudioToggle track
 * readout. The label stays exposed to assistive tech: it is static text
 * under an opacity tween and complements the toggle's play/pause name.
 */

/* Breathe bounds: opacity eases 1 -> 0.85 and back exactly once (2 x 2.4s
 * = 4.8s total, under the 5s automatic-motion threshold of WCAG 2.2.2).
 * The 0.85 trough keeps the muted label at or above 4.5:1 over canvas
 * (WCAG 1.4.3). */
const BREATHE_MIN_OPACITY = 0.85;
const BREATHE_DURATION_S = 2.4;
const BREATHE_CYCLES = 1;

interface HeroAudioCtaProps {
  readonly label: string;
}

export function HeroAudioCta({ label }: HeroAudioCtaProps) {
  const { isPlaying } = useAudio();
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isPlaying) return;
      const breathe = () => {
        gsap.to(".hero-audio-hint", {
          opacity: BREATHE_MIN_OPACITY,
          duration: BREATHE_DURATION_S,
          repeat: BREATHE_CYCLES,
          yoyo: true,
          ease: EASE.soft,
        });
      };
      const mm = gsap.matchMedia();
      mm.add(MEDIA.full, breathe);
      mm.add(MEDIA.lite, breathe);
      /* Reduce: no loop, label holds full opacity. */
    },
    { scope, dependencies: [isPlaying], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className="flex flex-col items-center gap-3">
      <AudioToggle layout="stack" showTitle={isPlaying} />
      {!isPlaying ? (
        <p className="hero-audio-hint eyebrow !text-[10px] text-muted">
          {label}
        </p>
      ) : null}
    </div>
  );
}
