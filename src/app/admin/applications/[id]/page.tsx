import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateApplication,
  deleteApplication,
  addProjectToApplication,
  removeProjectFromApplication,
  updateApplicationProject,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      projects: {
        include: { project: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const linkedProjectIds = new Set(application.projects.map((p) => p.projectId));

  const availableProjects = await prisma.project.findMany({
    where: { id: { notIn: [...linkedProjectIds] } },
    orderBy: { title: "asc" },
  });

  const updateApplicationWithId = updateApplication.bind(null, application.id);
  const addProjectWithId = addProjectToApplication.bind(null, application.id);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {application.companyName} — {application.roleTitle}
        </h1>
        <form action={deleteApplication}>
          <input type="hidden" name="applicationId" value={application.id} />
          <button type="submit" className="text-sm text-red-600">
            Excluir candidatura
          </button>
        </form>
      </div>

      <p className="mb-6 rounded bg-gray-50 p-3 text-sm text-gray-600">
        Link público: <code>/p/{application.slug}</code>
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-medium">Dados da candidatura</h2>
        <form action={updateApplicationWithId} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Empresa
            <input
              name="companyName"
              defaultValue={application.companyName}
              required
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Vaga
            <input
              name="roleTitle"
              defaultValue={application.roleTitle}
              required
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Texto de introdução
            <textarea
              name="introText"
              defaultValue={application.introText}
              required
              rows={4}
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Texto de chamada
            <input
              name="ctaText"
              defaultValue={application.ctaText ?? ""}
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Status
            <select
              name="status"
              defaultValue={application.status}
              className="rounded border border-gray-300 px-3 py-2"
            >
              <option value="DRAFT">Rascunho</option>
              <option value="SENT">Enviado</option>
              <option value="VIEWED">Visualizado</option>
              <option value="ARCHIVED">Arquivado</option>
            </select>
          </label>

          <button
            type="submit"
            className="mt-2 rounded bg-black px-4 py-2 text-sm text-white"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-medium">Projetos vinculados</h2>
        <ul className="flex flex-col gap-4">
          {application.projects.map((applicationProject) => (
            <li
              key={applicationProject.id}
              className="rounded border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{applicationProject.project.title}</p>
                <form action={removeProjectFromApplication}>
                  <input
                    type="hidden"
                    name="applicationProjectId"
                    value={applicationProject.id}
                  />
                  <input
                    type="hidden"
                    name="applicationId"
                    value={application.id}
                  />
                  <button type="submit" className="text-sm text-red-600">
                    Remover
                  </button>
                </form>
              </div>

              <form action={updateApplicationProject} className="flex flex-col gap-3">
                <input
                  type="hidden"
                  name="applicationProjectId"
                  value={applicationProject.id}
                />
                <input type="hidden" name="applicationId" value={application.id} />

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    Ordem
                    <input
                      type="number"
                      name="order"
                      defaultValue={applicationProject.order}
                      className="w-16 rounded border border-gray-300 px-2 py-1"
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="highlighted"
                      defaultChecked={applicationProject.highlighted}
                    />
                    Destaque
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-sm">
                  Descrição personalizada para esta vaga (opcional)
                  <textarea
                    name="customDescription"
                    defaultValue={applicationProject.customDescription ?? ""}
                    rows={2}
                    className="rounded border border-gray-300 px-3 py-2"
                  />
                </label>

                <button
                  type="submit"
                  className="self-start rounded bg-gray-100 px-3 py-1 text-sm"
                >
                  Salvar
                </button>
              </form>
            </li>
          ))}

          {application.projects.length === 0 && (
            <li className="text-sm text-gray-500">
              Nenhum projeto vinculado ainda.
            </li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Adicionar projeto</h2>
        <ul className="flex flex-col gap-2">
          {availableProjects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between rounded border border-gray-200 p-3"
            >
              <span>{project.title}</span>
              <form action={addProjectWithId}>
                <input type="hidden" name="projectId" value={project.id} />
                <button type="submit" className="text-sm text-blue-600">
                  Adicionar
                </button>
              </form>
            </li>
          ))}

          {availableProjects.length === 0 && (
            <li className="text-sm text-gray-500">
              Todos os projetos já estão vinculados a esta candidatura.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
