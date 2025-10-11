/**
 * Registry API - 组件列表查询
 * GET /api/registry
 *
 * 功能：
 * - 查询组件列表
 * - 支持分类过滤 (category)
 * - 支持模糊搜索 (search)
 * - 支持精确过滤 (filter)
 *
 * 技术栈：
 * - Next.js 15 Route Handlers
 * - Zod 验证
 * - Fuse.js 模糊搜索
 * - @th-ui/registry 包
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRegistry } from '@th-ui/registry'
import type { Component } from '@th-ui/registry'
import {
  RegistryQuerySchema,
  type RegistryQuery,
  type ApiResponse,
} from './types'
import {
  createSuccessResponse,
  createErrorResponse,
  filterComponents,
  searchComponents,
} from './utils'

/**
 * GET 处理器 - 查询组件列表
 *
 * Query Parameters:
 * - category?: 'ui' | 'feedback' | 'navigation' | 'advanced' | 'radix'
 * - search?: string (模糊搜索关键词)
 * - filter?: string (逗号分隔的组件名称列表)
 *
 * Response:
 * {
 *   status: 'success' | 'error',
 *   data?: Component[],
 *   error?: { message, code, details },
 *   meta: { timestamp, version }
 * }
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. 解析查询参数
    const searchParams = request.nextUrl.searchParams
    const rawQuery: RegistryQuery = {
      category: searchParams.get('category') as any,
      search: searchParams.get('search') || undefined,
      filter: searchParams.get('filter') || undefined,
    }

    // 2. Zod 验证查询参数
    const validationResult = RegistryQuerySchema.safeParse(rawQuery)

    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(
          '查询参数验证失败',
          'VALIDATION_ERROR',
          validationResult.error.errors
        ),
        { status: 400 }
      )
    }

    const query = validationResult.data

    // 3. 生成注册表
    const registry = generateRegistry()
    let components: Component[] = registry.components

    // 4. 应用过滤条件
    const filterNames = query.filter
      ? query.filter.split(',').map((name) => name.trim())
      : undefined

    components = filterComponents(components, query.category, filterNames)

    // 5. 应用模糊搜索
    if (query.search) {
      const searchResults = searchComponents(components, query.search)
      // 提取搜索结果中的组件，按相关度排序
      components = searchResults.map((result) => result.item)
    }

    // 6. 返回成功响应
    return NextResponse.json(
      createSuccessResponse({
        components,
        total: components.length,
        query: {
          category: query.category,
          search: query.search,
          filter: filterNames,
        },
      }),
      { status: 200 }
    )
  } catch (error) {
    // 7. 错误处理
    console.error('Registry API Error:', error)

    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : '内部服务器错误',
        'INTERNAL_ERROR',
        error instanceof Error ? { stack: error.stack } : undefined
      ),
      { status: 500 }
    )
  }
}

/**
 * OPTIONS 处理器 - CORS 预检
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
