"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";
import {
  PRELOADER_CAP_MS,
  PRELOADER_MIN_MS,
  PRELOADER_QUOTE_FADE_IN_MS,
  PRELOADER_QUOTE_FADE_OUT_AT_MS,
  PRELOADER_REAL_PROGRESS_CEIL,
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
import type { PreloaderContent } from "@/content/types";

/*
 * Boot-sequence preloader: a 0-100 tabular counter over the canvas navy,
 * driven by real asset loading (fonts, hero poster, first frame) with a hard
 * time cap, and held for PRELOADER_MIN_MS so the centerpiece quote gets a
 * full read before the gate opens. The timed hold is dismissible (WCAG
 * 2.2.1): a SKIP control plus Enter/Escape cancel the remaining wait and run
 * the finish sequence early; the 9s auto-advance stays the default for
 * passive viewers. Repeat visits in the same session skip to a 300ms fade.
 * Scroll is locked and the covered page shell is inert while visible; the
 * exit wipe hands off to the hero intro via the loading context.
 */
const HERO_POSTER_SRC = "/images/hero-poster.webp";
const DRIFT_TARGET = 88;
const ANNOUNCE_STEP = 25;

/* Page shell behind the opaque overlay; made inert while the gate is up so
 * keyboard focus cannot land on invisible controls (WCAG 2.4.3/2.4.7). */
const COVERED_SHELL_SELECTOR = "nav, #main-content, footer";

/* Quote choreography (full-run path only): rise in shortly after boot, hold
 * for the read, then clear the stage together with the boot lines just
 * before the counter's finish/exit sequence. */
const QUOTE_FADE_IN_DELAY_S = 0.6;
const QUOTE_RISE_IN_PX = 12;
const QUOTE_FADE_OUT_S = 0.5;
const QUOTE_RISE_OUT_PX = -8;

interface PreloaderProps {
  readonly data: PreloaderContent;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Preloader({ data }: PreloaderProps) {
  const { status, setStatus } = useLoading();
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const bootRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const finishedRef = useRef(false);
  const dismissRef = useRef<(() => void) | null>(null);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const overlay = overlayRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    if (!overlay || !counter || !bar) return;

    document.documentElement.classList.add("overflow-hidden");
    lenisRef.current?.stop();

    /* All paths (full run, session skip, reduced motion) cover the page with
     * an opaque overlay, so all paths make the shell inert; unlock() below
     * restores focusability on every exit route. */
    const covered = Array.from(
      document.querySelectorAll(COVERED_SHELL_SELECTOR),
    );
    for (const el of covered) el.setAttribute("inert", "");
    const removeInert = (): void => {
      for (const el of covered) el.removeAttribute("inert");
    };

    const unlock = (): void => {
      document.documentElement.classList.remove("overflow-hidden");
      lenisRef.current?.start();
      removeInert();
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

    /* Full-run path only from here down. The SKIP control renders only on
     * this path; the branches above exit in 300ms and never need it. */
    setShowSkip(true);

    /* Quote choreography, full-run path only: fade/rise in, hold, then fade
     * the quote and boot lines out together shortly before finish() takes
     * the counter to 100. Handles are kept so an early dismiss or a mid-run
     * unmount can kill the pending fade-out before it fires mid-wipe. */
    const quote = quoteRef.current;
    const boot = bootRef.current;
    let quoteIn: gsap.core.Tween | null = null;
    let quoteOutCall: gsap.core.Tween | null = null;
    if (quote) {
      quoteIn = gsap.fromTo(
        quote,
        { opacity: 0, y: QUOTE_RISE_IN_PX },
        {
          opacity: 1,
          y: 0,
          duration: PRELOADER_QUOTE_FADE_IN_MS / 1000,
          delay: QUOTE_FADE_IN_DELAY_S,
          ease: EASE.out,
        },
      );
      quoteOutCall = gsap.delayedCall(PRELOADER_QUOTE_FADE_OUT_AT_MS / 1000, () => {
        gsap.to(boot ? [quote, boot] : [quote], {
          opacity: 0,
          y: QUOTE_RISE_OUT_PX,
          duration: QUOTE_FADE_OUT_S,
          ease: EASE.out,
          overwrite: "auto",
        });
      });
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

    /* Real progress commits are clamped at PRELOADER_REAL_PROGRESS_CEIL:
     * assets finish in about 2s, and without the clamp the counter would
     * park near the top for the rest of the quote hold. The time drift
     * carries the remainder honestly. */
    const unsubscribe = tracker.onProgress((progress) => {
      gsap.to(realProxy, {
        value: Math.min(progress, PRELOADER_REAL_PROGRESS_CEIL),
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

    /* User dismiss (SKIP button, Enter, or Escape): resolving this promise
     * cancels whatever remains of the MIN-hold wait via the races below. */
    let dismiss: () => void = () => {};
    const dismissed = new Promise<void>((resolve) => {
      dismiss = resolve;
    });
    dismissRef.current = dismiss;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Enter" && event.key !== "Escape") return;
      window.removeEventListener("keydown", onKeyDown);
      dismiss();
    };
    window.addEventListener("keydown", onKeyDown);

    /* finish() is idempotent: a user dismiss can run it early while the 9s
     * chain is still pending, so the ref guard makes the second arrival a
     * no-op, and the pending quote fade-out delayedCall is killed so it
     * cannot fire mid-wipe. */
    let cancelled = false;
    const finish = (): void => {
      if (finishedRef.current || cancelled) return;
      finishedRef.current = true;
      quoteOutCall?.kill();
      window.removeEventListener("keydown", onKeyDown);
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
    Promise.race([tracker.promise, delay(PRELOADER_CAP_MS), dismissed])
      .then(() => {
        const elapsed = performance.now() - startedAt;
        return Promise.race([
          delay(Math.max(0, PRELOADER_MIN_MS - elapsed)),
          dismissed,
        ]);
      })
      .then(finish);

    /* Mid-run unmount (dev fast-refresh): kill every scheduled tween and
     * callback, drop the listeners, and restore the page state this effect
     * changed. Resetting the run guards lets a remounted instance start
     * clean while `cancelled` keeps this run's pending chain from finishing. */
    return () => {
      cancelled = true;
      startedRef.current = false;
      finishedRef.current = false;
      dismissRef.current = null;
      window.removeEventListener("keydown", onKeyDown);
      quoteIn?.kill();
      quoteOutCall?.kill();
      drift.kill();
      gsap.killTweensOf(realProxy);
      unsubscribe();
      removeInert();
      document.documentElement.classList.remove("overflow-hidden");
      lenisRef.current?.start();
    };
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

      {/* Centerpiece quote: real text (not aria-hidden), no scramble; the
       * counter's exit scramble stays the only scramble moment. Server-
       * rendered opacity-0 so boot never flashes it before the fromTo runs;
       * the session-skip and reduced-motion paths leave it hidden (their
       * 300ms exit makes it unreadable anyway). */}
      <div
        ref={quoteRef}
        className="flex flex-1 items-center justify-center py-10 opacity-0"
      >
        <div>
          <p className="max-w-[46ch] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-relaxed text-muted">
            {data.quoteLead}
            <strong className="font-normal text-fg">{data.quoteEmphasis}</strong>
          </p>
          <p className="eyebrow mt-4 text-steel">{data.attribution}</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-8">
        <div className="flex min-w-0 flex-col items-start gap-5">
          <div ref={bootRef} className="hidden space-y-2 md:block" aria-hidden="true">
            {data.bootLines.map((line) => (
              <p key={line} className="eyebrow !text-[10px] text-muted">
                {line}
              </p>
            ))}
          </div>
          {/* Dismiss path for the timed quote hold (WCAG 2.2.1), styled on
           * the TickerMarquee HOLD control. Full-run path only; sits outside
           * bootRef so the 8.5s stage-clear fade never takes it away. */}
          {showSkip ? (
            <button
              type="button"
              onClick={() => dismissRef.current?.()}
              aria-label="Skip intro"
              data-cursor="link"
              className="eyebrow border border-line px-3 py-1.5 !text-[9px] text-steel transition-colors hover:border-line-strong motion-reduce:hidden"
            >
              SKIP ▸
            </button>
          ) : null}
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
