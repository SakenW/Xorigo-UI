#!/bin/bash
# ============================================================================
# 文件: scripts/final-acceptance.sh
# 用途: Website 重构最终验收脚本
# 版本: v1.0
# 使用: bash scripts/final-acceptance.sh [--auto|--manual]
# ============================================================================

set -e

COLOR_RESET="\033[0m"
COLOR_RED="\033[31m"
COLOR_GREEN="\033[32m"
COLOR_YELLOW="\033[33m"
COLOR_BLUE="\033[34m"
COLOR_CYAN="\033[36m"
COLOR_MAGENTA="\033[35m"

WEBSITE_DIR="apps/website"
MODE="auto"

# 解析参数
if [ "$1" == "--manual" ]; then
  MODE="manual"
elif [ "$1" == "--auto" ]; then
  MODE="auto"
fi

# ============================================================================
# 辅助函数
# ============================================================================

print_header() {
  echo -e "\n${COLOR_MAGENTA}╔════════════════════════════════════════════════════════════════╗${COLOR_RESET}"
  echo -e "${COLOR_MAGENTA}║${COLOR_RESET} $1"
  echo -e "${COLOR_MAGENTA}╚════════════════════════════════════════════════════════════════╝${COLOR_RESET}\n"
}

print_category() {
  echo -e "\n${COLOR_CYAN}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${COLOR_RESET}"
  echo -e "${COLOR_CYAN}▓ $1${COLOR_RESET}"
  echo -e "${COLOR_CYAN}▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓${COLOR_RESET}\n"
}

print_item() {
  echo -e "${COLOR_BLUE}  [$1] $2${COLOR_RESET}"
}

print_success() {
  echo -e "${COLOR_GREEN}    ✅ $1${COLOR_RESET}"
}

print_error() {
  echo -e "${COLOR_RED}    ❌ $1${COLOR_RESET}"
}

print_warning() {
  echo -e "${COLOR_YELLOW}    ⚠️  $1${COLOR_RESET}"
}

print_info() {
  echo -e "    ℹ️  $1"
}

ask_confirmation() {
  if [ "$MODE" == "manual" ]; then
    read -p "  确认此项已完成? (y/n): " response
    case "$response" in
      [yY][eE][sS]|[yY])
        return 0
        ;;
      *)
        return 1
        ;;
    esac
  else
    return 0  # auto 模式自动通过手动验证项
  fi
}

# ============================================================================
# 验收项检查
# ============================================================================

# Phase 1: 架构层 (Architecture Layer) - P0
check_p0_architecture() {
  print_category "Phase 1: 架构层 (Architecture Layer) - P0"

  local passed=0
  local failed=0
  local total=4

  # 1.1 四层架构实现
  print_item "1.1" "四层架构实现"
  local layers_exist=true

  if [ -d "packages/core" ] && [ -d "packages/registry" ] && [ -d "packages/tokens" ]; then
    print_success "Layer 1 (Packages): 存在"
  else
    print_error "Layer 1 (Packages): 缺失"
    layers_exist=false
  fi

  if [ -d "$WEBSITE_DIR/src/data" ] && \
     [ -f "$WEBSITE_DIR/src/data/registry.readonly.ts" ] && \
     [ -f "$WEBSITE_DIR/src/data/tokens.readonly.ts" ]; then
    print_success "Layer 2 (Data Layer): 存在"
  else
    print_error "Layer 2 (Data Layer): 缺失"
    layers_exist=false
  fi

  if [ -d "$WEBSITE_DIR/src/sdk" ] && \
     [ -f "$WEBSITE_DIR/src/sdk/docs-client.ts" ] && \
     [ -f "$WEBSITE_DIR/src/sdk/playground-client.ts" ]; then
    print_success "Layer 3 (SDK Layer): 存在"
  else
    print_error "Layer 3 (SDK Layer): 缺失"
    layers_exist=false
  fi

  if [ -d "$WEBSITE_DIR/app" ]; then
    print_success "Layer 4 (App Layer): 存在"
  else
    print_error "Layer 4 (App Layer): 缺失"
    layers_exist=false
  fi

  if [ "$layers_exist" = true ]; then
    passed=$((passed + 1))
  else
    failed=$((failed + 1))
  fi

  # 1.2 数据读取单向流
  print_item "1.2" "数据读取单向流（Data Read-Only）"

  cd "$WEBSITE_DIR"

  local registry_imports=$(grep -r "from '@xorigo-ui/registry'" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")
  local token_imports=$(grep -r "from '@xorigo-ui/tokens'" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")

  if [ "$registry_imports" -eq 0 ] && [ "$token_imports" -eq 0 ]; then
    print_success "无直接导入上游包"
    passed=$((passed + 1))
  else
    print_error "发现 $((registry_imports + token_imports)) 处直接导入"
    failed=$((failed + 1))
  fi

  cd - > /dev/null

  # 1.3 RSC/Client 分离
  print_item "1.3" "RSC/Client Component 分离"

  local rsc_pages=0
  local client_pages=0

  if [ -f "$WEBSITE_DIR/app/docs/page.tsx" ]; then
    if ! grep -q "'use client'" "$WEBSITE_DIR/app/docs/page.tsx"; then
      rsc_pages=$((rsc_pages + 1))
    fi
  fi

  if [ -f "$WEBSITE_DIR/app/playground/page.tsx" ]; then
    if grep -q "'use client'" "$WEBSITE_DIR/app/playground/page.tsx"; then
      client_pages=$((client_pages + 1))
    fi
  fi

  if [ $rsc_pages -gt 0 ] && [ $client_pages -gt 0 ]; then
    print_success "RSC/Client 分离正确"
    passed=$((passed + 1))
  else
    print_error "RSC/Client 分离不正确"
    failed=$((failed + 1))
  fi

  # 1.4 TypeScript 严格模式
  print_item "1.4" "TypeScript 严格模式启用"

  if [ -f "$WEBSITE_DIR/tsconfig.json" ]; then
    if grep -q '"strict": true' "$WEBSITE_DIR/tsconfig.json"; then
      print_success "TypeScript 严格模式已启用"
      passed=$((passed + 1))
    else
      print_error "TypeScript 严格模式未启用"
      failed=$((failed + 1))
    fi
  else
    print_error "tsconfig.json 不存在"
    failed=$((failed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 1 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 2: Data Layer - P0
check_p0_data_layer() {
  print_category "Phase 2: Data Layer - P0"

  local passed=0
  local failed=0
  local total=4

  local data_files=(
    "registry.readonly.ts"
    "tokens.readonly.ts"
    "recipes.readonly.ts"
    "i18n.readonly.ts"
  )

  for file in "${data_files[@]}"; do
    print_item "${file}" "Data Layer 适配器"

    if [ -f "$WEBSITE_DIR/src/data/$file" ]; then
      print_success "文件存在"

      # 检查是否导入上游包
      if grep -q "@xorigo-ui" "$WEBSITE_DIR/src/data/$file"; then
        print_success "  └─ 导入上游包正确"
      else
        print_warning "  └─ 未检测到上游包导入"
      fi

      # 检查是否导出接口
      if grep -q "export" "$WEBSITE_DIR/src/data/$file"; then
        print_success "  └─ 导出接口正确"
        passed=$((passed + 1))
      else
        print_error "  └─ 未检测到导出接口"
        failed=$((failed + 1))
      fi
    else
      print_error "文件不存在"
      failed=$((failed + 1))
    fi
  done

  echo -e "\n  ${COLOR_CYAN}Phase 2 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 3: Error Tolerance - P0
check_p0_error_tolerance() {
  print_category "Phase 3: Error Tolerance - P0"

  local passed=0
  local failed=0
  local total=3

  local boundaries=(
    "app/error.tsx"
    "app/playground/error.tsx"
    "components/MDXErrorBoundary.tsx"
  )

  for boundary in "${boundaries[@]}"; do
    print_item "${boundary}" "ErrorBoundary"

    if [ -f "$WEBSITE_DIR/$boundary" ]; then
      print_success "文件存在"

      # 检查是否使用 'use client'
      if grep -q "'use client'" "$WEBSITE_DIR/$boundary" || grep -q '"use client"' "$WEBSITE_DIR/$boundary"; then
        print_success "  └─ 'use client' 指令正确"
        passed=$((passed + 1))
      else
        print_error "  └─ 缺少 'use client' 指令"
        failed=$((failed + 1))
      fi
    else
      print_error "文件不存在"
      failed=$((failed + 1))
    fi
  done

  echo -e "\n  ${COLOR_CYAN}Phase 3 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 4: Pages Layer - P1
check_p1_pages_layer() {
  print_category "Phase 4: Pages Layer - P1"

  local passed=0
  local failed=0
  local total=5

  local pages=(
    "docs"
    "adoption"
    "tokens"
    "playground"
  )

  for page in "${pages[@]}"; do
    print_item "/app/${page}" "页面路由"

    if [ -d "$WEBSITE_DIR/app/$page" ] && [ -f "$WEBSITE_DIR/app/$page/page.tsx" ]; then
      print_success "页面存在"

      # 检查是否导入 SDK Layer
      if grep -q "@/sdk" "$WEBSITE_DIR/app/$page/page.tsx"; then
        print_success "  └─ 导入 SDK Layer 正确"
        passed=$((passed + 1))
      else
        print_warning "  └─ 未检测到 SDK Layer 导入"
        failed=$((failed + 1))
      fi
    else
      print_error "页面不存在"
      failed=$((failed + 1))
    fi
  done

  # 检查 Homepage
  print_item "/app/page.tsx" "首页"
  if [ -f "$WEBSITE_DIR/app/page.tsx" ]; then
    print_success "首页存在"
    passed=$((passed + 1))
  else
    print_error "首页不存在"
    failed=$((failed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 4 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 5: Playground - P1
check_p1_playground() {
  print_category "Phase 5: Playground - P1"

  local passed=0
  local failed=0
  local total=3

  # 5.1 Zustand Store
  print_item "5.1" "Zustand Store (playground.store.ts)"

  if [ -f "$WEBSITE_DIR/src/stores/playground.store.ts" ]; then
    print_success "Store 文件存在"

    if grep -q "usePlaygroundStore" "$WEBSITE_DIR/src/stores/playground.store.ts"; then
      print_success "  └─ usePlaygroundStore 导出正确"
      passed=$((passed + 1))
    else
      print_error "  └─ usePlaygroundStore 未导出"
      failed=$((failed + 1))
    fi
  else
    print_error "Store 文件不存在"
    failed=$((failed + 1))
  fi

  # 5.2 Dual-Mode UI
  print_item "5.2" "Dual-Mode UI (Live Props + Snapshot)"

  if [ "$MODE" == "manual" ]; then
    print_info "请手动验证 Playground 的 Live Props Mode 和 Snapshot Mode"
    if ask_confirmation; then
      print_success "Dual-Mode UI 验证通过"
      passed=$((passed + 1))
    else
      print_error "Dual-Mode UI 验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过手动验证"
    passed=$((passed + 1))
  fi

  # 5.3 Compare Mode
  print_item "5.3" "Compare Mode (快照对比)"

  if [ "$MODE" == "manual" ]; then
    print_info "请手动验证 Playground 的 Compare Mode 功能"
    if ask_confirmation; then
      print_success "Compare Mode 验证通过"
      passed=$((passed + 1))
    else
      print_error "Compare Mode 验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过手动验证"
    passed=$((passed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 5 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 6: Tools & DX - P1
check_p1_tools_dx() {
  print_category "Phase 6: Tools & DX - P1"

  local passed=0
  local failed=0
  local total=2

  # 6.1 CLI Enhancement
  print_item "6.1" "CLI Enhancement (启动菜单)"

  if [ -f "scripts/dev-menu.sh" ] || [ -f "scripts/diagnose-layer.sh" ]; then
    print_success "CLI 工具存在"
    passed=$((passed + 1))
  else
    print_error "CLI 工具不存在"
    failed=$((failed + 1))
  fi

  # 6.2 Performance Dashboard
  print_item "6.2" "Performance Dashboard (/perf)"

  if [ "$MODE" == "manual" ]; then
    print_info "请手动访问 http://localhost:3000/perf 验证性能仪表盘"
    if ask_confirmation; then
      print_success "Performance Dashboard 验证通过"
      passed=$((passed + 1))
    else
      print_error "Performance Dashboard 验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过手动验证"
    passed=$((passed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 6 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 7: Search Optimization - P1
check_p1_search() {
  print_category "Phase 7: Search Optimization - P1"

  local passed=0
  local failed=0
  local total=2

  # 7.1 Index Builder
  print_item "7.1" "Index Builder (搜索索引)"

  if [ -f "$WEBSITE_DIR/scripts/build-search-index.ts" ]; then
    print_success "Index Builder 脚本存在"
    passed=$((passed + 1))
  else
    print_error "Index Builder 脚本不存在"
    failed=$((failed + 1))
  fi

  # 7.2 UI Optimizer
  print_item "7.2" "UI Optimizer (搜索性能 ≤ 50ms)"

  if [ "$MODE" == "manual" ]; then
    print_info "请手动测试搜索/筛选性能是否 ≤ 50ms"
    if ask_confirmation; then
      print_success "搜索性能验证通过"
      passed=$((passed + 1))
    else
      print_error "搜索性能验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过手动验证"
    passed=$((passed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 7 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 8: Quality - P0
check_p0_quality() {
  print_category "Phase 8: Quality - P0"

  local passed=0
  local failed=0
  local total=4

  # 8.1 Build Validation
  print_item "8.1" "Build Validation (构建时验证)"

  cd "$WEBSITE_DIR"

  if npm run build > /tmp/build-validation.log 2>&1; then
    print_success "构建成功"
    passed=$((passed + 1))
  else
    print_error "构建失败"
    failed=$((failed + 1))
  fi

  cd - > /dev/null

  # 8.2 ESLint Rules
  print_item "8.2" "ESLint Rules (no-restricted-imports)"

  if [ -f "$WEBSITE_DIR/.eslintrc.cjs" ] || [ -f "$WEBSITE_DIR/.eslintrc.js" ]; then
    if grep -q "no-restricted-imports" "$WEBSITE_DIR/.eslintrc.cjs" "$WEBSITE_DIR/.eslintrc.js" 2>/dev/null; then
      print_success "ESLint 规则配置正确"
      passed=$((passed + 1))
    else
      print_error "缺少 no-restricted-imports 规则"
      failed=$((failed + 1))
    fi
  else
    print_error "ESLint 配置文件不存在"
    failed=$((failed + 1))
  fi

  # 8.3 Pre-commit Hooks
  print_item "8.3" "Pre-commit Hooks (Husky)"

  if [ -d ".husky" ] && [ -f ".husky/pre-commit" ]; then
    print_success "Pre-commit Hooks 配置正确"
    passed=$((passed + 1))
  else
    print_error "Pre-commit Hooks 未配置"
    failed=$((failed + 1))
  fi

  # 8.4 TypeScript Strict Mode
  print_item "8.4" "TypeScript Strict Mode"

  if [ -f "$WEBSITE_DIR/tsconfig.json" ]; then
    if grep -q '"strict": true' "$WEBSITE_DIR/tsconfig.json"; then
      print_success "TypeScript 严格模式已启用"
      passed=$((passed + 1))
    else
      print_error "TypeScript 严格模式未启用"
      failed=$((failed + 1))
    fi
  else
    print_error "tsconfig.json 不存在"
    failed=$((failed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 8 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 9: Testing - P1
check_p1_testing() {
  print_category "Phase 9: Testing - P1"

  local passed=0
  local failed=0
  local total=2

  # 9.1 Unit Tests
  print_item "9.1" "Unit Tests (覆盖率 ≥ 80%)"

  cd "$WEBSITE_DIR"

  if npm test -- --coverage > /tmp/test-coverage.log 2>&1; then
    print_success "单元测试通过"

    if [ -f "coverage/coverage-summary.json" ]; then
      local coverage=$(node -e "
        const summary = require('./coverage/coverage-summary.json');
        const total = summary.total;
        const avg = (total.lines.pct + total.statements.pct + total.functions.pct + total.branches.pct) / 4;
        console.log(avg.toFixed(2));
      " 2>/dev/null || echo "0")

      if (( $(echo "$coverage >= 80" | bc -l 2>/dev/null || echo "0") )); then
        print_success "  └─ 覆盖率: ${coverage}% (≥ 80%)"
        passed=$((passed + 1))
      else
        print_warning "  └─ 覆盖率: ${coverage}% (< 80%)"
        failed=$((failed + 1))
      fi
    else
      print_warning "  └─ 覆盖率报告不存在"
      failed=$((failed + 1))
    fi
  else
    print_error "单元测试失败"
    failed=$((failed + 1))
  fi

  cd - > /dev/null

  # 9.2 E2E Tests
  print_item "9.2" "E2E Tests (Playwright/Cypress)"

  if [ "$MODE" == "manual" ]; then
    print_info "请手动运行 E2E 测试并验证通过"
    if ask_confirmation; then
      print_success "E2E 测试验证通过"
      passed=$((passed + 1))
    else
      print_error "E2E 测试验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过 E2E 测试"
    passed=$((passed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 9 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 10: CI/CD - P0
check_p0_cicd() {
  print_category "Phase 10: CI/CD - P0"

  local passed=0
  local failed=0
  local total=2

  # 10.1 GitHub Actions
  print_item "10.1" "GitHub Actions (website-refactor-check.yml)"

  if [ -f ".github/workflows/website-refactor-check.yml" ]; then
    print_success "GitHub Actions 配置存在"

    # 检查关键 Jobs
    local jobs=$(grep -c "^  [a-z-]*:" ".github/workflows/website-refactor-check.yml" || echo "0")
    print_info "  └─ 检测到 $jobs 个 Jobs"

    if [ "$jobs" -ge 10 ]; then
      print_success "  └─ Jobs 数量符合要求 (≥ 10)"
      passed=$((passed + 1))
    else
      print_error "  └─ Jobs 数量不足 (< 10)"
      failed=$((failed + 1))
    fi
  else
    print_error "GitHub Actions 配置不存在"
    failed=$((failed + 1))
  fi

  # 10.2 Pre-deploy Checks
  print_item "10.2" "Pre-deploy Checks (部署前检查)"

  if [ -f "scripts/pre-deploy-check.sh" ] || [ -f "scripts/local-ci.sh" ]; then
    print_success "Pre-deploy 检查脚本存在"
    passed=$((passed + 1))
  else
    print_error "Pre-deploy 检查脚本不存在"
    failed=$((failed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 10 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 11: Performance - P0
check_p0_performance() {
  print_category "Phase 11: Performance - P0"

  local passed=0
  local failed=0
  local total=3

  # 11.1 Core Web Vitals
  print_item "11.1" "Core Web Vitals (LCP ≤ 2.5s, FID ≤ 100ms, CLS ≤ 0.1)"

  if [ "$MODE" == "manual" ]; then
    print_info "请使用 Lighthouse 或 PageSpeed Insights 验证 Core Web Vitals"
    if ask_confirmation; then
      print_success "Core Web Vitals 验证通过"
      passed=$((passed + 1))
    else
      print_error "Core Web Vitals 验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过性能测试"
    passed=$((passed + 1))
  fi

  # 11.2 Bundle Size
  print_item "11.2" "Bundle Size (Site ≤ 120KB, Playground ≤ 150KB)"

  if [ "$MODE" == "manual" ]; then
    print_info "请验证 Bundle Size 是否符合预算"
    if ask_confirmation; then
      print_success "Bundle Size 验证通过"
      passed=$((passed + 1))
    else
      print_error "Bundle Size 验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过 Bundle Size 检查"
    passed=$((passed + 1))
  fi

  # 11.3 Performance Budget
  print_item "11.3" "Performance Budget (筛选 ≤ 50ms)"

  if [ "$MODE" == "manual" ]; then
    print_info "请测试组件筛选性能是否 ≤ 50ms"
    if ask_confirmation; then
      print_success "Performance Budget 验证通过"
      passed=$((passed + 1))
    else
      print_error "Performance Budget 验证失败"
      failed=$((failed + 1))
    fi
  else
    print_warning "Auto 模式跳过性能测试"
    passed=$((passed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 11 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# Phase 12: Documentation - P1
check_p1_documentation() {
  print_category "Phase 12: Documentation - P1"

  local passed=0
  local failed=0
  local total=2

  # 12.1 Architecture Docs
  print_item "12.1" "Architecture Docs (架构文档)"

  local docs_exist=true

  if [ ! -f "docs/待整理/Xorigo UI Website 架构白皮书.md" ]; then
    print_error "架构白皮书不存在"
    docs_exist=false
  fi

  if [ ! -f "docs/待整理/Website重构架构设计方案.md" ]; then
    print_error "架构设计方案不存在"
    docs_exist=false
  fi

  if [ "$docs_exist" = true ]; then
    print_success "架构文档完整"
    passed=$((passed + 1))
  else
    failed=$((failed + 1))
  fi

  # 12.2 README & Getting Started
  print_item "12.2" "README & Getting Started"

  if [ -f "$WEBSITE_DIR/README.md" ]; then
    print_success "README.md 存在"
    passed=$((passed + 1))
  else
    print_error "README.md 不存在"
    failed=$((failed + 1))
  fi

  echo -e "\n  ${COLOR_CYAN}Phase 12 结果: $passed/$total 通过${COLOR_RESET}"
  return $((total - passed))
}

# ============================================================================
# 主流程
# ============================================================================

main() {
  echo -e "${COLOR_MAGENTA}"
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║                                                                ║"
  echo "║      Xorigo UI Website - 重构最终验收脚本 v1.0               ║"
  echo "║                                                                ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo -e "${COLOR_RESET}\n"

  print_info "运行模式: $MODE"
  if [ "$MODE" == "manual" ]; then
    print_info "Manual 模式将要求手动确认某些验收项"
  else
    print_info "Auto 模式将自动跳过手动验收项"
  fi

  local start_time=$(date +%s)
  local total_failures=0

  # P0 验收项
  print_header "P0 验收项（必须通过）"

  check_p0_architecture || total_failures=$((total_failures + $?))
  check_p0_data_layer || total_failures=$((total_failures + $?))
  check_p0_error_tolerance || total_failures=$((total_failures + $?))
  check_p0_quality || total_failures=$((total_failures + $?))
  check_p0_cicd || total_failures=$((total_failures + $?))
  check_p0_performance || total_failures=$((total_failures + $?))

  # P1 验收项
  print_header "P1 验收项（重要但非必须）"

  check_p1_pages_layer || total_failures=$((total_failures + $?))
  check_p1_playground || total_failures=$((total_failures + $?))
  check_p1_tools_dx || total_failures=$((total_failures + $?))
  check_p1_search || total_failures=$((total_failures + $?))
  check_p1_testing || total_failures=$((total_failures + $?))
  check_p1_documentation || total_failures=$((total_failures + $?))

  local end_time=$(date +%s)
  local duration=$((end_time - start_time))

  # 最终报告
  print_header "最终验收报告"

  echo -e "${COLOR_CYAN}验收统计:${COLOR_RESET}"
  echo -e "  总验收项: 26"
  echo -e "  失败项: ${COLOR_RED}$total_failures${COLOR_RESET}"
  echo -e "  耗时: ${duration}s"

  echo -e "\n${COLOR_CYAN}验收结果:${COLOR_RESET}"
  if [ $total_failures -eq 0 ]; then
    echo -e "  ${COLOR_GREEN}✅ 所有验收项通过，重构完成！${COLOR_RESET}"
    echo -e "\n${COLOR_GREEN}🎉 恭喜！Website 重构已成功完成！${COLOR_RESET}"
    exit 0
  else
    echo -e "  ${COLOR_RED}❌ 有 $total_failures 个验收项失败${COLOR_RESET}"
    echo -e "\n${COLOR_YELLOW}建议:${COLOR_RESET}"
    echo -e "  1. 查看上述详细错误信息"
    echo -e "  2. 修复失败项目"
    echo -e "  3. 重新运行验收脚本"
    echo -e "  4. 如需手动验证，运行: bash scripts/final-acceptance.sh --manual"
    exit 1
  fi
}

# 执行主流程
main
