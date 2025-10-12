#!/bin/bash

# Xorigo UI 重命名回滚脚本
# 如果重命名出现问题，可以使用此脚本回滚到 TH-UI

set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}🔄 开始回滚 Xorigo UI 到 TH-UI...${NC}"

# 查找最新的备份目录
LATEST_BACKUP=$(ls -t "$PROJECT_ROOT" | grep "^backup-" | head -1)

if [[ -z "$LATEST_BACKUP" ]]; then
    echo -e "${RED}❌ 没有找到备份目录，无法回滚${NC}"
    exit 1
fi

BACKUP_DIR="$PROJECT_ROOT/$LATEST_BACKUP"
echo -e "${YELLOW}📦 使用备份目录: $BACKUP_DIR${NC}"

# 确认操作
echo -e "${YELLOW}⚠️  此操作将把所有更改回滚到 TH-UI${NC}"
read -p "确定要继续吗？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}❌ 操作已取消${NC}"
    exit 0
fi

# 函数：安全替换文件内容（回滚）
safe_replace_rollback() {
    local file="$1"
    local from="$2"
    local to="$3"

    if [[ -f "$file" ]]; then
        if grep -q "$from" "$file"; then
            echo -e "${GREEN}✓ 回滚文件: $file${NC}"
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|$from|$to|g" "$file"
            else
                sed -i "s|$from|$to|g" "$file"
            fi
        fi
    fi
}

# 函数：重命名文件或目录（回滚）
rename_item_rollback() {
    local from="$1"
    local to="$2"

    if [[ -e "$from" ]]; then
        if [[ ! -e "$to" ]]; then
            echo -e "${GREEN}✓ 回滚重命名: $from → $to${NC}"
            mv "$from" "$to"
        else
            echo -e "${RED}⚠️  目标已存在，跳过: $to${NC}"
        fi
    fi
}

echo -e "${BLUE}🔄 开始回滚品牌名称...${NC}"

# 1. 回滚 package.json 文件
echo -e "${BLUE}📦 回滚 package.json 文件...${NC}"

# 恢复根目录 package.json
if [[ -f "$BACKUP_DIR/package.json" ]]; then
    cp "$BACKUP_DIR/package.json" "$PROJECT_ROOT/package.json"
    echo -e "${GREEN}✓ 恢复根 package.json${NC}"
fi

# 恢复 packages 目录下的 package.json
if [[ -d "$BACKUP_DIR/packages" ]]; then
    cp -r "$BACKUP_DIR/packages/"* "$PROJECT_ROOT/packages/"
    echo -e "${GREEN}✓ 恢复 packages package.json 文件${NC}"
fi

# 恢复 apps 目录下的 package.json
if [[ -d "$BACKUP_DIR/apps" ]]; then
    cp -r "$BACKUP_DIR/apps/"* "$PROJECT_ROOT/apps/"
    echo -e "${GREEN}✓ 恢复 apps package.json 文件${NC}"
fi

# 恢复 CLAUDE.md
if [[ -f "$BACKUP_DIR/CLAUDE.md" ]]; then
    cp "$BACKUP_DIR/CLAUDE.md" "$PROJECT_ROOT/CLAUDE.md"
    echo -e "${GREEN}✓ 恢复 CLAUDE.md${NC}"
fi

echo -e "${BLUE}🔄 手动回滚其他文件...${NC}")

# 2. 手动回滚其他文件
safe_replace_rollback "README.md" "Xorigo UI" "TH-UI"
safe_replace_rollback "README.md" "xorigo-ui" "th-ui"
safe_replace_rollback "README.md" "@xorigo-ui" "@th-ui"

safe_replace_rollback "packages/i18n/src/core/I18nManager.ts" "xorigo-ui-locale" "th-ui-locale"
safe_replace_rollback "packages/i18n/src/core/I18nManager.ts" "xorigo-ui-locale-change" "th-ui-locale-change"

safe_replace_rollback "packages/i18n/src/index.ts" "Xorigo UI" "TH-UI"
safe_replace_rollback "packages/i18n/examples/basic-usage.ts" "xorigo-ui" "th-ui"
safe_replace_rollback "packages/i18n/examples/basic-usage.ts" "@xorigo-ui" "@th-ui"

safe_replace_rollback "packages/i18n/README.md" "Xorigo UI" "TH-UI"
safe_replace_rollback "packages/i18n/README.md" "xorigo-ui" "th-ui"
safe_replace_rollback "packages/i18n/README.md" "@xorigo-ui" "@th-ui"

# 回滚国际化文件
for locale_file in packages/i18n/src/locales/zh-CN/*.json; do
    if [[ -f "$locale_file" ]]; then
        safe_replace_rollback "$locale_file" "Xorigo UI" "TH-UI"
        safe_replace_rollback "$locale_file" "Xorigo UI 试验场" "TH-UI 试验场"
        safe_replace_rollback "$locale_file" "Xorigo UI 展示馆" "TH-UI 展示馆"
        safe_replace_rollback "$locale_file" "Xorigo UI 到你的项目中" "TH-UI 到你的项目中"
    fi
done

# 回滚其他配置文件
safe_replace_rollback "eslint.config.js" "Xorigo UI" "TH-UI"
safe_replace_rollback "postcss.config.js" "xorigo-ui" "th-ui"

echo -e "${BLUE}📁 回滚文件名...${NC}"

# 3. 回滚文件名
rename_item_rollback "xorigo-ui.config.json" "th-ui.config.json"

echo -e "${BLUE}🧹 清理缓存和重新安装依赖...${NC}"

# 4. 清理和重新安装
echo -e "${YELLOW}🗑️  清理 node_modules 和构建产物...${NC}"
rm -rf node_modules packages/*/node_modules apps/*/node_modules
rm -rf packages/*/dist apps/*/.next apps/*/out

echo -e "${YELLOW}📦 重新安装依赖...${NC}"
npm install

echo -e "${GREEN}✅ 回滚完成！${NC}"
echo ""
echo -e "${BLUE}📋 回滚摘要：${NC}"
echo -e "  • 品牌名称: Xorigo UI → TH-UI"
echo -e "  • 包名前缀: @xorigo-ui → @th-ui"
echo -e "  • 标识符: xorigo-ui → th-ui"
echo -e "  • 团队名称: Xorigo UI Team → TH-UI Team"
echo -e "  • 配置文件: xorigo-ui.config.json → th-ui.config.json"
echo ""
echo -e "${YELLOW}💾 备份目录未删除: $BACKUP_DIR${NC}"
echo ""
echo -e "${GREEN}🎉 已成功回滚到 TH-UI！${NC}"