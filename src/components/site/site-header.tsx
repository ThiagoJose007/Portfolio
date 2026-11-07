"use client";

import { useSyncExternalStore } from "react";
import { useSiteContent } from "./content-context";
import { TransitionLink } from "./transition/transition-link";
import { useSitePaths } from "./version-path";

const subscribeClock = (onChange: () => void) => {
  const id = setInterval(onChange, 30_000);
  return () => clearInterval(id);
};

// Hora local (no servidor fica vazio para não divergir na hidratação).
function useLocalTime(timeZone: string) {
  return useSyncExternalStore(
    subscribeClock,
    () =>
      new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone }).format(
        new Date(),
      ),
    () => "",
  );
}

export function SiteHeader() {
  const { profile } = useSiteContent();
  const { home } = useSitePaths();
  const time = useLocalTime(profile.timeZone);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-5 py-5 text-cream mix-blend-difference md:px-8 md:py-6">
      <TransitionLink
        href={home}
        className="pointer-events-auto flex items-center gap-3"
        aria-label={`${profile.name} — início`}
      >
        <span className="grid size-10 place-items-center rounded-full border border-current font-mono text-xs tracking-wider">
          {profile.initials}
        </span>
        <span className="hidden text-sm leading-tight sm:block">
          {profile.name}
          <br />
          <span className="text-muted">{profile.role}</span>
        </span>
      </TransitionLink>

      {/* No desktop esse canto é da navegação (ver MenuDock). */}
      <div className="hidden text-right font-mono text-[11px] uppercase leading-5 tracking-widest sm:block md:hidden">
        <p className="flex items-center justify-end gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {profile.availability}
        </p>
        <p className="text-muted">
          {profile.location} {time && `· ${time}`}
        </p>
      </div>
    </header>
  );
}
