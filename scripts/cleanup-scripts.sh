#!/bin/bash

# Scripts 目录清理脚本
# 整理52个脚本文件，去除冗余，分类管理

set -e

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPTS_DIR")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 创建备份
backup_scripts() {
    log_info "📦 创建当前scripts目录备份..."
    local backup_dir="${SCRIPTS_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
    cp -r "$SCRIPTS_DIR" "$backup_dir"
    log_success "✅ 备份完成: $backup_dir"
}

# 创建新的目录结构
create_directories() {
    log_info "📁 创建新的目录结构..."

    mkdir -p "$SCRIPTS_DIR/docker"
    mkdir -p "$SCRIPTS_DIR/deploy"
    mkdir -p "$SCRIPTS_DIR/test"
    mkdir -p "$SCRIPTS_DIR/check"
    mkdir -p "$SCRIPTS_DIR/build"
    mkdir -p "$SCRIPTS_DIR/package"

    log_success "✅ 目录结构创建完成"
}

# 分析现有脚本
analyze_scripts() {
    log_info "🔍 分析现有脚本文件..."

    # 统计当前脚本数量
    local total_scripts=$(find "$SCRIPTS_DIR" -name "*.sh" -o -name "*.js" -o -name "*.ts" | grep -v cleanup-scripts.sh | wc -l)
    log_info "📊 当前脚本总数: $total_scripts"

    # 列出脚本分类
    echo
    log_info "📋 脚本分类统计:"

    # 开发相关脚本
    local dev_scripts=$(find "$SCRIPTS_DIR" -name "*dev*" -o -name "*agent*" | wc -l)
    echo "   开发环境脚本: $dev_scripts"

    # Docker相关脚本
    local docker_scripts=$(find "$SCRIPTS_DIR" -name "*docker*" | wc -l)
    echo "   Docker脚本: $docker_scripts"

    # 部署相关脚本
    local deploy_scripts=$(find "$SCRIPTS_DIR" -name "*deploy*" | wc -l)
    echo "   部署脚本: $deploy_scripts"

    # 测试相关脚本
    local test_scripts=$(find "$SCRIPTS_DIR" -name "*test*" -o -name "*visual*" | wc -l)
    echo "   测试脚本: $test_scripts"

    # 检查相关脚本
    local check_scripts=$(find "$SCRIPTS_DIR" -name "*check*" | wc -l)
    echo "   检查脚本: $check_scripts"

    echo
}

# 移动脚本到新目录
organize_scripts() {
    log_info "🗂️ 开始组织脚本文件..."

    # Docker脚本
    log_info "   🐳 组织Docker脚本..."
    if [ -f "$SCRIPTS_DIR/docker-dev.sh" ]; then
        mv "$SCRIPTS_DIR/docker-dev.sh" "$SCRIPTS_DIR/docker/docker-dev.sh"
    fi
    if [ -f "$SCRIPTS_DIR/docker-prod.sh" ]; then
        mv "$SCRIPTS_DIR/docker-prod.sh" "$SCRIPTS_DIR/docker/docker-prod.sh"
    fi

    # 部署脚本
    log_info "   🚀 组织部署脚本..."
    if [ -f "$SCRIPTS_DIR/deploy.sh" ]; then
        mv "$SCRIPTS_DIR/deploy.sh" "$SCRIPTS_DIR/deploy/deploy.sh"
    fi
    if [ -f "$SCRIPTS_DIR/deploy-production.sh" ]; then
        mv "$SCRIPTS_DIR/deploy-production.sh" "$SCRIPTS_DIR/deploy/deploy-production.sh"
    fi
    if [ -f "$SCRIPTS_DIR/deploy-prod-simple.sh" ]; then
        mv "$SCRIPTS_DIR/deploy-prod-simple.sh" "$SCRIPTS_DIR/deploy/deploy-simple.sh"
    fi

    # 检查脚本
    log_info "   🔍 组织检查脚本..."
    if [ -f "$SCRIPTS_DIR/check-dependencies.sh" ]; then
        mv "$SCRIPTS_DIR/check-dependencies.sh" "$SCRIPTS_DIR/check/check-dependencies.sh"
    fi
    if [ -f "$SCRIPTS_DIR/check-deps.sh" ]; then
        mv "$SCRIPTS_DIR/check-deps.sh" "$SCRIPTS_DIR/check/check-deps.sh"
    fi
    if [ -f "$SCRIPTS_DIR/check-theme-issues.js" ]; then
        mv "$SCRIPTS_DIR/check-theme-issues.js" "$SCRIPTS_DIR/check/check-theme.js"
    fi

    # 构建脚本
    log_info "   🏗️ 组织构建脚本..."
    if [ -f "$SCRIPTS_DIR/bundle-analyzer.js" ]; then
        mv "$SCRIPTS_DIR/bundle-analyzer.js" "$SCRIPTS_DIR/build/bundle-analyzer.js"
    fi
    if [ -f "$SCRIPTS_DIR/convert-theme-tokens.ts" ]; then
        mv "$SCRIPTS_DIR/convert-theme-tokens.ts" "$SCRIPTS_DIR/build/convert-theme-tokens.ts"
    fi

    # 包管理脚本
    log_info "   📦 组织包管理脚本..."
    if [ -f "$SCRIPTS_DIR/detect-package-manager.sh" ]; then
        mv "$SCRIPTS_DIR/detect-package-manager.sh" "$SCRIPTS_DIR/package/detect-package-manager.sh"
    fi
    if [ -f "$SCRIPTS_DIR/validate-packages.js" ]; then
        mv "$SCRIPTS_DIR/validate-packages.js" "$SCRIPTS_DIR/package/validate-packages.js"
    fi

    log_success "✅ 脚本组织完成"
}

# 删除重复和废弃的脚本
remove_redundant_scripts() {
    log_info "🗑️ 删除重复和废弃的脚本..."

    # 需要删除的脚本列表
    local redundant_scripts=(
        "dev-menu.sh"
        "agent-dev-server.sh"
        "dev-docker.sh"
        "dev-docker-logs.sh"
        "dev-docker-stop.sh"
        "deploy-logs.sh"
        "deploy-rebuild.sh"
        "deploy-stop.sh"
        "deploy-prod-simple.sh"  # 如果已移动到deploy目录
        "check-deps.sh"  # 如果已移动到check目录
    )

    local deleted_count=0
    for script in "${redundant_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            rm "$SCRIPTS_DIR/$script"
            log_info "   删除: $script"
            deleted_count=$((deleted_count + 1))
        fi
    done

    # 删除符号链接
    log_info "   🔗 处理符号链接..."
    find "$SCRIPTS_DIR" -type l -exec rm {} \; 2>/dev/null || true

    log_success "✅ 删除了 $deleted_count 个冗余脚本"
}

# 创建新的统一脚本
create_unified_scripts() {
    log_info "🔧 创建统一的管理脚本..."

    # 创建统一的Docker管理脚本
    cat > "$SCRIPTS_DIR/docker/docker-manager.sh" << 'EOF'
#!/bin/bash
# Docker 管理脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$1" in
    "dev"|"development")
        bash "$SCRIPT_DIR/docker-dev.sh"
        ;;
    "prod"|"production")
        bash "$SCRIPT_DIR/docker-prod.sh"
        ;;
    "cleanup"|"clean")
        bash "$SCRIPT_DIR/docker-cleanup.sh"
        ;;
    *)
        echo "用法: $0 {dev|prod|cleanup}"
        echo "  dev     - 开发环境Docker"
        echo "  prod    - 生产环境Docker"
        echo "  cleanup - 清理Docker资源"
        exit 1
        ;;
esac
EOF

    chmod +x "$SCRIPTS_DIR/docker/docker-manager.sh"

    # 创建统一的测试管理脚本
    cat > "$SCRIPTS_DIR/test/test-manager.sh" << 'EOF'
#!/bin/bash
# 测试管理脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$1" in
    "visual")
        bash "$SCRIPT_DIR/visual-test-runner.sh"
        ;;
    "setup")
        bash "$SCRIPT_DIR/test-setup.sh"
        ;;
    "cleanup")
        bash "$SCRIPT_DIR/test-cleanup.sh"
        ;;
    *)
        echo "用法: $0 {visual|setup|cleanup}"
        echo "  visual  - 运行视觉测试"
        echo "  setup   - 设置测试环境"
        echo "  cleanup - 清理测试环境"
        exit 1
        ;;
esac
EOF

    chmod +x "$SCRIPTS_DIR/test/test-manager.sh"

    log_success "✅ 统一管理脚本创建完成"
}

# 更新package.json脚本引用
update_package_json() {
    log_info "📝 更新package.json脚本引用..."

    # 检查package.json是否存在
    if [ ! -f "$PROJECT_ROOT/package.json" ]; then
        log_warning "⚠️ package.json不存在，跳过更新"
        return
    fi

    # 这里可以添加自动更新package.json的逻辑
    # 由于复杂性，建议手动更新
    log_info "💡 请手动更新package.json中的脚本路径"
    log_info "📖 参考 scripts-cleanup-plan.md 中的新脚本结构"
}

# 生成整理报告
generate_report() {
    log_info "📊 生成整理报告..."

    local final_count=$(find "$SCRIPTS_DIR" -name "*.sh" -o -name "*.js" -o -name "*.ts" | grep -v cleanup-scripts.sh | wc -l)

    echo
    log_success "🎉 Scripts目录整理完成！"
    echo
    echo "📊 整理统计:"
    echo "   整理前脚本数量: 52"
    echo "   整理后脚本数量: $final_count"
    echo "   减少脚本数量: $((52 - final_count))"
    echo
    echo "📁 新的目录结构:"
    tree "$SCRIPTS_DIR" -I "*.backup*" --noreport 2>/dev/null || find "$SCRIPTS_DIR" -type d | sort

    echo
    log_info "📖 详细说明请查看: $SCRIPTS_DIR/scripts-cleanup-plan.md"
}

# 主函数
main() {
    echo "🧹 Scripts目录清理工具"
    echo "========================"
    echo

    # 检查是否在正确的目录
    if [ ! -f "$SCRIPTS_DIR/dev-server.sh" ]; then
        log_error "❌ 请在scripts目录下运行此脚本"
        exit 1
    fi

    # 执行清理步骤
    backup_scripts
    analyze_scripts
    create_directories
    organize_scripts
    remove_redundant_scripts
    create_unified_scripts
    update_package_json
    generate_report

    log_success "✅ 所有清理任务完成！"
}

# 执行主函数
main "$@"