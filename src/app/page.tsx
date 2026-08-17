import { Preloader } from "@/components/preloader/Preloader";
import { Nav } from "@/components/nav/Nav";
import { HeroSection } from "@/components/hero/HeroSection";
import { TickerMarquee } from "@/components/fx/TickerMarquee";
import { SITE } from "@/content/site";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="main-content">
        <HeroSection data={SITE.hero} />
        <TickerMarquee data={SITE.ticker} />
      </main>
    </>
  );
}
