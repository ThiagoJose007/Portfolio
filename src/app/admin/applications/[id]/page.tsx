import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPeriod } from "@/lib/content/load";
import {
  updateApplication,
  deleteApplication,
  addProjectToApplication,
  removeProjectFromApplication,
  updateApplicationProject,
  addExperienceToApplication,
  removeExperienceFromApplication,
  updateApplicationExperience,
} from "../actions";

export const dynamic = "force-dynamic";

const inputClass = "rounded border border-gray-300 px-3 py-2";
const dateTime = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Maceio" });

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      projects: { include: { project: true }, orderBy: { order: "asc" } },
      experiences: { include: { experience: true }, orderBy: { order: "asc" } },
    },
  });
  if (!application) notFound();

  const [availableProjects, availableExperiences] = await Promise.all([
    prisma.project.findMany({
      where: { id: { notIn: application.projects.map((p) => p.projectId) } },
      orderBy: { title: "asc" },
    }),
    prisma.experience.findMany({
      where: { id: { notIn: application.experiences.map((e) => e.experienceId) } },
      orderBy: { order: "asc" },
    }),
  ]);

  const updateApplicationWithId = updateApplication.bind(null, application.id);
  const addProjectWithId = addProjectToApplication.bind(null, application.id);
  const addExperienceWithId = addExperienceToApplication.bind(null, application.id);
  const isDefault = application.isDefault;
  const publicPath = isDefault ? "/" : `/${application.slug}`;

  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link href="/admin/applications" className="text-sm text-gray-500 hover:underline">
        ← Candidaturas
      </Link>
      <div className="mb-6 mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isDefault ? "Versão geral" : `${application.companyName} — ${application.roleTitle}`}
        </h1>
        <form action={deleteApplication}>
          <input type="hidden" name="applicationId" value={application.id} />
          <button type="submit" className="text-sm text-red-600">
            Excluir
          </button>
        </form>
      </div>

      <div className="mb-8 grid gap-3 rounded bg-gray-50 p-4 text-sm text-gray-700 sm:grid-cols-2">
        <p>
          Endereço: <code className="font-medium">{publicPath}</code>
          <br />
          <a href={`${publicPath}?preview=1`} target="_blank" rel="noreferrer" className="text-blue-600 underline">
            Abrir prévia ↗
          </a>{" "}
          <span className="text-xs text-gray-500">(não conta como visita)</span>
        </p>
        {isDefault ? (
          <p className="text-gray-500">
            É o que aparece para quem acessa o site sem um link de candidatura. Pública e indexada no Google.
          </p>
        ) : (
          <p>
            Visitas: <strong>{application.viewCount}</strong>
            {application.firstViewedAt && (
              <>
                <br />
                Primeira: {dateTime.format(application.firstViewedAt)}
              </>
            )}
            {application.lastViewedAt && (
              <>
                <br />
                Última: {dateTime.format(application.lastViewedAt)}
              </>
            )}
          </p>
        )}
      </div>

      <section className="mb-12">
        <h2 className="mb-3 text-lg font-medium">{isDefault ? "Abertura" : "Dados da candidatura"}</h2>
        <form action={updateApplicationWithId} className="flex flex-col gap-4">
          {!isDefault && (
            <>
              <label className="flex flex-col gap-1 text-sm">
                Empresa
                <input name="companyName" defaultValue={application.companyName} required className={inputClass} />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Vaga
                <input name="roleTitle" defaultValue={application.roleTitle} required className={inputClass} />
              </label>
            </>
          )}
          <label className="flex flex-col gap-1 text-sm">
            {isDefault ? "Texto de abertura (vazio = texto do Hero em Textos)" : "Texto de introdução"}
            <textarea
              name="introText"
              defaultValue={application.introText}
              required={!isDefault}
              rows={4}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Texto de chamada (opcional)
            <input name="ctaText" defaultValue={application.ctaText ?? ""} className={inputClass} />
          </label>
          {!isDefault && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                Status
                <select name="status" defaultValue={application.status} className={inputClass}>
                  <option value="DRAFT">Rascunho</option>
                  <option value="SENT">Enviado (vira &quot;Visualizado&quot; na 1ª visita)</option>
                  <option value="VIEWED">Visualizado</option>
                  <option value="ARCHIVED">Arquivado (link desativado)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Link expira em (opcional)
                <input
                  type="date"
                  name="expiresAt"
                  defaultValue={application.expiresAt?.toISOString().slice(0, 10) ?? ""}
                  className={inputClass}
                />
              </label>
            </div>
          )}
          <button type="submit" className="mt-2 self-start rounded bg-black px-4 py-2 text-sm text-white">
            Salvar
          </button>
        </form>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-lg font-medium">Projetos</h2>
        <p className="mb-4 text-sm text-gray-500">
          Sem nenhum projeto escolhido, aparecem todos os projetos marcados como visíveis.
        </p>
        <ul className="flex flex-col gap-4">
          {application.projects.map((applicationProject) => (
            <li key={applicationProject.id} className="rounded border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">{applicationProject.project.title}</p>
                <form action={removeProjectFromApplication}>
                  <input type="hidden" name="applicationProjectId" value={applicationProject.id} />
                  <input type="hidden" name="applicationId" value={application.id} />
                  <button type="submit" className="text-sm text-red-600">
                    Remover
                  </button>
                </form>
              </div>
              <form action={updateApplicationProject} className="flex flex-col gap-3">
                <input type="hidden" name="applicationProjectId" value={applicationProject.id} />
                <input type="hidden" name="applicationId" value={application.id} />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    Ordem
                    <input
                      type="number"
                      name="order"
                      defaultValue={applicationProject.order}
                      className="w-16 rounded border border-gray-300 px-2 py-1"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="highlighted" defaultChecked={applicationProject.highlighted} />
                    Destaque
                  </label>
                </div>
                <label className="flex flex-col gap-1 text-sm">
                  Contexto personalizado para esta vaga (opcional — substitui o &quot;Contexto&quot; do estudo de caso)
                  <textarea
                    name="customDescription"
                    defaultValue={applicationProject.customDescription ?? ""}
                    rows={2}
                    className={inputClass}
                  />
                </label>
                <button type="submit" className="self-start rounded bg-gray-100 px-3 py-1 text-sm">
                  Salvar
                </button>
              </form>
            </li>
          ))}
        </ul>
        {availableProjects.length > 0 && (
          <div className="mt-4 rounded border border-dashed border-gray-300 p-3">
            <p className="mb-2 text-sm font-medium">Adicionar projeto</p>
            <ul className="flex flex-col gap-1">
              {availableProjects.map((project) => (
                <li key={project.id} className="flex items-center justify-between text-sm">
                  <span>
                    {project.title}
                    {!project.visible && <span className="ml-2 text-xs text-gray-400">(oculto na versão geral)</span>}
                  </span>
                  <form action={addProjectWithId}>
                    <input type="hidden" name="projectId" value={project.id} />
                    <button type="submit" className="text-blue-600">
                      Adicionar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-lg font-medium">Experiências</h2>
        <p className="mb-4 text-sm text-gray-500">
          Sem nenhuma escolhida, aparecem todas as experiências visíveis. Ajuste o resumo e as conquistas para destacar o
          que importa para esta vaga.
        </p>
        <ul className="flex flex-col gap-4">
          {application.experiences.map((item) => (
            <li key={item.id} className="rounded border border-gray-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium">
                  {item.experience.role} · {item.experience.company}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {formatPeriod(item.experience.start, item.experience.end)}
                  </span>
                </p>
                <form action={removeExperienceFromApplication}>
                  <input type="hidden" name="applicationExperienceId" value={item.id} />
                  <input type="hidden" name="applicationId" value={application.id} />
                  <button type="submit" className="text-sm text-red-600">
                    Remover
                  </button>
                </form>
              </div>
              <form action={updateApplicationExperience} className="flex flex-col gap-3">
                <input type="hidden" name="applicationExperienceId" value={item.id} />
                <input type="hidden" name="applicationId" value={application.id} />
                <label className="flex items-center gap-2 text-sm">
                  Ordem
                  <input
                    type="number"
                    name="order"
                    defaultValue={item.order}
                    className="w-16 rounded border border-gray-300 px-2 py-1"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Resumo para esta vaga (vazio = resumo padrão)
                  <textarea
                    name="customSummary"
                    defaultValue={item.customSummary ?? ""}
                    placeholder={item.experience.summary}
                    rows={2}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Conquistas para esta vaga (uma por linha; vazio = conquistas padrão)
                  <textarea
                    name="customHighlights"
                    defaultValue={Array.isArray(item.customHighlights) ? item.customHighlights.join("\n") : ""}
                    placeholder={Array.isArray(item.experience.highlights) ? item.experience.highlights.join("\n") : ""}
                    rows={3}
                    className={inputClass}
                  />
                </label>
                <button type="submit" className="self-start rounded bg-gray-100 px-3 py-1 text-sm">
                  Salvar
                </button>
              </form>
            </li>
          ))}
        </ul>
        {availableExperiences.length > 0 && (
          <div className="mt-4 rounded border border-dashed border-gray-300 p-3">
            <p className="mb-2 text-sm font-medium">Adicionar experiência</p>
            <ul className="flex flex-col gap-1">
              {availableExperiences.map((experience) => (
                <li key={experience.id} className="flex items-center justify-between text-sm">
                  <span>
                    {experience.role} · {experience.company}
                  </span>
                  <form action={addExperienceWithId}>
                    <input type="hidden" name="experienceId" value={experience.id} />
                    <button type="submit" className="text-blue-600">
                      Adicionar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
