"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, MEDIA } from "@/lib/motion";
import { NSE_CLOSE_MIN, NSE_OPEN_MIN } from "@/lib/constants";

/*
 * DESK STATUS column body: a live IST clock, an NSE cash-session status
 * line with a pulsing steel dot, then the static telemetry lines from the
 * content slice (passed as a prop; islands never import SITE).
 *
 * The clock server-renders a placeholder and fills on mount, so hydration
 * never mismatches. It ticks on a 1s interval, not rAF. Deliberately no
 * aria-live: a once-per-second announcement would spam screen readers; the
 * current value is always readable in place.
 */

const CLOCK_PLACEHOLDER = "--:--:-- IST";
const STATUS_PLACEHOLDER = "NSE · ----";
const CLOCK_TICK_MS = 1000;
const DOT_PULSE_S = 2.4;
const DOT_PULSE_SCALE = 0.55;
const DOT_PULSE_OPACITY = 0.35;
const CLOSED_WEEKDAYS = new Set(["Sat", "Sun"]);

const IST_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/* "HH:MM" from minutes since midnight (session bounds in constants.ts). */
function minutesLabel(totalMinutes: number): string {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

const OPEN_STATUS = `NSE · OPEN · CLOSES ${minutesLabel(NSE_CLOSE_MIN)} IST`;
const CLOSED_STATUS = `NSE · CLOSED · OPENS ${minutesLabel(NSE_OPEN_MIN)} IST`;

interface IstReading {
  readonly clock: string;
  readonly isOpen: boolean;
}

function readIst(now: Date): IstReading {
  const parts = IST_FORMATTER.formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? "";

  const weekday = part("weekday");
  const hour = part("hour");
  const minute = part("minute");
  const second = part("second");
  const sinceMidnight = Number(hour) * 60 + Number(minute);
  const isOpen =
    !CLOSED_WEEKDAYS.has(weekday) &&
    sinceMidnight >= NSE_OPEN_MIN &&
    sinceMidnight < NSE_CLOSE_MIN;

  return { clock: `${hour}:${minute}:${second} IST`, isOpen };
}

interface DeskClockProps {
  readonly telemetry: readonly string[];
}

export function DeskClock({ telemetry }: DeskClockProps) {
  const [clock, setClock] = useState(CLOCK_PLACEHOLDER);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    /* WCAG 2.2.2 judgment, recorded deliberately: the per-second IST clock
     * is auto-updating content, and no pause or frequency control is
     * provided by design decision. It claims the essential exception for a
     * live clock readout: accurate current time IS the content, and a
     * paused or slowed clock would show a wrong time. */
    const tick = () => {
      const reading = readIst(new Date());
      setClock(reading.clock);
      setIsOpen(reading.isOpen);
    };
    tick();
    const id = window.setInterval(tick, CLOCK_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const dot = dotRef.current;
      if (!dot) return;

      /* One bounded yoyo cycle (2 x 2.4s = 4.8s), settling back at the rest
       * state: stays under the 5s automatic-motion threshold of WCAG 2.2.2
       * without needing a pause control. */
      const pulse = () => {
        gsap.fromTo(
          dot,
          { scale: 1, opacity: 1 },
          {
            scale: DOT_PULSE_SCALE,
            opacity: DOT_PULSE_OPACITY,
            duration: DOT_PULSE_S,
            ease: EASE.soft,
            yoyo: true,
            repeat: 1,
          },
        );
      };

      const mm = gsap.matchMedia();
      mm.add(MEDIA.full, pulse);
      mm.add(MEDIA.lite, pulse);
      /* Reduce: the dot stays static. */
    },
    { scope: dotRef },
  );

  const status =
    isOpen === null ? STATUS_PLACEHOLDER : isOpen ? OPEN_STATUS : CLOSED_STATUS;

  return (
    <ul className="mt-5 space-y-3">
      <li className="eyebrow mono-nums">{clock}</li>
      <li className="flex items-center gap-2">
        <span
          ref={dotRef}
          aria-hidden="true"
          className="h-[7px] w-[7px] shrink-0 rounded-full bg-steel"
        />
        <span className="eyebrow text-muted">{status}</span>
      </li>
      {telemetry.map((line) => (
        <li key={line} className="eyebrow text-muted">
          {line}
        </li>
      ))}
    </ul>
  );
}
