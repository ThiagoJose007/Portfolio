import { saveUpload, UploadError } from "@/lib/storage";

// Upload do admin (protegido pelo Basic Auth do proxy, que cobre /admin/*).
// Fica fora das Server Actions para não esbarrar no limite de 1 MB delas.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  try {
    const url = await saveUpload(file);
    return Response.json({ url });
  } catch (error) {
    if (error instanceof UploadError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
