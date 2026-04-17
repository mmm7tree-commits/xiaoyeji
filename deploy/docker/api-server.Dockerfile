FROM node:20-alpine AS builder

ARG NPM_REGISTRY=https://registry.npmmirror.com
ARG PNPM_VERSION=10.8.0
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY apps/api-server/package.json apps/api-server/package.json
COPY apps/admin-web/package.json apps/admin-web/package.json
COPY apps/miniapp/package.json apps/miniapp/package.json

RUN npm config set registry "${NPM_REGISTRY}" \
 && npm install -g "pnpm@${PNPM_VERSION}" --registry "${NPM_REGISTRY}" \
 && pnpm config set registry "${NPM_REGISTRY}" \
 && pnpm install --frozen-lockfile --registry "${NPM_REGISTRY}"

COPY . .

RUN pnpm --filter @xiaoyeji/api-server build

FROM node:20-alpine AS runtime

ARG NPM_REGISTRY=https://registry.npmmirror.com
ARG PNPM_VERSION=10.8.0
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}

WORKDIR /app

ENV NODE_ENV=production
ENV API_SERVER_HOST=0.0.0.0
ENV API_SERVER_PORT=3100

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY apps/api-server/package.json apps/api-server/package.json
COPY apps/admin-web/package.json apps/admin-web/package.json
COPY apps/miniapp/package.json apps/miniapp/package.json

RUN npm config set registry "${NPM_REGISTRY}" \
 && npm install -g "pnpm@${PNPM_VERSION}" --registry "${NPM_REGISTRY}" \
 && pnpm config set registry "${NPM_REGISTRY}" \
 && pnpm install --prod --frozen-lockfile --filter @xiaoyeji/api-server... --registry "${NPM_REGISTRY}"

COPY --from=builder /app/apps/api-server/dist /app/apps/api-server/dist
COPY --from=builder /app/utils/template-runtime.js /app/utils/template-runtime.js
COPY --from=builder /app/utils/template-preview.js /app/utils/template-preview.js
COPY --from=builder /app/data/templates.js /app/data/templates.js
COPY --from=builder /app/data/externalTemplates.js /app/data/externalTemplates.js

WORKDIR /app/apps/api-server

EXPOSE 3100

CMD ["node", "dist/main.js"]
