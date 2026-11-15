import { prisma } from "@/lib/prisma";

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

  await prisma.linkItem.updateMany({ where: { id, visible: true }, data: { clicks: { increment: 1 } } });
  return new Response(null, { status: 204 });
}
