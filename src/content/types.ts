/* Typed content model. All site copy lives in content/site.ts against these
 * shapes; section components receive slices as props and never hardcode copy. */

export interface Cta {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface NavAnchor {
  readonly num: string;
  readonly label: string;
  readonly href: string;
}

export interface HeroContent {
  readonly eyebrow: string;
  readonly headlineLines: readonly string[];
  readonly sub: string;
  readonly ctas: readonly Cta[];
  readonly audioHint: string;
  readonly posterAlt: string;
}

export type TickerTone = "default" | "accent" | "amber";

export interface TickerItem {
  readonly text: string;
  readonly tone?: TickerTone;
}

export interface TickerContent {
  readonly caption: string;
  readonly items: readonly TickerItem[];
}

export interface SectionId {
  readonly num: string;
  readonly eyebrow: string;
  readonly heading: string;
  readonly anchor: string;
}

export interface PositionContent extends SectionId {
  readonly lead: string;
  readonly paragraphs: readonly string[];
}

export interface Metric {
  readonly label: string;
  readonly value: number;
  readonly decimals?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly note?: string;
}

export interface DeskPanel {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly microcopy: string;
  readonly body: string;
  readonly chips?: readonly string[];
  readonly metrics?: readonly Metric[];
  readonly diagram?: readonly string[];
  readonly amberDelta?: string;
  readonly status: string;
}

export interface EquityCurve {
  readonly points: readonly number[];
  readonly startLabel: string;
  readonly endLabel: string;
  readonly description: string;
}

export interface DeskContent extends SectionId {
  readonly introLine: string;
  readonly contextLine: string;
  readonly panels: readonly DeskPanel[];
  readonly curve: EquityCurve;
}

export interface RecordRole {
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly line: string;
  readonly bullets: readonly string[];
  readonly link?: Cta;
  readonly crossRef?: string;
}

export interface PhotoBand {
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
}

export interface RecordContent extends SectionId {
  readonly roles: readonly RecordRole[];
  readonly photoBand: PhotoBand;
}

export interface Platform {
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly url: string;
  readonly image: string;
  readonly status: string;
}

export interface ArchiveItem {
  readonly title: string;
  readonly meta: string;
  readonly url?: string;
  readonly image: string;
}

export interface ProductionContent extends SectionId {
  readonly platforms: readonly Platform[];
  readonly archiveLabel: string;
  readonly archive: readonly ArchiveItem[];
}

export interface LoopDetent {
  readonly label: string;
  readonly description: string;
}

export interface SkillGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export interface LoopContent extends SectionId {
  readonly intro: string;
  readonly detents: readonly LoopDetent[];
  readonly skills: readonly SkillGroup[];
}

export interface EducationEntry {
  readonly institution: string;
  readonly credential: string;
  readonly detail: string;
  readonly period: string;
}

export interface Certification {
  readonly title: string;
  readonly issuer: string;
  readonly url: string;
  readonly image: string;
}

export interface FoundationsContent extends SectionId {
  readonly education: readonly EducationEntry[];
  readonly certifications: readonly Certification[];
}

export interface ContactContent extends SectionId {
  readonly lead: string;
  readonly email: string;
  readonly phone: string;
  readonly phoneDisplay: string;
  readonly ctaLabel: string;
  readonly form: {
    readonly nameLabel: string;
    readonly emailLabel: string;
    readonly messageLabel: string;
    readonly submitLabel: string;
    readonly submittingLabel: string;
    readonly successTitle: string;
    readonly successBody: string;
    readonly errorBody: string;
  };
}

export interface FooterContent {
  readonly channels: readonly Cta[];
  readonly telemetry: readonly string[];
  readonly signoff: string;
  readonly copyright: string;
}

export interface AudioTrack {
  readonly src: string;
  readonly title: string;
}

export interface SiteMeta {
  readonly siteName: string;
  readonly title: string;
  readonly description: string;
  readonly author: string;
  readonly location: string;
  readonly keywords: readonly string[];
}

export interface SiteContent {
  readonly meta: SiteMeta;
  readonly nav: {
    readonly ident: string;
    readonly anchors: readonly NavAnchor[];
  };
  readonly hero: HeroContent;
  readonly ticker: TickerContent;
  readonly position: PositionContent;
  readonly desk: DeskContent;
  readonly record: RecordContent;
  readonly production: ProductionContent;
  readonly loop: LoopContent;
  readonly foundations: FoundationsContent;
  readonly contact: ContactContent;
  readonly footer: FooterContent;
  readonly audio: readonly AudioTrack[];
  readonly socials: readonly Cta[];
  readonly resumeHref: string;
}
