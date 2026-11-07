import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const links = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/perfil", label: "Perfil" },
  { href: "/admin/textos", label: "Textos" },
  { href: "/admin/projects", label: "Projetos" },
  { href: "/admin/applications", label: "Candidaturas" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full bg-white text-gray-900">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-6 px-8 py-4 text-sm">
          <span className="font-semibold">Admin</span>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
          <Link href="/" className="ml-auto text-gray-500 hover:underline">
            Ver site ↗
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
