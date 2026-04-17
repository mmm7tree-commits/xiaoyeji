#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/deploy/docker/.env.test}"
COMPOSE_FILE="$ROOT_DIR/deploy/docker/docker-compose.1panel.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "找不到环境变量文件: $ENV_FILE" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "未检测到 docker，无法重建 API 容器" >&2
  exit 1
fi

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build api-server

echo "API 容器已按 1Panel 方案完成重建"
