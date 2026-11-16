// Textos sugeridos a partir do LinkedIn (perfil exportado em nov/2026), em
// inglês e português. Aplicados pelo botão "Aplicar textos sugeridos" no
// Painel do admin. Só dados do perfil: nada de números inventados.

type Bi = { en: string; pt: string };
type BiList = { en: string[]; pt: string[] };

export const PROFILE_COPY = {
  role: { en: "UI/UX & Product Designer", pt: "UI/UX & Product Designer" },
  availability: { en: "Open to remote roles worldwide", pt: "Aberto a vagas remotas, no Brasil e no exterior" },
  tldrCareer: {
    en: "4+ years in UI/UX · leading a squad of 2 designers across 4 projects",
    pt: "4+ anos em UI/UX · liderando um squad de 2 designers em 4 projetos",
  },
  tldrBasedIn: {
    en: "Maceió, Brazil (GMT-3) · Remote, overlaps with US & Europe",
    pt: "Maceió, Brasil (GMT-3) · Remoto, com horário compatível com EUA e Europa",
  },
  tldrSkillset: {
    en: "UX research, interaction & UI design, design systems, accessibility (WCAG), Game UI, front-end (React, TypeScript)",
    pt: "Pesquisa de UX, design de interação e UI, design systems, acessibilidade (WCAG), Game UI, front-end (React, TypeScript)",
  },
  tldrExperience: {
    en: "Enterprise & public-sector platforms, environmental tech, mobile games, startups",
    pt: "Plataformas corporativas e do setor público, tecnologia ambiental, jogos mobile, startups",
  },
  tldrLanguages: {
    en: "English (full professional), Portuguese (native), Spanish (limited working), Japanese & Chinese (elementary)",
    pt: "Inglês (profissional completo), Português (nativo), Espanhol (intermediário), Japonês e Chinês (básico)",
  },
  bio: {
    en: "I'm Thiago, a UI/UX designer with 4+ years turning complex workflows into products people finish faster. In my latest redesign, users completed tasks 66% faster and succeeded 80% more often.\n\nI work where design meets engineering and business: I lead a squad of designers across multiple projects, translate stakeholder needs into clear backlogs, and ship with developers, from Figma to React code and Unity/Unreal UI. My Game UI background taught me to design for clarity under pressure, and I bring that to every product.",
    pt: "Sou o Thiago, designer de UI/UX com mais de 4 anos transformando fluxos complexos em produtos que as pessoas concluem mais rápido. No meu último redesign, os usuários concluíram as tarefas 66% mais rápido e tiveram 80% mais sucesso.\n\nTrabalho onde design encontra engenharia e negócio: lidero um squad de designers em vários projetos, transformo necessidades de stakeholders em backlogs claros e entrego junto com desenvolvedores, do Figma ao código em React e à UI em Unity/Unreal. A experiência com Game UI me ensinou a desenhar para clareza sob pressão, e levo isso para todo produto.",
  },
  linksBio: {
    en: "UI/UX & product designer. Design systems, Game UI and front-end.",
    pt: "Designer de UI/UX e produto. Design systems, Game UI e front-end.",
  },
} satisfies Record<string, Bi>;

export const STATS_COPY: { value: number; suffix: string; label: Bi }[] = [
  { value: 4, suffix: "+", label: { en: "years designing digital products", pt: "anos desenhando produtos digitais" } },
  { value: 66, suffix: "%", label: { en: "less time on task after redesign", pt: "menos tempo por tarefa após o redesign" } },
  { value: 80, suffix: "%", label: { en: "higher task success rate", pt: "mais sucesso na conclusão de tarefas" } },
  { value: 40, suffix: "%", label: { en: "faster iteration with AI-assisted prototyping", pt: "iteração mais rápida com protótipos assistidos por IA" } },
];

// Do mais antigo para o mais recente (ordem da linha do tempo).
export const EXPERIENCES_COPY: {
  company: Bi;
  role: Bi;
  location: Bi;
  start: string;
  end: string | null;
  headline: Bi;
  summary: Bi;
  highlights: BiList;
  shape: number;
}[] = [
  {
    company: { en: "Federal University of Alagoas (NTI)", pt: "Universidade Federal de Alagoas (NTI)" },
    role: { en: "UX/UI Designer & Front-end Developer", pt: "Designer UX/UI e Desenvolvedor Front-end" },
    location: { en: "Maceió, Brazil", pt: "Maceió, Brasil" },
    start: "2022",
    end: "2025",
    headline: { en: "Designed and *shipped* the university's asset platform", pt: "Desenhei e *entreguei* a plataforma de patrimônio da universidade" },
    summary: {
      en: "Designed and built the asset-management platform used across the university, from research and usability testing to the React front-end.",
      pt: "Desenhei e construí a plataforma de gestão de patrimônio usada em toda a universidade, da pesquisa e testes de usabilidade ao front-end em React.",
    },
    highlights: {
      en: [
        "Cut resource waste by 30% and sped up item allocation by 25% by redesigning the asset-exchange workflow",
        "Reached 90%+ user approval through iterative usability testing",
        "Designed and built 20+ front-end screens in React and TypeScript",
      ],
      pt: [
        "Reduzi o desperdício de recursos em 30% e acelerei a alocação de itens em 25% ao redesenhar o fluxo de troca de patrimônio",
        "Alcancei mais de 90% de aprovação dos usuários com testes de usabilidade iterativos",
        "Desenhei e construí mais de 20 telas de front-end em React e TypeScript",
      ],
    },
    shape: 2,
  },
  {
    company: { en: "Terrakrya", pt: "Terrakrya" },
    role: { en: "Product Owner & Junior Designer", pt: "Product Owner e Designer Jr." },
    location: { en: "Goiás, Brazil (remote)", pt: "Goiás, Brasil (remoto)" },
    start: "2022",
    end: "2023",
    headline: { en: "Learned to lead from the *backlog*", pt: "Aprendi a liderar pelo *backlog*" },
    summary: {
      en: "Owned the product backlog and kept clients, design and development aligned on environmental-tech products.",
      pt: "Fui responsável pelo backlog do produto e mantive clientes, design e desenvolvimento alinhados em produtos de tecnologia ambiental.",
    },
    highlights: {
      en: [
        "Increased task delivery by 50% by restructuring workflows and making demand transparent",
        "Reduced rework by 20% through iterative testing with users",
        "Introduced Scrum and continuous stakeholder communication",
      ],
      pt: [
        "Aumentei as entregas em 50% reorganizando os fluxos e dando transparência às demandas",
        "Reduzi o retrabalho em 20% com testes iterativos com usuários",
        "Implantei Scrum e comunicação contínua com os stakeholders",
      ],
    },
    shape: 3,
  },
  {
    company: { en: "Terrakrya", pt: "Terrakrya" },
    role: { en: "UI/UX Designer", pt: "Designer UI/UX" },
    location: { en: "Goiás, Brazil (remote)", pt: "Goiás, Brasil (remoto)" },
    start: "2023",
    end: "2026",
    headline: { en: "Turned paper workflows into *measurable* products", pt: "Transformei fluxos em papel em produtos *mensuráveis*" },
    summary: {
      en: "Led UX for environmental-monitoring products, replacing paper-based field workflows with digital tools.",
      pt: "Liderei o UX de produtos de monitoramento ambiental, trocando fluxos de campo em papel por ferramentas digitais.",
    },
    highlights: {
      en: [
        "Reduced task completion time by 66% and increased task success rate by 80%",
        "Cut time-to-market by 30% with Figma prototypes and real-time client feedback loops",
        "Partnered with engineering to meet technical and accessibility (WCAG) requirements",
      ],
      pt: [
        "Reduzi o tempo de conclusão das tarefas em 66% e aumentei a taxa de sucesso em 80%",
        "Reduzi o time-to-market em 30% com protótipos no Figma e feedback do cliente em tempo real",
        "Trabalhei com a engenharia para atender requisitos técnicos e de acessibilidade (WCAG)",
      ],
    },
    shape: 0,
  },
  {
    company: { en: "Cashew Inc.", pt: "Cashew Inc." },
    role: { en: "Co-founder & UX/Game Designer", pt: "Cofundador e Designer de UX/Games" },
    location: { en: "Maceió, Brazil", pt: "Maceió, Brasil" },
    start: "2024",
    end: "2026",
    headline: { en: "Built a game startup from *zero*", pt: "Construí uma startup de games do *zero*" },
    summary: {
      en: "Co-founded a game studio and led product, UX and pitch for Dungeon's Flavours.",
      pt: "Cofundei um estúdio de games e liderei produto, UX e pitch do Dungeon's Flavours.",
    },
    highlights: {
      en: [
        "Reached the penultimate stage of Startup Nordeste, 10th of 53 teams",
        "Reached 85% MVP approval in research with 15 players, then raised acceptance by 40% through rapid iteration",
        "Cut task development time by 50% with Scrum and Kanban, bridging art and engineering",
      ],
      pt: [
        "Chegamos à penúltima fase do Startup Nordeste, em 10º lugar entre 53 equipes",
        "Alcancei 85% de aprovação do MVP em pesquisa com 15 jogadores e aumentei a aceitação em 40% com iterações rápidas",
        "Reduzi o tempo de desenvolvimento das tarefas em 50% com Scrum e Kanban, conectando arte e programação",
      ],
    },
    shape: 1,
  },
  {
    company: { en: "Icarus Development", pt: "Icarus Development" },
    role: { en: "UI Game Designer", pt: "UI Game Designer" },
    location: { en: "California, US (remote)", pt: "Califórnia, EUA (remoto)" },
    start: "2025",
    end: "2025",
    headline: { en: "Clarity under pressure, for a *US* team", pt: "Clareza sob pressão, para um time dos *EUA*" },
    summary: {
      en: "Designed the HUD, in-game menus and onboarding flow for a mobile action game with a remote cross-functional team.",
      pt: "Desenhei o HUD, os menus e o onboarding de um jogo de ação mobile com um time remoto e multidisciplinar.",
    },
    highlights: {
      en: [
        "Designed onboarding and HUD screens focused on clarity for new players",
        "Delivered 15+ screens in Figma and Unity UI Toolkit across 2 time zones (Slack, Notion)",
        "Applied WCAG guidelines for readability across devices and resolutions",
      ],
      pt: [
        "Desenhei telas de onboarding e HUD com foco em clareza para novos jogadores",
        "Entreguei mais de 15 telas em Figma e Unity UI Toolkit, trabalhando em 2 fusos horários (Slack, Notion)",
        "Apliquei diretrizes WCAG para legibilidade em diferentes dispositivos e resoluções",
      ],
    },
    shape: 3,
  },
  {
    company: { en: "Edge Innovation Center", pt: "Centro de Inovação Edge" },
    role: { en: "UI/UX Designer · Squad Lead", pt: "Designer UI/UX · Líder de Squad" },
    location: { en: "Maceió, Brazil", pt: "Maceió, Brasil" },
    start: "2025",
    end: null,
    headline: { en: "Leading design across *4 products* at once", pt: "Liderando o design de *4 produtos* ao mesmo tempo" },
    summary: {
      en: "Lead a squad of 2 designers across 4 concurrent industry projects (Trucks, Azo, Prysmian, Game Levy), owning design standards and partnering with product and engineering.",
      pt: "Lidero um squad de 2 designers em 4 projetos simultâneos para a indústria (Trucks, Azo, Prysmian, Game Levy), cuidando dos padrões de design junto com produto e engenharia.",
    },
    highlights: {
      en: [
        "Led 2 designers across 4 simultaneous projects with shared interface standards",
        "Translated business requirements into a prioritized backlog with validated acceptance criteria",
        "Cut iteration time by 40% with AI-assisted prototyping (Cursor, Claude Code, Figma AI)",
      ],
      pt: [
        "Liderei 2 designers em 4 projetos simultâneos com padrões de interface compartilhados",
        "Transformei requisitos de negócio em backlog priorizado com critérios de aceite validados",
        "Reduzi o tempo de iteração em 40% com prototipação assistida por IA (Cursor, Claude Code, Figma AI)",
      ],
    },
    shape: 4,
  },
  {
    company: { en: "Zumbi Tech", pt: "Zumbi Tech" },
    role: { en: "CTO", pt: "CTO" },
    location: { en: "Maceió, Brazil", pt: "Maceió, Brasil" },
    start: "2026",
    end: null,
    headline: { en: "Design, code and business at *one table*", pt: "Design, código e negócio na *mesma mesa*" },
    summary: {
      en: "Lead technology and product for client systems, bridging UX/UI, engineering and business strategy.",
      pt: "Lidero tecnologia e produto dos sistemas para clientes, conectando UX/UI, engenharia e estratégia de negócio.",
    },
    highlights: {
      en: [
        "Lead internal and client-facing systems end to end",
        "Partner with stakeholders to frame business problems and define solutions",
        "Prototype and validate faster with AI tools (Claude Code, Gemini)",
      ],
      pt: [
        "Lidero sistemas internos e de clientes de ponta a ponta",
        "Trabalho com stakeholders para entender os problemas de negócio e definir as soluções",
        "Prototipo e valido mais rápido com ferramentas de IA (Claude Code, Gemini)",
      ],
    },
    shape: 0,
  },
];

export const SKILLS_COPY: { label: Bi; headline: Bi; stacks: BiList }[] = [
  {
    label: { en: "Product & UX", pt: "Produto & UX" },
    headline: { en: "Research-led decisions, validated with real users.", pt: "Decisões guiadas por pesquisa e validadas com usuários reais." },
    stacks: {
      en: ["User research", "Journey mapping", "Usability testing", "Wireframes & prototypes", "Accessibility (WCAG)"],
      pt: ["Pesquisa com usuários", "Mapa de jornada", "Testes de usabilidade", "Wireframes e protótipos", "Acessibilidade (WCAG)"],
    },
  },
  {
    label: { en: "UI & design systems", pt: "UI & design systems" },
    headline: { en: "Consistent interfaces that scale across products.", pt: "Interfaces consistentes que escalam entre produtos." },
    stacks: {
      en: ["Figma", "Design systems", "Interaction design", "Figma AI", "Adobe XD"],
      pt: ["Figma", "Design systems", "Design de interação", "Figma AI", "Adobe XD"],
    },
  },
  {
    label: { en: "Game UI", pt: "Game UI" },
    headline: { en: "Clarity under pressure: HUDs, menus and player feedback.", pt: "Clareza sob pressão: HUDs, menus e feedback ao jogador." },
    stacks: {
      en: ["Unity UI Toolkit", "Unreal Engine", "HUD design", "Gamification"],
      pt: ["Unity UI Toolkit", "Unreal Engine", "Design de HUD", "Gamificação"],
    },
  },
  {
    label: { en: "Front-end & AI", pt: "Front-end & IA" },
    headline: { en: "From prototype to production, faster.", pt: "Do protótipo à produção, mais rápido." },
    stacks: {
      en: ["React", "TypeScript", "Firebase", "Cursor", "Claude Code"],
      pt: ["React", "TypeScript", "Firebase", "Cursor", "Claude Code"],
    },
  },
  {
    label: { en: "Leadership & delivery", pt: "Liderança & entrega" },
    headline: { en: "Teams aligned, backlogs clear, deadlines met.", pt: "Times alinhados, backlog claro e prazos cumpridos." },
    stacks: {
      en: ["Squad leadership", "Stakeholder management", "Scrum & Kanban", "Roadmap & backlog", "Community building"],
      pt: ["Liderança de squad", "Gestão de stakeholders", "Scrum e Kanban", "Roadmap e backlog", "Construção de comunidade"],
    },
  },
];

export const PROCESS_COPY: { title: Bi; text: Bi }[] = [
  {
    title: { en: "Frame the problem", pt: "Enquadrar o problema" },
    text: {
      en: "Align stakeholders, PMs and engineers on the goal, the users and the success metric before any pixels.",
      pt: "Alinhar stakeholders, PMs e engenharia sobre o objetivo, os usuários e a métrica de sucesso antes de qualquer pixel.",
    },
  },
  {
    title: { en: "Find evidence", pt: "Buscar evidências" },
    text: {
      en: "Discovery, journey mapping and usability tests turn opinions into decisions the team trusts.",
      pt: "Discovery, mapa de jornada e testes de usabilidade transformam opiniões em decisões em que o time confia.",
    },
  },
  {
    title: { en: "Design & align", pt: "Desenhar e alinhar" },
    text: {
      en: "Prototype fast (AI-assisted), review early with stakeholders, document decisions and acceptance criteria.",
      pt: "Prototipar rápido (com IA), revisar cedo com stakeholders e documentar decisões e critérios de aceite.",
    },
  },
  {
    title: { en: "Ship & measure", pt: "Entregar e medir" },
    text: {
      en: "Check technical feasibility with engineering, deliver, and track the metric: task time, success rate, satisfaction.",
      pt: "Validar a viabilidade técnica com a engenharia, entregar e acompanhar a métrica: tempo de tarefa, taxa de sucesso, satisfação.",
    },
  },
];

export const VALUES_COPY: { title: Bi; text: Bi }[] = [
  {
    title: { en: "Clarity under pressure", pt: "Clareza sob pressão" },
    text: {
      en: "What I learned designing HUDs applies to every product: the right information, at the right moment.",
      pt: "O que aprendi desenhando HUDs vale para todo produto: a informação certa, no momento certo.",
    },
  },
  {
    title: { en: "Evidence over opinion", pt: "Evidência acima de opinião" },
    text: {
      en: "Usability tests and data settle debates faster than seniority.",
      pt: "Testes de usabilidade e dados resolvem discussões mais rápido que hierarquia.",
    },
  },
  {
    title: { en: "Design is a team sport", pt: "Design é esporte de equipe" },
    text: {
      en: "The best work happens when design, product and engineering own it together.",
      pt: "O melhor trabalho acontece quando design, produto e engenharia são donos dele juntos.",
    },
  },
];

export const GOALS_COPY: { title: Bi; text: Bi }[] = [
  {
    title: { en: "UI/UX or product design at a global company", pt: "UI/UX ou design de produto em uma empresa global" },
    text: {
      en: "Complex products used at scale, with metrics that matter.",
      pt: "Produtos complexos, usados em escala, com métricas que importam.",
    },
  },
  {
    title: { en: "Room to lead", pt: "Espaço para liderar" },
    text: {
      en: "Owning problems end to end and growing design practice within the team.",
      pt: "Assumir problemas de ponta a ponta e fortalecer a prática de design no time.",
    },
  },
  {
    title: { en: "Engagement-driven products", pt: "Produtos movidos a engajamento" },
    text: {
      en: "Games, interactive apps and products where engagement truly matters.",
      pt: "Games, apps interativos e produtos em que o engajamento realmente importa.",
    },
  },
];

export const EDUCATION_COPY: { course: Bi; institution: Bi; kind: string; start: string | null; end: string | null }[] = [
  { course: { en: "Design", pt: "Design" }, institution: { en: "Federal University of Alagoas (UFAL)", pt: "Universidade Federal de Alagoas (UFAL)" }, kind: "degree", start: "2021", end: "2026" },
  {
    course: { en: "Web Development", pt: "Informática para Internet" },
    institution: { en: "Federal Institute of Alagoas (IFAL)", pt: "Instituto Federal de Alagoas (IFAL)" },
    kind: "technical",
    start: "2017",
    end: "2021",
  },
  { course: { en: "Visual Effects", pt: "Efeitos Visuais" }, institution: { en: "Hollywood Film Academy", pt: "Hollywood Film Academy" }, kind: "course", start: "2022", end: "2022" },
  {
    course: { en: "International UX Career Masterclass", pt: "Masterclass Carreira Internacional em UX" },
    institution: { en: "Marcus Ferreira", pt: "Marcus Ferreira" },
    kind: "certification",
    start: null,
    end: null,
  },
];

export const AWARDS_COPY: { title: Bi; issuer: Bi; project: Bi | null; year: string | null }[] = [
  {
    title: { en: "Top 10 of 53 teams · penultimate stage", pt: "Top 10 entre 53 equipes · penúltima fase" },
    issuer: { en: "Startup Nordeste", pt: "Startup Nordeste" },
    project: { en: "Dungeon's Flavours", pt: "Dungeon's Flavours" },
    year: null,
  },
  {
    title: { en: "Local Leader, Maceió", pt: "Líder local em Maceió" },
    issuer: { en: "Interaction Design Foundation (IxDF)", pt: "Interaction Design Foundation (IxDF)" },
    project: null,
    year: "2025–2026",
  },
];

// Rascunhos de estudos de caso (ocultos até você revisar, pôr imagens e publicar).
export const PROJECTS_COPY: {
  slug: string;
  title: Bi;
  summary: Bi;
  role: Bi;
  client: Bi;
  year: string | null;
  description: Bi;
  outcome: Bi;
  tags: string[];
}[] = [
  {
    slug: "environmental-monitoring",
    title: { en: "Environmental field monitoring", pt: "Monitoramento ambiental em campo" },
    summary: {
      en: "Paper-based field monitoring → digital workflow tested with users → 66% faster tasks, 80% higher task success",
      pt: "Monitoramento em papel → fluxo digital testado com usuários → tarefas 66% mais rápidas e 80% mais sucesso",
    },
    role: { en: "UI/UX Designer", pt: "Designer UI/UX" },
    client: { en: "Terrakrya", pt: "Terrakrya" },
    year: null,
    description: {
      en: "Field teams recorded environmental monitoring on paper. I led the UX to digitize these workflows, from prototypes in Figma to usability testing with users.",
      pt: "As equipes de campo registravam o monitoramento ambiental em papel. Liderei o UX para digitalizar esses fluxos, dos protótipos no Figma aos testes de usabilidade com usuários.",
    },
    outcome: {
      en: "66% less time to complete tasks and an 80% higher task success rate. Time-to-market cut by 30% through real-time feedback loops with the client.",
      pt: "66% menos tempo para concluir tarefas e 80% mais sucesso na conclusão. Time-to-market 30% menor com ciclos de feedback em tempo real com o cliente.",
    },
    tags: ["Figma", "Usability testing", "Prototyping"],
  },
  {
    slug: "university-asset-platform",
    title: { en: "University asset management platform", pt: "Plataforma de gestão de patrimônio da UFAL" },
    summary: {
      en: "Slow asset exchanges → redesigned workflow + React front-end → 30% less waste, 25% faster allocation, 90%+ approval",
      pt: "Trocas de patrimônio lentas → novo fluxo + front-end em React → 30% menos desperdício, alocação 25% mais rápida, 90%+ de aprovação",
    },
    role: { en: "UX/UI Designer & Front-end Developer", pt: "Designer UX/UI e Desenvolvedor Front-end" },
    client: { en: "Federal University of Alagoas (UFAL)", pt: "Universidade Federal de Alagoas (UFAL)" },
    year: "2022–2025",
    description: {
      en: "An integrated platform to manage the university's academic assets, synced with the federal asset system (SIPAC).",
      pt: "Uma plataforma integrada para gerir o patrimônio acadêmico da universidade, sincronizada com o sistema federal de patrimônio (SIPAC).",
    },
    outcome: {
      en: "Resource waste down 30%, item allocation 25% faster and 90%+ user approval. 20+ screens designed and built in React and TypeScript.",
      pt: "Desperdício de recursos 30% menor, alocação de itens 25% mais rápida e mais de 90% de aprovação. Mais de 20 telas desenhadas e construídas em React e TypeScript.",
    },
    tags: ["React", "TypeScript", "Firebase", "Figma"],
  },
  {
    slug: "dungeons-flavours",
    title: { en: "Dungeon's Flavours", pt: "Dungeon's Flavours" },
    summary: {
      en: "Unvalidated game concept → research with 15 players + rapid iteration → 85% MVP approval, top 10 of 53 at Startup Nordeste",
      pt: "Conceito de jogo sem validação → pesquisa com 15 jogadores + iteração rápida → 85% de aprovação do MVP, top 10 entre 53 no Startup Nordeste",
    },
    role: { en: "Co-founder · UX/Game Designer", pt: "Cofundador · Designer de UX/Games" },
    client: { en: "Cashew Inc.", pt: "Cashew Inc." },
    year: null,
    description: {
      en: "A game by Cashew Inc., the startup I co-founded, taken from concept to the penultimate stage of Startup Nordeste.",
      pt: "Um jogo da Cashew Inc., a startup que cofundei, levado do conceito à penúltima fase do Startup Nordeste.",
    },
    outcome: {
      en: "85% MVP approval in research with 15 players, 40% higher acceptance after rapid iterations, and 10th place among 53 teams.",
      pt: "85% de aprovação do MVP em pesquisa com 15 jogadores, aceitação 40% maior após iterações rápidas e 10º lugar entre 53 equipes.",
    },
    tags: ["Game design", "UX research", "Pitch"],
  },
  {
    slug: "edge-design-leadership",
    title: { en: "Design leadership at Edge", pt: "Liderança de design no Edge" },
    summary: {
      en: "4 concurrent industry projects (incl. Prysmian) → shared standards + AI-assisted prototyping → 40% faster iteration",
      pt: "4 projetos simultâneos para a indústria (incl. Prysmian) → padrões compartilhados + protótipos com IA → iteração 40% mais rápida",
    },
    role: { en: "UI/UX Designer · Squad Lead", pt: "Designer UI/UX · Líder de Squad" },
    client: { en: "Edge Innovation Center", pt: "Centro de Inovação Edge" },
    year: "2025",
    description: {
      en: "Leading a squad of 2 designers across 4 simultaneous projects for industry clients: Trucks, Azo, Prysmian and Game Levy.",
      pt: "Liderando um squad de 2 designers em 4 projetos simultâneos para clientes da indústria: Trucks, Azo, Prysmian e Game Levy.",
    },
    outcome: {
      en: "Shared interface standards across all deliverables and 40% less iteration time with AI-assisted prototyping (Cursor, Claude Code, Figma AI).",
      pt: "Padrões de interface compartilhados em todas as entregas e 40% menos tempo de iteração com prototipação assistida por IA (Cursor, Claude Code, Figma AI).",
    },
    tags: ["Design leadership", "Design systems", "AI prototyping"],
  },
];
