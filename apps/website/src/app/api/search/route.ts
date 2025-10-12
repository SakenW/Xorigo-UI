/**
 * 搜索 API 路由
 * GET /api/search?q=xxx&type=xxx&page=1&pageSize=20
 */

import { NextRequest, NextResponse } from 'next/server'
import { SearchQuerySchema } from './types'
import type { SearchResponse, SearchResponseData } from './types'
import { searchEngine } from './search-engine'
import { preloadData, getCachedComponents, getCachedRecipes } from './data-loader'

// ============================================================================
// 初始化搜索引擎
// ============================================================================

let isInitialized = false

async function initializeSearchEngine() {
  if (isInitialized) {
    return
  }

  try {
    console.log('[SearchAPI] 初始化搜索引擎...')
    const { components, recipes } = await preloadData()

    searchEngine.initComponentSearch(components)
    searchEngine.initRecipeSearch(recipes)

    isInitialized = true
    console.log(`[SearchAPI] 初始化完成: ${components.length} 组件, ${recipes.length} 配方`)
  } catch (error) {
    console.error('[SearchAPI] 初始化失败:', error)
    throw error
  }
}

// ============================================================================
// GET 处理器
// ============================================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 1. 解析查询参数
    // 根据 Context7 文档：使用 request.nextUrl.searchParams 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const queryParams = {
      q: searchParams.get('q') || '',
      type: searchParams.get('type') || 'all',
      page: searchParams.get('page') || '1',
      pageSize: searchParams.get('pageSize') || '20',
    }

    // 2. Zod 验证
    const validationResult = SearchQuerySchema.safeParse(queryParams)

    if (!validationResult.success) {
      return NextResponse.json<SearchResponse>(
        {
          status: 'error',
          error: {
            message: '查询参数验证失败',
            code: 'VALIDATION_ERROR',
            details: validationResult.error.issues,
          },
          meta: {
            timestamp: new Date().toISOString(),
            query: queryParams.q,
            type: queryParams.type,
            duration: Date.now() - startTime,
          },
        },
        { status: 400 }
      )
    }

    const { q: query, type, page, pageSize } = validationResult.data

    // 3. 初始化搜索引擎
    await initializeSearchEngine()

    // 4. 执行搜索
    let allResults = []

    switch (type) {
      case 'component':
        allResults = searchEngine.searchComponents(query)
        break

      case 'recipe':
        allResults = searchEngine.searchRecipes(query)
        break

      case 'all':
      default:
        allResults = searchEngine.searchAll(query)
        break
    }

    // 5. 分页处理
    const total = allResults.length
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedResults = allResults.slice(startIndex, endIndex)

    // 6. 构建响应
    const responseData: SearchResponseData = {
      results: paginatedResults,
      pagination: {
        total,
        page,
        pageSize,
        hasMore: endIndex < total,
        totalPages: Math.ceil(total / pageSize),
      },
    }

    const duration = Date.now() - startTime

    return NextResponse.json<SearchResponse>(
      {
        status: 'success',
        data: responseData,
        meta: {
          timestamp: new Date().toISOString(),
          query,
          type,
          duration,
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('[SearchAPI] 搜索失败:', error)

    return NextResponse.json<SearchResponse>(
      {
        status: 'error',
        error: {
          message: '搜索服务内部错误',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : String(error),
        },
        meta: {
          timestamp: new Date().toISOString(),
          query: '',
          type: 'all',
          duration: Date.now() - startTime,
        },
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// 路由配置
// ============================================================================

// 启用 Edge Runtime 提升性能
export const runtime = 'edge'

// 缓存配置：GET 请求缓存 60 秒
export const dynamic = 'force-dynamic' // 始终动态执行（因为查询参数不同）
