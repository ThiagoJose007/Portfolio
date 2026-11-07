import { openUpload } from "@/lib/storage";

// Entrega os arquivos enviados pelo admin. Os nomes são únicos (uuid), então
// o conteúdo de uma URL nunca muda e pode ficar em cache para sempre.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const file = await openUpload(name);
  if (!file) return new Response("Arquivo não encontrado", { status: 404 });

  return new Response(file.stream, {
    headers: {
      "Content-Type": file.type,
      "Content-Length": String(file.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
