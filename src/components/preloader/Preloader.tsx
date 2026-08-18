"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";
import {
  PRELOADER_CAP_MS,
  PRELOADER_MIN_MS,
  PRELOADER_SESSION_KEY,
  PRELOADER_TASK_TIMEOUT_MS,
} from "@/lib/constants";
import {
  createLoadingTracker,
  firstFrameTask,
  fontsTask,
  imageDecodeTask,
} from "@/lib/loading-tracker";
import { useLoading } from "@/components/providers/LoadingProvider";

/*
 * Boot-sequence preloader: a 0-100 tabular counter over the canvas navy,
 * driven by real asset loading (fonts, hero poster, first frame) with a hard
 * time cap so nothing can hang the gate. Repeat visits in the same session
 * skip to a 300ms fade. Scroll is locked while visible; the exit wipe hands
 * off to the hero intro via the loading context.
 */
const HERO_POSTER_SRC = "/images/hero-poster.webp";
const DRIFT_TARGET = 88;
const ANNOUNCE_STEP = 25;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Preloader() {
  const { status, setStatus } = useLoading();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const overlay = overlayRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    if (!overlay || !counter || !bar) return;

    document.documentElement.classList.add("overflow-hidden");
    lenisRef.current?.stop();

    const unlock = (): void => {
      document.documentElement.classList.remove("overflow-hidden");
      lenisRef.current?.start();
      setStatus("done");
    };

    let skipped = false;
    try {
      skipped = sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
    } catch {
      /* storage unavailable; run the full sequence */
    }

    const reduced = window.matchMedia(MEDIA.reduce).matches;

    if (skipped || reduced) {
      counter.textContent = "100";
      gsap.set(bar, { scaleX: 1 });
      setStatus("exiting");
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
        onComplete: unlock,
      });
      return;
    }

    /* The displayed value is the monotonic max of two sources: a time-based
     * drift (so the counter always moves) and real tracked asset progress
     * (so the number means something). Each source tweens its own proxy;
     * commit() renders whichever is ahead and never goes backward. */
    const shown = { value: 0 };
    const driftProxy = { value: 0 };
    const realProxy = { value: 0 };
    let lastAnnounced = -1;

    const render = (): void => {
      const rounded = Math.round(shown.value);
      counter.textContent = String(rounded).padStart(3, "0");
      gsap.set(bar, { scaleX: shown.value / 100 });
      const step = Math.floor(rounded / ANNOUNCE_STEP) * ANNOUNCE_STEP;
      if (step !== lastAnnounced && announceRef.current) {
        lastAnnounced = step;
        announceRef.current.textContent = `Loading portfolio, ${step}%`;
      }
    };

    const commit = (candidate: number): void => {
      if (candidate <= shown.value) return;
      shown.value = candidate;
      render();
    };

    const drift = gsap.to(driftProxy, {
      value: DRIFT_TARGET,
      duration: PRELOADER_MIN_MS / 1000,
      ease: "power2.out",
      onUpdate: () => commit(driftProxy.value),
    });

    const tracker = createLoadingTracker(
      [
        fontsTask(30),
        imageDecodeTask("hero-poster", HERO_POSTER_SRC, 40),
        firstFrameTask(30),
      ],
      PRELOADER_TASK_TIMEOUT_MS,
    );

    const unsubscribe = tracker.onProgress((progress) => {
      gsap.to(realProxy, {
        value: Math.min(progress, 99),
        duration: 0.45,
        ease: "power1.out",
        overwrite: "auto",
        onUpdate: () => commit(realProxy.value),
      });
    });

    const exit = (): void => {
      try {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
      } catch {
        /* non-fatal */
      }
      setStatus("exiting");
      const timeline = gsap.timeline({ onComplete: unlock });
      timeline.to(counter, {
        duration: 0.3,
        scrambleText: { text: "100", chars: "01" },
      });
      timeline.to(
        overlay,
        { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: EASE.inOut },
        "+=0.1",
      );
    };

    const finish = (): void => {
      unsubscribe();
      drift.kill();
      gsap.killTweensOf(realProxy);
      gsap.to(shown, {
        value: 100,
        duration: 0.35,
        ease: "power1.in",
        onUpdate: render,
        onComplete: exit,
      });
    };

    const startedAt = performance.now();
    Promise.race([tracker.promise, delay(PRELOADER_CAP_MS)])
      .then(() => {
        const elapsed = performance.now() - startedAt;
        return delay(Math.max(0, PRELOADER_MIN_MS - elapsed));
      })
      .then(finish);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "done") return null;

  return (
    <div
      ref={overlayRef}
      data-preloader
      role="status"
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-canvas px-6 py-8 md:px-12 md:py-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      {/* Without JavaScript the exit choreography never runs; hide the gate
       * entirely so the server-rendered page stays readable. */}
      <noscript>
        <style>{`[data-preloader]{display:none}`}</style>
      </noscript>
      <p className="eyebrow">SYS BOOT · LOADING 000-100</p>

      <div className="flex items-end justify-between gap-8">
        <div className="hidden space-y-2 md:block" aria-hidden="true">
          <p className="eyebrow !text-[10px] text-muted">FONTS · GENERAL SANS + JETBRAINS MONO</p>
          <p className="eyebrow !text-[10px] text-muted">SCENE · SPLINE RUNTIME DEFERRED</p>
          <p className="eyebrow !text-[10px] text-muted">AUDIO · ARMED · 03 TRACKS</p>
        </div>
        <span
          ref={counterRef}
          aria-hidden="true"
          className="mono-nums block text-right text-[clamp(4.5rem,15vw,10rem)] leading-none text-fg"
        >
          000
        </span>
      </div>

      <div className="h-px w-full bg-line">
        <div ref={barRef} className="h-px w-full origin-left scale-x-0 bg-accent" />
      </div>

      <span ref={announceRef} className="sr-only" aria-live="polite" />
    </div>
  );
}
