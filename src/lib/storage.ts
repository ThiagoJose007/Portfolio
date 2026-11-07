import { createReadStream } from "fs";
import { mkdir, stat, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { Readable } from "stream";

// Arquivos enviados pelo admin (fotos, capas, galeria, CV). Em produção o
// diretório deve apontar para um Volume do Railway (ex.: UPLOAD_DIR=/data/uploads);
// o container é recriado a cada deploy, então nada pode ficar fora do volume.
// Para trocar por Cloudinary/S3 no futuro, basta reimplementar este módulo.

export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
export const MEDIA_PREFIX = "/media/";
export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

const EXT_TO_TYPE = Object.fromEntries(Object.entries(TYPES).map(([type, ext]) => [ext, type]));

// Só aceita nomes gerados por nós (uuid + extensão conhecida).
const SAFE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp|gif|avif|pdf|mp4|webm)$/;

export class UploadError extends Error {}

export async function saveUpload(file: File) {
  const ext = TYPES[file.type];
  if (!ext) throw new UploadError("Formato não suportado. Use JPG, PNG, WEBP, GIF, AVIF, PDF, MP4 ou WEBM.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Arquivo maior que 25 MB.");

  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `${MEDIA_PREFIX}${name}`;
}

export async function openUpload(name: string) {
  if (!SAFE_NAME.test(name)) return null;
  const filePath = path.join(UPLOAD_DIR, name);
  try {
    const info = await stat(filePath);
    return {
      size: info.size,
      type: EXT_TO_TYPE[path.extname(name)] ?? "application/octet-stream",
      stream: Readable.toWeb(createReadStream(filePath)) as ReadableStream,
    };
  } catch {
    return null;
  }
}
