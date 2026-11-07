"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { navigate } from "./navigation";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

// <Link> que passa pela animação de transição de página. `onNavigate` só
// dispara em navegações client-side (ignora Ctrl/Cmd + clique, downloads etc.).
export function TransitionLink({ href, onNavigate, ...props }: TransitionLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      {...props}
      onNavigate={(event) => {
        onNavigate?.(event);
        if (navigate(href)) event.preventDefault();
      }}
    />
  );
}
