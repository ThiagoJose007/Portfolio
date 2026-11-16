"use client";

import { LOCALE_COOKIE, LOCALES, type Locale } from "@/lib/i18n/config";

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

// Seletor EN | PT. Grava a escolha num cookie (lido pelo proxy) e recarrega
// a página no novo idioma, no mesmo endereço. Recarrega por inteiro (e não só
// os dados) porque as animações de texto guardam o texto antigo.
export function LocaleSwitch({
  locale,
  label,
  className = "",
  tone = "dark",
}: {
  locale: Locale;
  label: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const choose = (next: Locale) => {
    if (next === locale) return;
    persistLocale(next);
    window.location.reload();
  };
  const active = tone === "dark" ? "bg-cream text-ink" : "bg-ink text-cream";
  const idle = tone === "dark" ? "text-cream/70 hover:text-cream" : "text-ink/60 hover:text-ink";

  return (
    <div role="group" aria-label={label} className={`flex items-center rounded-full p-0.5 font-mono text-[11px] ${className}`}>
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === locale}
          onClick={() => choose(option)}
          className={`rounded-full px-2.5 py-1.5 uppercase tracking-[0.12em] transition-colors ${option === locale ? active : idle}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
