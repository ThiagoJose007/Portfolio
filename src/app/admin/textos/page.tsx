import { getSiteContent } from "@/lib/content/load";
import { TEXT_GROUPS } from "@/lib/content/texts";
import { SubmitButton } from "../_components/fields";
import { saveTexts } from "./actions";

export const dynamic = "force-dynamic";

const inputClass = "rounded border border-gray-300 px-3 py-2";

export default async function TextsPage({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const { texts } = await getSiteContent();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-2xl font-semibold">Textos do site</h1>
      <p className="mb-6 text-sm text-gray-500">
        Títulos e frases das seções. Trechos entre *asteriscos* aparecem em itálico.
      </p>
      {salvo && <p className="mb-6 rounded bg-green-50 p-3 text-sm text-green-700">Textos salvos.</p>}

      <form action={saveTexts} className="flex flex-col gap-10">
        {TEXT_GROUPS.map((group) => (
          <fieldset key={group.title} className="flex flex-col gap-4">
            <legend className="mb-1 text-lg font-medium">{group.title}</legend>
            {group.fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-1 text-sm">
                {field.label}
                {field.multiline || field.list ? (
                  <textarea name={field.key} defaultValue={texts[field.key]} rows={field.list ? 4 : 3} className={inputClass} />
                ) : (
                  <input name={field.key} defaultValue={texts[field.key]} className={inputClass} />
                )}
                {(field.help || field.list) && (
                  <span className="text-xs text-gray-500">{field.help ?? "Um item por linha."}</span>
                )}
              </label>
            ))}
          </fieldset>
        ))}
        <SubmitButton>Salvar textos</SubmitButton>
      </form>
    </div>
  );
}
