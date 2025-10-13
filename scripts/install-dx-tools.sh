#!/usr/bin/env bash
#
# 🚀 Xorigo UI DX Enhancement 工具安装脚本
# 自动化安装所有 DX 工具和依赖
#

set -euo pipefail

# 颜色定义
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 Xorigo UI DX Enhancement                ║
║      Installation Script                     ║
║                                               ║
╚═══════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# 步骤 1: 检查环境
echo -e "${BOLD}📋 步骤 1/6: 检查环境${NC}"
echo "  检查 Node.js..."
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}  ⚠️  Node.js 未安装，请先安装 Node.js >= 22.0.0${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓${NC} Node.js: $(node -v)"

echo "  检查 npm..."
if ! command -v npm &> /dev/null; then
  echo -e "${YELLOW}  ⚠️  npm 未安装${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓${NC} npm: $(npm -v)"

echo ""

# 步骤 2: 安装依赖
echo -e "${BOLD}📦 步骤 2/6: 安装依赖${NC}"

echo "  安装 TypeDoc..."
npm install -D typedoc typedoc-plugin-markdown --silent
echo -e "${GREEN}  ✓${NC} TypeDoc 安装完成"

echo "  安装 Webpack Bundle Analyzer (可选)..."
cd "$PROJECT_ROOT/apps/website"
npm install -D webpack-bundle-analyzer --silent
cd "$PROJECT_ROOT"
echo -e "${GREEN}  ✓${NC} Bundle Analyzer 安装完成"

echo ""

# 步骤 3: 创建 perf 目录 (需要权限)
echo -e "${BOLD}📁 步骤 3/6: 创建 Performance Dashboard 目录${NC}"

PERF_DIR="$PROJECT_ROOT/apps/website/app/perf"

if [ -d "$PERF_DIR" ]; then
  echo -e "${GREEN}  ✓${NC} 目录已存在: $PERF_DIR"
else
  echo "  创建目录: $PERF_DIR"
  if mkdir -p "$PERF_DIR" 2>/dev/null; then
    echo -e "${GREEN}  ✓${NC} 目录创建成功"
  else
    echo -e "${YELLOW}  ⚠️  需要管理员权限创建目录${NC}"
    echo "  请手动执行:"
    echo "    sudo mkdir -p $PERF_DIR"
    echo "    sudo chown -R $(whoami):$(whoami) $PERF_DIR"
    read -p "  按 Enter 继续..."
  fi
fi

# 步骤 4: 安装 Performance Dashboard 页面
echo -e "\n${BOLD}🎨 步骤 4/6: 安装 Performance Dashboard 页面${NC}"

if [ -f "/tmp/xorigo-perf-page.tsx" ]; then
  if [ -w "$PERF_DIR" ]; then
    cp /tmp/xorigo-perf-page.tsx "$PERF_DIR/page.tsx"
    echo -e "${GREEN}  ✓${NC} Performance Dashboard 页面已安装"
  else
    echo -e "${YELLOW}  ⚠️  无法写入目录，请手动复制${NC}"
    echo "  执行: cp /tmp/xorigo-perf-page.tsx $PERF_DIR/page.tsx"
    read -p "  按 Enter 继续..."
  fi
else
  echo -e "${YELLOW}  ⚠️  页面文件不存在: /tmp/xorigo-perf-page.tsx${NC}"
  echo "  跳过安装，可稍后手动复制"
fi

echo ""

# 步骤 5: 添加 npm scripts
echo -e "${BOLD}⚙️  步骤 5/6: 更新 npm scripts${NC}"

ROOT_PKG="$PROJECT_ROOT/package.json"

if grep -q '"menu"' "$ROOT_PKG" 2>/dev/null; then
  echo -e "${GREEN}  ✓${NC} npm scripts 已配置"
else
  echo "  请手动添加以下 scripts 到 package.json:"
  echo '  "menu": "bash scripts/dev-menu.sh",'
  echo '  "arch": "tsx scripts/generate-arch-diagram.ts",'
  echo '  "docs": "typedoc"'
  read -p "  按 Enter 继续..."
fi

echo ""

# 步骤 6: 生成初始文档
echo -e "${BOLD}📚 步骤 6/6: 生成初始文档${NC}"

echo "  生成架构图..."
if [ -x "$PROJECT_ROOT/scripts/generate-arch-diagram.ts" ]; then
  cd "$PROJECT_ROOT"
  npx tsx scripts/generate-arch-diagram.ts
  echo -e "${GREEN}  ✓${NC} 架构图生成完成"
else
  echo -e "${YELLOW}  ⚠️  架构图生成脚本不可执行${NC}"
fi

echo ""

# 完成
echo -e "${GREEN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════╗
║                                               ║
║   ✅ DX Enhancement 安装完成！                ║
║                                               ║
╚═══════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

echo -e "${CYAN}📖 下一步操作:${NC}"
echo ""
echo "  1. 启动 CLI 开发菜单:"
echo -e "     ${YELLOW}bash scripts/dev-menu.sh${NC}"
echo ""
echo "  2. 启动 Website 开发服务器:"
echo -e "     ${YELLOW}npm run dev:website${NC}"
echo ""
echo "  3. 访问性能监控面板:"
echo -e "     ${YELLOW}http://localhost:3000/perf${NC}"
echo ""
echo "  4. 生成 API 文档:"
echo -e "     ${YELLOW}npx typedoc${NC}"
echo ""
echo "  5. 查看完整指南:"
echo -e "     ${YELLOW}cat docs/DX-ENHANCEMENT-GUIDE.md${NC}"
echo ""

echo -e "${CYAN}💡 提示:${NC}"
echo "  • 使用 CLI 菜单可快速访问所有工具"
echo "  • 性能监控会实时更新，建议保持打开"
echo "  • 定期运行 Bundle 分析以控制包大小"
echo "  • 架构图会随项目更新，建议定期重新生成"
echo ""

exit 0
