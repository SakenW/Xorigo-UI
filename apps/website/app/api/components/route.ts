import { NextRequest, NextResponse } from 'next/server'
import { readonlyRegistry } from '@/data/registry.readonly'

/**
 * 组件 API 端点
 *
 * 提供组件数据的 RESTful API 接口，支持：
 * - 获取所有组件列表
 * - 获取特定分类的组件
 * - 获取组件详细信息
 * - 组件搜索功能
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

// GET /api/components - 获取组件数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const includeVariants = searchParams.get('variants') === 'true'
    const includeExamples = searchParams.get('examples') === 'true'

    // 获取基础数据
    const components = readonlyRegistry.getComponents()
    const categoryDefinitions = readonlyRegistry.getCategories()
    const validCategories = readonlyRegistry.getValidCategories()

    let filteredComponents = components

    // 按分类过滤
    if (category && validCategories.includes(category)) {
      filteredComponents = components.filter(comp => comp.category === category)
    }

    // 搜索功能
    if (search) {
      const searchLower = search.toLowerCase()
      filteredComponents = filteredComponents.filter(comp =>
        comp.name.toLowerCase().includes(searchLower) ||
        comp.description.toLowerCase().includes(searchLower) ||
        comp.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // 构建响应数据
    const responseData = {
      success: true,
      data: {
        components: filteredComponents.map(comp => {
          const baseData = {
            id: comp.id,
            name: comp.name,
            description: comp.description,
            category: comp.category,
            tags: comp.tags,
            version: comp.version,
            status: comp.status,
          }

          // 可选包含变体信息
          if (includeVariants && comp.variants) {
            return {
              ...baseData,
              variants: comp.variants,
              defaultProps: comp.defaultProps,
            }
          }

          // 可选包含示例代码
          if (includeExamples && comp.examples) {
            return {
              ...baseData,
              examples: comp.examples,
            }
          }

          return baseData
        }),
        categories: categoryDefinitions,
        metadata: {
          total: filteredComponents.length,
          filtered: category ? `category: ${category}` : search ? `search: ${search}` : 'all',
          requestedAt: new Date().toISOString(),
        }
      }
    }

    return NextResponse.json(responseData, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Components API Error:', error)

    return NextResponse.json({
      success: false,
      error: '服务器内部错误',
      message: '获取组件数据失败',
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }
}

// POST /api/components - 创建新组件（未来扩展）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证请求数据
    if (!body.name || !body.category) {
      return NextResponse.json({
        success: false,
        error: '验证失败',
        message: '名称和分类为必填项',
      }, {
        status: 400,
        headers: corsHeaders,
      })
    }

    // 这里可以实现组件创建逻辑
    // 目前返回占位响应
    return NextResponse.json({
      success: false,
      error: '功能尚未实现',
      message: '组件创建功能尚未实现',
    }, {
      status: 501,
      headers: corsHeaders,
    })

  } catch (error) {
    console.error('Components POST Error:', error)

    return NextResponse.json({
      success: false,
      error: '服务器内部错误',
      message: '组件创建失败',
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }
}