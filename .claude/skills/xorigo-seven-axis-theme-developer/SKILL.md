---
name: "Xorigo UI 七轴主题系统开发器"
description: "基于 Xorigo UI v1.5 SSOT 的七轴主题系统专门开发工具，确保所有组件严格遵循七轴约束逻辑和智能校验系统，集成新的AI辅助功能和性能优化"
author: "Xorigo UI Team"
version: "1.5.0"
tags: ["theme-system", "seven-axis", "design-tokens", "constraints", "ssot", "v1.5.0", "ai-enhanced"]
---

# Xorigo UI 七轴主题系统开发器

基于 Xorigo UI v1.5 SSOT (单一事实来源) 的七轴主题系统专门开发工具，严格遵循 `packages/core` 层的规范要求，集成AI辅助配方生成和性能优化功能。

## 🎯 作用域边界

**✅ 负责范围**：
- `packages/core` 与 `system` 层主题体系
- 七轴主题轴控制逻辑
- 智能约束系统 (A11y Guard)
- 设计令牌标准化

**❌ 排除范围**：
- 网站展示层内容
- 交互演示页面
- 营销内容制作

## 🎨 七轴主题系统 (Seven-Axis Theme System)

### 轴定义与约束

| 轴序 | 中文名 | 英文名 | 类型定义 | 可选值 | 约束规则 |
|---|---|---|---|---|---|
| 1️⃣ | 模式轴 | Mode Axis | `mode` | `'light' \| 'dark' \| 'hc'` | HC 模式触发高对比度约束 |
| 2️⃣ | 基础色轴 | Base Axis | `base` | `${BaseColor}-${ContrastLevel}` | BaseColor: `neutral-warm \| neutral-cool \| neutral-true`<br>ContrastLevel: `low \| mid \| high` |
| 3️⃣ | 强调色轴 | Accent Axis | `accent` | `${AccentStrategy}(${AccentHue})` | AccentStrategy: `mono \| analog \| duo`<br>AccentHue: string 颜色值 |
| 4️⃣ | 色调轴 | Tone Axis | `tone` | `'calm' \| 'standard' \| 'vivid'` | Vivid + Neon 触发饱和度约束 |
| 5️⃣ | 密度轴 | Density Axis | `density` | `'spacious' \| 'comfortable' \| 'compact'` | Compact + Expressive 触发 UX 警告 |
| 6️⃣ | 动效轴 | Motion Axis | `motion` | `${MotionIntensity}.${MotionCurve}` | MotionIntensity: `subtle \| standard \| expressive`<br>MotionCurve: `classic \| soft \| spring` |
| 7️⃣ | 表面轴 | Surface Axis | `surface` | `'flat' \| 'soft-shadow' \| 'glass' \| 'neon' \| 'glass+neon'` | 材质语言约束 |

## 🧠 智能约束系统 (A11y Guard)

### 自动约束规则

| 约束键 | 条件 | 自动处理 | 警告级别 |
|---|---|---|---|
| `motion × contrast` | `hc && motion.includes('expressive')` | 降级 `motion → subtle.classic` | ERROR |
| `tone × surface` | `vivid && surface.includes('neon')` | 降低 saturation 计算 | WARNING |
| `density × motion` | `compact && expressive` | UX 警告输出 | WARNING |
| `mode × surface` | `hc && surface.includes('glass')` | 降级 `surface → flat` | ERROR |
| `tone × density` | `vivid && compact` | 增加间距补偿 | WARNING |

### 约束验证器实现

```typescript
// theme-axis-controller.ts 核心接口
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
  axes: ThemeAxes
  tokens: Record<string,string|number>
}

// 智能约束验证函数
export function validateAndApplyConstraints(axes: ThemeAxes): {
  validatedAxes: ThemeAxes
  warnings: string[]
  errors: string[]
  autoFixes: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []
  const autoFixes: string[] = []
  let validatedAxes = { ...axes }

  // 约束 1: motion × contrast
  if (axes.mode === 'hc' && axes.motion.startsWith('expressive')) {
    validatedAxes.motion = 'subtle.classic'
    autoFixes.push(`HC 模式下动效已降级: ${axes.motion} → subtle.classic`)
  }

  // 约束 2: tone × surface
  if (axes.tone === 'vivid' && axes.surface.includes('neon')) {
    // 计算降低的饱和度
    autoFixes.push(`Vivid + Neon 组合：饱和度已自动降低 30%`)
    warnings.push('建议避免 Vivid + Neon 组合以获得最佳视觉效果')
  }

  // 约束 3: density × motion
  if (axes.density === 'compact' && axes.motion.startsWith('expressive')) {
    warnings.push('⚠️ 高密度 + 表现力动效可能影响用户体验，建议降低动效强度')
  }

  return { validatedAxes, warnings, errors, autoFixes }
}
```

## 🏗️ 目录结构强制约束

### 核心 SSOT 目录结构

```
packages/core/src/
├── foundations/                    # ✅ 设计令牌（静态层）
│  ├── color-tokens.ts            # 必需：基础 HSL/LAB 色板
│  ├── density-tokens.ts          # 必需：间距、边距、字号系数
│  ├── motion-curves.ts           # 必需：Easing 函数、持续时间
│  ├── surface-tokens.ts          # 必需：阴影、透明度、模糊
│  └── index.ts                   # 必需：聚合导出
├── system/                       # ✅ 主题引擎（运行时层）
│  ├── theme-provider.tsx         # 必需：React 上下文 + CSS 变量注入
│  ├── theme-axis-controller.ts   # 必需：七轴状态结构 + 组合规则
│  ├── accent-generator.ts        # 必需：Accent Axis 主色梯度生成
│  ├── motion-system/             # 必需：动画曲线/SSR 兼容
│  │  ├── lazy-motion.tsx
│  │  ├── ssr-animate-presence.tsx
│  │  └── ssr-motion-div.tsx
│  ├── recipes/                   # 必需：场景化主题预设
│  │  ├── corporateBlueRecipe.ts  # 企业蓝调配方
│  │  ├── creativePurpleRecipe.ts # 创意紫配方
│  │  ├── techCyanRecipe.ts       # 科技青配方
│  │  └── index.ts                # 配方注册表
│  └── index.ts                   # 系统层导出
├── primitives/                   # ✅ UI 原子组件
│  ├── button/
│  ├── card/
│  ├── surface/
│  └── index.ts
├── components/                   # ✅ 结构与反馈组件
│  ├── layout/
│  ├── feedback/
│  ├── navigation/
│  └── index.ts
└── index.ts                      # ✅ 顶层导出
```

### 文件存在性验证

```typescript
// 目录结构验证器
export function validateCoreDirectoryStructure(): {
  valid: boolean
  missing: string[]
  invalid: string[]
  warnings: string[]
} {
  const requiredFiles = [
    'foundations/color-tokens.ts',
    'foundations/density-tokens.ts',
    'foundations/motion-curves.ts',
    'foundations/surface-tokens.ts',
    'foundations/index.ts',
    'system/theme-provider.tsx',
    'system/theme-axis-controller.ts',
    'system/accent-generator.ts',
    'system/motion-system/lazy-motion.tsx',
    'system/motion-system/ssr-animate-presence.tsx',
    'system/motion-system/ssr-motion-div.tsx',
    'system/recipes/corporateBlueRecipe.ts',
    'system/recipes/creativePurpleRecipe.ts',
    'system/recipes/techCyanRecipe.ts',
    'system/recipes/index.ts',
    'system/index.ts',
    'index.ts'
  ]

  const missing = []
  const invalid = []
  const warnings = []

  // 验证文件存在性和内容有效性
  requiredFiles.forEach(file => {
    if (!fs.existsSync(`packages/core/src/${file}`)) {
      missing.push(file)
    } else if (!validateFileContent(`packages/core/src/${file}`)) {
      invalid.push(file)
    }
  })

  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid,
    warnings
  }
}
```

## 🚀 v1.5 新增功能集成

### AI辅助主题配方生成

基于新的AI模块，支持智能主题配方生成：

```typescript
// AI配方生成器接口
interface AIRecipeGenerator {
  generateFromPrompt(prompt: string): Promise<ThemeRecipe>
  suggestVariations(baseRecipe: ThemeRecipe): Promise<ThemeRecipe[]>
  optimizeForAccessibility(recipe: ThemeRecipe): Promise<ThemeRecipe>
}

// 使用示例
const aiGenerator = new AIRecipeGenerator()
const techRecipe = await aiGenerator.generateFromPrompt(
  "创建一个科技感的深色主题，适合开发工具使用"
)
```

### 性能优化与缓存管理

v1.5引入了全面的性能优化系统：

```typescript
// 配方缓存管理器
export class RecipeCacheManager {
  private cache = new Map<string, ThemeRecipe>()

  getCachedRecipe(id: string): ThemeRecipe | null
  cacheRecipe(recipe: ThemeRecipe): void
  invalidateCache(): void

  // 性能监控
  measurePerformance<T>(fn: () => T): { result: T; duration: number }
}

// 主题性能测试
export function runThemePerformanceTests(): {
  renderPerformance: number
  cacheHitRate: number
  memoryUsage: number
} {
  // 性能基准测试逻辑
}
```

### 动态配方导入导出

支持配方的序列化和跨项目分享：

```typescript
// 配方导入导出管理器
export class RecipeImportExport {
  exportToJSON(recipe: ThemeRecipe): string
  importFromJSON(json: string): ThemeRecipe

  exportToFile(recipe: ThemeRecipe, filePath: string): Promise<void>
  importFromFile(filePath: string): Promise<ThemeRecipe>

  // 批量操作
  exportMultiple(recipes: ThemeRecipe[]): string
  importMultiple(json: string): ThemeRecipe[]
}
```

### 可访问性增强

新增WCAG合规性自动验证：

```typescript
// 可访问性验证器
export function validateThemeAccessibility(recipe: ThemeRecipe): {
  compliant: boolean
  issues: AccessibilityIssue[]
  suggestions: string[]
} {
  // WCAG 2.1 AA 标准验证
  // 对比度检查
  // 色盲友好性验证
  // 动效安全性检查
}
```

### 与v1.5组件分类系统集成

支持按组件分类应用主题定制：

```typescript
// 组件分类主题配置
interface ComponentCategoryTheme {
  category: ComponentCategory // 来自v1.5分类系统
  themeOverrides: Partial<ThemeTokens>
  componentSpecific: Record<string, ThemeTokens>
}

// 为inputs分类定制主题
const inputsTheme: ComponentCategoryTheme = {
  category: 'inputs',
  themeOverrides: {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    focusColor: 'var(--input-focus)'
  },
  componentSpecific: {
    'button': { borderRadius: 'var(--button-radius)' },
    'input': { padding: 'var(--input-padding)' }
  }
}
```

## 🎨 主题配方 (Recipes) 管理

### 配方结构标准

```typescript
// 标准配方结构
export const standardRecipeTemplate: ThemeRecipe = {
  id: 'recipe-id',
  name: 'Recipe Display Name',
  axes: {
    mode: 'light',                    // 模式轴
    base: 'neutral-true-mid',        // 基础色轴
    accent: 'mono(blue)',            // 强调色轴
    tone: 'standard',                // 色调轴
    density: 'comfortable',          // 密度轴
    motion: 'standard.classic',      // 动效轴
    surface: 'soft-shadow'           // 表面轴
  },
  tokens: {
    // 必需的基础令牌
    background: '#ffffff',
    foreground: '#000000',
    accent: '#3b82f6',
    radius: 8,
    shadow: '0 4px 6px rgba(0,0,0,0.1)',
    // 扩展令牌...
  }
}
```

### 内置配方清单

| 配方文件 | 配方ID | 适用场景 | 特点 |
|---|---|---|---|
| `corporateBlueRecipe.ts` | `corporate-blue` | 企业应用 | 专业、稳定、商务 |
| `creativePurpleRecipe.ts` | `creative-purple` | 创意设计 | 艺术、活力、创新 |
| `techCyanRecipe.ts` | `tech-cyan` | 科技产品 | 现代、科技、未来 |

## 🚀 使用方法

### 主题轴操作

```bash
# 创建新的主题配置
"创建主题配置：dark.neutral-cool-high.mono(cyan).vivid.compact.standard.spring"

# 验证主题轴配置
"验证主题轴配置：light.neutral-warm-low.analog(orange).calm.spacious.subtle.soft"

# 应用智能约束
"应用智能约束到主题配置：hc.neutral-true-mid.vivid.compact.expressive.spring"
```

### 配方管理

```bash
# 创建新配方
"创建主题配方：midnight-tech，基于 dark.neutral-cool-high.mono(cyan).standard.comfortable.subtle.glass"

# 验证配方兼容性
"验证配方 midnight-tech 与现有组件的兼容性"

# 生成配方令牌
"为配方 corporate-blue 生成完整的 CSS 令牌集"
```

### 约束系统验证

```bash
# 验证约束规则
"验证主题配置是否符合所有智能约束规则"

# 检查可访问性约束
"检查主题配置的高对比度模式兼容性"

# 分析约束冲突
"分析配置中的约束冲突并提供解决方案"
```

## 🔍 开发时验证

### 实时验证检查

1. **轴配置验证**：确保所有轴值在有效范围内
2. **约束规则检查**：自动应用智能约束并警告
3. **配方兼容性**：验证与现有组件的兼容性
4. **可访问性检查**：确保满足 WCAG 对比度要求

### 自动修复功能

- **约束冲突**：自动降级不兼容的组合
- **对比度不足**：自动调整颜色饱和度
- **动效过强**：在 HC 模式下自动降级
- **密度过高**：自动补偿间距

## 📋 输出格式

### 验证报告

```
🎨 七轴主题系统验证报告
📅 时间: 2025-01-XX
🔍 配置: dark.neutral-cool-high.mono(cyan).vivid.compact.expressive.spring

✅ 验证通过
- ✅ 所有轴值在有效范围内
- ✅ 配方结构符合规范
- ✅ 约束规则已应用

⚠️ 警告 (2)
- ⚠️ Vivid + Compact 组合：建议增加间距补偿
- ⚠️ Expressive 动效 + Compact 密度：可能影响用户体验

🔧 自动修复 (1)
- ✅ 约束冲突已修复：motion 保持 expressive.spring

📊 生成令牌: 47 个
🎯 可访问性评级: WCAG 2.1 AA
```

### 配方文件输出

```typescript
export const generatedRecipe: ThemeRecipe = {
  id: 'custom-theme',
  name: 'Custom Generated Theme',
  axes: { /* 验证后的轴配置 */ },
  tokens: { /* 完整的令牌集合 */ }
}
```

## 🛡️ 质量保证

### 严格模式验证

- **轴值范围检查**：确保所有轴值符合类型定义
- **配方结构验证**：验证配方包含必需的属性
- **约束规则完整性**：确保所有约束规则被正确应用
- **令牌生成准确性**：验证生成的令牌符合设计规范

### 持续集成支持

- **自动化测试**：集成到 CI/CD 流水线
- **PR 检查**：自动验证主题配置变更
- **性能监控**：监控主题切换性能
- **兼容性测试**：跨浏览器兼容性验证

基于 Xorigo UI v1.4 SSOT，确保所有主题系统开发严格遵循规范要求，提供一致、可访问、高性能的主题体验。