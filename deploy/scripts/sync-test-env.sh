#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/deploy/docker/.env.test}"
GIT_REMOTE="${GIT_REMOTE:-origin}"
SYNC_BRANCH="${SYNC_BRANCH:-main}"
SYNC_REF="${SYNC_REF:-$GIT_REMOTE/$SYNC_BRANCH}"
SKIP_GIT_SYNC="${SKIP_GIT_SYNC:-0}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "找不到环境变量文件: $ENV_FILE" >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "未检测到 docker，无法执行测试环境同步" >&2
  exit 1
fi

if [[ "$SKIP_GIT_SYNC" != "1" ]]; then
  if ! command -v git >/dev/null 2>&1; then
    echo "未检测到 git，无法执行标准化同步脚本" >&2
    exit 1
  fi

  git -C "$ROOT_DIR" fetch "$GIT_REMOTE" "$SYNC_BRANCH"
  git -C "$ROOT_DIR" reset --hard "$SYNC_REF"
else
  echo "已启用 SKIP_GIT_SYNC=1，跳过 git fetch/reset，直接使用当前目录代码执行部署"
fi

bash "$ROOT_DIR/deploy/scripts/rebuild-api.sh" "$ENV_FILE"
bash "$ROOT_DIR/deploy/scripts/publish-admin.sh" "$ENV_FILE"

echo "测试环境同步完成"
echo "后台地址: https://admin.ecomleaf.cn"
echo "API 健康检查: https://api.ecomleaf.cn/api/health"
echo "资源目录: https://api.ecomleaf.cn/storage/"
