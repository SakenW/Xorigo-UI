#!/usr/bin/env bash
#
# 🔍 Xorigo UI DX Enhancement 工具验证脚本
# 快速验证所有 DX 工具是否正确安装
#

set -euo pipefail

# 颜色定义
readonly GREEN='\033[0;32m'
readonly RED='\033[0;31m'
readonly YELLOW='\033[1;33m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 计数器
TOTAL=0
PASSED=0
FAILED=0

# 检查函数
check_file() {
  local file="$1"
  local desc="$2"
  TOTAL=$((TOTAL + 1))

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} ${desc}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗${NC} ${desc} (文件不存在: $file)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

check_dir() {
  local dir="$1"
  local desc="$2"
  TOTAL=$((TOTAL + 1))

  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} ${desc}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗${NC} ${desc} (目录不存在: $dir)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

check_executable() {
  local file="$1"
  local desc="$2"
  TOTAL=$((TOTAL + 1))

  if [ -x "$file" ]; then
    echo -e "${GREEN}✓${NC} ${desc}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${YELLOW}⚠${NC} ${desc} (文件存在但不可执行)"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

echo -e "${CYAN}${BOLD}"
cat << "EOF"
╔═══════════════════════════════════════════════╗
║                                               ║
║   🔍 DX Enhancement 工具验证                  ║
║                                               ║
╚═══════════════════════════════════════════════╝
EOF
echo -e "${NC}\n"

# 1. CLI 工具
echo -e "${BOLD}📝 1. CLI 工具${NC}"
check_executable "$PROJECT_ROOT/scripts/dev-menu.sh" "CLI 开发菜单"
check_executable "$PROJECT_ROOT/scripts/install-dx-tools.sh" "DX 工具安装脚本"
check_executable "$PROJECT_ROOT/scripts/generate-arch-diagram.ts" "架构图生成工具"
echo ""

# 2. Performance SDK
echo -e "${BOLD}⚡ 2. Performance SDK${NC}"
check_dir "$PROJECT_ROOT/apps/website/src/lib/performance" "Performance 目录"
check_file "$PROJECT_ROOT/apps/website/src/lib/performance/types.ts" "性能类型定义"
check_file "$PROJECT_ROOT/apps/website/src/lib/performance/monitor.ts" "性能监控核心"
check_file "$PROJECT_ROOT/apps/website/src/lib/performance/hooks.ts" "性能 Hooks"
echo ""

# 3. 可视化组件
echo -e "${BOLD}🎨 3. 可视化组件${NC}"
check_dir "$PROJECT_ROOT/apps/website/src/components/perf" "Perf 组件目录"
check_file "$PROJECT_ROOT/apps/website/src/components/perf/MetricCard.tsx" "MetricCard 组件"
check_file "$PROJECT_ROOT/apps/website/src/components/perf/PerformanceChart.tsx" "PerformanceChart 组件"
check_file "$PROJECT_ROOT/apps/website/src/components/perf/ComponentMetrics.tsx" "ComponentMetrics 组件"
echo ""

# 4. Performance Dashboard
echo -e "${BOLD}📊 4. Performance Dashboard${NC}"
if check_dir "$PROJECT_ROOT/apps/website/app/perf" "Perf 页面目录"; then
  check_file "$PROJECT_ROOT/apps/website/app/perf/page.tsx" "Perf 页面"
else
  echo -e "${YELLOW}⚠${NC} 需要手动安装 Performance Dashboard 页面"
  echo -e "   运行: ${CYAN}bash scripts/install-dx-tools.sh${NC}"
fi
echo ""

# 5. Bundle 分析
echo -e "${BOLD}📦 5. Bundle 分析${NC}"
check_file "$PROJECT_ROOT/apps/website/src/lib/bundle-analyzer.ts" "Bundle 分析工具"
echo ""

# 6. 配置文件
echo -e "${BOLD}⚙️  6. 配置文件${NC}"
check_file "$PROJECT_ROOT/typedoc.json" "TypeDoc 配置"
check_file "$PROJECT_ROOT/apps/website/next.config-devtools.ts" "Next.js DevTools 配置"
echo ""

# 7. 文档
echo -e "${BOLD}📚 7. 文档${NC}"
check_file "$PROJECT_ROOT/docs/DX-ENHANCEMENT-GUIDE.md" "DX Enhancement 指南"
check_file "$PROJECT_ROOT/docs/DX-ENHANCEMENT-SUMMARY.md" "DX Enhancement 总结"
echo ""

# 统计
echo -e "${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BOLD}统计结果${NC}"
echo -e "  总检查项: ${CYAN}${TOTAL}${NC}"
echo -e "  通过: ${GREEN}${PASSED}${NC}"
echo -e "  失败: ${RED}${FAILED}${NC}"
echo -e "${BOLD}═══════════════════════════════════════${NC}"
echo ""

# 计算通过率
PASS_RATE=$((PASSED * 100 / TOTAL))

if [ "$PASS_RATE" -eq 100 ]; then
  echo -e "${GREEN}${BOLD}✅ 所有检查通过！DX 工具已正确安装。${NC}"
  echo ""
  echo -e "${CYAN}下一步操作:${NC}"
  echo -e "  1. 启动 CLI 菜单: ${YELLOW}bash scripts/dev-menu.sh${NC}"
  echo -e "  2. 查看完整指南: ${YELLOW}cat docs/DX-ENHANCEMENT-GUIDE.md${NC}"
  exit 0
elif [ "$PASS_RATE" -ge 80 ]; then
  echo -e "${YELLOW}${BOLD}⚠️  部分检查未通过，但核心功能可用。${NC}"
  echo ""
  echo -e "${CYAN}建议操作:${NC}"
  echo -e "  1. 运行安装脚本: ${YELLOW}bash scripts/install-dx-tools.sh${NC}"
  echo -e "  2. 查看故障排查: ${YELLOW}docs/DX-ENHANCEMENT-GUIDE.md#故障排查${NC}"
  exit 1
else
  echo -e "${RED}${BOLD}❌ 多项检查失败，请重新安装。${NC}"
  echo ""
  echo -e "${CYAN}请执行:${NC}"
  echo -e "  ${YELLOW}bash scripts/install-dx-tools.sh${NC}"
  exit 2
fi
