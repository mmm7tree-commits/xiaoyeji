#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/deploy/docker/.env.test}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "找不到环境变量文件: $ENV_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

ADMIN_STATIC_ROOT="${ADMIN_STATIC_ROOT:-/opt/1panel/www/sites/admin/index}"
NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmmirror.com}"
PNPM_VERSION="${PNPM_VERSION:-10.8.0}"

mkdir -p "$ADMIN_STATIC_ROOT"
rm -rf "$ADMIN_STATIC_ROOT"/*

export VITE_ADMIN_APP_NAME="${VITE_ADMIN_APP_NAME:-小叶记管理后台（测试）}"
export VITE_ADMIN_API_BASE_URL="${VITE_ADMIN_API_BASE_URL:-/api}"
export VITE_ADMIN_ASSET_BASE_URL="${VITE_ADMIN_ASSET_BASE_URL:-}"

if ! command -v pnpm >/dev/null 2>&1; then
  npm config set registry "$NPM_REGISTRY"
  npm install -g "pnpm@${PNPM_VERSION}" --registry "$NPM_REGISTRY"
fi

pnpm config set registry "$NPM_REGISTRY"

pnpm install --frozen-lockfile --registry "$NPM_REGISTRY"

pnpm --filter @xiaoyeji/admin-web build

cp -R "$ROOT_DIR/apps/admin-web/dist/." "$ADMIN_STATIC_ROOT/"
mkdir -p "$ADMIN_STATIC_ROOT/assets"
cp -R "$ROOT_DIR/assets/." "$ADMIN_STATIC_ROOT/assets/"

echo "管理后台静态文件已发布到: $ADMIN_STATIC_ROOT"
