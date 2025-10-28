# 🎨 Xorigo UI 项目完整知识库

## 📋 项目概述

**Xorigo UI** 是一个基于 React 19 的现代化 UI 设计系统和组件库，采用 monorepo 架构，支持创新的七轴主题系统和动态配方系统。

**基本信息**：
- **版本**: 0.1.0
- **技术栈**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
- **构建工具**: Vite (Library Mode)
- **包管理**: pnpm (workspace monorepo)
- **测试**: Vitest + Testing Library
- **部署**: Docker (开发/生产环境)

## 🏗️ 项目架构

### Monorepo 结构

```
Xorigo-UI/
├── packages/                  # 核心包集合
│   ├── core/                  # 🎯 核心组件库
│   ├── style-recipe/          # 🍷 七轴风格配方系统
│   ├── tokens/                # 🎨 设计令牌系统
│   ├── system/                # 🌐 系统集成
│   ├── registry/              # 🏷️ 组件注册表
│   ├── i18n/                  # 🌐 国际化
│   ├── hooks/                 # 🪝 通用钩子
│   ├── cli/                   # 🛠️ 命令行工具
│   └── docs/                  # 📚 文档站点
├── apps/                      # 应用层
│   └── website/               # 🌐 官方网站 (Next.js 15)
├── scripts/                   # 📜 脚本工具集合
├── docs/                      # 📚 项目文档
└── .claude/skills/            # 🤖 Claude Code 技能生态
```

## 🎯 核心包详解

### 📦 packages/core - 核心组件库

**定位**: 主要的 UI 组件库，基于七轴主题系统构建

**核心架构**:
```
packages/core/src/
├── index.ts                   # 主入口，分层导出
├── foundations/               # 🏛️ 设计令牌系统
│   ├── index.ts              # 七轴主题系统聚合
│   ├── color-tokens.ts        # 颜色令牌 (HSL格式)
│   ├── density-tokens.ts      # 密度令牌 (间距/尺寸)
│   ├── motion-curves.ts       # 动画曲线 (motion轴)
│   ├── surface-tokens.ts      # 表面令牌 (surface轴)
│   └── utils/cn.ts           # 类名合并工具
├── system/                    # 🌐 系统级组件
│   ├── theme-provider.ts      # 主题提供者
│   ├── theme-axis-controller.ts
│   ├── accent-generator.ts
│   └── recipes/              # 系统配方
├── primitives/                # 🧬 原子组件
│   ├── button/               # 按钮原子组件
│   ├── card/                 # 卡片原子组件
│   └── surface/              # 表面原子组件
├── branding/                  # 🎨 品牌组件
├── feedback/                  # 💬 反馈组件 (Alert, Toast, Progress等)
├── layout/                    # 📐 布局组件 (Container, Grid, Flex等)
├── navigation/                # 🧭 导航组件 (Tabs, Menu, Sidebar等)
├── data-display/              # 📊 数据展示组件 (Card, Table, Stat等)
├── form/                      # 📝 表单组件 (Input, Select, Checkbox等)
├── typography/                # ✍️ 排版组件 (Hero, Text等)
├── motion/                    # 🎬 动画组件 (Framer Motion集成)
├── effects/                   # ✨ 特效组件 (粒子系统等)
├── showcase/                  # 🎪 演示组件
├── utils/                     # 🛠️ 通用工具函数
└── test/                      # 🧪 测试配置
```

**支持的模块导出**:
- 分类导出: `./theme`, `./ui`, `./inputs`, `./form`, `./navigation`, `./layout`, `./feedback`, `./datadisplay`, `./charts`, `./utilities`
- 组件导出: `./Button`, `./Card`, `./Input`, `./Modal`, `./Table`, `./Alert`, `./Toast` 等
- 特殊导出: `./effects`, `./showcase`, `./interactive`

### 🍷 packages/style-recipe - 七轴风格配方系统

**定位**: 提供完整的七轴风格配方系统，基于 OKLCH 色彩空间

**核心功能**:
- **七轴系统**: Mode, Base, Accent, Tone, Density, Motion, Surface
- **三层令牌架构**: Core, Role, Component
- **配方引擎**: StyleRecipeEngine
- **响应级别**: L0-L3 自适应系统
- **可访问性**: WCAG 2.2 合规性

**关键特性**:
- 支持动态主题切换
- 轴锁系统 (Axis Lock)
- 智能配方推荐
- 暗色模式非对称映射

### 🎨 packages/tokens - 设计令牌系统

**定位**: 基础设计令牌，支持 DTCG 标准

**核心模块**:
- **颜色系统**: HSL 格式 (计划迁移到 OKLCH)
- **主题验证**: Theme validation
- **CSS 变量**: CSS Variables 生成
- **转换器**: Token Transformer

## 🌈 七轴主题系统详解

### 核心七轴定义

```typescript
interface ThemeAxes {
  mode: 'light' | 'dark' | 'hc'           // 模式轴 - 明暗模式切换
  base: `${'neutral-warm' | 'neutral-cool' | 'neutral-true'}-${'low' | 'mid' | 'high'}` // 基础轴 - 色温和对比度
  accent: `${'mono' | 'analog' | 'duo'}(${string})` // 强调色轴 - 色彩策略
  tone: 'calm' | 'standard' | 'vivid'      // 色调轴 - 饱和度控制
  density: 'spacious' | 'comfortable' | 'compact' // 密度轴 - 间距和尺寸
  motion: `${'subtle' | 'standard' | 'expressive'}.${'classic' | 'soft' | 'spring'}` // 动画轴 - 时长和缓动
  surface: 'flat' | 'soft-shadow' | 'glass' | 'neon' | 'glass+neon' // 表面轴 - 材质效果
}
```

### 智能约束系统 (A11y Guard)

系统的核心特色是智能约束系统，自动确保主题组合的可访问性和用户体验：

**约束规则示例**:
- **高对比模式约束**: `motion × contrast` - 高对比模式下自动降级动效
- **色调与表面约束**: `tone × surface` - vivid + neon 组合自动降低饱和度
- **可访问性保护**: 自动确保对比度符合 WCAG 标准

## 🎨 设计令牌系统

### 1. 颜色令牌系统

**基础架构**:
- **格式**: HSL (当前) → OKLCH (计划迁移)
- **色阶**: 完整 950-50 色阶
- **色温变体**: neutral-warm, neutral-cool, neutral-true
- **主色系统**: primary, secondary 等
- **语义化颜色**: success, warning, danger, info

### 2. 密度令牌系统

**密度变体**:
- **compact**: 高信息密度，减少留白 (0.85x)
- **comfortable**: 标准间距，平衡密度与可读性 (1.0x)
- **spacious**: 增加留白，提高可读性 (1.15x)

**影响范围**:
- 间距系统 (spacing)
- 组件高度 (componentHeight)
- 内边距 (padding)
- 字体大小 (fontSize)

### 3. 动画曲线系统

**动画变体**:
- **subtle**: 微妙动效，最小化干扰
- **standard**: 标准动效，平衡体验
- **expressive**: 表现力动效，丰富视觉效果

**缓动类型**:
- **classic**: 经典贝塞尔曲线
- **soft**: 柔和缓动
- **spring**: 物理弹性动画

### 4. 表面材质系统

**表面变体**:
- **flat**: 无阴影，纯色表面
- **soft-shadow**: 轻微阴影，传统界面风格
- **glass**: 半透明背景 + 模糊效果
- **neon**: 发光效果，科技感
- **glass+neon**: 组合效果，未来感

## 🍷 配方系统架构

### 配方系统概述

配方系统是 Xorigo UI 主题系统的核心创新，将七轴配置转换为完整的主题定义：

```typescript
interface ThemeRecipe {
  id: string
  name: string
  axes: ThemeAxes
  tokens: Record<string, string | number>
  colors: ThemeColors
  surface: ThemeSurface
}
```

### 预定义配方示例

#### 企业蓝调配方
```typescript
corporateBlueRecipe: {
  id: 'corporate-blue',
  name: 'Corporate Blue',
  axes: {
    mode: 'light',
    base: 'neutral-cool-mid',
    accent: 'mono(blue)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'subtle.classic',
    surface: 'soft-shadow'
  }
}
```

#### 科技青配方
```typescript
techCyanRecipe: {
  id: 'tech-cyan',
  name: 'Tech Cyan',
  axes: {
    mode: 'dark',
    base: 'neutral-cool-mid',
    accent: 'mono(cyan)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'subtle.classic',
    surface: 'glass'
  }
}
```

## 🛠️ 技术栈详解

### 核心技术栈

**React 19**:
- 最新 React 版本，支持 Concurrent Features
- 完整的 TypeScript 集成
- 现代 Hooks 模式

**TypeScript 5.9**:
- 严格模式配置 (strict: true)
- 完整的类型推导
- 智能路径别名

**Tailwind CSS 4**:
- 原子化 CSS
- 完整的设计系统集成
- JIT 编译优化

**Framer Motion 12**:
- 高性能动画库
- 完整的手势支持
- SSR 兼容

### 构建配置

**Vite Library Mode**:
- 多入口点构建
- ES/CJS 双格式输出
- 完整的类型声明生成
- 智能外部化依赖

**构建优化**:
- Tree Shaking 支持
- 代码分割
- Source Maps
- 压缩优化

## 🌐 应用层架构

### 🖥️ apps/website - 官方网站

**技术栈**: Next.js 15 App Router

**核心结构**:
```
apps/website/
├── app/                       # Next.js App Router
│   ├── (marketing)/          # 营销路由
│   ├── (dashboard)/          # 仪表板路由
│   ├── (content)/            # 内容路由
│   └── api/                  # API 路由
├── src/
│   ├── components/           # 通用组件
│   ├── lib/                 # 工具库
│   ├── types/               # 类型定义
│   ├── data/                # 静态数据
│   └── hooks/               # 应用钩子
├── public/                  # 静态资源
└── docs/                    # 文档
```

**核心特性**:
- **组件预览**: 实时组件演示
- **配方系统**: 七轴配方展示和切换
- **主题测试**: 主题效果测试
- **性能监控**: 实时性能分析
- **智能工作台**: 集成开发工具

## 🎯 开发工作流

### 开发环境配置

**推荐开发模式**: 本地 + Docker 混合

**端口分配**:
- **端口 3000**: 保留给用户其他库使用 ⚠️ **不占用**
- **端口 3001**: 核心库开发服务器 ✅ **Vite 热更新**
- **端口 3100**: Website 开发服务器 ✅ **Next.js 热更新**
- **端口 6380**: Redis 开发服务器 ✅ **可选**

### 核心命令规范

```bash
# 开发环境（推荐）
pnpm local:dev           # 本地混合开发环境 (核心库+Website)
pnpm local:dev:all       # 同时启动核心库和网站
pnpm dev:core            # 仅启动核心库 (localhost:3001)
pnpm dev:website         # 仅启动网站 (localhost:3100)

# Docker 环境
pnpm docker:dev          # Docker 核心库模式
pnpm docker:dev:monorepo # Docker 完整模式

# 构建
pnpm build               # 构建组件库
pnpm build:strict        # 严格模式构建 (包含类型检查)
pnpm build:types         # 仅生成类型声明
pnpm build:all           # 构建所有工作空间

# 代码质量
pnpm lint                # ESLint 检查
pnpm lint:fix            # 自动修复
pnpm type-check          # TypeScript 类型检查
pnpm format              # Prettier 格式化

# 测试
pnpm test                # 运行测试
pnpm test:ui             # 测试 UI 界面
pnpm test:coverage       # 测试覆盖率

# 环境管理
node scripts/check-dev-env.js  # 检查开发环境
node scripts/dev-env-manager.js help  # 开发模式帮助
```

### 组件开发流程

1. **设计令牌定义** → 使用设计令牌管理技能
2. **组件实现** → 使用组件生成器技能
3. **类型定义** → 确保完整的 TypeScript 类型支持
4. **主题集成** → 验证在10种主题下的表现
5. **测试编写** → 在 `/tests` 中编写单元测试
6. **文档更新** → 更新组件使用文档

## 🤖 插件与技能生态

### 已安装的 Claude Code Plugins

#### Marketplace 1: claude-code-workflows (wshobson/agents)
**来源**: 专业开发工作流集合，包含66个插件

✅ **已激活插件**:
1. **code-documentation** - 自动文档生成
2. **unit-testing** - 单元测试自动生成
3. **code-review-ai** - AI驱动代码审查 🔥
4. **code-refactoring** - 代码重构和清理 🔥
5. **full-stack-orchestration** - 全栈开发编排 🔥

#### Marketplace 2: daymade-skills (daymade/claude-code-skills)
**来源**: 生产级技能集合，包含8个专业技能

✅ **已激活插件**:
1. **skill-creator** - 技能创建器 (元技能)

### 🛠️ 内置 Xorigo UI 专用技能 (24个)

#### 核心开发技能 (4个)
- `xorigo-component-generator` - 组件生成器
- `xorigo-design-tokens-manager` - 设计令牌管理
- `xorigo-seven-axis-theme-developer` - 七轴主题开发
- `xorigo-code-quality-guard` - 代码质量检测

#### 系统管理技能 (3个)
- `xorigo-docker-unified-manager` - Docker环境管理
- `xorigo-build-publish-constraints` - 构建发布约束
- `xorigo-migration-architecture-validator` - 架构迁移验证

#### 质量保证技能 (3个)
- `xorigo-test-automation` - 测试自动化
- `xorigo-design-validator` - 设计验证
- `xorigo-intelligent-constraints-system` - 智能约束系统

#### 文档和生成技能 (3个)
- `xorigo-docs-generator` - 文档生成
- `xorigo-docs-structure-helper` - 文档结构辅助
- `xorigo-performance-optimizer` - 性能优化

#### 专业化技能 (11个)
- `xorigo-component-api-constraints` - 组件API约束
- `xorigo-accessibility-generator` - 可访问性生成
- `xorigo-component-testing-generator` - 组件测试生成
- `xorigo-component-variants-standard` - 组件变体标准
- `xorigo-semantic-tokens-integrator` - 语义令牌集成
- `xorigo-recipe-registry-manager` - 配方注册管理
- `xorigo-theme-recipe-manager` - 主题配方管理
- `xorigo-theme-tester` - 主题测试器
- `xorigo-tech-stack-docs-querier` - 技术栈文档查询
- `xorigo-nextjs-architect-optimizer` - Next.js架构优化
- `xorigo-migration-audit-archiver` - 迁移审核归档

### 推荐工作流

```bash
# 1. 基线分析
/tech-debt "packages/core/src/components/"

# 2. 质量审查
/ai-review "审查核心组件的代码质量"

# 3. 重构优化
/refactor-clean "基于审查结果重构组件"

# 4. 测试完善
/test-generate "为重构后的组件生成测试"

# 5. 文档生成
/doc-generate "生成组件的完整API文档"
```

## 🧪 测试策略

### 单元测试标准

**测试框架**: Vitest + Testing Library

**组件测试模板**:
- **组件渲染测试**: 确保组件能正确渲染
- **Props 传递测试**: 验证所有 props 的正确处理
- **事件处理测试**: 测试用户交互事件
- **可访问性测试**: 验证 ARIA 属性和键盘导航
- **主题适配测试**: 确保在不同主题下正常显示

### 视觉回归测试

**工具**: Playwright

**核心功能**:
- **跨主题测试**: 在所有主题下验证组件视觉效果
- **响应式测试**: 验证不同屏幕尺寸下的表现
- **交互测试**: 验证用户交互的视觉效果
- **回归检测**: 自动发现视觉变化

## 📦 包管理与发布

### 包管理器: pnpm

**Workspace 配置**:
```yaml
workspaces:
  - "packages/*"
  - "apps/*"
```

### 发布策略

**版本管理**: Changesets

**发布流程**:
1. `pnpm changeset` - 添加变更集
2. `pnpm version-packages` - 版本号更新
3. `pnpm release` - 发布到 NPM

**发布渠道**:
- **stable**: 稳定版本
- **beta**: 测试版本
- **alpha**: 开发版本

## 🔧 配置文件详解

### 根目录配置

**package.json**:
- 项目元信息
- 脚本命令 (90+ 个命令)
- 开发依赖配置
- 代码质量工具配置

**tsconfig.base.json**:
- TypeScript 基础配置
- 路径别名映射
- 严格模式设置
- 工作空间包含配置

### 核心库配置

**packages/core/vite.config.ts**:
- 多入口点动态生成
- 分类导出支持
- 外部依赖配置
- 类型声明生成
- SSR 支持配置

**packages/core/package.json**:
- 详细导出映射 (30+ 个导出点)
- 按需导入支持
- 组件级导出
- 分类模块导出

## 🚨 重要约束和已知问题

### 当前限制

1. **TypeScript 严格模式**: 暂时部分禁用
2. **类型声明生成**: vite-plugin-dts 部分功能禁用
3. **Native 依赖问题**: 部分绑定在 WSL2 环境需要手动处理
4. **导入冲突警告**: 部分模块存在导出名称冲突（不影响运行）

### 开发禁令

**绝对禁止**:
- ❌ 硬编码颜色值，必须使用主题令牌
- ❌ 破坏10种主题配色的一致性
- ❌ 修改 `.npmignore` 或 `.gitignore`
- ❌ 提交 `node_modules`、`dist`、`.DS_Store`
- ❌ 使用 `@/` 绝对路径（库模式不支持）
- ❌ 修改 package.json 中的依赖版本（需要评估）

**谨慎操作**:
- ⚠️ 修改 Tailwind 配置（可能影响设计令牌）
- ⚠️ 更新 Vite 配置（可能影响构建）
- ⚠️ 修改 TypeScript 配置（可能影响类型检查）
- ⚠️ 清理依赖缓存（可能导致 native 重新安装问题）

## 📊 项目成熟度评估

- **架构设计**: ✅ 成熟 (模块化、可扩展)
- **组件体系**: ✅ 完善 (覆盖主要 UI 需求)
- **主题系统**: ✅ 创新 (七轴主题配方)
- **文档体系**: ✅ 完整 (自动生成 + 使用指南)
- **开发工具**: ✅ 完善 (热更新 + 测试 + 调试)
- **部署能力**: ✅ 成熟 (Docker + CI/CD)
- **测试覆盖**: ✅ 完善 (单元 + 视觉 + 可访问性)
- **技能生态**: ✅ 丰富 (24个专用技能)

## 🔮 未来发展方向

### 近期目标 (0.2.x)
- **OKLCH 完整迁移**: 从 HSL 完全迁移到 OKLCH 色彩空间
- **TypeScript 严格模式**: 启用完整的严格模式检查
- **组件库完善**: 补充缺失的常用组件
- **文档网站**: 完善文档网站的交互体验

### 中期目标 (0.3.x)
- **AI 配方生成**: 基于用户偏好自动生成主题
- **社区配方库**: 开放平台让用户分享和发现主题
- **动态配方**: 根据时间、环境、用户状态动态调整
- **设计工具集成**: 与 Figma、Sketch 等设计工具集成

### 长期愿景 (1.0.x)
- **生态系统**: 完整的组件生态和插件系统
- **企业级功能**: 企业级主题管理和定制服务
- **国际化**: 完整的多语言和 RTL 支持
- **移动端**: React Native 和 Flutter 支持

## 💡 核心优势总结

1. **创新性**: 七轴主题系统的创新设计
2. **完整性**: 从设计令牌到组件的完整体系
3. **可扩展性**: 模块化的架构支持快速扩展
4. **开发友好**: 完善的工具链和开发体验
5. **可访问性**: 优先考虑可访问性设计
6. **性能优化**: 多层次的性能优化策略
7. **类型安全**: 完整的 TypeScript 支持
8. **智能约束**: 自动防止不良设计组合

## 🎯 使用建议

### 新项目启动
1. 使用 `xorigo-component-generator` 技能生成初始组件
2. 配置七轴主题系统
3. 选择合适的预定义配方
4. 根据需求进行主题定制

### 团队协作
1. 使用 `xorigo-code-quality-guard` 确保代码质量
2. 使用 `xorigo-design-validator` 验证设计一致性
3. 使用 `xorigo-test-automation` 自动化测试流程
4. 使用 `xorigo-docs-generator` 自动生成文档

### 持续维护
1. 定期使用 `xorigo-performance-optimizer` 优化性能
2. 使用 `xorigo-intelligent-constraints-system` 验证主题约束
3. 使用 `xorigo-theme-tester` 测试主题兼容性
4. 关注 Changesets 版本管理

---

**维护**: Xorigo UI Team
**版本**: 0.1.0
**更新时间**: 2025-10-28
**文档状态**: 完整 ✅
**技术栈**: React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
**部署状态**: ✅ 本地 + Docker 混合开发环境就绪
**依赖状态**: ✅ Native 依赖已修复，工作空间正常运行