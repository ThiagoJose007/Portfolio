import { about, career, contact, hero, testimonials } from "@/content/site";

// Textos soltos do site, editáveis em /admin/textos. Cada chave vira uma linha
// na tabela `site_texts`; se a linha não existir, vale o `default` daqui.
// Convenção: trechos entre *asteriscos* viram itálico serifado (ver Accent).

export type TextField = {
  key: string;
  label: string;
  default: string;
  // Campo de várias linhas no admin.
  multiline?: boolean;
  // Lista: um item por linha.
  list?: boolean;
  help?: string;
};

export type TextGroup = { title: string; fields: TextField[] };

const nextChapter = career.chapters[career.chapters.length - 1];

export const TEXT_GROUPS: TextGroup[] = [
  {
    title: "Hero (abertura da página inicial)",
    fields: [
      { key: "hero.eyebrow", label: "Rótulo acima do título", default: hero.eyebrow },
      { key: "hero.title", label: "Título", default: hero.title, help: "Use *asteriscos* para o itálico." },
      { key: "hero.intro", label: "Texto de apoio", default: hero.intro, multiline: true },
      { key: "hero.tags", label: "Tags em volta da esfera", default: hero.tags.join("\n"), list: true },
    ],
  },
  {
    title: "Sobre mim",
    fields: [
      { key: "about.label", label: "Rótulo da seção", default: about.label },
      { key: "about.manifesto", label: "Manifesto", default: about.manifesto, multiline: true },
    ],
  },
  {
    title: "Habilidades",
    fields: [
      { key: "skills.label", label: "Rótulo da seção", default: "Habilidades & stacks" },
      { key: "skills.title", label: "Título", default: "Ferramentas que uso para levar ideias até a produção." },
    ],
  },
  {
    title: "Experiência (linha do tempo)",
    fields: [
      { key: "career.label", label: "Rótulo da seção", default: career.label },
      { key: "career.title", label: "Título", default: career.title },
      {
        key: "career.next.title",
        label: "Último capítulo — título",
        default: nextChapter.title,
        help: "Capítulo final da linha do tempo (\"E agora, juntos\"). Deixe vazio para esconder.",
      },
      { key: "career.next.period", label: "Último capítulo — período", default: nextChapter.period },
      { key: "career.next.role", label: "Último capítulo — cargo", default: nextChapter.role },
      { key: "career.next.place", label: "Último capítulo — local", default: nextChapter.place },
      { key: "career.next.text", label: "Último capítulo — texto", default: nextChapter.text, multiline: true },
    ],
  },
  {
    title: "Projetos",
    fields: [{ key: "projects.title", label: "Título da vitrine", default: "Trabalhos *selecionados*" }],
  },
  {
    title: "Depoimentos",
    fields: [
      { key: "testimonials.label", label: "Rótulo da seção", default: testimonials.label },
      { key: "testimonials.title", label: "Título", default: testimonials.title },
    ],
  },
  {
    title: "Contato",
    fields: [
      { key: "contact.label", label: "Rótulo da seção", default: contact.label },
      { key: "contact.title", label: "Título", default: contact.title },
      { key: "contact.text", label: "Texto", default: contact.text, multiline: true },
      { key: "contact.cta", label: "Texto do botão", default: contact.cta },
    ],
  },
  {
    title: "Freelancer / outsourcing",
    fields: [
      { key: "freelance.title", label: "Título", default: "Também atendo como *freelancer*" },
      { key: "freelance.text", label: "Texto", default: "", multiline: true },
    ],
  },
  {
    title: "Aberturas das páginas internas",
    fields: [
      { key: "page.sobre.title", label: "Sobre — título", default: "Design e código, *lado a lado*." },
      {
        key: "page.sobre.text",
        label: "Sobre — texto",
        default: "Um pouco sobre como eu penso, trabalho e quais ferramentas uso para tirar ideias do papel.",
        multiline: true,
      },
      { key: "page.carreira.title", label: "Experiência — título", default: "Uma trajetória em *camadas*." },
      {
        key: "page.carreira.text",
        label: "Experiência — texto",
        default:
          "Da formação aos produtos que construo hoje — cada capítulo acrescentou uma camada ao meu jeito de trabalhar.",
        multiline: true,
      },
    ],
  },
];

export const TEXT_FIELDS = TEXT_GROUPS.flatMap((group) => group.fields);

export type TextKey = (typeof TEXT_FIELDS)[number]["key"];

export const TEXT_DEFAULTS: Record<string, string> = Object.fromEntries(
  TEXT_FIELDS.map((field) => [field.key, field.default]),
);

export const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
