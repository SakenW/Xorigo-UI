#!/bin/bash

# TH-UI Hive-Mind 完整执行脚本
# 使用方法: ./EXECUTE_HIVE_MIND.sh

set -e

echo "🚀 TH-UI Hive-Mind 执行脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. 前置条件检查
echo ""
log_info "Step 1: 前置条件检查"
echo "========================="

# 检查当前目录
if [[ ! "$(pwd)" == *"TH-UI"* ]]; then
    log_error "请在 TH-UI 项目根目录执行此脚本"
    exit 1
fi
log_success "当前目录: $(pwd)"

# 检查关键文档
echo ""
echo "=== 检查核心文档 ==="
test -f docs/references/TECH_STACK.md && log_success "TECH_STACK.md 存在" || { log_error "缺少 TECH_STACK.md"; exit 1; }
test -f README.md && log_success "README.md 存在" || { log_error "缺少 README.md"; exit 1; }
test -f RECIPE_GUIDE.md && log_success "RECIPE_GUIDE.md 存在" || { log_error "缺少 RECIPE_GUIDE.md"; exit 1; }

echo ""
echo "=== 检查架构文档 ==="
test -f docs/architecture/SEVEN_AXIS_SYSTEM.md && log_success "七轴系统文档存在" || { log_error "缺少七轴系统文档"; exit 1; }
test -f docs/architecture/NEXTJS_ARCHITECTURE.md && log_success "Next.js 架构文档存在" || { log_error "缺少 Next.js 架构文档"; exit 1; }
test -f docs/architecture/MATRIX_RULES_SYSTEM.md && log_success "Matrix 规则文档存在" || { log_error "缺少 Matrix 规则文档"; exit 1; }

echo ""
echo "=== 检查配置文件 ==="
test -f package.json && log_success "package.json 存在" || { log_error "缺少 package.json"; exit 1; }
test -f vite.config.ts && log_success "vite.config.ts 存在" || { log_error "缺少 vite.config.ts"; exit 1; }
test -f th-ui.config.json && log_success "th-ui.config.json 存在" || { log_error "缺少 th-ui.config.json"; exit 1; }

echo ""
echo "=== 检查项目组件 ==="
if [ -d "src/components" ]; then
    COMPONENT_COUNT=$(ls -1 src/components/ | wc -l)
    log_success "src/components 目录存在，包含 $COMPONENT_COUNT 个组件"
    echo "组件列表:"
    ls -1 src/components/ | sed 's/^/  - /'
else
    log_error "缺少 src/components 目录"
    exit 1
fi

echo ""
echo "=== 检查现有演示站点 ==="
if [ -d "demo-site" ]; then
    log_success "demo-site 目录存在"
else
    log_warning "demo-site 目录不存在，将创建新的网站应用"
fi

echo ""
echo "=== 技术栈版本检查 ==="
if [ -f "docs/references/TECH_STACK.md" ]; then
    log_info "当前技术栈版本："
    grep -E "React|TypeScript|Tailwind|Next.js|Framer Motion|Vite" docs/references/TECH_STACK.md | head -10 | sed 's/^/  /'
fi

# 2. 安装和初始化 claude-flow
echo ""
log_info "Step 2: 安装和初始化 claude-flow"
echo "================================"

# 检查 claude-flow 是否已安装
if ! command -v claude-flow &> /dev/null; then
    log_info "安装 claude-flow Alpha 版本..."
    npm i -g claude-flow@alpha
    log_success "claude-flow 安装完成"
else
    log_success "claude-flow 已安装: $(claude-flow --version)"
fi

# 初始化 Hive-Mind 系统
log_info "初始化 Hive-Mind 系统..."
claude-flow hive-mind init

# 验证初始化
if claude-flow hive-mind status | grep -q "Active"; then
    log_success "Hive-Mind 初始化成功"
else
    log_warning "Hive-Mind 初始化可能需要更多时间，请检查状态"
fi

# 启用 Truth Verification
log_info "启用 Truth Verification（严格模式）..."
claude-flow verify init strict
claude-flow truth
log_success "Truth Verification 已启用"

# 3. 载入项目文档到记忆系统
echo ""
log_info "Step 3: 载入项目文档到记忆系统"
echo "================================"

# 创建临时函数来安全载入文档
safe_store() {
    local key="$1"
    local file="$2"
    local description="$3"

    if [ -f "$file" ]; then
        claude-flow memory store "$key" "$(cat "$file")"
        log_success "已载入: $description"
    else
        log_warning "跳过: $description (文件不存在: $file)"
    fi
}

# 载入技术栈作为 context7（单一真实来源）
log_info "载入技术栈作为 context7..."
safe_store "project-context/context7/tech-stack" "docs/references/TECH_STACK.md" "技术栈文档 (context7)"

# 载入核心项目文档
log_info "载入核心项目文档..."
safe_store "project-context/docs/README" "README.md" "项目主 README"
safe_store "project-context/docs/recipe-guide" "RECIPE_GUIDE.md" "样式配方指南"
safe_store "project-context/docs/dev-guide" "README-DEV.md" "开发指南"

# 载入架构文档（8个核心文档）
log_info "载入架构文档..."
safe_store "project-context/architecture/seven-axis" "docs/architecture/SEVEN_AXIS_SYSTEM.md" "七轴样式系统"
safe_store "project-context/architecture/oklch-color" "docs/architecture/OKLCH_COLOR_GUIDE.md" "OKLCH 色彩引擎"
safe_store "project-context/architecture/nextjs-arch" "docs/architecture/NEXTJS_ARCHITECTURE.md" "Next.js 架构"
safe_store "project-context/architecture/component-showcase" "docs/architecture/COMPONENTS_SHOWCASE.md" "组件展示规范"
safe_store "project-context/architecture/registry-standards" "docs/architecture/REGISTRY_STANDARDS.md" "Registry 标准"
safe_store "project-context/architecture/matrix-rules" "docs/architecture/MATRIX_RULES_SYSTEM.md" "Matrix 规则系统"
safe_store "project-context/architecture/i18n-package" "docs/architecture/I18N_PACKAGE_DESIGN.md" "i18n 包设计"
safe_store "project-context/architecture/migration-batching" "docs/architecture/MIGRATION_BATCHING_PLAN.md" "迁移批次计划"

# 载入指南和参考文档
log_info "载入指南和参考文档..."
safe_store "project-context/guides/migration" "docs/guides/MIGRATION_GUIDE.md" "迁移指南"
safe_store "project-context/references/api" "docs/references/API_REFERENCE.md" "API 参考"

# 载入重要的报告和总结文档
log_info "载入报告和总结文档..."
safe_store "project-context/docs/readme" "docs/README.md" "文档 README"
safe_store "project-context/docs/reorganization" "docs/REORGANIZATION_SUMMARY.md" "文档重组总结"

# 载入当前项目结构信息
log_info "载入项目结构信息..."
claude-flow memory store "project-context/structure/components" "$(ls -la src/components/)"
claude-flow memory store "project-context/structure/demo-site" "$(ls -la demo-site/ 2>/dev/null || echo 'demo-site 目录不存在')"
claude-flow memory store "project-context/structure/packages" "$(ls -la | grep packages || echo 'packages 目录不存在')"
claude-flow memory store "project-context/structure/config-files" "$(ls -la *.config.* *.json | head -20)"

# 载入构建配置文件（重要参考）
log_info "载入构建配置文件..."
safe_store "project-context/config/package" "package.json" "Package 配置"
safe_store "project-context/config/vite" "vite.config.ts" "Vite 配置"
safe_store "project-context/config/vite-demo" "vite.config.demo.ts" "Demo Vite 配置"
safe_store "project-context/config/tsconfig" "tsconfig.json" "TypeScript 配置"

# 载入 Tailwind v4 配置
if [ -f "tailwind.config.ts/style.css" ]; then
    claude-flow memory store "project-context/config/tailwind" "$(cat tailwind.config.ts/style.css)"
    log_success "已载入: Tailwind v4 CSS 配置"
else
    claude-flow memory store "project-context/config/tailwind" "Tailwind v4 CSS config"
    log_warning "使用默认 Tailwind v4 配置"
fi

# 载入样式配方指南
log_info "载入样式配方配置..."
safe_store "project-context/guides/recipe" "SEVEN_AXIS_SYSTEM_GUIDE.md" "七轴系统指南"
safe_store "project-context/config/recipe" "th-ui.config.json" "样式配方配置"

# 载入 Docker 配置（部署参考）
log_info "载入 Docker 配置..."
safe_store "project-context/config/dockerfile" "Dockerfile" "生产 Docker 配置"
safe_store "project-context/config/dockerfile-dev" "Dockerfile.dev" "开发 Docker 配置"
safe_store "project-context/config/docker-compose" "docker-compose.yml" "生产 Docker Compose"
safe_store "project-context/config/docker-compose-dev" "docker-compose.dev.yml" "开发 Docker Compose"

# 4. 验证载入的内容
echo ""
log_info "Step 4: 验证载入的内容"
echo "========================="

MEMORY_COUNT=$(claude-flow memory list project-context/ | wc -l)
log_success "已载入 $MEMORY_COUNT 个文档到记忆系统"

# 验证关键文档是否载入成功
log_info "验证关键文档载入..."

# 等待一下确保数据写入完成
sleep 2

# 检查技术栈文档载入（使用更宽泛的搜索）
if claude-flow memory search "project-context/" "TECH_STACK" | grep -q "TECH_STACK"; then
    log_success "技术栈文档 (context7) 载入成功"
elif claude-flow memory search "project-context/" "技术栈" | grep -q "技术栈"; then
    log_success "技术栈文档 (context7) 载入成功"
else
    log_warning "技术栈文档载入验证失败，但可能已成功载入"
    echo "调试信息："
    claude-flow memory list project-context/context7/ | head -5
fi

# 检查七轴系统文档载入
if claude-flow memory search "project-context/" "seven-axis" | grep -q "seven-axis"; then
    log_success "七轴系统文档载入成功"
elif claude-flow memory search "project-context/" "七轴" | grep -q "七轴"; then
    log_success "七轴系统文档载入成功"
else
    log_warning "七轴系统文档载入验证失败，但可能已成功载入"
fi

# 显示载入的文档总数
TOTAL_LOADED=$(claude-flow memory list project-context/ | wc -l)
log_info "总计载入文档数量: $TOTAL_LOADED"

if [ $TOTAL_LOADED -gt 10 ]; then
    log_success "文档载入完成，数量正常"
else
    log_warning "载入文档数量较少，可能存在问题"
fi

# 5. 启动网站重构编排
echo ""
log_info "Step 5: 启动网站重构编排"
echo "========================="

log_info "准备启动协同重构任务..."
log_warning "这是一个长时间运行的任务，请耐心等待"

# 读取编排指令内容
ORCHESTRATION_PROMPT='基于 TH-UI 项目仓库文档重构官方网站。

项目现状：
- 拥有 17 个核心组件（Button、Card、Input、Modal 等）
- 实现了七轴样式配方系统（Mode、Base、Accent、Tone、Density、Motion、Surface）
- 集成了 OKLCH 色彩引擎
- 完整的 Matrix 可访问性验证系统
- 独立的 i18n 国际化包设计

目标架构：
1. 重构现有 demo-site 为现代化 Next.js 15 App Router 应用
2. 实现 Gallery：配方库的搜索/过滤/预览（SSG/ISR + 客户端交互）
3. 实现 Adoption Matrix：按配方与组件生成可复制代码、导出沙盒、NPM 安装指引
4. 实现 Playground：Monaco + iframe 的在线试验场，支持保存/分享
5. 确保所有组件（17个）展示完整的变体×尺寸×状态矩阵
6. 集成七轴样式系统和 OKLCH 色彩引擎
7. 实现中文优先的国际化支持

技术约束：
- 严格使用 context7 技术栈规范（docs/references/TECH_STACK.md）
- 只能使用 src/components/ 中的组件，不得引入第三方 UI 库
- Next.js App Router + SSG/ISR + 客户端岛屿
- WCAG AA 可访问性标准（对比度 ≥ 4.5:1）
- 七轴样式系统完整集成
- Matrix 规则系统验证所有组合

交付物：
1. /apps/website 替换现有 /demo-site
2. @th-ui/registry 包：从 src/components/ 生成 registry.json
3. @th-ui/matrix 包：生成 matrix.json（WCAG 验证和热力图）
4. @th-ui/i18n 包：中文优先的国际化系统
5. CI/CD 流水线：自动化构建、验证、部署

使用 Truth Verification 严格模式（阈值 0.95），失败自动回滚。采用 Adaptive 模式自动在并行/串行间切换，确保依赖关系正确处理。'

log_info "启动协同编排任务..."
echo ""
echo "编排任务详情："
echo "- 自适应模式：自动处理并行/串行依赖"
echo "- Truth Verification：严格模式，阈值 0.95"
echo "- 自动扩缩容：2-12 个智能体"
echo "- 失败回滚：自动回滚机制"
echo ""

# 启动 Hive-Mind 协同重构任务
log_info "启动 Hive-Mind 协同重构任务..."
claude-flow hive-mind spawn \
  "基于 TH-UI 项目仓库文档重构官方网站。

项目现状：
- 拥有 17 个核心组件（Button、Card、Input、Modal 等）
- 实现了七轴样式配方系统（Mode、Base、Accent、Tone、Density、Motion、Surface）
- 集成了 OKLCH 色彩引擎
- 完整的 Matrix 可访问性验证系统
- 独立的 i18n 国际化包设计

目标架构：
1. 重构现有 demo-site 为现代化 Next.js 15 App Router 应用
2. 实现 Gallery：配方库的搜索/过滤/预览（SSG/ISR + 客户端交互）
3. 实现 Adoption Matrix：按配方与组件生成可复制代码、导出沙盒、NPM 安装指引
4. 实现 Playground：Monaco + iframe 的在线试验场，支持保存/分享
5. 确保所有组件（17个）展示完整的变体×尺寸×状态矩阵
6. 集成七轴样式系统和 OKLCH 色彩引擎
7. 实现中文优先的国际化支持

技术约束：
- 严格使用 context7 技术栈规范（docs/references/TECH_STACK.md）
- 只能使用 src/components/ 中的组件，不得引入第三方 UI 库
- Next.js App Router + SSG/ISR + 客户端岛屿
- WCAG AA 可访问性标准（对比度 ≥ 4.5:1）
- 七轴样式系统完整集成
- Matrix 规则系统验证所有组合

交付物：
1. /apps/website 替换现有 /demo-site
2. @th-ui/registry 包：从 src/components/ 生成 registry.json
3. @th-ui/matrix 包：生成 matrix.json（WCAG 验证和热力图）
4. @th-ui/i18n 包：中文优先的国际化系统
5. CI/CD 流水线：自动化构建、验证、部署

使用 Truth Verification 严格模式（阈值 0.95），失败自动回滚。采用分布式协调模式，智能体数量 6-12 个。" \
  --queen-type adaptive \
  --max-workers 8 \
  --auto-scale \
  --monitor \
  --claude

# 6. 完成和验证
echo ""
log_info "Step 6: 完成验证"
echo "=================="

# 检查执行结果
log_info "检查交付物..."

if [ -d "apps/website" ]; then
    log_success "✅ Next.js 应用已创建"
else
    log_error "❌ 缺少 apps/website"
fi

if [ -d "packages/registry" ]; then
    log_success "✅ Registry 包已创建"
else
    log_error "❌ 缺少 registry 包"
fi

if [ -d "packages/matrix" ]; then
    log_success "✅ Matrix 包已创建"
else
    log_error "❌ 缺少 matrix 包"
fi

if [ -d "packages/i18n" ]; then
    log_success "✅ i18n 包已创建"
else
    log_error "❌ 缺少 i18n 包"
fi

# 7. 监控和调试信息
echo ""
log_info "Step 7: 监控和调试信息"
echo "========================="

log_info "实时监控命令："
echo "claude-flow hive monitor --live"
echo ""
log_info "查看通信日志："
echo "claude-flow hive comms --tail"
echo ""
log_info "检查验证状态："
echo "claude-flow verify status"
echo ""
log_info "查看记忆存储内容："
echo "claude-flow memory list project-context/"
echo ""
log_info "导出执行计划："
echo "claude-flow memory export \"project-context/context7/\" --format json"

echo ""
log_success "🎉 Hive-Mind 执行脚本完成！"
echo ""
echo "下一步操作："
echo "1. 查看执行结果：ls -la apps/ packages/"
echo "2. 进入网站目录：cd apps/website"
echo "3. 安装依赖：npm install"
echo "4. 本地测试：npm run dev"
echo "5. 构建验证：npm run build"
echo ""
echo "如需帮助，请查看日志或运行上述监控命令。"