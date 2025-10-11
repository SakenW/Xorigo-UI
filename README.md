# 🎨 TH-UI

基于 Trans-Hub 提取的现代 UI 组件库，采用七轴样式配方系统和 OKLCH 色彩引擎

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Architecture](https://img.shields.io/badge/Architecture-Seven%20Axis-purple)](./docs/architecture/SEVEN_AXIS_SYSTEM.md)

## ✨ 核心特性

- 🎨 **17+ 核心组件** - Button、Card、Input、Modal 等完整组件库
- 🌈 **10 种主题配方** - 专业蓝、现代极简、温暖创意等精心设计的主题
- 🎭 **七轴样式系统** - Mode、Base、Accent、Tone、Density、Motion、Surface 七个维度
- 🎨 **OKLCH 色彩引擎** - 感知均匀的色彩空间，确保视觉一致性
- 🌍 **完整国际化** - 独立 i18n 包，支持中英文等多语言
- ♿ **可访问性优先** - Matrix 规则系统，WCAG AA/AAA 标准验证
- ⚡ **Framer Motion 12** - 流畅的动画效果和微交互
- 🎯 **TypeScript 5.9** - 完整的类型定义和类型安全
- 📱 **响应式设计** - 移动优先的自适应布局
- 🐳 **Docker 支持** - 开发和生产环境容器化部署

## 📦 安装

TH-UI 支持所有主流包管理器：npm、pnpm、yarn 和 bun。

```bash
# npm
npm install @th-ui/core

# pnpm (推荐)
pnpm add @th-ui/core

# yarn
yarn add @th-ui/core

# bun
bun add @th-ui/core
```

## 🚀 快速开始

### 基础使用

```tsx
import { Button, Card, StyleRecipeProvider } from '@th-ui/core'

function App() {
  return (
    <StyleRecipeProvider recipe="professional-blue">
      <Card>
        <h1>欢迎使用 TH-UI</h1>
        <Button variant="primary" size="lg">
          开始使用
        </Button>
      </Card>
    </StyleRecipeProvider>
  )
}
```

### 七轴样式系统

```tsx
import { StyleRecipeProvider } from '@th-ui/core'

function App() {
  return (
    <StyleRecipeProvider
      recipe="professional-blue"
      config={{
        mode: 'light',           // 模式：light/dark
        base: 'neutral',         // 基础：neutral/warm/cool
        accent: 'blue',          // 强调色：blue/green/red/purple
        tone: 'vibrant',         // 色调：muted/vibrant/pastel
        density: 'comfortable',  // 密度：compact/comfortable/spacious
        motion: 'smooth',        // 动效：none/subtle/smooth/bouncy
        surface: 'matte'         // 表面：matte/gloss/texture
      }}
    >
      {/* 你的应用 */}
    </StyleRecipeProvider>
  )
}
```

### 主题配方

TH-UI 包含 10 种精心设计的主题配方：

**商务风格**：
- `professional-blue` - 专业蓝 (适合企业应用)
- `modern-minimal` - 现代极简 (简洁现代)

**创意风格**：
- `warm-creative` - 温暖创意 (活泼配色)
- `nature-fresh` - 自然清新 (自然色调)

**经典风格**：
- `dark-night` - 暗夜模式 (深色主题)
- `light-pure` - 纯净亮色 (明亮主题)

```tsx
import { useStyleRecipe } from '@th-ui/core'

function ThemeSelector() {
  const { setRecipe, recipe } = useStyleRecipe()

  return (
    <div>
      <h3>当前主题：{recipe}</h3>
      <button onClick={() => setRecipe('professional-blue')}>
        专业蓝主题
      </button>
      <button onClick={() => setRecipe('warm-creative')}>
        温暖创意主题
      </button>
    </div>
  )
}
```

## 📚 组件库

### 核心组件
- **Button** (4 variants) - primary, secondary, outline, ghost
- **Card** (3 variants) - default, elevated, glass
- **Input** (3 variants) - default, outlined, filled
- **Modal** - 完整的模态框系统
- **Alert** - success, warning, error, info
- **Badge** - 状态徽章
- **Avatar** - 用户头像
- **Switch** - 开关组件
- **Checkbox** - 复选框
- **Radio** - 单选框
- **Select** - 下拉选择
- **Textarea** - 文本域
- **Progress** - 进度条
- **Spinner** - 加载指示器
- **Tooltip** - 提示框
- **Divider** - 分割线
- **Tabs** - 标签页

### 高级组件
- **DataTable** - 数据表格，支持排序、筛选
- **Form** - 表单组件集成
- **Navigation** - 导航组件
- **Breadcrumb** - 面包屑导航
- **Pagination** - 分页组件

### 组件变体

每个组件都有多种变体和尺寸：

```tsx
// Button 组件示例
<Button variant="primary" size="sm">小按钮</Button>
<Button variant="secondary" size="md">中等按钮</Button>
<Button variant="outline" size="lg">大按钮</Button>
<Button variant="ghost" disabled>禁用按钮</Button>

// Card 组件示例
<Card variant="default">默认卡片</Card>
<Card variant="elevated">悬浮卡片</Card>
<Card variant="glass">玻璃卡片</Card>
```

## 🌍 国际化支持

TH-UI 提供完整的国际化支持：

```tsx
import { StyleRecipeProvider } from '@th-ui/core'
import { I18nManager } from '@th-ui/i18n'

// 初始化国际化
const i18n = I18nManager.getInstance()
await i18n.initialize('zh-CN')

function App() {
  return (
    <StyleRecipeProvider recipe="professional-blue" locale="zh-CN">
      {/* 所有组件文本自动本地化 */}
    </StyleRecipeProvider>
  )
}
```

支持的语言：
- `zh-CN` - 简体中文 (默认)
- `zh-TW` - 繁体中文 (计划中)
- `en-US` - 英文 (计划中)
- `ja-JP` - 日文 (计划中)

## 🛠️ 开发

### 环境要求

- Node.js 22+
- 包管理器（任选其一）:
  - npm 10+
  - pnpm 9+ (推荐，性能更好)
  - yarn 4+
  - bun 1+

### 安装依赖

TH-UI 支持所有主流包管理器，选择你喜欢的即可：

```bash
# npm
npm install

# pnpm (推荐 - 速度快、节省磁盘空间)
pnpm install

# yarn
yarn install

# bun (最快)
bun install
```

> **💡 提示**: 推荐使用 **pnpm** 或 **bun** 以获得更好的性能和磁盘空间利用率。

### 开发环境

```bash
# 本地开发服务器
npm run dev
# or
npm run docker:dev  # Docker 开发环境
```

### 构建

```bash
# 构建组件库
npm run build

# 严格模式构建 (包含类型检查)
npm run build:strict

# 仅生成类型声明
npm run build:types
```

### 代码质量

```bash
# ESLint 检查
npm run lint

# 自动修复
npm run lint:fix

# TypeScript 类型检查
npm run type-check

# Prettier 格式化
npm run format
```

### 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# 可视化测试界面
npm run test:ui
```

### Docker 部署

```bash
# 开发环境 (端口 3100)
npm run docker:dev

# 生产环境部署
npm run deploy

# 查看生产日志
npm run deploy:logs

# 停止生产环境
npm run deploy:stop
```

## 📖 架构文档

TH-UI 采用先进的架构设计：

### 核心系统
- [**七轴样式系统**](./docs/architecture/SEVEN_AXIS_SYSTEM.md) - Mode, Base, Accent, Tone, Density, Motion, Surface
- [**OKLCH 色彩引擎**](./docs/architecture/OKLCH_COLOR_GUIDE.md) - 感知均匀的色彩空间
- [**Registry 标准**](./docs/architecture/REGISTRY_STANDARDS.md) - 组件注册和验证系统
- [**Matrix 规则系统**](./docs/architecture/MATRIX_RULES_SYSTEM.md) - 可访问性验证和热力图

### 前端应用
- [**Next.js 架构**](./docs/architecture/NEXTJS_ARCHITECTURE.md) - Gallery、Adoption Matrix、Playground
- [**组件展示规范**](./docs/architecture/COMPONENTS_SHOWCASE.md) - 完整组件效果展示
- [**国际化系统**](./docs/architecture/I18N_PACKAGE_DESIGN.md) - 独立 i18n 包设计

### 完整列表
- [**架构文档索引**](./docs/architecture/) - 所有技术文档

## 🌐 生态系统

### 核心包
- `@th-ui/core` - 核心组件库
- `@th-ui/style-recipe` - 样式配方系统
- `@th-ui/i18n` - 国际化包
- `@th-ui/matrix` - 可访问性验证系统

### 应用
- `@th-ui/gallery` - 主题展示馆
- `@th-ui/adoption-matrix` - 采用矩阵工具
- `@th-ui/playground` - 在线试验场

### 开发工具
- `@th-ui/cli` - 命令行工具
- `@th-ui/lint-config` - ESLint 配置
- `@th-ui/ts-config` - TypeScript 配置

## 🤝 贡献

我们欢迎所有形式的贡献！

### 贡献类型
- 🐛 Bug 报告
- ✨ 新功能请求
- 📝 文档改进
- 🎨 设计贡献
- 🔧 代码贡献

### 开发流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT © TH-UI Team

## 🙏 致谢

### 核心技术栈
- [React 19.2.0](https://react.dev/) - 用户界面库
- [TypeScript 5.9.3](https://www.typescriptlang.org/) - 类型安全的 JavaScript
- [Tailwind CSS 4.1.14](https://tailwindcss.com/) - 原子化 CSS 框架 ✨ **Lightning CSS Engine**
- [Framer Motion 12.23.5](https://www.framer.com/motion/) - 动画库
- [Vite 5.4](https://vitejs.dev/) - 构建工具

### 设计灵感
- [Trans-Hub](https://trans-hub.com/) - 设计系统灵感来源
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件基础
- [OKLCH 色彩空间](https://oklch.com/) - 现代色彩科学

### 特别感谢
TH-UI 基于 Trans-Hub 的设计理念，结合现代前端技术栈，为中文用户打造的现代化组件库。

---

**项目状态**: 🚧 Phase 2 - 架构设计完成，进入核心功能实现

**开发进度**:
- ✅ Phase 1: 项目初始化和基础配置
- ✅ Phase 2: 架构设计和系统规划
- 🚧 Phase 3: 组件库核心功能实现
- ⏳ Phase 4: 前端应用开发
- ⏳ Phase 5: 生态系统完善
