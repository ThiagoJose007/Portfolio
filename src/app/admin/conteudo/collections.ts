import { prisma } from "@/lib/prisma";
import type { AboutItemKind } from "@/generated/prisma/client";
import { formatPeriod } from "@/lib/content/load";
import type { FieldDef } from "../_components/field-defs";

// Listas editáveis do site. Cada entrada gera, de forma genérica, as telas
// /admin/conteudo/[chave] (lista, novo, editar) e as ações de salvar,
// excluir e reordenar.

export type Row = Record<string, unknown> & { id: string; order: number };

type Where = Record<string, unknown>;

// Subconjunto das operações do Prisma usado pelo admin genérico.
export type Delegate = {
  findMany(args: { where?: Where; orderBy?: Where | Where[] }): Promise<Row[]>;
  findFirst(args: { where?: Where; orderBy?: Where }): Promise<Row | null>;
  findUnique(args: { where: { id: string } }): Promise<Row | null>;
  create(args: { data: Where }): Promise<Row>;
  update(args: { where: { id: string }; data: Where }): Promise<Row>;
  delete(args: { where: { id: string } }): Promise<Row>;
};

export type Collection = {
  key: string;
  title: string;
  singular: string;
  description: string;
  delegate: () => Delegate;
  // Filtro fixo (e valor gravado na criação), ex.: o tipo de AboutItem.
  scope?: Where;
  fields: FieldDef[];
  summary: (row: Row) => { title: string; subtitle?: string; hidden?: boolean };
};

const delegate = (model: unknown) => () => model as Delegate;

const aboutItems = (
  key: string,
  kind: AboutItemKind,
  title: string,
  singular: string,
  description: string,
): Collection => ({
  key,
  title,
  singular,
  description,
  delegate: delegate(prisma.aboutItem),
  scope: { kind },
  fields: [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "text", label: "Texto", type: "textarea", rows: 3 },
  ],
  summary: (row) => ({ title: String(row.title), subtitle: String(row.text ?? "") }),
});

export const COLLECTIONS: Collection[] = [
  {
    key: "experiencias",
    title: "Experiências",
    singular: "experiência",
    description: "Cargos e empresas, do mais antigo para o mais recente (o site mostra o mais recente primeiro).",
    delegate: delegate(prisma.experience),
    fields: [
      { name: "role", label: "Cargo", type: "text", required: true },
      { name: "company", label: "Empresa", type: "text", required: true },
      { name: "location", label: "Local / modelo", type: "text", nullable: true, placeholder: "Remoto, São Paulo…" },
      { name: "start", label: "Início", type: "text", required: true, placeholder: "2021 ou Mar 2021" },
      { name: "end", label: "Fim", type: "text", nullable: true, help: "Deixe vazio se for o trabalho atual." },
      {
        name: "headline",
        label: "Frase de destaque",
        type: "text",
        help: "Subtítulo da experiência no site. Use *asteriscos* para o itálico.",
      },
      { name: "summary", label: "Resumo", type: "textarea", rows: 3 },
      { name: "highlights", label: "Conquistas", type: "list", help: "Uma conquista por linha (de preferência com números)." },
      { name: "visible", label: "Visível no site", type: "boolean" },
    ],
    summary: (row) => ({
      title: `${row.role} · ${row.company}`,
      subtitle: formatPeriod(row.start as string, row.end as string | null),
      hidden: row.visible === false,
    }),
  },
  {
    key: "formacao",
    title: "Formação",
    singular: "formação",
    description: "Graduação, cursos e certificações.",
    delegate: delegate(prisma.education),
    fields: [
      { name: "course", label: "Curso", type: "text", required: true },
      { name: "institution", label: "Instituição", type: "text", required: true },
      {
        name: "kind",
        label: "Tipo",
        type: "select",
        options: ["Graduação", "Pós-graduação", "Curso", "Certificação", "Bootcamp"].map((value) => ({
          value,
          label: value,
        })),
      },
      { name: "start", label: "Início", type: "text", nullable: true },
      { name: "end", label: "Conclusão", type: "text", nullable: true, help: "Vazio = em andamento." },
      { name: "description", label: "Descrição", type: "textarea", nullable: true, rows: 3 },
      { name: "visible", label: "Visível no site", type: "boolean" },
    ],
    summary: (row) => ({
      title: `${row.course} · ${row.institution}`,
      subtitle: `${row.kind} · ${formatPeriod(row.start as string | null, row.end as string | null, "em andamento")}`,
      hidden: row.visible === false,
    }),
  },
  {
    key: "skills",
    title: "Habilidades",
    singular: "grupo de habilidades",
    description: "Grupos de stacks (Design, Front-end…).",
    delegate: delegate(prisma.skillGroup),
    fields: [
      { name: "label", label: "Nome do grupo", type: "text", required: true },
      { name: "headline", label: "Frase", type: "text" },
      { name: "stacks", label: "Ferramentas / stacks", type: "list", help: "Uma por linha." },
    ],
    summary: (row) => ({
      title: String(row.label),
      subtitle: Array.isArray(row.stacks) ? row.stacks.join(" · ") : "",
    }),
  },
  {
    key: "numeros",
    title: "Números",
    singular: "número",
    description: "Destaques numéricos da seção Sobre (ex.: 5+ anos criando produtos).",
    delegate: delegate(prisma.stat),
    fields: [
      { name: "value", label: "Valor", type: "number", required: true },
      { name: "suffix", label: "Sufixo", type: "text", placeholder: "+, %, k…" },
      { name: "label", label: "Legenda", type: "text", required: true },
    ],
    summary: (row) => ({ title: `${row.value}${row.suffix ?? ""}`, subtitle: String(row.label) }),
  },
  {
    key: "processo",
    title: "Como eu trabalho",
    singular: "etapa",
    description: "Etapas do seu processo de trabalho.",
    delegate: delegate(prisma.processStep),
    fields: [
      { name: "title", label: "Etapa", type: "text", required: true },
      { name: "text", label: "Descrição", type: "textarea", rows: 3 },
    ],
    summary: (row) => ({ title: String(row.title), subtitle: String(row.text ?? "") }),
  },
  aboutItems("valores", "VALUE", "Valores", "valor", "Valores pessoais e profissionais."),
  aboutItems("hobbies", "HOBBY", "Fora do trabalho", "hobby", "Hobbies e interesses."),
  aboutItems("o-que-busco", "GOAL", "O que busco", "item", "O que você procura no próximo passo da carreira."),
  aboutItems(
    "freelancer",
    "SERVICE",
    "Freelancer",
    "serviço",
    "Serviços oferecidos como freelancer. A seção só aparece quando estiver ligada no Perfil.",
  ),
  {
    key: "premios",
    title: "Prêmios",
    singular: "prêmio",
    description: "Prêmios e reconhecimentos.",
    delegate: delegate(prisma.award),
    fields: [
      { name: "title", label: "Prêmio", type: "text", required: true, placeholder: "Ouro em Visual Design" },
      { name: "issuer", label: "Quem concedeu", type: "text", placeholder: "W3 Awards" },
      { name: "project", label: "Projeto", type: "text", nullable: true },
      { name: "year", label: "Ano", type: "text", nullable: true },
    ],
    summary: (row) => ({
      title: String(row.title),
      subtitle: [row.project, row.issuer, row.year].filter(Boolean).join(" · "),
    }),
  },
  {
    key: "depoimentos",
    title: "Depoimentos",
    singular: "depoimento",
    description: "O que colegas, líderes e clientes dizem sobre você.",
    delegate: delegate(prisma.testimonial),
    fields: [
      { name: "quote", label: "Depoimento", type: "textarea", required: true, rows: 4 },
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "role", label: "Cargo · Empresa", type: "text" },
      { name: "visible", label: "Visível no site", type: "boolean" },
    ],
    summary: (row) => ({ title: String(row.name), subtitle: String(row.quote), hidden: row.visible === false }),
  },
];

export function getCollection(key: string) {
  return COLLECTIONS.find((collection) => collection.key === key) ?? null;
}
