#!/bin/bash

# Xorigo UI 重命名脚本
# 将 Xorigo UI 重命名为 Xorigo UI (原点 UI)

set -e

echo "🚀 开始重命名 Xorigo UI 为 Xorigo UI..."

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}📁 项目根目录: $PROJECT_ROOT${NC}"

# 创建备份目录
BACKUP_DIR="$PROJECT_ROOT/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo -e "${YELLOW}📦 创建备份目录: $BACKUP_DIR${NC}"

# 备份关键文件
echo -e "${YELLOW}💾 备份关键配置文件...${NC}"
cp package.json "$BACKUP_DIR/" 2>/dev/null || true
cp -r packages/*/package.json "$BACKUP_DIR/packages/" 2>/dev/null || true
cp -r apps/*/package.json "$BACKUP_DIR/apps/" 2>/dev/null || true
cp CLAUDE.md "$BACKUP_DIR/" 2>/dev/null || true

# 函数：安全替换文件内容
safe_replace() {
    local file="$1"
    local from="$2"
    local to="$3"

    if [[ -f "$file" ]]; then
        # 检查文件是否包含要替换的内容
        if grep -q "$from" "$file"; then
            echo -e "${GREEN}✓ 替换文件: $file${NC}"
            # 使用 sed 进行替换，支持跨平台
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|$from|$to|g" "$file"
            else
                # Linux
                sed -i "s|$from|$to|g" "$file"
            fi
        fi
    fi
}

# 函数：重命名文件或目录
rename_item() {
    local from="$1"
    local to="$2"

    if [[ -e "$from" ]]; then
        if [[ ! -e "$to" ]]; then
            echo -e "${GREEN}✓ 重命名: $from → $to${NC}"
            mv "$from" "$to"
        else
            echo -e "${RED}⚠️  目标已存在，跳过: $to${NC}"
        fi
    fi
}

echo -e "${BLUE}🔄 开始替换品牌名称...${NC}"

# 1. 替换 package.json 文件中的品牌信息
echo -e "${BLUE}📦 更新 package.json 文件...${NC}"

# 根目录 package.json
safe_replace "package.json" "Xorigo UI" "Xorigo UI"
safe_replace "package.json" "xorigo-ui" "xorigo-ui"
safe_replace "package.json" "@xorigo-ui" "@xorigo-ui"
safe_replace "package.json" "Xorigo UI Team" "Xorigo UI Team"
safe_replace "package.json" "xorigo-ui.dev" "xorigo-ui.dev"
safe_replace "package.json" "github.com/xorigo-ui" "github.com/xorigo-ui"

# packages 目录下的所有 package.json
for pkg in packages/*/package.json; do
    if [[ -f "$pkg" ]]; then
        safe_replace "$pkg" "Xorigo UI" "Xorigo UI"
        safe_replace "$pkg" "xorigo-ui" "xorigo-ui"
        safe_replace "$pkg" "@xorigo-ui" "@xorigo-ui"
        safe_replace "$pkg" "Xorigo UI Team" "Xorigo UI Team"
        safe_replace "$pkg" "github.com/xorigo-ui" "github.com/xorigo-ui"
    fi
done

# apps 目录下的所有 package.json
for app in apps/*/package.json; do
    if [[ -f "$app" ]]; then
        safe_replace "$app" "Xorigo UI" "Xorigo UI"
        safe_replace "$app" "xorigo-ui" "xorigo-ui"
        safe_replace "$app" "@xorigo-ui" "@xorigo-ui"
        safe_replace "$app" "Xorigo UI Team" "Xorigo UI Team"
        safe_replace "$app" "github.com/xorigo-ui" "github.com/xorigo-ui"
    fi
done

echo -e "${BLUE}📄 更新文档文件...${NC}"

# 2. 更新文档文件
safe_replace "CLAUDE.md" "Xorigo UI" "Xorigo UI"
safe_replace "CLAUDE.md" "xorigo-ui" "xorigo-ui"
safe_replace "CLAUDE.md" "@xorigo-ui" "@xorigo-ui"
safe_replace "CLAUDE.md" "Xorigo UI Team" "Xorigo UI Team"
safe_replace "CLAUDE.md" "Xorigo UI × Claude Code 开发指南" "Xorigo UI × Claude Code 开发指南"

# README 文件
safe_replace "README.md" "Xorigo UI" "Xorigo UI"
safe_replace "README.md" "xorigo-ui" "xorigo-ui"
safe_replace "README.md" "@xorigo-ui" "@xorigo-ui"

echo -e "${BLUE}🔧 更新源码文件...${NC}"

# 3. 更新源码文件中的引用
safe_replace "packages/i18n/src/core/I18nManager.ts" "xorigo-ui-locale" "xorigo-ui-locale"
safe_replace "packages/i18n/src/core/I18nManager.ts" "xorigo-ui-locale-change" "xorigo-ui-locale-change"

# 更新 CLAUDE.md 中的 Trans-Hub 引用
safe_replace "CLAUDE.md" "Trans-Hub" "Xorigo UI 原点设计系统"
safe_replace "CLAUDE.md" "Xorigo UI 是从 Trans-Hub 提取的" "Xorigo UI 是基于原点设计系统构建的"

# i18n 包相关文件
safe_replace "packages/i18n/src/index.ts" "Xorigo UI" "Xorigo UI"
safe_replace "packages/i18n/examples/basic-usage.ts" "xorigo-ui" "xorigo-ui"
safe_replace "packages/i18n/examples/basic-usage.ts" "@xorigo-ui" "@xorigo-ui"

# i18n README
safe_replace "packages/i18n/README.md" "Xorigo UI" "Xorigo UI"
safe_replace "packages/i18n/README.md" "xorigo-ui" "xorigo-ui"
safe_replace "packages/i18n/README.md" "@xorigo-ui" "@xorigo-ui"
safe_replace "packages/i18n/README.md" "github.com/xorigo-ui" "github.com/xorigo-ui"

# style-recipe 包相关文件（新增）
safe_replace "packages/style-recipe/src/provider/DTCGStyleRecipeProvider.tsx" "packages/thui-tokens" "packages/xorigo-ui-tokens"
safe_replace "packages/style-recipe/src/engine/dtcg-engine.ts" "packages/thui-tokens" "packages/xorigo-ui-tokens"

# 更新 dist 目录中的构建产物（如果存在）
safe_replace "packages/style-recipe/dist/provider/DTCGStyleRecipeProvider.js" "packages/thui-tokens" "packages/xorigo-ui-tokens"
safe_replace "packages/style-recipe/dist/provider/DTCGStyleRecipeProvider.d.ts" "packages/thui-tokens" "packages/xorigo-ui-tokens"

# 更新 archive 目录中的文件
safe_replace "archive/legacy-demo-site/demo-site/components/legacy-recipes/DTCGStyleRecipeDemo.tsx" "packages/thui-tokens" "packages/xorigo-ui-tokens"

# 更新 apps/website 中的文件
safe_replace "apps/website/IMPLEMENTATION_REPORT.md" "searchTHUI" "searchXorigoUI"
safe_replace "apps/website/SEARCH_API.md" "searchTHUI" "searchXorigoUI"

# 更新 packages/core README.md 中的 Trans-Hub 引用
safe_replace "packages/core/README.md" "Trans-Hub" "Xorigo UI 原点设计系统"
safe_replace "packages/core/README.md" "trans-hub.com" "xorigo-ui.dev"
safe_replace "packages/core/README.md" "Xorigo UI 基于 Trans-Hub" "Xorigo UI 基于"

echo -e "${BLUE}🌐 更新国际化文件...${NC}"

# 4. 更新国际化文件
for locale_file in packages/i18n/src/locales/zh-CN/*.json; do
    if [[ -f "$locale_file" ]]; then
        safe_replace "$locale_file" "Xorigo UI" "Xorigo UI"
        safe_replace "$locale_file" "Xorigo UI 试验场" "Xorigo UI 试验场"
        safe_replace "$locale_file" "Xorigo UI 展示馆" "Xorigo UI 展示馆"
        safe_replace "$locale_file" "Xorigo UI 到你的项目中" "Xorigo UI 到你的项目中"
    fi
done

echo -e "${BLUE}🔧 更新配置文件...${NC}"

# 5. 更新其他配置文件
safe_replace "eslint.config.js" "Xorigo UI" "Xorigo UI"
safe_replace "postcss.config.js" "xorigo-ui" "xorigo-ui"

echo -e "${BLUE}📁 重命名配置文件...${NC}"

# 6. 重命名配置文件
rename_item "xorigo-ui.config.json" "xorigo-ui.config.json"

echo -e "${BLUE}📝 更新构建脚本...${NC}"

# 7. 更新构建脚本（如果存在）
for script in scripts/*.sh; do
    if [[ -f "$script" ]]; then
        safe_replace "$script" "Xorigo UI" "Xorigo UI"
        safe_replace "$script" "xorigo-ui" "xorigo-ui"
    fi
done

echo -e "${BLUE}📚 更新其他文档...${NC}"

# 8. 更新其他可能的文档文件
find . -name "*.md" -not -path "./node_modules/*" -not -path "./backup-*/*" -exec bash -c '
    file="$1"
    if grep -q "Xorigo UI\|xorigo-ui" "$file"; then
        echo -e "'${GREEN}'✓ 更新文档: $file'${NC}'"
        sed -i "s/Xorigo UI/Xorigo UI/g; s/xorigo-ui/xorigo-ui/g; s/@xorigo-ui/@xorigo-ui/g; s/Trans-Hub/Xorigo UI 原点设计系统/g; s/trans-hub\.com/xorigo-ui.dev/g" "$file"
    fi
' bash {} \;

# 9. 更新验证脚本中的搜索模式
safe_replace "scripts/verify-rename.js" "Xorigo UI" "Xorigo UI"
safe_replace "scripts/verify-rename.js" "xorigo-ui" "xorigo-ui"
safe_replace "scripts/verify-rename.js" "@xorigo-ui" "@xorigo-ui"
safe_replace "scripts/verify-rename.js" "github.com/xorigo-ui" "github.com/xorigo-ui"

echo -e "${BLUE}🧹 清理缓存和重新安装依赖...${NC}"

# 10. 清理和重新安装
echo -e "${YELLOW}🗑️  清理 node_modules 和构建产物...${NC}"
rm -rf node_modules packages/*/node_modules apps/*/node_modules
rm -rf packages/*/dist apps/*/.next apps/*/out

echo -e "${YELLOW}📦 重新安装依赖...${NC}"
npm install

echo -e "${GREEN}✅ 重命名完成！${NC}"
echo ""
echo -e "${BLUE}📋 重命名摘要：${NC}"
echo -e "  • 品牌名称: Xorigo UI → Xorigo UI"
echo -e "  • 包名前缀: @xorigo-ui → @xorigo-ui"
echo -e "  • 标识符: xorigo-ui → xorigo-ui"
echo -e "  • 团队名称: Xorigo UI Team → Xorigo UI Team"
echo -e "  • 配置文件: xorigo-ui.config.json → xorigo-ui.config.json"
echo ""
echo -e "${YELLOW}💾 备份文件保存在: $BACKUP_DIR${NC}"
echo ""
echo -e "${BLUE}🔍 建议验证步骤：${NC}"
echo -e "  1. 检查 package.json 文件中的品牌信息"
echo -e "  2. 运行 npm run build 确保构建正常"
echo -e "  3. 运行 npm run dev 确保开发环境正常"
echo -e "  4. 检查文档中的品牌名称是否正确更新"
echo ""
echo -e "${GREEN}🎉 Xorigo UI (原点 UI) 重命名完成！${NC}"