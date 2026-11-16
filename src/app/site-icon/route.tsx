import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import * as defaults from "@/content/site";

// Ícone do site (aba do navegador, atalho no celular). Usa a imagem enviada
// em /admin/perfil ("Ícone do site"); sem ela, gera um círculo laranja com as
// iniciais. Tamanho por ?size= (32 a 512, padrão 64).
export async function GET(request: Request) {
  const requested = Number(new URL(request.url).searchParams.get("size")) || 64;
  const size = Math.min(512, Math.max(32, Math.round(requested)));

  let favicon: string | null = null;
  let initials = defaults.profile.initials;
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: "main" },
      select: { favicon: true, initials: true },
    });
    favicon = profile?.favicon ?? null;
    initials = profile?.initials || initials;
  } catch {
    // Banco fora do ar: segue com as iniciais padrão.
  }

  const cache = { "Cache-Control": "public, max-age=300" };
  if (favicon) {
    return Response.redirect(new URL(favicon, request.url), 302);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#ff5f2e",
          color: "#0c0c0e",
          fontSize: size * 0.42,
          fontWeight: 700,
          letterSpacing: -size * 0.02,
        }}
      >
        {initials.slice(0, 3).toUpperCase()}
      </div>
    ),
    { width: size, height: size, headers: cache },
  );
}
