import type { FieldDef } from "../_components/field-defs";

export const PROFILE_SECTIONS: { title: string; description?: string; fields: FieldDef[] }[] = [
  {
    title: "Identificação",
    fields: [
      { name: "name", label: "Nome", type: "text", required: true },
      { name: "initials", label: "Iniciais", type: "text", required: true, help: "Usadas no logo e na forma 3D." },
      { name: "role", label: "Cargo / título", type: "text", required: true },
      { name: "location", label: "Cidade", type: "text", required: true },
      { name: "timeZone", label: "Fuso horário", type: "text", required: true, help: "Ex.: America/Maceio — usado no relógio do topo." },
      { name: "availability", label: "Disponibilidade", type: "text", required: true },
      { name: "photo", label: "Foto", type: "image", nullable: true },
    ],
  },
  {
    title: "Contato",
    fields: [
      { name: "email", label: "E-mail", type: "text", required: true },
      { name: "cvUrl", label: "Currículo (PDF)", type: "file", nullable: true },
      {
        name: "socials",
        label: "Redes",
        type: "list",
        help: "Uma por linha, no formato: Nome | https://link",
        placeholder: "LinkedIn | https://linkedin.com/in/seu-perfil",
      },
    ],
  },
  {
    title: "Resumo em 30 segundos (TL;DR)",
    description: "O bloco de leitura rápida para recrutadores.",
    fields: [
      { name: "tldrCareer", label: "Carreira", type: "text", placeholder: "5+ anos em produto · 3 em front-end" },
      { name: "tldrBasedIn", label: "Onde estou", type: "text", placeholder: "Maceió, Brasil · remoto ou híbrido" },
      { name: "tldrSkillset", label: "Skillset", type: "textarea", rows: 2 },
      { name: "tldrExperience", label: "Experiência com", type: "text", placeholder: "Web, mobile, SaaS B2B…" },
      { name: "tldrLanguages", label: "Idiomas", type: "text", placeholder: "Português, Inglês (avançado)" },
    ],
  },
  {
    title: "Sobre mim",
    fields: [{ name: "bio", label: "Bio", type: "textarea", rows: 6, help: "Texto em primeira pessoa para a página Sobre." }],
  },
  {
    title: "Freelancer",
    fields: [
      {
        name: "freelanceEnabled",
        label: "Mostrar a seção de freelancer no site",
        type: "boolean",
        help: "Os serviços ficam em Conteúdo → Freelancer.",
      },
    ],
  },
];

export const PROFILE_FIELDS = PROFILE_SECTIONS.flatMap((section) => section.fields);
