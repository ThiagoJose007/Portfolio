// Conteúdo de fábrica do site. Desde que o conteúdo passou a ser editável no
// /admin, este arquivo só é usado (1) enquanto nada foi importado para o banco
// e (2) como ponto de partida do botão "Importar conteúdo atual" do painel.
// Edite o conteúdo pelo /admin, não aqui.
//
// Convenção: trechos entre *asteriscos* são renderizados em itálico serifado
// (o "destaque" tipográfico do site). Ver `Accent` em components/site/accent.tsx.

export type SceneShape = 0 | 1 | 2 | 3 | 4;
// 0 esfera de partículas · 1 anel (toro) · 2 estrutura em grade · 3 dupla hélice · 4 monograma

export const profile = {
  name: "Thiago Santos",
  initials: "TS",
  role: "Product Designer & Developer", // TODO: confirme seu título
  location: "Maceió, Brasil", // TODO: confirme sua cidade
  timeZone: "America/Maceio",
  availability: "Disponível para novas oportunidades",
  email: "seuemail@exemplo.com", // TODO
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/seu-perfil" }, // TODO
    { label: "GitHub", href: "https://github.com/seu-usuario" }, // TODO
    { label: "Behance", href: "https://behance.net/seu-usuario" }, // TODO
  ],
};

export const hero = {
  eyebrow: "Portfolio — 2026",
  title: "Crio produtos digitais do *pixel* ao deploy.",
  intro:
    "Designer e desenvolvedor construindo experiências web completas — da pesquisa e do protótipo no Figma ao código em produção.", // TODO
  tags: ["UX / UI", "Front-end", "Design Systems", "Motion"],
};

export const about = {
  label: "Sobre mim",
  manifesto:
    "Acredito que bons produtos nascem da conversa entre design, código e as pessoas que vão usá-los. Por isso trabalho nas duas pontas: entendo o problema, desenho a solução e escrevo o código que a coloca no ar.", // TODO
  stats: [
    // TODO: números reais
    { value: 5, suffix: "+", label: "anos criando produtos" },
    { value: 30, suffix: "+", label: "projetos entregues" },
    { value: 12, suffix: "", label: "stacks no dia a dia" },
  ],
};

export type SkillGroup = {
  id: string;
  label: string;
  headline: string;
  stacks: string[];
};

export const skills: SkillGroup[] = [
  {
    id: "design",
    label: "Design de produto",
    headline: "Interfaces claras, testadas com quem vai usar.",
    stacks: ["Figma", "Design Systems", "Prototipação", "Pesquisa", "Acessibilidade"],
  },
  {
    id: "frontend",
    label: "Front-end",
    headline: "Interfaces vivas, rápidas e com movimento.",
    stacks: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP", "Three.js"],
  },
  {
    id: "backend",
    label: "Back-end & dados",
    headline: "Dados bem modelados e APIs previsíveis.",
    stacks: ["Node.js", "PostgreSQL", "Prisma", "REST", "Server Actions"],
  },
  {
    id: "infra",
    label: "Infra & entrega",
    headline: "Do commit ao deploy, sem cerimônia.",
    stacks: ["Docker", "Railway", "Git", "CI/CD", "Storybook"],
  },
];

export type CareerChapter = {
  period: string;
  role: string;
  place: string;
  title: string;
  text: string;
  shape: SceneShape;
};

// TODO: substitua pelos capítulos reais da sua trajetória.
export const career = {
  label: "Experiência",
  title: "Cada etapa *moldou* o que eu faço hoje",
  chapters: [
    {
      period: "20XX",
      role: "Formação",
      place: "Instituição",
      title: "Começo com *curiosidade*",
      text: "Onde tudo começou: os primeiros projetos, a descoberta do design de interfaces e a vontade de entender como as coisas funcionam por dentro.",
      shape: 1,
    },
    {
      period: "20XX — 20XX",
      role: "Designer",
      place: "Empresa",
      title: "Aprendo com *pessoas*",
      text: "Pesquisa, entrevistas e testes de usabilidade. Aprendi que a melhor interface é a que responde a uma dor real.",
      shape: 3,
    },
    {
      period: "20XX — 20XX",
      role: "Desenvolvedor front-end",
      place: "Empresa",
      title: "Construo com *código*",
      text: "Levei os protótipos para o navegador: componentes, animações e performance passaram a fazer parte do meu processo.",
      shape: 2,
    },
    {
      period: "20XX — hoje",
      role: "Product Designer & Developer",
      place: "Empresa",
      title: "Escalo com *sistemas*",
      text: "Design systems, back-end e deploy. Hoje entrego produtos de ponta a ponta, conectando times de design e engenharia.",
      shape: 0,
    },
    {
      period: "Próximo capítulo",
      role: "Em aberto",
      place: "Sua empresa?",
      title: "E agora, *juntos*",
      text: "Procuro um time onde design e engenharia andem lado a lado — e onde eu possa contribuir nas duas pontas.",
      shape: 4,
    },
  ] satisfies CareerChapter[],
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// TODO: depoimentos reais (peça a colegas, líderes e clientes).
export const testimonials = {
  label: "Depoimentos",
  title: "O que dizem sobre *trabalhar comigo*",
  items: [
    {
      quote: "Espaço para um depoimento sobre como é colaborar com você em um projeto de produto.",
      name: "Nome Sobrenome",
      role: "Cargo · Empresa",
    },
    {
      quote: "Espaço para um depoimento sobre sua capacidade de transformar ideias em interfaces.",
      name: "Nome Sobrenome",
      role: "Cargo · Empresa",
    },
    {
      quote: "Espaço para um depoimento sobre qualidade de código e entrega.",
      name: "Nome Sobrenome",
      role: "Cargo · Empresa",
    },
    {
      quote: "Espaço para um depoimento sobre comunicação com times de design e engenharia.",
      name: "Nome Sobrenome",
      role: "Cargo · Empresa",
    },
    {
      quote: "Espaço para um depoimento sobre um resultado concreto que vocês alcançaram juntos.",
      name: "Nome Sobrenome",
      role: "Cargo · Empresa",
    },
  ] satisfies Testimonial[],
};

export const contact = {
  label: "Contato",
  title: "Vamos criar algo *juntos*?",
  text: "Aberto a vagas, freelas e boas conversas sobre produto.",
  cta: "Fale comigo",
};
