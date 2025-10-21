---
name: "Xorigo UI 主题配方管理器"
description: "基于 Xorigo UI v1.4 SSOT 的主题配方专门管理工具，负责 system/recipes/ 目录下所有主题配方的创建、验证、注册和维护"
author: "Xorigo UI Team"
version: "1.4.0"
tags: ["theme-recipes", "seven-axis-system", "build-time-constants", "recipe-registry", "theme-presets"]
---

# Xorigo UI 主题配方管理器

基于 Xorigo UI v1.4 SSOT 的主题配方专门管理工具，负责 `system/recipes/` 目录下所有主题配方的标准化管理。

## 🎯 作用域与职责

**✅ 核心职责**：
- `system/recipes/` 目录配方标准化管理
- 七轴配方结构验证与生成
- 配方注册表维护与更新
- Build-time 常量优化

**❌ 排除范围**：
- 运行时主题切换逻辑
- 用户自定义主题创建
- 网站层配方展示

## 🏗️ Recipes 目录结构强制

```
packages/core/src/system/recipes/
├── corporateBlueRecipe.ts     # ✅ 企业蓝调配方
├── creativePurpleRecipe.ts    # ✅ 创意紫配方
├── techCyanRecipe.ts          # ✅ 科技青配方
├── index.ts                   # ✅ 全部导出 + 注册表
├── README.md                  # ✅ 配方使用说明
└── recipe-types.ts            # ✅ 配方类型定义
```

## 🎨 标准配方结构模板

### 配方文件标准模板

```typescript
// [recipeName]Recipe.ts
import type { ThemeRecipe, ThemeAxes } from '../theme-axis-controller'

export const [recipeName]Recipe: ThemeRecipe = {
  // 🆔 配方标识
  id: 'recipe-id',
  name: 'Recipe Display Name',
  description: 'Recipe description and use case',
  category: 'corporate' | 'creative' | 'tech' | 'minimal' | 'vibrant',

  // 🎯 七轴配置
  axes: {
    mode: 'light' | 'dark' | 'hc',
    base: `${'neutral-warm'|'neutral-cool'|'neutral-true'}-${'low'|'mid'|'high'}`,
    accent: `${'mono'|'analog'|'duo'}(${string})`,
    tone: 'calm' | 'standard' | 'vivid',
    density: 'spacious' | 'comfortable' | 'compact',
    motion: `${'subtle'|'standard'|'expressive'}.${'classic'|'soft'|'spring'}`,
    surface: 'flat' | 'soft-shadow' | 'glass' | 'neon' | 'glass+neon'
  },

  // 🎨 令牌定义
  tokens: {
    // 必需基础令牌
    background: '#ffffff',
    foreground: '#000000',

    // 主色系统
    primary: '#3b82f6',
    'primary-hover': '#2563eb',
    'primary-active': '#1d4ed8',
    'on-primary': '#ffffff',

    // 中性色系统
    'surface-primary': '#ffffff',
    'surface-secondary': '#f8fafc',
    'surface-tertiary': '#f1f5f9',

    // 文本色系统
    'text-primary': '#1e293b',
    'text-secondary': '#475569',
    'text-tertiary': '#64748b',
    'text-disabled': '#94a3b8',
    'text-on-surface': '#1e293b',

    // 边框色系统
    'border-primary': '#e2e8f0',
    'border-secondary': '#cbd5e1',
    'border-focus': '#3b82f6',

    // 语义色系统
    success: '#10b981',
    'success-bg': '#d1fae5',
    warning: '#f59e0b',
    'warning-bg': '#fef3c7',
    danger: '#ef4444',
    'danger-bg': '#fee2e2',
    info: '#3b82f6',
    'info-bg': '#dbeafe',

    // 交互令牌
    radius: '8px',
    'radius-sm': '4px',
    'radius-lg': '12px',
    'radius-xl': '16px',

    // 阴影令牌
    'shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    'shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

    // 过渡令牌
    'transition-fast': '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    'transition-normal': '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    'transition-slow': '400ms cubic-bezier(0.4, 0, 0.2, 1)',

    // 扩展令牌（根据配方需要）
    // ... 更多自定义令牌
  },

  // 🎯 适用场景
  useCases: [
    '企业级应用',
    '管理系统',
    '数据可视化'
  ],

  // 🏷️ 标签
  tags: [
    'professional',
    'stable',
    'business'
  ],

  // 🔗 相关配方
  relatedRecipes: [
    'corporate-dark',
    'minimal-light'
  ]
}

// 类型导出
export type [RecipeName]Recipe = typeof [recipeName]Recipe
```

### 内置配方实现

#### 企业蓝调配方

```typescript
// corporateBlueRecipe.ts
export const corporateBlueRecipe: ThemeRecipe = {
  id: 'corporate-blue',
  name: 'Corporate Blue',
  description: '专业企业级蓝色主题，适合商务应用和管理系统',
  category: 'corporate',

  axes: {
    mode: 'light',
    base: 'neutral-true-mid',
    accent: 'mono(blue)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'standard.classic',
    surface: 'soft-shadow'
  },

  tokens: {
    background: '#ffffff',
    foreground: '#0f172a',

    primary: '#2563eb',
    'primary-hover': '#1d4ed8',
    'primary-active': '#1e40af',
    'on-primary': '#ffffff',

    // 企业级中性色
    'surface-primary': '#ffffff',
    'surface-secondary': '#f8fafc',
    'surface-tertiary': '#f1f5f9',

    // 商务文本色
    'text-primary': '#1e293b',
    'text-secondary': '#475569',
    'text-tertiary': '#64748b',

    // 稳重边框色
    'border-primary': '#e2e8f0',
    'border-secondary': '#cbd5e1',
    'border-focus': '#2563eb',

    // 专业语义色
    success: '#059669',
    'success-bg': '#d1fae5',
    warning: '#d97706',
    'warning-bg': '#fef3c7',
    danger: '#dc2626',
    'danger-bg': '#fee2e2',

    // 企业级阴影
    'shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    'shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    'shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',

    radius: '8px',
    'transition-normal': '250ms cubic-bezier(0.4, 0, 0.2, 1)'
  },

  useCases: ['企业级应用', '管理系统', '数据可视化', '商务报表'],
  tags: ['professional', 'stable', 'business', 'trustworthy'],
  relatedRecipes: ['corporate-dark', 'minimal-light']
}
```

#### 创意紫配方

```typescript
// creativePurpleRecipe.ts
export const creativePurpleRecipe: ThemeRecipe = {
  id: 'creative-purple',
  name: 'Creative Purple',
  description: '充满活力的紫色创意主题，适合设计工具和创意平台',
  category: 'creative',

  axes: {
    mode: 'light',
    base: 'neutral-cool-mid',
    accent: 'duo(purple,pink)',
    tone: 'vivid',
    density: 'comfortable',
    motion: 'expressive.spring',
    surface: 'glass'
  },

  tokens: {
    background: '#faf5ff',
    foreground: '#2d1b69',

    primary: '#9333ea',
    'primary-hover': '#7c3aed',
    'primary-active': '#6d28d9',
    'on-primary': '#ffffff',

    // 创意渐变色
    'gradient-primary': 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
    'gradient-secondary': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',

    // 活力表面色
    'surface-primary': 'rgba(255, 255, 255, 0.9)',
    'surface-secondary': 'rgba(243, 232, 255, 0.8)',
    'surface-tertiary': 'rgba(233, 213, 255, 0.7)',

    // 创意文本色
    'text-primary': '#2d1b69',
    'text-secondary': '#5b21b6',
    'text-tertiary': '#7c3aed',

    // 艺术边框色
    'border-primary': '#e9d5ff',
    'border-secondary': '#c084fc',
    'border-focus': '#9333ea',

    // 表现力阴影
    'shadow-sm': '0 2px 8px rgba(147, 51, 234, 0.1)',
    'shadow-md': '0 4px 16px rgba(147, 51, 234, 0.2)',
    'shadow-lg': '0 8px 32px rgba(147, 51, 234, 0.3)',
    'shadow-glow': '0 0 20px rgba(147, 51, 234, 0.4)',

    // 弹性动画
    'transition-fast': '150ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'transition-normal': '250ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'transition-slow': '400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    radius: '12px',
    'radius-lg': '16px'
  },

  useCases: ['设计工具', '创意平台', '艺术作品集', '创新应用'],
  tags: ['creative', 'vibrant', 'artistic', 'expressive'],
  relatedRecipes: ['creative-dark', 'gradient-mix']
}
```

#### 科技青配方

```typescript
// techCyanRecipe.ts
export const techCyanRecipe: ThemeRecipe = {
  id: 'tech-cyan',
  name: 'Tech Cyan',
  description: '现代科技感青色主题，适合技术平台和开发工具',
  category: 'tech',

  axes: {
    mode: 'dark',
    base: 'neutral-cool-high',
    accent: 'mono(cyan)',
    tone: 'standard',
    density: 'compact',
    motion: 'subtle.classic',
    surface: 'neon'
  },

  tokens: {
    background: '#0d1b2a',
    foreground: '#e0fbfc',

    primary: '#00bcd4',
    'primary-hover': '#00acc1',
    'primary-active': '#0097a7',
    'on-primary': '#00363a',

    // 科技表面色
    'surface-primary': '#1b263b',
    'surface-secondary': '#415a77',
    'surface-tertiary': '#778da9',

    // 技术文本色
    'text-primary': '#e0fbfc',
    'text-secondary': '#b0c4de',
    'text-tertiary': '#778da9',

    // 赛博边框色
    'border-primary': '#415a77',
    'border-secondary': '#778da9',
    'border-focus': '#00bcd4',

    // 霓虹效果
    'neon-glow': '0 0 20px rgba(0, 188, 212, 0.5)',
    'neon-glow-hover': '0 0 30px rgba(0, 188, 212, 0.8)',
    'shadow-neon': '0 0 20px rgba(0, 188, 212, 0.5), 0 0 40px rgba(0, 188, 212, 0.3)',

    // 精确阴影
    'shadow-sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
    'shadow-md': '0 4px 8px rgba(0, 0, 0, 0.4)',
    'shadow-lg': '0 8px 16px rgba(0, 0, 0, 0.5)',

    // 技术感动画
    'transition-fast': '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    'transition-normal': '200ms cubic-bezier(0.4, 0, 0.2, 1)',

    radius: '6px',
    'radius-sm': '3px'
  },

  useCases: ['开发工具', '技术平台', '数据监控', '科技应用'],
  tags: ['tech', 'modern', 'cyber', 'professional'],
  relatedRecipes: ['tech-light', 'hacker-green']
}
```

## 📋 配方注册表管理

### 注册表标准结构

```typescript
// index.ts - 配方注册表
import type { ThemeRecipe } from '../theme-axis-controller'
import { corporateBlueRecipe } from './corporateBlueRecipe'
import { creativePurpleRecipe } from './creativePurpleRecipe'
import { techCyanRecipe } from './techCyanRecipe'

// 🎯 配方注册表
export const RECIPE_REGISTRY: Record<string, ThemeRecipe> = {
  'corporate-blue': corporateBlueRecipe,
  'creative-purple': creativePurpleRecipe,
  'tech-cyan': techCyanRecipe
}

// 📊 配方元数据
export interface RecipeMetadata {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  useCases: string[]
  axes: string
  tokenCount: number
  fileSize: string
  lastModified: string
}

// 📋 配方清单
export const RECIPE_MANIFEST: RecipeMetadata[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: '专业企业级蓝色主题',
    category: 'corporate',
    tags: ['professional', 'stable', 'business'],
    useCases: ['企业级应用', '管理系统'],
    axes: 'light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow',
    tokenCount: 47,
    fileSize: '2.4KB',
    lastModified: '2025-01-XX'
  },
  {
    id: 'creative-purple',
    name: 'Creative Purple',
    description: '充满活力的紫色创意主题',
    category: 'creative',
    tags: ['creative', 'vibrant', 'artistic'],
    useCases: ['设计工具', '创意平台'],
    axes: 'light.neutral-cool-mid.duo(purple,pink).vivid.comfortable.expressive.spring.glass',
    tokenCount: 58,
    fileSize: '3.1KB',
    lastModified: '2025-01-XX'
  },
  {
    id: 'tech-cyan',
    name: 'Tech Cyan',
    description: '现代科技感青色主题',
    category: 'tech',
    tags: ['tech', 'modern', 'cyber'],
    useCases: ['开发工具', '技术平台'],
    axes: 'dark.neutral-cool-high.mono(cyan).standard.compact.subtle.classic.neon',
    tokenCount: 52,
    fileSize: '2.8KB',
    lastModified: '2025-01-XX'
  }
]

// 🔧 配方工具函数
export class RecipeRegistry {
  // 获取所有配方
  static getAllRecipes(): ThemeRecipe[] {
    return Object.values(RECIPE_REGISTRY)
  }

  // 根据ID获取配方
  static getRecipe(id: string): ThemeRecipe | undefined {
    return RECIPE_REGISTRY[id]
  }

  // 根据类别获取配方
  static getRecipesByCategory(category: string): ThemeRecipe[] {
    return this.getAllRecipes().filter(recipe => recipe.category === category)
  }

  // 根据标签搜索配方
  static searchRecipesByTag(tag: string): ThemeRecipe[] {
    return this.getAllRecipes().filter(recipe => recipe.tags.includes(tag))
  }

  // 根据使用场景推荐配方
  static recommendRecipes(useCase: string): ThemeRecipe[] {
    return this.getAllRecipes().filter(recipe =>
      recipe.useCases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
    )
  }

  // 验证配方完整性
  static validateRecipe(recipe: ThemeRecipe): ValidationResult {
    const issues = []
    const warnings = []

    // 验证必需属性
    if (!recipe.id) issues.push('缺少配方ID')
    if (!recipe.name) issues.push('缺少配方名称')
    if (!recipe.axes) issues.push('缺少七轴配置')
    if (!recipe.tokens) issues.push('缺少令牌定义')

    // 验证七轴完整性
    const requiredAxes = ['mode', 'base', 'accent', 'tone', 'density', 'motion', 'surface']
    requiredAxes.forEach(axis => {
      if (!recipe.axes[axis]) {
        issues.push(`缺少必需轴: ${axis}`)
      }
    })

    // 验证必需令牌
    const requiredTokens = ['background', 'foreground', 'primary', 'text-primary']
    requiredTokens.forEach(token => {
      if (!recipe.tokens[token]) {
        warnings.push(`建议添加令牌: ${token}`)
      }
    })

    return { valid: issues.length === 0, issues, warnings }
  }

  // 注册新配方
  static registerRecipe(recipe: ThemeRecipe): boolean {
    const validation = this.validateRecipe(recipe)
    if (!validation.valid) {
      console.error('配方验证失败:', validation.issues)
      return false
    }

    if (validation.warnings.length > 0) {
      console.warn('配方验证警告:', validation.warnings)
    }

    RECIPE_REGISTRY[recipe.id] = recipe
    return true
  }
}

// 统一导出
export * from './corporateBlueRecipe'
export * from './creativePurpleRecipe'
export * from './techCyanRecipe'
export { RECIPE_REGISTRY, RECIPE_MANIFEST, RecipeRegistry }
```

## 🔍 配方验证器

### 完整性验证

```typescript
// recipe-validator.ts
export class RecipeValidator {
  static validateRecipeStructure(recipe: ThemeRecipe): ValidationResult {
    const issues = []
    const warnings = []

    // 基础属性验证
    if (!recipe.id || typeof recipe.id !== 'string') {
      issues.push('配方ID必须是非空字符串')
    }

    if (!recipe.name || typeof recipe.name !== 'string') {
      issues.push('配方名称必须是非空字符串')
    }

    if (!recipe.description || typeof recipe.description !== 'string') {
      warnings.push('建议添加配方描述')
    }

    // 七轴配置验证
    if (!recipe.axes) {
      issues.push('缺少七轴配置')
    } else {
      const axisValidation = this.validateAxes(recipe.axes)
      issues.push(...axisValidation.issues)
      warnings.push(...axisValidation.warnings)
    }

    // 令牌验证
    if (!recipe.tokens || typeof recipe.tokens !== 'object') {
      issues.push('缺少令牌定义或格式错误')
    } else {
      const tokenValidation = this.validateTokens(recipe.tokens)
      issues.push(...tokenValidation.issues)
      warnings.push(...tokenValidation.warnings)
    }

    return { valid: issues.length === 0, issues, warnings }
  }

  private static validateAxes(axes: any): ValidationResult {
    const issues = []
    const warnings = []

    const validModes = ['light', 'dark', 'hc']
    if (!validModes.includes(axes.mode)) {
      issues.push(`无效的模式轴: ${axes.mode}`)
    }

    const validBases = ['neutral-warm', 'neutral-cool', 'neutral-true']
    if (!axes.base || !validBases.some(base => axes.base.startsWith(base))) {
      issues.push(`无效的基础色轴: ${axes.base}`)
    }

    const validAccents = ['mono', 'analog', 'duo']
    if (!axes.accent || !validAccents.some(acc => axes.accent.startsWith(acc))) {
      issues.push(`无效的强调色轴: ${axes.accent}`)
    }

    const validTones = ['calm', 'standard', 'vivid']
    if (!validTones.includes(axes.tone)) {
      issues.push(`无效的色调轴: ${axes.tone}`)
    }

    const validDensities = ['spacious', 'comfortable', 'compact']
    if (!validDensities.includes(axes.density)) {
      issues.push(`无效的密度轴: ${axes.density}`)
    }

    const validMotions = ['subtle', 'standard', 'expressive']
    if (!axes.motion || !validMotions.some(motion => axes.motion.startsWith(motion))) {
      issues.push(`无效的动效轴: ${axes.motion}`)
    }

    const validSurfaces = ['flat', 'soft-shadow', 'glass', 'neon', 'glass+neon']
    if (!validSurfaces.includes(axes.surface)) {
      issues.push(`无效的表面轴: ${axes.surface}`)
    }

    return { valid: issues.length === 0, issues, warnings }
  }

  private static validateTokens(tokens: any): ValidationResult {
    const issues = []
    const warnings = []

    const requiredTokens = [
      'background', 'foreground', 'primary',
      'text-primary', 'border-primary', 'radius'
    ]

    requiredTokens.forEach(token => {
      if (!tokens[token]) {
        warnings.push(`建议添加基础令牌: ${token}`)
      }
    })

    // 验证颜色格式
    const colorTokens = ['background', 'foreground', 'primary', 'success', 'warning', 'danger']
    colorTokens.forEach(token => {
      if (tokens[token] && !this.isValidColor(tokens[token])) {
        issues.push(`无效的颜色格式: ${token} = ${tokens[token]}`)
      }
    })

    // 验证尺寸格式
    const sizeTokens = ['radius', 'shadow-md']
    sizeTokens.forEach(token => {
      if (tokens[token] && !this.isValidSize(tokens[token])) {
        warnings.push(`非标准尺寸格式: ${token} = ${tokens[token]}`)
      }
    })

    return { valid: issues.length === 0, issues, warnings }
  }

  private static isValidColor(color: string): boolean {
    // 支持 hex, rgb, hsl, CSS 变量
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^hsl\(/|^var\(/.test(color)
  }

  private static isValidSize(size: string): boolean {
    // 支持 px, rem, em, CSS 变量
    return /^\d+(px|rem|em)$|^var\(/.test(size)
  }
}
```

## 🚀 使用方法

### 配方创建

```bash
# 创建新配方
"创建新的主题配方：minimal-green，基于 light.neutral-true-low.mono(green).calm.spacious.subtle.flat"

# 复制现有配方
"基于 corporate-blue 配方创建 dark 变体版本"

# 配方变体生成
"为 tech-cyan 配方生成 light 模式版本"
```

### 配方验证

```bash
# 验证配方完整性
"验证 creative-purple 配方是否符合所有规范"

# 批量验证
"验证 recipes/ 目录下所有配方的完整性"

# 注册表检查
"检查配方注册表是否包含所有必需的配方"
```

### 配方管理

```bash
# 查看配方信息
"显示 tech-cyan 配方的详细信息"

# 配方搜索
"搜索适合'企业应用'的配方"

# 配方推荐
"为'设计工具'场景推荐最佳配方"
```

## 📋 验证报告格式

```
🎨 主题配方验证报告
📦 配方: creative-purple
📅 时间: 2025-01-XX

✅ 结构验证通过
- ✅ 配方ID和名称完整
- ✅ 七轴配置正确
- ✅ 令牌定义完整

⚠️ 警告 (2)
- ⚠️ 建议添加更多语义化颜色令牌
- ⚠️ 建议优化渐变色定义

📊 配方统计
- 令牌总数: 58 个
- 颜色令牌: 24 个
- 尺寸令牌: 18 个
- 动画令牌: 16 个

🎯 适用场景
- 设计工具: ✅ 完美匹配
- 创意平台: ✅ 高度推荐
- 企业应用: ⚠️ 部分适用

🔗 相关配方
- creative-dark (暗色变体)
- gradient-mix (渐变混合)
```

## 🛡️ 质量保证

### 严格验证规则

- **结构完整性**：所有配方必须包含完整的结构定义
- **七轴合规性**：轴值必须在有效范围内
- **令牌标准化**：令牌命名和格式必须符合规范
- **类型安全**：完整的 TypeScript 类型定义

### 自动化管理

- **构建时验证**：编译时验证所有配方完整性
- **注册表同步**：自动更新配方注册表和清单
- **文档生成**：自动生成配方使用文档
- **版本控制**：配方变更的版本追踪

基于 Xorigo UI v1.4 SSOT，确保所有主题配方的标准化、一致性和可维护性。