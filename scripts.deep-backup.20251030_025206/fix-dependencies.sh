#!/bin/bash
# Xorigo UI Monorepo 依赖修复脚本
# 用途：修复 P0 阻塞问题，恢复 npm install 正常工作

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 步骤标题
step() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# 获取脚本目录和项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# ============================================
# 步骤 1: 检查当前状态
# ============================================
step "步骤 1: 检查当前状态"

log_info "检查 node_modules 权限..."
if [ ! -d "node_modules" ]; then
    log_warn "node_modules 目录不存在，将在后续步骤创建"
elif [ ! -w "node_modules" ]; then
    log_error "node_modules 目录没有写权限"
    log_info "尝试修复权限..."
    if sudo chown -R "$USER:$USER" node_modules 2>/dev/null; then
        log_success "权限修复成功"
    else
        log_error "权限修复失败，尝试删除 node_modules..."
        if sudo rm -rf node_modules; then
            log_success "node_modules 已删除"
        else
            log_error "无法删除 node_modules，请手动执行："
            echo "    sudo rm -rf node_modules"
            exit 1
        fi
    fi
else
    log_success "node_modules 权限正常"
fi

log_info "检查 @xorigo-ui/core 构建产物..."
if [ -d "packages/core/dist" ]; then
    log_success "packages/core/dist 存在"
else
    log_warn "packages/core/dist 不存在，需要构建"
fi

log_info "检查 @xorigo-ui/registry 构建产物..."
if [ -d "packages/registry/dist" ]; then
    log_success "packages/registry/dist 存在"
else
    log_warn "packages/registry/dist 不存在，需要构建"
fi

# ============================================
# 步骤 2: 清理环境
# ============================================
step "步骤 2: 清理环境"

log_info "清理 npm 缓存..."
npm cache clean --force
log_success "npm 缓存已清理"

log_info "删除所有 node_modules 和 package-lock.json..."
rm -rf node_modules package-lock.json
rm -rf packages/core/node_modules packages/core/package-lock.json
rm -rf packages/registry/node_modules packages/registry/package-lock.json
rm -rf apps/website/node_modules apps/website/package-lock.json
log_success "所有 node_modules 和 package-lock.json 已删除"

# ============================================
# 步骤 3: 构建 @xorigo-ui/core
# ============================================
step "步骤 3: 构建 @xorigo-ui/core"

cd "$PROJECT_ROOT/packages/core"
log_info "当前目录: $(pwd)"

log_info "安装 @xorigo-ui/core 依赖..."
npm install --legacy-peer-deps
log_success "@xorigo-ui/core 依赖安装完成"

log_info "构建 @xorigo-ui/core..."
npm run build
log_success "@xorigo-ui/core 构建完成"

log_info "验证构建产物..."
if [ -f "dist/index.js" ] && [ -f "dist/index.mjs" ]; then
    log_success "构建产物验证成功"
else
    log_error "构建产物不完整，请检查构建日志"
    exit 1
fi

# ============================================
# 步骤 4: 构建 @xorigo-ui/registry
# ============================================
step "步骤 4: 构建 @xorigo-ui/registry"

cd "$PROJECT_ROOT/packages/registry"
log_info "当前目录: $(pwd)"

log_info "安装 @xorigo-ui/registry 依赖..."
npm install --legacy-peer-deps
log_success "@xorigo-ui/registry 依赖安装完成"

log_info "构建 @xorigo-ui/registry..."
npm run build
log_success "@xorigo-ui/registry 构建完成"

log_info "验证构建产物..."
if [ -f "dist/index.cjs.js" ] || [ -f "dist/index.es.js" ]; then
    log_success "构建产物验证成功"
else
    log_error "构建产物不完整，请检查构建日志"
    exit 1
fi

# ============================================
# 步骤 5: 安装根工作区依赖
# ============================================
step "步骤 5: 安装根工作区依赖"

cd "$PROJECT_ROOT"
log_info "当前目录: $(pwd)"

log_info "安装根工作区依赖..."
npm install
log_success "根工作区依赖安装完成"

# ============================================
# 步骤 6: 验证安装结果
# ============================================
step "步骤 6: 验证安装结果"

log_info "检查 @xorigo-ui/core 依赖状态..."
if npm ls @xorigo-ui/core 2>&1 | grep -q "invalid"; then
    log_error "@xorigo-ui/core 依赖仍然无效"
    npm ls @xorigo-ui/core
    exit 1
else
    log_success "@xorigo-ui/core 依赖状态正常"
fi

log_info "检查 UNMET DEPENDENCY..."
UNMET_COUNT=$(npm ls 2>&1 | grep -c "UNMET DEPENDENCY" || true)
if [ "$UNMET_COUNT" -gt 0 ]; then
    log_warn "仍有 $UNMET_COUNT 个 UNMET DEPENDENCY"
    log_info "这些依赖可能需要手动安装"
else
    log_success "没有 UNMET DEPENDENCY"
fi

log_info "检查构建能力..."
if npm run build --workspace=@xorigo-ui/core 2>&1 | grep -q "ERROR"; then
    log_error "@xorigo-ui/core 构建失败"
    exit 1
else
    log_success "@xorigo-ui/core 构建成功"
fi

# ============================================
# 完成
# ============================================
step "修复完成"

echo ""
echo -e "${GREEN}✅ 依赖修复成功！${NC}"
echo ""
echo -e "${BLUE}下一步：${NC}"
echo "1. 运行开发服务器："
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. 或运行 Docker 开发环境："
echo "   ${YELLOW}npm run docker:dev${NC}"
echo ""
echo "3. 查看完整依赖分析报告："
echo "   ${YELLOW}cat docs/reports/dependency-analysis-report.md${NC}"
echo ""
echo -e "${BLUE}如果仍有问题，请查阅报告中的 P0 和 P1 问题部分${NC}"
echo ""
