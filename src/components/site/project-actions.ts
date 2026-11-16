"use server";

import { redirect } from "next/navigation";
import { grantProjectAccess } from "@/lib/project-access";

// Formulário de senha do estudo de caso: certo → volta liberado; errado →
// volta com ?acesso=negado para mostrar o aviso.
export async function unlockProject(projectId: string, path: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  const ok = password ? await grantProjectAccess(projectId, password) : false;
  redirect(ok ? safePath : `${safePath}?acesso=negado`);
}
