import { SITE } from "@/content/site";
import { Decode } from "@/components/fx/Decode";
import { FooterMotion } from "@/components/sections/footer/FooterMotion";
import { DeskClock } from "@/components/sections/footer/DeskClock";
import { FooterMailto } from "@/components/sections/footer/FooterMailto";

/*
 * Site footer, the closing instrument panel. Server component: per the
 * content contract, the footer alone may read the content module directly;
 * the client islands (FooterMotion, DeskClock, FooterMailto) receive typed
 * slices as props. FooterMotion runs the entrance: the [data-footer-line]
 * top hairline draws across while [data-footer-rise] blocks rise in
 * sequence. DeskClock keeps the DESK STATUS column live; FooterMailto
 * decodes the giant address at the page floor.
 */

const CHANNELS_LABEL = "CHANNELS";
const INDEX_LABEL = "INDEX";
const DESK_STATUS_LABEL = "DESK STATUS";
/* Page-floor elements never cross Decode's default "top 88%". */
const FLOOR_DECODE_START = "top bottom";

const LINK_CLASSES =
  "mono-nums text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg";

export function Footer() {
  const indexAnchors = SITE.footer.index;

  return (
    <footer className="relative px-6 py-16 md:px-12 lg:px-20">
      <FooterMotion>
        {/* Animated top hairline: replaces the static hairline-t border so
            the rule can draw in (scaleX 1 is the server-rendered final
            state; only full/lite tiers ever set it to 0). */}
        <span
          aria-hidden="true"
          data-footer-line
          className="absolute inset-x-0 top-0 block h-px bg-line"
        />

        <div data-footer-rise>
          <FooterMailto email={SITE.contact.email} />
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          <nav aria-label="Contact channels" data-footer-rise>
            <p className="eyebrow text-muted">{CHANNELS_LABEL}</p>
            <ul className="mt-5 space-y-3">
              {SITE.footer.channels.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    data-cursor="link"
                    {...(channel.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={LINK_CLASSES}
                  >
                    {channel.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Section index" data-footer-rise>
            <p className="eyebrow text-muted">{INDEX_LABEL}</p>
            <ul className="mt-5 space-y-3">
              {indexAnchors.map((anchor) => (
                <li key={anchor.href}>
                  <a
                    href={anchor.href}
                    data-cursor="link"
                    className={LINK_CLASSES}
                  >
                    {anchor.num} {anchor.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-footer-rise>
            <p className="eyebrow text-muted">{DESK_STATUS_LABEL}</p>
            <DeskClock telemetry={SITE.footer.telemetry} />
          </div>
        </div>

        <div
          data-footer-rise
          className="hairline-t mt-16 flex flex-wrap items-center justify-between gap-4 pt-6"
        >
          <p className="eyebrow text-muted">{SITE.footer.copyright}</p>
          <p className="eyebrow text-muted">{SITE.footer.builtBy}</p>
          <Decode as="p" start={FLOOR_DECODE_START} className="eyebrow text-steel">
            {SITE.footer.signoff}
          </Decode>
        </div>
      </FooterMotion>
    </footer>
  );
}
