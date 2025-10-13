#!/usr/bin/env bash
#
# 🎨 Xorigo UI 交互式开发菜单
# 提供快速命令入口、环境检查、日志查看等功能
#

set -euo pipefail

# 颜色定义
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color
readonly BOLD='\033[1m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Logo
print_logo() {
  echo -e "${CYAN}${BOLD}"
  cat << "EOF"
╔═══════════════════════════════════════════════╗
║                                               ║
║   🎨  Xorigo UI - Developer Menu  🚀         ║
║                                               ║
║   Modern UI Component Library                ║
║   with Enhanced DX Tools                     ║
║                                               ║
╚═══════════════════════════════════════════════╝
EOF
  echo -e "${NC}"
}

# 环境检查
check_environment() {
  echo -e "${BOLD}🔍 环境检查${NC}\n"

  local all_ok=true

  # Node.js 版本
  if command -v node &> /dev/null; then
    local node_version=$(node -v)
    echo -e "  ${GREEN}✓${NC} Node.js: ${node_version}"

    # 检查版本要求 >= 22.0.0
    local major_version=$(echo "$node_version" | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$major_version" -lt 22 ]; then
      echo -e "    ${YELLOW}⚠${NC}  建议使用 Node.js >= 22.0.0"
      all_ok=false
    fi
  else
    echo -e "  ${RED}✗${NC} Node.js: 未安装"
    all_ok=false
  fi

  # npm 版本
  if command -v npm &> /dev/null; then
    local npm_version=$(npm -v)
    echo -e "  ${GREEN}✓${NC} npm: ${npm_version}"
  else
    echo -e "  ${RED}✗${NC} npm: 未安装"
    all_ok=false
  fi

  # TypeScript 版本
  if command -v tsc &> /dev/null; then
    local ts_version=$(tsc -v | cut -d' ' -f2)
    echo -e "  ${GREEN}✓${NC} TypeScript: ${ts_version}"
  else
    echo -e "  ${YELLOW}⚠${NC}  TypeScript: 未全局安装（使用项目本地版本）"
  fi

  # Git 状态
  if [ -d "$PROJECT_ROOT/.git" ]; then
    local branch=$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
    local status=$(git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null | wc -l)
    echo -e "  ${GREEN}✓${NC} Git 分支: ${CYAN}${branch}${NC}"
    if [ "$status" -gt 0 ]; then
      echo -e "    ${YELLOW}⚠${NC}  有 ${status} 个未提交的变更"
    fi
  fi

  # Docker 状态
  if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
      echo -e "  ${GREEN}✓${NC} Docker: 运行中"
    else
      echo -e "  ${YELLOW}⚠${NC}  Docker: 已安装但未运行"
    fi
  else
    echo -e "  ${YELLOW}⚠${NC}  Docker: 未安装"
  fi

  # 依赖检查
  if [ -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "  ${GREEN}✓${NC} 依赖: 已安装"
  else
    echo -e "  ${RED}✗${NC} 依赖: 未安装 (请运行 npm install)"
    all_ok=false
  fi

  echo ""

  if [ "$all_ok" = true ]; then
    echo -e "${GREEN}✓ 环境检查通过${NC}\n"
  else
    echo -e "${YELLOW}⚠ 环境检查发现问题，请修复后继续${NC}\n"
  fi
}

# 快速启动菜单
show_quick_start() {
  echo -e "${BOLD}🚀 快速启动${NC}\n"
  echo -e "  ${CYAN}1${NC}) 启动组件库开发服务器 (Vite)"
  echo -e "  ${CYAN}2${NC}) 启动 Website 开发服务器 (Next.js)"
  echo -e "  ${CYAN}3${NC}) 启动 Docker 开发环境"
  echo -e "  ${CYAN}4${NC}) 启动性能监控面板 (http://localhost:3000/perf)"
  echo ""
}

# 构建菜单
show_build_menu() {
  echo -e "${BOLD}🔨 构建管理${NC}\n"
  echo -e "  ${CYAN}5${NC}) 构建所有包 (monorepo)"
  echo -e "  ${CYAN}6${NC}) 构建组件库 (packages/core)"
  echo -e "  ${CYAN}7${NC}) 构建 Website"
  echo -e "  ${CYAN}8${NC}) 清理所有构建产物"
  echo ""
}

# 测试菜单
show_test_menu() {
  echo -e "${BOLD}🧪 测试与验证${NC}\n"
  echo -e "  ${CYAN}9${NC})  运行所有测试"
  echo -e "  ${CYAN}10${NC}) 运行类型检查 (TypeScript)"
  echo -e "  ${CYAN}11${NC}) 运行 Linter (ESLint)"
  echo -e "  ${CYAN}12${NC}) 检查依赖关系"
  echo -e "  ${CYAN}13${NC}) 验证包结构"
  echo ""
}

# 日志查看菜单
show_logs_menu() {
  echo -e "${BOLD}📋 日志查看${NC}\n"
  echo -e "  ${CYAN}14${NC}) 查看 Docker 开发环境日志"
  echo -e "  ${CYAN}15${NC}) 查看 Docker 生产环境日志"
  echo -e "  ${CYAN}16${NC}) 查看构建日志"
  echo ""
}

# 工具菜单
show_tools_menu() {
  echo -e "${BOLD}🛠️  开发工具${NC}\n"
  echo -e "  ${CYAN}17${NC}) 生成组件文档 (TypeDoc)"
  echo -e "  ${CYAN}18${NC}) 生成架构图"
  echo -e "  ${CYAN}19${NC}) Bundle 分析"
  echo -e "  ${CYAN}20${NC}) 性能分析 (Core Web Vitals)"
  echo ""
}

# 主菜单
show_main_menu() {
  clear
  print_logo
  check_environment
  show_quick_start
  show_build_menu
  show_test_menu
  show_logs_menu
  show_tools_menu
  echo -e "${BOLD}⚙️  其他选项${NC}\n"
  echo -e "  ${CYAN}e${NC}) 环境检查详情"
  echo -e "  ${CYAN}h${NC}) 帮助文档"
  echo -e "  ${CYAN}q${NC}) 退出"
  echo ""
}

# 执行命令
execute_command() {
  local choice="$1"

  case "$choice" in
    1)
      echo -e "${GREEN}▶ 启动组件库开发服务器...${NC}"
      cd "$PROJECT_ROOT" && npm run dev
      ;;
    2)
      echo -e "${GREEN}▶ 启动 Website 开发服务器...${NC}"
      cd "$PROJECT_ROOT" && npm run dev:website
      ;;
    3)
      echo -e "${GREEN}▶ 启动 Docker 开发环境...${NC}"
      cd "$PROJECT_ROOT" && npm run docker:dev
      ;;
    4)
      echo -e "${GREEN}▶ 打开性能监控面板...${NC}"
      echo -e "${CYAN}请先启动 Website: npm run dev:website${NC}"
      echo -e "${CYAN}然后访问: http://localhost:3000/perf${NC}"
      read -p "按 Enter 继续..."
      ;;
    5)
      echo -e "${GREEN}▶ 构建所有包...${NC}"
      cd "$PROJECT_ROOT" && npm run build:all
      ;;
    6)
      echo -e "${GREEN}▶ 构建组件库...${NC}"
      cd "$PROJECT_ROOT" && npm run build
      ;;
    7)
      echo -e "${GREEN}▶ 构建 Website...${NC}"
      cd "$PROJECT_ROOT/apps/website" && npm run build
      ;;
    8)
      echo -e "${YELLOW}▶ 清理所有构建产物...${NC}"
      read -p "确认清理? (y/N): " confirm
      if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        cd "$PROJECT_ROOT" && npm run clean
        echo -e "${GREEN}✓ 清理完成${NC}"
      fi
      read -p "按 Enter 继续..."
      ;;
    9)
      echo -e "${GREEN}▶ 运行所有测试...${NC}"
      cd "$PROJECT_ROOT" && npm run test
      ;;
    10)
      echo -e "${GREEN}▶ 运行类型检查...${NC}"
      cd "$PROJECT_ROOT" && npm run type-check
      ;;
    11)
      echo -e "${GREEN}▶ 运行 Linter...${NC}"
      cd "$PROJECT_ROOT" && npm run lint
      ;;
    12)
      echo -e "${GREEN}▶ 检查依赖关系...${NC}"
      cd "$PROJECT_ROOT" && npm run check-dependencies
      ;;
    13)
      echo -e "${GREEN}▶ 验证包结构...${NC}"
      cd "$PROJECT_ROOT" && npm run validate-packages
      ;;
    14)
      echo -e "${GREEN}▶ 查看 Docker 开发环境日志...${NC}"
      cd "$PROJECT_ROOT" && npm run docker:logs
      ;;
    15)
      echo -e "${GREEN}▶ 查看 Docker 生产环境日志...${NC}"
      cd "$PROJECT_ROOT" && npm run deploy:logs
      ;;
    16)
      echo -e "${GREEN}▶ 查看构建日志...${NC}"
      echo -e "${CYAN}构建日志位于: apps/website/.next/trace${NC}"
      read -p "按 Enter 继续..."
      ;;
    17)
      echo -e "${GREEN}▶ 生成组件文档...${NC}"
      cd "$PROJECT_ROOT" && npx typedoc --out docs/api packages/core/src/index.ts
      echo -e "${GREEN}✓ 文档生成完成: docs/api${NC}"
      read -p "按 Enter 继续..."
      ;;
    18)
      echo -e "${GREEN}▶ 生成架构图...${NC}"
      if [ -f "$PROJECT_ROOT/scripts/generate-arch-diagram.ts" ]; then
        cd "$PROJECT_ROOT" && npx tsx scripts/generate-arch-diagram.ts
      else
        echo -e "${YELLOW}架构图生成工具尚未实现${NC}"
      fi
      read -p "按 Enter 继续..."
      ;;
    19)
      echo -e "${GREEN}▶ Bundle 分析...${NC}"
      cd "$PROJECT_ROOT/apps/website" && npm run build
      echo -e "${CYAN}查看: apps/website/.next/analyze${NC}"
      read -p "按 Enter 继续..."
      ;;
    20)
      echo -e "${GREEN}▶ 性能分析...${NC}"
      echo -e "${CYAN}请访问: http://localhost:3000/perf${NC}"
      read -p "按 Enter 继续..."
      ;;
    e)
      check_environment
      read -p "按 Enter 继续..."
      ;;
    h)
      show_help
      read -p "按 Enter 继续..."
      ;;
    q)
      echo -e "${CYAN}👋 再见！${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}✗ 无效选项${NC}"
      sleep 1
      ;;
  esac
}

# 帮助文档
show_help() {
  clear
  echo -e "${BOLD}📚 Xorigo UI 开发指南${NC}\n"
  echo -e "${CYAN}快速开始:${NC}"
  echo -e "  1. 确保环境满足要求 (Node.js >= 22, npm >= 10)"
  echo -e "  2. 安装依赖: ${YELLOW}npm install${NC}"
  echo -e "  3. 启动开发服务器: ${YELLOW}npm run dev:website${NC}"
  echo ""
  echo -e "${CYAN}常用命令:${NC}"
  echo -e "  ${YELLOW}npm run dev${NC}              - 启动组件库开发"
  echo -e "  ${YELLOW}npm run dev:website${NC}      - 启动 Website 开发"
  echo -e "  ${YELLOW}npm run build:all${NC}        - 构建所有包"
  echo -e "  ${YELLOW}npm run test${NC}             - 运行测试"
  echo -e "  ${YELLOW}npm run type-check${NC}       - 类型检查"
  echo ""
  echo -e "${CYAN}Docker 命令:${NC}"
  echo -e "  ${YELLOW}npm run docker:dev${NC}       - 启动 Docker 开发环境"
  echo -e "  ${YELLOW}npm run docker:logs${NC}      - 查看 Docker 日志"
  echo -e "  ${YELLOW}npm run docker:stop${NC}      - 停止 Docker 容器"
  echo ""
  echo -e "${CYAN}DX 工具:${NC}"
  echo -e "  ${YELLOW}http://localhost:3000/perf${NC}     - 性能监控面板"
  echo -e "  ${YELLOW}http://localhost:3000/playground${NC} - 组件 Playground"
  echo ""
  echo -e "${CYAN}文档:${NC}"
  echo -e "  README.md           - 项目总览"
  echo -e "  CLAUDE.md           - Claude AI 开发指南"
  echo -e "  docs/               - 详细文档"
  echo ""
}

# 主循环
main() {
  while true; do
    show_main_menu
    read -p "$(echo -e ${BOLD}选择操作 [1-20/e/h/q]:${NC} )" choice
    execute_command "$choice"
  done
}

# 启动菜单
main
