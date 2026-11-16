// Definição de campos dos formulários do admin e leitura do FormData.

export type FieldType = "text" | "textarea" | "list" | "number" | "boolean" | "select" | "image" | "file" | "gallery" | "icon";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  // Coluna opcional no banco (String?): vazio vira null.
  nullable?: boolean;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  // Para selects cujo valor é número (ex.: forma 3D).
  numeric?: boolean;
  rows?: number;
  // Tem versão em português (o formulário mostra os dois idiomas lado a lado).
  translatable?: boolean;
};

// Sufixo do campo em português no formulário (ex.: "summary__pt").
export const PT_SUFFIX = "__pt";

// Marca como traduzíveis os campos listados para a entidade.
export function withTranslations(fields: FieldDef[], translatable: readonly string[] = []): FieldDef[] {
  return fields.map((field) => (translatable.includes(field.name) ? { ...field, translatable: true } : field));
}

// Valores em português enviados pelo formulário (um por campo traduzível).
export function readTranslations(fields: FieldDef[], formData: FormData) {
  return Object.fromEntries(
    fields
      .filter((field) => field.translatable)
      .map((field) => [field.name, String(formData.get(field.name + PT_SUFFIX) ?? "").replace(/\r\n/g, "\n")]),
  ) as Record<string, string>;
}

const lines = (raw: string) =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// Converte o FormData nos tipos de cada coluna. Lança erro se faltar algo obrigatório.
export function readFields(fields: FieldDef[], formData: FormData) {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = String(formData.get(field.name) ?? "").trim();
    if (field.required && !raw && field.type !== "boolean") {
      throw new Error(`O campo "${field.label}" é obrigatório.`);
    }
    switch (field.type) {
      case "boolean":
        data[field.name] = formData.get(field.name) === "on";
        break;
      case "number":
        data[field.name] = Number.parseInt(raw || "0", 10) || 0;
        break;
      case "list":
      case "gallery":
        data[field.name] = lines(raw);
        break;
      case "select":
        data[field.name] = field.numeric ? Number(raw) : raw;
        break;
      default:
        data[field.name] = raw || (field.nullable ? null : "");
    }
  }
  return data;
}
