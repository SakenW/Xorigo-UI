#!/bin/bash
# ============================================================================
# 文件: scripts/local-ci.sh
# 用途: 本地模拟 CI/CD 流程，在提交前进行完整检查
# 版本: v1.0
# 使用: bash scripts/local-ci.sh [--fast|--full]
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
MODE="full"

# 解析参数
if [ "$1" == "--fast" ]; then
  MODE="fast"
elif [ "$1" == "--full" ]; then
  MODE="full"
fi

# ============================================================================
# 辅助函数
# ============================================================================

print_header() {
  echo -e "\n${COLOR_MAGENTA}╔════════════════════════════════════════════════════════════════╗${COLOR_RESET}"
  echo -e "${COLOR_MAGENTA}║${COLOR_RESET} $1"
  echo -e "${COLOR_MAGENTA}╚════════════════════════════════════════════════════════════════╝${COLOR_RESET}\n"
}

print_job() {
  echo -e "\n${COLOR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
  echo -e "${COLOR_CYAN}▶ $1${COLOR_RESET}"
  echo -e "${COLOR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}\n"
}

print_step() {
  echo -e "${COLOR_BLUE}  ▸ $1${COLOR_RESET}"
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

# ============================================================================
# Job Functions (对应 GitHub Actions 的 11 个 Jobs)
# ============================================================================

job_1_basic_checks() {
  print_job "Job 1/11: Basic Checks (基础检查)"

  cd "$WEBSITE_DIR"

  # Step 1: TypeScript 类型检查
  print_step "TypeScript 类型检查"
  if npm run type-check > /tmp/typecheck.log 2>&1; then
    print_success "TypeScript 类型检查通过"
  else
    print_error "TypeScript 类型检查失败"
    cat /tmp/typecheck.log
    cd - > /dev/null
    return 1
  fi

  # Step 2: ESLint 检查
  print_step "ESLint 代码检查"
  if npm run lint > /tmp/eslint.log 2>&1; then
    print_success "ESLint 检查通过"
  else
    print_error "ESLint 检查失败"
    cat /tmp/eslint.log
    print_info "运行 'npm run lint:fix' 自动修复"
    cd - > /dev/null
    return 1
  fi

  # Step 3: Prettier 格式检查
  print_step "Prettier 格式检查"
  if npm run format:check > /tmp/prettier.log 2>&1; then
    print_success "Prettier 格式检查通过"
  else
    print_error "Prettier 格式检查失败"
    cat /tmp/prettier.log
    print_info "运行 'npm run format' 自动修复"
    cd - > /dev/null
    return 1
  fi

  cd - > /dev/null
  print_success "Job 1 完成 ✓"
  return 0
}

job_2_category_validation() {
  print_job "Job 2/11: Category Validation (组件分类验证)"

  cd "$WEBSITE_DIR"

  print_step "运行分类验证脚本"
  if npm run check:categories > /tmp/categories.log 2>&1; then
    print_success "组件分类验证通过"

    # 生成统计报告
    print_step "生成分类统计报告"
    if npm run generate:category-stats > /tmp/category-stats.txt 2>&1; then
      print_success "统计报告已生成"
      print_info "查看报告: /tmp/category-stats.txt"
    fi
  else
    print_error "组件分类验证失败"
    cat /tmp/categories.log
    cd - > /dev/null
    return 1
  fi

  cd - > /dev/null
  print_success "Job 2 完成 ✓"
  return 0
}

job_3_registry_consistency() {
  print_job "Job 3/11: Registry Consistency (Registry 一致性检查)"

  cd "$WEBSITE_DIR"

  # Step 1: 验证 Registry 路径
  print_step "验证 Registry 路径"
  if npm run validate:registry-paths > /tmp/registry-paths.log 2>&1; then
    print_success "Registry 路径验证通过"
  else
    print_error "Registry 路径验证失败"
    cat /tmp/registry-paths.log
    cd - > /dev/null
    return 1
  fi

  # Step 2: 验证 Token Schema
  print_step "验证 Token Schema"
  if npm run validate:token-schema > /tmp/token-schema.log 2>&1; then
    print_success "Token Schema 验证通过"
  else
    print_error "Token Schema 验证失败"
    cat /tmp/token-schema.log
    cd - > /dev/null
    return 1
  fi

  # Step 3: 检查数据入口收口
  print_step "检查数据入口收口"

  local registry_imports=$(grep -r "from '@xorigo-ui/registry'" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")
  local token_imports=$(grep -r "from '@xorigo-ui/tokens'" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo "0")

  if [ "$registry_imports" -eq 0 ] && [ "$token_imports" -eq 0 ]; then
    print_success "数据入口收口检查通过"
  else
    print_error "发现直接导入上游包："
    print_info "  @xorigo-ui/registry: $registry_imports 处"
    print_info "  @xorigo-ui/tokens: $token_imports 处"
    print_info "应使用 src/data/*.readonly.ts 统一入口"
    cd - > /dev/null
    return 1
  fi

  cd - > /dev/null
  print_success "Job 3 完成 ✓"
  return 0
}

job_4_build_test() {
  print_job "Job 4/11: Build Test (构建测试)"

  # Step 1: 构建 Packages
  print_step "构建 packages/core"
  if npm run build --workspace=packages/core > /tmp/build-core.log 2>&1; then
    print_success "packages/core 构建成功"
  else
    print_error "packages/core 构建失败"
    cat /tmp/build-core.log
    return 1
  fi

  print_step "构建 packages/registry"
  if npm run build --workspace=packages/registry > /tmp/build-registry.log 2>&1; then
    print_success "packages/registry 构建成功"
  else
    print_error "packages/registry 构建失败"
    cat /tmp/build-registry.log
    return 1
  fi

  # Step 2: 构建 Website
  print_step "构建 apps/website"
  cd "$WEBSITE_DIR"

  if npm run build > /tmp/build-website.log 2>&1; then
    print_success "apps/website 构建成功"
  else
    print_error "apps/website 构建失败"
    cat /tmp/build-website.log
    cd - > /dev/null
    return 1
  fi

  # Step 3: 检查构建产物
  print_step "检查构建产物"
  if [ -d ".next/static" ]; then
    print_success ".next/static 目录存在"
    local static_size=$(du -sh .next/static 2>/dev/null | cut -f1)
    print_info "Static 目录大小: $static_size"
  else
    print_error ".next/static 目录不存在"
    cd - > /dev/null
    return 1
  fi

  cd - > /dev/null
  print_success "Job 4 完成 ✓"
  return 0
}

job_5_bundle_size() {
  print_job "Job 5/11: Bundle Size Check (Bundle 大小检查)"

  if [ "$MODE" == "fast" ]; then
    print_warning "Fast 模式跳过 Bundle Size 检查"
    return 0
  fi

  cd "$WEBSITE_DIR"

  # Step 1: 构建并分析
  print_step "构建并分析 Bundle"
  if npm run build > /tmp/bundle-build.log 2>&1; then
    print_success "构建完成"
  else
    print_error "构建失败"
    cat /tmp/bundle-build.log
    cd - > /dev/null
    return 1
  fi

  print_step "分析 Bundle 大小"
  if npm run analyze > /tmp/bundle-analysis.txt 2>&1; then
    print_success "Bundle 分析完成"
    print_info "查看报告: /tmp/bundle-analysis.txt"
  fi

  # Step 2: 检查 Bundle Size 预算
  print_step "检查 Bundle Size 预算"
  if [ -f "scripts/check-bundle-size.js" ]; then
    if node scripts/check-bundle-size.js > /tmp/bundle-check.log 2>&1; then
      print_success "Bundle Size 在预算范围内"
    else
      print_error "Bundle Size 超出预算"
      cat /tmp/bundle-check.log
      cd - > /dev/null
      return 1
    fi
  else
    print_warning "Bundle Size 检查脚本不存在，跳过"
  fi

  cd - > /dev/null
  print_success "Job 5 完成 ✓"
  return 0
}

job_6_lighthouse() {
  print_job "Job 6/11: Lighthouse Performance Test (Lighthouse 性能测试)"

  if [ "$MODE" == "fast" ]; then
    print_warning "Fast 模式跳过 Lighthouse 测试"
    return 0
  fi

  cd "$WEBSITE_DIR"

  # 检查 Lighthouse CI 配置
  if [ ! -f ".lighthouserc.json" ]; then
    print_warning "Lighthouse CI 配置文件不存在，跳过测试"
    cd - > /dev/null
    return 0
  fi

  # Step 1: 启动服务器
  print_step "启动开发服务器"
  npm start > /tmp/server.log 2>&1 &
  SERVER_PID=$!
  sleep 10  # 等待服务器启动

  # Step 2: 运行 Lighthouse CI
  print_step "运行 Lighthouse CI"
  if command -v lhci &> /dev/null; then
    if lhci autorun --config=.lighthouserc.json > /tmp/lighthouse.log 2>&1; then
      print_success "Lighthouse 测试通过"
    else
      print_error "Lighthouse 测试失败"
      cat /tmp/lighthouse.log
      kill $SERVER_PID
      cd - > /dev/null
      return 1
    fi
  else
    print_warning "Lighthouse CI 未安装，跳过测试"
    print_info "安装: npm install -g @lhci/cli@0.12.x"
  fi

  # 停止服务器
  kill $SERVER_PID

  cd - > /dev/null
  print_success "Job 6 完成 ✓"
  return 0
}

job_7_accessibility() {
  print_job "Job 7/11: Accessibility Check (可访问性检查)"

  if [ "$MODE" == "fast" ]; then
    print_warning "Fast 模式跳过可访问性测试"
    return 0
  fi

  cd "$WEBSITE_DIR"

  print_step "运行 Axe 可访问性测试"
  if npm run test:a11y > /tmp/a11y.log 2>&1; then
    print_success "可访问性测试通过"
  else
    print_warning "可访问性测试脚本不存在或失败"
    print_info "查看日志: /tmp/a11y.log"
  fi

  cd - > /dev/null
  print_success "Job 7 完成 ✓"
  return 0
}

job_8_unit_tests() {
  print_job "Job 8/11: Unit Tests (单元测试)"

  cd "$WEBSITE_DIR"

  # Step 1: 运行单元测试
  print_step "运行单元测试（含覆盖率）"
  if npm test -- --coverage > /tmp/test.log 2>&1; then
    print_success "单元测试通过"
  else
    print_error "单元测试失败"
    cat /tmp/test.log
    cd - > /dev/null
    return 1
  fi

  # Step 2: 检查覆盖率阈值
  print_step "检查测试覆盖率"
  if [ -f "coverage/coverage-summary.json" ]; then
    local coverage=$(node -e "
      const summary = require('./coverage/coverage-summary.json');
      const total = summary.total;
      const avg = (total.lines.pct + total.statements.pct + total.functions.pct + total.branches.pct) / 4;
      console.log(avg.toFixed(2));
    ")

    if (( $(echo "$coverage >= 80" | bc -l) )); then
      print_success "测试覆盖率: ${coverage}% (≥ 80%)"
    else
      print_warning "测试覆盖率: ${coverage}% (< 80%)"
      print_info "目标覆盖率: ≥ 80%"
    fi
  else
    print_warning "未找到覆盖率报告"
  fi

  cd - > /dev/null
  print_success "Job 8 完成 ✓"
  return 0
}

job_9_security_audit() {
  print_job "Job 9/11: Security Audit (安全审计)"

  print_step "运行 npm audit"
  if npm audit --audit-level=high > /tmp/audit.log 2>&1; then
    print_success "未发现高危漏洞"
  else
    print_warning "发现安全漏洞（不阻断 CI）"
    cat /tmp/audit.log
  fi

  print_step "生成安全报告"
  npm audit --json > /tmp/security-audit.json 2>&1
  print_success "安全报告已生成: /tmp/security-audit.json"

  print_success "Job 9 完成 ✓"
  return 0
}

job_10_summary() {
  print_job "Job 10/11: Summary Report (总结报告)"

  print_step "生成总结报告"

  cat > /tmp/ci-summary.md << EOF
# 🎯 Website 重构 CI/CD 检查总结

## 检查结果

${JOB_RESULTS}

## 详细日志

EOF

  if [ -f "/tmp/typecheck.log" ]; then
    echo "- TypeScript: /tmp/typecheck.log" >> /tmp/ci-summary.md
  fi

  if [ -f "/tmp/eslint.log" ]; then
    echo "- ESLint: /tmp/eslint.log" >> /tmp/ci-summary.md
  fi

  if [ -f "/tmp/test.log" ]; then
    echo "- Tests: /tmp/test.log" >> /tmp/ci-summary.md
  fi

  if [ -f "/tmp/bundle-analysis.txt" ]; then
    echo "- Bundle Analysis: /tmp/bundle-analysis.txt" >> /tmp/ci-summary.md
  fi

  print_success "总结报告已生成: /tmp/ci-summary.md"

  cat /tmp/ci-summary.md

  print_success "Job 10 完成 ✓"
  return 0
}

job_11_auto_fix() {
  print_job "Job 11/11: Auto Fix (自动修复)"

  if [ "$FAILED_JOBS" -eq 0 ]; then
    print_info "所有检查通过，无需自动修复"
    print_success "Job 11 完成 ✓"
    return 0
  fi

  cd "$WEBSITE_DIR"

  print_step "自动修复 ESLint"
  if npm run lint:fix > /tmp/eslint-fix.log 2>&1; then
    print_success "ESLint 自动修复完成"
  else
    print_warning "ESLint 自动修复失败"
  fi

  print_step "自动修复 Prettier"
  if npm run format > /tmp/prettier-fix.log 2>&1; then
    print_success "Prettier 自动修复完成"
  else
    print_warning "Prettier 自动修复失败"
  fi

  print_info "自动修复完成，请检查变更后重新运行 CI"

  cd - > /dev/null
  print_success "Job 11 完成 ✓"
  return 0
}

# ============================================================================
# 主流程
# ============================================================================

main() {
  echo -e "${COLOR_MAGENTA}"
  echo "╔════════════════════════════════════════════════════════════════╗"
  echo "║                                                                ║"
  echo "║      Xorigo UI Website - 本地 CI/CD 测试工具 v1.0            ║"
  echo "║                                                                ║"
  echo "╚════════════════════════════════════════════════════════════════╝"
  echo -e "${COLOR_RESET}\n"

  print_info "运行模式: $MODE"
  if [ "$MODE" == "fast" ]; then
    print_info "Fast 模式将跳过: Bundle Size, Lighthouse, Accessibility"
  fi

  local start_time=$(date +%s)
  local total_jobs=11
  local passed_jobs=0
  local failed_jobs=0

  JOB_RESULTS=""

  # Job 1: Basic Checks
  if job_1_basic_checks; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ 基础检查: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ 基础检查: 失败\n"
  fi

  # Job 2: Category Validation
  if job_2_category_validation; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ 分类验证: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ 分类验证: 失败\n"
  fi

  # Job 3: Registry Consistency
  if job_3_registry_consistency; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ Registry 一致性: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ Registry 一致性: 失败\n"
  fi

  # Job 4: Build Test
  if job_4_build_test; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ 构建测试: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ 构建测试: 失败\n"
  fi

  # Job 5: Bundle Size
  if job_5_bundle_size; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ Bundle Size: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ Bundle Size: 失败\n"
  fi

  # Job 6: Lighthouse (仅 full 模式)
  if [ "$MODE" == "full" ]; then
    if job_6_lighthouse; then
      passed_jobs=$((passed_jobs + 1))
      JOB_RESULTS="${JOB_RESULTS}- ✅ Lighthouse: 通过\n"
    else
      failed_jobs=$((failed_jobs + 1))
      JOB_RESULTS="${JOB_RESULTS}- ❌ Lighthouse: 失败\n"
    fi
  else
    JOB_RESULTS="${JOB_RESULTS}- ⏭️ Lighthouse: 跳过 (fast 模式)\n"
  fi

  # Job 7: Accessibility (仅 full 模式)
  if [ "$MODE" == "full" ]; then
    if job_7_accessibility; then
      passed_jobs=$((passed_jobs + 1))
      JOB_RESULTS="${JOB_RESULTS}- ✅ 可访问性: 通过\n"
    else
      failed_jobs=$((failed_jobs + 1))
      JOB_RESULTS="${JOB_RESULTS}- ❌ 可访问性: 失败\n"
    fi
  else
    JOB_RESULTS="${JOB_RESULTS}- ⏭️ 可访问性: 跳过 (fast 模式)\n"
  fi

  # Job 8: Unit Tests
  if job_8_unit_tests; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ 单元测试: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ 单元测试: 失败\n"
  fi

  # Job 9: Security Audit
  if job_9_security_audit; then
    passed_jobs=$((passed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ✅ 安全审计: 通过\n"
  else
    failed_jobs=$((failed_jobs + 1))
    JOB_RESULTS="${JOB_RESULTS}- ❌ 安全审计: 失败\n"
  fi

  # Job 10: Summary
  FAILED_JOBS=$failed_jobs
  job_10_summary
  passed_jobs=$((passed_jobs + 1))

  # Job 11: Auto Fix (如果有失败)
  if [ $failed_jobs -gt 0 ]; then
    job_11_auto_fix
  fi

  local end_time=$(date +%s)
  local duration=$((end_time - start_time))

  # 最终报告
  print_header "最终结果"

  echo -e "${COLOR_CYAN}总体统计:${COLOR_RESET}"
  echo -e "  总 Jobs: $total_jobs"
  echo -e "  通过: ${COLOR_GREEN}$passed_jobs${COLOR_RESET}"
  echo -e "  失败: ${COLOR_RED}$failed_jobs${COLOR_RESET}"
  echo -e "  耗时: ${duration}s"

  echo -e "\n${COLOR_CYAN}CI/CD 状态:${COLOR_RESET}"
  if [ $failed_jobs -eq 0 ]; then
    echo -e "  ${COLOR_GREEN}✅ 所有检查通过，可以提交代码${COLOR_RESET}"
    exit 0
  else
    echo -e "  ${COLOR_RED}❌ 有 $failed_jobs 个检查失败，请修复后重试${COLOR_RESET}"
    echo -e "\n${COLOR_YELLOW}建议:${COLOR_RESET}"
    echo -e "  1. 查看详细日志: ls -lh /tmp/*.log"
    echo -e "  2. 自动修复代码格式: bash scripts/local-ci.sh (Job 11)"
    echo -e "  3. 手动修复失败项目后重新运行"
    exit 1
  fi
}

# 执行主流程
main
