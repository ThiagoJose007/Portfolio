import type { CareerChapter, SceneShape, SkillGroup, Testimonial } from "@/content/site";

// Formato serializável do conteúdo do site, montado no servidor
// (src/lib/content/load.ts) e entregue aos componentes client via contexto.

export type SocialLink = { label: string; href: string };

export type Profile = {
  name: string;
  initials: string;
  role: string;
  location: string;
  timeZone: string;
  availability: string;
  email: string;
  photo: string | null;
  cvUrl: string | null;
  socials: SocialLink[];
  bio: string;
  tldr: {
    career: string;
    basedIn: string;
    skillset: string;
    experience: string;
    languages: string;
  };
  freelanceEnabled: boolean;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start: string;
  end: string | null;
  period: string;
  headline: string;
  summary: string;
  highlights: string[];
  shape: SceneShape;
};

export type EducationItem = {
  id: string;
  institution: string;
  course: string;
  kind: string;
  period: string;
  description: string | null;
};

export type SimpleItem = { id: string; title: string; text: string };

export type AwardItem = { id: string; title: string; issuer: string; project: string | null; year: string | null };

export type StatItem = { value: number; suffix: string; label: string };

export type SiteContent = {
  profile: Profile;
  texts: Record<string, string>;
  hero: { eyebrow: string; title: string; intro: string; tags: string[] };
  about: { label: string; manifesto: string; stats: StatItem[] };
  skills: { label: string; title: string; groups: SkillGroup[] };
  career: { label: string; title: string; chapters: CareerChapter[] };
  experiences: ExperienceItem[];
  education: EducationItem[];
  process: SimpleItem[];
  values: SimpleItem[];
  hobbies: SimpleItem[];
  goals: SimpleItem[];
  services: SimpleItem[];
  awards: AwardItem[];
  testimonials: { label: string; title: string; items: Testimonial[] };
  contact: { label: string; title: string; text: string; cta: string };
  projects: { title: string };
  freelance: { title: string; text: string };
};
