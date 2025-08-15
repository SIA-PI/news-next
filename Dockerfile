# Dockerfile para aplicação Next.js - sia-news-next

# Use a imagem oficial do Node.js baseada em Alpine
FROM node:18-alpine AS base

# Instalar dependências apenas quando necessário
FROM base AS deps
# Verificar https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências baseadas no gerenciador de pacotes preferido
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild do código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js coleta dados de telemetria completamente anônimos sobre uso geral
# Saiba mais aqui: https://nextjs.org/telemetry
# Descomente a linha seguinte caso você queira desabilitar a telemetria durante o build
# ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm run build

# Imagem de produção, copiar todos os arquivos e executar next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Descomente a linha seguinte caso você queira desabilitar a telemetria durante o runtime
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Definir as permissões corretas para o cache do Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Alavancar automaticamente traces de saída para reduzir o tamanho da imagem
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3010

ENV PORT 3010
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
