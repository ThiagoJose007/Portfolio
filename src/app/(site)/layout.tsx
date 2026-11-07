import { Cursor } from "@/components/site/cursor";
import { MenuDock } from "@/components/site/menu/menu-dock";
import { ParticleScene } from "@/components/site/scene/particle-scene";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { PageTransition } from "@/components/site/transition/page-transition";

// Layout do site público. Elementos fixos (cena 3D, header, menu, overlay)
// ficam fora do #smooth-content: o ScrollSmoother aplica transform no
// conteúdo, o que quebraria `position: fixed` lá dentro.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root">
      <ParticleScene />
      <SmoothScroll>
        <main>{children}</main>
      </SmoothScroll>
      <SiteHeader />
      <ScrollProgress />
      <MenuDock />
      <Cursor />
      <PageTransition />
    </div>
  );
}
