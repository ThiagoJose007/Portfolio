import { getSiteContent } from "@/lib/content/load";
import { TEXT_GROUPS, type TextField } from "@/lib/content/texts";
import { SubmitButton } from "../_components/fields";
import { saveTexts } from "./actions";

export const dynamic = "force-dynamic";

const inputClass = "rounded border border-gray-300 px-3 py-2";

function TextInput({ field, name, value, label }: { field: TextField; name: string; value: string; label: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {field.multiline || field.list ? (
        <textarea name={name} defaultValue={value} rows={field.list ? 4 : 3} className={inputClass} />
      ) : (
        <input name={name} defaultValue={value} className={inputClass} />
      )}
    </label>
  );
}

export default async function TextsPage({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const [en, pt] = await Promise.all([getSiteContent("en"), getSiteContent("pt")]);

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-2 text-2xl font-semibold">Textos do site</h1>
      <p className="mb-6 text-sm text-gray-500">
        Títulos e frases das seções, em inglês (idioma principal) e português. Trechos entre *asteriscos* aparecem em
        itálico.
      </p>
      {salvo && <p className="mb-6 rounded bg-green-50 p-3 text-sm text-green-700">Textos salvos.</p>}

      <form action={saveTexts} className="flex flex-col gap-10">
        {TEXT_GROUPS.map((group) => (
          <fieldset key={group.title} className="flex flex-col gap-4">
            <legend className="mb-1 text-lg font-medium">{group.title}</legend>
            {group.fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1">
                <div className="grid gap-3 rounded border border-dashed border-gray-200 p-3 md:grid-cols-2">
                  <TextInput field={field} name={field.key} value={en.texts[field.key]} label={`${field.label} · EN`} />
                  <TextInput
                    field={field}
                    name={`${field.key}__pt`}
                    value={pt.texts[field.key]}
                    label={`${field.label} · PT`}
                  />
                </div>
                {(field.help || field.list) && (
                  <span className="text-xs text-gray-500">{field.help ?? "Um item por linha."}</span>
                )}
              </div>
            ))}
          </fieldset>
        ))}
        <SubmitButton>Salvar textos</SubmitButton>
      </form>
    </div>
  );
}
