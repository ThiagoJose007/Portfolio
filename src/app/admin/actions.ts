"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { seedContent } from "@/lib/content/seed";

export async function importDefaultContent() {
  const created = await seedContent();
  revalidatePath("/", "layout");
  redirect(`/admin?importado=${encodeURIComponent(created.join(", ") || "nada")}`);
}
