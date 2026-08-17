"use client";

import { useState } from "react";
import { SITE } from "@/content/site";
import { AudioToggle } from "./AudioToggle";
import { MagneticButton } from "@/components/fx/MagneticButton";

/*
 * Fixed 56px bar: mono ident left, chapter anchors + audio module right.
 * Raw navy with a hairline border, no blur, no glass. Mobile gets a
 * full-screen overlay index at display scale.
 */
export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { ident, anchors } = SITE.nav;

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
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Chapter index"
          className="fixed inset-0 z-[85] flex flex-col justify-between bg-canvas px-6 py-8"
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow !text-[11px]">{ident}</span>
            <button
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
