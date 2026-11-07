# Portfolio — Thiago Santos

Site de portfolio com páginas personalizadas por candidatura (`/p/[slug]`) e um admin
para cadastrar projetos e candidaturas.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind 4 · Prisma 7 + PostgreSQL 16 ·
GSAP 3.15 · three.js · Docker.

## Pré-requisitos

- Node.js 20+
- Docker Desktop (para o banco Postgres)

## Rodar localmente

Todos os comandos são executados dentro da pasta `portfolio-app/`.

### 1. Primeira vez

```bash
npm install
cp .env.example .env        # depois edite o .env (veja "Variáveis de ambiente")
```

### 2. Subir o banco

Abra o Docker Desktop e espere ele ficar pronto. Depois:

```bash
docker compose up -d db
npx prisma migrate deploy   # aplica as migrations pendentes (seguro rodar sempre)
```

O Postgres fica em `localhost:5433` (a porta 5433 evita conflito com outro Postgres
na 5432). Os dados ficam no volume `pgdata` e não se perdem ao parar o container.

### 3. Subir o site

```bash
npm run dev
```

| O quê | Endereço |
| --- | --- |
| Site | http://localhost:3000 |
| Admin | http://localhost:3000/admin (qualquer usuário + `ADMIN_PASSWORD`) |
| Página de candidatura | http://localhost:3000/p/&lt;slug&gt; (os slugs aparecem em `/admin/applications`) |

Na primeira visita, cada página demora alguns segundos: o servidor de desenvolvimento
compila a página sob demanda.

### 4. Parar

```bash
# Ctrl+C no terminal do `npm run dev`, depois:
docker compose stop db
```

## Variáveis de ambiente

| Variável | Para quê | Valor local |
| --- | --- | --- |
| `DATABASE_URL` | Conexão do Prisma com o Postgres | `postgresql://portfolio:portfolio@localhost:5433/portfolio` |
| `ADMIN_PASSWORD` | Senha do Basic Auth de `/admin/*` | qualquer senha local; em produção, uma senha forte |

O `.env` não vai para o git. O `.env.example` é o modelo.

## Comandos úteis

```bash
npm run lint                 # ESLint
npx tsc --noEmit             # checagem de tipos
npx prisma migrate dev       # cria uma migration nova após alterar prisma/schema.prisma
npx prisma studio            # navegar pelos dados do banco no navegador
npm run build && npm start   # build de produção local
```

## Problemas comuns

- **`failed to connect to the docker API`**: o Docker Desktop não está aberto.
- **A home ou `/projetos` dá erro de conexão**: o banco não está de pé
  (`docker compose up -d db`). As páginas `/sobre`, `/carreira` e `/depoimentos`
  não usam o banco e funcionam mesmo assim.
- **Página nova dá 404 mesmo existindo**: cache velho do Next. Pare o servidor, apague a
  pasta `.next` e rode `npm run dev` de novo.
- **Porta 3000 ocupada**: `npm run dev -- -p 3001`.

## Onde editar

- **Textos do site** (sobre, habilidades, carreira, depoimentos, contato, menu):
  `src/content/site.ts`. Os trechos marcados com `TODO` ainda são placeholders.
- **Projetos e candidaturas**: pelo admin (ficam no banco).
- **Seções e animações**: `src/components/site/` (seções, menu, cena 3D, transições) e
  `src/animations/` (hooks GSAP reutilizáveis).

## Deploy (Railway)

O `Dockerfile` gera a build `standalone` do Next. No Railway: crie o serviço a partir do
repositório (Dockerfile), adicione o plugin Postgres e configure `DATABASE_URL` e
`ADMIN_PASSWORD` nas variáveis do serviço. Rode `npx prisma migrate deploy` contra o banco
de produção antes do primeiro acesso.
