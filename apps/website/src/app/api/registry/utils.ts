/**
 * Registry API 工具函数
 * 包含 Fuse.js 搜索配置和响应处理
 */

import Fuse from 'fuse.js'
import type { Component } from '@xorigo-ui/registry'
import type { ApiResponse, FuseSearchResult } from './types'

/**
 * Fuse.js 搜索配置
 * 基于官方文档的最佳实践
 */
export const FUSE_OPTIONS = {
  // 匹配阈值：0.0 精确匹配，1.0 匹配任何内容
  // 0.3 是推荐的平衡值
  threshold: 0.3,

  // 搜索字段配置（带权重）
  keys: [
    {
      name: 'name',
      weight: 2, // 组件名称权重最高
    },
    {
      name: 'description',
      weight: 1, // 描述权重次之
    },
    {
      name: 'category',
      weight: 0.5, // 分类权重最低
    },
  ],

  // 返回匹配详情
  includeScore: true,
  includeMatches: true,

  // 搜索配置
  isCaseSensitive: false,
  shouldSort: true, // 按相关度排序
  findAllMatches: false,
  minMatchCharLength: 2, // 最小匹配长度

  // 位置和距离配置
  location: 0,
  distance: 100,

  // 忽略变音符号
  ignoreLocation: false,
  ignoreFieldNorm: false,
}

/**
 * 创建成功响应
 */
export function createSuccessResponse<T>(data: T, version = '0.1.0'): ApiResponse<T> {
  return {
    status: 'success',
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version,
    },
  }
}

/**
 * 创建错误响应
 */
export function createErrorResponse(
  message: string,
  code?: string,
  details?: any
): ApiResponse<never> {
  return {
    status: 'error',
    error: {
      message,
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    },
  }
}

/**
 * 过滤组件列表
 */
export function filterComponents(
  components: Component[],
  category?: string,
  filterNames?: string[]
): Component[] {
  let filtered = components

  // 按分类过滤
  if (category) {
    filtered = filtered.filter((c) => c.category === category)
  }

  // 按名称列表过滤
  if (filterNames && filterNames.length > 0) {
    filtered = filtered.filter((c) => filterNames.includes(c.name))
  }

  return filtered
}

/**
 * 执行模糊搜索
 */
export function searchComponents(
  components: Component[],
  query: string
): FuseSearchResult<Component>[] {
  const fuse = new Fuse(components, FUSE_OPTIONS)
  return fuse.search(query) as FuseSearchResult<Component>[]
}
