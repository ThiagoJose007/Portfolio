"use client";

// Link de um card da página /links: abre normalmente e avisa o servidor do
// clique em segundo plano (sendBeacon não atrasa a navegação).
export function TrackedLink({
  id,
  href,
  className,
  style,
  children,
}: {
  id?: string;
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//i.test(href) || href.startsWith("/media/");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={className}
      style={style}
      onClick={() => {
        if (id) navigator.sendBeacon?.("/links/click", JSON.stringify({ id }));
      }}
    >
      {children}
    </a>
  );
}
