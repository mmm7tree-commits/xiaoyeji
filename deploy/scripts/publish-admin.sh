#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/deploy/docker/.env.test}"

bash "$ROOT_DIR/deploy/docker/publish-admin-static.sh" "$ENV_FILE"

echo "后台静态文件已按容器化方式完成发布"
