# 🏗️ TH-UI 项目结构规划

## 📁 完整目录结构

```
TH-UI/
├── 📂 src/                              # 源代码目录
│   ├── 📂 tokens/                       # 设计令牌系统
│   │   ├── colors.ts                   # 颜色令牌 (10种配色方案)
│   │   ├── spacing.ts                  # 间距令牌 (4px网格系统)
│   │   ├── typography.ts               # 字体令牌 (Inter + JetBrains Mono)
│   │   ├── shadows.ts                  # 阴影令牌 (xs到2xl)
│   │   ├── animations.ts               # 动画令牌 (缓动函数、持续时间)
│   │   ├── themes.ts                   # 主题配置聚合
│   │   └── index.ts                    # 统一导出
│   │
│   ├── 📂 theme/                        # 主题系统
│   │   ├── ThemeProvider.tsx           # 主题上下文提供者
│   │   ├── useTheme.ts                 # 主题钩子
│   │   ├── palettes.ts                 # 10种配色方案详细配置
│   │   ├── utils.ts                    # 主题工具函数
│   │   └── index.ts
│   │
│   ├── 📂 components/                   # 组件库 (21个组件)
│   │   │
│   │   ├── 📂 Button/                  # 按钮组件 (12种变体)
│   │   │   ├── Button.tsx              # 组件实现
│   │   │   ├── Button.types.ts         # TypeScript类型
│   │   │   ├── Button.stories.tsx      # Storybook故事
│   │   │   ├── Button.test.tsx         # 单元测试
│   │   │   └── index.ts                # 导出
│   │   │
│   │   ├── 📂 Card/                    # 卡片组件 (9种变体)
│   │   │   ├── Card.tsx
│   │   │   ├── Card.types.ts
│   │   │   ├── Card.stories.tsx
│   │   │   ├── Card.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Input/                   # 输入框组件 (5种变体)
│   │   │   ├── Input.tsx
│   │   │   ├── Input.types.ts
│   │   │   ├── Input.stories.tsx
│   │   │   ├── Input.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Select/                  # 选择器组件
│   │   │   ├── Select.tsx
│   │   │   ├── Select.types.ts
│   │   │   ├── Select.stories.tsx
│   │   │   ├── Select.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Checkbox/                # 复选框组件
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Checkbox.types.ts
│   │   │   ├── Checkbox.stories.tsx
│   │   │   ├── Checkbox.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Modal/                   # 模态框组件
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.types.ts
│   │   │   ├── Modal.stories.tsx
│   │   │   ├── Modal.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 DataTable/               # 数据表格组件
│   │   │   ├── DataTable.tsx
│   │   │   ├── DataTable.types.ts
│   │   │   ├── DataTable.stories.tsx
│   │   │   ├── DataTable.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Navigation/              # 导航组件组合
│   │   │   ├── Header.tsx              # 头部导航
│   │   │   ├── Sidebar.tsx             # 侧边栏
│   │   │   ├── Breadcrumb.tsx          # 面包屑
│   │   │   ├── Navigation.types.ts
│   │   │   ├── Navigation.stories.tsx
│   │   │   ├── Navigation.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Feedback/                # 反馈组件组合
│   │   │   ├── Alert.tsx               # 警告提示
│   │   │   ├── Loading.tsx             # 加载状态
│   │   │   ├── Notifications.tsx       # 通知系统
│   │   │   ├── Feedback.types.ts
│   │   │   ├── Feedback.stories.tsx
│   │   │   ├── Feedback.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Advanced/                # 高级组件 (10+个组件)
│   │   │   ├── MagneticButton.tsx      # 磁性按钮
│   │   │   ├── RippleEffect.tsx        # 涟漪效果
│   │   │   ├── FloatingLabel.tsx       # 浮动标签
│   │   │   ├── PulseLoader.tsx         # 脉冲加载器
│   │   │   ├── SmartTooltip.tsx        # 智能提示框
│   │   │   ├── FlipSwitch.tsx          # 翻转开关
│   │   │   ├── ProgressRing.tsx        # 环形进度条
│   │   │   ├── AnimatedCard.tsx        # 动画卡片
│   │   │   ├── ThemeToggle.tsx         # 主题切换器
│   │   │   ├── Advanced.types.ts
│   │   │   ├── Advanced.stories.tsx
│   │   │   ├── Advanced.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 Layout/                  # 布局组件
│   │   │   ├── AdvancedCard.tsx        # 高级卡片布局
│   │   │   ├── Layout.types.ts
│   │   │   ├── Layout.stories.tsx
│   │   │   ├── Layout.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                    # 组件库统一导出
│   │
│   ├── 📂 layouts/                     # 布局模板
│   │   ├── CardLayout.tsx              # 卡片布局
│   │   ├── ContentLayout.tsx           # 内容布局
│   │   ├── DashboardLayout.tsx         # 仪表板布局
│   │   ├── ShellLayout.tsx             # 外壳布局
│   │   └── index.ts
│   │
│   ├── 📂 hooks/                       # 自定义React钩子
│   │   ├── useTheme.ts                 # 主题钩子
│   │   ├── useMediaQuery.ts            # 媒体查询钩子
│   │   ├── useLocalStorage.ts          # 本地存储钩子
│   │   └── index.ts
│   │
│   ├── 📂 utils/                       # 工具函数
│   │   ├── cn.ts                       # classname合并 (clsx + tailwind-merge)
│   │   ├── color.ts                    # 颜色工具函数
│   │   ├── animation.ts                # 动画工具函数
│   │   └── index.ts
│   │
│   ├── 📂 types/                       # 全局类型定义
│   │   ├── theme.ts                    # 主题相关类型
│   │   ├── component.ts                # 组件通用类型
│   │   └── index.ts
│   │
│   └── index.ts                        # 库主入口
│
├── 📂 examples/                        # 示例项目
│   ├── 📂 showcase/                    # 组件展示页面
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── 📂 next-app/                    # Next.js集成示例
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── 📂 react-app/                   # React集成示例
│       ├── src/
│       ├── package.json
│       └── README.md
│
├── 📂 docs/                            # 文档目录
│   ├── getting-started.md              # 快速开始指南
│   ├── installation.md                 # 安装说明
│   ├── 📂 components/                  # 组件文档
│   │   ├── button.md
│   │   ├── card.md
│   │   ├── input.md
│   │   └── ...
│   ├── 📂 guides/                      # 指南
│   │   ├── theming.md                 # 主题定制
│   │   ├── styling.md                 # 样式定制
│   │   └── accessibility.md           # 可访问性
│   ├── themes.md                       # 主题系统文档
│   ├── migration.md                    # 迁移指南
│   └── api-reference.md                # API参考
│
├── 📂 scripts/                         # 构建和开发脚本
│   ├── build.js                        # 构建脚本
│   ├── dev.js                          # 开发脚本
│   └── release.js                      # 发布脚本
│
├── 📂 .storybook/                      # Storybook配置
│   ├── main.ts                         # 主配置
│   ├── preview.tsx                     # 预览配置
│   └── theme-decorator.tsx             # 主题装饰器
│
├── 📂 tests/                           # 测试目录
│   ├── 📂 unit/                        # 单元测试
│   ├── 📂 integration/                 # 集成测试
│   └── 📂 e2e/                         # E2E测试
│
├── 📂 .github/                         # GitHub配置
│   ├── 📂 workflows/                   # GitHub Actions
│   │   ├── ci.yml                     # CI流程
│   │   ├── release.yml                # 发布流程
│   │   └── test.yml                   # 测试流程
│   └── ISSUE_TEMPLATE/
│
├── 📄 package.json                     # 项目依赖配置
├── 📄 tsconfig.json                    # TypeScript配置
├── 📄 tsconfig.build.json              # 构建时TypeScript配置
├── 📄 vite.config.ts                   # Vite构建配置
├── 📄 tailwind.config.ts               # Tailwind配置
├── 📄 postcss.config.js                # PostCSS配置
├── 📄 .eslintrc.json                   # ESLint配置
├── 📄 .prettierrc                      # Prettier配置
├── 📄 vitest.config.ts                 # Vitest测试配置
├── 📄 .gitignore                       # Git忽略文件
├── 📄 .npmignore                       # npm发布忽略文件
├── 📄 README.md                        # 项目说明
├── 📄 CHANGELOG.md                     # 变更日志
├── 📄 LICENSE                          # 开源协议
├── 📄 MIGRATION-PLAN.md                # 迁移计划
├── 📄 PROJECT-STRUCTURE.md             # 项目结构 (本文档)
└── 📄 CLAUDE.md                        # Claude Code指南
```

## 📊 统计数据

### 组件数量
- **核心组件**: 5个 (Button, Card, Input, Select, Checkbox)
- **高级组件**: 10+个 (交互组件、动画组件)
- **导航组件**: 3个 (Header, Sidebar, Breadcrumb)
- **反馈组件**: 3个 (Alert, Loading, Notifications)
- **数据组件**: 1个 (DataTable)
- **布局组件**: 1个 (AdvancedCard)
- **覆盖层组件**: 1个 (Modal)
- **布局模板**: 4个 (CardLayout, ContentLayout, DashboardLayout, ShellLayout)

**总计**: 约25+个独立组件

### 设计令牌
- **配色方案**: 10种完整主题
- **颜色令牌**: 主色、次色、语义色、中性色
- **间距系统**: 基于4px网格
- **字体系统**: Inter + JetBrains Mono
- **阴影层级**: xs 到 2xl
- **动画预设**: 淡入、滑入、弹跳等

## 🎯 核心概念

### 1. 组件组织原则

#### 独立组件目录
每个组件拥有独立目录,包含:
- **实现文件** (Component.tsx)
- **类型定义** (Component.types.ts)
- **故事书** (Component.stories.tsx)
- **测试文件** (Component.test.tsx)
- **导出文件** (index.ts)

#### 组件分组
相关组件按功能分组:
- **Navigation/**: Header + Sidebar + Breadcrumb
- **Feedback/**: Alert + Loading + Notifications
- **Advanced/**: 所有高级交互组件

### 2. 设计系统架构

#### 三层架构
1. **令牌层** (tokens/): 原子级设计决策
2. **主题层** (theme/): 主题配置和管理
3. **组件层** (components/): 使用令牌和主题的UI组件

#### 主题系统流程
```
tokens/colors.ts → theme/palettes.ts → theme/ThemeProvider.tsx
                                      ↓
                              components/Button.tsx (使用主题)
```

### 3. 导出策略

#### Barrel Exports (桶导出)
使用 index.ts 作为导出桶:
```typescript
// src/components/index.ts
export * from './Button'
export * from './Card'
export * from './Input'
// ...

// 使用者可以这样导入
import { Button, Card, Input } from '@th-ui/core'
```

#### 分层导出
```typescript
// 主入口
import { Button } from '@th-ui/core'

// 主题入口
import { ThemeProvider } from '@th-ui/core/theme'

// 令牌入口
import { colors } from '@th-ui/core/tokens'
```

## 📝 命名规范详解

### 文件命名

#### 组件文件
- **格式**: PascalCase
- **示例**: `Button.tsx`, `DataTable.tsx`, `ThemeToggle.tsx`
- **规则**: 与组件名完全一致

#### 类型文件
- **格式**: PascalCase + `.types.ts`
- **示例**: `Button.types.ts`, `Theme.types.ts`
- **规则**: 对应组件名 + types后缀

#### 工具文件
- **格式**: camelCase
- **示例**: `cn.ts`, `useTheme.ts`, `colorUtils.ts`
- **规则**: 功能描述性命名

#### 配置文件
- **格式**: kebab-case
- **示例**: `tailwind.config.ts`, `vite.config.ts`
- **规则**: 工具名-config格式

#### 文档文件
- **格式**: kebab-case
- **示例**: `getting-started.md`, `api-reference.md`
- **规则**: 描述性短语用连字符连接

### 组件命名

#### React组件
- **格式**: PascalCase
- **示例**: `Button`, `MagneticButton`, `ThemeProvider`
- **规则**: 清晰描述组件功能

#### 组件变体
- **格式**: camelCase (variant prop值)
- **示例**: `variant="primary"`, `variant="glassGlow"`
- **规则**: 描述性,简洁

#### 组件尺寸
- **格式**: 单字母或简短缩写
- **示例**: `size="sm"`, `size="md"`, `size="lg"`
- **规则**: xs, sm, md, lg, xl, 2xl

### 类型命名

#### 接口类型
- **格式**: PascalCase + Props/Config/Options后缀
- **示例**: `ButtonProps`, `ThemeConfig`, `AnimationOptions`

#### 类型别名
- **格式**: PascalCase
- **示例**: `ColorToken`, `ThemeName`, `Variant`

#### 枚举
- **格式**: PascalCase (枚举名), UPPER_SNAKE_CASE (枚举值)
- **示例**:
```typescript
enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}
```

### 函数命名

#### 工具函数
- **格式**: camelCase
- **示例**: `mergeClassNames`, `getThemeColor`, `createAnimation`

#### React Hooks
- **格式**: use + PascalCase
- **示例**: `useTheme`, `useMediaQuery`, `useLocalStorage`

#### 事件处理器
- **格式**: handle + PascalCase
- **示例**: `handleClick`, `handleThemeChange`, `handleInputChange`

## 🔗 路径别名配置

### tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/tokens/*": ["src/tokens/*"],
      "@/theme/*": ["src/theme/*"],
      "@/utils/*": ["src/utils/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

### 使用示例
```typescript
// 使用别名
import { Button } from '@/components/Button'
import { colors } from '@/tokens/colors'
import { useTheme } from '@/hooks/useTheme'

// 或使用相对路径
import { Button } from '../Button'
```

## 📦 导出配置

### package.json exports字段
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./theme": {
      "import": "./dist/theme.es.js",
      "require": "./dist/theme.cjs.js",
      "types": "./dist/theme/index.d.ts"
    },
    "./tokens": {
      "import": "./dist/tokens.es.js",
      "require": "./dist/tokens.cjs.js",
      "types": "./dist/tokens/index.d.ts"
    },
    "./components/*": {
      "import": "./dist/components/*.es.js",
      "require": "./dist/components/*.cjs.js",
      "types": "./dist/components/*/index.d.ts"
    }
  }
}
```

## 🎨 设计决策

### 为什么选择这种结构?

#### 1. 组件独立性
- 每个组件有独立目录,便于维护和测试
- 清晰的职责边界
- 易于代码分割和tree-shaking

#### 2. 设计系统分层
- 令牌层提供原子级设计决策
- 主题层提供配色和样式组合
- 组件层使用令牌和主题构建UI

#### 3. 可扩展性
- 新增组件只需添加新目录
- 主题和令牌可独立扩展
- 不影响现有组件

#### 4. 开发体验
- 清晰的导入路径
- 完整的类型提示
- 统一的命名规范

#### 5. 构建优化
- 支持tree-shaking
- 按需加载
- 分包策略

## 🚀 最佳实践

### 组件开发流程
1. 创建组件目录 `src/components/NewComponent/`
2. 定义类型 `NewComponent.types.ts`
3. 实现组件 `NewComponent.tsx`
4. 编写测试 `NewComponent.test.tsx`
5. 创建故事 `NewComponent.stories.tsx`
6. 添加导出 `index.ts`
7. 更新组件库导出 `src/components/index.ts`

### 主题开发流程
1. 在 `tokens/colors.ts` 中定义颜色
2. 在 `theme/palettes.ts` 中创建配色方案
3. 在 `theme/ThemeProvider.tsx` 中注册主题
4. 测试所有组件在新主题下的表现

### 文档编写流程
1. 组件实现完成后立即编写文档
2. 文档包含: 概述、Props、示例、最佳实践
3. 使用Storybook作为交互式文档
4. 保持文档与代码同步

---

**创建时间**: 2025-10-09
**维护**: TH-UI开发团队
**版本**: 1.0.0
