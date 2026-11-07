type ProjectFormValues = {
  title?: string;
  summary?: string;
  description?: string;
  coverImage?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  visible?: boolean;
  tags?: unknown;
};

export function ProjectForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: ProjectFormValues;
  submitLabel: string;
}) {
  const tags = Array.isArray(defaultValues?.tags)
    ? (defaultValues!.tags as string[]).join(", ")
    : "";

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Título
        <input
          name="title"
          defaultValue={defaultValues?.title}
          required
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Resumo (aparece na listagem)
        <input
          name="summary"
          defaultValue={defaultValues?.summary}
          required
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Descrição completa
        <textarea
          name="description"
          defaultValue={defaultValues?.description}
          required
          rows={6}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Imagem de capa (URL)
        <input
          name="coverImage"
          defaultValue={defaultValues?.coverImage ?? ""}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Repositório (URL)
        <input
          name="repoUrl"
          defaultValue={defaultValues?.repoUrl ?? ""}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Link ao vivo (URL)
        <input
          name="liveUrl"
          defaultValue={defaultValues?.liveUrl ?? ""}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Tags (separadas por vírgula)
        <input
          name="tags"
          defaultValue={tags}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={defaultValues?.visible ?? true}
        />
        Visível no site fixo
      </label>

      <button
        type="submit"
        className="mt-2 rounded bg-black px-4 py-2 text-sm text-white"
      >
        {submitLabel}
      </button>
    </form>
  );
}
