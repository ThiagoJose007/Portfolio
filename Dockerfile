FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Só o necessário para rodar as migrations no start (Prisma CLI + config).
FROM node:20-alpine AS migrate
WORKDIR /migrate
RUN npm init -y >/dev/null && npm install --no-audit --no-fund prisma@7.8.0 dotenv@17.4.2
COPY prisma ./prisma
COPY prisma.config.ts ./

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# O Railway injeta PORT; o servidor precisa escutar em todas as interfaces.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=migrate /migrate ./migrate
EXPOSE 3000
# Aplica as migrations pendentes e sobe o site. Sem migrations novas, o
# primeiro passo termina em segundos.
CMD ["sh", "-c", "cd migrate && npx prisma migrate deploy && cd .. && node server.js"]
