"use client";

import { useRef, type CSSProperties } from "react";
import type { Platform } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";
import { HELIX_RADIUS_PX } from "@/lib/constants";
import { PlatformCard } from "@/components/sections/PlatformCard";

/*
 * Full-tier 3D helix of the four live platforms. A pinned 100vh stage; the
 * .helix assembly rotates a full turn under scroll scrub while each card's
 * opacity is shaped by its world angle (front card crisp, rear card faded)
 * via a cosine falloff computed in onUpdate.
 *
 * The entire stage is aria-hidden: the accessible platform list is the grid
 * inside ProductionSection, kept sr-only while this stage is mounted. Card
 * click-through anchors inside are tab-skipped (tabIndex -1) so no focus
 * ever lands in hidden content.
 *
 * One engine per property: GSAP owns helix rotationY and arm opacity (both
 * wrapper elements); hover effects inside PlatformCard touch only the image
 * filter via CSS.
 */

export interface HelixCarouselProps {
  readonly platforms: readonly Platform[];
}

const CARD_STEP_DEG = 90;
const ARM_DROP_STEP_PX = 40;
const ARM_DROP_OFFSET_PX = 60;
const PERSPECTIVE_PX = 1400;
const SCRUB_DISTANCE = "+=250%";
const MIN_CARD_OPACITY = 0.15;
const FULL_TURN_DEG = 360;
const DEG_TO_RAD = Math.PI / 180;

function armTransform(index: number): string {
  const drop = index * ARM_DROP_STEP_PX - ARM_DROP_OFFSET_PX;
  return [
    `rotateY(${index * CARD_STEP_DEG}deg)`,
    `translateZ(${HELIX_RADIUS_PX}px)`,
    `translateY(${drop}px)`,
  ].join(" ");
}

/* World angle of card i at a given scrub progress; 0deg faces the viewer.
 * Cosine falloff: opacity 1 at 0deg, MIN_CARD_OPACITY at 180deg. */
function cardOpacityAt(index: number, progress: number): number {
  const angleDeg =
    (index * CARD_STEP_DEG + progress * FULL_TURN_DEG) % FULL_TURN_DEG;
  const facing = (Math.cos(angleDeg * DEG_TO_RAD) + 1) / 2;
  return MIN_CARD_OPACITY + (1 - MIN_CARD_OPACITY) * facing;
}

export function HelixCarousel({ platforms }: HelixCarouselProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;
      const stage = scope.querySelector<HTMLElement>("[data-stage]");
      const helix = scope.querySelector<HTMLElement>("[data-helix]");
      if (!stage || !helix) return;
      const arms = gsap.utils.toArray<HTMLElement>("[data-arm]", helix);

      const shapeOpacity = (progress: number): void => {
        arms.forEach((arm, index) => {
          gsap.set(arm, { opacity: cardOpacityAt(index, progress) });
        });
      };

      const mm = gsap.matchMedia();

      /* Full: pin the stage and scrub one full rotation. */
      mm.add(MEDIA.full, () => {
        shapeOpacity(0);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: SCRUB_DISTANCE,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => shapeOpacity(self.progress),
          },
        });
        timeline.fromTo(
          helix,
          { rotationY: 0 },
          { rotationY: FULL_TURN_DEG, ease: EASE.none },
        );
      });

      /* Lite and reduce: the parent swaps back to the grid, so this stage is
       * effectively unmounted; if it is ever alive here, present the front
       * card statically. No pins, no scrubs. */
      mm.add(MEDIA.lite, () => {
        gsap.set(helix, { rotationY: 0 });
        shapeOpacity(0);
      });
      mm.add(MEDIA.reduce, () => {
        gsap.set(helix, { rotationY: 0 });
        shapeOpacity(0);
      });
    },
    { scope: scopeRef },
  );

  const perspectiveStyle: CSSProperties = {
    perspective: `${PERSPECTIVE_PX}px`,
  };
  const preserve3dStyle: CSSProperties = { transformStyle: "preserve-3d" };

  return (
    <div ref={scopeRef} aria-hidden="true">
      <div data-stage className="relative h-screen overflow-hidden">
        <div className="absolute inset-0" style={perspectiveStyle}>
          <div data-helix className="absolute inset-0" style={preserve3dStyle}>
            {platforms.map((platform, index) => (
              <div
                key={platform.title}
                data-arm
                className="absolute inset-0 grid place-items-center"
                style={{ transform: armTransform(index) }}
              >
                <div
                  className="w-[360px] max-w-[80vw]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <PlatformCard platform={platform} variant="helix" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
