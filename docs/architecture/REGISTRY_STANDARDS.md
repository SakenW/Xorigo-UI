# 📋 Registry 标准化架构

> **目标**：统一 Registry 数据格式，确保 Gallery/Adoption/Matrix 数据一致性，支持 CI 自动校验

---

## 🎯 核心问题

### ⚠️ 当前风险
- **Registry 形态尚未标准化** - Gallery/Adoption/Matrix 各自维护局部元数据
- **数据偏差风险** - 缺乏统一 Schema 导致数据不一致
- **CI 缺失校验** - 没有 Schema 验证机制确保数据质量

### ✅ 解决方案
- **固化 Registry Schema** - JSON Schema + TypeScript 类型定义
- **CI 自动校验** - 生成快照并进行 Schema 验证
- **文档代码同源** - Schema 定义与文档保持一致

---

## 📦 Registry Schema 设计

### 核心数据结构

```typescript
// src/types/registry.ts
export interface RegistryRecipe {
  // 基础信息
  id: string
  name: string
  description: string
  category: string
  version: string

  // 七轴参数
  config: {
    mode: ModeAxis
    base: BaseAxis
    accent: AccentAxis
    tone: ToneAxis
    density: DensityAxis
    motion: MotionAxis
    surface: SurfaceAxis
  }

  // 展示信息
  preview: {
    thumbnail: string
    screenshot?: string
    demoUrl?: string
    storybookUrl?: string
  }

  // 使用统计
  usage: {
    downloads: number
    rating: number
    ratingCount: number
    lastUsed: string
  }

  // 元数据
  metadata: {
    author: string
    created: string
    updated: string
    tags: string[]
    license: string
  }

  // 生成信息
  generated: {
    at: string
    by: string
    hash: string
  }
}

export interface RegistrySchema {
  version: string
  format: string
  generated: {
    at: string
    by: string
    hash: string
  }
  recipes: RegistryRecipe[]
  index: {
    byId: Record<string, RegistryRecipe>
    byCategory: Record<string, RegistryRecipe[]>
    byTag: Record<string, RegistryRecipe[]>
  }
}
```

### JSON Schema 定义

```json
// schemas/registry.json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://thui.dev/schemas/registry.json",
  "title": "TH-UI Registry Schema",
  "description": "Schema for TH-UI component registry data",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Registry version in semantic versioning"
    },
    "format": {
      "type": "string",
      "enum": ["th-ui-registry"],
      "description": "Registry format identifier"
    },
    "generated": {
      "$ref": "#/$defs/GeneratedInfo"
    },
    "recipes": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/RegistryRecipe"
      },
      "minItems": 1,
      "description": "Array of component recipes"
    },
    "index": {
      "$ref": "#/$defs/RegistryIndex"
    }
  },
  "required": ["version", "format", "generated", "recipes", "index"],
  "additionalProperties": false,
  "$defs": {
    "RegistryRecipe": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z]+\\.[a-z-]+\\.[a-z-]+\\.[a-z-]+\\.[a-z-]+\\.[a-z-]+\\.[a-z-]+$",
          "description": "Seven-axis recipe identifier"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50,
          "description": "Human-readable recipe name"
        },
        "description": {
          "type": "string",
          "minLength": 10,
          "maxLength": 200,
          "description": "Detailed recipe description"
        },
        "category": {
          "type": "string",
          "enum": ["corporate", "minimal", "tech", "creative", "classic"],
          "description": "Recipe category"
        },
        "config": {
          "$ref": "#/$defs/RecipeConfig"
        },
        "preview": {
          "$ref": "#/$defs/PreviewInfo"
        },
        "usage": {
          "$ref": "#/$defs/UsageStats"
        },
        "metadata": {
          "$ref": "#/$defs/Metadata"
        },
        "generated": {
          "$ref": "#/$defs/GeneratedInfo"
        }
      },
      "required": ["id", "name", "description", "category", "config", "metadata", "generated"]
    },
    "RecipeConfig": {
      "type": "object",
      "properties": {
        "mode": {
          "type": "string",
          "enum": ["light", "dark", "hc"]
        },
        "base": {
          "type": "string",
          "pattern": "^neutral-(warm|cool|true)-(low|mid|high)$"
        },
        "accent": {
          "type": "string",
          "pattern": "^(mono|analog|duo|triadic)\\([a-z]+\\)$"
        },
        "tone": {
          "type": "string",
          "enum": ["calm", "standard", "vivid", "vibrant"]
        },
        "density": {
          "type": "string",
          "enum": ["spacious", "comfortable", "compact"]
        },
        "motion": {
          "type": "string",
          "pattern": "^(subtle|standard|expressive)\\.(classic|spring|soft)$"
        },
        "surface": {
          "type": "string",
          "enum": ["flat", "soft-shadow", "elevated", "glass", "glass+neon"]
        }
      },
      "required": ["mode", "base", "accent", "tone", "density", "motion", "surface"]
    },
    "PreviewInfo": {
      "type": "object",
      "properties": {
        "thumbnail": {
          "type": "string",
          "format": "uri",
          "description": "Thumbnail image URL"
        },
        "screenshot": {
          "type": "string",
          "format": "uri",
          "description": "Full screenshot URL"
        },
        "demoUrl": {
          "type": "string",
          "format": "uri",
          "description": "Live demo URL"
        },
        "storybookUrl": {
          "type": "string",
          "format": "uri",
          "description": "Storybook story URL"
        }
      },
      "required": ["thumbnail"]
    },
    "UsageStats": {
      "type": "object",
      "properties": {
        "downloads": {
          "type": "integer",
          "minimum": 0,
          "description": "Total download count"
        },
        "rating": {
          "type": "number",
          "minimum": 0,
          "maximum": 5,
          "description": "Average rating (0-5)"
        },
        "ratingCount": {
          "type": "integer",
          "minimum": 0,
          "description": "Number of ratings"
        },
        "lastUsed": {
          "type": "string",
          "format": "date-time",
          "description": "Last used timestamp"
        }
      }
    },
    "Metadata": {
      "type": "object",
      "properties": {
        "author": {
          "type": "string",
          "description": "Recipe author"
        },
        "created": {
          "type": "string",
          "format": "date-time",
          "description": "Creation timestamp"
        },
        "updated": {
          "type": "string",
          "format": "date-time",
          "description": "Last update timestamp"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "uniqueItems": true,
          "description": "Descriptive tags"
        },
        "license": {
          "type": "string",
          "description": "License identifier"
        }
      },
      "required": ["author", "created", "license"]
    },
    "GeneratedInfo": {
      "type": "object",
      "properties": {
        "at": {
          "type": "string",
          "format": "date-time",
          "description": "Generation timestamp"
        },
        "by": {
          "type": "string",
          "description": "Generation tool/script"
        },
        "hash": {
          "type": "string",
          "description": "Content hash for validation"
        }
      },
      "required": ["at", "by", "hash"]
    },
    "RegistryIndex": {
      "type": "object",
      "properties": {
        "byId": {
          "type": "object",
          "patternProperties": {
            ".*": {
              "$ref": "#/$defs/RegistryRecipe"
            }
          },
          "description": "Recipe lookup by ID"
        },
        "byCategory": {
          "type": "object",
          "patternProperties": {
            ".*": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/RegistryRecipe"
              }
            }
          },
          "description": "Recipes grouped by category"
        },
        "byTag": {
          "type": "object",
          "patternProperties": {
            ".*": {
              "type": "array",
              "items": {
                "$ref": "#/$defs/RegistryRecipe"
              }
            }
          },
          "description": "Recipes grouped by tags"
        }
      }
    }
  }
}
```

---

## 🔧 Registry 生成器

### 核心生成器

```typescript
// src/registry/generator.ts
import { unifiedRecipes } from '@th-ui/core/style-recipe'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import crypto from 'crypto'

export class RegistryGenerator {
  private readonly outputPath: string
  private readonly schemaPath: string

  constructor(outputPath: string) {
    this.outputPath = outputPath
    this.schemaPath = join(outputPath, 'schemas')
  }

  /**
   * 生成完整的 Registry 数据
   */
  generateRegistry(): RegistrySchema {
    console.log('📋 开始生成 Registry 数据...')

    // 1. 转换配方数据
    const recipes = this.transformRecipes(unifiedRecipes)

    // 2. 构建索引
    const index = this.buildIndex(recipes)

    // 3. 生成元数据
    const metadata = this.generateMetadata()

    const registry: RegistrySchema = {
      version: '1.0.0',
      format: 'th-ui-registry',
      generated: metadata,
      recipes,
      index
    }

    console.log(`✅ 生成完成：${recipes.length} 个配方`)
    return registry
  }

  /**
   * 转换组件库配方到 Registry 格式
   */
  private transformRecipes(sourceRecipes: any[]): RegistryRecipe[] {
    return sourceRecipes.map(recipe => ({
      // 基础信息
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      version: '1.0.0',

      // 七轴配置
      config: {
        mode: recipe.mode,
        base: recipe.base,
        accent: recipe.accent,
        tone: recipe.tone,
        density: recipe.density,
        motion: recipe.motion,
        surface: recipe.surface,
      },

      // 预览信息
      preview: {
        thumbnail: `https://cdn.thui.dev/thumbnails/${encodeURIComponent(recipe.id)}.png`,
        screenshot: `https://cdn.thui.dev/screenshots/${encodeURIComponent(recipe.id)}.png`,
        demoUrl: `https://thui.dev/demo?recipe=${encodeURIComponent(recipe.id)}`,
        storybookUrl: `https://storybook.thui.dev/?path=/story/${recipe.category}-${recipe.name.toLowerCase().replace(/\s+/g, '-')}`,
      },

      // 使用统计（初始值）
      usage: {
        downloads: 0,
        rating: 0,
        ratingCount: 0,
        lastUsed: new Date().toISOString(),
      },

      // 元数据
      metadata: {
        author: 'TH-UI Team',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        tags: recipe.tags || [],
        license: 'MIT',
      },

      // 生成信息
      generated: {
        at: new Date().toISOString(),
        by: 'registry-generator',
        hash: this.calculateHash(recipe),
      }
    }))
  }

  /**
   * 构建索引
   */
  private buildIndex(recipes: RegistryRecipe[]): RegistryIndex {
    const byId: Record<string, RegistryRecipe> = {}
    const byCategory: Record<string, RegistryRecipe[]> = {}
    const byTag: Record<string, RegistryRecipe[]> = {}

    // 按ID索引
    recipes.forEach(recipe => {
      byId[recipe.id] = recipe
    })

    // 按类别索引
    recipes.forEach(recipe => {
      if (!byCategory[recipe.category]) {
        byCategory[recipe.category] = []
      }
      byCategory[recipe.category].push(recipe)
    })

    // 按标签索引
    recipes.forEach(recipe => {
      recipe.metadata.tags.forEach(tag => {
        if (!byTag[tag]) {
          byTag[tag] = []
        }
        byTag[tag].push(recipe)
      })
    })

    return { byId, byCategory, byTag }
  }

  /**
   * 生成元数据
   */
  private generateMetadata() {
    return {
      at: new Date().toISOString(),
      by: 'registry-generator',
      hash: 'placeholder', // 会在最终生成时更新
    }
  }

  /**
   * 计算内容哈希
   */
  private calculateHash(data: any): string {
    const content = JSON.stringify(data, Object.keys(data).sort())
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  /**
   * 写入 Registry 文件
   */
  writeRegistry(registry: RegistrySchema): void {
    // 确保输出目录存在
    mkdirSync(this.outputPath, { recursive: true })

    // 写入主文件
    const registryPath = join(this.outputPath, 'registry.json')
    writeFileSync(registryPath, JSON.stringify(registry, null, 2))

    // 写入压缩版本
    const minifiedPath = join(this.outputPath, 'registry.min.json')
    writeFileSync(minifiedPath, JSON.stringify(registry))

    // 写入类型定义文件
    const typesPath = join(this.outputPath, 'registry.d.ts')
    this.writeTypeDefinitions(typesPath, registry)

    console.log(`✅ Registry 文件已写入：${registryPath}`)
    console.log(`✅ 类型定义已写入：${typesPath}`)
  }

  /**
   * 生成 TypeScript 类型定义
   */
  private writeTypeDefinitions(typesPath: string, registry: RegistrySchema): void {
    const typeDefinitions = `
// 自动生成的 Registry 类型定义
// 生成时间：${registry.generated.at}

export interface RegistryRecipe {
  id: string
  name: string
  description: string
  category: string
  version: string
  config: {
    mode: 'light' | 'dark' | 'hc'
    base: string
    accent: string
    tone: 'calm' | 'standard' | 'vivid' | 'vibrant'
    density: 'spacious' | 'comfortable' | 'compact'
    motion: string
    surface: 'flat' | 'soft-shadow' | 'elevated' | 'glass' | 'glass+neon'
  }
  preview: {
    thumbnail: string
    screenshot?: string
    demoUrl?: string
    storybookUrl?: string
  }
  usage: {
    downloads: number
    rating: number
    ratingCount: number
    lastUsed: string
  }
  metadata: {
    author: string
    created: string
    updated: string
    tags: string[]
    license: string
  }
  generated: {
    at: string
    by: string
    hash: string
  }
}

export interface RegistrySchema {
  version: string
  format: string
  generated: {
    at: string
    by: string
    hash: string
  }
  recipes: RegistryRecipe[]
  index: {
    byId: Record<string, RegistryRecipe>
    byCategory: Record<string, RegistryRecipe[]>
    byTag: Record<string, RegistryRecipe[]>
  }
}

export const DEFAULT_REGISTRY_VERSION = '${registry.version}'
export const REGISTRY_FORMAT = '${registry.format}'
`

// 便捷函数
export function getRecipeById(id: string): RegistryRecipe | undefined {
  // 这里会在运行时从 registry.json 加载数据
  return undefined
}

export function getRecipesByCategory(category: string): RegistryRecipe[] {
  // 这里会在运行时从 registry.json 加载数据
  return []
}

export function getRecipesByTag(tag: string): RegistryRecipe[] {
  // 这里会在运行时从 registry.json 加载数据
  return []
}
`

    writeFileSync(typesPath, typeDefinitions)
  }

  /**
   * 验证 Registry 数据
   */
  validateRegistry(registry: RegistrySchema): boolean {
    try {
      // 基础结构验证
      if (!registry.recipes || registry.recipes.length === 0) {
        throw new Error('Registry must contain at least one recipe')
      }

      // 验证每个配方
      for (const recipe of registry.recipes) {
        this.validateRecipe(recipe)
      }

      // 验证索引一致性
      this.validateIndex(registry.recipes, registry.index)

      return true
    } catch (error) {
      console.error('❌ Registry 验证失败:', error.message)
      return false
    }
  }

  /**
   * 验证单个配方
   */
  private validateRecipe(recipe: RegistryRecipe): void {
    // ID 格式验证
    const idPattern = /^[a-z]+\.[a-z-]+\.[a-z-]+\.[a-z-]+\.[a-z-]+\.[a-z-]+\.[a-z-]+$/
    if (!idPattern.test(recipe.id)) {
      throw new Error(`Invalid recipe ID format: ${recipe.id}`)
    }

    // 必需字段验证
    const required = ['id', 'name', 'description', 'category', 'config', 'metadata']
    for (const field of required) {
      if (!recipe[field]) {
        throw new Error(`Recipe missing required field: ${field}`)
      }
    }
  }

  /**
   * 验证索引一致性
   */
  private validateIndex(recipes: RegistryRecipe[], index: RegistryIndex): void {
    // 验证 byId 索引
    const indexedIds = Object.keys(index.byId)
    const recipeIds = recipes.map(r => r.id)

    const missingIds = recipeIds.filter(id => !indexedIds.includes(id))
    const extraIds = indexedIds.filter(id => !recipeIds.includes(id))

    if (missingIds.length > 0) {
      throw new Error(`Index missing recipes: ${missingIds.join(', ')}`)
    }

    if (extraIds.length > 0) {
      throw new Error(`Index contains extra recipes: ${extraIds.join(', ')}`)
    }
  }
}
```

---

## 🔧 CI/CD 集成

### GitHub Actions 工作流

```yaml
# .github/workflows/registry.yml
name: Registry Generation & Validation

on:
  push:
    paths: ['src/style-recipe/recipes/**']
    branches: [main, develop]
  pull_request:
    paths: ['src/style-recipe/recipes/**']

jobs:
  generate-registry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: |
          npm ci

      - name: Generate Registry
        run: npm run generate:registry

      - name: Validate Registry
        run: npm run validate:registry

      - name: Upload to CDN
        run: npm run upload:registry

      - name: Update version info
        run: npm run update:registry-info

  validate-registry:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download Registry
        run: npm run download:registry

      - name: Validate Schema
        run: npm run validate:registry

      - name: Check Coverage
        run: npm run check:registry-coverage
```

### NPM 脚本

```json
// package.json
{
  "scripts": {
    "generate:registry": "ts-node scripts/generate-registry.ts",
    "validate:registry": "ts-node scripts/validate-registry.ts",
    "upload:registry": "ts-node scripts/upload-registry.ts",
    "download:registry": "ts-node scripts/download-registry.ts",
    "check:registry-coverage": "ts-node scripts/check-registry-coverage.ts",
    "update:registry-info": "ts-node scripts/update-registry-info.ts"
  }
}
```

### 验证脚本

```typescript
// scripts/validate-registry.ts
import { RegistryGenerator } from '../src/registry/generator'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

async function validateRegistry() {
  console.log('🔍 开始验证 Registry...')

  try {
    // 1. 生成最新 Registry
    const generator = new RegistryGenerator('public/registry')
    const registry = generator.generateRegistry()

    // 2. 验证结构
    const isValid = generator.validateRegistry(registry)

    if (!isValid) {
      console.error('❌ Registry 验证失败')
      process.exit(1)
    }

    // 3. 对比现有文件（如果存在）
    const existingPath = 'public/registry/registry.json'
    try {
      const existing = JSON.parse(readFileSync(existingPath, 'utf-8'))

      if (existing.version !== registry.version) {
        console.warn('⚠️ Registry 版本不匹配，建议更新')
      }

      if (existing.recipes.length !== registry.recipes.length) {
        console.warn('⚠️ 配方数量不匹配，建议重新生成')
      }
    } catch {
      console.log('ℹ️ 未找到现有 Registry，将创建新的')
    }

    // 4. 写入验证后的文件
    generator.writeRegistry(registry)

    console.log('✅ Registry 验证通过')
    console.log(`📊 包含 ${registry.recipes.length} 个配方`)

  } catch (error) {
    console.error('❌ Registry 验证失败:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  validateRegistry()
}
```

---

## 📊 监控和观测

### 数据质量指标

| 指标 | 目标 | 监控方式 |
|------|------|----------|
| **Schema 合规性** | 100% | CI 自动校验 |
| **数据一致性** | 100% | 跨文件对比检查 |
| **生成频率** | 每次配方更新 | 文件监控 |
| **API 可用性** | 99.9% | 健康检查端点 |
| **缓存命中率** | >90% | CDN 统计 |

### 健康检查端点

```typescript
// src/app/api/registry/health/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const registryPath = join(process.cwd(), 'public/registry', 'registry.json')
    const registry = JSON.parse(readFileSync(registryPath, 'utf-8'))

    const health = {
      status: 'healthy',
      version: registry.version,
      recipeCount: registry.recipes.length,
      lastUpdated: registry.generated.at,
      checksum: calculateChecksum(registry)
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

function calculateChecksum(data: any): string {
  const content = JSON.stringify(data)
  return require('crypto').createHash('md5').update(content).digest('hex')
}
```

---

## 📚 使用示例

### 在 Gallery 中使用

```typescript
// src/app/gallery/page.tsx
import { getRegistry } from '@th-ui/registry'

export default async function GalleryPage() {
  // 从 Registry 加载数据
  const registry = await getRegistry()

  return (
    <div className="gallery-page">
      <h1>配方库 ({registry.recipes.length} 个)</h1>

      <RecipeGrid recipes={registry.recipes} />
      <CategoryFilter categories={Object.keys(registry.index.byCategory)} />
      <TagFilter tags={Object.keys(registry.index.byTag)} />
    </div>
  )
}
```

### 在 Adoption Matrix 中使用

```typescript
// src/app/adoption/page.tsx
import { getRegistry } from '@th-ui/registry'
import { getRecipeById } from '@th-ui/registry'

export default function AdoptionPage() {
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const registry = getRegistry()

  const selectedRecipe = selectedRecipeId ? getRecipeById(selectedRecipeId) : registry.recipes[0]

  return (
    <div className="adoption-page">
      <RecipeSelector
        recipes={registry.recipes}
        selected={selectedRecipeId}
        onSelect={setSelectedRecipeId}
      />

      <ComponentSelector />
      <CodeGenerator recipe={selectedRecipe} />
    </div>
  )
}
```

---

**创建时间**: 2025-01-13
**更新时间**: 2025-01-13
**状态**: 📋 架构设计
**负责人**: TH-UI Team