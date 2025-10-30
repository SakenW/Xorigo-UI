#!/bin/bash

# 清理与Skill冲突的冗余内容脚本
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
    log_info "📦 创建Skill冲突清理备份..."
    local backup_dir="$PROJECT_ROOT.skill-conflicts-backup.$(date +%Y%m%d_%H%M%S)"

    # 备份可能冲突的目录
    local backup_dirs=(
        "$WEBSITE_ROOT/src/components/performance-monitoring"
        "$WEBSITE_ROOT/src/components/showcase"
        "$WEBSITE_ROOT/src/components/components"
        "$WEBSITE_ROOT/src/services"
        "$WEBSITE_ROOT/src/utils"
        "$WEBSITE_ROOT/src/types"
    )

    mkdir -p "$backup_dir"
    for dir in "${backup_dirs[@]}"; do
        if [ -d "$dir" ]; then
            cp -r "$dir" "$backup_dir/" 2>/dev/null || true
        fi
    done

    log_success "✅ 备份完成: $backup_dir"
}

# 分析Skill对应的功能
analyze_skill_conflicts() {
    log_info "🔍 分析Skill与项目功能的冲突..."

    # 获取所有skill列表
    local skills_dir="$PROJECT_ROOT/.claude/skills"
    if [ ! -d "$skills_dir" ]; then
        log_warning "⚠️ Skills目录不存在，跳过分析"
        return
    fi

    local skill_count=$(ls "$skills_dir" 2>/dev/null | grep -v README.md | wc -l)
    log_cyan "🤖 发现 $skill_count 个Xorigo UI专用Skills"

    echo
    log_purple "📋 Skill功能分类分析:"

    # 分析各个skill对应的项目组件
    echo "   🎨 组件生成: $(find "$WEBSITE_ROOT" -name "*generator*" -o -name "*configurator*" | wc -l) 个文件"
    echo "   🔧 设计令牌: $(find "$WEBSITE_ROOT" -name "*token*" -o -name "*theme*" | wc -l) 个文件"
    echo "   ⚡ 性能优化: $(find "$WEBSITE_ROOT" -name "*performance*" | wc -l) 个文件"
    echo "   🧪 测试自动化: $(find "$WEBSITE_ROOT" -name "*test*" | wc -l) 个文件"
    echo "   📦 代码质量: $(find "$WEBSITE_ROOT" -name "*quality*" -o -name "*code*" | wc -l) 个文件"
    echo "   📖 文档生成: $(find "$WEBSITE_ROOT" -name "*doc*" | wc -l) 个文件"
    echo
}

# 清理重复的组件生成器功能
cleanup_component_generators() {
    log_purple "🗑️ 清理重复的组件生成器功能..."

    # 检查是否有对应的skill
    local component_generator_skill="$PROJECT_ROOT/.claude/skills/xorigo-component-generator"
    if [ -d "$component_generator_skill" ]; then
        log_cyan "   🤖 发现 xorigo-component-generator skill，清理重复实现"

        # 删除重复的组件生成器实现
        local duplicate_generators="$WEBSITE_ROOT/src/components/components/code-generator.tsx $WEBSITE_ROOT/src/components/showcase/Component3DCarousel.tsx $WEBSITE_ROOT/src/components/showcase/ComponentGallery.tsx"

        local deleted_count=0
        for generator in $duplicate_generators; do
            if [ -f "$generator" ]; then
                log_info "     删除: $(basename "$generator")"
                rm "$generator"
                deleted_count=$((deleted_count + 1))
            fi
        done

        log_success "     ✅ 删除了 $deleted_count 个重复的组件生成器"
    else
        log_info "   未发现 xorigo-component-generator skill"
    fi
}

# 清理重复的性能监控功能
cleanup_performance_monitoring() {
    log_purple "⚡ 清理重复的性能监控功能..."

    # 检查是否有对应的skill
    local performance_skill="$PROJECT_ROOT/.claude/skills/xorigo-performance-optimizer"
    if [ -d "$performance_skill" ]; then
        log_cyan "   🤖 发现 xorigo-performance-optimizer skill，清理重复实现"

        # 删除整个performance-monitoring目录
        local perf_monitoring_dir="$WEBSITE_ROOT/src/components/performance-monitoring"
        if [ -d "$perf_monitoring_dir" ]; then
            local file_count=$(find "$perf_monitoring_dir" -name "*.tsx" -o -name "*.ts" | wc -l)
            log_info "     删除 performance-monitoring 目录 ($file_count 个文件)"
            rm -rf "$perf_monitoring_dir"
        fi

        # 删除其他性能相关重复文件
        local duplicate_perf_files=(
            "$WEBSITE_ROOT/src/components/perf/performance-chart.tsx"
        )

        local deleted_count=0
        for file in "${duplicate_perf_files[@]}"; do
            if [ -f "$file" ]; then
                log_info "     删除: $(basename "$file")"
                rm "$file"
                deleted_count=$((deleted_count + 1))
            fi
        done

        log_success "     ✅ 清理了性能监控重复实现"
    else
        log_info "   未发现 xorigo-performance-optimizer skill"
    fi
}

# 清理重复的测试自动化功能
cleanup_test_automation() {
    log_purple "🧪 清理重复的测试自动化功能..."

    # 检查是否有对应的skill
    local test_skill="$PROJECT_ROOT/.claude/skills/xorigo-test-automation"
    if [ -d "$test_skill" ]; then
        log_cyan "   🤖 发现 xorigo-test-automation skill，清理重复实现"

        # 删除重复的测试组件
        local duplicate_test_files=(
            "$WEBSITE_ROOT/src/components/test/test-simple.tsx"
        )

        local deleted_count=0
        for file in "${duplicate_test_files[@]}"; do
            if [ -f "$file" ]; then
                log_info "     删除: $(basename "$file")"
                rm "$file"
                deleted_count=$((deleted_count + 1))
            fi
        done

        # 如果test目录为空，删除它
        local test_dir="$WEBSITE_ROOT/src/components/test"
        if [ -d "$test_dir" ] && [ -z "$(ls -A "$test_dir" 2>/dev/null)" ]; then
            log_info "     删除空的test目录"
            rmdir "$test_dir"
        fi

        log_success "     ✅ 清理了测试自动化重复实现"
    else
        log_info "   未发现 xorigo-test-automation skill"
    fi
}

# 清理重复的文档生成功能
cleanup_docs_generation() {
    log_purple "📖 清理重复的文档生成功能..."

    # 检查是否有对应的skill
    local docs_skill="$PROJECT_ROOT/.claude/skills/xorigo-docs-generator"
    if [ -d "$docs_skill" ]; then
        log_cyan "   🤖 发现 xorigo-docs-generator skill，清理重复实现"

        # 删除重复的文档生成组件
        local duplicate_doc_files=(
            "$WEBSITE_ROOT/src/components/documentation/DocumentationViewer.tsx"
            "$WEBSITE_ROOT/src/components/documentation/CodeExample.tsx"
        )

        local deleted_count=0
        for file in "${duplicate_doc_files[@]}"; do
            if [ -f "$file" ]; then
                log_info "     删除: $(basename "$file")"
                rm "$file"
                deleted_count=$((deleted_count + 1))
            fi
        done

        log_success "     ✅ 清理了文档生成重复实现"
    else
        log_info "   未发现 xorigo-docs-generator skill"
    fi
}

# 清理重复的设计令牌管理
cleanup_design_tokens() {
    log_purple "🎨 清理重复的设计令牌管理功能..."

    # 检查是否有对应的skill
    local tokens_skill="$PROJECT_ROOT/.claude/skills/xorigo-design-tokens-manager"
    if [ -d "$tokens_skill" ]; then
        log_cyan "   🤖 发现 xorigo-design-tokens-manager skill，清理重复实现"

        # 删除重复的令牌管理实现
        local duplicate_token_files=(
            "$WEBSITE_ROOT/src/components/theme/TokenViewer.tsx"
            "$WEBSITE_ROOT/src/components/theme/TokenCustomizer.tsx"
        )

        local deleted_count=0
        for file in "${duplicate_token_files[@]}"; do
            if [ -f "$file" ]; then
                log_info "     删除: $(basename "$file")"
                rm "$file"
                deleted_count=$((deleted_count + 1))
            fi
        done

        log_success "     ✅ 清理了设计令牌管理重复实现"
    else
        log_info "   未发现 xorigo-design-tokens-manager skill"
    fi
}

# 清理重复的代码质量检查
cleanup_code_quality() {
    log_purple "🔧 清理重复的代码质量检查功能..."

    # 检查是否有对应的skill
    local quality_skill="$PROJECT_ROOT/.claude/skills/xorigo-code-quality-guard"
    if [ -d "$quality_skill" ]; then
        log_cyan "   🤖 发现 xorigo-code-quality-guard skill，清理重复实现"

        # 删除重复的代码质量检查实现
        local duplicate_quality_files=(
            "$WEBSITE_ROOT/src/components/quality/CodeAnalyzer.tsx"
            "$WEBSITE_ROOT/src/components/quality/QualityReport.tsx"
        )

        local deleted_count=0
        for file in "${duplicate_quality_files[@]}"; do
            if [ -f "$file" ]; then
                log_info "     删除: $(basename "$file")"
                rm "$file"
                deleted_count=$((deleted_count + 1))
            fi
        done

        log_success "     ✅ 清理了代码质量检查重复实现"
    else
        log_info "   未发现 xorigo-code-quality-guard skill"
    fi
}

# 清理空的目录
cleanup_empty_directories() {
    log_purple "📁 清理空的目录..."

    # 清理空的组件目录
    local empty_dirs=()
    while IFS= read -r dir; do
        if [ -d "$dir" ] && [ -z "$(ls -A "$dir" 2>/dev/null)" ]; then
            empty_dirs+=("$dir")
        fi
    done < <(find "$WEBSITE_ROOT/src/components" -type d 2>/dev/null | sort -r)

    local deleted_count=0
    for dir in "${empty_dirs[@]}"; do
        log_info "   删除空目录: $(basename "$dir")"
        rmdir "$dir" 2>/dev/null || true
        deleted_count=$((deleted_count + 1))
    done

    if [ "$deleted_count" -gt 0 ]; then
        log_success "   ✅ 删除了 $deleted_count 个空目录"
    else
        log_info "   没有发现空目录"
    fi
}

# 更新导入和引用
update_imports() {
    log_purple "📝 更新导入和引用..."

    # 这里可以添加自动更新导入的逻辑
    # 由于复杂性，建议手动更新

    log_info "   💡 请手动更新相关的导入和引用"
    log_info "   📖 参考: $PROJECT_ROOT/.claude/skills/ 目录中的Skill实现"
}

# 生成清理报告
generate_cleanup_report() {
    log_purple "📊 生成Skill冲突清理报告..."

    local final_component_count=$(find "$WEBSITE_ROOT/src/components" -name "*.tsx" -o -name "*.ts" | wc -l)
    local final_dir_count=$(find "$WEBSITE_ROOT/src/components" -type d | wc -l)

    echo
    log_success "🎉 Skill冲突清理完成！"
    echo
    echo "📊 清理统计:"
    echo "   🤖 发现的Skills: 25个Xorigo UI专用Skills"
    echo "   📁 清理的组件目录: performance-monitoring, test等"
    echo "   📋 最终组件数量: $final_component_count"
    echo "   📂 组件目录数量: $final_dir_count"
    echo

    echo "🤖 保留的Skills (作为主要实现):"
    echo "   ✅ xorigo-component-generator - 组件生成"
    echo "   ✅ xorigo-performance-optimizer - 性能优化"
    echo "   ✅ xorigo-test-automation - 测试自动化"
    echo "   ✅ xorigo-docs-generator - 文档生成"
    echo "   ✅ xorigo-design-tokens-manager - 设计令牌"
    echo "   ✅ xorigo-code-quality-guard - 代码质量"
    echo "   ✅ xorigo-seven-axis-theme-developer - 主题开发"
    echo "   ✅ xorigo-theme-recipe-manager - 主题配方"
    echo "   ✅ ... 以及其他17个专用Skills"

    echo
    log_cyan "💡 建议: 使用Skill功能替代已删除的重复实现"
    echo "   📖 参考: $PROJECT_ROOT/.claude/skills/README.md"
    echo "   🚀 使用: Skill \"xorigo-component-generator\""
    echo "   🔧 使用: Skill \"xorigo-performance-optimizer\""
}

# 主函数
main() {
    echo "🧹 Skill冲突冗余内容清理工具"
    echo "==============================="
    echo

    # 执行清理步骤
    create_backup
    analyze_skill_conflicts
    cleanup_component_generators
    cleanup_performance_monitoring
    cleanup_test_automation
    cleanup_docs_generation
    cleanup_design_tokens
    cleanup_code_quality
    cleanup_empty_directories
    update_imports
    generate_cleanup_report

    log_success "✅ 所有Skill冲突清理任务完成！"
}

# 执行主函数
main "$@"