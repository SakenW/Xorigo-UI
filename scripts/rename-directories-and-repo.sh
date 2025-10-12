#!/bin/bash

# Xorigo UI 目录和仓库重命名脚本
# 处理项目目录和Git仓库的重命名

set -e

# 定义颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 开始重命名目录和仓库...${NC}"

# 获取当前目录信息
CURRENT_DIR=$(pwd)
CURRENT_DIR_NAME=$(basename "$CURRENT_DIR")
PARENT_DIR=$(dirname "$CURRENT_DIR")

echo -e "${BLUE}📁 当前目录: $CURRENT_DIR${NC}"
echo -e "${BLUE}📁 父目录: $PARENT_DIR${NC}"

# 确认操作
echo -e "${YELLOW}⚠️  即将执行以下操作：${NC}"
echo -e "  1. 重命名项目目录: $CURRENT_DIR_NAME → Xorigo-UI"
echo -e "  2. 更新 Git 仓库配置"
echo -e "  3. 更新工作目录路径"

read -p "确定要继续吗？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}❌ 操作已取消${NC}"
    exit 0
fi

# 1. 重命名项目目录
NEW_DIR_NAME="Xorigo-UI"
NEW_DIR_PATH="$PARENT_DIR/$NEW_DIR_NAME"

if [[ "$CURRENT_DIR" != "$NEW_DIR_PATH" ]]; then
    echo -e "${BLUE}📁 重命名项目目录...${NC}"

    # 切换到父目录
    cd "$PARENT_DIR"

    # 检查目标目录是否已存在
    if [[ -d "$NEW_DIR_NAME" ]]; then
        echo -e "${RED}❌ 目标目录已存在: $NEW_DIR_PATH${NC}"
        exit 1
    fi

    # 重命名目录
    mv "$CURRENT_DIR_NAME" "$NEW_DIR_NAME"
    echo -e "${GREEN}✅ 目录重命名完成: $CURRENT_DIR_NAME → $NEW_DIR_NAME${NC}"

    # 切换到新目录
    cd "$NEW_DIR_PATH"
    echo -e "${GREEN}✅ 切换到新目录: $(pwd)${NC}"
else
    echo -e "${YELLOW}⚠️  目录名称已经是正确的${NC}"
fi

# 2. 更新 Git 仓库配置
echo -e "${BLUE}🔧 更新 Git 仓库配置...${NC}"

# 检查是否是 Git 仓库
if [[ -d ".git" ]]; then
    # 更新 remote URL
    OLD_REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
    if [[ -n "$OLD_REMOTE_URL" ]]; then
        NEW_REMOTE_URL=$(echo "$OLD_REMOTE_URL" | sed 's/TH-UI/Xorigo-UI/g')

        if [[ "$OLD_REMOTE_URL" != "$NEW_REMOTE_URL" ]]; then
            git remote set-url origin "$NEW_REMOTE_URL"
            echo -e "${GREEN}✅ 更新 Git remote URL: $OLD_REMOTE_URL → $NEW_REMOTE_URL${NC}"
        else
            echo -e "${YELLOW}⚠️  Git remote URL 已经是正确的${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  未找到 Git remote 配置${NC}"
    fi

    # 更新 .git/config 中的其他引用
    if [[ -f ".git/config" ]]; then
        sed -i 's/TH-UI/Xorigo-UI/g' .git/config
        echo -e "${GREEN}✅ 更新 .git/config 文件${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  当前目录不是 Git 仓库${NC}"
fi

# 3. 更新可能包含绝对路径的文件
echo -e "${BLUE}🔧 更新文件中的路径引用...${NC}"

# 更新可能包含绝对路径的文件
files_to_check=(
    "package.json"
    "package-lock.json"
    "pnpm-lock.yaml"
    "yarn.lock"
    "*.config.js"
    "*.config.ts"
    "README.md"
    "CLAUDE.md"
    "scripts/*.sh"
    "docker-compose*.yml"
    "Dockerfile*"
)

for pattern in "${files_to_check[@]}"; do
    for file in $(find . -name "$pattern" -not -path "./node_modules/*" -not -path "./backup-*/*" -not -path "./.git/*" 2>/dev/null); do
        if [[ -f "$file" ]]; then
            # 检查文件是否包含旧路径
            if grep -q "$CURRENT_DIR" "$file" 2>/dev/null; then
                # 替换路径
                sed -i "s|$CURRENT_DIR|$NEW_DIR_PATH|g" "$file"
                echo -e "${GREEN}✅ 更新路径引用: $file${NC}"
            fi
        fi
    done
done

# 4. 更新 IDE 配置文件
echo -e "${BLUE}🔧 更新 IDE 配置...${NC}"

# 更新 VS Code 工作区配置
if [[ -f ".vscode/settings.json" ]]; then
    sed -i "s|$CURRENT_DIR|$NEW_DIR_PATH|g" .vscode/settings.json
    echo -e "${GREEN}✅ 更新 VS Code 设置${NC}"
fi

if [[ -f ".vscode/launch.json" ]]; then
    sed -i "s|$CURRENT_DIR|$NEW_DIR_PATH|g" .vscode/launch.json
    echo -e "${GREEN}✅ 更新 VS Code 调试配置${NC}"
fi

# 5. 更新脚本中的路径引用
echo -e "${BLUE}🔧 更新脚本文件中的路径...${NC}"

for script in scripts/*.sh; do
    if [[ -f "$script" ]]; then
        sed -i "s|$CURRENT_DIR|$NEW_DIR_PATH|g" "$script"
        echo -e "${GREEN}✅ 更新脚本路径: $script${NC}"
    fi
done

# 6. 清理可能的缓存文件
echo -e "${BLUE}🧹 清理缓存文件...${NC}"

# 清理可能的缓存和临时文件
rm -rf ./.cache 2>/dev/null || true
rm -rf ./node_modules/.cache 2>/dev/null || true
rm -rf packages/*/node_modules/.cache 2>/dev/null || true

# 7. 验证重命名结果
echo -e "${BLUE}🔍 验证重命名结果...${NC}"

NEW_PROJECT_NAME=$(basename "$(pwd)")
echo -e "${GREEN}✅ 当前项目目录: $(pwd)${NC}"
echo -e "${GREEN}✅ 项目名称: $NEW_PROJECT_NAME${NC}"

if [[ -d ".git" ]]; then
    NEW_REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "未配置")
    echo -e "${GREEN}✅ Git remote URL: $NEW_REMOTE_URL${NC}"
fi

echo ""
echo -e "${GREEN}🎉 目录和仓库重命名完成！${NC}"
echo ""
echo -e "${BLUE}📋 重命名摘要：${NC}"
echo -e "  • 项目目录: $CURRENT_DIR_NAME → Xorigo-UI"
echo -e "  • Git 仓库: TH-UI → Xorigo-UI"
echo -e "  • 路径引用: 已更新所有文件中的绝对路径"
echo ""
echo -e "${BLUE}🔍 建议后续操作：${NC}"
echo -e "  1. 检查 Git 状态: git status"
echo -e "  2. 提交更改: git add . && git commit -m 'refactor: rename project to Xorigo-UI'"
echo -e "  3. 推送到新仓库: git push origin main --force"
echo -e "  4. 在 GitHub 上重命名仓库: TH-UI → Xorigo-UI"
echo ""
echo -e "${YELLOW}⚠️  重要提醒：${NC}"
echo -e "  • 如果这是 Git 仓库，需要在 GitHub 上手动重命名仓库名称"
echo -e "  • 推送时可能需要使用 --force 因为分支历史已更改"
echo -e "  • 团队成员需要更新远程仓库引用"