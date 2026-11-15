import {
  siBehance,
  siBluesky,
  siBuymeacoffee,
  siCalendly,
  siDevdotto,
  siDiscord,
  siDribbble,
  siFigma,
  siGithub,
  siHashnode,
  siInstagram,
  siMedium,
  siNotion,
  siSpotify,
  siSubstack,
  siTelegram,
  siThreads,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from "simple-icons";

// Ícones dos cards da página /links. Marcas vêm do simple-icons (CC0, um
// path preenchido em 24×24); os demais são traços desenhados aqui, no mesmo
// grid. O LinkedIn não está no simple-icons, então também é desenhado aqui.

type IconDef =
  | { label: string; group: "Marcas"; kind: "brand"; path: string; color: string }
  | { label: string; group: "Marcas" | "Geral"; kind: "line"; paths: string[] };

const brand = (label: string, icon: { path: string; hex: string }): IconDef => ({
  label,
  group: "Marcas",
  kind: "brand",
  path: icon.path,
  color: `#${icon.hex}`,
});

export const LINK_ICONS: Record<string, IconDef> = {
  linkedin: {
    label: "LinkedIn",
    group: "Marcas",
    kind: "line",
    paths: ["M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z", "M8 10.5V16", "M8 7.5v.1", "M12 16v-5.5", "M12 13.2c0-1.7 1.1-2.7 2.4-2.7 1.4 0 2.2.9 2.2 2.7V16"],
  },
  github: brand("GitHub", siGithub),
  youtube: brand("YouTube", siYoutube),
  medium: brand("Medium", siMedium),
  substack: brand("Substack", siSubstack),
  behance: brand("Behance", siBehance),
  dribbble: brand("Dribbble", siDribbble),
  figma: brand("Figma", siFigma),
  instagram: brand("Instagram", siInstagram),
  x: brand("X (Twitter)", siX),
  threads: brand("Threads", siThreads),
  bluesky: brand("Bluesky", siBluesky),
  tiktok: brand("TikTok", siTiktok),
  whatsapp: brand("WhatsApp", siWhatsapp),
  telegram: brand("Telegram", siTelegram),
  discord: brand("Discord", siDiscord),
  spotify: brand("Spotify", siSpotify),
  notion: brand("Notion", siNotion),
  calendly: brand("Calendly", siCalendly),
  devto: brand("DEV.to", siDevdotto),
  hashnode: brand("Hashnode", siHashnode),
  buymeacoffee: brand("Buy Me a Coffee", siBuymeacoffee),

  link: { label: "Link", group: "Geral", kind: "line", paths: ["M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1", "M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"] },
  globe: { label: "Site", group: "Geral", kind: "line", paths: ["M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z", "M3 12h18", "M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z"] },
  briefcase: { label: "Portfolio", group: "Geral", kind: "line", paths: ["M3 8h18v12H3Z", "M9 8V5h6v3", "M3 13h18"] },
  file: { label: "Currículo / PDF", group: "Geral", kind: "line", paths: ["M6 3h8l4 4v14H6Z", "M14 3v4h4", "M9 12h6", "M9 16h6"] },
  download: { label: "Download", group: "Geral", kind: "line", paths: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"] },
  mail: { label: "E-mail", group: "Geral", kind: "line", paths: ["M4 6h16v12H4Z", "M4 7l8 6 8-6"] },
  phone: { label: "Telefone", group: "Geral", kind: "line", paths: ["M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z", "M11 18h2"] },
  calendar: { label: "Agenda", group: "Geral", kind: "line", paths: ["M4 6h16v14H4Z", "M4 10h16", "M8 3v4", "M16 3v4"] },
  article: { label: "Artigo", group: "Geral", kind: "line", paths: ["M4 20h4L19 9l-4-4L4 16Z", "M13 7l4 4"] },
  book: { label: "Livro / guia", group: "Geral", kind: "line", paths: ["M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Z", "M4 19V5", "M8 7h7"] },
  video: { label: "Vídeo", group: "Geral", kind: "line", paths: ["M3 6h18v12H3Z", "M10 9.5v5l4.5-2.5Z"] },
  mic: { label: "Podcast", group: "Geral", kind: "line", paths: ["M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Z", "M5 11a7 7 0 0 0 14 0", "M12 18v3"] },
  code: { label: "Código", group: "Geral", kind: "line", paths: ["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 4l-4 16"] },
  pin: { label: "Localização", group: "Geral", kind: "line", paths: ["M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z", "M12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5Z"] },
  star: { label: "Destaque", group: "Geral", kind: "line", paths: ["M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"] },
  arrow: { label: "Seta", group: "Geral", kind: "line", paths: ["M7 17L17 7", "M8 7h9v9"] },
};

export type LinkIconKey = keyof typeof LINK_ICONS;

// Ícone escolhido "Automático": descobre pelo endereço.
const HOSTS: [RegExp, string][] = [
  [/linkedin\.com/, "linkedin"],
  [/github\.com/, "github"],
  [/youtube\.com|youtu\.be/, "youtube"],
  [/medium\.com/, "medium"],
  [/substack\.com/, "substack"],
  [/behance\.net/, "behance"],
  [/dribbble\.com/, "dribbble"],
  [/figma\.com/, "figma"],
  [/instagram\.com/, "instagram"],
  [/(^|\.)x\.com|twitter\.com/, "x"],
  [/threads\.(net|com)/, "threads"],
  [/bsky\.app/, "bluesky"],
  [/tiktok\.com/, "tiktok"],
  [/wa\.me|whatsapp\.com/, "whatsapp"],
  [/t\.me|telegram\./, "telegram"],
  [/discord\.(gg|com)/, "discord"],
  [/spotify\.com/, "spotify"],
  [/notion\.(so|site)/, "notion"],
  [/calendly\.com/, "calendly"],
  [/dev\.to/, "devto"],
  [/hashnode\.(dev|com)/, "hashnode"],
  [/buymeacoffee\.com/, "buymeacoffee"],
];

export function resolveIcon(icon: string, url: string): string {
  if (icon && icon !== "auto" && LINK_ICONS[icon]) return icon;
  const value = url.trim().toLowerCase();
  if (value.startsWith("mailto:")) return "mail";
  if (value.startsWith("tel:")) return "phone";
  if (/\.pdf($|\?)/.test(value)) return "file";
  const host = URL.parse(value)?.host ?? "";
  return HOSTS.find(([pattern]) => pattern.test(host))?.[1] ?? "link";
}

export function LinkIcon({
  name,
  className = "size-5",
  brandColor = false,
}: {
  name: string;
  className?: string;
  // Usa a cor oficial da marca em vez da cor do texto.
  brandColor?: boolean;
}) {
  const icon = LINK_ICONS[name] ?? LINK_ICONS.link;
  if (icon.kind === "brand") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={className} fill={brandColor ? icon.color : "currentColor"}>
        <path d={icon.path} />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
