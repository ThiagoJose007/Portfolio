import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProject, toggleProjectVisibility } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projetos</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Novo projeto
        </Link>
      </div>

      <ul className="divide-y divide-gray-200 rounded border border-gray-200">
        {projects.map((project) => (
          <li key={project.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-gray-500">{project.summary}</p>
              <p className="text-xs text-gray-400">/{project.slug}</p>
            </div>

            <div className="flex items-center gap-3">
              <form action={toggleProjectVisibility}>
                <input type="hidden" name="projectId" value={project.id} />
                <input
                  type="hidden"
                  name="nextVisible"
                  value={(!project.visible).toString()}
                />
                <button
                  type="submit"
                  className={`rounded px-3 py-1 text-xs ${
                    project.visible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {project.visible ? "Visível" : "Oculto"}
                </button>
              </form>

              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="text-sm text-blue-600"
              >
                Editar
              </Link>

              <form action={deleteProject}>
                <input type="hidden" name="projectId" value={project.id} />
                <button type="submit" className="text-sm text-red-600">
                  Excluir
                </button>
              </form>
            </div>
          </li>
        ))}

        {projects.length === 0 && (
          <li className="p-6 text-center text-sm text-gray-500">
            Nenhum projeto cadastrado ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
