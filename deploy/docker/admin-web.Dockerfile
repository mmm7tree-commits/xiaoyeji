FROM node:20-alpine AS builder

ARG NPM_REGISTRY=https://registry.npmmirror.com
ARG PNPM_VERSION=10.8.0
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY}

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .npmrc ./
COPY apps/admin-web/package.json apps/admin-web/package.json
COPY apps/api-server/package.json apps/api-server/package.json
COPY apps/miniapp/package.json apps/miniapp/package.json

RUN npm config set registry "${NPM_REGISTRY}" \
 && npm install -g "pnpm@${PNPM_VERSION}" --registry "${NPM_REGISTRY}" \
 && pnpm config set registry "${NPM_REGISTRY}" \
 && pnpm install --frozen-lockfile --registry "${NPM_REGISTRY}"

COPY . .

ARG VITE_ADMIN_APP_NAME=小叶记管理后台
ARG VITE_ADMIN_API_BASE_URL=/api
ARG VITE_ADMIN_ASSET_BASE_URL=

RUN VITE_ADMIN_APP_NAME="$VITE_ADMIN_APP_NAME" \
    VITE_ADMIN_API_BASE_URL="$VITE_ADMIN_API_BASE_URL" \
    VITE_ADMIN_ASSET_BASE_URL="$VITE_ADMIN_ASSET_BASE_URL" \
    pnpm --filter @xiaoyeji/admin-web build

FROM openresty/openresty:1.27.1.2-0-alpine

COPY deploy/nginx/admin-static.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/admin-web/dist /usr/share/nginx/html
COPY --from=builder /app/assets /usr/share/nginx/html/assets

EXPOSE 8080

CMD ["openresty", "-g", "daemon off;"]
