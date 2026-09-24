#!/bin/bash
# LLBot 有头版本打包脚本 - 构建主程序并打包为带PMHQ的完整发布包
# 产物输出到 release/ 目录
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log() { echo -e "${GREEN}>>> $1${NC}"; }
warn() { echo -e "${YELLOW}>>> $1${NC}"; }
error() { echo -e "${RED}错误: $1${NC}"; exit 1; }

# 默认配置
SKIP_INSTALL=0
SKIP_CHECK=0
SKIP_BUILD=0
PLATFORM="linux-x64"
RELEASE_DIR="$ROOT_DIR/release"

usage() {
    cat <<EOF
用法: $(basename "$0") [选项]

选项:
  --skip-install   跳过依赖安装（node_modules 已就绪时使用）
  --skip-check     跳过 TypeScript 类型检查 (yarn check)
  --skip-build     跳过构建（dist 目录已就绪时使用）
  --platform       目标平台 (linux-x64, linux-arm64, macos-arm64, win-x64)，默认 linux-x64
  -h, --help       显示此帮助

示例:
  $(basename "$0")                           # 完整构建 linux-x64 有头版本
  $(basename "$0") --platform linux-arm64    # 构建 linux-arm64 有头版本
  $(basename "$0") --skip-build              # 跳过构建，直接打包现有 dist
EOF
}

parse_args() {
    while [ "$#" -gt 0 ]; do
        case "$1" in
            --skip-install) SKIP_INSTALL=1 ;;
            --skip-check)   SKIP_CHECK=1 ;;
            --skip-build)   SKIP_BUILD=1 ;;
            --platform)     shift; PLATFORM="$1" ;;
            -h|--help)      usage; exit 0 ;;
            *)              error "未知参数: $1 (使用 -h 查看帮助)" ;;
        esac
        shift
    done
}

parse_args "$@"

# 验证平台参数
case "$PLATFORM" in
    linux-x64|linux-arm64|macos-arm64|win-x64) ;;
    *) error "不支持的平台: $PLATFORM (支持: linux-x64, linux-arm64, macos-arm64, win-x64)" ;;
esac

log "目标平台: $PLATFORM"
log "发布目录: $RELEASE_DIR"

# ---------- 环境检查 ----------
log "检查构建环境..."
command -v node >/dev/null 2>&1 || error "未检测到 node，请先安装 Node.js 24+"
log "Node 版本: $(node -v)"

command -v yarn >/dev/null 2>&1 || {
    corepack enable 2>/dev/null || true
    command -v yarn >/dev/null 2>&1 || error "yarn 不可用，请先安装并启用: corepack enable"
}

command -v wget >/dev/null 2>&1 || command -v curl >/dev/null 2>&1 || error "未检测到 wget 或 curl"

# 下载工具函数
download_file() {
    local url="$1"
    local output="$2"
    if command -v wget >/dev/null 2>&1; then
        wget -q -O "$output" "$url" || error "下载失败: $url"
    else
        curl -sL -o "$output" "$url" || error "下载失败: $url"
    fi
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
if [ "$SKIP_BUILD" -eq 0 ]; then
    log "构建主程序 (yarn build)..."
    yarn build

    log "构建 WebUI 前端 (yarn build-webui)..."
    yarn build-webui
else
    warn "跳过构建 (--skip-build)"
fi

# ---------- 产物校验 ----------
log "校验构建产物..."
[ -f dist/llbot.js ]            || error "构建失败: 缺少 dist/llbot.js"
[ -f dist/default_config.json ] || error "构建失败: 缺少 dist/default_config.json"
[ -f dist/onebot-bridge.jar ]   || error "构建失败: 缺少 dist/onebot-bridge.jar (Java 插件桥接主程序)"
[ -f dist/webui/index.html ]    || warn "缺少 dist/webui/index.html，WebUI 前端可能构建失败"

# ---------- 创建发布目录 ----------
log "创建发布目录结构..."
rm -rf "$RELEASE_DIR"
mkdir -p "$RELEASE_DIR/bin/llbot"
mkdir -p "$RELEASE_DIR/bin/pmhq"

# 复制文档
cp doc/使用说明.txt "$RELEASE_DIR/" 2>/dev/null || true
cp dist/更新日志.txt "$RELEASE_DIR/"

# 复制 dist 内容到 bin/llbot
log "复制构建产物..."
cp -r dist/* "$RELEASE_DIR/bin/llbot/"

# 清理不需要的平台 sign-proxy 文件
log "清理不需要的 sign-proxy 文件..."
cd "$RELEASE_DIR/bin/llbot"
case "$PLATFORM" in
    linux-x64)
        find . -maxdepth 1 -name 'sign-proxy.*.node' ! -name 'sign-proxy.linux-x64-*.node' -delete
        ;;
    linux-arm64)
        find . -maxdepth 1 -name 'sign-proxy.*.node' ! -name 'sign-proxy.linux-arm64-*.node' -delete
        ;;
    macos-arm64)
        find . -maxdepth 1 -name 'sign-proxy.*.node' ! -name 'sign-proxy.darwin-arm64.node' -delete
        ;;
    win-x64)
        find . -maxdepth 1 -name 'sign-proxy.*.node' ! -name 'sign-proxy.win-x64.node' -delete
        ;;
esac
cd "$ROOT_DIR"

# ---------- 下载 PMHQ ----------
log "下载 PMHQ (QQ客户端容器)..."
case "$PLATFORM" in
    linux-x64)
        PMHQ_URL="https://github.com/linyuchen/PMHQ/releases/latest/download/pmhq-linux-x64.zip"
        PMHQ_ARCHIVE="pmhq-linux-x64.zip"
        PMHQ_BIN="pmhq-linux-x64"
        PMHQ_LIB="libpmhq.so"
        ;;
    linux-arm64)
        PMHQ_URL="https://github.com/linyuchen/PMHQ/releases/latest/download/pmhq-linux-arm64.zip"
        PMHQ_ARCHIVE="pmhq-linux-arm64.zip"
        PMHQ_BIN="pmhq-linux-arm64"
        PMHQ_LIB="libpmhq.so"
        ;;
    macos-arm64)
        PMHQ_URL="https://github.com/linyuchen/PMHQ/releases/latest/download/pmhq-macos-arm64.zip"
        PMHQ_ARCHIVE="pmhq-macos-arm64.zip"
        PMHQ_BIN="pmhq-macos-arm64"
        PMHQ_LIB="libpmhq.dylib"
        ;;
    win-x64)
        PMHQ_URL="https://github.com/linyuchen/PMHQ/releases/latest/download/pmhq-win-x64.zip"
        PMHQ_ARCHIVE="pmhq-win-x64.zip"
        PMHQ_BIN="pmhq-win-x64.exe"
        PMHQ_LIB="pmhq.dll"
        ;;
esac

cd "$RELEASE_DIR/bin/pmhq"
download_file "$PMHQ_URL" "$PMHQ_ARCHIVE"
unzip -o "$PMHQ_ARCHIVE"
rm "$PMHQ_ARCHIVE"
mv "$PMHQ_BIN" "pmhq${PLATFORM#win}" 2>/dev/null || true
# 确保可执行权限
chmod +x pmhq* 2>/dev/null || true
cd "$ROOT_DIR"

# ---------- 下载 Node.js 运行时 ----------
log "下载 Node.js 运行时..."
case "$PLATFORM" in
    linux-x64)   NODE_URL="https://github.com/LLOneBot/exe/releases/latest/download/node-linux-x64" ;;
    linux-arm64) NODE_URL="https://github.com/LLOneBot/exe/releases/latest/download/node-linux-arm64" ;;
    macos-arm64) NODE_URL="https://github.com/LLOneBot/exe/releases/latest/download/node-darwin-arm64" ;;
    win-x64)     NODE_URL="https://github.com/LLOneBot/exe/releases/latest/download/node.exe" ;;
esac

NODE_BIN="node"
[[ "$PLATFORM" == "win-x64" ]] && NODE_BIN="node.exe"
download_file "$NODE_URL" "$RELEASE_DIR/bin/llbot/$NODE_BIN"
chmod +x "$RELEASE_DIR/bin/llbot/$NODE_BIN" 2>/dev/null || true

# ---------- 下载 FFmpeg ----------
log "下载 FFmpeg..."
case "$PLATFORM" in
    linux-x64)   FFMPEG_URL="https://github.com/LLOneBot/exe/releases/latest/download/ffmpeg-linux-x64" ;;
    linux-arm64) FFMPEG_URL="https://github.com/LLOneBot/exe/releases/latest/download/ffmpeg-linux-arm64" ;;
    macos-arm64) FFMPEG_URL="https://github.com/LLOneBot/exe/releases/latest/download/ffmpeg-darwin-arm64" ;;
    win-x64)
        FFMPEG_URL="https://github.com/LLOneBot/exe/releases/latest/download/ffmpeg.exe"
        FFPROBE_URL="https://github.com/LLOneBot/exe/releases/latest/download/ffprobe.exe"
        ;;
esac

FFMPEG_BIN="ffmpeg"
[[ "$PLATFORM" == "win-x64" ]] && FFMPEG_BIN="ffmpeg.exe"
download_file "$FFMPEG_URL" "$RELEASE_DIR/bin/llbot/$FFMPEG_BIN"
chmod +x "$RELEASE_DIR/bin/llbot/$FFMPEG_BIN" 2>/dev/null || true

# Windows 额外下载 ffprobe
if [[ "$PLATFORM" == "win-x64" ]]; then
    download_file "$FFPROBE_URL" "$RELEASE_DIR/bin/llbot/ffprobe.exe"
fi

# ---------- 下载 LLBot CLI ----------
log "下载 LLBot CLI..."
case "$PLATFORM" in
    linux-x64)   LLBOT_CLI_URL="https://github.com/LLOneBot/LuckyLillia.CLI/releases/latest/download/llbot-linux-x64" ;;
    linux-arm64) LLBOT_CLI_URL="https://github.com/LLOneBot/LuckyLillia.CLI/releases/latest/download/llbot-linux-arm64" ;;
    macos-arm64) LLBOT_CLI_URL="https://github.com/LLOneBot/LuckyLillia.CLI/releases/latest/download/llbot-macos-arm64" ;;
    win-x64)     LLBOT_CLI_URL="https://github.com/LLOneBot/LuckyLillia.CLI/releases/latest/download/llbot-win-x64.exe" ;;
esac

LLBOT_CLI_BIN="llbot"
[[ "$PLATFORM" == "win-x64" ]] && LLBOT_CLI_BIN="llbot.exe"
download_file "$LLBOT_CLI_URL" "$RELEASE_DIR/$LLBOT_CLI_BIN"
chmod +x "$RELEASE_DIR/$LLBOT_CLI_BIN" 2>/dev/null || true

# ---------- 复制启动脚本 ----------
log "复制启动脚本..."
case "$PLATFORM" in
    linux-x64|linux-arm64)
        cp script/start-linux.sh "$RELEASE_DIR/start.sh"
        chmod +x "$RELEASE_DIR/start.sh"
        ;;
    macos-arm64)
        cp script/start-mac.sh "$RELEASE_DIR/start.sh"
        chmod +x "$RELEASE_DIR/start.sh"
        ;;
    win-x64)
        # Windows 没有启动脚本，直接运行 llbot.exe
        ;;
esac

# ---------- 打包 ----------
log "打包发布文件..."
cd "$RELEASE_DIR"
case "$PLATFORM" in
    linux-x64)   ARCHIVE_NAME="LLBot-CLI-linux-x64.zip" ;;
    linux-arm64) ARCHIVE_NAME="LLBot-CLI-linux-arm64.zip" ;;
    macos-arm64) ARCHIVE_NAME="LLBot-CLI-macos-arm64.tar.xz" ;;
    win-x64)     ARCHIVE_NAME="LLBot-CLI-win-x64.zip" ;;
esac

if [[ "$PLATFORM" == macos-* ]]; then
    tar -cJvf "../$ARCHIVE_NAME" ./*
else
    zip -r "../$ARCHIVE_NAME" ./*
fi
cd "$ROOT_DIR"

log "构建完成!"
log "发布包: $ROOT_DIR/$ARCHIVE_NAME"
log "发布目录: $RELEASE_DIR"
log ""
log "目录结构:"
log "  $RELEASE_DIR/"
log "  ├── bin/"
log "  │   ├── llbot/          # LLBot 主程序及依赖"
log "  │   └── pmhq/           # PMHQ QQ客户端容器"
log "  ├── llbot[.exe]         # LLBot CLI"
log "  ├── start.sh            # 启动脚本 (Linux/macOS)"
log "  ├── 使用说明.txt"
log "  └── 更新日志.txt"
