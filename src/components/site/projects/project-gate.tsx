import type { ShowcaseProject } from "@/lib/projects";
import type { UiStrings } from "@/lib/i18n/ui";
import { Accent, Eyebrow } from "../accent";
import { unlockProject } from "../project-actions";

// Estudo de caso protegido: mostra título e resumo e pede a senha.
export function ProjectGate({
  project,
  path,
  denied,
  email,
  ui,
}: {
  project: ShowcaseProject;
  path: string;
  denied: boolean;
  email: string;
  ui: UiStrings;
}) {
  const unlock = unlockProject.bind(null, project.id, path);
  const meta = [project.role, project.client, project.year].filter(Boolean).join(" · ");

  return (
    <section className="relative flex min-h-svh flex-col justify-center px-5 pb-[10vh] pt-[22vh] md:px-8">
      <Eyebrow>{ui.project.eyebrow}</Eyebrow>
      <h1 className="mt-6 max-w-[18ch] text-[clamp(2.6rem,6.5vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.04em]">
        {project.title}
      </h1>
      {meta && <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{meta}</p>}
      <p className="mt-6 max-w-2xl text-xl leading-snug text-cream/75">{project.summary}</p>

      <div className="mt-12 max-w-xl rounded-[28px] border border-cream/12 bg-cream/[0.04] p-7 md:p-9">
        <p className="text-2xl font-medium tracking-tight">
          <Accent text={ui.gate.title} />
        </p>
        <p className="mt-3 text-cream/70">{ui.gate.text}</p>
        <form action={unlock} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder={ui.gate.placeholder}
            aria-label={ui.gate.placeholder}
            className="flex-1 rounded-full border border-cream/25 bg-transparent px-5 py-3 text-cream outline-none placeholder:text-cream/40 focus:border-cream"
          />
          <button
            type="submit"
            className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-accent"
          >
            {ui.gate.submit}
          </button>
        </form>
        {denied && (
          <p role="alert" className="mt-3 text-sm text-accent">
            {ui.gate.wrong}
          </p>
        )}
        <p className="mt-5 text-sm text-cream/55">
          {ui.gate.ask}{" "}
          <a href={`mailto:${email}`} className="link-underline text-cream">
            {email}
          </a>
        </p>
      </div>
    </section>
  );
}
