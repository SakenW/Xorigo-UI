# 🗄️ Website 数据层

四层架构数据层提供统一的只读数据访问接口，确保数据一致性、类型安全和性能优化。

## 📋 目录结构

```
src/data/
├── README.md                       # 本文档
├── index.ts                        # 统一导出入口
├── types.ts                        # TypeScript 类型定义
├── validation.ts                   # 统一验证层
│
├── registry.readonly.ts            # Registry 只读适配器
├── tokens.readonly.ts              # Tokens 只读适配器
├── docs.readonly.ts                # Docs 只读适配器 (新增)
├── recipes.readonly.ts             # Recipes 只读适配器
├── i18n.readonly.ts                # I18n 只读适配器
│
├── examples/                       # 使用示例
│   └── data-layer-usage.ts         # 完整使用示例
│
└── __tests__/                      # 单元测试
    ├── data-layer.test.ts          # 数据层基础测试 (新增)
    ├── registry.readonly.test.ts
    ├── recipes.readonly.test.ts
    └── i18n.readonly.test.ts
```

## 🏗️ 四层架构

1. **Registry** - 组件注册表数据
2. **Tokens** - 设计令牌系统
3. **Docs** - 文档系统
4. **Recipes** - 配方系统
5. **I18n** - 国际化系统

## 🎯 核心原则

### 1. 单一数据入口

**所有数据访问必须通过 `src/data/` 适配层**,禁止直接导入上游包:

```typescript
// ❌ 错误 - 禁止直接导入
import { generateRegistry } from '@xorigo-ui/registry'
import { getCoreTokens } from '@xorigo-ui/tokens'

// ✅ 正确 - 通过适配层访问
import { readonlyRegistry, readonlyRecipes } from '@/data'
```

### 2. 只读访问

所有适配器使用 **Singleton 模式**,确保:
- 数据不可变性
- 单一数据源
- 缓存和性能优化

### 3. Schema 验证

使用 **Zod Schema** 进行运行时验证:
- 数据结构完整性
- 类型安全性
- 一致性保证

### 4. ESLint 保护

ESLint 规则自动阻止直接导入上游包:

```javascript
// .eslintrc.cjs
'no-restricted-imports': [
  'error',
  {
    patterns: ['@xorigo-ui/registry', '@xorigo-ui/tokens'],
    // ... 详细配置见 .eslintrc.cjs
  }
]
```

## 🚀 快速开始

### 基础用法

```typescript
import {
  readonlyRegistry,
  readonlyRecipes,
  readonlyI18n,
  t
} from '@/data'

// 1. 获取所有组件
const components = readonlyRegistry.getComponents()

// 2. 获取单个组件
const buttonComponent = readonlyRegistry.getComponent('Button')

// 3. 按类别筛选
const uiComponents = readonlyRegistry.getComponentsByCategory('ui')

// 4. 获取所有配方
const recipes = readonlyRecipes.getAllRecipes()

// 5. 按轴筛选配方
const lightRecipes = readonlyRecipes.getRecipesByAxis('mode', 'light')

// 6. 高级筛选
const filteredRecipes = readonlyRecipes.filterRecipes({
  mode: 'light',
  tone: 'calm',
  density: 'comfortable'
})

// 7. 国际化翻译
const loading = t('common.loading', 'zh-CN')
const welcome = tWithParams('welcome.message', { name: 'Claude' })
```

## 📦 适配器详解

### Registry Adapter

组件注册表数据访问:

```typescript
import { readonlyRegistry } from '@/data'

// 获取所有组件
const allComponents = readonlyRegistry.getComponents()

// 获取单个组件
const component = readonlyRegistry.getComponent('Button')

// 按类别获取
const components = readonlyRegistry.getComponentsByCategory('ui')

// 获取所有类别
const categories = readonlyRegistry.getCategories()

// 按标签搜索
const components = readonlyRegistry.searchByTags(['form', 'input'])

// 获取元数据
const metadata = readonlyRegistry.getMetadata()

// 验证一致性
const result = readonlyRegistry.validateConsistency()
```

### Recipes Adapter

配方系统数据访问 (七轴配方):

```typescript
import { readonlyRecipes } from '@/data'

// 获取所有配方
const allRecipes = readonlyRecipes.getAllRecipes()

// 根据ID或名称获取
const recipe = readonlyRecipes.getRecipeById('corporate-blue')

// 按单个轴筛选
const lightRecipes = readonlyRecipes.getRecipesByAxis('mode', 'light')
const calmRecipes = readonlyRecipes.getRecipesByAxis('tone', 'calm')

// 高级多条件筛选
const filteredRecipes = readonlyRecipes.filterRecipes({
  mode: 'light',
  tone: 'calm',
  density: 'comfortable',
  accentHue: 'blue'
})

// 获取统计信息
const stats = readonlyRecipes.getStatistics()

// 获取所有可用值
const modes = readonlyRecipes.getModes()          // ['light', 'dark', 'hc']
const tones = readonlyRecipes.getTones()          // ['calm', 'standard', 'vivid']
const densities = readonlyRecipes.getDensities()  // ['compact', 'comfortable', 'spacious']
const hues = readonlyRecipes.getAccentHues()      // ['blue', 'cyan', 'purple', ...]
```

**七轴配方ID格式**:
```
mode.base.accent.tone.density.motion.surface

示例:
light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
```

### I18n Adapter

国际化数据访问:

```typescript
import { readonlyI18n, t, tWithParams } from '@/data'

// 基础翻译
const text = t('common.loading')                    // "加载中..."
const textEn = t('common.loading', 'en-US')        // "Loading..."

// 带参数的翻译
const message = tWithParams('welcome.user', { name: 'Claude' })

// 检查翻译是否存在
const exists = readonlyI18n.hasTranslation('common.loading')

// 获取所有翻译
const allTranslations = readonlyI18n.getAllTranslations('zh-CN')

// 配置和元数据
const config = readonlyI18n.getConfig()
const locales = readonlyI18n.getSupportedLocales()
const stats = readonlyI18n.getStatistics()

// 自定义配置
readonlyI18n.setConfig({
  defaultLocale: 'en-US',
  supportedLocales: ['en-US', 'zh-CN', 'ja-JP'],
  fallbackLocale: 'en-US'
})
```

## 🔍 数据验证

### 构建前验证

在构建前自动运行一致性校验:

```bash
# 自动运行 (通过 prebuild hook)
npm run build

# 手动运行
npm run validate:data
```

### 开发时检查

```bash
# 完整的数据完整性检查 (包含统计信息)
npm run check:data
```

### 编程式验证

```typescript
import {
  validateAllConsistency,
  printValidationReport,
  getValidationSummary
} from '@/data'

// 完整验证
const report = validateAllConsistency()
printValidationReport(report)

// 摘要信息
const summary = getValidationSummary()
console.log(`Valid: ${summary.isValid}`)
console.log(`Errors: ${summary.errorCount}`)
console.log(`Warnings: ${summary.warningCount}`)
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 运行数据层测试
npm run test:data

# 测试覆盖率
npm run test:coverage
```

## 📚 类型系统

完整的 TypeScript 类型支持:

```typescript
import type {
  // Registry 类型
  Component,
  Registry,
  ValidationResult,
  ValidationError,
  ValidationWarning,

  // Recipes 类型
  Recipe,
  RecipeFilterOptions,

  // I18n 类型
  I18nConfig,
  TranslationValue
} from '@/data'

// 使用示例
const component: Component = {
  name: 'Button',
  category: 'ui',
  description: '按钮组件',
  // ...
}

const filterOptions: RecipeFilterOptions = {
  mode: 'light',
  tone: 'calm',
  density: 'comfortable'
}
```

## ⚙️ 构建集成

### package.json Scripts

```json
{
  "scripts": {
    "prebuild": "tsx scripts/validate-readonly-consistency.ts",
    "build": "next build",
    "check:data": "tsx scripts/check-data-integrity.ts",
    "validate:data": "tsx scripts/validate-readonly-consistency.ts",
    "test:data": "vitest run src/data/__tests__"
  }
}
```

### 构建流程

```
开发阶段:
npm run dev → 启动开发服务器 (无验证)

构建阶段:
npm run build
  ↓
1. npm run prebuild (自动)
  ↓
2. tsx scripts/validate-readonly-consistency.ts
  ↓
3. 验证通过 → 继续构建
   验证失败 → 阻断构建
  ↓
4. next build
```

## 🛡️ ESLint 规则

`.eslintrc.cjs` 中的保护规则:

```javascript
'no-restricted-imports': [
  'error',
  {
    patterns: [
      {
        group: ['@xorigo-ui/registry', '@xorigo-ui/registry/*'],
        message: '❌ 禁止直接导入 @xorigo-ui/registry\n✅ 请使用: import { readonlyRegistry } from "@/data"'
      },
      {
        group: ['@xorigo-ui/tokens', '@xorigo-ui/tokens/*'],
        message: '❌ 禁止直接导入 @xorigo-ui/tokens\n✅ 请使用: import { readonlyRecipes } from "@/data"'
      }
    ]
  }
]
```

**例外情况** (overrides):
- `src/data/*.readonly.ts` - 适配器实现文件
- `src/data/types.ts` - 类型定义文件
- `**/*.test.ts` - 测试文件
- `scripts/**/*` - 构建脚本

## 🔄 数据流架构

```mermaid
graph TB
    A[上游包<br/>@xorigo-ui/registry<br/>@xorigo-ui/tokens] --> B[Data Layer<br/>只读适配层]
    B --> C[App/Pages<br/>应用代码]
    B --> D[Components<br/>组件代码]
    B --> E[API Routes<br/>API 端点]

    F[ESLint] -.禁止直接访问.-> A
    F -.强制使用.-> B

    G[Schema Validation] --> B
    H[Unit Tests] --> B
```

## 📖 最佳实践

### 1. 始终使用适配器

```typescript
// ✅ 推荐
import { readonlyRegistry } from '@/data'
const components = readonlyRegistry.getComponents()

// ❌ 禁止
import { generateRegistry } from '@xorigo-ui/registry'
const registry = generateRegistry()
```

### 2. 使用 TypeScript 类型

```typescript
import type { Component, Recipe } from '@/data'

function renderComponent(component: Component) {
  // 完整的类型提示和检查
}
```

### 3. 处理验证错误

```typescript
const result = readonlyRegistry.validateConsistency()

if (!result.valid) {
  result.errors.forEach(error => {
    console.error(`[${error.type}] ${error.message}`)
  })
}

if (result.warnings.length > 0) {
  console.warn(`Found ${result.warnings.length} warnings`)
}
```

### 4. 性能优化

适配器使用 Singleton 模式,数据自动缓存:

```typescript
// 多次调用不会重复加载数据
const components1 = readonlyRegistry.getComponents()
const components2 = readonlyRegistry.getComponents() // 使用缓存
```

## 🐛 故障排查

### ESLint 错误

**问题**: ESLint 报错禁止导入上游包

**解决**:
```typescript
// 错误代码
import { generateRegistry } from '@xorigo-ui/registry'

// 修正代码
import { readonlyRegistry } from '@/data'
```

### 构建失败

**问题**: `prebuild` 脚本失败,构建阻断

**排查步骤**:
1. 运行 `npm run validate:data` 查看详细错误
2. 运行 `npm run check:data` 查看数据统计
3. 检查 `packages/registry/registry.json` 数据是否完整
4. 检查 `packages/tokens/src/index.json` 数据是否正确

### 类型错误

**问题**: TypeScript 类型不匹配

**解决**: 确保导入类型而非值:
```typescript
// ✅ 正确
import type { Component } from '@/data'

// ❌ 错误 (可能导致运行时问题)
import { Component } from '@/data'
```

## 📞 支持

如有问题或建议,请联系:
- **Team**: Xorigo UI Architecture Team
- **Email**: architecture@xorigo-ui.dev
- **Docs**: `/docs/待整理/Website重构架构设计方案.md`

---

**版本**: v1.0.0
**更新时间**: 2025-10-13
**维护者**: Data Layer Builder Agent
