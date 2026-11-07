"use client";

import { useId, useState } from "react";

async function upload(file: File) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch("/admin/upload", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!response.ok || !data.url) throw new Error(data.error ?? "Falha no upload.");
  return data.url;
}

const isImage = (url: string) => /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url) || url.startsWith("data:image");

function Preview({ url }: { url: string }) {
  if (!url) return null;
  if (isImage(url)) {
    // eslint-disable-next-line @next/next/no-img-element -- prévia no admin
    return <img src={url} alt="" className="h-24 w-auto rounded border border-gray-200 object-cover" />;
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
      Abrir arquivo atual
    </a>
  );
}

// Campo de arquivo único: aceita upload (salvo no volume) ou uma URL colada.
export function UploadField({
  name,
  label,
  defaultValue,
  accept = "image/*",
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  accept?: string;
  help?: string;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue ?? "");
  const [status, setStatus] = useState<string | null>(null);

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setStatus("Enviando…");
    try {
      setValue(await upload(file));
      setStatus(null);
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <label htmlFor={id}>{label}</label>
      <div className="flex items-start gap-3">
        <Preview url={value} />
        <div className="flex flex-1 flex-col gap-2">
          <input
            id={id}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Envie um arquivo ou cole uma URL"
            className="rounded border border-gray-300 px-3 py-2"
          />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded border border-gray-300 bg-gray-50 px-3 py-1 text-xs hover:bg-gray-100">
              Enviar arquivo
              <input type="file" accept={accept} onChange={onFile} className="hidden" />
            </label>
            {value && (
              <button type="button" onClick={() => setValue("")} className="text-xs text-red-600">
                Remover
              </button>
            )}
            {status && <span className="text-xs text-gray-500">{status}</span>}
          </div>
        </div>
      </div>
      {help && <p className="text-xs text-gray-500">{help}</p>}
    </div>
  );
}

// Lista de imagens (galeria). O valor vai para o servidor como uma URL por linha.
export function GalleryField({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string[] }) {
  const [items, setItems] = useState<string[]>(defaultValue ?? []);
  const [pasted, setPasted] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const onFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setStatus(`Enviando ${files.length} arquivo(s)…`);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await upload(file));
      setItems((current) => [...current, ...urls]);
      setStatus(null);
    } catch (error) {
      setStatus((error as Error).message);
    }
  };

  const move = (from: number, to: number) =>
    setItems((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span>{label}</span>
      <input type="hidden" name={name} value={items.join("\n")} />
      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {items.map((url, i) => (
            <li key={`${url}-${i}`} className="flex flex-col gap-1 rounded border border-gray-200 p-2">
              {isImage(url) ? (
                // eslint-disable-next-line @next/next/no-img-element -- prévia no admin
                <img src={url} alt="" className="aspect-video w-full rounded object-cover" />
              ) : (
                <span className="truncate text-xs">{url}</span>
              )}
              <div className="flex justify-between text-xs">
                <span className="flex gap-2">
                  <button type="button" onClick={() => move(i, i - 1)} aria-label="Mover para trás">
                    ←
                  </button>
                  <button type="button" onClick={() => move(i, i + 1)} aria-label="Mover para frente">
                    →
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => setItems((current) => current.filter((_, j) => j !== i))}
                  className="text-red-600"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded border border-gray-300 bg-gray-50 px-3 py-1 text-xs hover:bg-gray-100">
          Enviar imagens
          <input type="file" accept="image/*" multiple onChange={onFiles} className="hidden" />
        </label>
        <input
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          placeholder="…ou cole uma URL"
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
        />
        <button
          type="button"
          onClick={() => {
            if (!pasted.trim()) return;
            setItems((current) => [...current, pasted.trim()]);
            setPasted("");
          }}
          className="text-xs text-blue-600"
        >
          Adicionar
        </button>
        {status && <span className="text-xs text-gray-500">{status}</span>}
      </div>
    </div>
  );
}
