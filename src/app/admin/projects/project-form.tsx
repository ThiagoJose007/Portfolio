import { Field, SubmitButton } from "../_components/fields";
import { PASSWORD_FIELDS, PROJECT_SECTIONS } from "./fields";

export function ProjectForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: Record<string, unknown>;
  submitLabel: string;
}) {
  const values: Record<string, unknown> = { ...defaultValues };
  if (Array.isArray(values.tags)) values.tags = values.tags.join(", ");
  const hasPassword = !!values.password;
  // O hash nunca vai para o formulário.
  delete values.password;
  values.newPassword = "";
  values.removePassword = false;

  return (
    <form action={action} className="flex flex-col gap-10">
      {PROJECT_SECTIONS.map((section) => (
        <fieldset key={section.title} className="flex flex-col gap-4">
          <legend className="mb-1 text-lg font-medium">{section.title}</legend>
          {section.description && <p className="-mt-2 text-sm text-gray-500">{section.description}</p>}
          {section.fields.map((field) => (
            <Field key={field.name} field={field} values={values} />
          ))}
        </fieldset>
      ))}
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-lg font-medium">Acesso</legend>
        <p className="-mt-2 text-sm text-gray-500">
          {hasPassword
            ? "🔒 Este estudo de caso tem senha."
            : "Aberto: qualquer visitante vê o estudo de caso completo."}{" "}
          Use senha para projetos de cliente que não podem ficar públicos.
        </p>
        {PASSWORD_FIELDS.filter((field) => hasPassword || field.name !== "removePassword").map((field) => (
          <Field key={field.name} field={field} values={values} />
        ))}
      </fieldset>
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
