#!/bin/bash
# ============================================================================
# 文件: scripts/diagnose-layer.sh
# 用途: Xorigo UI Website 分层架构诊断工具
# 版本: v1.0
# 使用: bash scripts/diagnose-layer.sh [--fix]
# ============================================================================

set -e

COLOR_RESET="\033[0m"
COLOR_RED="\033[31m"
COLOR_GREEN="\033[32m"
COLOR_YELLOW="\033[33m"
COLOR_BLUE="\033[34m"
COLOR_CYAN="\033[36m"

WEBSITE_DIR="apps/website"
FIX_MODE=false

# 解析参数
if [ "$1" == "--fix" ]; then
  FIX_MODE=true
fi

# ============================================================================
# 辅助函数
# ============================================================================

print_header() {
  echo -e "\n${COLOR_CYAN}========================================${COLOR_RESET}"
  echo -e "${COLOR_CYAN}$1${COLOR_RESET}"
  echo -e "${COLOR_CYAN}========================================${COLOR_RESET}\n"
}

print_success() {
  echo -e "${COLOR_GREEN}✅ $1${COLOR_RESET}"
}

print_error() {
  echo -e "${COLOR_RED}❌ $1${COLOR_RESET}"
}

print_warning() {
  echo -e "${COLOR_YELLOW}⚠️  $1${COLOR_RESET}"
}

print_info() {
  echo -e "${COLOR_BLUE}ℹ️  $1${COLOR_RESET}"
}

# ============================================================================
# 诊断函数
# ============================================================================

check_layer_1_packages() {
  print_header "Layer 1: Packages (上游源)"

  # 检查 packages/core 是否存在
  if [ -d "packages/core" ]; then
    print_success "packages/core 存在"
  else
    print_error "packages/core 不存在"
    return 1
  fi

  # 检查 packages/registry 是否存在
  if [ -d "packages/registry" ]; then
    print_success "packages/registry 存在"
  else
    print_error "packages/registry 不存在"
    return 1
  fi

  # 检查 packages/tokens 是否存在
  if [ -d "packages/tokens" ]; then
    print_success "packages/tokens 存在"
  else
    print_error "packages/tokens 不存在"
    return 1
  fi

  # 检查构建产物
  local has_build_issues=false

  if [ ! -d "packages/core/dist" ]; then
    print_warning "packages/core/dist 不存在（需要构建）"
    has_build_issues=true
  else
    print_success "packages/core/dist 存在"
  fi

  if [ ! -d "packages/registry/dist" ]; then
    print_warning "packages/registry/dist 不存在（需要构建）"
    has_build_issues=true
  else
    print_success "packages/registry/dist 存在"
  fi

  if [ "$has_build_issues" = true ]; then
    if [ "$FIX_MODE" = true ]; then
      print_info "正在构建上游包..."
      npm run build --workspace=packages/core
      npm run build --workspace=packages/registry
      print_success "上游包构建完成"
    else
      print_warning "运行 'bash scripts/diagnose-layer.sh --fix' 自动构建"
    fi
  fi

  return 0
}

check_layer_2_data() {
  print_header "Layer 2: Data Layer (数据适配层)"

  local data_dir="$WEBSITE_DIR/src/data"
  local required_files=(
    "registry.readonly.ts"
    "tokens.readonly.ts"
    "recipes.readonly.ts"
    "i18n.readonly.ts"
  )

  local missing_files=()

  # 检查 Data Layer 目录
  if [ ! -d "$data_dir" ]; then
    print_error "Data Layer 目录不存在: $data_dir"

    if [ "$FIX_MODE" = true ]; then
      print_info "正在创建 Data Layer 目录..."
      mkdir -p "$data_dir"
      print_success "Data Layer 目录已创建"
    else
      return 1
    fi
  else
    print_success "Data Layer 目录存在"
  fi

  # 检查必需文件
  for file in "${required_files[@]}"; do
    if [ ! -f "$data_dir/$file" ]; then
      print_error "缺少文件: $file"
      missing_files+=("$file")
    else
      print_success "文件存在: $file"

      # 检查文件内容是否正确（简单检查是否导入上游包）
      if grep -q "@xorigo-ui" "$data_dir/$file"; then
        print_success "  └─ 导入上游包正确"
      else
        print_warning "  └─ 未检测到上游包导入"
      fi

      # 检查是否导出函数
      if grep -q "export" "$data_dir/$file"; then
        print_success "  └─ 导出接口正确"
      else
        print_error "  └─ 未检测到导出接口"
      fi
    fi
  done

  if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "缺少 ${#missing_files[@]} 个必需文件"

    if [ "$FIX_MODE" = true ]; then
      print_warning "自动修复 Data Layer 需要手动创建文件内容"
      print_info "请参考: docs/待整理/Website重构架构设计方案.md"
    fi

    return 1
  fi

  # 检查是否有直接导入上游包的情况（应该通过 Data Layer）
  print_info "检查数据入口收口..."

  local direct_imports=$(grep -r "from '@xorigo-ui/registry'" "$WEBSITE_DIR/src" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
  local token_imports=$(grep -r "from '@xorigo-ui/tokens'" "$WEBSITE_DIR/src" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)

  local total_violations=$((direct_imports + token_imports))

  if [ $total_violations -gt 0 ]; then
    print_error "发现 $total_violations 处直接导入上游包（违反数据收口原则）"
    print_info "  - @xorigo-ui/registry: $direct_imports 处"
    print_info "  - @xorigo-ui/tokens: $token_imports 处"

    if [ "$FIX_MODE" = true ]; then
      print_warning "自动修复需要手动替换导入路径"
      print_info "将 'from @xorigo-ui/registry' 替换为 'from @/data/registry.readonly'"
    fi

    return 1
  else
    print_success "数据入口收口检查通过（无直接导入）"
  fi

  return 0
}

check_layer_3_sdk() {
  print_header "Layer 3: SDK Layer (协议层)"

  local sdk_dir="$WEBSITE_DIR/src/sdk"
  local required_files=(
    "docs-client.ts"
    "playground-client.ts"
    "search-client.ts"
  )

  local missing_files=()

  # 检查 SDK Layer 目录
  if [ ! -d "$sdk_dir" ]; then
    print_error "SDK Layer 目录不存在: $sdk_dir"

    if [ "$FIX_MODE" = true ]; then
      print_info "正在创建 SDK Layer 目录..."
      mkdir -p "$sdk_dir"
      print_success "SDK Layer 目录已创建"
    else
      return 1
    fi
  else
    print_success "SDK Layer 目录存在"
  fi

  # 检查必需文件
  for file in "${required_files[@]}"; do
    if [ ! -f "$sdk_dir/$file" ]; then
      print_error "缺少文件: $file"
      missing_files+=("$file")
    else
      print_success "文件存在: $file"

      # 检查是否使用 'use client' 指令（Client Component SDK）
      if [[ "$file" == *-client.ts ]]; then
        if grep -q "'use client'" "$sdk_dir/$file" || grep -q '"use client"' "$sdk_dir/$file"; then
          print_success "  └─ 'use client' 指令正确"
        else
          print_warning "  └─ 缺少 'use client' 指令"
        fi
      fi

      # 检查是否导入 Data Layer
      if grep -q "@/data" "$sdk_dir/$file"; then
        print_success "  └─ 导入 Data Layer 正确"
      else
        print_warning "  └─ 未检测到 Data Layer 导入"
      fi
    fi
  done

  if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "缺少 ${#missing_files[@]} 个必需文件"

    if [ "$FIX_MODE" = true ]; then
      print_warning "自动修复 SDK Layer 需要手动创建文件内容"
      print_info "请参考: docs/待整理/Website重构架构设计方案.md"
    fi

    return 1
  fi

  return 0
}

check_layer_4_app() {
  print_header "Layer 4: App Layer (应用层)"

  local app_dir="$WEBSITE_DIR/app"

  # 检查 App 目录
  if [ ! -d "$app_dir" ]; then
    print_error "App Layer 目录不存在: $app_dir"
    return 1
  else
    print_success "App Layer 目录存在"
  fi

  # 检查关键路由
  local routes=(
    "docs"
    "adoption"
    "tokens"
    "playground"
  )

  for route in "${routes[@]}"; do
    if [ -d "$app_dir/$route" ]; then
      print_success "路由存在: /$route"

      # 检查 page.tsx 是否存在
      if [ -f "$app_dir/$route/page.tsx" ]; then
        print_success "  └─ page.tsx 存在"

        # 检查是否导入 SDK Layer
        if grep -q "@/sdk" "$app_dir/$route/page.tsx"; then
          print_success "  └─ 导入 SDK Layer 正确"
        else
          print_warning "  └─ 未检测到 SDK Layer 导入"
        fi

        # 检查 Playground 是否使用 'use client'
        if [ "$route" == "playground" ]; then
          if grep -q "'use client'" "$app_dir/$route/page.tsx" || grep -q '"use client"' "$app_dir/$route/page.tsx"; then
            print_success "  └─ 'use client' 指令正确"
          else
            print_error "  └─ Playground 必须是 Client Component"
          fi
        fi
      else
        print_error "  └─ page.tsx 不存在"
      fi
    else
      print_error "路由不存在: /$route"
    fi
  done

  # 检查 ErrorBoundary
  print_info "检查 ErrorBoundary..."

  local boundaries=(
    "app/error.tsx"
    "app/playground/error.tsx"
    "components/MDXErrorBoundary.tsx"
  )

  local missing_boundaries=0

  for boundary in "${boundaries[@]}"; do
    if [ -f "$WEBSITE_DIR/$boundary" ]; then
      print_success "ErrorBoundary 存在: $boundary"
    else
      print_error "ErrorBoundary 缺失: $boundary"
      missing_boundaries=$((missing_boundaries + 1))
    fi
  done

  if [ $missing_boundaries -gt 0 ]; then
    if [ "$FIX_MODE" = true ]; then
      print_warning "自动修复 ErrorBoundary 需要手动创建"
      print_info "请参考: docs/待整理/Website重构架构设计方案.md"
    fi
  fi

  return 0
}

check_typescript() {
  print_header "TypeScript 类型检查"

  cd "$WEBSITE_DIR"

  if npm run type-check > /dev/null 2>&1; then
    print_success "TypeScript 类型检查通过"
    return 0
  else
    print_error "TypeScript 类型检查失败"
    print_info "运行 'cd $WEBSITE_DIR && npm run type-check' 查看详细错误"

    if [ "$FIX_MODE" = true ]; then
      print_warning "TypeScript 错误需要手动修复"
    fi

    cd - > /dev/null
    return 1
  fi

  cd - > /dev/null
}

check_eslint() {
  print_header "ESLint 代码检查"

  cd "$WEBSITE_DIR"

  if npm run lint > /dev/null 2>&1; then
    print_success "ESLint 检查通过"
    return 0
  else
    print_error "ESLint 检查失败"

    if [ "$FIX_MODE" = true ]; then
      print_info "正在自动修复 ESLint 错误..."
      npm run lint:fix
      print_success "ESLint 自动修复完成"
    else
      print_info "运行 'bash scripts/diagnose-layer.sh --fix' 自动修复"
    fi

    cd - > /dev/null
    return 1
  fi

  cd - > /dev/null
}

generate_report() {
  print_header "诊断报告"

  echo -e "${COLOR_CYAN}架构层次检查:${COLOR_RESET}"
  echo -e "  Layer 1 (Packages):   ${LAYER_1_STATUS}"
  echo -e "  Layer 2 (Data):       ${LAYER_2_STATUS}"
  echo -e "  Layer 3 (SDK):        ${LAYER_3_STATUS}"
  echo -e "  Layer 4 (App):        ${LAYER_4_STATUS}"

  echo -e "\n${COLOR_CYAN}代码质量检查:${COLOR_RESET}"
  echo -e "  TypeScript:           ${TYPESCRIPT_STATUS}"
  echo -e "  ESLint:               ${ESLINT_STATUS}"

  echo -e "\n${COLOR_CYAN}总体评分:${COLOR_RESET}"

  local total_checks=6
  local passed_checks=0

  [ "$LAYER_1_STATUS" == "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] && passed_checks=$((passed_checks + 1))
  [ "$LAYER_2_STATUS" == "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] && passed_checks=$((passed_checks + 1))
  [ "$LAYER_3_STATUS" == "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] && passed_checks=$((passed_checks + 1))
  [ "$LAYER_4_STATUS" == "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] && passed_checks=$((passed_checks + 1))
  [ "$TYPESCRIPT_STATUS" == "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] && passed_checks=$((passed_checks + 1))
  [ "$ESLINT_STATUS" == "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] && passed_checks=$((passed_checks + 1))

  local score=$((passed_checks * 100 / total_checks))

  if [ $score -ge 80 ]; then
    echo -e "  ${COLOR_GREEN}${score}/100 - 优秀${COLOR_RESET}"
  elif [ $score -ge 60 ]; then
    echo -e "  ${COLOR_YELLOW}${score}/100 - 良好${COLOR_RESET}"
  else
    echo -e "  ${COLOR_RED}${score}/100 - 需要改进${COLOR_RESET}"
  fi

  echo -e "\n${COLOR_CYAN}建议:${COLOR_RESET}"

  if [ "$LAYER_2_STATUS" != "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ]; then
    echo -e "  1. 创建 Data Layer 适配器文件"
    echo -e "     参考: docs/待整理/Website重构架构设计方案.md (Phase 1)"
  fi

  if [ "$LAYER_3_STATUS" != "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ]; then
    echo -e "  2. 创建 SDK Layer 协议文件"
    echo -e "     参考: docs/待整理/Website重构架构设计方案.md (Phase 1)"
  fi

  if [ "$LAYER_4_STATUS" != "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ]; then
    echo -e "  3. 完善 ErrorBoundary 和页面路由"
    echo -e "     参考: docs/待整理/Website重构架构设计方案.md (Phase 2)"
  fi

  if [ "$TYPESCRIPT_STATUS" != "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ] || [ "$ESLINT_STATUS" != "${COLOR_GREEN}✅ PASS${COLOR_RESET}" ]; then
    echo -e "  4. 修复代码质量问题"
    echo -e "     运行: bash scripts/diagnose-layer.sh --fix"
  fi

  echo ""
}

# ============================================================================
# 主流程
# ============================================================================

main() {
  echo -e "${COLOR_CYAN}"
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║                                                                ║"
  echo "║      Xorigo UI Website - 分层架构诊断工具 v1.0               ║"
  echo "║                                                                ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo -e "${COLOR_RESET}\n"

  if [ "$FIX_MODE" = true ]; then
    print_info "运行模式: 自动修复"
  else
    print_info "运行模式: 仅诊断（使用 --fix 参数启用自动修复）"
  fi

  # Layer 1: Packages
  if check_layer_1_packages; then
    LAYER_1_STATUS="${COLOR_GREEN}✅ PASS${COLOR_RESET}"
  else
    LAYER_1_STATUS="${COLOR_RED}❌ FAIL${COLOR_RESET}"
  fi

  # Layer 2: Data Layer
  if check_layer_2_data; then
    LAYER_2_STATUS="${COLOR_GREEN}✅ PASS${COLOR_RESET}"
  else
    LAYER_2_STATUS="${COLOR_RED}❌ FAIL${COLOR_RESET}"
  fi

  # Layer 3: SDK Layer
  if check_layer_3_sdk; then
    LAYER_3_STATUS="${COLOR_GREEN}✅ PASS${COLOR_RESET}"
  else
    LAYER_3_STATUS="${COLOR_RED}❌ FAIL${COLOR_RESET}"
  fi

  # Layer 4: App Layer
  if check_layer_4_app; then
    LAYER_4_STATUS="${COLOR_GREEN}✅ PASS${COLOR_RESET}"
  else
    LAYER_4_STATUS="${COLOR_RED}❌ FAIL${COLOR_RESET}"
  fi

  # TypeScript
  if check_typescript; then
    TYPESCRIPT_STATUS="${COLOR_GREEN}✅ PASS${COLOR_RESET}"
  else
    TYPESCRIPT_STATUS="${COLOR_RED}❌ FAIL${COLOR_RESET}"
  fi

  # ESLint
  if check_eslint; then
    ESLINT_STATUS="${COLOR_GREEN}✅ PASS${COLOR_RESET}"
  else
    ESLINT_STATUS="${COLOR_RED}❌ FAIL${COLOR_RESET}"
  fi

  # 生成报告
  generate_report

  print_info "诊断完成！"
}

# 执行主流程
main
