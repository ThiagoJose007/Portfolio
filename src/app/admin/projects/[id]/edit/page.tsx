import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProject } from "../../actions";
import { ProjectForm } from "../../project-form";
import { PT_SUFFIX } from "../../../_components/field-defs";
import { getTranslations } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, project.id);
  const values: Record<string, unknown> = { ...project };
  for (const [field, value] of Object.entries(await getTranslations("project", project.id))) {
    values[field + PT_SUFFIX] = value;
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Editar projeto</h1>
      <ProjectForm
        action={updateProjectWithId}
        defaultValues={values}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
