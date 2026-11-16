import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE, GENERAL_SEGMENTS, isLocale, LOCALE_COOKIE, LOCALE_HEADER, type Locale } from "@/lib/i18n/config";

// 1) /admin: Basic Auth.
// 2) Site: decide o idioma da requisição e passa adiante no header
//    x-site-locale. Ordem: ?lang= (também grava o cookie) → cookie da escolha
//    do visitante → idioma da candidatura (/<slug>) → inglês.

function adminAuth(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const [, encoded] = basicAuth.split(" ");
    const [, password] = atob(encoded).split(":");
    if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }
  return new Response("Autenticação necessária", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
}

// Idioma das candidaturas em memória por 1 minuto (evita uma consulta por requisição).
const applicationLocales = new Map<string, { locale: Locale; at: number }>();

async function applicationLocale(slug: string): Promise<Locale | null> {
  const cached = applicationLocales.get(slug);
  if (cached && Date.now() - cached.at < 60_000) return cached.locale;
  try {
    const application = await prisma.application.findUnique({ where: { slug }, select: { locale: true } });
    const locale = isLocale(application?.locale) ? application.locale : null;
    if (locale) applicationLocales.set(slug, { locale, at: Date.now() });
    return locale;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname.startsWith("/admin")) return adminAuth(request);

  const fromQuery = searchParams.get("lang");
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  let locale: Locale = DEFAULT_LOCALE;
  if (isLocale(fromQuery)) locale = fromQuery;
  else if (isLocale(fromCookie)) locale = fromCookie;
  else {
    const segment = pathname.split("/")[1] ?? "";
    if (!GENERAL_SEGMENTS.has(segment)) locale = (await applicationLocale(segment)) ?? DEFAULT_LOCALE;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (isLocale(fromQuery)) {
    response.cookies.set(LOCALE_COOKIE, fromQuery, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return response;
}

export const config = {
  // Tudo, menos arquivos estáticos, uploads e o contador de cliques.
  matcher: ["/((?!_next/static|_next/image|media/|site-icon|favicon.ico|links/click).*)"],
};
