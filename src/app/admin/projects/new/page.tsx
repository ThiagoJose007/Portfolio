import { createProject } from "../actions";
import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo projeto</h1>
      <ProjectForm action={createProject} submitLabel="Criar projeto" />
    </div>
  );
}
