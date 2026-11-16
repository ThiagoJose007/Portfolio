import type { Locale } from "@/lib/i18n/config";

// Textos soltos do site, editáveis em /admin/textos, em inglês (idioma
// principal) e português. O inglês fica na tabela `site_texts`; o português
// em `translations` (entity "text"). Sem valor gravado, valem os padrões daqui.
// Convenção: trechos entre *asteriscos* viram itálico serifado (ver Accent).

export type TextField = {
  key: string;
  label: string;
  default: string; // inglês
  defaultPt: string;
  // Campo de várias linhas no admin.
  multiline?: boolean;
  // Lista: um item por linha.
  list?: boolean;
  help?: string;
};

export type TextGroup = { title: string; fields: TextField[] };

export const TEXT_GROUPS: TextGroup[] = [
  {
    title: "Hero (abertura da página inicial)",
    fields: [
      {
        key: "hero.eyebrow",
        label: "Rótulo acima do título",
        default: "UI/UX & Product Designer — Portfolio 2026",
        defaultPt: "UI/UX & Product Designer — Portfolio 2026",
      },
      {
        key: "hero.title",
        label: "Título",
        default: "I design interfaces that *measurably* work.",
        defaultPt: "Desenho interfaces que funcionam, *com números*.",
        help: "Use *asteriscos* para o itálico.",
      },
      {
        key: "hero.intro",
        label: "Texto de apoio",
        default:
          "4+ years turning complex workflows into products people finish faster: 66% less time on task and 80% higher task success in my latest redesign. I lead design squads, align stakeholders and ship with engineering.",
        defaultPt:
          "Mais de 4 anos transformando fluxos complexos em produtos que as pessoas concluem mais rápido: 66% menos tempo por tarefa e 80% mais sucesso nas tarefas no meu último redesign. Lidero squads de design, alinho stakeholders e entrego junto com a engenharia.",
        multiline: true,
      },
      {
        key: "hero.tags",
        label: "Tags em volta da esfera",
        default: "UX Research\nDesign Systems\nGame UI\nFront-end",
        defaultPt: "UX Research\nDesign Systems\nGame UI\nFront-end",
        list: true,
      },
    ],
  },
  {
    title: "Sobre mim",
    fields: [
      { key: "about.label", label: "Rótulo da seção", default: "About", defaultPt: "Sobre mim" },
      {
        key: "about.manifesto",
        label: "Manifesto",
        default:
          "Good design is a business decision. I make it measurable: clear problems, shared evidence, fewer handoff gaps, and results every stakeholder can see.",
        defaultPt:
          "Bom design é decisão de negócio. Eu torno isso mensurável: problemas claros, evidências compartilhadas, menos ruído entre times e resultados que todos os stakeholders conseguem ver.",
        multiline: true,
      },
    ],
  },
  {
    title: "Página Sobre mim",
    fields: [
      { key: "about.tldr.title", label: "Título do resumo", default: "Resume in *30 seconds*", defaultPt: "Resumo em *30 segundos*" },
      { key: "about.bio.label", label: "Rótulo da bio", default: "Who I am", defaultPt: "Quem sou" },
      { key: "process.title", label: "Título — Como eu trabalho", default: "How I *work*", defaultPt: "Como eu *trabalho*" },
      { key: "beyond.title", label: "Título — Além do trabalho", default: "Beyond the *resume*", defaultPt: "Além do *currículo*" },
      { key: "beyond.values", label: "Coluna — valores", default: "Values", defaultPt: "Valores" },
      { key: "beyond.hobbies", label: "Coluna — hobbies", default: "Outside work", defaultPt: "Fora do trabalho" },
      { key: "beyond.goals", label: "Coluna — o que busco", default: "What I'm looking for", defaultPt: "O que busco" },
    ],
  },
  {
    title: "Página Experiência",
    fields: [
      { key: "education.title", label: "Título — formação", default: "Education", defaultPt: "Formação" },
      { key: "awards.title", label: "Título — prêmios", default: "Recognition", defaultPt: "Reconhecimentos" },
    ],
  },
  {
    title: "Habilidades",
    fields: [
      { key: "skills.label", label: "Rótulo da seção", default: "Skills & stack", defaultPt: "Habilidades & stacks" },
      {
        key: "skills.title",
        label: "Título",
        default: "What I use to take products from problem to measurable result.",
        defaultPt: "O que uso para levar produtos do problema ao resultado medido.",
      },
    ],
  },
  {
    title: "Experiência (linha do tempo)",
    fields: [
      { key: "career.label", label: "Rótulo da seção", default: "Experience", defaultPt: "Experiência" },
      {
        key: "career.title",
        label: "Título",
        default: "4+ years of growing *scope* and impact",
        defaultPt: "4+ anos ampliando *escopo* e impacto",
      },
      {
        key: "career.next.title",
        label: "Último capítulo — título",
        default: "Bringing it to a *global* team",
        defaultPt: "Levando isso a um time *global*",
        help: "Capítulo final da linha do tempo. Deixe vazio para esconder.",
      },
      { key: "career.next.period", label: "Último capítulo — período", default: "Next", defaultPt: "Próximo capítulo" },
      { key: "career.next.role", label: "Último capítulo — cargo", default: "Open to", defaultPt: "Em aberto" },
      { key: "career.next.place", label: "Último capítulo — local", default: "Your team?", defaultPt: "Seu time?" },
      {
        key: "career.next.text",
        label: "Último capítulo — texto",
        default:
          "UI/UX and product design at scale: owning complex problems end to end, leading through clarity, and partnering closely with product and engineering.",
        defaultPt:
          "UI/UX e design de produto em escala: assumindo problemas complexos de ponta a ponta, liderando com clareza e trabalhando lado a lado com produto e engenharia.",
        multiline: true,
      },
    ],
  },
  {
    title: "Projetos",
    fields: [
      { key: "projects.title", label: "Título da vitrine", default: "Selected *case studies*", defaultPt: "Estudos de caso *selecionados*" },
    ],
  },
  {
    title: "Depoimentos",
    fields: [
      { key: "testimonials.label", label: "Rótulo da seção", default: "Testimonials", defaultPt: "Depoimentos" },
      {
        key: "testimonials.title",
        label: "Título",
        default: "What leaders and teammates *say*",
        defaultPt: "O que líderes e colegas *dizem*",
      },
    ],
  },
  {
    title: "Contato",
    fields: [
      { key: "contact.label", label: "Rótulo da seção", default: "Contact", defaultPt: "Contato" },
      {
        key: "contact.title",
        label: "Título",
        default: "Let's build something people *finish*.",
        defaultPt: "Vamos criar algo que as pessoas *concluam*.",
      },
      {
        key: "contact.text",
        label: "Texto",
        default:
          "Open to remote UI/UX and product design roles worldwide. GMT-3, overlapping with US and European hours. I usually reply within 24h.",
        defaultPt:
          "Aberto a vagas remotas de UI/UX e design de produto, no Brasil e no exterior. Fuso GMT-3, com sobreposição de horário com EUA e Europa. Costumo responder em até 24h.",
        multiline: true,
      },
      { key: "contact.cta", label: "Texto do botão", default: "Get in touch", defaultPt: "Fale comigo" },
    ],
  },
  {
    title: "Freelancer / outsourcing",
    fields: [
      {
        key: "freelance.title",
        label: "Título",
        default: "Also available for *freelance*",
        defaultPt: "Também atendo como *freelancer*",
      },
      { key: "freelance.text", label: "Texto", default: "", defaultPt: "", multiline: true },
    ],
  },
  {
    title: "Aberturas das páginas internas",
    fields: [
      { key: "page.sobre.title", label: "Sobre — título", default: "How I *think*, lead and work.", defaultPt: "Como eu *penso*, lidero e trabalho." },
      {
        key: "page.sobre.text",
        label: "Sobre — texto",
        default: "The principles, process and tools behind the numbers.",
        defaultPt: "Os princípios, o processo e as ferramentas por trás dos números.",
        multiline: true,
      },
      { key: "page.carreira.title", label: "Experiência — título", default: "From backlog to *leadership*.", defaultPt: "Do backlog à *liderança*." },
      {
        key: "page.carreira.text",
        label: "Experiência — texto",
        default: "Product owner, designer, developer, design lead, CTO. Each role added scope, ownership and measurable results.",
        defaultPt: "Product owner, designer, desenvolvedor, líder de design, CTO. Cada papel trouxe mais escopo, responsabilidade e resultados medidos.",
        multiline: true,
      },
    ],
  },
];

export const TEXT_FIELDS = TEXT_GROUPS.flatMap((group) => group.fields);

export const TEXT_DEFAULTS: Record<Locale, Record<string, string>> = {
  en: Object.fromEntries(TEXT_FIELDS.map((field) => [field.key, field.default])),
  pt: Object.fromEntries(TEXT_FIELDS.map((field) => [field.key, field.defaultPt])),
};

export const splitLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
