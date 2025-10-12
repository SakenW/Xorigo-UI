/**
 * 搜索 API 类型定义
 * 基于 Zod 验证和 Fuse.js 搜索结果
 */

import { z } from 'zod'

// ============================================================================
// Zod 验证模式
// ============================================================================

/**
 * 搜索查询参数验证
 * 根据 Context7 文档：使用 z.coerce.number() 处理 URL 查询参数
 */
export const SearchQuerySchema = z.object({
  q: z.string()
    .min(1, { message: '搜索关键词不能为空' })
    .max(100, { message: '搜索关键词不能超过100个字符' })
    .trim(), // 自动去除首尾空格

  type: z.enum(['component', 'recipe', 'all'])
    .default('all'),

  page: z.coerce.number()
    .min(1, { message: '页码必须大于0' })
    .default(1),

  pageSize: z.coerce.number()
    .min(1, { message: '每页数量必须大于0' })
    .max(50, { message: '每页数量不能超过50' })
    .default(20),
})

export type SearchQuery = z.infer<typeof SearchQuerySchema>

// ============================================================================
// 搜索结果类型
// ============================================================================

/**
 * 匹配高亮信息
 * Fuse.js includeMatches 返回的匹配位置
 */
export interface MatchInfo {
  key: string        // 匹配的字段名
  value: string      // 匹配的文本内容
  indices: [number, number][]  // 匹配的字符位置区间
}

/**
 * 搜索结果项
 * 统一的搜索结果格式
 */
export interface SearchResult {
  id: string
  type: 'component' | 'recipe'
  title: string
  description: string
  url: string
  score: number      // Fuse.js 匹配分数 (0-1, 越小越匹配)
  matches?: MatchInfo[]  // 匹配位置（用于高亮）
  metadata?: Record<string, any>  // 扩展元数据
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  totalPages: number
}

/**
 * 成功响应数据
 */
export interface SearchResponseData {
  results: SearchResult[]
  pagination: PaginationInfo
}

/**
 * 错误响应
 */
export interface SearchError {
  message: string
  code: string
  details?: any
}

/**
 * API 响应格式
 */
export interface SearchResponse {
  status: 'success' | 'error'
  data?: SearchResponseData
  error?: SearchError
  meta: {
    timestamp: string
    query: string
    type: string
    duration?: number  // 搜索耗时（毫秒）
  }
}

// ============================================================================
// 组件和配方数据类型
// ============================================================================

/**
 * 组件搜索数据格式
 * 从 @th-ui/registry 扩展
 */
export interface ComponentSearchData {
  id: string
  name: string
  description: string
  category: string
  tags?: string[]
  path: string  // URL 路径
}

/**
 * 配方搜索数据格式
 * 从 @th-ui/core unified-recipes 扩展
 */
export interface RecipeSearchData {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  mode?: string       // light/dark
  base?: string       // 基础色调
  accent?: string     // 强调色
  tone?: string       // 色彩饱和度
  density?: string    // 密度
  motion?: string     // 动效
  surface?: string    // 表面处理
  path: string        // URL 路径
}
