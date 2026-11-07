import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="border-b border-gray-200 bg-white text-gray-900">
        <div className="mx-auto flex max-w-4xl items-center gap-6 px-8 py-4 text-sm">
          <span className="font-semibold">Admin</span>
          <Link href="/admin/projects" className="hover:underline">
            Projetos
          </Link>
          <Link href="/admin/applications" className="hover:underline">
            Candidaturas
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
