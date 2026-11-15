import { prisma } from "@/lib/prisma";

const AUTO_COUNTERS: Record<string, "linksCvClicks" | "linksPortfolioClicks"> = {
  "auto:cv": "linksCvClicks",
  "auto:portfolio": "linksPortfolioClicks",
};

const BOT = /bot|crawl|spider|preview|facebookexternalhit|whatsapp|slack|telegram|discord|linkedin|embedly/i;

// Conta um clique num card da página /links. Recebe { id } via
// navigator.sendBeacon (o link abre normalmente, sem esperar esta resposta).
export async function POST(request: Request) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) return new Response(null, { status: 204 });

  const body = await request.text().catch(() => "");
  let id = "";
  try {
    id = String((JSON.parse(body) as { id?: unknown }).id ?? "");
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!id) return new Response(null, { status: 400 });

  // Cards automáticos (Portfolio e Currículo) contam no Perfil.
  const auto = AUTO_COUNTERS[id];
  if (auto) {
    await prisma.profile.updateMany({ where: { id: "main" }, data: { [auto]: { increment: 1 } } });
  } else {
    await prisma.linkItem.updateMany({ where: { id, visible: true }, data: { clicks: { increment: 1 } } });
  }
  return new Response(null, { status: 204 });
}
