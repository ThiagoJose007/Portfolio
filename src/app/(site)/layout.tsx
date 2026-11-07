import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/load";
import { SiteContentProvider } from "@/components/site/content-context";
import { Cursor } from "@/components/site/cursor";
import { MenuDock } from "@/components/site/menu/menu-dock";
import { ParticleScene } from "@/components/site/scene/particle-scene";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { PageTransition } from "@/components/site/transition/page-transition";

// Todo o conteúdo vem do banco (editável no /admin): sempre renderiza na hora.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteContent();
  return {
    title: {
      default: `${profile.name} — ${profile.role}`,
      template: `%s — ${profile.name}`,
    },
    description: `Portfolio de ${profile.name}, ${profile.role}.`,
  };
}

// Layout do site público. Elementos fixos (cena 3D, header, menu, overlay)
// ficam fora do #smooth-content: o ScrollSmoother aplica transform no
// conteúdo, o que quebraria `position: fixed` lá dentro.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();

  return (
    <SiteContentProvider content={content}>
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
    </SiteContentProvider>
  );
}
