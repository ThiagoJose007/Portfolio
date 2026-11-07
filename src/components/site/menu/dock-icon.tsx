import type { NavItem } from "@/content/site";

// Ícones em gradiente, inspirados nos ícones 3D do demo macOS dock.
const shapes: Record<NavItem["icon"], React.ReactNode> = {
  spark: <path d="M32 6c2 14 6 22 26 26-20 4-24 12-26 26-2-14-6-22-26-26 20-4 24-12 26-26Z" />,
  flower: (
    <path d="M32 30c-6-14-22-14-22-2 0 10 14 8 22 4-8 4-22 6-18 16 4 8 16 2 18-14 2 16 14 22 18 14 4-10-10-12-18-16 8 4 22 6 22-4 0-12-16-12-22 2Z" />
  ),
  diamond: <path d="M32 6 58 32 32 58 6 32Z" />,
  bubble: (
    <path d="M12 14h40a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H30l-12 10v-10h-6a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6Z" />
  ),
  ring: (
    <path
      fillRule="evenodd"
      d="M32 6a26 26 0 1 1 0 52 26 26 0 0 1 0-52Zm0 14a12 12 0 1 0 0 24 12 12 0 0 0 0-24Z"
    />
  ),
};

const gradients: Record<NavItem["icon"], [string, string]> = {
  spark: ["#ffb36b", "#ff5f2e"],
  flower: ["#c9a7ff", "#6b5bff"],
  diamond: ["#ffd0a8", "#ff6aa2"],
  bubble: ["#9ff5c8", "#1fbf74"],
  ring: ["#8fb4ff", "#2f5bff"],
};

export function DockIcon({ name }: { name: NavItem["icon"] }) {
  const [from, to] = gradients[name];
  const id = `dock-gradient-${name}`;
  return (
    <svg viewBox="0 0 64 64" className="size-full drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>{shapes[name]}</g>
    </svg>
  );
}
