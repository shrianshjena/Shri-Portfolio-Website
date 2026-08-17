import { Preloader } from "@/components/preloader/Preloader";
import { Nav } from "@/components/nav/Nav";
import { HeroSection } from "@/components/hero/HeroSection";
import { TickerMarquee } from "@/components/fx/TickerMarquee";
import { PositionSection } from "@/components/sections/PositionSection";
import { DeskSection } from "@/components/sections/DeskSection";
import { RecordSection } from "@/components/sections/RecordSection";
import { ProductionSection } from "@/components/sections/ProductionSection";
import { LoopSection } from "@/components/sections/LoopSection";
import { FoundationsSection } from "@/components/sections/FoundationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { SITE } from "@/content/site";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="main-content">
        <HeroSection data={SITE.hero} />
        <TickerMarquee data={SITE.ticker} />
        <PositionSection data={SITE.position} />
        <DeskSection data={SITE.desk} />
        <RecordSection data={SITE.record} />
        <ProductionSection data={SITE.production} />
        <LoopSection data={SITE.loop} />
        <FoundationsSection data={SITE.foundations} />
        <ContactSection data={SITE.contact} />
      </main>
      <Footer />
    </>
  );
}
