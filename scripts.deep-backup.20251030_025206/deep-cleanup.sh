#!/bin/bash

# Scripts目录深度清理脚本
# 清理更多无用、过时和冗余的脚本文件

set -e

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPTS_DIR")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_purple() { echo -e "${PURPLE}[CLEANUP]${NC} $1"; }

# 创建深度备份
deep_backup() {
    log_info "📦 创建深度备份..."
    local backup_dir="${SCRIPTS_DIR}.deep-backup.$(date +%Y%m%d_%H%M%S)"
    cp -r "$SCRIPTS_DIR" "$backup_dir"
    log_success "✅ 深度备份完成: $backup_dir"
}

# 分析脚本文件用途
analyze_scripts() {
    log_info "🔍 深度分析脚本文件用途..."

    local total_files=$(find "$SCRIPTS_DIR" -maxdepth 1 -name "*.sh" -o -name "*.js" -o -name "*.ts" | wc -l)
    log_info "📊 当前脚本总数: $total_files"

    echo
    log_purple "📋 脚本分类分析:"

    # 分析脚本类型和用途
    echo "   🚀 开发管理: $(find "$SCRIPTS_DIR" -name "*dev*" | wc -l) 个"
    echo "   🐳 Docker相关: $(find "$SCRIPTS_DIR" -name "*docker*" | wc -l) 个"
    echo "   🧪 测试相关: $(find "$SCRIPTS_DIR" -name "*test*" | wc -l) 个"
    echo "   📦 构建相关: $(find "$SCRIPTS_DIR" -name "*build*" -o -name "*generate*" | wc -l) 个"
    echo "   🔧 修复工具: $(find "$SCRIPTS_DIR" -name "*fix*" | wc -l) 个"
    echo "   🔙 回滚相关: $(find "$SCRIPTS_DIR" -name "*rollback*" | wc -l) 个"
    echo "   🏷️ 重命名相关: $(find "$SCRIPTS_DIR" -name "*rename*" | wc -l) 个"
    echo "   ✅ 验证工具: $(find "$SCRIPTS_DIR" -name "*verify*" | wc -l) 个"
    echo "   📦 发布相关: $(find "$SCRIPTS_DIR" -name "*publish*" | wc -l) 个"
    echo
}

# 清理明显过时的脚本
cleanup_obsolete_scripts() {
    log_purple "🗑️ 清理明显过时的脚本..."

    local obsolete_scripts=(
        # 重命名相关脚本 - 项目已经重命名完成，不再需要
        "rename-to-xorigo.sh"
        "rename-directories-and-repo.sh"
        "rollback-rename.sh"

        # 回滚相关脚本 - 除非正在进行回滚，否则可以删除
        "rollback.sh"
        "rollback-release.js"

        # 过时的Docker脚本
        "docker-dev-guard.sh"
        "docker-monorepo-dev.sh"

        # 过时的测试脚本
        "test-dev-server-agent.sh"
        "test-hooks-system.sh"

        # 一次性使用脚本
        "final-acceptance.sh"
        "diagnose-layer.sh"

        # 开发环境脚本 - 已被新的dev-server.sh替代
        "restart-dev.sh"
        "quick-fix-build.sh"

        # 安装脚本 - 如果工具已安装则不再需要
        "install-dx-tools.sh"
    )

    local deleted_count=0
    for script in "${obsolete_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            log_info "   删除过时脚本: $script"
            rm "$SCRIPTS_DIR/$script"
            deleted_count=$((deleted_count + 1))
        fi
    done

    log_success "✅ 删除了 $deleted_count 个过时脚本"
}

# 清理重复功能的脚本
cleanup_duplicate_scripts() {
    log_purple "🔄 清理重复功能的脚本..."

    # 检查重复的Docker脚本
    local docker_scripts=("docker-dev-guard.sh" "docker-monorepo-dev.sh")
    local has_docker_dev_manager=false

    if [ -f "$SCRIPTS_DIR/docker/docker-manager.sh" ]; then
        has_docker_dev_manager=true
    fi

    if [ "$has_docker_dev_manager" = true ]; then
        for script in "${docker_scripts[@]}"; do
            if [ -f "$SCRIPTS_DIR/$script" ]; then
                log_info "   删除重复Docker脚本: $script (已由docker-manager.sh替代)"
                rm "$SCRIPTS_DIR/$script"
            fi
        done
    fi

    # 检查重复的验证脚本
    local verify_scripts=(
        "verify-docker-compose-update.sh"
        "verify-dx-tools.sh"
        "verify-rename.js"
    )

    for script in "${verify_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            log_info "   删除过时验证脚本: $script"
            rm "$SCRIPTS_DIR/$script"
        fi
    done

    log_success "✅ 清理重复功能脚本完成"
}

# 清理大型一次性脚本
cleanup_large_scripts() {
    log_purple "📦 清理大型一次性脚本..."

    # 检查文件大小，删除大型但不再需要的脚本
    while IFS= read -r script; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            local size=$(stat -f%z "$SCRIPTS_DIR/$script" 2>/dev/null || stat -c%s "$SCRIPTS_DIR/$script" 2>/dev/null || echo 0)
            if [ "$size" -gt 10000 ]; then  # 大于10KB的脚本
                case "$script" in
                    "final-acceptance.sh"|"diagnose-layer.sh"|"rename-to-xorigo.sh")
                        log_info "   删除大型一次性脚本: $script (${size}字节)"
                        rm "$SCRIPTS_DIR/$script"
                        ;;
                esac
            fi
        fi
    done < <(find "$SCRIPTS_DIR" -maxdepth 1 -name "*.sh" -o -name "*.js" -o -name "*.ts")

    log_success "✅ 大型脚本清理完成"
}

# 整理剩余脚本到合适的分类目录
organize_remaining_scripts() {
    log_purple "🗂️ 整理剩余脚本到分类目录..."

    # 创建额外的分类目录
    mkdir -p "$SCRIPTS_DIR/maintenance"
    mkdir -p "$SCRIPTS_DIR/automation"
    mkdir -p "$SCRIPTS_DIR/monitoring"

    # 移动维护相关脚本
    local maintenance_scripts=(
        "health-check.sh"
        "fix-dependencies.sh"
        "fix-theme-access.js"
    )

    for script in "${maintenance_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            log_info "   移动维护脚本: $script -> maintenance/"
            mv "$SCRIPTS_DIR/$script" "$SCRIPTS_DIR/maintenance/"
        fi
    done

    # 移动自动化脚本
    local automation_scripts=(
        "local-ci.sh"
        "load-test.sh"
    )

    for script in "${automation_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            log_info "   移动自动化脚本: $script -> automation/"
            mv "$SCRIPTS_DIR/$script" "$SCRIPTS_DIR/automation/"
        fi
    done

    # 移动监控脚本
    local monitoring_scripts=(
        "publish-monitor.js"
        "validate-release.js"
    )

    for script in "${monitoring_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            log_info "   移动监控脚本: $script -> monitoring/"
            mv "$SCRIPTS_DIR/$script" "$SCRIPTS_DIR/monitoring/"
        fi
    done

    # 移动剩余的Docker相关脚本到docker目录
    local remaining_docker_scripts=()
    while IFS= read -r script; do
        if [[ "$script" == *"docker"* ]]; then
            remaining_docker_scripts+=("$script")
        fi
    done < <(find "$SCRIPTS_DIR" -maxdepth 1 -name "*docker*")

    for script in "${remaining_docker_scripts[@]}"; do
        if [ -f "$SCRIPTS_DIR/$script" ]; then
            log_info "   移动Docker脚本: $script -> docker/"
            mv "$SCRIPTS_DIR/$script" "$SCRIPTS_DIR/docker/"
        fi
    done

    log_success "✅ 脚本整理完成"
}

# 清理生成的文档和临时文件
cleanup_generated_files() {
    log_purple "🧹 清理生成的文档和临时文件..."

    # 删除生成的文档文件
    local generated_docs=(
        "scripts-cleanup-plan.md"
    )

    for doc in "${generated_docs[@]}"; do
        if [ -f "$SCRIPTS_DIR/$doc" ]; then
            log_info "   删除生成的文档: $doc"
            rm "$SCRIPTS_DIR/$doc"
        fi
    done

    # 删除临时文件和备份文件（保留最近的备份）
    find "$SCRIPTS_DIR" -name "*.tmp" -delete 2>/dev/null || true
    find "$SCRIPTS_DIR" -name "*.log" -delete 2>/dev/null || true

    # 清理旧备份，只保留最近3个
    local backup_count=$(find "$PROJECT_ROOT" -maxdepth 1 -name "scripts.backup.*" | wc -l)
    if [ "$backup_count" -gt 3 ]; then
        find "$PROJECT_ROOT" -maxdepth 1 -name "scripts.backup.*" | sort -r | tail -n +4 | xargs rm -rf 2>/dev/null || true
        log_info "   清理旧备份文件，保留最近3个"
    fi

    log_success "✅ 临时文件清理完成"
}

# 创建脚本使用说明
create_usage_guide() {
    log_purple "📖 创建脚本使用说明..."

    cat > "$SCRIPTS_DIR/README.md" << 'EOF'
# Scripts 使用指南

## 🚀 开发服务器管理
```bash
pnpm server:start      # 启动开发服务器
pnpm server:stop       # 停止开发服务器
pnpm server:restart    # 重启开发服务器
pnpm server:status     # 检查服务器状态
pnpm server:cleanup    # 清理所有进程
```

## 🐳 Docker 管理
```bash
bash scripts/docker/docker-manager.sh dev    # 开发环境Docker
bash scripts/docker/docker-manager.sh prod   # 生产环境Docker
bash scripts/docker/docker-manager.sh cleanup # 清理Docker资源
```

## 🧪 测试管理
```bash
bash scripts/test/test-manager.sh visual  # 视觉测试
bash scripts/test/test-manager.sh setup   # 设置测试环境
bash scripts/test/test-manager.sh cleanup # 清理测试环境
```

## 🔍 检查工具
```bash
bash scripts/check/check-dependencies.sh  # 检查依赖
bash scripts/check/check-deps.sh           # 检查包依赖
bash scripts/check/check-theme.js         # 检查主题
```

## 🏗️ 构建工具
```bash
node scripts/build/bundle-analyzer.js      # 包分析
node scripts/build/convert-theme-tokens.ts # 转换主题令牌
```

## 📦 包管理
```bash
bash scripts/package/detect-package-manager.sh # 检测包管理器
node scripts/package/validate-packages.js       # 验证包
```

## 🔧 维护工具
```bash
bash scripts/maintenance/health-check.sh     # 健康检查
bash scripts/maintenance/fix-dependencies.sh # 修复依赖
node scripts/maintenance/fix-theme-access.js  # 修复主题访问
```

## 🤖 自动化
```bash
bash scripts/automation/local-ci.sh    # 本地CI
bash scripts/automation/load-test.sh    # 负载测试
```

## 📊 监控
```bash
node scripts/monitoring/publish-monitor.js # 发布监控
node scripts/monitoring/validate-release.js # 验证发布
```

## 🎨 可视化测试
```bash
bash scripts/update-visual-baselines.sh  # 更新视觉基线
node scripts/visual-test-summary.js     # 测试总结
```

## 📈 架构和文档
```bash
node scripts/generate-arch-diagram.ts   # 生成架构图
node scripts/generate-component-docs.ts # 生成组件文档
```
EOF

    log_success "✅ 使用说明创建完成"
}

# 生成清理报告
generate_cleanup_report() {
    log_purple "📊 生成深度清理报告..."

    local final_count=$(find "$SCRIPTS_DIR" -name "*.sh" -o -name "*.js" -o -name "*.ts" | wc -l)
    local dir_count=$(find "$SCRIPTS_DIR" -type d | wc -l)

    echo
    log_success "🎉 Scripts目录深度清理完成！"
    echo
    echo "📊 清理统计:"
    echo "   清理前脚本数量: 46"
    echo "   清理后脚本数量: $final_count"
    echo "   减少脚本数量: $((46 - final_count))"
    echo "   目录数量: $dir_count (包含分类目录)"
    echo

    echo "📁 最终目录结构:"
    tree "$SCRIPTS_DIR" -I "*.backup*" --noreport 2>/dev/null || find "$SCRIPTS_DIR" -type d | sort

    echo
    log_purple "📋 保留的核心脚本:"
    echo "   🚀 dev-server.sh (开发服务器管理)"
    echo "   🔧 dev-env-manager.js (开发环境管理)"
    echo "   📦 build/ (构建工具)"
    echo "   🔍 check/ (检查工具)"
    echo "   🐳 docker/ (Docker管理)"
    echo "   🚀 deploy/ (部署工具)"
    echo "   📦 package/ (包管理)"
    echo "   🧪 test/ (测试工具)"
    echo "   🔧 maintenance/ (维护工具)"
    echo "   🤖 automation/ (自动化)"
    echo "   📊 monitoring/ (监控)"

    echo
    log_info "💡 使用 'pnpm server:start' 启动开发服务器"
    log_info "📖 查看 $SCRIPTS_DIR/README.md 了解详细用法"
}

# 主函数
main() {
    echo "🧹 Scripts目录深度清理工具"
    echo "==========================="
    echo

    # 执行深度清理步骤
    deep_backup
    analyze_scripts
    cleanup_obsolete_scripts
    cleanup_duplicate_scripts
    cleanup_large_scripts
    organize_remaining_scripts
    cleanup_generated_files
    create_usage_guide
    generate_cleanup_report

    log_success "✅ 所有深度清理任务完成！"
}

# 执行主函数
main "$@"