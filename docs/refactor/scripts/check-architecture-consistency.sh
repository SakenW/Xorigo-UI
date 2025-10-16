#!/usr/bin/env bash
set -euo pipefail

# Xorigo-UI 架构一致性检查脚本
# 确保遵循"Website 只消费不创造"的核心架构原则

# 颜色输出定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_header() {
    echo -e "${BLUE}🧭 Xorigo-UI 架构一致性检查${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}🔍 $1${NC}"
}

print_rule() {
    echo -e "${PURPLE}📋 $1${NC}"
}

# 检查结果统计
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# 执行检查并记录结果
run_check() {
    local check_name="$1"
    local check_command="$2"
    local error_message="$3"
    local is_blocking="${4:-true}"

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    print_info "检查：$check_name..."

    if eval "$check_command" >/dev/null 2>&1; then
        print_success "通过：$check_name"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        if [ "$is_blocking" = "true" ]; then
            print_error "$error_message"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            return 1
        else
            print_warning "$error_message"
            WARNING_CHECKS=$((WARNING_CHECKS + 1))
            return 2
        fi
    fi
}

# 检查 1: Website 不得定义 UI 组件
check_website_ui_components() {
    print_rule "架构规则：Website 不得定义 UI 组件（只消费不创造）"

    # 定义UI组件关键词
    local ui_components=(
        "Button"
        "Card"
        "Input"
        "Dialog"
        "Tabs"
        "Menu"
        "Tooltip"
        "Alert"
        "Avatar"
        "Badge"
        "Dropdown"
        "Modal"
        "Navigation"
        "Header"
        "Sidebar"
        "Footer"
        "Table"
        "Form"
        "Checkbox"
        "Radio"
        "Switch"
        "Slider"
        "Progress"
        "Spinner"
        "Loading"
        "Pagination"
        "Breadcrumb"
        "Accordion"
        "Tabs"
        "Toast"
        "Popover"
        "Overlay"
    )

    # 构建搜索模式
    local pattern=""
    for component in "${ui_components[@]}"; do
        if [ -n "$pattern" ]; then
            pattern="$pattern|${component}"
        else
            pattern="${component}"
        fi
    done

    # 搜索违规的UI组件定义
    local violations
    violations=$(grep -RIE --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=dist \
        --exclude-dir=.git \
        "export (default )?function (${pattern})" \
        apps/website/ 2>/dev/null || true)

    if [ -n "$violations" ]; then
        print_error "发现违规的UI组件定义："
        echo "$violations" | while read -r line; do
            echo -e "${RED}    $line${NC}"
        done
        echo
        echo -e "${RED}请将 UI 组件移至 packages/core，并确保 Website 仅消费 @xorigo-ui/* 包${NC}"
        echo -e "${RED}参考文档：《CRITICAL-ARCHITECTURE-RULE.md》- Website 只消费不创造${NC}"
        return 1
    fi

    # 进一步检查是否有类似的组件定义模式
    local component_patterns
    component_patterns=$(grep -RIE --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=dist \
        --exclude-dir=.git \
        "const (Button|Card|Input|Dialog|Tabs|Menu|Tooltip|Alert|Avatar|Badge)" \
        apps/website/ 2>/dev/null || true)

    if [ -n "$component_patterns" ]; then
        print_warning "发现疑似UI组件定义（请确认是否为业务组件）："
        echo "$component_patterns" | while read -r line; do
            echo -e "${YELLOW}    $line${NC}"
        done
        echo
        return 2
    fi

    print_success "通过：Website 未定义UI组件"
    return 0
}

# 检查 2: Website 的 UI import 只能来自 @xorigo-ui/*
check_website_ui_imports() {
    print_rule "架构规则：Website 的 UI 引用只能来自 @xorigo-ui/* 包"

    # 检查相对路径导入组件
    local relative_imports
    relative_imports=$(grep -RIn --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=dist \
        --exclude-dir=.git \
        "from ['\"]\..*/components" \
        apps/website/ 2>/dev/null || true)

    if [ -n "$relative_imports" ]; then
        print_error "发现违规的相对路径UI组件导入："
        echo "$relative_imports" | while read -r line; do
            echo -e "${RED}    $line${NC}"
        done
        echo
        echo -e "${RED}请确保所有 UI 组件都从 @xorigo-ui/* 包导入${NC}"
        return 1
    fi

    # 检查绝对路径导入组件
    local absolute_imports
    absolute_imports=$(grep -RIn --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=dist \
        --exclude-dir=.git \
        "from ['\"]@/.*/components" \
        apps/website/ 2>/dev/null || true)

    if [ -n "$absolute_imports" ]; then
        print_error "发现违规的绝对路径UI组件导入："
        echo "$absolute_imports" | while read -r line; do
            echo -e "${RED}    $line${NC}"
        done
        echo
        echo -e "${RED}请确保所有 UI 组件都从 @xorigo-ui/* 包导入${NC}"
        return 1
    fi

    # 检查是否正确使用了 @xorigo-ui 包
    local xorigo_imports
    xorigo_imports=$(grep -RIn --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=dist \
        --exclude-dir=.git \
        "from ['\"]@xorigo-ui/" \
        apps/website/ 2>/dev/null || true)

    if [ -z "$xorigo_imports" ]; then
        print_warning "未发现从 @xorigo-ui/* 包的导入，请确认是否正确使用了组件库"
        return 2
    fi

    print_success "通过：Website UI 引用来源正确"
    return 0
}

# 检查 3: packages 禁止反向依赖 website
check_packages_reverse_dependency() {
    print_rule "架构规则：packages 禁止反向依赖 apps/website"

    local reverse_deps
    reverse_deps=$(grep -RIn --include=\*.{ts,tsx,js,jsx,json} \
        --exclude-dir=node_modules \
        --exclude-dir=dist \
        --exclude-dir=.git \
        "@xorigo-ui/website\|website\|apps/website" \
        packages/ 2>/dev/null || true)

    if [ -n "$reverse_deps" ]; then
        print_error "发现 packages 反向依赖 website："
        echo "$reverse_deps" | while read -r line; do
            echo -e "${RED}    $line${NC}"
        done
        echo
        echo -e "${RED}packages 不能依赖 website，保持单向依赖关系${NC}"
        return 1
    fi

    print_success "通过：packages 无反向依赖"
    return 0
}

# 检查 4: 禁止硬编码颜色值
check_hardcoded_colors() {
    print_rule "代码质量：禁止硬编码颜色值，应使用 CSS 变量"

    # 搜索硬编码的十六进制颜色
    local hex_colors
    hex_colors=$(grep -RIn --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=dist \
        --exclude-dir=.git \
        --exclude-dir=test \
        --exclude-dir=tests \
        "#[0-9a-fA-F]\{3,6\}" \
        packages/core/src/ 2>/dev/null || true)

    # 搜索硬编码的 rgb/rgba 颜色
    local rgb_colors
    rgb_colors=$(grep -RIn --include=\*.{ts,tsx,js,jsx} \
        --exclude-dir=node_modules \
        --exclude-dir=dist \
        --exclude-dir=.git \
        --exclude-dir=test \
        --exclude-dir=tests \
        "rgb\(" \
        packages/core/src/ 2>/dev/null || true)

    # 过滤掉注释和字符串
    local hardcoded_colors=""
    if [ -n "$hex_colors" ]; then
        hardcoded_colors=$(echo "$hex_colors" | grep -v "// " | grep -v "/\*" | grep -v "\* ")
    fi
    if [ -n "$rgb_colors" ]; then
        if [ -n "$hardcoded_colors" ]; then
            hardcoded_colors="$hardcoded_colors"$'\n'"$(echo "$rgb_colors" | grep -v "// " | grep -v "/\*" | grep -v "\* ")"
        else
            hardcoded_colors=$(echo "$rgb_colors" | grep -v "// " | grep -v "/\*" | grep -v "\* ")
        fi
    fi

    if [ -n "$hardcoded_colors" ]; then
        print_warning "发现疑似硬编码颜色值（建议使用 CSS 变量）："
        echo "$hardcoded_colors" | head -5 | while read -r line; do
            echo -e "${YELLOW}    $line${NC}"
        done
        if [ $(echo "$hardcoded_colors" | wc -l) -gt 5 ]; then
            echo -e "${YELLOW}    ... 还有 $(($(echo "$hardcoded_colors" | wc -l) - 5)) 行${NC}"
        fi
        echo
        echo -e "${YELLOW}建议使用 var(--color-*) 替代硬编码颜色${NC}"
        return 2
    fi

    print_success "通过：未发现硬编码颜色值"
    return 0
}

# 检查 5: 检查 package.json sideEffects 配置
check_side_effects_config() {
    print_rule "构建配置：检查 sideEffects 配置以支持 tree-shaking"

    local core_package="packages/core/package.json"

    if [ ! -f "$core_package" ]; then
        print_error "未找到 packages/core/package.json"
        return 1
    fi

    if ! grep -q '"sideEffects"' "$core_package"; then
        print_warning "core 包缺少 sideEffects 配置"
        echo -e "${YELLOW}建议添加 \"sideEffects\": [\"./dist/**/*.css\"] 以支持 tree-shaking${NC}"
        return 2
    fi

    # 检查 sideEffects 配置是否合理
    local side_effects
    side_effects=$(grep -A 5 '"sideEffects"' "$core_package" | grep -v "sideEffects" | tr -d ' \t\n\r,')

    if [ "$side_effects" = "false" ]; then
        print_warning "sideEffects 设置为 false，可能影响 CSS 文件的导入"
        echo -e "${YELLOW}建议改为 \"sideEffects\": [\"./dist/**/*.css\"]${NC}"
        return 2
    fi

    print_success "通过：sideEffects 配置正确"
    return 0
}

# 检查 6: 检查导出配置
check_exports_config() {
    print_rule "构建配置：检查 package.json exports 配置"

    local core_package="packages/core/package.json"

    if [ ! -f "$core_package" ]; then
        print_error "未找到 packages/core/package.json"
        return 1
    fi

    if ! grep -q '"exports"' "$core_package"; then
        print_error "core 包缺少 exports 配置"
        echo -e "${RED}建议配置 exports 字段以支持精确导入${NC}"
        return 1
    fi

    # 检查是否有主入口导出
    if ! grep -q '"\.":' "$core_package"; then
        print_error "exports 配置缺少主入口"
        return 1
    fi

    print_success "通过：exports 配置存在"
    return 0
}

# 检查 7: 检查 TypeScript 配置
check_typescript_config() {
    print_rule "开发配置：检查 TypeScript 配置"

    local core_tsconfig="packages/core/tsconfig.json"

    if [ ! -f "$core_tsconfig" ]; then
        print_warning "未找到 packages/core/tsconfig.json"
        return 2
    fi

    # 检查是否有正确的编译配置
    if ! grep -q '"declaration"' "$core_tsconfig"; then
        print_warning "TypeScript 配置缺少 declaration 选项"
        return 2
    fi

    print_success "通过：TypeScript 配置正常"
    return 0
}

# 检查 8: 检查构建产物
check_build_artifacts() {
    print_rule "构建验证：检查构建产物是否存在"

    local core_dist="packages/core/dist"

    if [ ! -d "$core_dist" ]; then
        print_warning "未找到构建产物目录 packages/core/dist"
        echo -e "${YELLOW}请先运行 npm run build${NC}"
        return 2
    fi

    # 检查主要构建文件
    local required_files=("index.mjs" "index.cjs.js" "index.d.ts")

    for file in "${required_files[@]}"; do
        if [ ! -f "$core_dist/$file" ]; then
            print_warning "缺少构建文件：$file"
            return 2
        fi
    done

    print_success "通过：构建产物完整"
    return 0
}

# 检查 9: 检查工作区依赖一致性
check_workspace_dependencies() {
    print_rule "依赖管理：检查工作区依赖一致性"

    local root_package="package.json"

    if [ ! -f "$root_package" ]; then
        print_error "未找到根目录 package.json"
        return 1
    fi

    # 检查是否有 workspaces 配置
    if ! grep -q '"workspaces"' "$root_package"; then
        print_error "根目录缺少 workspaces 配置"
        return 1
    fi

    print_success "通过：工作区配置正常"
    return 0
}

# 主检查流程
main() {
    print_header
    echo

    # 执行所有检查
    local checks=(
        "check_website_ui_components"
        "check_website_ui_imports"
        "check_packages_reverse_dependency"
        "check_hardcoded_colors"
        "check_side_effects_config"
        "check_exports_config"
        "check_typescript_config"
        "check_build_artifacts"
        "check_workspace_dependencies"
    )

    local blocking_failures=0

    for check in "${checks[@]}"; do
        echo
        if $check; then
            # 成功或警告
            :
        else
            # 失败
            blocking_failures=$((blocking_failures + 1))
        fi
    done

    # 打印总结
    echo
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}📊 检查结果统计${NC}"
    echo -e "${BLUE}=====================================${NC}"
    echo -e "总检查数：${CYAN}$TOTAL_CHECKS${NC}"
    echo -e "通过检查：${GREEN}$PASSED_CHECKS${NC}"
    echo -e "警告检查：${YELLOW}$WARNING_CHECKS${NC}"
    echo -e "失败检查：${RED}$FAILED_CHECKS${NC}"
    echo

    if [ $blocking_failures -gt 0 ]; then
        echo -e "${RED}🚨 架构一致性检查失败！${NC}"
        echo -e "${RED}请修复上述问题后重新运行检查${NC}"
        echo
        echo -e "${RED}相关文档：${NC}"
        echo -e "${RED}• 《CRITICAL-ARCHITECTURE-RULE.md》- Website 只消费不创造${NC}"
        echo -e "${RED}• 《00-Website技术架构终极版.md》- 模块边界与职责${NC}"
        echo -e "${RED}• 《00-Xorigo-UI核心架构文档终极版.md》- 组件分层与原则${NC}"
        exit 1
    else
        echo -e "${GREEN}🎉 架构一致性检查通过！${NC}"
        echo
        echo -e "${GREEN}✅ Website 严格消费 @xorigo-ui/* 包${NC}"
        echo -e "${GREEN}✅ 无架构违规依赖${NC}"
        echo -e "${GREEN}✅ 符合《关键架构规则》要求${NC}"
        echo
        if [ $WARNING_CHECKS -gt 0 ]; then
            echo -e "${YELLOW}💡 建议：$WARNING_CHECKS 项警告可以进一步优化${NC}"
        fi
        exit 0
    fi
}

# 处理命令行参数
case "${1:-}" in
    --help|-h)
        echo "用法: $0 [--help|-h]"
        echo
        echo "Xorigo-UI 架构一致性检查脚本"
        echo "确保遵循'Website 只消费不创造'的核心架构原则"
        echo
        echo "检查项目："
        echo "  • Website 不得定义 UI 组件"
        echo "  • Website 的 UI 引用只能来自 @xorigo-ui/*"
        echo "  • packages 禁止反向依赖 website"
        echo "  • 禁止硬编码颜色值"
        echo "  • 构建配置检查"
        echo "  • TypeScript 配置检查"
        echo
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}错误：未知参数 '$1'${NC}"
        echo "使用 $0 --help 查看帮助"
        exit 1
        ;;
esac