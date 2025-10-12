# 🚀 Xorigo UI 迁移规划文档

## 📋 项目概述

从 Xorigo UI 原点设计系统 项目中提取独立的 UI 设计系统,创建 Xorigo UI 独立组件库项目。

**源目录**: `/home/saken/project/Xorigo UI 原点设计系统/packages/admin/src/ui-design/`
**目标目录**: `/home/saken/project/Xorigo UI/`

## 📊 源项目分析

### 技术栈
- **框架**: Next.js 15.5 + React 19
- **样式**: Tailwind CSS 4 + CSS Modules
- **动画**: Framer Motion 12
- **UI组件**: Radix UI + shadcn/ui v4
- **类型**: TypeScript 5.9
- **变体系统**: class-variance-authority (CVA)
- **状态管理**: Zustand

### 目录结构分析
```
ui-design/                  # 源目录 (共21个组件文件)
├── tokens/                 # 设计令牌系统 (4个文件)
│   ├── theme-tokens.ts
│   ├── theme-provider.tsx
│   ├── color-palettes.ts
│   └── animation-constants.ts
├── components/             # 组件库 (8个分类)
│   ├── core/              # 核心组件 (1个文件)
│   ├── forms/             # 表单组件 (3个文件)
│   ├── advanced/          # 高级组件 (6个文件)
│   ├── layout/            # 布局组件 (1个文件)
│   ├── navigation/        # 导航组件 (3个文件)
│   ├── feedback/          # 反馈组件 (3个文件)
│   ├── data/              # 数据组件 (1个文件)
│   ├── overlay/           # 覆盖层组件 (1个文件)
│   └── accessible/        # 无障碍组件 (1个文件)
├── pages/                 # 页面示例 (9个文件)
├── layouts/               # 布局模板 (4个文件)
├── examples/              # 示例展示 (1个文件)
├── mock/                  # 模拟数据 (2个文件)
├── app/                   # Next.js入口 (2个文件)
├── assets/                # 资源文件
└── 文档                   # README.md + UI-DESIGN-DOCUMENTATION.md
```

### 组件清单

#### 🎨 设计系统核心
- **主题系统**: 10种配色方案(经典/现代/自然/优雅/活泼)
- **令牌系统**: 颜色/间距/字体/阴影/动画

#### 🧩 组件分类 (21个组件文件)

**核心组件** (core/)
- base-components.tsx: Button, Card, Input (12+9+5=26种变体)

**表单组件** (forms/)
- Input.tsx: 输入框组件
- Select.tsx: 选择器组件
- Checkbox.tsx: 复选框组件

**高级组件** (advanced/)
- interactive-components.tsx: 磁性按钮/涟漪效果/浮动标签等
- AnimatedCard.tsx: 动画卡片
- InteractionStates.tsx: 交互状态
- MicroInteractions.tsx: 微交互
- ResponsiveLayout.tsx: 响应式布局
- ThemeToggle.tsx: 主题切换器

**布局组件** (layout/)
- AdvancedCard.tsx: 高级卡片布局

**导航组件** (navigation/)
- Header.tsx: 头部导航
- Sidebar.tsx: 侧边栏
- Breadcrumb.tsx: 面包屑

**反馈组件** (feedback/)
- Alert.tsx: 警告提示
- Loading.tsx: 加载状态
- Notifications.tsx: 通知系统

**数据组件** (data/)
- DataTable.tsx: 数据表格

**覆盖层组件** (overlay/)
- Modal.tsx: 模态框

**无障碍组件** (accessible/)
- AccessibleButton.tsx: 无障碍按钮

## 🎯 目标项目规划

### 项目类型
**独立 UI 组件库** - 可发布到 npm,供其他项目使用

### 目录结构设计

```
Xorigo UI/
├── src/                           # 源代码
│   ├── tokens/                    # 设计令牌
│   │   ├── colors.ts             # 颜色令牌
│   │   ├── spacing.ts            # 间距令牌
│   │   ├── typography.ts         # 字体令牌
│   │   ├── shadows.ts            # 阴影令牌
│   │   ├── animations.ts         # 动画令牌
│   │   ├── themes.ts             # 主题配置
│   │   └── index.ts              # 统一导出
│   ├── theme/                    # 主题系统
│   │   ├── ThemeProvider.tsx    # 主题提供者
│   │   ├── useTheme.ts          # 主题钩子
│   │   ├── palettes.ts          # 配色方案
│   │   └── index.ts
│   ├── components/               # 组件库
│   │   ├── Button/              # 按钮组件
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.stories.tsx (Storybook)
│   │   │   └── index.ts
│   │   ├── Card/                # 卡片组件
│   │   ├── Input/               # 输入框组件
│   │   ├── Select/              # 选择器组件
│   │   ├── Checkbox/            # 复选框组件
│   │   ├── Modal/               # 模态框组件
│   │   ├── DataTable/           # 数据表格
│   │   ├── Navigation/          # 导航组合
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── index.ts
│   │   ├── Feedback/            # 反馈组合
│   │   │   ├── Alert.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Notifications.tsx
│   │   │   └── index.ts
│   │   ├── Advanced/            # 高级组件
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── RippleEffect.tsx
│   │   │   ├── AnimatedCard.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   └── index.ts             # 组件统一导出
│   ├── layouts/                 # 布局模板
│   │   ├── CardLayout.tsx
│   │   ├── ContentLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── ShellLayout.tsx
│   │   └── index.ts
│   ├── hooks/                   # 自定义钩子
│   │   ├── useTheme.ts
│   │   ├── useMediaQuery.ts
│   │   └── index.ts
│   ├── utils/                   # 工具函数
│   │   ├── cn.ts               # classname合并
│   │   ├── color.ts            # 颜色工具
│   │   └── index.ts
│   └── index.ts                 # 库入口
├── examples/                    # 示例项目
│   ├── next-app/               # Next.js示例
│   ├── react-app/              # React示例
│   └── showcase/               # 组件展示
├── docs/                       # 文档
│   ├── getting-started.md
│   ├── components/             # 组件文档
│   ├── themes.md               # 主题文档
│   └── migration.md            # 迁移指南
├── scripts/                    # 构建脚本
│   ├── build.js
│   └── dev.js
├── .storybook/                 # Storybook配置
├── tests/                      # 测试
│   ├── unit/
│   └── e2e/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts              # Vite构建配置
├── README.md
├── CHANGELOG.md
└── LICENSE
```

## 📝 文件命名规范

### 组件命名
- **组件文件**: PascalCase (Button.tsx, DataTable.tsx)
- **类型文件**: PascalCase + .types.ts (Button.types.ts)
- **工具文件**: camelCase (cn.ts, useTheme.ts)
- **配置文件**: kebab-case (tailwind.config.ts)
- **文档文件**: kebab-case (getting-started.md)

### 导出规范
- **组件目录**: 每个组件独立目录,包含 index.ts 统一导出
- **分类导出**: 按功能分类(Navigation/, Feedback/, Advanced/)
- **barrel exports**: 使用 index.ts 作为导出桶

### 文件组织
```
Component/
├── Component.tsx           # 组件实现
├── Component.types.ts      # 类型定义
├── Component.stories.tsx   # Storybook故事
├── Component.test.tsx      # 单元测试
└── index.ts               # 导出入口
```

## 🔄 迁移策略

### 阶段1: 项目初始化
**目标**: 搭建基础项目结构

**任务**:
1. 初始化 package.json (组件库模式)
2. 配置 TypeScript (严格模式)
3. 配置 Tailwind CSS 4
4. 配置 Vite 构建工具
5. 配置 ESLint + Prettier
6. 创建基础目录结构

**依赖安装**:
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "framer-motion": "^12.23.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "typescript": "~5.9.3",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^5.0.3",
    "tailwindcss": "^4.1.13",
    "autoprefixer": "^10.4.21",
    "vitest": "^1.6.0"
  }
}
```

### 阶段2: 设计系统迁移
**目标**: 迁移令牌系统和主题系统

**任务**:
1. **迁移设计令牌** (tokens/)
   - 拆分 theme-tokens.ts → colors.ts, spacing.ts, typography.ts, shadows.ts
   - 优化结构,提高可维护性
   - 保持配色方案完整性

2. **迁移主题系统** (theme/)
   - theme-provider.tsx → ThemeProvider.tsx
   - 提取 hooks 到 hooks/useTheme.ts
   - color-palettes.ts → palettes.ts
   - animation-constants.ts → tokens/animations.ts

3. **测试验证**
   - 确保10种主题配置正确
   - 主题切换功能完整
   - 类型定义完善

### 阶段3: 核心组件迁移
**目标**: 迁移基础UI组件

**迁移优先级**:

**P0 - 核心组件** (必须)
1. Button (12种变体)
2. Card (9种变体)
3. Input (5种变体)

**P1 - 表单组件** (重要)
4. Select
5. Checkbox

**P2 - 布局组件** (重要)
6. AdvancedCard
7. Layouts (4个布局模板)

**迁移步骤** (每个组件):
1. 创建组件目录 (src/components/ComponentName/)
2. 拆分组件文件 (Component.tsx)
3. 创建类型文件 (Component.types.ts)
4. 调整导入路径 (使用相对路径或别名)
5. 添加 index.ts 导出
6. 编写单元测试
7. 创建 Storybook 故事

### 阶段4: 高级组件迁移
**目标**: 迁移高级交互组件

**组件列表**:
1. interactive-components.tsx → 拆分为独立组件
   - MagneticButton.tsx
   - RippleEffect.tsx
   - FloatingLabel.tsx
   - PulseLoader.tsx
   - SmartTooltip.tsx
   - FlipSwitch.tsx
   - ProgressRing.tsx
   - GradientBorderCard.tsx
   - FloatingActionButton.tsx
   - StarRating.tsx

2. AnimatedCard.tsx
3. InteractionStates.tsx
4. MicroInteractions.tsx
5. ResponsiveLayout.tsx
6. ThemeToggle.tsx

### 阶段5: 导航和反馈组件
**目标**: 迁移导航和用户反馈组件

**Navigation/**:
- Header.tsx
- Sidebar.tsx
- Breadcrumb.tsx

**Feedback/**:
- Alert.tsx
- Loading.tsx
- Notifications.tsx

**Data/**:
- DataTable.tsx

**Overlay/**:
- Modal.tsx

**Accessible/**:
- AccessibleButton.tsx

### 阶段6: 示例和文档
**目标**: 创建示例项目和完整文档

**任务**:
1. **示例项目**
   - examples/showcase/ - 组件展示页面
   - examples/next-app/ - Next.js集成示例
   - examples/react-app/ - React集成示例

2. **文档编写**
   - docs/getting-started.md - 快速开始
   - docs/components/ - 每个组件的详细文档
   - docs/themes.md - 主题系统文档
   - docs/migration.md - 从Xorigo UI 原点设计系统迁移指南

3. **Storybook配置**
   - 配置 @storybook/react
   - 为每个组件编写 stories
   - 主题切换装饰器

### 阶段7: 构建和发布
**目标**: 配置构建流程,准备发布

**任务**:
1. **构建配置**
   - Vite library mode
   - 生成类型声明文件 (.d.ts)
   - CSS提取和优化
   - Tree-shaking优化

2. **测试覆盖**
   - 单元测试 (Vitest)
   - 组件测试 (React Testing Library)
   - E2E测试 (Playwright)
   - 可访问性测试

3. **CI/CD配置**
   - GitHub Actions
   - 自动化测试
   - 自动化发布

4. **发布准备**
   - package.json配置 (name, version, exports)
   - README.md
   - CHANGELOG.md
   - LICENSE

## 📦 构建配置

### Vite配置 (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'] })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Xorigo UI',
      formats: ['es', 'cjs'],
      fileName: (format) => `xorigo-ui.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'FramerMotion'
        }
      }
    }
  }
})
```

### package.json配置
```json
{
  "name": "@xorigo-ui/core",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/xorigo-ui.cjs.js",
  "module": "./dist/xorigo-ui.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/xorigo-ui.es.js",
      "require": "./dist/xorigo-ui.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./theme": {
      "import": "./dist/theme.es.js",
      "require": "./dist/theme.cjs.js",
      "types": "./dist/theme/index.d.ts"
    }
  },
  "files": ["dist", "README.md"],
  "sideEffects": false
}
```

## ⚠️ 注意事项

### 依赖处理
1. **peer dependencies**: React, React-DOM, Framer Motion
2. **可选依赖**: Radix UI (根据组件需要)
3. **去除依赖**:
   - Next.js特定API (移除 'use client' 指令)
   - Zustand (如果只在示例中使用)
   - TanStack Query (如果只在示例中使用)

### 代码调整
1. **移除 Next.js 特性**
   - 移除 'use client' 指令
   - 调整动态导入语法
   - 移除 Next.js 特定hooks

2. **路径调整**
   - 使用相对路径或配置别名
   - 统一导入路径规范
   - 更新所有内部引用

3. **类型完善**
   - 所有组件添加完整类型定义
   - 导出所有公共类型
   - 使用严格模式 TypeScript

### 保持功能完整
1. **主题系统**: 保持10种配色方案完整
2. **变体系统**: 保持所有组件变体(Button 12种, Card 9种, Input 5种)
3. **动画效果**: 保持 Framer Motion 动画
4. **可访问性**: 保持 ARIA 标签和键盘导航

## 📊 进度追踪

### 任务清单
- [ ] 阶段1: 项目初始化
  - [ ] package.json配置
  - [ ] TypeScript配置
  - [ ] Vite配置
  - [ ] 目录结构创建
- [ ] 阶段2: 设计系统迁移
  - [ ] 设计令牌迁移
  - [ ] 主题系统迁移
  - [ ] 配色方案验证
- [ ] 阶段3: 核心组件迁移
  - [ ] Button组件
  - [ ] Card组件
  - [ ] Input组件
  - [ ] Select组件
  - [ ] Checkbox组件
- [ ] 阶段4: 高级组件迁移
  - [ ] 交互组件拆分
  - [ ] 动画组件
  - [ ] 主题切换器
- [ ] 阶段5: 导航和反馈组件
  - [ ] 导航组件
  - [ ] 反馈组件
  - [ ] 数据组件
  - [ ] 覆盖层组件
- [ ] 阶段6: 示例和文档
  - [ ] Showcase示例
  - [ ] Next.js示例
  - [ ] 组件文档
  - [ ] Storybook配置
- [ ] 阶段7: 构建和发布
  - [ ] 构建配置
  - [ ] 测试覆盖
  - [ ] CI/CD配置
  - [ ] 发布准备

## 🎯 成功标准

### 功能完整性
- ✅ 所有21个组件文件成功迁移
- ✅ 10种主题配色方案完整
- ✅ 所有组件变体保持不变
- ✅ 动画效果流畅运行

### 代码质量
- ✅ TypeScript严格模式无错误
- ✅ ESLint检查通过
- ✅ 单元测试覆盖率 >80%
- ✅ 所有组件有Storybook故事

### 可用性
- ✅ npm包可成功安装
- ✅ 示例项目运行正常
- ✅ 文档完整清晰
- ✅ 可访问性测试通过

## 📚 参考资源

### 技术文档
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [CVA (class-variance-authority)](https://cva.style)

### 设计系统
- [Radix UI](https://www.radix-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind UI](https://tailwindui.com/)

---

**创建时间**: 2025-10-09
**最后更新**: 2025-10-09
**负责人**: Xorigo UI开发团队
