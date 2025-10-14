import { NextRequest, NextResponse } from 'next/server'
import { readonlyRegistry } from '@/data/registry.readonly'

/**
 * 搜索 API 端点
 *
 * 提供全文搜索功能，支持：
 * - 组件搜索
 * - 文档搜索
 * - 分类搜索
 * - 标签搜索
 */

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// 处理 CORS 预检请求
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

// 搜索结果类型
interface SearchResult {
  type: 'component' | 'category' | 'tag'
  id: string
  title: string
  description: string
  url: string
  category?: string
  tags?: string[]
  score: number
}

// 计算搜索相关性分数
function calculateRelevanceScore(
  item: any,
  query: string,
  searchFields: string[]
): number {
  const queryLower = query.toLowerCase()
  let score = 0

  searchFields.forEach(field => {
    const fieldValue = item[field]?.toLowerCase() || ''

    // 完全匹配
    if (fieldValue === queryLower) {
      score += 100
    }
    // 开头匹配
    else if (fieldValue.startsWith(queryLower)) {
      score += 50
    }
    // 包含匹配
    else if (fieldValue.includes(queryLower)) {
      score += 10
    }
  })

  // 标签匹配加权
  if (item.tags) {
    item.tags.forEach((tag: string) => {
      const tagLower = tag.toLowerCase()
      if (tagLower === queryLower) {
        score += 30
      } else if (tagLower.includes(queryLower)) {
        score += 15
      }
    })
  }

  return score
}

// GET /api/search - 执行搜索
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Search query is required',
      }, {
        status: 400,
        headers: corsHeaders,
      })
    }

    const results: SearchResult[] = []

    // 搜索组件
    if (type === 'all' || type === 'components') {
      const components = readonlyRegistry.getComponents()
      const categoryDefinitions = readonlyRegistry.getCategories()

      let filteredComponents = components
      if (category) {
        filteredComponents = components.filter(comp => comp.category === category)
      }

      filteredComponents.forEach(comp => {
        const score = calculateRelevanceScore(comp, query, ['name', 'description'])

        if (score > 0) {
          results.push({
            type: 'component',
            id: comp.id,
            title: comp.name,
            description: comp.description,
            url: `/gallery?component=${comp.id}`,
            category: comp.category,
            tags: comp.tags,
            score,
          })
        }
      })
    }

    // 搜索分类
    if (type === 'all' || type === 'categories') {
      const categoryDefinitions = readonlyRegistry.getCategories()

      categoryDefinitions.forEach(cat => {
        const score = calculateRelevanceScore(cat, query, ['name', 'description'])

        if (score > 0) {
          results.push({
            type: 'category',
            id: cat.id,
            title: cat.name,
            description: cat.description,
            url: `/gallery?category=${cat.id}`,
            tags: cat.tags || [],
            score,
          })
        }
      })
    }

    // 搜索标签
    if (type === 'all' || type === 'tags') {
      const components = readonlyRegistry.getComponents()
      const tagCounts = new Map<string, { count: number, components: string[] }>()

      // 收集所有标签
      components.forEach(comp => {
        comp.tags?.forEach(tag => {
          if (!tagCounts.has(tag)) {
            tagCounts.set(tag, { count: 0, components: [] })
          }
          const tagData = tagCounts.get(tag)!
          tagData.count++
          tagData.components.push(comp.id)
        })
      })

      // 搜索标签
      tagCounts.forEach((tagData, tag) => {
        const score = calculateRelevanceScore(
          { tag, count: tagData.count },
          query,
          ['tag']
        )

        if (score > 0) {
          results.push({
            type: 'tag',
            id: tag,
            title: tag,
            description: `${tagData.count} components tagged with "${tag}"`,
            url: `/gallery?tag=${encodeURIComponent(tag)}`,
            tags: [tag],
            score,
          })
        }
      })
    }

    // 按相关性分数排序
    results.sort((a, b) => b.score - a.score)

    // 分页
    const paginatedResults = results.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: {
        query,
        results: paginatedResults,
        pagination: {
          total: results.length,
          limit,
          offset,
          hasMore: offset + limit < results.length,
        },
        filters: {
          type,
          category,
        },
        metadata: {
          searchedAt: new Date().toISOString(),
          processingTime: Date.now(), // 简化的处理时间
        }
      }
    }, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Search API Error:', error)

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to perform search',
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }
}