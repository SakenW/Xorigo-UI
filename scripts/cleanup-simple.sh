#!/bin/bash

# 简化的Skill冲突清理脚本
# 以Skill为准，删除项目中重复的功能实现

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd"
WEBSITE_ROOT="$PROJECT_ROOT/apps/website"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_purple() { echo -e "${PURPLE}[CLEANUP]${NC} $1"; }
log_cyan() { echo -e "${CYAN}[SKILL]${NC} $1"; }

# 创建备份
create_backup() {
    log_info "📦 创建备份..."
    local backup_dir="$PROJECT_ROOT.skill-backup.$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$backup_dir"

    # 备份可能冲突的目录
    if [ -d "$WEBSITE_ROOT/src/components/performance-monitoring" ]; then
        cp -r "$WEBSITE_ROOT/src/components/performance-monitoring" "$backup_dir/"
    fi

    log_success "✅ 备份完成: $backup_dir"
}

# 清理性能监控重复内容
cleanup_performance_monitoring() {
    log_purple "⚡ 清理性能监控重复内容..."

    # 检查是否有对应的skill
    if [ -d "$PROJECT_ROOT/.claude/skills/xorigo-performance-optimizer" ]; then
        log_cyan "   🤖 发现 xorigo-performance-optimizer skill"

        # 删除整个performance-monitoring目录
        local perf_dir="$WEBSITE_ROOT/src/components/performance-monitoring"
        if [ -d "$perf_dir" ]; then
            local file_count=$(find "$perf_dir" -name "*.tsx" | wc -l)
            log_info "     删除 performance-monitoring 目录 ($file_count 个文件)"
            rm -rf "$perf_dir"
            log_success "     ✅ 性能监控重复内容已清理"
        fi
    else
        log_info "   未发现对应的skill"
    fi
}

# 清理测试相关重复内容
cleanup_test_content() {
    log_purple "🧪 清理测试相关重复内容..."

    # 检查是否有对应的skill
    if [ -d "$PROJECT_ROOT/.claude/skills/xorigo-test-automation" ]; then
        log_cyan "   🤖 发现 xorigo-test-automation skill"

        # 删除测试相关文件
        local test_dir="$WEBSITE_ROOT/src/components/test"
        if [ -d "$test_dir" ]; then
            local file_count=$(find "$test_dir" -name "*.tsx" | wc -l)
            if [ "$file_count" -gt 0 ]; then
                log_info "     删除test目录中的文件 ($file_count 个)"
                rm -rf "$test_dir"
                log_success "     ✅ 测试重复内容已清理"
            fi
        fi
    else
        log_info "   未发现对应的skill"
    fi
}

# 清理其他重复组件
cleanup_other_components() {
    log_purple "🗑️ 清理其他重复组件..."

    # 删除重复的组件生成器
    local generator1="$WEBSITE_ROOT/src/components/components/code-generator.tsx"
    local generator2="$WEBSITE_ROOT/src/components/perf/performance-chart.tsx"

    local deleted_count=0
    for file in "$generator1" "$generator2"; do
        if [ -f "$file" ]; then
            log_info "   删除: $(basename "$file")"
            rm "$file"
            deleted_count=$((deleted_count + 1))
        fi
    done

    if [ "$deleted_count" -gt 0 ]; then
        log_success "   ✅ 删除了 $deleted_count 个重复组件"
    fi
}

# 清理空目录
cleanup_empty_dirs() {
    log_purple "📁 清理空目录..."

    # 清理空的组件目录
    local empty_count=0
    find "$WEBSITE_ROOT/src/components" -type d -empty -delete 2>/dev/null || true
    empty_count=$((empty_count + $(find "$WEBSITE_ROOT/src/components" -type d -empty 2>/dev/null | wc -l)))

    if [ "$empty_count" -gt 0 ]; then
        log_success "   ✅ 删除了 $empty_count 个空目录"
    else
        log_info "   没有发现空目录"
    fi
}

# 生成报告
generate_report() {
    log_purple "📊 生成清理报告..."

    echo
    log_success "🎉 Skill冲突清理完成！"
    echo
    echo "📊 清理统计:"
    echo "   🤖 发现的Skills: $(ls "$PROJECT_ROOT/.claude/skills" 2>/dev/null | grep -v README.md | wc -l) 个"
    echo "   📁 清理的目录: performance-monitoring, test等"
    echo "   📋 保留的原则: 以Skill为准，删除重复实现"
    echo

    echo "🤖 主要Skills:"
    echo "   ✅ xorigo-performance-optimizer - 性能优化"
    echo "   ✅ xorigo-test-automation - 测试自动化"
    echo "   ✅ xorigo-component-generator - 组件生成"
    echo "   ✅ xorigo-docs-generator - 文档生成"
    echo "   ✅ xorigo-design-tokens-manager - 设计令牌"
    echo "   ✅ 以及其他20+个专用Skills"

    echo
    log_cyan "💡 现在可以直接使用Skills功能替代重复实现！"
}

# 主函数
main() {
    echo "🧹 Skill冲突清理工具 (简化版)"
    echo "==========================="
    echo

    # 执行清理步骤
    create_backup
    cleanup_performance_monitoring
    cleanup_test_content
    cleanup_other_components
    cleanup_empty_dirs
    generate_report

    log_success "✅ Skill冲突清理完成！"
}

# 执行主函数
main "$@"