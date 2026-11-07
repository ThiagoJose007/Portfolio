import { getSiteContent } from "@/lib/content/load";
import { prisma } from "@/lib/prisma";
import { Field, SubmitButton } from "../_components/fields";
import { saveProfile } from "./actions";
import { PROFILE_SECTIONS } from "./fields";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ salvo?: string }> }) {
  const { salvo } = await searchParams;
  const row = await prisma.profile.findUnique({ where: { id: "main" } });

  // Sem registro ainda: começa com os valores que o site está mostrando.
  let values: Record<string, unknown>;
  if (row) {
    values = { ...row };
  } else {
    const { profile } = await getSiteContent();
    values = {
      ...profile,
      tldrCareer: profile.tldr.career,
      tldrBasedIn: profile.tldr.basedIn,
      tldrSkillset: profile.tldr.skillset,
      tldrExperience: profile.tldr.experience,
      tldrLanguages: profile.tldr.languages,
    };
  }
  const socials = Array.isArray(values.socials) ? (values.socials as { label: string; href: string }[]) : [];
  values.socials = socials.map((social) => `${social.label} | ${social.href}`);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-2xl font-semibold">Perfil</h1>
      <p className="mb-6 text-sm text-gray-500">Dados pessoais que aparecem em todas as versões do site.</p>
      {salvo && <p className="mb-6 rounded bg-green-50 p-3 text-sm text-green-700">Perfil salvo.</p>}

      <form action={saveProfile} className="flex flex-col gap-10">
        {PROFILE_SECTIONS.map((section) => (
          <fieldset key={section.title} className="flex flex-col gap-4">
            <legend className="mb-1 text-lg font-medium">{section.title}</legend>
            {section.description && <p className="-mt-2 text-sm text-gray-500">{section.description}</p>}
            {section.fields.map((field) => (
              <Field key={field.name} field={field} value={values[field.name]} />
            ))}
          </fieldset>
        ))}
        <SubmitButton>Salvar perfil</SubmitButton>
      </form>
    </div>
  );
}
