"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/content/site";
import { AudioToggle } from "./AudioToggle";
import { MagneticButton } from "@/components/fx/MagneticButton";

/*
 * Fixed 56px bar: mono ident left, chapter anchors + audio module right.
 * Raw navy with a hairline border, no blur, no glass. Mobile gets a
 * full-screen overlay index with real dialog semantics: focus moves in,
 * Tab is trapped, Escape closes, scroll is locked, and focus returns to
 * the MENU button on close.
 */
export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { ident, anchors } = SITE.nav;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const dialog = dialogRef.current;
    closeButtonRef.current?.focus();
    document.documentElement.classList.add("overflow-hidden");

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("overflow-hidden");
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 top-0 z-[70] flex h-14 items-center justify-between border-b border-line bg-canvas px-6 md:px-12"
      >
        <a href="#hero" data-cursor="link" className="eyebrow !text-[11px] text-fg">
          {ident}
        </a>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 lg:flex">
            {anchors.map((anchor) => (
              <li key={anchor.href}>
                <a href={anchor.href} data-cursor="link" className="group">
                  <MagneticButton>
                    <span className="eyebrow !text-[10px] transition-colors duration-300 group-hover:text-fg">
                      <span className="text-muted">{anchor.num}</span> {anchor.label}
                    </span>
                  </MagneticButton>
                </a>
              </li>
            ))}
          </ul>

          <AudioToggle showTitle />

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            data-cursor="link"
            className="eyebrow !text-[11px] text-fg lg:hidden"
          >
            MENU
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Chapter index"
          className="fixed inset-0 z-[85] flex flex-col justify-between bg-canvas px-6 py-8"
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow !text-[11px]">{ident}</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              className="eyebrow !text-[11px] text-fg"
            >
              CLOSE
            </button>
          </div>

          <ul className="space-y-2">
            {anchors.map((anchor) => (
              <li key={anchor.href}>
                <a
                  href={anchor.href}
                  onClick={() => setMenuOpen(false)}
                  className="display-heading block text-fg"
                >
                  <span className="eyebrow mr-4 align-middle text-muted">{anchor.num}</span>
                  {anchor.label}
                </a>
              </li>
            ))}
          </ul>

          <p className="eyebrow !text-[10px] text-muted">{SITE.meta.location.toUpperCase()}</p>
        </div>
      ) : null}
    </>
  );
}
