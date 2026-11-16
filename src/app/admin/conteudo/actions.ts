"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readFields, readTranslations } from "../_components/field-defs";
import { deleteTranslations, saveTranslations } from "@/lib/i18n/translations";
import { getCollection, listPathOf } from "./collections";

function collectionOrThrow(key: string) {
  const collection = getCollection(key);
  if (!collection) throw new Error(`Coleção desconhecida: ${key}`);
  return collection;
}

const refresh = (key: string) => {
  const collection = getCollection(key);
  if (collection) revalidatePath(listPathOf(collection));
  revalidatePath("/", "layout");
};

export async function saveCollectionItem(key: string, id: string | null, formData: FormData) {
  const collection = collectionOrThrow(key);
  const model = collection.delegate();
  const data = readFields(collection.fields, formData);

  let savedId = id;
  if (id) {
    await model.update({ where: { id }, data });
  } else {
    // Novos itens entram no fim da lista.
    const last = await model.findFirst({ where: collection.scope, orderBy: { order: "desc" } });
    savedId = (await model.create({ data: { ...data, ...collection.scope, order: (last?.order ?? -1) + 1 } })).id;
  }
  if (savedId) await saveTranslations(collection.entity, savedId, readTranslations(collection.fields, formData));

  refresh(key);
  redirect(listPathOf(collection));
}

export async function deleteCollectionItem(key: string, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const collection = collectionOrThrow(key);
  await collection.delegate().delete({ where: { id } });
  await deleteTranslations(collection.entity, id);
  refresh(key);
}

// Troca a posição do item com o vizinho de cima (-1) ou de baixo (+1).
export async function moveCollectionItem(key: string, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const direction = Number(formData.get("direction"));
  const collection = collectionOrThrow(key);
  const model = collection.delegate();

  const rows = await model.findMany({ where: collection.scope, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const from = rows.findIndex((row) => row.id === id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= rows.length) return;

  [rows[from], rows[to]] = [rows[to], rows[from]];
  // Renumera tudo para corrigir empates antigos.
  await Promise.all(
    rows.map((row, order) => (row.order === order ? null : model.update({ where: { id: row.id }, data: { order } }))),
  );
  refresh(key);
}
