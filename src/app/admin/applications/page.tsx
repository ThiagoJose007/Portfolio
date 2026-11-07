import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  VIEWED: "Visualizado",
  ARCHIVED: "Arquivado",
};

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Candidaturas</h1>
        <Link
          href="/admin/applications/new"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Nova candidatura
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 rounded border border-gray-200">
        {applications.map((application) => (
          <li key={application.id} className="p-4">
            <Link
              href={`/admin/applications/${application.id}`}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {application.companyName} — {application.roleTitle}
                </p>
                <p className="text-xs text-gray-400">/p/{application.slug}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{application._count.projects} projeto(s)</span>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs">
                  {statusLabel[application.status] ?? application.status}
                </span>
              </div>
            </Link>
          </li>
        ))}

        {applications.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">
            Nenhuma candidatura cadastrada ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
