import type { FieldDef } from "../_components/field-defs";

export const PROJECT_SECTIONS: { title: string; description?: string; fields: FieldDef[] }[] = [
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

export const PROJECT_FIELDS = PROJECT_SECTIONS.flatMap((section) => section.fields);
