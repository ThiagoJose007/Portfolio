import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LinkIcon, resolveIcon } from "@/lib/link-icons";
import { Field, SubmitButton } from "../_components/fields";
import { deleteCollectionItem, moveCollectionItem } from "../conteudo/actions";
import { createLinksFromProfile, resetLinkClicks, saveLinksSettings } from "./actions";
import { LINKS_SETTINGS_FIELDS } from "./fields";
import { PT_SUFFIX } from "../_components/field-defs";
import { getTranslations } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

const SIZE_LABEL: Record<string, string> = { small: "1×1", wide: "2×1", tall: "1×2", large: "2×2" };

export default async function AdminLinksPage({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const [profile, links] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "main" } }),
    prisma.linkItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
  ]);
  const settingValues: Record<string, unknown> = { ...profile };
  if (profile) {
    for (const [field, value] of Object.entries(await getTranslations("profile", "main"))) {
      settingValues[field + PT_SUFFIX] = value;
    }
  }
  const move = moveCollectionItem.bind(null, "links");
  const remove = deleteCollectionItem.bind(null, "links");
  const autoCards = profile
    ? [
        { id: "auto:portfolio", title: "Portfolio", icon: "briefcase", clicks: profile.linksPortfolioClicks, on: profile.linksShowPortfolio },
        { id: "auto:cv", title: "Currículo", icon: "file", clicks: profile.linksCvClicks, on: profile.linksShowCv && !!profile.cvUrl },
      ]
    : [];
  const totalClicks =
    links.reduce((sum, link) => sum + link.clicks, 0) + autoCards.reduce((sum, card) => sum + card.clicks, 0);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Links</h1>
        <a href="/links" target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">
          Ver página /links ↗
        </a>
      </div>
      <p className="mb-8 text-sm text-gray-500">
        A página para colocar na bio do Instagram, LinkedIn, YouTube… Cards em bento grid, na ordem desta lista.
      </p>

      {!profile && (
        <p className="mb-8 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          Primeiro importe o conteúdo em <Link href="/admin" className="underline">Painel</Link> (&quot;Importar conteúdo
          atual&quot;).
        </p>
      )}

      <section className="mb-12">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            Cards <span className="text-sm font-normal text-gray-400">· {totalClicks} clique(s) no total</span>
          </h2>
          <Link href="/admin/conteudo/links/novo" className="rounded bg-black px-4 py-2 text-sm text-white">
            Adicionar link
          </Link>
        </div>

        <ul className="divide-y divide-gray-200 rounded border border-gray-200">
          {links.map((link, i) => (
            <li key={link.id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col text-xs">
                <form action={move}>
                  <input type="hidden" name="id" value={link.id} />
                  <input type="hidden" name="direction" value="-1" />
                  <button type="submit" disabled={i === 0} className="px-1 disabled:opacity-20" aria-label="Subir">
                    ▲
                  </button>
                </form>
                <form action={move}>
                  <input type="hidden" name="id" value={link.id} />
                  <input type="hidden" name="direction" value="1" />
                  <button
                    type="submit"
                    disabled={i === links.length - 1}
                    className="px-1 disabled:opacity-20"
                    aria-label="Descer"
                  >
                    ▼
                  </button>
                </form>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100">
                <LinkIcon name={resolveIcon(link.icon, link.url)} className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {link.title}
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-normal text-gray-500">
                    {SIZE_LABEL[link.size] ?? link.size}
                  </span>
                  {!link.visible && (
                    <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Oculto</span>
                  )}
                </p>
                <p className="truncate text-sm text-gray-500">{link.url}</p>
              </div>
              <form action={resetLinkClicks} title="Zerar contagem">
                <input type="hidden" name="id" value={link.id} />
                <button type="submit" className="text-sm text-gray-500">
                  {link.clicks} clique(s)
                </button>
              </form>
              <Link href={`/admin/conteudo/links/${link.id}`} className="text-sm text-blue-600">
                Editar
              </Link>
              <form action={remove}>
                <input type="hidden" name="id" value={link.id} />
                <button type="submit" className="text-sm text-red-600">
                  Excluir
                </button>
              </form>
            </li>
          ))}
          {links.length === 0 && (
            <li className="flex flex-col items-center gap-3 p-6 text-center text-sm text-gray-500">
              Nenhum link ainda.
              {profile && (
                <form action={createLinksFromProfile}>
                  <button type="submit" className="rounded border border-gray-300 px-3 py-1.5 text-gray-800">
                    Criar a partir das redes e do e-mail do Perfil
                  </button>
                </form>
              )}
            </li>
          )}
        </ul>
        {autoCards.length > 0 && (
          <>
            <h3 className="mb-2 mt-6 text-sm font-medium text-gray-700">Cards automáticos</h3>
            <ul className="divide-y divide-gray-200 rounded border border-gray-200">
              {autoCards.map((card) => (
                <li key={card.id} className="flex items-center gap-4 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gray-100">
                    <LinkIcon name={card.icon} className="size-5" />
                  </span>
                  <p className="min-w-0 flex-1 font-medium">
                    {card.title}
                    {!card.on && (
                      <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500">
                        Desligado
                      </span>
                    )}
                  </p>
                  <form action={resetLinkClicks} title="Zerar contagem">
                    <input type="hidden" name="id" value={card.id} />
                    <button type="submit" className="text-sm text-gray-500">
                      {card.clicks} clique(s)
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Clique na contagem para zerá-la. O card do perfil (foto, nome, cargo) sempre aparece primeiro. Os cards
          automáticos são ligados e desligados logo abaixo.
        </p>
      </section>

      {profile && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Cabeçalho e cards automáticos</h2>
          {salvo && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">Salvo.</p>}
          <form action={saveLinksSettings} className="flex flex-col gap-4">
            {LINKS_SETTINGS_FIELDS.map((field) => (
              <Field key={field.name} field={field} values={settingValues} />
            ))}
            <SubmitButton>Salvar</SubmitButton>
          </form>
        </section>
      )}
    </div>
  );
}
