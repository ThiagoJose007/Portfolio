import { createApplication } from "../actions";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Nova candidatura</h1>
      <form action={createApplication} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Empresa
          <input
            name="companyName"
            required
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Vaga
          <input
            name="roleTitle"
            required
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Texto de introdução (personalizado para essa empresa)
          <textarea
            name="introText"
            required
            rows={4}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Texto de chamada (opcional)
          <input
            name="ctaText"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded bg-black px-4 py-2 text-sm text-white"
        >
          Criar candidatura
        </button>
      </form>
    </div>
  );
}
