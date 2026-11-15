"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/content/load";
import { readFields } from "../_components/field-defs";
import { LINKS_SETTINGS_FIELDS } from "./fields";

const refresh = () => {
  revalidatePath("/admin/links");
  revalidatePath("/", "layout");
};

// Cabeçalho da página /links: foto, bio curta, CV e cards automáticos.
// Ficam no Perfil (o CV é o mesmo do resto do site).
export async function saveLinksSettings(formData: FormData) {
  const data = readFields(LINKS_SETTINGS_FIELDS, formData) as {
    linksPhoto: string | null;
    linksBio: string;
    cvUrl: string | null;
    linksShowCv: boolean;
    linksShowPortfolio: boolean;
  };

  const profile = await prisma.profile.findUnique({ where: { id: "main" } });
  if (!profile) throw new Error('Importe o conteúdo no Painel ("Importar conteúdo atual") antes de editar os links.');
  await prisma.profile.update({ where: { id: "main" }, data });

  refresh();
  redirect("/admin/links?salvo=1");
}

// Primeiros cards a partir do Perfil: redes sociais e e-mail.
export async function createLinksFromProfile() {
  if ((await prisma.linkItem.count()) > 0) redirect("/admin/links");
  const { profile } = await getSiteContent();
  const items = [
    ...profile.socials.map((social) => ({ title: social.label, url: social.href })),
    { title: "E-mail", url: `mailto:${profile.email}`, description: profile.email },
  ];
  await prisma.linkItem.createMany({
    data: items.map((item, order) => ({ ...item, order, size: order === 0 ? "wide" : "small" })),
  });
  refresh();
  redirect("/admin/links");
}

export async function resetLinkClicks(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.linkItem.update({ where: { id }, data: { clicks: 0 } });
  refresh();
}
