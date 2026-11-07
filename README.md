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
| `UPLOAD_DIR` | Pasta dos arquivos enviados pelo admin (fotos, capas, galeria, CV) | vazio (usa `./uploads`); no Railway, `/data/uploads` |

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
- **O site dá erro de conexão**: o banco não está de pé (`docker compose up -d db`).
  Todas as páginas leem o conteúdo do banco.
- **Página nova dá 404 mesmo existindo**: cache velho do Next. Pare o servidor, apague a
  pasta `.next` e rode `npm run dev` de novo.
- **Porta 3000 ocupada**: `npm run dev -- -p 3001`.

## Onde editar

Todo o conteúdo é editado pelo admin e fica no banco:

| Admin | O que edita |
| --- | --- |
| `/admin/perfil` | Nome, cargo, contato, redes, foto, CV (PDF), TL;DR, bio, liga/desliga freelancer |
| `/admin/textos` | Títulos e frases de cada seção (trechos entre `*asteriscos*` viram itálico) |
| `/admin/conteudo/*` | Experiências, formação, habilidades, números, processo, valores, hobbies, "o que busco", freelancer, prêmios, depoimentos |
| `/admin/projects` | Projetos: card, estudo de caso, capa e galeria |
| `/admin/applications` | Candidaturas (versões por empresa) |

**Primeira vez:** abra `/admin` e clique em **Importar conteúdo atual**. Isso copia o
conteúdo de fábrica (`src/content/site.ts`) para o banco; até lá, o site mostra esse
conteúdo de fábrica. A importação nunca sobrescreve o que já existe.

Para criar um texto editável novo, adicione a chave em `src/lib/content/texts.ts`. Para
uma lista nova, crie o model no Prisma e registre em `src/app/admin/conteudo/collections.ts`.

- **Seções e animações**: `src/components/site/` (seções, menu, cena 3D, transições) e
  `src/animations/` (hooks GSAP reutilizáveis).

## Deploy (Railway)

O `Dockerfile` gera a build `standalone` do Next. No Railway: crie o serviço a partir do
repositório (Dockerfile), adicione o plugin Postgres e configure `DATABASE_URL` e
`ADMIN_PASSWORD` nas variáveis do serviço. Rode `npx prisma migrate deploy` contra o banco
de produção a cada deploy que traga migrations novas.

**Uploads:** o container é recriado a cada deploy, então os arquivos enviados pelo admin
precisam de um **Volume**. No serviço: *Settings → Volumes → Add Volume*, mount path
`/data`, e a variável `UPLOAD_DIR=/data/uploads`. Os arquivos são servidos pelo próprio
site em `/media/<arquivo>` (limite de 25 MB por arquivo). Com volume, o serviço roda com
uma única instância; ative os backups do volume no painel, se o plano tiver.
