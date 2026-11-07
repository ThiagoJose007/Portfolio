import Link from "next/link";
import { notFound } from "next/navigation";
import { Field, SubmitButton } from "../../../_components/fields";
import { getCollection, type Row } from "../../collections";
import { saveCollectionItem } from "../../actions";

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

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link href={`/admin/conteudo/${key}`} className="text-sm text-gray-500 hover:underline">
        ← {collection.title}
      </Link>
      <h1 className="mb-6 mt-3 text-2xl font-semibold">
        {isNew ? `Adicionar ${collection.singular}` : `Editar ${collection.singular}`}
      </h1>
      <form action={save} className="flex flex-col gap-4">
        {collection.fields.map((field) => (
          <Field key={field.name} field={field} value={row?.[field.name]} />
        ))}
        <SubmitButton>{isNew ? "Adicionar" : "Salvar alterações"}</SubmitButton>
      </form>
    </div>
  );
}
