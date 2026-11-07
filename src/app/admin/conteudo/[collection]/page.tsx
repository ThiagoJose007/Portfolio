import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "../collections";
import { deleteCollectionItem, moveCollectionItem } from "../actions";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: key } = await params;
  const collection = getCollection(key);
  if (!collection) notFound();

  const rows = await collection
    .delegate()
    .findMany({ where: collection.scope, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const move = moveCollectionItem.bind(null, key);
  const remove = deleteCollectionItem.bind(null, key);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        ← Painel
      </Link>
      <div className="mb-2 mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{collection.title}</h1>
        <Link href={`/admin/conteudo/${key}/novo`} className="rounded bg-black px-4 py-2 text-sm text-white">
          Adicionar {collection.singular}
        </Link>
      </div>
      <p className="mb-6 text-sm text-gray-500">{collection.description}</p>

      <ul className="divide-y divide-gray-200 rounded border border-gray-200">
        {rows.map((row, i) => {
          const { title, subtitle, hidden } = collection.summary(row);
          return (
            <li key={row.id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col text-xs">
                <form action={move}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="-1" />
                  <button type="submit" disabled={i === 0} className="px-1 disabled:opacity-20" aria-label="Subir">
                    ▲
                  </button>
                </form>
                <form action={move}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="1" />
                  <button
                    type="submit"
                    disabled={i === rows.length - 1}
                    className="px-1 disabled:opacity-20"
                    aria-label="Descer"
                  >
                    ▼
                  </button>
                </form>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {title}
                  {hidden && <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Oculto</span>}
                </p>
                {subtitle && <p className="truncate text-sm text-gray-500">{subtitle}</p>}
              </div>
              <Link href={`/admin/conteudo/${key}/${row.id}`} className="text-sm text-blue-600">
                Editar
              </Link>
              <form action={remove}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className="text-sm text-red-600">
                  Excluir
                </button>
              </form>
            </li>
          );
        })}
        {rows.length === 0 && <li className="p-6 text-center text-sm text-gray-500">Nada cadastrado ainda.</li>}
      </ul>
    </div>
  );
}
