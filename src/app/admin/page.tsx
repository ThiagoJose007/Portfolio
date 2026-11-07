import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { COLLECTIONS } from "./conteudo/collections";
import { importDefaultContent } from "./actions";

export const dynamic = "force-dynamic";

const cardClass = "block rounded border border-gray-200 p-4 hover:border-gray-400";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ importado?: string }> }) {
  const { importado } = await searchParams;
  const [profile, counts] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "main" } }),
    Promise.all(
      COLLECTIONS.map(async (collection) => {
        const rows = await collection.delegate().findMany({ where: collection.scope });
        return rows.length;
      }),
    ),
  ]);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Painel</h1>

      {importado && (
        <p className="mb-6 rounded bg-green-50 p-3 text-sm text-green-700">Importado: {importado}.</p>
      )}

      {!profile && (
        <div className="mb-8 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-medium">O site ainda está usando o conteúdo de fábrica (do código).</p>
          <p className="mt-1 text-gray-600">
            Importe esse conteúdo para o banco para começar a editar tudo por aqui. Nada que já esteja cadastrado é
            sobrescrito.
          </p>
          <form action={importDefaultContent} className="mt-3">
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
              Importar conteúdo atual
            </button>
          </form>
        </div>
      )}

      <h2 className="mb-3 text-lg font-medium">Geral</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/perfil" className={cardClass}>
          <p className="font-medium">Perfil</p>
          <p className="text-sm text-gray-500">Nome, cargo, contato, foto, CV, TL;DR e bio.</p>
        </Link>
        <Link href="/admin/textos" className={cardClass}>
          <p className="font-medium">Textos do site</p>
          <p className="text-sm text-gray-500">Títulos e frases de cada seção.</p>
        </Link>
        <Link href="/admin/projects" className={cardClass}>
          <p className="font-medium">Projetos</p>
          <p className="text-sm text-gray-500">Cards, estudos de caso e galerias.</p>
        </Link>
        <Link href="/admin/applications" className={cardClass}>
          <p className="font-medium">Candidaturas</p>
          <p className="text-sm text-gray-500">Versões do site por empresa.</p>
        </Link>
      </div>

      <h2 className="mb-3 text-lg font-medium">Conteúdo</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {COLLECTIONS.map((collection, i) => (
          <Link key={collection.key} href={`/admin/conteudo/${collection.key}`} className={cardClass}>
            <p className="flex justify-between font-medium">
              {collection.title}
              <span className="text-sm font-normal text-gray-400">{counts[i]}</span>
            </p>
            <p className="text-sm text-gray-500">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
