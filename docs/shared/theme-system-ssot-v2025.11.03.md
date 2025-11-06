# 🎨 Xorigo UI 主题系统唯一事实文档（v1.5 SSOT）- 共享版本

**作用域**：`packages/core` 与 `system` 层
**职责**：组件库内部主题体系、设计令牌、运行时引擎、七轴约束逻辑
**排除**：网站展示、交互演示、营销内容

> **使用指南**: 本文档为技术实现规范。如需了解主题系统的使用方法，请参考 [七轴主题系统使用指南](../theming/seven-axis-system.md)。

---

## 一、项目架构边界

| 方面   | `packages` 负责 | `website` 负责 |
| ---- | ------------- | ------------ |
| 组件开发 | ✅ 创建、维护、测试    | ❌ 仅消费        |
| 主题系统 | ✅ 主题引擎、令牌     | ✅ 主题展示、切换    |
| 文档编写 | ✅ API 与类型定义   | ✅ 使用文档、教程    |
| 展示页面 | ❌ 不涉及         | ✅ 演示与营销      |
| 构建发布 | ✅ NPM 包产出     | ✅ 网站部署       |
| 用户交互 | ❌ 不直接面向用户     | ✅ 完整用户体验     |

---

## 二、目录结构（核心 SSOT）

```
packages/
└─ core/
   ├─ src/
   │  ├─ theme/                         # 主题系统（核心层）
   │  │  ├─ seven-axis-recipe-engine.ts # 七轴配方引擎
   │  │  ├─ seven-axis-calculator.ts   # 七轴计算器
   │  │  ├─ recipe-registry.ts          # 配方注册表
   │  │  ├─ recipe-validator.ts         # 配方验证器
   │  │  ├─ recipe-cache-manager.ts     # 配方缓存管理
   │  │  ├─ recipe-storage-manager.ts   # 配方存储管理
   │  │  ├─ recipe-import-export.ts     # 配方导入导出
   │  │  ├─ SevenAxisThemeProvider.tsx  # 主题提供者
   │  │  ├─ UseTheme.tsx               # 主题Hook
   │  │  ├─ theme-mapping.ts            # 主题映射
   │  │  ├─ theme-performance-tests.ts # 性能测试
   │  │  └─ index.ts
   │  ├─ motion/                        # 动画系统（运行时层）
   │  │  ├─ LazyMotion.tsx              # 懒加载动画
   │  │  ├─ MotionProvider.tsx          # 动画提供者
   │  │  ├─ SSRMotionDiv.tsx            # SSR动画组件
   │  │  ├─ SSRAnimatePresence.tsx      # SSR动画存在性
   │  │  └─ index.ts
   │  ├─ primitives/                    # UI 原子组件
   │  │  └─ [基础组件目录]
   │  ├─ components/                    # 结构与反馈组件（按v1.5分类）
   │  │  ├─ layout/                     # 布局组件
   │  │  ├─ navigation/                 # 导航组件
   │  │  ├─ form/                       # 表单组件
   │  │  ├─ data-display/               # 数据展示组件
   │  │  ├─ feedback/                   # 反馈状态组件
   │  │  ├─ overlays/                   # 浮层组件
   │  │  └─ [其他分类组件]
   │  ├─ utils/                         # 工具函数
   │  ├─ types/                         # 类型定义
   │  ├─ accessibility/                 # 可访问性
   │  ├─ system-tools/                  # 系统工具
   │  ├─ ai/                           # AI辅助功能
   │  └─ index.ts                      # 顶层导出
   ├─ package.json
   ├─ tsconfig.json
   └─ vite.config.ts
```

> **🔄 v1.5 更新说明**：目录结构已根据新的三层架构（System/Component/Composition）和十一类组件分类系统进行了重构。

---

## 三、七轴主题系统 （Seven-Axis Theme System）

| 轴序  | 中文名  | 英文名          | 控制范围       | 类型定义 / 可选值                                                                                                                                     |
| --- | ---- | ------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1️⃣ | 模式轴  | Mode Axis    | 光照模式       | `'light' \| 'dark' \| 'hc'`                                                                                                                    |
| 2️⃣ | 基础色轴 | Base Axis    | 中性色调 × 对比度 | `${BaseColor}-${ContrastLevel}`<br>`BaseColor`: `neutral-warm` | `neutral-cool` | `neutral-true`<br>`ContrastLevel`: `low` | `mid` | `high`    |
| 3️⃣ | 强调色轴 | Accent Axis  | 主色策略 × 色相  | `${AccentStrategy}(${AccentHue})`<br>`AccentStrategy`: `mono` | `analog` | `duo`                                                               |
| 4️⃣ | 色调轴  | Tone Axis    | 饱和度 / 亮度曲线 | `'calm' \| 'standard' \| 'vivid'`                                                                                                              |
| 5️⃣ | 密度轴  | Density Axis | 信息密度 / 留白  | `'spacious' \| 'comfortable' \| 'compact'`                                                                                                     |
| 6️⃣ | 动效轴  | Motion Axis  | 动画节奏 / 幅度  | `${MotionIntensity}.${MotionCurve}`<br>`MotionIntensity`: `subtle` | `standard` | `expressive`<br>`MotionCurve`: `classic` | `soft` | `spring` |
| 7️⃣ | 表面轴  | Surface Axis | 表面材质语言     | `'flat' \| 'soft-shadow' \| 'glass' \| 'neon' \| 'glass+neon'`                                                                                 |

---

## 四、运行时机制

### 1. 核心文件

| 文件                         | 作用                        |
| -------------------------- | ------------------------- |
| `seven-axis-recipe-engine.ts` | 七轴配方引擎，核心计算逻辑           |
| `seven-axis-calculator.ts`   | 七轴数值计算器                 |
| `SevenAxisThemeProvider.tsx` | React 上下文提供与 CSS 变量注入     |
| `recipe-registry.ts`        | 配方注册与管理                  |
| `recipe-validator.ts`       | 配方验证器                    |
| `motion-system/*`           | 动画曲线 / SSR 兼容封装           |

### 2. 核心接口

```ts
// seven-axis-recipe-engine.ts
export interface ThemeAxes {
  mode: 'light' | 'dark' | 'hc'
  base: `${'neutral-warm'|'neutral-cool'|'neutral-true'}-${'low'|'mid'|'high'}`
  accent: `${'mono'|'analog'|'duo'}(${string})`
  tone: 'calm' | 'standard' | 'vivid'
  density: 'spacious' | 'comfortable' | 'compact'
  motion: `${'subtle'|'standard'|'expressive'}.${'classic'|'soft'|'spring'}`
  surface: 'flat' | 'soft-shadow' | 'glass' | 'neon' | 'glass+neon'
}

export interface ThemeRecipe {
  id: string
  name: string
  description?: string
  axes: ThemeAxes
  tokens: Record<string,string|number>
  metadata?: {
    author?: string
    version?: string
    tags?: string[]
  }
}

export function generateThemeTokens(axes: ThemeAxes): ThemeRecipe
export function validateThemeRecipe(recipe: ThemeRecipe): boolean
```

```tsx
// SevenAxisThemeProvider.tsx
export const SevenAxisThemeProvider: React.FC<{
  recipe: ThemeRecipe
  children: React.ReactNode
}> = ({ recipe, children }) => {
  useEffect(() => applyThemeToRoot(recipe.tokens), [recipe])
  return (
    <ThemeContext.Provider value={recipe}>
      {children}
    </ThemeContext.Provider>
  )
}
```

---

## 五、智能约束系统 （A11y Guard）

`seven-axis-calculator` 内部定义：

| 校验键                 | 条件                                    | 处理                                                          |
| ------------------- | ------------------------------------- | ----------------------------------------------------------- |
| `motion × contrast` | `hc && motion.includes('expressive')` | 降级 `motion → subtle.classic`                                |
| `tone × surface`    | `vivid && surface.includes('neon')`   | 降低 saturation 计算                                            |
| `density × motion`  | `compact && expressive`               | 触发 UX 警告 `console.warn('High density + expressive motion')` |
| `accessibility`     | 自动WCAG合规性检查                       | 不通过时提供修正建议                                              |

---

## 六、设计令牌（Foundations）

设计令牌现在通过外部文件管理，主题系统通过以下方式加载：

| 源文件                  | 职责                            |
| ------------------- | ----------------------------- |
| `apps/website/src/styles/design-tokens.css` | CSS 设计令牌定义                |
| `apps/website/src/data/tokens.readonly.ts`  | TypeScript 令牌常量           |
| 动态令牌生成器         | 根据七轴配置动态生成令牌              |

> **🔄 v1.5 更新说明**：设计令牌现在采用外部化管理，支持动态生成和实时更新。

---

## 七、主题配方（Recipes）

文件位置：`/packages/core/src/theme/recipe-*.ts`

| 配方类型 | 文件模式                     | 说明   |
| ---- | ----------------------- | ---- |
| 内置配方 | `recipe-registry.ts`       | 预定义配方集合 |
| 动态配方 | `recipe-storage-manager.ts` | 运行时配方管理 |
| 导入导出 | `recipe-import-export.ts`   | 配方序列化支持 |

结构示例：

```ts
export const techCyanRecipe: ThemeRecipe = {
  id: 'tech-cyan',
  name: 'Tech Cyan',
  description: '科技感主题，适合技术类产品',
  axes: {
    mode: 'dark',
    base: 'neutral-cool-mid',
    accent: 'mono(cyan)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'subtle.classic',
    surface: 'glass'
  },
  tokens: {
    background: '#0d1b2a',
    foreground: '#e0fbfc',
    accent: '#00bcd4',
    radius: 8
  },
  metadata: {
    author: 'Xorigo UI Team',
    version: '1.0.0',
    tags: ['dark', 'tech', 'cyan']
  }
}
```

---

## 八、组件分类集成（v1.5 新增）

主题系统与组件分类系统完全集成：

```ts
// 支持按分类应用主题
export interface ComponentThemeConfig {
  category: ComponentCategory  // 来自 component-taxonomy-v2025.11.03.yaml
  themeOverrides?: Partial<ThemeTokens>
}

// 示例：为 inputs 分类组件定制主题
const inputsThemeConfig: ComponentThemeConfig = {
  category: 'inputs',
  themeOverrides: {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    focusColor: 'var(--input-focus)'
  }
}
```

---

## 九、导出规范 （Exports Mapping）

`package.json` 中定义分层导出路径：

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./theme": "./dist/theme/index.mjs",
    "./motion": "./dist/motion/index.mjs",
    "./primitives": "./dist/primitives/index.mjs",
    "./components": "./dist/components/index.mjs",
    "./utils": "./dist/utils/index.mjs"
  }
}
```

---

## 十、性能优化与测试

| 功能 | 实现文件 |
| ---- | ----------------------- |
| 性能监控 | `theme-performance-tests.ts` |
| 缓存管理 | `recipe-cache-manager.ts` |
| 懒加载 | `motion/LazyMotion.tsx` |
| SSR支持 | `motion/SSR*.tsx` |
| 可访问性测试 | `accessibility/*.ts` |

---

## 十一、AI辅助功能（v1.5 新增）

| 功能 | 实现文件 |
| ---- | ----------------------- |
| 配方生成 | `ai/recipe-generator.ts` |
| 设计助手 | `ai/design-assistant.ts` |
| 用户行为分析 | `ai/user-behavior-analyzer.ts` |
| AI Hook | `ai/hooks.ts` |

---

## 十二、版本控制与构建

| 工具                            | 用途                  |
| ----------------------------- | ------------------- |
| **PNPM 9**                    | Monorepo 管理         |
| **Turborepo**                 | 构建编排                |
| **tsup + rollup-plugin-dts**  | 产出 ESM/CJS 与 类型     |
| **Changesets**                | 语义化版本与 changelog 生成 |
| **Vitest + RTL + Playwright** | 测试体系                |
| **axe-core**                  | A11y 自动化检测          |

---

## 十三、文档声明

本文件为 **Xorigo UI Theme System SSOT (v1.5)**
适用范围：`packages/core` 层
修改必须同步更新 `theme/` 与相关模块。
网站层仅消费本规范，不得修改。

### 关联文档
- **[组件分类系统 SSOT v1.5](./component-taxonomy-v2025.11.03.yaml)** - 组件分类规范
- **[七轴主题系统使用指南](../theming/seven-axis-system.md)** - 使用指南

---

*本文档为共享版本，适用于 UI 架构和 Website 技术架构的共用规范。*
*最后更新：2025年11月6日 (Week 15并发执行完成后状态同步)*
*下次审查：2026年2月3日*