import type { FieldDef } from "./field-defs";
import { GalleryField, UploadField } from "./upload-field";

export type { FieldDef };

const inputClass = "rounded border border-gray-300 px-3 py-2";

const asString = (value: unknown) => (value === null || value === undefined ? "" : String(value));

export function Field({ field, value }: { field: FieldDef; value?: unknown }) {
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
