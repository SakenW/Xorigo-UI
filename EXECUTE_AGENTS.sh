#!/bin/bash
# TH-UI Monorepo Agent 执行脚本
# 用于批量执行 claude-flow hive-mind Agent 指令

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}TH-UI Monorepo Agent 执行脚本${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo ""
  echo "用法: ./EXECUTE_AGENTS.sh <phase> [options]"
  echo ""
  echo "Phase 选项:"
  echo "  phase1    执行 Phase 1: 紧急修复 (3个 Agent, 0.5天)"
  echo "  phase2    执行 Phase 2: 核心功能 (5个 Agent, 5天)"
  echo "  phase3    执行 Phase 3: 质量提升 (4个 Agent, 5天)"
  echo "  phase4    执行 Phase 4: 生态完善 (4个 Agent, 5天)"
  echo "  all       执行所有 Phase (顺序执行)"
  echo ""
  echo "特殊选项:"
  echo "  --show <phase>    显示指令但不执行"
  echo "  --help            显示此帮助信息"
  echo ""
  echo "示例:"
  echo "  ./EXECUTE_AGENTS.sh phase1           # 执行 Phase 1"
  echo "  ./EXECUTE_AGENTS.sh phase2 --show    # 显示 Phase 2 指令"
  echo "  ./EXECUTE_AGENTS.sh all              # 执行所有 Phase"
  echo ""
}

# Phase 1: 紧急修复
show_phase1() {
  cat <<'EOF'
claude-flow hive-mind 部署 3个紧急修复 Agent 并行执行：

1. **依赖修复 Agent** (DevOps-Fixer)
   - 任务: 修复 npm install 权限和依赖安装问题
   - 动作:
     * 删除所有 node_modules（根目录 + packages/ + apps/）
     * 配置 .npmrc (unsafe-perm=true, legacy-peer-deps=true)
     * 执行 npm install --legacy-peer-deps
     * 验证 @th-ui/core 工作区依赖有效性
   - 输出: 依赖安装成功日志，验证清单
   - 验证: npm ls @th-ui/core 无 "invalid"

2. **构建修复 Agent** (Build-Fixer)
   - 任务: 构建 packages/core 和 packages/registry
   - 前置: 等待 Agent 1 完成
   - 动作:
     * cd packages/core && npm run build
     * 验证 dist/ 目录存在且包含完整产物
     * cd packages/registry && npm run build
     * 验证构建成功
   - 输出: 构建日志，产物清单
   - 验证: ls -la packages/core/dist/

3. **开发环境验证 Agent** (Dev-Validator)
   - 任务: 验证开发服务器可启动
   - 前置: 等待 Agent 2 完成
   - 动作:
     * 启动 npm run dev（测试 5 秒后停止）
     * 检查端口 3100 监听状态
     * 验证 Vite 开发服务器日志
   - 输出: 启动日志，端口检查结果
   - 验证: 开发服务器成功启动

输出要求:
- 每个 Agent 提供详细执行日志
- 失败时提供明确错误信息和修复建议
- 成功时标记 ✅ Phase 1 完成
EOF
}

# Phase 2: 核心功能
show_phase2() {
  cat <<'EOF'
claude-flow hive-mind 部署 5个核心功能 Agent 并行执行：

1. **配方预览页面 Agent** (Recipes-Page-Builder)
   - 任务: 创建 /recipes 配方预览页面
   - 位置: apps/website/app/recipes/page.tsx
   - 功能需求:
     * 展示 20 个七轴 DTCG 配方
     * 配方网格布局（4 列响应式）
     * 多维度过滤器（模式/色调/密度/表面/类别）
     * 配方卡片（名称、描述、七轴参数、颜色预览）
     * 点击切换当前配方（集成 StyleRecipeProvider）
     * 实时预览区域（展示当前配方效果）
   - 技术栈: Next.js 15, React 19, @th-ui/core
   - 输出: 完整页面代码，样式文件，测试说明
   - 验证: http://localhost:3100/recipes 可访问且功能完整

2. **Gallery 详情页 Agent** (Gallery-Detail-Builder)
   - 任务: 创建 /gallery/[recipeId] 配方详情页
   - 位置: apps/website/app/gallery/[recipeId]/page.tsx
   - 功能需求:
     * 动态路由参数处理
     * 配方完整信息展示（七轴参数、设计理念、适用场景）
     * 组件预览区域（Button、Card、Input 等核心组件）
     * 色彩板展示（主色、辅色、中性色、语义色）
     * 代码示例（如何使用该配方）
     * 导出功能（CSS 变量、Tailwind 配置）
   - 技术栈: Next.js 15 App Router, generateStaticParams
   - 输出: 详情页代码，布局组件，数据获取逻辑
   - 验证: /gallery/professional-blue 可访问且内容完整

3. **OKLCH 色彩引擎 Agent** (OKLCH-Engine-Builder)
   - 任务: 实现完整的 OKLCH 色彩引擎
   - 位置: packages/core/src/utils/color/
   - 功能需求:
     * 安装 culori 库（npm install culori）
     * 实现 OKLCH ↔ sRGB 双向转换
     * 实现色彩插值函数
     * 实现色彩调整函数（明度、色度、色相）
     * 创建色彩工具类（OKLCHColor）
     * 集成到 StyleRecipeProvider
     * 更新配方颜色映射（recipeColorMap 使用 OKLCH）
   - 技术栈: TypeScript, culori
   - 输出: 色彩引擎代码，单元测试，使用文档
   - 验证: 色彩转换准确性，配方颜色渐变一致性

4. **Compile API Agent** (Compile-API-Builder)
   - 任务: 实现 /api/compile Server Action
   - 位置: apps/website/app/api/compile/route.ts
   - 功能需求:
     * 接收用户代码（TypeScript/TSX）
     * 编译为可执行 JavaScript
     * 沙箱环境执行（安全隔离）
     * 返回编译结果或错误信息
     * 支持 @th-ui/core 组件导入
     * 性能优化（缓存编译结果）
   - 技术栈: Next.js Server Actions, esbuild
   - 输出: API 路由代码，编译器配置，错误处理
   - 验证: Playground 在线编译功能可用

5. **Registry API Agent** (Registry-API-Builder)
   - 任务: 实现 /api/registry Server Action
   - 位置: apps/website/app/api/registry/route.ts
   - 功能需求:
     * 查询组件列表（支持分类、搜索、过滤）
     * 获取组件详情（代码、依赖、文档）
     * 返回组件元数据（JSON Schema）
     * 集成 @th-ui/registry 包
     * 支持版本管理
   - 技术栈: Next.js Server Actions, Zod
   - 输出: API 路由代码，数据模型，查询逻辑
   - 验证: 组件查询和获取功能正常

输出要求:
- 每个 Agent 提供完整可运行代码
- 包含 TypeScript 类型定义
- 提供使用示例和测试用例
- 标注 TODO 和潜在改进点
EOF
}

# Phase 3: 质量提升
show_phase3() {
  cat <<'EOF'
claude-flow hive-mind 部署 4个质量提升 Agent 并行执行：

1. **组件文档生成 Agent** (Component-Docs-Generator)
   - 任务: 为 42 个组件创建完整 API 文档
   - 位置: docs/components/
   - 文档模板:
     * 组件概述（用途、设计理念）
     * API 参考（Props、类型定义、默认值）
     * 使用示例（基础用法、高级用法、组合用法）
     * 变体展示（所有 variants 和 sizes）
     * 可访问性说明（ARIA 属性、键盘操作）
     * 最佳实践（Do's and Don'ts）
   - 组件清单:
     * UI 组件 (24): Button, Card, Input, Modal, Switch...
     * 高级组件 (5): AnimatedCard, Dialog, InteractionStates...
     * 反馈组件 (7): Alert, Loading, Progress, Toast...
     * 导航组件 (5): DataTable, Sidebar, Tabs...
     * Radix 组件 (2): Accordion, DropdownMenu
   - 输出: 42 个 Markdown 文档，索引页面，文档模板
   - 验证: 所有组件有完整文档，格式统一

2. **Matrix 验证系统 Agent** (Matrix-Validator-Builder)
   - 任务: 实现基础 Matrix 可访问性验证系统
   - 位置: packages/core/src/utils/matrix/
   - 功能需求:
     * WCAG 对比度验证（AA/AAA 标准）
     * 色盲模拟（CVD 验证）
     * 文本可读性检查
     * 焦点状态验证
     * 键盘导航验证
     * 生成验证报告（Markdown + JSON）
     * 集成到 StyleRecipeProvider
   - 技术栈: TypeScript, color-contrast-checker
   - 输出: 验证引擎代码，规则配置，报告生成器
   - 验证: 配方通过 WCAG AA 验证

3. **TypeScript 严格模式 Agent** (TS-Strict-Enabler)
   - 任务: 修复类型错误并启用 TypeScript 严格模式
   - 范围: packages/core/, apps/website/
   - 执行步骤:
     * Phase 1: 运行 tsc --noEmit，收集所有类型错误
     * Phase 2: 修复 ThemeProvider 类型问题
     * Phase 3: 修复 Framer Motion 类型兼容性
     * Phase 4: 修复组件 Props 类型定义
     * Phase 5: 启用 strict: true
     * Phase 6: 验证无类型错误
   - 输出: 类型修复报告，tsconfig 更新，类型声明文件
   - 验证: npm run type-check 无错误

4. **vite-plugin-dts 启用 Agent** (DTS-Generator-Enabler)
   - 任务: 启用类型声明文件生成
   - 位置: packages/core/vite.config.ts
   - 执行步骤:
     * 解除 vite-plugin-dts 注释
     * 配置 dts 插件选项（include, rollupTypes）
     * 修复可能的类型生成错误
     * 验证 dist/ 包含完整 .d.ts 文件
     * 更新 package.json exports 类型路径
   - 输出: 更新的 vite 配置，类型声明文件清单
   - 验证: dist/index.d.ts 存在且完整

输出要求:
- 每个 Agent 提供详细实施报告
- 包含前后对比数据
- 提供质量指标（覆盖度、通过率）
- 标注剩余问题和后续改进
EOF
}

# Phase 4: 生态完善
show_phase4() {
  cat <<'EOF'
claude-flow hive-mind 部署 4个生态完善 Agent 并行执行：

1. **I18n 包创建 Agent** (I18n-Package-Builder)
   - 任务: 创建 @th-ui/i18n 独立包
   - 位置: packages/i18n/
   - 功能需求:
     * I18nManager 单例管理器
     * 语言包加载（zh-CN, en-US, ja-JP）
     * 翻译函数（t, plural, datetime）
     * React Hook（useTranslation）
     * 语言切换和持久化
     * 插值和复数规则
   - 参考文档: docs/architecture/I18N_PACKAGE_DESIGN.md
   - 输出: 完整包代码，语言包文件，使用文档
   - 验证: 包可独立发布，集成到 @th-ui/core

2. **独立 Tokens 和 Style Recipe 包 Agent** (Tokens-Recipe-Extractor)
   - 任务: 拆分 tokens 和 style-recipe 为独立包
   - 位置: packages/tokens/, packages/style-recipe/
   - 执行步骤:
     * 从 packages/core/src/ 提取 tokens/ 和 style-recipe/
     * 创建独立 package.json（peer dependencies）
     * 更新 @th-ui/core 依赖引用
     * 配置 exports 和类型声明
     * 更新构建配置（Vite）
   - 输出: 2 个新包，迁移报告，依赖更新
   - 验证: 包可独立发布，@th-ui/core 正常工作

3. **Docker 配置更新 Agent** (Docker-Config-Updater)
   - 任务: 更新 Docker 配置适配 Monorepo
   - 文件: Dockerfile.dev, docker-compose.yml, docker-compose.website.yml
   - 更新内容:
     * Node 版本: 20 → 22
     * 端口配置: 5173 → 3100
     * 工作目录: 适配 Monorepo 结构
     * 卷映射: 优化 node_modules 处理
     * 构建阶段: 多阶段构建优化
   - 输出: 更新的 Docker 配置，使用文档
   - 验证: Docker 开发环境正常启动

4. **搜索 API 和清理 Agent** (Search-API-Cleanup)
   - 任务 1: 实现搜索 API
     * 位置: apps/website/app/api/search/route.ts
     * 功能: 组件搜索、配方搜索、文档搜索
     * 技术: Fuse.js 模糊搜索
   - 任务 2: 清理测试页面
     * 删除 apps/website/app/test-*.tsx
     * 删除无用的调试页面
     * 更新路由配置
   - 输出: 搜索 API 代码，清理报告
   - 验证: 搜索功能可用，测试页面已删除

输出要求:
- 每个 Agent 提供完整包/配置
- 包含迁移指南和使用文档
- 提供回归测试清单
- 标注潜在风险和注意事项
EOF
}

# 显示 Phase 信息
show_phase_info() {
  local phase=$1
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo -e "${PURPLE}Phase $phase 指令${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo ""
}

# 执行 Phase
execute_phase() {
  local phase=$1
  local show_only=$2

  case $phase in
    1)
      show_phase_info 1
      show_phase1
      ;;
    2)
      show_phase_info 2
      show_phase2
      ;;
    3)
      show_phase_info 3
      show_phase3
      ;;
    4)
      show_phase_info 4
      show_phase4
      ;;
    *)
      echo -e "${RED}错误: 未知的 Phase: $phase${NC}"
      exit 1
      ;;
  esac

  if [ "$show_only" != "true" ]; then
    echo ""
    echo -e "${YELLOW}提示: 请复制上面的指令并在 Claude Code 中执行${NC}"
    echo -e "${YELLOW}      或者使用 --show 参数仅显示指令${NC}"
  fi
}

# 主函数
main() {
  local command=$1
  local option=$2

  # 检查帮助
  if [ "$command" = "--help" ] || [ "$command" = "-h" ] || [ -z "$command" ]; then
    show_help
    exit 0
  fi

  # 检查是否仅显示
  local show_only=false
  if [ "$option" = "--show" ]; then
    show_only=true
  fi

  # 执行命令
  case $command in
    phase1)
      execute_phase 1 "$show_only"
      ;;
    phase2)
      execute_phase 2 "$show_only"
      ;;
    phase3)
      execute_phase 3 "$show_only"
      ;;
    phase4)
      execute_phase 4 "$show_only"
      ;;
    all)
      echo -e "${GREEN}执行所有 Phase (顺序执行)${NC}"
      echo ""
      for i in 1 2 3 4; do
        execute_phase $i "$show_only"
        echo ""
        echo -e "${CYAN}───────────────────────────────────────────────────${NC}"
        echo ""
      done
      ;;
    *)
      echo -e "${RED}错误: 未知命令: $command${NC}"
      echo ""
      show_help
      exit 1
      ;;
  esac
}

# 执行主函数
main "$@"
