import Link from "next/link";
import { notFound } from "next/navigation";
import { Field, SubmitButton } from "../../../_components/fields";
import { getCollection, listPathOf, type Row } from "../../collections";
import { saveCollectionItem } from "../../actions";
import { PT_SUFFIX } from "../../../_components/field-defs";
import { getTranslations } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

// Atende tanto /admin/conteudo/[coleção]/novo quanto /admin/conteudo/[coleção]/[id].
export default async function CollectionItemPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const { collection: key, id } = await params;
  const collection = getCollection(key);
  if (!collection) notFound();

  const isNew = id === "novo";
  let row: Row | null = null;
  if (!isNew) {
    row = await collection.delegate().findUnique({ where: { id } });
    if (!row) notFound();
  }

  const save = saveCollectionItem.bind(null, key, row?.id ?? null);
  // Valores em inglês (a linha) + português ("<campo>__pt").
  const values: Record<string, unknown> = { ...row };
  if (row) {
    for (const [field, value] of Object.entries(await getTranslations(collection.entity, row.id))) {
      values[field + PT_SUFFIX] = value;
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href={listPathOf(collection)} className="text-sm text-gray-500 hover:underline">
        ← {collection.title}
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-semibold">
        {isNew ? `Adicionar ${collection.singular}` : `Editar ${collection.singular}`}
      </h1>
      <form action={save} className="flex flex-col gap-4">
        {collection.fields.map((field) => (
          <Field key={field.name} field={field} values={values} />
        ))}
        <SubmitButton>{isNew ? "Adicionar" : "Salvar alterações"}</SubmitButton>
      </form>
    </div>
  );
}
