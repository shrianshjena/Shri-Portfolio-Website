import { SITE } from "@/content/site";

/*
 * Site footer. Server component: per the content contract, the footer alone
 * may read the content module directly. Full-bleed hairline top, giant
 * mailto, then channels / index / telemetry columns and the copyright row.
 */

const CHANNELS_LABEL = "CHANNELS";
const INDEX_LABEL = "INDEX";
const TELEMETRY_LABEL = "TELEMETRY";
const HERO_ANCHOR = { num: "01", label: "HERO", href: "#hero" } as const;

const LINK_CLASSES =
  "mono-nums text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg";

export function Footer() {
  const indexAnchors = [HERO_ANCHOR, ...SITE.nav.anchors];

  return (
    <footer className="hairline-t px-6 py-16 md:px-12 lg:px-20">
      <a
        href={`mailto:${SITE.contact.email}`}
        data-cursor="link"
        className="mono-nums inline-block break-all text-[clamp(1.6rem,5vw,4.5rem)] lowercase text-fg transition-colors hover:text-steel"
      >
        {SITE.contact.email}
      </a>

      <div className="mt-14 grid gap-10 sm:grid-cols-3">
        <nav aria-label="Contact channels">
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

        <nav aria-label="Section index">
          <p className="eyebrow text-muted">{INDEX_LABEL}</p>
          <ul className="mt-5 space-y-3">
            {indexAnchors.map((anchor) => (
              <li key={anchor.href}>
                <a href={anchor.href} data-cursor="link" className={LINK_CLASSES}>
                  {anchor.num} {anchor.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-muted">{TELEMETRY_LABEL}</p>
          <ul className="mt-5 space-y-3">
            {SITE.footer.telemetry.map((line) => (
              <li key={line} className="eyebrow text-muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline-t mt-16 flex flex-wrap justify-between gap-4 pt-6">
        <p className="eyebrow text-muted">{SITE.footer.copyright}</p>
        <p className="eyebrow text-steel">{SITE.footer.signoff}</p>
      </div>
    </footer>
  );
}
