import { PT_SUFFIX, type FieldDef } from "./field-defs";
import { LINK_ICONS, LinkIcon } from "@/lib/link-icons";
import { GalleryField, UploadField } from "./upload-field";

export type { FieldDef };

const inputClass = "rounded border border-gray-300 px-3 py-2";

const asString = (value: unknown) => (value === null || value === undefined ? "" : String(value));

// `values` traz também os campos em português ("<campo>__pt").
export function Field({ field, value, values }: { field: FieldDef; value?: unknown; values?: Record<string, unknown> }) {
  const current = values ? values[field.name] : value;
  if (field.translatable) {
    return (
      <div className="grid gap-3 rounded border border-dashed border-gray-200 p-3 md:grid-cols-2">
        <SingleField field={{ ...field, label: `${field.label} · EN` }} value={current} />
        <SingleField
          field={{ ...field, name: field.name + PT_SUFFIX, label: `${field.label} · PT`, required: false, help: undefined }}
          value={values?.[field.name + PT_SUFFIX]}
        />
      </div>
    );
  }
  return <SingleField field={field} value={current} />;
}

function SingleField({ field, value }: { field: FieldDef; value?: unknown }) {
  const { name, label, type, required, help, placeholder, options, rows } = field;
  const hint = help && <span className="text-xs text-gray-500">{help}</span>;

  switch (type) {
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name={name} defaultChecked={value === undefined ? true : Boolean(value)} />
          {label}
          {hint}
        </label>
      );
    case "image":
    case "file":
      return (
        <UploadField
          name={name}
          label={label}
          defaultValue={asString(value)}
          accept={type === "image" ? "image/*" : "application/pdf"}
          help={help}
        />
      );
    case "gallery":
      return (
        <GalleryField
          name={name}
          label={label}
          defaultValue={Array.isArray(value) ? value.map(String) : []}
        />
      );
    case "icon": {
      // Grade de ícones clicáveis (rádio), agrupados por tipo.
      const current = asString(value) || "auto";
      const groups = ["Marcas", "Geral"] as const;
      const optionClass =
        "flex cursor-pointer flex-col items-center gap-1 rounded border border-gray-200 p-2 text-[10px] text-gray-600 hover:border-gray-400 has-[:checked]:border-black has-[:checked]:bg-gray-50 has-[:checked]:text-black";
      return (
        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="mb-2">{label}</legend>
          <label className={`${optionClass} flex-row justify-start gap-2 text-xs`}>
            <input type="radio" name={name} value="auto" defaultChecked={current === "auto"} className="sr-only" />
            ✨ Automático (descobre pelo link: YouTube, Medium, GitHub…)
          </label>
          {groups.map((group) => (
            <div key={group}>
              <p className="mb-1 text-xs text-gray-500">{group}</p>
              <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                {Object.entries(LINK_ICONS)
                  .filter(([, icon]) => icon.group === group)
                  .map(([key, icon]) => (
                    <label key={key} className={optionClass} title={icon.label}>
                      <input type="radio" name={name} value={key} defaultChecked={current === key} className="sr-only" />
                      <LinkIcon name={key} className="size-5" />
                      <span className="w-full truncate text-center">{icon.label}</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
          {hint}
        </fieldset>
      );
    }
    case "select":
      return (
        <label className="flex flex-col gap-1 text-sm">
          {label}
          <select name={name} defaultValue={asString(value ?? options?.[0]?.value)} className={inputClass}>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hint}
        </label>
      );
    case "textarea":
    case "list":
      return (
        <label className="flex flex-col gap-1 text-sm">
          {label}
          <textarea
            name={name}
            required={required}
            rows={rows ?? (type === "list" ? 4 : 5)}
            placeholder={placeholder}
            defaultValue={type === "list" && Array.isArray(value) ? value.join("\n") : asString(value)}
            className={inputClass}
          />
          {type === "list" ? <span className="text-xs text-gray-500">{help ?? "Um item por linha."}</span> : hint}
        </label>
      );
    default:
      return (
        <label className="flex flex-col gap-1 text-sm">
          {label}
          <input
            name={name}
            type={type === "number" ? "number" : "text"}
            required={required}
            placeholder={placeholder}
            defaultValue={asString(value)}
            className={inputClass}
          />
          {hint}
        </label>
      );
  }
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button type="submit" className="mt-2 self-start rounded bg-black px-4 py-2 text-sm text-white">
      {children}
    </button>
  );
}
