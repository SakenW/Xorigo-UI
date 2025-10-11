# 🎨 TH-UI 统一配方体系优化方案

## 📋 当前问题分析

### 1. **架构重复冲突**
- **旧系统**：`src/theme/ThemeProvider.tsx` - 10个创意主题配色
- **新系统**：`src/style-recipe/` - 七轴风格配方系统
- **问题**：两套系统并存，数据重复，维护困难

### 2. **数据不一致**
```typescript
// ThemeProvider.tsx - 旧系统
'cyber-blue-purple': { name: '赛博蓝紫', colors: colorTokens.primary, ... }

// unified-recipes.ts - 新系统
cyberBluePurpleRecipe: {
  id: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
  name: '赛博蓝紫',
  ...
}
```

### 3. **组件集成混乱**
- Button 组件直接使用 `useTheme()` 获取 ThemeProvider 数据
- 没有使用 style-recipe 的 `useStyleRecipe()` hook
- 缺少统一的令牌注入机制

---

## 🎯 优化目标

1. **统一数据源（SSOT）**：以 `style-recipe` 系统为唯一真相来源
2. **向后兼容**：保留 ThemeProvider API，内部桥接到 style-recipe
3. **渐进迁移**：支持组件逐步迁移到新系统
4. **完整集成**：Registry → Gallery → Adoption Kit → Matrix 闭环

---

## 📐 优化方案

### Phase 1: 统一配方定义（立即执行）

#### 1.1 合并创意配色到 unified-recipes.ts

**当前问题**：
- `unified-recipes.ts` 定义了10个创意配色（转换为七轴格式）
- `ThemeProvider.tsx` 定义了10个主题配置
- 数据重复且不一致

**解决方案**：
```typescript
// src/style-recipe/recipes/unified-recipes.ts

// ✅ 保留 - 创意配色的七轴标准定义（10个）
export const creativeConvertedRecipes: StyleRecipe[] = [
  cyberBluePurpleRecipe,     // 赛博蓝紫
  warmSunriseRecipe,          // 温暖晨曦
  deepOceanRecipe,            // 深海探索
  forestWhisperRecipe,        // 森林低语
  sunsetGlowRecipe,           // 日落余晖
  midnightGalaxyRecipe,       // 午夜银河
  springGardenRecipe,         // 春日花园
  autumnLeavesRecipe,         // 秋叶缤纷
  arcticFrostRecipe,          // 极地冰霜
  desertDunesRecipe,          // 沙漠沙丘
]

// ✅ 保留 - 官方配方（10个）
// 从 official-recipes.ts 导入
export { officialRecipes } from './official-recipes'

// ✅ 统一导出（20个配方）
export const unifiedRecipes: StyleRecipe[] = [
  ...creativeConvertedRecipes,  // 10个创意
  ...officialRecipes,           // 10个官方
]
```

#### 1.2 添加映射关系

```typescript
// src/style-recipe/recipes/unified-recipes.ts

/**
 * 旧主题 ID 到新配方 ID 的映射
 * 用于向后兼容 ThemeProvider
 */
export const legacyThemeMapping: Record<string, string> = {
  // 创意主题映射
  'cyber-blue-purple': 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass',
  'warm-sunrise': 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow',
  'deep-ocean': 'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated',
  'forest-nature': 'light.neutral-true-mid.analog(green).muted.spacious.minimal.flat',
  'pink-romance': 'light.neutral-warm-high.triadic(red).vibrant.comfortable.standard.soft-shadow',
  'midnight-galaxy': 'dark.neutral-cool-high.triadic(purple).vivid.comfortable.expressive.glass',
  'spring-garden': 'light.neutral-true-mid.analog(green).standard.comfortable.playful.soft-shadow',
  'autumn-leaves': 'light.neutral-warm-mid.triadic(orange).vibrant.comfortable.standard.elevated',
  'arctic-frost': 'light.neutral-cool-high.mono(blue).muted.spacious.minimal.flat',
  'desert-dunes': 'light.neutral-warm-mid.analog(yellow).standard.spacious.minimal.soft-shadow',

  // 经典主题映射
  'light': 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
  'dark': 'dark.neutral-true-high.mono(gray).standard.comfortable.standard.soft-shadow',
}

/**
 * 根据旧主题 ID 获取配方
 */
export function getRecipeByLegacyTheme(legacyThemeId: string): StyleRecipe | undefined {
  const recipeId = legacyThemeMapping[legacyThemeId]
  return recipeId ? getUnifiedRecipe(recipeId) : undefined
}
```

---

### Phase 2: 桥接层实现（兼容过渡）

#### 2.1 创建 ThemeProvider 桥接层

```typescript
// src/theme/ThemeProviderBridge.tsx

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  StyleRecipeProvider,
  useStyleRecipe,
  getRecipeByLegacyTheme,
  type StyleRecipe,
} from '../style-recipe'

/**
 * 旧版 ThemeProvider 的桥接实现
 * 内部使用 StyleRecipeProvider，但保持旧的 API
 */
export interface ThemeContextValue {
  currentTheme: string // 旧的主题 ID
  setTheme: (themeId: string) => void
  themeConfig: any // 保持向后兼容
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [legacyThemeId, setLegacyThemeId] = useState('cyber-blue-purple')

  // 获取对应的 StyleRecipe
  const recipe = getRecipeByLegacyTheme(legacyThemeId)

  return (
    <StyleRecipeProvider initialRecipe={recipe?.id}>
      <ThemeBridge legacyThemeId={legacyThemeId} setLegacyThemeId={setLegacyThemeId}>
        {children}
      </ThemeBridge>
    </StyleRecipeProvider>
  )
}

const ThemeBridge: React.FC<{
  legacyThemeId: string
  setLegacyThemeId: (id: string) => void
  children: React.ReactNode
}> = ({ legacyThemeId, setLegacyThemeId, children }) => {
  const { currentRecipe, setRecipe } = useStyleRecipe()

  // 将 StyleRecipe 转换为旧的 ThemeConfig 格式
  const themeConfig = recipe ? convertRecipeToThemeConfig(currentRecipe) : {}

  const contextValue: ThemeContextValue = {
    currentTheme: legacyThemeId,
    setTheme: (themeId: string) => {
      setLegacyThemeId(themeId)
      const newRecipe = getRecipeByLegacyTheme(themeId)
      if (newRecipe) {
        setRecipe(newRecipe.id)
      }
    },
    themeConfig,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

/**
 * 将 StyleRecipe 转换为旧的 ThemeConfig 格式
 */
function convertRecipeToThemeConfig(recipe: StyleRecipe): any {
  return {
    name: recipe.name,
    colors: {}, // 从 recipe 的 tokens 提取
    gradient: '', // 从 recipe 的 surface tokens 提取
    glow: '',
    palette: {},
    category: recipe.category,
    mood: recipe.tags,
  }
}

/**
 * 向后兼容的 useTheme hook
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

#### 2.2 渐进式迁移路径

**步骤 1：保留旧 API，内部桥接**
```typescript
// ✅ 旧代码仍可正常工作
import { ThemeProvider, useTheme } from '../theme/ThemeProvider'

function MyComponent() {
  const { currentTheme, setTheme, themeConfig } = useTheme()
  // 一切照旧
}
```

**步骤 2：新组件直接使用 StyleRecipe**
```typescript
// ✅ 新代码使用新系统
import { useStyleRecipe } from '../style-recipe'

function NewComponent() {
  const { currentRecipe, setRecipe } = useStyleRecipe()
  // 使用标准化的七轴配方
}
```

**步骤 3：逐步迁移旧组件**
```typescript
// 🔄 迁移中...
// 1. Button.tsx - 优先迁移
// 2. Card.tsx
// 3. Input.tsx
// ...
```

---

### Phase 3: Registry 集成（展示与取用）

#### 3.1 创建 Registry 数据结构

```typescript
// src/registry/index.ts

import { unifiedRecipes, type StyleRecipe } from '../style-recipe'

export interface RegistryRecipe extends StyleRecipe {
  // Registry 扩展字段
  preview?: {
    thumbnail: string // 预览缩略图
    demoUrl: string   // 在线演示
  }
  usage?: {
    installations: number  // 使用次数
    rating: number        // 评分
    tags: string[]        // 标签
  }
  metadata?: {
    author: string
    version: string
    license: string
    updatedAt: string
  }
}

/**
 * 将 StyleRecipe 转换为 RegistryRecipe
 */
export function toRegistryRecipe(recipe: StyleRecipe): RegistryRecipe {
  return {
    ...recipe,
    preview: {
      thumbnail: `/thumbnails/${recipe.id}.png`,
      demoUrl: `/demo?recipe=${encodeURIComponent(recipe.id)}`,
    },
    usage: {
      installations: 0,
      rating: 0,
      tags: recipe.tags,
    },
    metadata: {
      author: 'TH-UI Team',
      version: '1.0.0',
      license: 'MIT',
      updatedAt: new Date().toISOString(),
    },
  }
}

/**
 * 生成 Registry JSON
 */
export function generateRegistryJSON(): RegistryRecipe[] {
  return unifiedRecipes.map(toRegistryRecipe)
}

/**
 * 导出为 JSON 文件（用于 CDN）
 */
export function exportRegistryJSON(): string {
  return JSON.stringify(generateRegistryJSON(), null, 2)
}
```

#### 3.2 Registry API 设计

```typescript
// src/registry/api.ts

export interface RegistryAPI {
  // 列表查询
  listRecipes(filters?: RecipeFilterOptions): Promise<RegistryRecipe[]>

  // 单个查询
  getRecipe(id: string): Promise<RegistryRecipe | null>

  // 搜索
  searchRecipes(query: string): Promise<RegistryRecipe[]>

  // 推荐
  getRecommendedRecipes(context?: any): Promise<RegistryRecipe[]>

  // 统计
  trackInstallation(id: string): Promise<void>
  rateRecipe(id: string, rating: number): Promise<void>
}

/**
 * 基于 GitHub + JSON + CDN 的 Registry 实现
 */
export class GitHubRegistry implements RegistryAPI {
  constructor(
    private baseUrl: string = 'https://cdn.jsdelivr.net/gh/your-org/th-ui@main/registry'
  ) {}

  async listRecipes(filters?: RecipeFilterOptions): Promise<RegistryRecipe[]> {
    const response = await fetch(`${this.baseUrl}/recipes.json`)
    const allRecipes: RegistryRecipe[] = await response.json()

    if (!filters) return allRecipes

    return allRecipes.filter(recipe => {
      // 应用过滤器
      if (filters.mode && recipe.mode !== filters.mode) return false
      if (filters.category && recipe.category !== filters.category) return false
      return true
    })
  }

  async getRecipe(id: string): Promise<RegistryRecipe | null> {
    const recipes = await this.listRecipes()
    return recipes.find(r => r.id === id) || null
  }

  // ... 其他方法实现
}

export const registry = new GitHubRegistry()
```

---

### Phase 4: Gallery 展示层（UI）

#### 4.1 Gallery 组件设计

```typescript
// demo-site/components/RecipeGallery.tsx

import React, { useState, useEffect } from 'react'
import { registry, type RegistryRecipe } from '@th-ui/registry'
import { RecipeCard } from './RecipeCard'
import { RecipeFilters } from './RecipeFilters'

export const RecipeGallery: React.FC = () => {
  const [recipes, setRecipes] = useState<RegistryRecipe[]>([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRecipes()
  }, [filters])

  async function loadRecipes() {
    setLoading(true)
    const data = await registry.listRecipes(filters)
    setRecipes(data)
    setLoading(false)
  }

  return (
    <div className="recipe-gallery">
      <RecipeFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}
```

#### 4.2 RecipeCard 设计

```typescript
// demo-site/components/RecipeCard.tsx

export const RecipeCard: React.FC<{ recipe: RegistryRecipe }> = ({ recipe }) => {
  return (
    <Card className="recipe-card">
      {/* 缩略图预览 */}
      <div className="preview-image">
        <img src={recipe.preview.thumbnail} alt={recipe.name} />
      </div>

      {/* 配方信息 */}
      <div className="recipe-info">
        <h3>{recipe.name}</h3>
        <p>{recipe.description}</p>

        {/* 七轴显示 */}
        <div className="recipe-axes">
          <Badge>{recipe.mode}</Badge>
          <Badge>{recipe.tone}</Badge>
          <Badge>{recipe.density}</Badge>
        </div>

        {/* 操作按钮 */}
        <div className="actions">
          <Button onClick={() => previewRecipe(recipe)}>
            预览
          </Button>
          <Button onClick={() => installRecipe(recipe)}>
            安装
          </Button>
          <Button onClick={() => generateVariant(recipe)}>
            生成变体
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

---

### Phase 5: Adoption Kit（取用与集成）

#### 5.1 深链接协议

```typescript
// src/adoption-kit/deep-link.ts

export interface DeepLinkParams {
  recipeId: string
  variant?: 'base' | 'custom'
  overrides?: Partial<StyleRecipe>
}

/**
 * 生成深链接
 * 格式：thui://recipe?id={recipeId}&variant={variant}&overrides={...}
 */
export function generateDeepLink(params: DeepLinkParams): string {
  const baseUrl = 'thui://recipe'
  const searchParams = new URLSearchParams({
    id: params.recipeId,
    ...(params.variant && { variant: params.variant }),
    ...(params.overrides && { overrides: JSON.stringify(params.overrides) }),
  })

  return `${baseUrl}?${searchParams.toString()}`
}

/**
 * 解析深链接
 */
export function parseDeepLink(url: string): DeepLinkParams | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'thui:' || parsed.hostname !== 'recipe') {
      return null
    }

    const id = parsed.searchParams.get('id')
    if (!id) return null

    return {
      recipeId: id,
      variant: parsed.searchParams.get('variant') as any,
      overrides: JSON.parse(parsed.searchParams.get('overrides') || '{}'),
    }
  } catch {
    return null
  }
}
```

#### 5.2 沙盒导出协议

```typescript
// src/adoption-kit/sandbox-export.ts

export interface SandboxConfig {
  recipe: StyleRecipe
  components: string[]  // 使用的组件列表
  framework: 'react' | 'vue' | 'svelte'
}

/**
 * 导出为 CodeSandbox 配置
 */
export function exportToCodeSandbox(config: SandboxConfig): string {
  const packageJson = {
    name: 'th-ui-sandbox',
    dependencies: {
      '@th-ui/core': 'latest',
      react: '^19.2.0',
      'react-dom': '^19.2.0',
    },
  }

  const appCode = `
import { ThemeProvider } from '@th-ui/core/theme'
import { ${config.components.join(', ')} } from '@th-ui/core'

export default function App() {
  return (
    <ThemeProvider initialTheme="${config.recipe.id}">
      <div>
        {/* Your components here */}
      </div>
    </ThemeProvider>
  )
}
  `

  return JSON.stringify({
    files: {
      'package.json': { content: JSON.stringify(packageJson, null, 2) },
      'src/App.tsx': { content: appCode },
    },
  })
}
```

---

### Phase 6: Matrix 规则系统

#### 6.1 轴锁规则

```typescript
// src/style-recipe/matrix/axis-lock.ts

export interface AxisLockRule {
  name: string
  description: string
  condition: (recipe: StyleRecipe) => boolean
  locks: Partial<Record<keyof StyleRecipe, any>>
}

/**
 * 内置轴锁规则
 */
export const builtInAxisLocks: AxisLockRule[] = [
  {
    name: 'high-contrast-lock',
    description: '高对比度模式强制锁定',
    condition: (recipe) => recipe.mode === 'hc',
    locks: {
      tone: 'vivid',
      surface: 'flat',
    },
  },
  {
    name: 'glass-motion-lock',
    description: '玻璃表面需要表现力动效',
    condition: (recipe) => recipe.surface === 'glass',
    locks: {
      motion: 'expressive.spring',
    },
  },
  {
    name: 'minimal-aesthetic-lock',
    description: '极简风格一致性',
    condition: (recipe) => recipe.category === 'minimal',
    locks: {
      tone: 'calm',
      density: 'spacious',
      motion: 'subtle.classic',
      surface: 'flat',
    },
  },
]

/**
 * 应用轴锁规则
 */
export function applyAxisLocks(recipe: StyleRecipe): StyleRecipe {
  let lockedRecipe = { ...recipe }

  for (const rule of builtInAxisLocks) {
    if (rule.condition(recipe)) {
      lockedRecipe = { ...lockedRecipe, ...rule.locks }
    }
  }

  return lockedRecipe
}
```

#### 6.2 变体生成规则

```typescript
// src/style-recipe/matrix/variant-generator.ts

export interface VariantRule {
  name: string
  baseAxis: keyof StyleRecipe
  variants: Array<{
    value: any
    description: string
  }>
}

/**
 * 生成配方变体
 */
export function generateVariants(baseRecipe: StyleRecipe): StyleRecipe[] {
  const variants: StyleRecipe[] = []

  // 色调变体
  const toneVariants = ['calm', 'standard', 'vivid'] as const
  for (const tone of toneVariants) {
    if (tone !== baseRecipe.tone) {
      variants.push({
        ...baseRecipe,
        id: baseRecipe.id.replace(baseRecipe.tone, tone),
        tone,
        name: `${baseRecipe.name} (${tone})`,
      })
    }
  }

  // 密度变体
  const densityVariants = ['spacious', 'comfortable', 'compact'] as const
  for (const density of densityVariants) {
    if (density !== baseRecipe.density) {
      variants.push({
        ...baseRecipe,
        id: baseRecipe.id.replace(baseRecipe.density, density),
        density,
        name: `${baseRecipe.name} (${density})`,
      })
    }
  }

  return variants
}
```

---

## 📊 实施路线图

### P0 - 核心统一（1-2周）
- [x] ✅ 合并配方定义到 `unified-recipes.ts`
- [ ] 🔄 添加 `legacyThemeMapping` 映射
- [ ] 🔄 实现 `ThemeProviderBridge.tsx` 桥接层
- [ ] 🔄 验证向后兼容性（所有旧组件仍可工作）

### P1 - Registry 与 Gallery（2-3周）
- [ ] 📋 创建 `src/registry/` 目录结构
- [ ] 📋 实现 `GitHubRegistry` API
- [ ] 📋 开发 `RecipeGallery` 组件
- [ ] 📋 生成预览缩略图（自动化脚本）
- [ ] 📋 部署到 CDN（jsDelivr/Cloudflare Pages）

### P2 - Adoption Kit（3-4周）
- [ ] 🚀 深链接协议实现
- [ ] 🚀 沙盒导出功能
- [ ] 🚀 CLI 工具（`npx @th-ui/cli install-recipe`）
- [ ] 🚀 VS Code 扩展（配方预览和安装）

### P3 - Matrix 与优化（持续）
- [ ] 🔧 轴锁规则系统
- [ ] 🔧 智能变体生成
- [ ] 🔧 A11y 自动校验
- [ ] 🔧 性能优化（懒加载、缓存）

---

## 🎯 成功指标

1. **向后兼容性**：100% 旧代码无需修改即可运行
2. **性能提升**：配方切换 < 100ms
3. **开发体验**：新组件开发时间减少 30%
4. **扩展性**：支持社区贡献配方
5. **文档完整度**：每个 API 都有完整示例

---

## 📚 相关文档

- [七轴风格配方体系指南](./SEVEN_AXIS_SYSTEM_GUIDE.md)
- [Style Recipe 使用手册](./RECIPE_GUIDE.md)
- [TH-UI 架构文档](./ARCHITECTURE.md)
- [官方组件库技术手册](./TH-UI_GALLERY_ADOPTION_MATRIX_MANUAL.md)

---

**维护者**: TH-UI Team
**创建时间**: 2025-01-13
**最后更新**: 2025-01-13
**状态**: ✅ 待实施
