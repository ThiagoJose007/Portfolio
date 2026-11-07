// Renderiza "texto com *destaque*" trocando os trechos entre asteriscos
// por itálico serifado.
export function Accent({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <em key={i} className="font-serif font-normal italic">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}

// Rótulo mono no estilo "[■] TEXTO" usado nas seções.
export function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      <span className="inline-block size-1.5 bg-accent" />
      {index && <span className="opacity-70">{index}</span>}
      {children}
    </p>
  );
}
