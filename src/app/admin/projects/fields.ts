import { withTranslations, type FieldDef } from "../_components/field-defs";
import { TRANSLATABLE } from "@/lib/i18n/translations";

const SECTIONS: { title: string; description?: string; fields: FieldDef[] }[] = [
  {
    title: "Card",
    description: "O que aparece na vitrine de projetos.",
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "summary", label: "Resumo (uma linha: problema → papel → resultado)", type: "text", required: true },
      { name: "coverImage", label: "Capa", type: "image", nullable: true },
      { name: "tags", label: "Tags / stack", type: "text", help: "Separadas por vírgula." },
      { name: "visible", label: "Visível na versão geral do site", type: "boolean" },
    ],
  },
  {
    title: "Estudo de caso",
    description: "Página completa do projeto, pensada para entrevistadores técnicos.",
    fields: [
      { name: "role", label: "Meu papel", type: "text", nullable: true, placeholder: "Product Designer & Front-end" },
      { name: "client", label: "Cliente / empresa", type: "text", nullable: true },
      { name: "year", label: "Ano", type: "text", nullable: true },
      { name: "description", label: "Contexto / visão geral", type: "textarea", required: true, rows: 5 },
      { name: "problem", label: "Problema", type: "textarea", nullable: true, rows: 4 },
      { name: "process", label: "Processo e decisões", type: "textarea", nullable: true, rows: 6 },
      { name: "outcome", label: "Resultado (de preferência com números)", type: "textarea", nullable: true, rows: 4 },
      { name: "gallery", label: "Galeria", type: "gallery" },
      { name: "videoUrl", label: "Vídeo (URL do YouTube/Vimeo ou arquivo .mp4)", type: "text", nullable: true },
    ],
  },
  {
    title: "Links",
    fields: [
      { name: "liveUrl", label: "Link ao vivo", type: "text", nullable: true },
      { name: "repoUrl", label: "Repositório", type: "text", nullable: true },
    ],
  },
];

// Senha: não é coluna comum (vira hash), por isso fica fora de PROJECT_FIELDS.
export const PASSWORD_FIELDS: FieldDef[] = [
  {
    name: "newPassword",
    label: "Nova senha do estudo de caso",
    type: "text",
    placeholder: "Deixe vazio para manter como está",
    help: "Com senha, o card aparece na vitrine, mas o estudo de caso pede a senha. Nas candidaturas que liberam projetos protegidos, abre direto.",
  },
  { name: "removePassword", label: "Remover a senha (deixar o projeto aberto)", type: "boolean" },
];

export const PROJECT_SECTIONS = SECTIONS.map((section) => ({
  ...section,
  fields: withTranslations(section.fields, TRANSLATABLE.project),
}));

export const PROJECT_FIELDS = PROJECT_SECTIONS.flatMap((section) => section.fields);
