# 配方管理系统API设计规范 v2.0

**生成日期**: 2025-10-31
**版本**: v2.0
**架构师**: Winston (Holistic System Architect)
**文档类型**: 技术实施规范 (TDR-002)

---

## 📋 执行摘要

本文档定义了 Xorigo UI 配方管理系统的完整API架构，包括RESTful API设计、GraphQL查询接口、WebSocket实时通信和客户端SDK。支持配方的高性能CRUD操作、实时同步、版本控制和协作功能。

### 🎯 核心设计目标

- **高性能**: API响应时间 < 50ms，支持并发 > 1000 RPS
- **实时性**: 配方变更实时同步，延迟 < 100ms
- **可扩展性**: 支持百万级配方，水平扩展架构
- **类型安全**: 完整的TypeScript类型支持，自动生成API客户端
- **安全性**: RBAC权限控制，API限流，数据加密

---

## 🏗️ 系统架构设计

### 整体架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Web App       │    │   CLI Tool      │
│                 │    │                 │    │                 │
│ - React UI      │    │ - Next.js App   │    │ - Node.js CLI   │
│ - PWA           │    │ - Workbench     │    │ - Package Dev   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │    API Gateway Layer      │
                    │                           │
                    │ - Authentication         │
                    │ - Rate Limiting          │
                    │ - Load Balancing         │
                    │ - API Versioning         │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────┴───────┐    ┌─────────┴───────┐    ┌─────────┴───────┐
│  RESTful API    │    │   GraphQL API   │    │  WebSocket API  │
│                 │    │                 │    │                 │
│ - CRUD Ops      │    │ - Complex Query │    │ - Real-time     │
│ - File Upload   │    │ - Aggregation   │    │ - Collaboration │
│ - Bulk Ops      │    │ - Type Safety   │    │ - Live Preview  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │    Business Logic Layer   │
                    │                           │
                    │ - Recipe Manager         │
                    │ - Token Calculator       │
                    │ - Version Manager        │
                    │ - Collaboration Engine   │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     Data Storage Layer    │
                    │                           │
                    │ - PostgreSQL (Main DB)   │
                    │ - Redis (Cache)          │
                    │ - S3 (File Storage)      │
                    │ - Elasticsearch (Search) │
                    └───────────────────────────┘
```

### 数据库设计

```sql
-- 配方主表
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    author_id UUID NOT NULL REFERENCES users(id),
    category recipe_category NOT NULL DEFAULT 'user-generated',

    -- 七轴配置 (JSON存储)
    axis_config JSONB NOT NULL,

    -- 预计算令牌 (JSON存储)
    tokens_config JSONB NOT NULL,

    -- 元数据
    metadata JSONB NOT NULL DEFAULT '{}',

    -- 兼容性信息
    compatibility JSONB NOT NULL DEFAULT '{}',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,

    -- 索引字段
    popularity INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    is_deprecated BOOLEAN DEFAULT false,

    -- 搜索和过滤
    search_vector tsvector,
    tags TEXT[] DEFAULT '{}'
);

-- 配方版本历史表
CREATE TABLE recipe_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    axis_config JSONB NOT NULL,
    tokens_config JSONB NOT NULL,
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    is_current BOOLEAN DEFAULT false,

    UNIQUE(recipe_id, version)
);

-- 用户收藏表
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, recipe_id)
);

-- 配方使用统计表
CREATE TABLE recipe_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID,
    session_id VARCHAR(255),
    action_type usage_action NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    INDEX(recipe_id, created_at),
    INDEX(user_id, created_at)
);

-- 配方协作表
CREATE TABLE recipe_collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role collaboration_role NOT NULL DEFAULT 'viewer',
    invited_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(recipe_id, user_id)
);

-- 枚举类型
CREATE TYPE recipe_category AS ENUM (
    'core', 'seasonal', 'industry', 'accessibility',
    'user-generated', 'experimental'
);

CREATE TYPE usage_action AS ENUM (
    'view', 'apply', 'create', 'update', 'delete',
    'download', 'favorite', 'share'
);

CREATE TYPE collaboration_role AS ENUM (
    'owner', 'editor', 'viewer'
);

-- 索引优化
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_author ON recipes(author_id);
CREATE INDEX idx_recipes_popularity ON recipes(popularity DESC);
CREATE INDEX idx_recipes_rating ON recipes(rating DESC);
CREATE INDEX idx_recipes_created ON recipes(created_at DESC);
CREATE INDEX idx_recipes_public ON recipes(is_public) WHERE is_public = true;
CREATE INDEX idx_recipes_search ON recipes USING GIN(search_vector);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
```

---

## 🔌 RESTful API 设计

### 基础API结构

```typescript
// packages/api/src/types/api.ts
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

export interface ResponseMeta {
  total?: number
  page?: number
  limit?: number
  hasNext?: boolean
  hasPrev?: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: any
  stack?: string // 仅开发环境
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface RecipeFilters {
  category?: RecipeCategory
  author?: string
  tags?: string[]
  minRating?: number
  maxRating?: number
  isPublic?: boolean
  search?: string
}
```

### 配方CRUD API

```typescript
// packages/api/src/routes/recipes.ts
import { Router } from 'express'
import { RecipeService } from '../services/recipe-service'
import { validateRecipe, validateRecipeUpdate } from '../middleware/validation'
import { auth, rateLimit } from '../middleware/security'

const router = Router()
const recipeService = new RecipeService()

// 获取配方列表
router.get('/recipes',
  rateLimit({ windowMs: 60000, max: 100 }), // 1分钟100次
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'created_at',
        order = 'desc',
        category,
        author,
        tags,
        minRating,
        maxRating,
        isPublic,
        search
      } = req.query

      const filters: RecipeFilters = {
        category: category as RecipeCategory,
        author: author as string,
        tags: tags ? (tags as string).split(',') : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        maxRating: maxRating ? Number(maxRating) : undefined,
        isPublic: isPublic === 'true',
        search: search as string
      }

      const pagination = {
        page: Number(page),
        limit: Math.min(Number(limit), 100), // 最大100条
        sort: sort as string,
        order: order as 'asc' | 'desc'
      }

      const result = await recipeService.listRecipes(filters, pagination)

      res.json({
        success: true,
        data: result.recipes,
        meta: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          hasNext: result.hasNext,
          hasPrev: result.hasPrev
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      })
    }
  }
)

// 获取单个配方
router.get('/recipes/:id',
  rateLimit({ windowMs: 60000, max: 200 }),
  async (req, res) => {
    try {
      const { id } = req.params
      const { includeVersion = 'false', includeStats = 'false' } = req.query

      const recipe = await recipeService.getRecipe(id, {
        includeVersion: includeVersion === 'true',
        includeStats: includeStats === 'true'
      })

      if (!recipe) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RECIPE_NOT_FOUND',
            message: 'Recipe not found'
          }
        })
      }

      // 记录查看统计
      await recipeService.recordUsage(id, 'view', {
        user_id: req.user?.id,
        session_id: req.sessionID,
        user_agent: req.get('User-Agent')
      })

      res.json({
        success: true,
        data: recipe
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      })
    }
  }
)

// 创建配方
router.post('/recipes',
  auth,
  validateRecipe,
  rateLimit({ windowMs: 60000, max: 30 }),
  async (req, res) => {
    try {
      const recipeData = {
        ...req.body,
        author_id: req.user.id
      }

      const recipe = await recipeService.createRecipe(recipeData)

      res.status(201).json({
        success: true,
        data: recipe,
        meta: {
          message: 'Recipe created successfully'
        }
      })
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
            details: error.details
          }
        })
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      })
    }
  }
)

// 更新配方
router.put('/recipes/:id',
  auth,
  validateRecipeUpdate,
  rateLimit({ windowMs: 60000, max: 50 }),
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id

      // 检查权限
      const hasPermission = await recipeService.checkPermission(id, userId, 'edit')
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'PERMISSION_DENIED',
            message: 'You do not have permission to edit this recipe'
          }
        })
      }

      const recipe = await recipeService.updateRecipe(id, req.body, {
        createVersion: true,
        updatedBy: userId
      })

      res.json({
        success: true,
        data: recipe,
        meta: {
          message: 'Recipe updated successfully'
        }
      })
    } catch (error) {
      if (error.name === 'RecipeNotFoundError') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RECIPE_NOT_FOUND',
            message: 'Recipe not found'
          }
        })
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      })
    }
  }
)

// 删除配方
router.delete('/recipes/:id',
  auth,
  rateLimit({ windowMs: 60000, max: 20 }),
  async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id

      // 检查权限
      const hasPermission = await recipeService.checkPermission(id, userId, 'delete')
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'PERMISSION_DENIED',
            message: 'You do not have permission to delete this recipe'
          }
        })
      }

      await recipeService.deleteRecipe(id)

      res.json({
        success: true,
        meta: {
          message: 'Recipe deleted successfully'
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      })
    }
  }
)

// 批量操作
router.post('/recipes/batch',
  auth,
  rateLimit({ windowMs: 60000, max: 10 }),
  async (req, res) => {
    try {
      const { action, recipeIds } = req.body

      if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'recipeIds must be a non-empty array'
          }
        })
      }

      if (recipeIds.length > 50) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'TOO_MANY_ITEMS',
            message: 'Maximum 50 items allowed per batch operation'
          }
        })
      }

      const result = await recipeService.batchOperation(action, recipeIds, req.user.id)

      res.json({
        success: true,
        data: result,
        meta: {
          message: `Batch ${action} completed`
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message
        }
      })
    }
  }
)

export default router
```

### 配方搜索API

```typescript
// packages/api/src/routes/search.ts
import { Router } from 'express'
import { SearchService } from '../services/search-service'

const router = Router()
const searchService = new SearchService()

// 高级搜索
router.post('/search/recipes', async (req, res) => {
  try {
    const {
      query,
      filters = {},
      pagination = {},
      sort = { field: 'relevance', order: 'desc' },
      facets = ['category', 'tags', 'author']
    } = req.body

    const result = await searchService.searchRecipes({
      query,
      filters,
      pagination,
      sort,
      facets
    })

    res.json({
      success: true,
      data: {
        recipes: result.hits,
        facets: result.facets,
        aggregations: result.aggregations
      },
      meta: {
        total: result.total,
        took: result.took,
        max_score: result.max_score
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: error.message
      }
    })
  }
})

// 搜索建议
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q = '', limit = 10 } = req.query

    if (q.length < 2) {
      return res.json({
        success: true,
        data: []
      })
    }

    const suggestions = await searchService.getSuggestions(q as string, Number(limit))

    res.json({
      success: true,
      data: suggestions
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SEARCH_ERROR',
        message: error.message
      }
    })
  }
})

export default router
```

---

## 🎯 GraphQL API 设计

### Schema 定义

```graphql
# packages/api/src/graphql/schema.graphql
type Recipe {
  id: ID!
  name: String!
  description: String
  version: String!
  author: User!
  category: RecipeCategory!

  # 七轴配置
  axis: ThemeAxis!

  # 预计算令牌
  tokens: ThemeTokens!

  # 元数据
  metadata: RecipeMetadata!

  # 兼容性信息
  compatibility: RecipeCompatibility!

  # 时间戳
  createdAt: DateTime!
  updatedAt: DateTime!
  publishedAt: DateTime

  # 统计信息
  popularity: Int!
  rating: Float!
  downloads: Int!

  # 权限信息
  isPublic: Boolean!
  isDeprecated: Boolean!
  permissions: RecipePermissions!

  # 关联数据
  versions: [RecipeVersion!]!
  collaborators: [User!]!
  favorites: [User!]!
  usageStats: [UsageStat!]!
}

type ThemeAxis {
  mode: ThemeMode!
  hue: HuePreset!
  saturation: Float!
  lightness: Float!
  density: DensityPreset!
  roundness: Float!
  contrast: ContrastPreset!

  # 自定义扩展
  customHue: CustomHue
  customDensity: CustomDensity
  customRoundness: CustomRoundness
  customContrast: CustomContrast
}

type ThemeTokens {
  colors: ColorTokens!
  spacing: SpacingTokens!
  typography: TypographyTokens!
  effects: EffectTokens!
  motion: MotionTokens!
}

type RecipeMetadata {
  tags: [String!]!
  popularity: Int!
  rating: Float!
  downloads: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type RecipeCompatibility {
  coreVersion: String!
  browserSupport: [String!]!
  breakingChanges: Boolean!
}

type RecipeVersion {
  id: ID!
  version: String!
  axis: ThemeAxis!
  tokens: ThemeTokens!
  changelog: String
  createdAt: DateTime!
  createdBy: User!
  isCurrent: Boolean!
}

type User {
  id: ID!
  username: String!
  email: String!
  avatar: String
  bio: String

  # 统计信息
  recipesCount: Int!
  followersCount: Int!
  followingCount: Int!

  # 关联数据
  recipes: [Recipe!]!
  favorites: [Recipe!]!
  collaborations: [Recipe!]!
}

enum RecipeCategory {
  CORE
  SEASONAL
  INDUSTRY
  ACCESSIBILITY
  USER_GENERATED
  EXPERIMENTAL
}

enum ThemeMode {
  LIGHT
  DARK
  AUTO
}

enum HuePreset {
  BLUE
  PURPLE
  GREEN
  ORANGE
  RED
  YELLOW
  TEAL
  CUSTOM
}

enum DensityPreset {
  COMPACT
  COMFORTABLE
  SPACIOUS
  CUSTOM
}

enum ContrastPreset {
  LOW
  NORMAL
  HIGH
  CUSTOM
}

type Query {
  # 配方查询
  recipes(
    filters: RecipeFilters
    pagination: PaginationInput
    sort: SortInput
  ): RecipeConnection!

  recipe(id: ID!): Recipe

  # 搜索
  searchRecipes(
    query: String!
    filters: RecipeFilters
    pagination: PaginationInput
    sort: SortInput
    facets: [String!]
  ): RecipeSearchResult!

  # 用户查询
  user(id: ID!): User
  me: User

  # 统计查询
  recipeStats(timeRange: TimeRange): RecipeStats!
  popularRecipes(limit: Int = 10): [Recipe!]!
  trendingRecipes(limit: Int = 10): [Recipe!]!
}

type Mutation {
  # 配方操作
  createRecipe(input: CreateRecipeInput!): Recipe!
  updateRecipe(id: ID!, input: UpdateRecipeInput!): Recipe!
  deleteRecipe(id: ID!): Boolean!
  duplicateRecipe(id: ID!, name: String!): Recipe!

  # 版本管理
  createRecipeVersion(recipeId: ID!, input: CreateVersionInput!): RecipeVersion!
  restoreRecipeVersion(recipeId: ID!, version: String!): Recipe!

  # 收藏操作
  favoriteRecipe(recipeId: ID!): Recipe!
  unfavoriteRecipe(recipeId: ID!): Recipe!

  # 协作操作
  inviteCollaborator(recipeId: ID!, userId: ID!, role: CollaborationRole!): Collaboration!
  updateCollaboratorRole(recipeId: ID!, userId: ID!, role: CollaborationRole!): Collaboration!
  removeCollaborator(recipeId: ID!, userId: ID!): Boolean!

  # 批量操作
  batchCreateRecipes(input: [CreateRecipeInput!]!): [Recipe!]!
  batchUpdateRecipes(updates: [BatchUpdateInput!]!): [Recipe!]!
  batchDeleteRecipes(ids: [ID!]!): BatchDeleteResult!
}

type Subscription {
  # 实时订阅
  recipeUpdated(recipeId: ID!): Recipe!
  recipeCreated(authorId: ID): Recipe!
  recipeDeleted(recipeId: ID!): ID!

  # 协作订阅
  collaborationUpdated(recipeId: ID!): Collaboration!

  # 统计订阅
  recipeStatsUpdated: RecipeStats!
}

# 输入类型
input CreateRecipeInput {
  name: String!
  description: String
  category: RecipeCategory!
  axis: ThemeAxisInput!
  tags: [String!]
  isPublic: Boolean = false
}

input UpdateRecipeInput {
  name: String
  description: String
  axis: ThemeAxisInput
  tags: [String!]
  isPublic: Boolean
}

input ThemeAxisInput {
  mode: ThemeMode!
  hue: HuePreset!
  saturation: Float!
  lightness: Float!
  density: DensityPreset!
  roundness: Float!
  contrast: ContrastPreset!

  customHue: CustomHueInput
  customDensity: CustomDensityInput
  customRoundness: CustomRoundnessInput
  customContrast: CustomContrastInput
}

input RecipeFilters {
  category: RecipeCategory
  author: String
  tags: [String!]
  minRating: Float
  maxRating: Float
  isPublic: Boolean
  search: String
  dateRange: DateRangeInput
}

input PaginationInput {
  first: Int = 20
  after: String
  last: Int
  before: String
}

input SortInput {
  field: String = "created_at"
  order: SortOrder = DESC
}

enum SortOrder {
  ASC
  DESC
}

# 连接类型
type RecipeConnection {
  edges: [RecipeEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type RecipeEdge {
  node: Recipe!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# 搜索结果类型
type RecipeSearchResult {
  hits: [Recipe!]!
  facets: [RecipeFacet!]!
  aggregations: RecipeAggregations!
  meta: SearchMeta!
}

type RecipeFacet {
  field: String!
  values: [FacetValue!]!
}

type FacetValue {
  value: String!
  count: Int!
}

type SearchMeta {
  total: Int!
  took: Int!
  maxScore: Float
}
```

### GraphQL Resolvers

```typescript
// packages/api/src/graphql/resolvers/recipe-resolvers.ts
import { RecipeService } from '../services/recipe-service'
import { SearchService } from '../services/search-service'
import { PubSub } from 'graphql-subscriptions'

const pubsub = new PubSub()
const recipeService = new RecipeService()
const searchService = new SearchService()

export const recipeResolvers = {
  Query: {
    recipes: async (_: any, { filters, pagination, sort }: any) => {
      const result = await recipeService.listRecipes(filters, pagination, sort)

      return {
        edges: result.recipes.map((recipe, index) => ({
          node: recipe,
          cursor: Buffer.from(`${recipe.id}:${index}`).toString('base64')
        })),
        pageInfo: {
          hasNextPage: result.hasNext,
          hasPreviousPage: result.hasPrev,
          startCursor: result.recipes.length > 0
            ? Buffer.from(`${result.recipes[0].id}:0`).toString('base64')
            : null,
          endCursor: result.recipes.length > 0
            ? Buffer.from(`${result.recipes[result.recipes.length - 1].id}:${result.recipes.length - 1}`).toString('base64')
            : null
        },
        totalCount: result.total
      }
    },

    recipe: async (_: any, { id }: { id: string }) => {
      return recipeService.getRecipe(id)
    },

    searchRecipes: async (_: any, { query, filters, pagination, sort, facets }: any) => {
      const result = await searchService.searchRecipes({
        query,
        filters,
        pagination,
        sort,
        facets
      })

      return {
        hits: result.hits,
        facets: result.facets,
        aggregations: result.aggregations,
        meta: {
          total: result.total,
          took: result.took,
          maxScore: result.max_score
        }
      }
    }
  },

  Mutation: {
    createRecipe: async (_: any, { input }: { input: any }, { user }: any) => {
      const recipeData = {
        ...input,
        author_id: user.id
      }

      const recipe = await recipeService.createRecipe(recipeData)

      // 发布创建事件
      pubsub.publish('RECIPE_CREATED', {
        recipeCreated: recipe,
        authorId: user.id
      })

      return recipe
    },

    updateRecipe: async (_: any, { id, input }: { id: string, input: any }, { user }: any) => {
      // 检查权限
      const hasPermission = await recipeService.checkPermission(id, user.id, 'edit')
      if (!hasPermission) {
        throw new Error('Permission denied')
      }

      const recipe = await recipeService.updateRecipe(id, input, {
        createVersion: true,
        updatedBy: user.id
      })

      // 发布更新事件
      pubsub.publish('RECIPE_UPDATED', {
        recipeUpdated: recipe,
        recipeId: id
      })

      return recipe
    },

    deleteRecipe: async (_: any, { id }: { id: string }, { user }: any) => {
      // 检查权限
      const hasPermission = await recipeService.checkPermission(id, user.id, 'delete')
      if (!hasPermission) {
        throw new Error('Permission denied')
      }

      await recipeService.deleteRecipe(id)

      // 发布删除事件
      pubsub.publish('RECIPE_DELETED', {
        recipeDeleted: id,
        recipeId: id
      })

      return true
    }
  },

  Subscription: {
    recipeUpdated: {
      subscribe: (_: any, { recipeId }: { recipeId: string }) =>
        pubsub.asyncIterator([`RECIPE_UPDATED_${recipeId}`])
    },

    recipeCreated: {
      subscribe: (_: any, { authorId }: { authorId?: string }) =>
        pubsub.asyncIterator([
          authorId ? `RECIPE_CREATED_${authorId}` : 'RECIPE_CREATED'
        ])
    }
  },

  Recipe: {
    author: async (recipe: any) => {
      return recipeService.getUser(recipe.author_id)
    },

    versions: async (recipe: any) => {
      return recipeService.getRecipeVersions(recipe.id)
    },

    collaborators: async (recipe: any) => {
      return recipeService.getCollaborators(recipe.id)
    },

    permissions: async (recipe: any, _: any, { user }: any) => {
      return recipeService.getPermissions(recipe.id, user?.id)
    }
  }
}
```

---

## 🔌 WebSocket 实时通信

### WebSocket 服务

```typescript
// packages/api/src/websocket/recipe-websocket.ts
import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { authenticateSocket } from '../middleware/socket-auth'
import { RecipeCollaborationService } from '../services/recipe-collaboration-service'

export class RecipeWebSocket {
  private io: SocketIOServer
  private collaborationService: RecipeCollaborationService

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true
      }
    })

    this.collaborationService = new RecipeCollaborationService()
    this.setupMiddleware()
    this.setupEventHandlers()
  }

  private setupMiddleware(): void {
    this.io.use(authenticateSocket)
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      const user = socket.data.user
      console.log(`User ${user.id} connected`)

      // 加入配方房间
      socket.on('join-recipe', async (recipeId: string) => {
        try {
          // 检查权限
          const hasPermission = await this.collaborationService.checkPermission(
            recipeId,
            user.id,
            'viewer'
          )

          if (!hasPermission) {
            socket.emit('error', { code: 'PERMISSION_DENIED' })
            return
          }

          socket.join(`recipe:${recipeId}`)

          // 通知其他用户
          socket.to(`recipe:${recipeId}`).emit('user-joined', {
            userId: user.id,
            username: user.username
          })

          // 发送当前在线用户列表
          const onlineUsers = await this.getOnlineUsers(recipeId)
          socket.emit('online-users', onlineUsers)

        } catch (error) {
          socket.emit('error', { code: 'JOIN_FAILED', message: error.message })
        }
      })

      // 离开配方房间
      socket.on('leave-recipe', (recipeId: string) => {
        socket.leave(`recipe:${recipeId}`)
        socket.to(`recipe:${recipeId}`).emit('user-left', {
          userId: user.id,
          username: user.username
        })
      })

      // 实时配方编辑
      socket.on('recipe-edit', async (data: {
        recipeId: string
        field: string
        value: any
        version: number
      }) => {
        try {
          // 检查权限
          const hasPermission = await this.collaborationService.checkPermission(
            data.recipeId,
            user.id,
            'editor'
          )

          if (!hasPermission) {
            socket.emit('error', { code: 'PERMISSION_DENIED' })
            return
          }

          // 应用编辑
          const result = await this.collaborationService.applyEdit(
            data.recipeId,
            user.id,
            data.field,
            data.value,
            data.version
          )

          if (result.conflict) {
            // 发送冲突信息
            socket.emit('edit-conflict', {
              field: data.field,
              currentValue: result.currentValue,
              proposedValue: data.value
            })
          } else {
            // 广播编辑给其他用户
            socket.to(`recipe:${data.recipeId}`).emit('recipe-updated', {
              field: data.field,
              value: result.value,
              version: result.version,
              editedBy: {
                id: user.id,
                username: user.username
              }
            })

            // 确认编辑成功
            socket.emit('edit-confirmed', {
              field: data.field,
              version: result.version
            })
          }

        } catch (error) {
          socket.emit('error', { code: 'EDIT_FAILED', message: error.message })
        }
      })

      // 实时光标位置
      socket.on('cursor-position', (data: {
        recipeId: string
        field: string
        position: number
        selection?: { start: number; end: number }
      }) => {
        socket.to(`recipe:${data.recipeId}`).emit('cursor-update', {
          userId: user.id,
          username: user.username,
          field: data.field,
          position: data.position,
          selection: data.selection
        })
      })

      // 配方预览请求
      socket.on('preview-recipe', async (data: {
        recipeId: string
        axis: ThemeAxis
      }) => {
        try {
          // 生成预览令牌
          const previewTokens = await this.collaborationService.generatePreview(
            data.axis
          )

          socket.emit('preview-ready', {
            recipeId: data.recipeId,
            tokens: previewTokens
          })

        } catch (error) {
          socket.emit('error', { code: 'PREVIEW_FAILED', message: error.message })
        }
      })

      // 断开连接
      socket.on('disconnect', () => {
        console.log(`User ${user.id} disconnected`)

        // 通知所有配方房间用户离线
        socket.rooms.forEach(room => {
          if (room.startsWith('recipe:')) {
            socket.to(room).emit('user-left', {
              userId: user.id,
              username: user.username
            })
          }
        })
      })
    })
  }

  private async getOnlineUsers(recipeId: string): Promise<any[]> {
    const sockets = await this.io.in(`recipe:${recipeId}`).fetchSockets()
    const users = sockets.map(socket => socket.data.user)
    return users
  }

  // 广播配方更新
  public broadcastRecipeUpdate(recipeId: string, update: any): void {
    this.io.to(`recipe:${recipeId}`).emit('recipe-updated', update)
  }

  // 广播配方删除
  public broadcastRecipeDelete(recipeId: string): void {
    this.io.to(`recipe:${recipeId}`).emit('recipe-deleted', { recipeId })
  }
}
```

---

## 🛠️ 客户端SDK

### React SDK

```typescript
// packages/client-sdk/src/react/index.ts
import React, { createContext, useContext, useEffect, useState } from 'react'
import { RecipeClient } from '../core/recipe-client'

interface RecipeSDKContext {
  client: RecipeClient
  isLoading: boolean
  error: Error | null
}

const RecipeSDKContext = createContext<RecipeSDKContext | null>(null)

export interface RecipeSDKProviderProps {
  children: React.ReactNode
  apiUrl: string
  wsUrl?: string
  apiKey?: string
  autoConnect?: boolean
}

export const RecipeSDKProvider: React.FC<RecipeSDKProviderProps> = ({
  children,
  apiUrl,
  wsUrl,
  apiKey,
  autoConnect = true
}) => {
  const [client, setClient] = useState<RecipeClient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initClient = async () => {
      try {
        const recipeClient = new RecipeClient({
          apiUrl,
          wsUrl,
          apiKey
        })

        if (autoConnect) {
          await recipeClient.connect()
        }

        setClient(recipeClient)
        setIsLoading(false)
      } catch (err) {
        setError(err as Error)
        setIsLoading(false)
      }
    }

    initClient()

    return () => {
      client?.disconnect()
    }
  }, [apiUrl, wsUrl, apiKey, autoConnect])

  if (isLoading) {
    return <div>Loading Recipe SDK...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <RecipeSDKContext.Provider value={{ client: client!, isLoading, error }}>
      {children}
    </RecipeSDKContext.Provider>
  )
}

export const useRecipeSDK = (): RecipeSDKContext => {
  const context = useContext(RecipeSDKContext)
  if (!context) {
    throw new Error('useRecipeSDK must be used within RecipeSDKProvider')
  }
  return context
}

// React Hooks
export function useRecipes(filters?: RecipeFilters) {
  const { client } = useRecipeSDK()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true)
      try {
        const result = await client.recipes.list(filters)
        setRecipes(result.recipes)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [client, filters])

  const createRecipe = async (input: CreateRecipeInput) => {
    try {
      const newRecipe = await client.recipes.create(input)
      setRecipes(prev => [...prev, newRecipe])
      return newRecipe
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateRecipe = async (id: string, input: UpdateRecipeInput) => {
    try {
      const updatedRecipe = await client.recipes.update(id, input)
      setRecipes(prev => prev.map(r => r.id === id ? updatedRecipe : r))
      return updatedRecipe
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      await client.recipes.delete(id)
      setRecipes(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: () => loadRecipes()
  }
}

export function useRecipe(id: string) {
  const { client } = useRecipeSDK()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true)
      try {
        const recipeData = await client.recipes.get(id)
        setRecipe(recipeData)

        // 订阅实时更新
        const unsubscribe = client.recipes.subscribe(id, (updatedRecipe) => {
          setRecipe(updatedRecipe)
        })

        return unsubscribe
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    const unsubscribePromise = loadRecipe()

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe?.())
    }
  }, [client, id])

  const updateRecipe = async (input: UpdateRecipeInput) => {
    if (!recipe) return

    try {
      const updatedRecipe = await client.recipes.update(recipe.id, input)
      setRecipe(updatedRecipe)
      return updatedRecipe
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const applyRecipe = async () => {
    if (!recipe) return

    try {
      await client.recipes.apply(recipe.id)
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    recipe,
    loading,
    error,
    updateRecipe,
    applyRecipe
  }
}

export function useRecipeCollaboration(recipeId: string) {
  const { client } = useRecipeSDK()
  const [collaborators, setCollaborators] = useState<User[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!recipeId) return

    const collaboration = client.collaboration.join(recipeId)

    collaboration.on('users-changed', setCollaborators)
    collaboration.on('online-users-changed', setOnlineUsers)
    collaboration.on('connected', () => setIsConnected(true))
    collaboration.on('disconnected', () => setIsConnected(false))

    return () => {
      collaboration.leave()
    }
  }, [client, recipeId])

  const inviteCollaborator = async (userId: string, role: CollaborationRole) => {
    try {
      await client.collaboration.invite(recipeId, userId, role)
    } catch (err) {
      throw err
    }
  }

  const updateCollaboratorRole = async (userId: string, role: CollaborationRole) => {
    try {
      await client.collaboration.updateRole(recipeId, userId, role)
    } catch (err) {
      throw err
    }
  }

  const removeCollaborator = async (userId: string) => {
    try {
      await client.collaboration.remove(recipeId, userId)
    } catch (err) {
      throw err
    }
  }

  return {
    collaborators,
    onlineUsers,
    isConnected,
    inviteCollaborator,
    updateCollaboratorRole,
    removeCollaborator
  }
}
```

### 核心 Client 类

```typescript
// packages/client-sdk/src/core/recipe-client.ts
export class RecipeClient {
  private apiUrl: string
  private wsUrl?: string
  private apiKey?: string
  private httpClient: HttpClient
  private wsClient?: WebSocketClient
  private cache: Map<string, any> = new Map()

  constructor(options: RecipeClientOptions) {
    this.apiUrl = options.apiUrl
    this.wsUrl = options.wsUrl
    this.apiKey = options.apiKey
    this.httpClient = new HttpClient({
      baseURL: options.apiUrl,
      apiKey: options.apiKey
    })
  }

  async connect(): Promise<void> {
    if (this.wsUrl) {
      this.wsClient = new WebSocketClient(this.wsUrl)
      await this.wsClient.connect()
    }
  }

  disconnect(): void {
    this.wsClient?.disconnect()
  }

  get recipes() {
    return {
      list: (filters?: RecipeFilters, pagination?: PaginationParams) =>
        this.httpClient.get('/recipes', { ...filters, ...pagination }),

      get: (id: string, options?: { includeVersion?: boolean; includeStats?: boolean }) =>
        this.httpClient.get(`/recipes/${id}`, options),

      create: (input: CreateRecipeInput) =>
        this.httpClient.post('/recipes', input),

      update: (id: string, input: UpdateRecipeInput) =>
        this.httpClient.put(`/recipes/${id}`, input),

      delete: (id: string) =>
        this.httpClient.delete(`/recipes/${id}`),

      apply: (id: string) =>
        this.httpClient.post(`/recipes/${id}/apply`),

      duplicate: (id: string, name: string) =>
        this.httpClient.post(`/recipes/${id}/duplicate`, { name }),

      subscribe: (id: string, callback: (recipe: Recipe) => void) => {
        if (!this.wsClient) {
          throw new Error('WebSocket not connected')
        }

        return this.wsClient.subscribe(`recipe:${id}`, callback)
      }
    }
  }

  get search() {
    return {
      recipes: (query: string, options?: SearchOptions) =>
        this.httpClient.post('/search/recipes', { query, ...options }),

      suggestions: (query: string, limit = 10) =>
        this.httpClient.get('/search/suggestions', { q: query, limit })
    }
  }

  get collaboration() {
    return {
      join: (recipeId: string) => {
        if (!this.wsClient) {
          throw new Error('WebSocket not connected')
        }

        return new RecipeCollaboration(this.wsClient, recipeId)
      },

      invite: (recipeId: string, userId: string, role: CollaborationRole) =>
        this.httpClient.post(`/recipes/${recipeId}/collaborators`, { userId, role }),

      updateRole: (recipeId: string, userId: string, role: CollaborationRole) =>
        this.httpClient.put(`/recipes/${recipeId}/collaborators/${userId}`, { role }),

      remove: (recipeId: string, userId: string) =>
        this.httpClient.delete(`/recipes/${recipeId}/collaborators/${userId}`)
    }
  }
}
```

---

## 📊 性能监控和优化

### API性能监控

```typescript
// packages/api/src/middleware/performance-monitor.ts
import { Request, Response, NextFunction } from 'express'

export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()

  // 记录请求开始
  const requestId = generateRequestId()
  req.requestId = requestId

  // 监控响应时间
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const route = req.route?.path || req.path

    // 记录性能指标
    recordMetrics({
      requestId,
      method: req.method,
      route,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      timestamp: new Date()
    })

    // 慢查询警告
    if (duration > 1000) {
      console.warn(`Slow API request: ${req.method} ${route} - ${duration}ms`)
    }
  })

  next()
}

interface MetricsData {
  requestId: string
  method: string
  route: string
  statusCode: number
  duration: number
  userAgent: string
  ip: string
  timestamp: Date
}

async function recordMetrics(data: MetricsData) {
  // 发送到监控系统 (Prometheus, DataDog, etc.)
  try {
    await metricsCollector.record('api_request', data, {
      tags: {
        method: data.method,
        route: data.route,
        status: data.statusCode.toString()
      },
      fields: {
        duration: data.duration
      }
    })
  } catch (error) {
    console.error('Failed to record metrics:', error)
  }
}
```

### 缓存策略

```typescript
// packages/api/src/services/cache-service.ts
import Redis from 'ioredis'

export class CacheService {
  private redis: Redis
  private localCache = new Map<string, { data: any; expiry: number }>()

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    })
  }

  async get<T>(key: string): Promise<T | null> {
    // 1. 检查本地缓存
    const local = this.localCache.get(key)
    if (local && local.expiry > Date.now()) {
      return local.data
    }

    // 2. 检查Redis缓存
    try {
      const cached = await this.redis.get(key)
      if (cached) {
        const data = JSON.parse(cached)

        // 更新本地缓存
        this.localCache.set(key, {
          data,
          expiry: Date.now() + 60000 // 1分钟本地缓存
        })

        return data
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }

    return null
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const serialized = JSON.stringify(value)

    // 1. 设置本地缓存
    this.localCache.set(key, {
      data: value,
      expiry: Date.now() + Math.min(ttl * 1000, 60000) // 最多1分钟本地缓存
    })

    // 2. 设置Redis缓存
    try {
      await this.redis.setex(key, ttl, serialized)
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }

  async invalidate(pattern: string): Promise<void> {
    // 清除本地缓存
    for (const [key] of this.localCache) {
      if (key.match(pattern)) {
        this.localCache.delete(key)
      }
    }

    // 清除Redis缓存
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Redis cache error:', error)
    }
  }

  // 配方缓存策略
  async cacheRecipe(recipe: Recipe): Promise<void> {
    await this.set(`recipe:${recipe.id}`, recipe, 3600) // 1小时
    await this.set(`recipe:${recipe.id}:version:${recipe.version}`, recipe, 86400) // 24小时
  }

  async getCachedRecipe(id: string): Promise<Recipe | null> {
    return this.get<Recipe>(`recipe:${id}`)
  }

  async cacheRecipeList(filters: RecipeFilters, pagination: PaginationParams, result: RecipeListResult): Promise<void> {
    const cacheKey = `recipes:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
    await this.set(cacheKey, result, 300) // 5分钟
  }

  async getCachedRecipeList(filters: RecipeFilters, pagination: PaginationParams): Promise<RecipeListResult | null> {
    const cacheKey = `recipes:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
    return this.get<RecipeListResult>(cacheKey)
  }
}
```

---

## 📋 实施清单

### Phase 1: 基础API (3周)

- [ ] **数据库设计和迁移**
  - [ ] PostgreSQL表结构创建
  - [ ] 索引优化
  - [ ] 数据迁移脚本
  - [ ] 备份和恢复策略

- [ ] **RESTful API实现**
  - [ ] 配方CRUD操作
  - [ ] 搜索和过滤API
  - [ ] 批量操作API
  - [ ] 文件上传API

- [ ] **认证和授权**
  - [ ] JWT认证实现
  - [ ] RBAC权限控制
  - [ ] API密钥管理
  - [ ] 限流和安全中间件

### Phase 2: GraphQL和实时通信 (2周)

- [ ] **GraphQL API实现**
  - [ ] Schema定义
  - [ ] Resolvers实现
  - [ ] 订阅功能
  - [ ] Apollo Server集成

- [ ] **WebSocket服务**
  - [ ] Socket.IO集成
  - [ ] 实时协作功能
  - [ ] 房间管理
  - [ ] 连接管理

- [ ] **搜索功能**
  - [ ] Elasticsearch集成
  - [ ] 全文搜索
  - [ ] 聚合查询
  - [ ] 搜索建议

### Phase 3: 客户端SDK和优化 (2周)

- [ ] **React SDK**
  - [ ] 核心Client类
  - [ ] React Hooks
  - [ ] Context Provider
  - [ ] TypeScript类型定义

- [ ] **性能优化**
  - [ ] 缓存策略实现
  - [ ] 数据库查询优化
  - [ ] API响应压缩
  - [ ] CDN集成

- [ ] **监控和日志**
  - [ ] 性能监控
  - [ ] 错误追踪
  - [ ] 日志聚合
  - [ ] 健康检查

---

**文档版本**: v2.0
**最后更新**: 2025-10-31
**下次审查**: 2025-12-01
**状态**: ✅ API设计完成，准备实施