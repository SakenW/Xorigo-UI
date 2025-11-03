#!/bin/bash

# Xorigo UI 命名规范重命名脚本
# 基于 docs/guidelines/naming-guidelines.md 规范

set -euo pipefail

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="/home/saken/project/Xorigo-UI"
cd "$PROJECT_ROOT"

# 计数器
RENAMED_COUNT=0
SKIPPED_COUNT=0
ERROR_COUNT=0

echo -e "${BLUE}🔧 Xorigo UI 命名规范重命名工具${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# 函数：将 kebab-case 转换为 PascalCase
kebab_to_pascal() {
    local kebab="$1"
    echo "$kebab" | sed -E 's/(-|^)([a-z])/\U\2/g'
}

# 函数：安全重命名文件
safe_rename() {
    local src="$1"
    local dst="$2"
    local dir=$(dirname "$src")

    if [[ ! -f "$src" ]]; then
        echo -e "${RED}❌ 源文件不存在: $src${NC}"
        ((ERROR_COUNT++))
        return 1
    fi

    if [[ -f "$dst" ]]; then
        echo -e "${YELLOW}⚠️  目标文件已存在，跳过: $dst${NC}"
        ((SKIPPED_COUNT++))
        return 0
    fi

    echo -e "${GREEN}✅ 重命名: $(basename "$src") → $(basename "$dst")${NC}"

    if [[ "${DRY_RUN:-}" != "true" ]]; then
        mv "$src" "$dst"

        # 更新导入路径
        update_imports "$src" "$dst"

        ((RENAMED_COUNT++))
    else
        echo -e "${BLUE}🔍 [DRY RUN] 将会重命名: $(basename "$src") → $(basename "$dst")${NC}"
        ((RENAMED_COUNT++))
    fi
}

# 函数：更新导入路径
update_imports() {
    local old_path="$1"
    local new_path="$2"
    local old_name=$(basename "$old_path" | sed 's/\.[^.]*$//')
    local new_name=$(basename "$new_path" | sed 's/\.[^.]*$//')

    # 查找所有可能导入该文件的 TypeScript/JavaScript 文件
    find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
    grep -v node_modules | grep -v dist | grep -v ".git" | \
    while read file; do
        # 检查文件是否包含该导入
        if grep -q "from.*['\"].*${old_name}['\"]" "$file"; then
            echo -e "${BLUE}  📝 更新导入: $file${NC}"

            # 使用 sed 更新导入路径
            if [[ "${DRY_RUN:-}" != "true" ]]; then
                sed -i.bak "s/from ['\"]\([^'\"]*\/\)*${old_name}['\"]/from '\1${new_name}'/g" "$file"
                rm -f "${file}.bak"
            fi
        fi
    done
}

# React 组件文件重命名
echo -e "${YELLOW}🔄 处理 React 组件文件...${NC}"

# 主题系统组件
safe_rename "packages/core/src/theme/seven-axis-theme-provider.tsx" "packages/core/src/theme/SevenAxisThemeProvider.tsx"
safe_rename "packages/core/src/theme/use-theme.tsx" "packages/core/src/theme/UseTheme.tsx"

# 覆盖层组件
safe_rename "packages/core/src/overlays/overlay-trigger.tsx" "packages/core/src/overlays/OverlayTrigger.tsx"
safe_rename "packages/core/src/overlays/hover-card.tsx" "packages/core/src/overlays/HoverCard.tsx"

# 数据展示组件
safe_rename "packages/core/src/data-display/CodeBlock.tsx" "packages/core/src/data-display/CodeBlock.tsx"
safe_rename "packages/core/src/data-display/List.tsx" "packages/core/src/data-display/List.tsx"
safe_rename "packages/core/src/data-display/TableBody.tsx" "packages/core/src/data-display/TableBody.tsx"
safe_rename "packages/core/src/data-display/Carousel.tsx" "packages/core/src/data-display/Carousel.tsx"
safe_rename "packages/core/src/data-display/AccordionContent.tsx" "packages/core/src/data-display/AccordionContent.tsx"
safe_rename "packages/core/src/data-display/Chart.tsx" "packages/core/src/data-display/Chart.tsx"
safe_rename "packages/core/src/data-display/BarChart.tsx" "packages/core/src/data-display/BarChart.tsx"
safe_rename "packages/core/src/data-display/AccordionItem.tsx" "packages/core/src/data-display/AccordionItem.tsx"
safe_rename "packages/core/src/data-display/Accordion.tsx" "packages/core/src/data-display/Accordion.tsx"
safe_rename "packages/core/src/data-display/TableCell.tsx" "packages/core/src/data-display/TableCell.tsx"
safe_rename "packages/core/src/data-display/Table.tsx" "packages/core/src/data-display/Table.tsx"
safe_rename "packages/core/src/data-display/ComponentCard.tsx" "packages/core/src/data-display/ComponentCard.tsx"
safe_rename "packages/core/src/data-display/Stat.tsx" "packages/core/src/data-display/Stat.tsx"
safe_rename "packages/core/src/data-display/LineChart.tsx" "packages/core/src/data-display/LineChart.tsx"
safe_rename "packages/core/src/data-display/PieChart.tsx" "packages/core/src/data-display/PieChart.tsx"
safe_rename "packages/core/src/data-display/CarouselItem.tsx" "packages/core/src/data-display/CarouselItem.tsx"
safe_rename "packages/core/src/data-display/AccordionHeader.tsx" "packages/core/src/data-display/AccordionHeader.tsx"
safe_rename "packages/core/src/data-display/AdvancedCard.tsx" "packages/core/src/data-display/AdvancedCard.tsx"
safe_rename "packages/core/src/data-display/Gauge.tsx" "packages/core/src/data-display/Gauge.tsx"
safe_rename "packages/core/src/data-display/TableHeader.tsx" "packages/core/src/data-display/TableHeader.tsx"
safe_rename "packages/core/src/data-display/TableRow.tsx" "packages/core/src/data-display/TableRow.tsx"
safe_rename "packages/core/src/data-display/CarouselControl.tsx" "packages/core/src/data-display/CarouselControl.tsx"

# 表单组件
safe_rename "packages/core/src/form/button-group.tsx" "packages/core/src/form/ButtonGroup.tsx"
safe_rename "packages/core/src/form/password-input.tsx" "packages/core/src/form/PasswordInput.tsx"
safe_rename "packages/core/src/form/input-group.tsx" "packages/core/src/form/InputGroup.tsx"
safe_rename "packages/core/src/form/input-number.tsx" "packages/core/src/form/InputNumber.tsx"
safe_rename "packages/core/src/form/validation-message.tsx" "packages/core/src/form/ValidationMessage.tsx"
safe_rename "packages/core/src/form/form-field.tsx" "packages/core/src/form/FormField.tsx"
safe_rename "packages/core/src/form/search-input.tsx" "packages/core/src/form/SearchInput.tsx"

# 其他组件
safe_rename "packages/core/src/marketing-components.tsx" "packages/core/src/MarketingComponents.tsx"
safe_rename "packages/core/src/utils/gradient-tokens.tsx" "packages/core/src/utils/GradientTokens.tsx"
safe_rename "packages/core/src/feedback/theme-toggle.tsx" "packages/core/src/feedback/ThemeToggle.tsx"
safe_rename "packages/core/src/feedback/advanced-theme-switcher.tsx" "packages/core/src/feedback/AdvancedThemeSwitcher.tsx"

echo ""
echo -e "${YELLOW}📊 处理文档文件...${NC}"

# 文档文件重命名（使用新的四线分类格式）
safe_rename "docs/reports/qa-phase3-strategy.md" "docs/reports/qa-01-phase3策略-执行计划.md"
safe_rename "docs/reports/sys-q1-质量改进迭代流程.md" "docs/reports/sys-01-质量改进-迭代流程.md"
safe_rename "docs/reports/qa-strategy-execution-summary.md" "docs/reports/qa-02-策略执行-总结报告.md"

# 输出统计结果
echo ""
echo -e "${BLUE}📈 重命名统计:${NC}"
echo -e "${GREEN}✅ 成功重命名: $RENAMED_COUNT 个文件${NC}"
echo -e "${YELLOW}⚠️  跳过: $SKIPPED_COUNT 个文件${NC}"
echo -e "${RED}❌ 错误: $ERROR_COUNT 个文件${NC}"

if [[ "${DRY_RUN:-}" == "true" ]]; then
    echo ""
    echo -e "${BLUE}🔍 这是 DRY RUN 模式，没有实际执行重命名操作${NC}"
    echo -e "${BLUE}💡 使用 'bash $0 --apply' 来实际执行重命名${NC}"
else
    echo ""
    echo -e "${GREEN}🎉 重命名操作完成！${NC}"
    echo -e "${YELLOW}💡 请运行 'npm run lint' 和 'npm run type-check' 来验证结果${NC}"
fi

# 退出码
if [[ $ERROR_COUNT -gt 0 ]]; then
    exit 1
else
    exit 0
fi