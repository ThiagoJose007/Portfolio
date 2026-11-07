import type { ShowcaseProject } from "@/lib/projects";

// Matiz estável por projeto, para a capa gerada quando não há imagem.
function hueFrom(text: string) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

export function ProjectCover({
  project,
  className = "",
}: {
  project: ShowcaseProject;
  className?: string;
}) {
  if (project.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- URLs externas cadastradas no admin
      <img
        src={project.coverImage}
        alt=""
        draggable={false}
        className={`size-full object-cover ${className}`}
      />
    );
  }

  const hue = hueFrom(project.slug);
  return (
    <div
      className={`relative grid size-full place-items-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, hsl(${hue} 85% 62%), transparent 60%),
          radial-gradient(90% 80% at 90% 100%, hsl(${(hue + 60) % 360} 80% 45%), transparent 65%),
          hsl(${hue} 30% 12%)`,
      }}
    >
      <span className="font-serif text-[clamp(5rem,14vw,12rem)] italic leading-none text-cream/90 mix-blend-overlay">
        {project.title.charAt(0)}
      </span>
    </div>
  );
}
