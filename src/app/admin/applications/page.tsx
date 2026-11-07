import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createDefaultVersion } from "./actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  VIEWED: "Visualizado",
  ARCHIVED: "Arquivado",
};

const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Maceio" });

export default async function ApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { projects: true, experiences: true } } },
  });
  const hasDefault = applications.some((application) => application.isDefault);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Candidaturas</h1>
        <Link href="/admin/applications/new" className="rounded bg-black px-4 py-2 text-sm text-white">
          Nova candidatura
        </Link>
      </div>

      {!hasDefault && (
        <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium">A versão geral (o que aparece em &quot;/&quot;) ainda não foi configurada.</p>
          <p className="mt-1 text-gray-600">
            Por enquanto ela mostra todos os projetos e experiências visíveis. Configure para escolher quais aparecem e
            em que ordem.
          </p>
          <form action={createDefaultVersion} className="mt-3">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Configurar versão geral
            </button>
          </form>
        </div>
      )}

      <ul className="divide-y divide-gray-200 rounded border border-gray-200">
        {applications.map((application) => (
          <li key={application.id} className="p-4">
            <Link href={`/admin/applications/${application.id}`} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">
                  {application.isDefault ? (
                    <>
                      Versão geral <span className="ml-1 rounded bg-black px-2 py-0.5 text-xs text-white">pública</span>
                    </>
                  ) : (
                    `${application.companyName} — ${application.roleTitle}`
                  )}
                </p>
                <p className="text-xs text-gray-400">{application.isDefault ? "/" : `/${application.slug}`}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                  {application._count.projects || "todos os"} projeto(s) · {application._count.experiences || "todas as"}{" "}
                  experiência(s)
                </span>
                {!application.isDefault && (
                  <>
                    <span title={application.lastViewedAt ? `Última: ${date.format(application.lastViewedAt)}` : ""}>
                      {application.viewCount} visita(s)
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs">
                      {statusLabel[application.status] ?? application.status}
                    </span>
                  </>
                )}
              </div>
            </Link>
          </li>
        ))}

        {applications.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">Nenhuma candidatura cadastrada ainda.</li>
        )}
      </ul>
    </div>
  );
}
