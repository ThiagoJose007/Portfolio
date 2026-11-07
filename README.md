# Portfolio — Thiago Santos

Site de portfolio com uma versão geral pública e versões privadas por candidatura, e um
admin para editar todo o conteúdo.

## Estrutura do site

| Endereço | O quê |
| --- | --- |
| `/` | Início da versão geral: Hero + todos os projetos |
| `/sobre`, `/experiencia` | Páginas da versão geral |
| `/projetos/<projeto>` | Estudo de caso |
| `/<slug>`, `/<slug>/sobre`, `/<slug>/experiencia`, `/<slug>/projetos/<projeto>` | A mesma estrutura, na versão de uma candidatura |

- A **versão geral** é configurada em `/admin/applications` → "Configurar versão geral".
  Sem configuração, mostra todos os projetos e experiências visíveis.
- Cada **candidatura** escolhe os projetos e as experiências (com resumo e conquistas
  ajustados à vaga). Os dados pessoais são os mesmos em todas. O link tem um sufixo
  aleatório, fica fora do Google, pode expirar e é desativado ao arquivar.
- **Visitas**: cada entrada em uma candidatura conta uma visita (navegação interna,
  robôs/prévias de link e o link "Abrir prévia" do admin não contam). Na primeira visita,
  o status "Enviado" vira "Visualizado".
- Endereços antigos redirecionam: `/p/<slug>` → `/<slug>`, `/carreira` → `/experiencia`,
  `/depoimentos` → `/sobre`, `/projetos` → `/#projetos`.

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
| Página de candidatura | http://localhost:3000/&lt;slug&gt; (os slugs aparecem em `/admin/applications`) |

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

O `Dockerfile` gera a build `standalone` do Next e, **a cada start, aplica as migrations
pendentes** (`prisma migrate deploy`) antes de subir o site — não é preciso rodar nada à mão.

1. **Novo projeto:** no Railway, *New Project → Deploy from GitHub repo* e escolha este
   repositório (e a branch que quer publicar). O Railway detecta o `Dockerfile`.
2. **Banco:** no mesmo projeto, *+ Create → Database → PostgreSQL*.
3. **Variáveis do serviço do site** (*Variables*):
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (referência ao banco criado acima)
   - `ADMIN_PASSWORD` = uma senha forte
   - `UPLOAD_DIR` = `/data/uploads`
4. **Volume:** no serviço do site, *Settings → Volumes → Add Volume*, mount path `/data`.
   Sem ele, fotos, capas e o CV somem a cada deploy.
5. **Domínio:** *Settings → Networking → Generate Domain* (ou adicione o seu domínio).
6. **Primeiro acesso:** abra `/admin` (qualquer usuário + `ADMIN_PASSWORD`), clique em
   **Importar conteúdo atual** e substitua os textos de exemplo pelos seus dados.

Com volume, o serviço roda com uma única instância (suficiente para um portfolio); ative os
backups do volume no painel, se o seu plano tiver.
