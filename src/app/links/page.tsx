import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/content/load";
import { LinkIcon, resolveIcon } from "@/lib/link-icons";
import { TrackedLink } from "@/components/links/tracked-link";

// Página de links da bio (Instagram, LinkedIn, YouTube…) em bento grid.
// Leve de propósito: sem cena 3D nem transições — quem chega aqui geralmente
// está no celular. Tudo é editável em /admin/links.
export const dynamic = "force-dynamic";

async function loadSettings() {
  const row = await prisma.profile.findUnique({
    where: { id: "main" },
    select: { linksPhoto: true, linksBio: true, linksShowCv: true, linksShowPortfolio: true },
  });
  return row ?? { linksPhoto: null, linksBio: "", linksShowCv: true, linksShowPortfolio: true };
}

export async function generateMetadata(): Promise<Metadata> {
  const [{ profile }, settings, requestHeaders] = await Promise.all([getSiteContent(), loadSettings(), headers()]);
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const proto = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const photo = settings.linksPhoto || profile.photo;
  const description = settings.linksBio || `${profile.role} · ${profile.location}`;
  return {
    metadataBase: new URL(`${proto}://${host}`),
    title: { absolute: `${profile.name} — links` },
    description,
    openGraph: { title: profile.name, description, images: photo ? [photo] : undefined },
  };
}

const SIZE: Record<string, string> = {
  small: "col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  large: "col-span-2 row-span-2",
};

const ACCENT: Record<string, { card: string; icon: string; muted: string }> = {
  default: {
    card: "border-cream/10 bg-cream/[0.04] text-cream hover:border-cream/30 hover:bg-cream/[0.07]",
    icon: "bg-cream/10",
    muted: "text-cream/55",
  },
  accent: { card: "border-transparent bg-accent text-ink", icon: "bg-ink/10", muted: "text-ink/65" },
  light: { card: "border-transparent bg-cream text-ink", icon: "bg-ink/10", muted: "text-ink/60" },
  electric: { card: "border-transparent bg-electric text-cream", icon: "bg-cream/15", muted: "text-cream/70" },
};

// Texto pequeno no rodapé do card: domínio, e-mail ou "PDF".
function hint(url: string) {
  if (url.startsWith("mailto:")) return url.slice(7);
  if (url.startsWith("tel:")) return url.slice(4);
  if (/\.pdf($|\?)/i.test(url) || url.startsWith("/media/")) return "PDF";
  if (url.startsWith("/")) return "";
  const parsed = URL.parse(url);
  return parsed ? (parsed.host.replace(/^www\./, "") + parsed.pathname).replace(/\/$/, "") : url;
}

type Card = {
  key: string;
  id?: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  image: string | null;
  size: string;
  accent: string;
};

export default async function LinksPage() {
  const [{ profile }, settings, links] = await Promise.all([
    getSiteContent(),
    loadSettings(),
    prisma.linkItem.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
  ]);
  const photo = settings.linksPhoto || profile.photo;

  const cards: Card[] = links.map((link) => ({
    key: link.id,
    id: link.id,
    title: link.title,
    description: link.description,
    url: link.url,
    icon: resolveIcon(link.icon, link.url),
    image: link.image,
    size: link.size,
    accent: link.accent,
  }));
  if (settings.linksShowPortfolio) {
    cards.push({
      key: "portfolio",
      title: "Portfolio",
      description: "Projetos, experiência e contato",
      url: "/",
      icon: "briefcase",
      image: null,
      size: "wide",
      accent: "light",
    });
  }
  if (settings.linksShowCv && profile.cvUrl) {
    cards.push({
      key: "cv",
      title: "Currículo",
      description: "PDF · baixar",
      url: profile.cvUrl,
      icon: "file",
      image: null,
      size: "small",
      accent: "accent",
    });
  }

  return (
    <main className="links-root mx-auto min-h-svh max-w-5xl px-4 py-8 text-cream md:px-8 md:py-14">
      <div className="grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
        {/* Card do perfil: sempre o primeiro. */}
        <section
          className="bento-card col-span-2 row-span-2 flex flex-col justify-between rounded-[28px] border border-cream/10 bg-cream/[0.04] p-6 md:p-8"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <div className="flex items-start justify-between gap-4">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- foto enviada pelo admin
              <img src={photo} alt={`Foto de ${profile.name}`} className="size-20 rounded-full object-cover md:size-24" />
            ) : (
              <span className="grid size-20 place-items-center rounded-full border border-cream/30 font-mono text-lg md:size-24">
                {profile.initials}
              </span>
            )}
            <p className="flex items-center gap-2 rounded-full border border-cream/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/80">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span className="hidden sm:inline">{profile.availability}</span>
              <span className="sm:hidden">Disponível</span>
            </p>
          </div>
          <div>
            <h1 className="text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[0.95] tracking-[-0.035em]">
              {profile.name}
            </h1>
            <p className="mt-2 text-accent">{profile.role}</p>
            {settings.linksBio && <p className="mt-3 max-w-md text-sm text-cream/70 md:text-base">{settings.linksBio}</p>}
            <p className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              <LinkIcon name="pin" className="size-3.5" /> {profile.location}
            </p>
          </div>
        </section>

        {cards.map((card, i) => {
          const style = ACCENT[card.accent] ?? ACCENT.default;
          const big = card.size === "large" || card.size === "tall";
          return (
            <TrackedLink
              key={card.key}
              id={card.id}
              href={card.url}
              style={{ "--i": i + 1 } as React.CSSProperties}
              className={`bento-card group relative flex flex-col justify-between overflow-hidden rounded-[28px] border p-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent md:p-6 ${SIZE[card.size] ?? SIZE.small} ${card.image ? "border-transparent text-cream" : style.card}`}
            >
              {card.image && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo admin */}
                  <img
                    src={card.image}
                    alt=""
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/10" />
                </>
              )}
              <div className="relative flex items-start justify-between">
                <span
                  className={`grid size-10 place-items-center rounded-full md:size-11 ${card.image ? "bg-ink/50 backdrop-blur" : style.icon}`}
                >
                  <LinkIcon name={card.icon} className="size-5" />
                </span>
                <span
                  aria-hidden
                  className="text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  ↗
                </span>
              </div>
              <div className="relative min-w-0">
                <p className={`font-medium leading-tight tracking-tight ${big ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
                  {card.title}
                </p>
                {card.description && (
                  <p className={`mt-1 line-clamp-2 text-sm ${card.image ? "text-cream/75" : style.muted}`}>
                    {card.description}
                  </p>
                )}
                {card.size !== "small" && hint(card.url) && (
                  <p
                    className={`mt-2 truncate font-mono text-[10px] uppercase tracking-[0.14em] ${card.image ? "text-cream/60" : style.muted}`}
                  >
                    {hint(card.url)}
                  </p>
                )}
              </div>
            </TrackedLink>
          );
        })}
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        <Link href="/" className="text-cream underline-offset-4 hover:underline">
          Ver portfolio completo →
        </Link>
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
      </footer>
    </main>
  );
}
