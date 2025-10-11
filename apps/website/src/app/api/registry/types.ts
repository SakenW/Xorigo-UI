/**
 * Registry API 类型定义
 * 基于 Next.js 15 Route Handlers 和 Zod 验证
 */

import { z } from 'zod'

/**
 * API 响应基础结构
 */
export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data?: T
  error?: {
    message: string
    code?: string
    details?: any
  }
  meta?: {
    timestamp: string
    version: string
  }
}

/**
 * 组件查询参数验证 Schema
 * 使用 Zod 验证查询参数
 */
export const RegistryQuerySchema = z.object({
  // 组件分类过滤
  category: z
    .enum(['ui', 'feedback', 'navigation', 'advanced', 'radix'])
    .optional(),

  // 搜索关键词（支持模糊搜索）
  search: z.string().optional(),

  // 组件名称列表（精确匹配）
  filter: z.string().optional(), // 逗号分隔的组件名称
})

/**
 * 组件详情路径参数验证 Schema
 */
export const ComponentParamsSchema = z.object({
  component: z.string().min(1, '组件名称不能为空'),
})

/**
 * 查询参数类型
 */
export type RegistryQuery = z.infer<typeof RegistryQuerySchema>

/**
 * 路径参数类型
 */
export type ComponentParams = z.infer<typeof ComponentParamsSchema>

/**
 * Fuse.js 搜索结果类型
 */
export interface FuseSearchResult<T> {
  item: T
  refIndex: number
  score?: number
  matches?: Array<{
    indices: Array<[number, number]>
    value: string
    key: string
  }>
}
