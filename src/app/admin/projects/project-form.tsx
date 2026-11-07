import { Field, SubmitButton } from "../_components/fields";
import { PROJECT_SECTIONS } from "./fields";

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

  return (
    <form action={action} className="flex flex-col gap-10">
      {PROJECT_SECTIONS.map((section) => (
        <fieldset key={section.title} className="flex flex-col gap-4">
          <legend className="mb-1 text-lg font-medium">{section.title}</legend>
          {section.description && <p className="-mt-2 text-sm text-gray-500">{section.description}</p>}
          {section.fields.map((field) => (
            <Field key={field.name} field={field} value={values[field.name]} />
          ))}
        </fieldset>
      ))}
      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
