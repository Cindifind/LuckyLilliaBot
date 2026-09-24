#!/bin/bash
# LLBot Linux 构建脚本 - 安装依赖、类型检查、编译主程序与 WebUI 前端
# 产物输出到 dist/，可选打包 LLBot.zip（与 GitHub Actions publish.yml 流程一致）
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log() { echo -e "${GREEN}>>> $1${NC}"; }
warn() { echo -e "${YELLOW}>>> $1${NC}"; }
error() { echo -e "${RED}错误: $1${NC}"; exit 1; }

SKIP_INSTALL=0
SKIP_CHECK=0
DO_ZIP=0

usage() {
    cat <<EOF
用法: $(basename "$0") [选项]

选项:
  --skip-install   跳过依赖安装（node_modules 已就绪时使用）
  --skip-check     跳过 TypeScript 类型检查 (yarn check)
  --zip            构建完成后打包 LLBot.zip（与发布流程一致）
  -h, --help       显示此帮助

示例:
  $(basename "$0")               # 完整构建
  $(basename "$0") --skip-install
  $(basename "$0") --zip
EOF
}

parse_args() {
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --skip-install) SKIP_INSTALL=1 ;;
            --skip-check)   SKIP_CHECK=1 ;;
            --zip)          DO_ZIP=1 ;;
            -h|--help)      usage; exit 0 ;;
            *)              error "未知参数: $1 (使用 -h 查看帮助)" ;;
        esac
        shift
    done
}

parse_args "$@"

# ---------- 环境检查 ----------
log "检查构建环境..."
command -v node >/dev/null 2>&1 || error "未检测到 node，请先安装 Node.js 24+"
log "Node 版本: $(node -v)"

command -v yarn >/dev/null 2>&1 || {
    # Windows Git Bash 下 corepack enable 可能 EPERM（写入 Program Files 无权限），失败不致命
    corepack enable 2>/dev/null || true
    command -v yarn >/dev/null 2>&1 || error "yarn 不可用，请先安装并启用: corepack enable"
}

# ---------- 依赖安装 ----------
if [ "$SKIP_INSTALL" -eq 0 ]; then
    log "安装根依赖 (yarn install --no-immutable)..."
    yarn install --no-immutable

    log "安装 WebUI 前端依赖 (src/webui/FE)..."
    npm --prefix src/webui/FE install
else
    warn "跳过依赖安装 (--skip-install)"
fi

# ---------- 类型检查 ----------
if [ "$SKIP_CHECK" -eq 0 ]; then
    log "TypeScript 类型检查 (yarn check)..."
    yarn check
else
    warn "跳过类型检查 (--skip-check)"
fi

# ---------- 构建 ----------
log "构建主程序 (yarn build)..."
yarn build

log "构建 WebUI 前端 (yarn build-webui)..."
yarn build-webui

# ---------- 产物校验 ----------
log "校验构建产物..."
[ -f dist/llbot.js ]            || error "构建失败: 缺少 dist/llbot.js"
[ -f dist/default_config.json ] || error "构建失败: 缺少 dist/default_config.json"
[ -f dist/onebot-bridge.jar ] || error "构建失败: 缺少 dist/onebot-bridge.jar (Java 插件桥接主程序)"
[ -f dist/webui/index.html ]    || warn "缺少 dist/webui/index.html，WebUI 前端可能构建失败"

# ---------- 打包 ----------
if [ "$DO_ZIP" -eq 1 ]; then
    command -v zip >/dev/null 2>&1 || error "未检测到 zip，请先安装 (apt install zip / pacman -S zip)"
    log "打包 LLBot.zip..."
    (cd dist && zip -r ../LLBot.zip ./*)
    log "产物: $ROOT_DIR/LLBot.zip"
fi

log "构建完成! 产物目录: $ROOT_DIR/dist"
log "运行: cd dist && node llbot.js"
