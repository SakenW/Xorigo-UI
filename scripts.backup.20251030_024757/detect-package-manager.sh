#!/bin/bash
# Xorigo UI Package Manager Detection Script
# 自动检测用户使用的包管理器并提供相应指令

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检测函数
detect_package_manager() {
  # 1. 检查 lockfile
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
    return
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
    return
  elif [ -f "package-lock.json" ]; then
    echo "npm"
    return
  elif [ -f "bun.lockb" ]; then
    echo "bun"
    return
  fi

  # 2. 检查环境变量
  if [ -n "$npm_config_user_agent" ]; then
    case "$npm_config_user_agent" in
      pnpm*) echo "pnpm" ; return ;;
      yarn*) echo "yarn" ; return ;;
      bun*) echo "bun" ; return ;;
      npm*) echo "npm" ; return ;;
    esac
  fi

  # 3. 检查已安装的包管理器
  if command -v pnpm &> /dev/null; then
    echo "pnpm"
    return
  elif command -v yarn &> /dev/null; then
    echo "yarn"
    return
  elif command -v bun &> /dev/null; then
    echo "bun"
    return
  elif command -v npm &> /dev/null; then
    echo "npm"
    return
  fi

  # 默认返回 npm
  echo "npm"
}

# 获取包管理器版本
get_version() {
  local pm=$1
  case "$pm" in
    pnpm) pnpm --version 2>/dev/null || echo "未安装" ;;
    yarn) yarn --version 2>/dev/null || echo "未安装" ;;
    bun) bun --version 2>/dev/null || echo "未安装" ;;
    npm) npm --version 2>/dev/null || echo "未安装" ;;
  esac
}

# 检查包管理器是否满足最低版本要求
check_version() {
  local pm=$1
  local version=$2
  local min_version=$3

  if [ "$version" = "未安装" ]; then
    return 1
  fi

  # 简单的版本比较（只比较主版本号）
  local current_major=$(echo "$version" | cut -d. -f1)
  local min_major=$(echo "$min_version" | cut -d. -f1)

  if [ "$current_major" -ge "$min_major" ]; then
    return 0
  else
    return 1
  fi
}

# 显示使用指南
show_usage() {
  local pm=$1

  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo -e "${GREEN}Xorigo UI 包管理器使用指南${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo ""

  case "$pm" in
    pnpm)
      echo -e "${GREEN}✓ 检测到: pnpm${NC} (推荐)"
      echo ""
      echo "安装依赖:"
      echo "  pnpm install"
      echo ""
      echo "添加新包:"
      echo "  pnpm add <package-name>"
      echo ""
      echo "开发命令:"
      echo "  pnpm dev              # 组件库开发"
      echo "  pnpm dev:website      # 网站开发"
      echo "  pnpm build            # 构建组件库"
      echo "  pnpm test             # 运行测试"
      echo ""
      echo "工作区命令:"
      echo "  pnpm --filter @xorigo-ui/core dev    # 运行特定包"
      echo "  pnpm -r build                     # 递归构建所有包"
      ;;
    yarn)
      echo -e "${GREEN}✓ 检测到: yarn${NC}"
      echo ""
      echo "安装依赖:"
      echo "  yarn install"
      echo ""
      echo "添加新包:"
      echo "  yarn add <package-name>"
      echo ""
      echo "开发命令:"
      echo "  yarn dev              # 组件库开发"
      echo "  yarn dev:website      # 网站开发"
      echo "  yarn build            # 构建组件库"
      echo "  yarn test             # 运行测试"
      echo ""
      echo "工作区命令:"
      echo "  yarn workspace @xorigo-ui/core dev   # 运行特定包"
      ;;
    bun)
      echo -e "${GREEN}✓ 检测到: bun${NC} (最快)"
      echo ""
      echo "安装依赖:"
      echo "  bun install"
      echo ""
      echo "添加新包:"
      echo "  bun add <package-name>"
      echo ""
      echo "开发命令:"
      echo "  bun run dev           # 组件库开发"
      echo "  bun run dev:website   # 网站开发"
      echo "  bun run build         # 构建组件库"
      echo "  bun test              # 运行测试"
      ;;
    npm)
      echo -e "${GREEN}✓ 检测到: npm${NC}"
      echo ""
      echo "安装依赖:"
      echo "  npm install"
      echo ""
      echo "添加新包:"
      echo "  npm install <package-name>"
      echo ""
      echo "开发命令:"
      echo "  npm run dev           # 组件库开发"
      echo "  npm run dev:website   # 网站开发"
      echo "  npm run build         # 构建组件库"
      echo "  npm test              # 运行测试"
      echo ""
      echo "工作区命令:"
      echo "  npm --workspace=@xorigo-ui/core run dev   # 运行特定包"
      ;;
  esac

  echo ""
  echo -e "${BLUE}════════════════════════════════════════${NC}"
}

# 显示所有包管理器状态
show_all_managers() {
  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo -e "${GREEN}已安装的包管理器${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}"
  echo ""

  # 检查所有包管理器
  local managers=("npm" "pnpm" "yarn" "bun")
  local min_versions=("10.0.0" "9.0.0" "4.0.0" "1.0.0")

  for i in "${!managers[@]}"; do
    local pm="${managers[$i]}"
    local min_ver="${min_versions[$i]}"
    local version=$(get_version "$pm")

    if [ "$version" != "未安装" ]; then
      if check_version "$pm" "$version" "$min_ver"; then
        echo -e "${GREEN}✓ $pm${NC}: v$version (满足要求: >=$min_ver)"
      else
        echo -e "${YELLOW}⚠ $pm${NC}: v$version (需要: >=$min_ver)"
      fi
    else
      echo -e "${RED}✗ $pm${NC}: 未安装"
    fi
  done

  echo ""
  echo -e "${BLUE}════════════════════════════════════════${NC}"
}

# 主函数
main() {
  if [ "$1" = "--all" ] || [ "$1" = "-a" ]; then
    show_all_managers
  else
    local detected=$(detect_package_manager)
    show_usage "$detected"

    echo ""
    echo -e "${YELLOW}提示: 使用 './scripts/detect-package-manager.sh --all' 查看所有包管理器${NC}"
  fi
}

# 执行主函数
main "$@"
