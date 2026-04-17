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
VITE_ADMIN_APP_NAME="${VITE_ADMIN_APP_NAME:-小叶记管理后台（测试）}"
VITE_ADMIN_API_BASE_URL="${VITE_ADMIN_API_BASE_URL:-/api}"
VITE_ADMIN_ASSET_BASE_URL="${VITE_ADMIN_ASSET_BASE_URL:-}"

if ! command -v docker >/dev/null 2>&1; then
  echo "未检测到 docker，无法以容器方式发布后台静态文件" >&2
  exit 1
fi

IMAGE_TAG="xiaoyeji-admin-web-publish:$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || date +%s)"
CONTAINER_NAME="xiaoyeji-admin-web-publish-$(date +%s)"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
  docker image rm "$IMAGE_TAG" >/dev/null 2>&1 || true
}

trap cleanup EXIT

mkdir -p "$ADMIN_STATIC_ROOT"
find "$ADMIN_STATIC_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +

docker build \
  --file "$ROOT_DIR/deploy/docker/admin-web.Dockerfile" \
  --tag "$IMAGE_TAG" \
  --build-arg "NPM_REGISTRY=$NPM_REGISTRY" \
  --build-arg "PNPM_VERSION=$PNPM_VERSION" \
  --build-arg "VITE_ADMIN_APP_NAME=$VITE_ADMIN_APP_NAME" \
  --build-arg "VITE_ADMIN_API_BASE_URL=$VITE_ADMIN_API_BASE_URL" \
  --build-arg "VITE_ADMIN_ASSET_BASE_URL=$VITE_ADMIN_ASSET_BASE_URL" \
  "$ROOT_DIR"

docker create --name "$CONTAINER_NAME" "$IMAGE_TAG" >/dev/null
docker cp "$CONTAINER_NAME":/usr/share/nginx/html/. "$ADMIN_STATIC_ROOT/"

echo "管理后台静态文件已发布到: $ADMIN_STATIC_ROOT"
