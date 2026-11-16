import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Estudos de caso com senha. A senha fica como hash (scrypt) no projeto; quem
// acerta ganha um cookie assinado que vale 30 dias. Trocar a senha invalida
// os cookies antigos (a assinatura inclui o hash).

const SECRET = process.env.PROJECT_ACCESS_SECRET || process.env.ADMIN_PASSWORD || "dev-project-secret";
const COOKIE_PREFIX = "pa_";
const MAX_AGE = 60 * 60 * 24 * 30;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return timingSafeEqual(actual, expected);
}

const tokenFor = (projectId: string, stored: string) =>
  createHmac("sha256", SECRET).update(`${projectId}:${stored}`).digest("hex");

const cookieName = (projectId: string) => `${COOKIE_PREFIX}${projectId}`;

// O visitante pode ver o projeto completo?
export async function hasProjectAccess(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { password: true } });
  if (!project?.password) return true;
  const token = (await cookies()).get(cookieName(projectId))?.value;
  if (!token) return false;
  const expected = tokenFor(projectId, project.password);
  return token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

// Confere a senha e, se certa, libera o projeto (só em Server Actions).
export async function grantProjectAccess(projectId: string, password: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { password: true } });
  if (!project?.password || !verifyPassword(password, project.password)) return false;
  (await cookies()).set(cookieName(projectId), tokenFor(projectId, project.password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}
