import { prisma } from "@/lib/prisma";
import * as defaults from "@/content/site";

// Copia o conteúdo de fábrica (src/content/site.ts) para o banco. Só preenche
// o que ainda não existe, então pode ser executado mais de uma vez sem
// sobrescrever nada que já foi editado no admin.
export async function seedContent() {
  const created: string[] = [];

  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  if (!profile) {
    const { name, initials, role, location, timeZone, availability, email, socials } = defaults.profile;
    await prisma.profile.create({
      data: {
        id: "main",
        name,
        initials,
        role,
        location,
        timeZone,
        availability,
        email,
        socials,
        tldrBasedIn: location,
        tldrSkillset: defaults.skills.flatMap((group) => group.stacks).slice(0, 10).join(", "),
      },
    });
    created.push("perfil");
  }

  if ((await prisma.experience.count()) === 0) {
    const chapters = defaults.career.chapters.slice(0, -1);
    await prisma.experience.createMany({
      data: chapters.map((chapter, order) => {
        const [start, end] = chapter.period.split(" — ");
        return {
          company: chapter.place,
          role: chapter.role,
          start,
          end: end === "hoje" ? null : (end ?? null),
          headline: chapter.title,
          summary: chapter.text,
          shape: chapter.shape,
          order,
        };
      }),
    });
    created.push("experiências");
  }

  if ((await prisma.skillGroup.count()) === 0) {
    await prisma.skillGroup.createMany({
      data: defaults.skills.map(({ label, headline, stacks }, order) => ({ label, headline, stacks, order })),
    });
    created.push("skills");
  }

  if ((await prisma.stat.count()) === 0) {
    await prisma.stat.createMany({
      data: defaults.about.stats.map(({ value, suffix, label }, order) => ({ value, suffix, label, order })),
    });
    created.push("números");
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: defaults.testimonials.items.map(({ quote, name, role }, order) => ({ quote, name, role, order })),
    });
    created.push("depoimentos");
  }

  return created;
}
