# 🤖 TH-UI Monorepo Agent 执行指令集

基于 [081-unified-execution-plan.md](../reports/081-unified-execution-plan.md) 的分阶段执行计划，设计多个专业 Agent 并发执行任务。

---

## 📋 使用说明

每个 Phase 包含多个并行 Agent，可以同时执行。每个指令都经过精心设计，确保：
- ✅ 职责清晰，避免冲突
- ✅ 输入输出明确
- ✅ 可独立执行
- ✅ 结果可验证

**执行方式**：
```bash
# 复制整个 Phase 的所有 Agent 指令
# 粘贴到 Claude Code 一次性执行
claude-flow hive-mind [指令1] + [指令2] + [指令3] ...
```

---

## 🔥 Phase 1: 紧急修复（今天，0.5天）

### 🎯 目标
解决 P0 阻塞问题，恢复开发能力

### 执行指令

```bash
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
   - 特殊注意: 确保vite.config.ts中包含`external: ['@th-ui/core']`配置以解决Vite 7包解析问题
   - 输出: 构建日志，产物清单
   - 验证: ls -la packages/core/dist/

3. **开发环境验证 Agent** (Dev-Validator)
   - 任务: 验证开发服务器可启动
   - 前置: 等待 Agent 2 完成
   - 动作:
     * 启动热更新的开发容器（Next.js网站，端口3100）
     * 检查端口 3100 监听状态
     * 验证开发服务器日志
   - 特殊注意: 如果端口3100被占用，使用lsof -ti:3100 | xargs kill -9释放端口
   - 输出: 启动日志，端口检查结果
   - 验证: 开发服务器成功启动

输出要求:
- 每个 Agent 提供详细执行日志
- 失败时提供明确错误信息和修复建议
- 成功时标记 ✅ Phase 1 完成
```

**预估时间**: 10-30 分钟
**关键验证**: `npm install` 成功 → `npm run build` 成功 → `npm run dev` 启动

---

## ⚡ Phase 2: 核心功能补全（本周，5天）

### 🎯 目标
完成核心功能，达到可用状态

### 执行指令

```bash
claude-flow hive-mind 部署 5个核心功能 Agent 并行执行：

1. **配方预览页面 Agent** (Recipes-Page-Builder)
   - 任务: 创建 /recipes 配方预览页面
   - 位置: apps/website/app/recipes/page.tsx

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * Next.js 15: "Next.js 15 App Router client components use client directive"
     * Next.js 15: "Next.js 15 page components layout metadata"
     * React 19: "React 19 useState useEffect hooks best practices"
     * React 19: "React 19 useMemo useCallback performance optimization"
     * Framer Motion 12: "Framer Motion 12 AnimatePresence layout animations"
     * Framer Motion 12: "Framer Motion 12 variants stagger children"
     * Tailwind CSS: "Tailwind CSS grid responsive breakpoints"

   - 功能需求:
     * 展示 20 个七轴 DTCG 配方
     * 配方网格布局（4 列响应式）
     * 多维度过滤器（模式/色调/密度/表面/类别）
     * 配方卡片（名称、描述、七轴参数、颜色预览）
     * 点击切换当前配方（集成 StyleRecipeProvider）
     * 实时预览区域（展示当前配方效果）

   - 技术要求:
     * **必须**: 使用 'use client' 指令（需要状态和交互）
     * **必须**: 遵循 Next.js 15 App Router 最佳实践
     * **必须**: 使用 React 19 hooks 优化性能（useMemo 缓存过滤结果）
     * **必须**: Framer Motion 布局动画避免抖动
     * **禁止**: 在 Server Component 中使用 useState/useEffect

   - 输出: 完整页面代码（含 TypeScript 类型），样式文件，测试说明
   - 验证: http://localhost:3100/recipes 可访问且功能完整

2. **Gallery 详情页 Agent** (Gallery-Detail-Builder)
   - 任务: 创建 /gallery/[recipeId] 配方详情页
   - 位置: apps/website/app/gallery/[recipeId]/page.tsx

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * Next.js 15: "Next.js 15 dynamic routes params generateStaticParams"
     * Next.js 15: "Next.js 15 App Router metadata generateMetadata"
     * Next.js 15: "Next.js 15 notFound error handling"
     * React 19: "React 19 Suspense async server components"
     * TypeScript: "TypeScript 5.9 satisfies operator type narrowing"
     * Tailwind CSS: "Tailwind CSS color palette customization CSS variables"

   - 功能需求:
     * 动态路由参数处理（generateStaticParams 预渲染）
     * 配方完整信息展示（七轴参数、设计理念、适用场景）
     * 组件预览区域（Button、Card、Input 等核心组件）
     * 色彩板展示（主色、辅色、中性色、语义色）
     * 代码示例（如何使用该配方）
     * 导出功能（CSS 变量、Tailwind 配置）

   - 技术要求:
     * **必须**: 使用 generateStaticParams 预渲染所有配方页面（SSG 优化）
     * **必须**: 使用 generateMetadata 动态生成 SEO 元数据
     * **必须**: Server Component 默认，需要交互时使用 Client Component
     * **必须**: 使用 notFound() 处理无效 recipeId
     * **禁止**: 在 Server Component 中使用 useState/useEffect

   - 输出: 详情页代码（含 TypeScript 类型），布局组件，数据获取逻辑
   - 验证: /gallery/professional-blue 可访问且内容完整

3. **OKLCH 色彩引擎 Agent** (OKLCH-Engine-Builder)
   - 任务: 实现完整的 OKLCH 色彩引擎
   - 位置: packages/core/src/utils/color/

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * culori: "culori OKLCH color space conversion"
     * culori: "culori color interpolation modes"
     * culori: "culori formatHex formatRgb color output"
     * TypeScript: "TypeScript 5.9 utility types Omit Pick"
     * TypeScript: "TypeScript 5.9 class decorators private protected"
     * Vitest: "Vitest expect toBeCloseTo numerical assertions"

   - 功能需求:
     * 安装 culori 库（cd packages/core && npm install culori）
     * 实现 OKLCH ↔ sRGB 双向转换
     * 实现色彩插值函数（OKLCH 色彩空间插值）
     * 实现色彩调整函数（明度、色度、色相）
     * 创建色彩工具类（OKLCHColor）
     * 集成到 StyleRecipeProvider
     * 更新配方颜色映射（recipeColorMap 使用 OKLCH）

   - 技术要求:
     * **必须**: 使用 culori 官方 API（不自己实现转换算法）
     * **必须**: 支持 CSS oklch() 函数语法输出
     * **必须**: 插值使用 OKLCH 色彩空间（确保感知均匀）
     * **必须**: 单元测试覆盖所有转换函数（精度 ±0.01）
     * **禁止**: 直接使用 RGB 插值（会导致颜色不准确）

   - 输出: 色彩引擎代码（含 TypeScript 类型），单元测试（Vitest），使用文档
   - 验证: 色彩转换准确性，配方颜色渐变一致性

4. **Compile API Agent** (Compile-API-Builder)
   - 任务: 实现 /api/compile Server Action
   - 位置: apps/website/app/api/compile/route.ts

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * Next.js 15: "Next.js 15 Route Handlers POST request body"
     * Next.js 15: "Next.js 15 API routes error handling NextResponse"
     * esbuild: "esbuild transform API TypeScript JSX"
     * esbuild: "esbuild loader configuration tsx jsx"
     * Zod: "Zod schema validation parse safeParse"
     * Zod: "Zod string object required optional"

   - 功能需求:
     * 接收用户代码（TypeScript/TSX）
     * 编译为可执行 JavaScript（esbuild transform）
     * 沙箱环境执行（安全隔离）
     * 返回编译结果或错误信息
     * 支持 @th-ui/core 组件导入
     * 性能优化（缓存编译结果）

   - 技术要求:
     * **必须**: 使用 Zod 验证请求体（code: string, config?: object）
     * **必须**: 使用 esbuild.transform() 编译代码
     * **必须**: 配置 loader: 'tsx', target: 'es2020'
     * **必须**: 使用 try-catch 捕获编译错误并返回友好信息
     * **必须**: 限制代码长度（< 10KB）和执行时间（< 5s）
     * **禁止**: 执行未经验证的代码（防止注入攻击）

   - 输出: API 路由代码（含 TypeScript 类型），编译器配置，错误处理
   - 验证: Playground 在线编译功能可用

5. **Registry API Agent** (Registry-API-Builder)
   - 任务: 实现 /api/registry Server Action
   - 位置: apps/website/app/api/registry/route.ts

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * Next.js 15: "Next.js 15 Route Handlers GET query parameters"
     * Next.js 15: "Next.js 15 Route Handlers dynamic routes segments"
     * Zod: "Zod enum union literal validation"
     * Zod: "Zod array string number validation"
     * TypeScript: "TypeScript 5.9 discriminated unions"
     * Fuse.js: "Fuse.js fuzzy search configuration options"

   - 功能需求:
     * 查询组件列表（支持分类、搜索、过滤）
     * 获取组件详情（代码、依赖、文档）
     * 返回组件元数据（JSON Schema）
     * 集成 @th-ui/registry 包
     * 支持版本管理（v0.1.0）

   - 技术要求:
     * **必须**: 使用 Zod 验证查询参数（category?, search?, filter?）
     * **必须**: 使用 Fuse.js 实现模糊搜索（threshold: 0.3）
     * **必须**: 支持 GET /api/registry 和 GET /api/registry/[component]
     * **必须**: 返回标准 JSON 响应（含 status, data, error）
     * **必须**: 使用 TypeScript 类型安全（RegistryComponent 接口）
     * **禁止**: 硬编码组件数据（使用 @th-ui/registry 包）

   - 输出: API 路由代码（含 TypeScript 类型），数据模型，查询逻辑
   - 验证: 组件查询和获取功能正常

输出要求:
- 每个 Agent 提供完整可运行代码
- 包含 TypeScript 类型定义
- 提供使用示例和测试用例
- 标注 TODO 和潜在改进点
```

**预估时间**: 5 天（并行）
**关键验证**: 5 个核心功能全部可用

---

## 📚 Phase 3: 质量提升（下周，5天）

### 🎯 目标
完善文档和质量保证

### 执行指令

```bash
claude-flow hive-mind 部署 4个质量提升 Agent 并行执行：

1. **组件文档生成 Agent** (Component-Docs-Generator)
   - 任务: 为 42 个组件创建完整 API 文档
   - 位置: docs/components/

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * React 19: "React 19 component props TypeScript interface"
     * React 19: "React 19 forwardRef useImperativeHandle"
     * TypeScript: "TypeScript 5.9 JSDoc comments documentation"
     * class-variance-authority: "cva VariantProps type extraction"
     * Markdown: "GitHub Flavored Markdown syntax tables code blocks"

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

   - 技术要求:
     * **必须**: 从组件源码自动提取 Props 类型（TypeScript AST）
     * **必须**: 使用 GitHub Flavored Markdown 格式
     * **必须**: 提供可运行的代码示例（使用 ```tsx 语法）
     * **必须**: 包含 WCAG 可访问性等级（AA/AAA）
     * **禁止**: 手动编写 Props 类型（使用自动化工具）

   - 输出: 42 个 Markdown 文档，索引页面（docs/components/README.md），文档生成脚本
   - 验证: 所有组件有完整文档，格式统一

2. **Matrix 验证系统 Agent** (Matrix-Validator-Builder)
   - 任务: 实现基础 Matrix 可访问性验证系统
   - 位置: packages/core/src/utils/matrix/

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * color-contrast-checker: "color-contrast-checker WCAG AA AAA ratio"
     * TypeScript: "TypeScript 5.9 abstract class inheritance"
     * Vitest: "Vitest describe it expect test suites"
     * WCAG: "WCAG 2.1 contrast ratio requirements AA AAA"

   - 功能需求:
     * WCAG 对比度验证（AA/AAA 标准，正常文本 4.5:1，大文本 3:1）
     * 色盲模拟（CVD 验证 - 红绿蓝色盲）
     * 文本可读性检查（字体大小、行高、字距）
     * 焦点状态验证（focus-visible 对比度）
     * 键盘导航验证（tabIndex, role, aria-* 属性）
     * 生成验证报告（Markdown + JSON）
     * 集成到 StyleRecipeProvider

   - 技术要求:
     * **必须**: 使用 color-contrast-checker 计算对比度
     * **必须**: 支持多种色盲模拟算法（Protanopia, Deuteranopia, Tritanopia）
     * **必须**: 验证规则可配置（MatrixConfig 接口）
     * **必须**: 生成详细报告（通过/失败，改进建议）
     * **必须**: 单元测试覆盖所有验证规则
     * **禁止**: 硬编码 WCAG 标准（使用配置文件）

   - 输出: 验证引擎代码（含 TypeScript 类型），规则配置文件，报告生成器，单元测试
   - 验证: 配方通过 WCAG AA 验证

3. **TypeScript 严格模式 Agent** (TS-Strict-Enabler)
   - 任务: 修复类型错误并启用 TypeScript 严格模式
   - 范围: packages/core/, apps/website/

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * TypeScript: "TypeScript 5.9 strict mode compiler options"
     * TypeScript: "TypeScript 5.9 strictNullChecks optional chaining"
     * TypeScript: "TypeScript 5.9 strictFunctionTypes contravariance"
     * React 19: "React 19 TypeScript types children ReactNode"
     * Framer Motion 12: "Framer Motion 12 TypeScript motion component types"

   - 执行步骤:
     * Phase 1: 运行 tsc --noEmit，收集所有类型错误（保存到日志）
     * Phase 2: 修复 ThemeProvider 类型问题（Context 类型定义）
     * Phase 3: 修复 Framer Motion 类型兼容性（motion 组件类型）
     * Phase 4: 修复组件 Props 类型定义（添加 ReactNode, children）
     * Phase 5: 启用 strict: true（tsconfig.json）
     * Phase 6: 验证无类型错误（npm run type-check）

   - 技术要求:
     * **必须**: 逐步启用严格模式选项（strictNullChecks → strictFunctionTypes → strict）
     * **必须**: 使用 non-null assertion (!) 需要注释说明原因
     * **必须**: 所有 any 类型需要改为具体类型或 unknown
     * **必须**: 使用 React 19 官方类型（ReactNode, ReactElement, FC）
     * **禁止**: 使用 @ts-ignore（使用 @ts-expect-error 并说明原因）

   - 输出: 类型修复报告（修复清单，错误统计），tsconfig 更新，类型声明文件
   - 验证: npm run type-check 无错误

4. **vite-plugin-dts 启用 Agent** (DTS-Generator-Enabler)
   - 任务: 启用类型声明文件生成
   - 位置: packages/core/vite.config.ts

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * vite-plugin-dts: "vite-plugin-dts configuration rollupTypes"
     * vite-plugin-dts: "vite-plugin-dts include exclude options"
     * Vite 7: "Vite 7 library mode build configuration"
     * Vite 7: "Vite 7 package exports resolution"
     * TypeScript: "TypeScript declaration files d.ts generation"

   - 执行步骤:
     * 解除 vite-plugin-dts 注释（vite.config.ts）
     * 配置 dts 插件选项（include: ['src'], rollupTypes: true）
     * 修复可能的类型生成错误（运行 npm run build）
     * 验证 dist/ 包含完整 .d.ts 文件（index.d.ts, theme/index.d.ts）
     * 更新 package.json exports 类型路径（验证正确性）
     * 确保vite.config.ts中包含`external: ['@th-ui/core']`配置以解决Vite 7包解析问题

   - 技术要求:
     * **必须**: 配置 rollupTypes: true（合并类型声明）
     * **必须**: 排除测试文件（exclude: ['**/*.test.ts', '**/*.spec.ts']）
     * **必须**: 验证类型导出完整性（所有公开 API 有类型）
     * **必须**: 确保类型声明与源码同步
     * **必须**: 确保package.json中的exports字段包含正确的类型路径
     * **禁止**: 手动编写 .d.ts 文件（使用自动生成）

   - 输出: 更新的 vite 配置，类型声明文件清单，验证报告
   - 验证: dist/index.d.ts 存在且完整

输出要求:
- 每个 Agent 提供详细实施报告
- 包含前后对比数据
- 提供质量指标（覆盖度、通过率）
- 标注剩余问题和后续改进
```

**预估时间**: 5 天（并行）
**关键验证**: 文档完整、验证可用、类型安全

---

## 🚀 Phase 4: 生态完善（下下周，5天）

### 🎯 目标
完成生态系统和工具链

### 执行指令

```bash
claude-flow hive-mind 部署 4个生态完善 Agent 并行执行：

1. **I18n 包创建 Agent** (I18n-Package-Builder)
   - 任务: 创建 @th-ui/i18n 独立包
   - 位置: packages/i18n/

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * React 19: "React 19 Context API useContext createContext"
     * React 19: "React 19 custom hooks useState useEffect"
     * TypeScript: "TypeScript 5.9 template literal types"
     * TypeScript: "TypeScript 5.9 const assertions as const"
     * Intl API: "Intl.PluralRules plural forms locales"
     * Intl API: "Intl.DateTimeFormat localized date formatting"

   - 功能需求:
     * I18nManager 单例管理器（懒加载语言包）
     * 语言包加载（zh-CN, en-US, ja-JP）
     * 翻译函数（t, plural, datetime）
     * React Hook（useTranslation, useLocale）
     * 语言切换和持久化（localStorage）
     * 插值和复数规则（ICU MessageFormat）

   - 技术要求:
     * **必须**: 使用 React 19 Context API（I18nProvider）
     * **必须**: 使用 TypeScript 模板字面量类型（类型安全的翻译键）
     * **必须**: 使用 Intl API 处理复数和日期格式化
     * **必须**: 支持异步语言包加载（动态 import）
     * **必须**: 参考 docs/architecture/I18N_PACKAGE_DESIGN.md 架构设计
     * **禁止**: 使用第三方 i18n 库（自己实现轻量级方案）

   - 参考文档: docs/architecture/I18N_PACKAGE_DESIGN.md
   - 输出: 完整包代码（含 TypeScript 类型），语言包文件（JSON），使用文档，单元测试
   - 验证: 包可独立发布，集成到 @th-ui/core

2. **独立 Tokens 和 Style Recipe 包 Agent** (Tokens-Recipe-Extractor)
   - 任务: 拆分 tokens 和 style-recipe 为独立包
   - 位置: packages/tokens/, packages/style-recipe/

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * npm: "npm workspaces package.json dependencies"
     * npm: "npm workspaces peerDependencies configuration"
     * Vite 7: "Vite 7 library mode external dependencies"
     * Vite 7: "Vite 7 package exports resolution"
     * TypeScript: "TypeScript project references composite"

   - 执行步骤:
     * 从 packages/core/src/ 提取 tokens/ 和 style-recipe/（复制到新包）
     * 创建独立 package.json（name: @th-ui/tokens, @th-ui/style-recipe）
     * 配置 peerDependencies（react, react-dom）
     * 更新 @th-ui/core 依赖引用（从本地路径改为包名）
     * 配置 exports 和类型声明（package.json）
     * 更新构建配置（复制 Vite 配置并调整）
     * 更新根 package.json workspaces（添加新包）
     * 确保新包的vite.config.ts中包含`external: ['@th-ui/core']`配置以解决Vite 7包解析问题

   - 技术要求:
     * **必须**: 使用 npm workspaces 本地依赖（file: 协议）
     * **必须**: 配置正确的 peerDependencies（避免重复安装）
     * **必须**: 保持包版本一致（都使用 0.1.0）
     * **必须**: 更新 @th-ui/core 的 import 路径
     * **必须**: 确保package.json中的exports字段包含正确的类型路径
     * **禁止**: 破坏现有功能（必须向后兼容）

   - 输出: 2 个新包（含完整配置），迁移报告（文件清单，依赖关系），依赖更新清单
   - 验证: 包可独立发布，@th-ui/core 正常工作

3. **Docker 配置更新 Agent** (Docker-Config-Updater)
   - 任务: 更新 Docker 配置适配 Monorepo
   - 文件: Dockerfile.dev, docker-compose.yml, docker-compose.website.yml

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * Docker: "Docker multi-stage build Node.js Alpine"
     * Docker: "Docker Compose volumes node_modules caching"
     * Docker: "Docker Compose environment variables env_file"
     * Next.js 15: "Next.js 15 Docker deployment standalone output"

   - 更新内容:
     * Node 版本: 20 → 22（FROM node:22-alpine）
     * 端口配置: 3100 → 3100（PROD_PORT, NEXTJS_DEV_PORT）
     * 工作目录: 适配 Monorepo 结构（WORKDIR /app）
     * 卷映射: 优化 node_modules 处理（匿名卷）
     * 构建阶段: 多阶段构建优化（builder + runner）
     * Next.js 输出: 使用 standalone 模式（output: 'standalone'）

   - 技术要求:
     * **必须**: 使用 .env.docker 管理端口配置
     * **必须**: 使用多阶段构建减小镜像大小
     * **必须**: 配置 .dockerignore（排除 node_modules, dist, .git）
     * **必须**: 使用匿名卷避免 node_modules 冲突
     * **禁止**: 在镜像中包含开发依赖（生产镜像）

   - 输出: 更新的 Docker 配置（3 个文件），.dockerignore，使用文档（DOCKER_GUIDE.md）
   - 验证: Docker 开发环境正常启动（docker-compose up -d）

4. **搜索 API 和清理 Agent** (Search-API-Cleanup)
   - 任务 1: 实现搜索 API
     * 位置: apps/website/app/api/search/route.ts

   - **📚 技术栈文档查询 (Context7 - 必须先查询)**:
     * Next.js 15: "Next.js 15 Route Handlers GET search params"
     * Fuse.js: "Fuse.js fuzzy search keys threshold options"
     * Fuse.js: "Fuse.js search results scoring refIndex"
     * Zod: "Zod string min max trim validation"

   - 任务 1 详细需求:
     * 组件搜索（名称、描述、标签、类别）
     * 配方搜索（名称、描述、七轴参数）
     * 文档搜索（标题、内容、代码示例）
     * 使用 Fuse.js 模糊搜索（threshold: 0.3, keys: ['name', 'description', 'tags']）
     * 支持分页（page, pageSize）
     * 返回高亮匹配结果

   - 任务 2: 清理测试页面
     * 扫描 apps/website/app/ 查找所有 test-* 文件
     * 删除测试页面（test-*.tsx, test-*.ts, *-test.tsx）
     * 删除无用的调试页面（debug-*, demo-*）
     * 更新路由配置（如果有硬编码路由）
     * 生成清理报告（删除文件清单）

   - 技术要求:
     * **必须**: 使用 Zod 验证搜索参数（q: string, type?: 'component' | 'recipe' | 'doc'）
     * **必须**: Fuse.js 配置 includeMatches: true（返回匹配位置）
     * **必须**: 搜索结果限制（最多 50 条）
     * **必须**: 使用 Glob 工具查找测试文件（不用 bash find）
     * **禁止**: 删除真实的测试文件（保留 *.test.tsx, *.spec.tsx）

   - 输出: 搜索 API 代码（含 TypeScript 类型），清理报告（删除文件清单），验证文档
   - 验证: 搜索功能可用，测试页面已删除

输出要求:
- 每个 Agent 提供完整包/配置
- 包含迁移指南和使用文档
- 提供回归测试清单
- 标注潜在风险和注意事项
```

**预估时间**: 5 天（并行）
**关键验证**: 生态系统完整，工具链完善

---

## 🎯 跨 Phase 协调规则

### Agent 协调原则

1. **依赖关系明确**
   - Phase N 必须等待 Phase N-1 完成
   - 同一 Phase 内的 Agent 可并行执行
   - 有前置依赖的 Agent 标注 "前置: 等待 Agent X"

2. **冲突避免**
   - 不同 Agent 不修改相同文件
   - 共享资源使用锁机制
   - Git 分支隔离（可选）

3. **输出标准化**
   - 所有 Agent 输出 Markdown 报告
   - 包含执行日志、验证结果、问题清单
   - 失败时提供明确的错误信息和修复建议

4. **验证一致性**
   - 每个 Agent 提供验证清单
   - Phase 结束时统一验证
   - 失败则回滚，重新执行

---

## 📊 执行追踪表

### Phase 1: 紧急修复
| Agent | 状态 | 耗时 | 输出 | 验证 |
|-------|------|------|------|------|
| 依赖修复 | ⏳ 待执行 | - | - | - |
| 构建修复 | ⏳ 待执行 | - | - | - |
| 开发验证 | ⏳ 待执行 | - | - | - |

### Phase 2: 核心功能
| Agent | 状态 | 耗时 | 输出 | 验证 |
|-------|------|------|------|------|
| 配方预览页面 | ⏳ 待执行 | - | - | - |
| Gallery 详情页 | ⏳ 待执行 | - | - | - |
| OKLCH 引擎 | ⏳ 待执行 | - | - | - |
| Compile API | ⏳ 待执行 | - | - | - |
| Registry API | ⏳ 待执行 | - | - | - |

### Phase 3: 质量提升
| Agent | 状态 | 耗时 | 输出 | 验证 |
|-------|------|------|------|------|
| 组件文档 | ⏳ 待执行 | - | - | - |
| Matrix 验证 | ⏳ 待执行 | - | - | - |
| TS 严格模式 | ⏳ 待执行 | - | - | - |
| DTS 生成 | ⏳ 待执行 | - | - | - |

### Phase 4: 生态完善
| Agent | 状态 | 耗时 | 输出 | 验证 |
|-------|------|------|------|------|
| I18n 包 | ⏳ 待执行 | - | - | - |
| Tokens/Recipe 包 | ⏳ 待执行 | - | - | - |
| Docker 更新 | ⏳ 待执行 | - | - | - |
| 搜索 API | ⏳ 待执行 | - | - | - |

---

## 🔍 验证检查清单

### 全局验证（每个 Phase 结束后）

**构建系统**:
- [ ] npm install 无错误
- [ ] npm run build 成功
- [ ] npm run test 通过
- [ ] npm run lint 无错误
- [ ] npm run type-check 无错误

**功能验证**:
- [ ] 所有新功能可访问
- [ ] 现有功能无回归
- [ ] API 端点正常工作
- [ ] 组件渲染正常

**文档验证**:
- [ ] 新增文档完整
- [ ] 代码示例可运行
- [ ] API 文档准确

**质量指标**:
- [ ] TypeScript 无错误
- [ ] 测试覆盖率 ≥80%
- [ ] 无安全漏洞
- [ ] 性能无退化

### 📋 全局验证检查清单

#### Phase 1 验证
- [ ] packages/core 构建成功（npm run build）
- [ ] 开发服务器可启动（Next.js网站热更新容器）
- [ ] 端口3100可正常监听

#### Phase 2 验证
- [ ] 所有新功能可正常构建
- [ ] 类型声明文件生成完整
- [ ] 所有组件导出类型正确
- [ ] 所有API响应格式正确
- [ ] 所有依赖版本匹配

#### Phase 3 验证
- [ ] 文档站点可访问（http://localhost:3000）
- [ ] 所有组件有文档和示例
- [ ] Matrix验证系统通过
- [ ] TypeScript严格模式无错误
- [ ] 所有包的类型声明文件完整且正确

#### Phase 4 验证
- [ ] 所有包可独立发布
- [ ] Docker镜像可构建
- [ ] 搜索API正常工作
- [ ] 旧代码清理完成
- [ ] 所有包的vite.config.ts中包含`external: ['@th-ui/core']`配置以解决Vite 7包解析问题

---

## 📝 执行日志模板

每个 Agent 执行后创建执行日志：

```markdown
# Agent 执行日志: [Agent 名称]

**执行时间**: 2025-10-12 14:30:00
**Phase**: Phase N
**预估时间**: X 小时
**实际耗时**: Y 小时

## 执行摘要
- ✅ 任务完成情况
- ⚠️ 遇到的问题
- 📝 解决方案

## 详细日志
[命令输出、错误信息、调试信息]

## 验证结果
- [ ] 验证项 1
- [ ] 验证项 2
- [ ] 验证项 3

## 输出文件
- 文件 1: /path/to/file1
- 文件 2: /path/to/file2

## 后续建议
1. 建议 1
2. 建议 2

## 签名
Agent: [Agent 名称]
Status: ✅ 成功 / ⚠️ 部分成功 / ❌ 失败
```

---

## 🎊 使用示例

### 示例 1: 执行 Phase 1

```bash
# 复制 Phase 1 的完整指令
claude-flow hive-mind 部署 3个紧急修复 Agent 并行执行：

1. **依赖修复 Agent** (DevOps-Fixer)
   [完整指令...]

2. **构建修复 Agent** (Build-Fixer)
   [完整指令...]

3. **开发环境验证 Agent** (Dev-Validator)
   [完整指令...]

输出要求: [...]
```

### 示例 2: 执行 Phase 2 单个 Agent

```bash
# 只执行配方预览页面 Agent
claude-flow hive-mind 部署 1个核心功能 Agent：

**配方预览页面 Agent** (Recipes-Page-Builder)
- 任务: 创建 /recipes 配方预览页面
- 位置: apps/website/app/recipes/page.tsx
[完整指令...]
```

---

## 📞 获取帮助

**查看统一执行计划**:
```bash
cat docs/reports/081-unified-execution-plan.md
```

**查看审查报告**:
```bash
ls -la docs/reports/
cat docs/reports/011-monorepo-architecture-audit.md
cat docs/reports/dependency-analysis-report.md
# ... 其他报告
```

**运行修复脚本**:
```bash
./scripts/quick-fix-build.sh
./scripts/fix-dependencies.sh
./scripts/check-deps.sh
```

---

**维护**: TH-UI Team
**版本**: 1.0.0
**最后更新**: 2025-10-12
