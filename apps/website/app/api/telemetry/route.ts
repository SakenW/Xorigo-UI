import { NextRequest, NextResponse } from 'next/server'

/**
 * 遥测 API 端点
 *
 * 收集和分析使用统计数据，支持：
 * - 组件使用统计
 * - 页面访问统计
 * - 搜索行为分析
 * - 性能指标收集
 */

// CORS 配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// 处理 CORS 预检请求
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

// 内存存储（生产环境应使用数据库）
const telemetryData = {
  componentViews: new Map<string, number>(),
  pageViews: new Map<string, number>(),
  searches: new Map<string, number>(),
  performanceMetrics: [] as Array<{
    timestamp: string
    page: string
    loadTime: number
    userAgent: string
  }>,
  lastReset: new Date().toISOString(),
}

// GET /api/telemetry - 获取遥测数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const period = searchParams.get('period') || '24h'

    switch (type) {
      case 'overview':
        return getOverview(period)
      case 'components':
        return getComponentStats()
      case 'pages':
        return getPageStats()
      case 'searches':
        return getSearchStats()
      case 'performance':
        return getPerformanceStats()
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type',
          message: 'Valid types: overview, components, pages, searches, performance',
        }, {
          status: 400,
          headers: corsHeaders,
        })
    }

  } catch (error) {
    console.error('Telemetry GET Error:', error)

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch telemetry data',
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }
}

// POST /api/telemetry - 记录遥测数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Type and data are required',
      }, {
        status: 400,
        headers: corsHeaders,
      })
    }

    switch (type) {
      case 'component_view':
        recordComponentView(data)
        break
      case 'page_view':
        recordPageView(data)
        break
      case 'search':
        recordSearch(data)
        break
      case 'performance':
        recordPerformance(data)
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type',
          message: 'Valid types: component_view, page_view, search, performance',
        }, {
          status: 400,
          headers: corsHeaders,
        })
    }

    return NextResponse.json({
      success: true,
      message: 'Telemetry data recorded',
    }, {
      headers: corsHeaders,
      status: 200,
    })

  } catch (error) {
    console.error('Telemetry POST Error:', error)

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to record telemetry data',
    }, {
      status: 500,
      headers: corsHeaders,
    })
  }
}

// 获取概览统计
function getOverview(period: string) {
  const now = new Date()
  const lastReset = new Date(telemetryData.lastReset)

  return NextResponse.json({
    success: true,
    data: {
      period,
      lastReset: telemetryData.lastReset,
      uptime: {
        days: Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)),
        hours: Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)),
      },
      summary: {
        totalComponentViews: Array.from(telemetryData.componentViews.values()).reduce((sum, count) => sum + count, 0),
        totalPageViews: Array.from(telemetryData.pageViews.values()).reduce((sum, count) => sum + count, 0),
        totalSearches: Array.from(telemetryData.searches.values()).reduce((sum, count) => sum + count, 0),
        totalPerformanceRecords: telemetryData.performanceMetrics.length,
      },
      topComponents: getTopComponents(5),
      topPages: getTopPages(5),
      topSearches: getTopSearches(5),
    }
  }, {
    headers: corsHeaders,
  })
}

// 获取组件统计
function getComponentStats() {
  const componentStats = Array.from(telemetryData.componentViews.entries())
    .map(([component, views]) => ({
      component,
      views,
      percentage: 0, // 将在计算中设置
    }))

  const totalViews = componentStats.reduce((sum, stat) => sum + stat.views, 0)

  componentStats.forEach(stat => {
    stat.percentage = totalViews > 0 ? (stat.views / totalViews) * 100 : 0
  })

  componentStats.sort((a, b) => b.views - a.views)

  return NextResponse.json({
    success: true,
    data: {
      components: componentStats,
      totalViews,
      uniqueComponents: componentStats.length,
    }
  }, {
    headers: corsHeaders,
  })
}

// 获取页面统计
function getPageStats() {
  const pageStats = Array.from(telemetryData.pageViews.entries())
    .map(([page, views]) => ({
      page,
      views,
      percentage: 0,
    }))

  const totalViews = pageStats.reduce((sum, stat) => sum + stat.views, 0)

  pageStats.forEach(stat => {
    stat.percentage = totalViews > 0 ? (stat.views / totalViews) * 100 : 0
  })

  pageStats.sort((a, b) => b.views - a.views)

  return NextResponse.json({
    success: true,
    data: {
      pages: pageStats,
      totalViews,
      uniquePages: pageStats.length,
    }
  }, {
    headers: corsHeaders,
  })
}

// 获取搜索统计
function getSearchStats() {
  const searchStats = Array.from(telemetryData.searches.entries())
    .map(([query, count]) => ({
      query,
      count,
      percentage: 0,
    }))

  const totalSearches = searchStats.reduce((sum, stat) => sum + stat.count, 0)

  searchStats.forEach(stat => {
    stat.percentage = totalSearches > 0 ? (stat.count / totalSearches) * 100 : 0
  })

  searchStats.sort((a, b) => b.count - a.count)

  return NextResponse.json({
    success: true,
    data: {
      searches: searchStats,
      totalSearches,
      uniqueQueries: searchStats.length,
    }
  }, {
    headers: corsHeaders,
  })
}

// 获取性能统计
function getPerformanceStats() {
  const metrics = telemetryData.performanceMetrics

  if (metrics.length === 0) {
    return NextResponse.json({
      success: true,
      data: {
        metrics: [],
        summary: {
          averageLoadTime: 0,
          minLoadTime: 0,
          maxLoadTime: 0,
          totalRecords: 0,
        }
      }
    }, {
      headers: corsHeaders,
    })
  }

  const loadTimes = metrics.map(m => m.loadTime)
  const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length
  const minLoadTime = Math.min(...loadTimes)
  const maxLoadTime = Math.max(...loadTimes)

  return NextResponse.json({
    success: true,
    data: {
      metrics: metrics.slice(-100), // 最近100条记录
      summary: {
        averageLoadTime: Math.round(averageLoadTime),
        minLoadTime,
        maxLoadTime,
        totalRecords: metrics.length,
      }
    }
  }, {
    headers: corsHeaders,
  })
}

// 记录组件查看
function recordComponentView(data: { componentId: string; timestamp?: string }) {
  const { componentId, timestamp = new Date().toISOString() } = data
  const current = telemetryData.componentViews.get(componentId) || 0
  telemetryData.componentViews.set(componentId, current + 1)
}

// 记录页面查看
function recordPageView(data: { page: string; timestamp?: string }) {
  const { page, timestamp = new Date().toISOString() } = data
  const current = telemetryData.pageViews.get(page) || 0
  telemetryData.pageViews.set(page, current + 1)
}

// 记录搜索
function recordSearch(data: { query: string; timestamp?: string; results?: number }) {
  const { query, timestamp = new Date().toISOString() } = data
  const current = telemetryData.searches.get(query) || 0
  telemetryData.searches.set(query, current + 1)
}

// 记录性能指标
function recordPerformance(data: {
  page: string
  loadTime: number
  userAgent?: string
  timestamp?: string
}) {
  const { page, loadTime, userAgent = 'unknown', timestamp = new Date().toISOString() } = data

  telemetryData.performanceMetrics.push({
    timestamp,
    page,
    loadTime,
    userAgent,
  })

  // 保留最近1000条记录
  if (telemetryData.performanceMetrics.length > 1000) {
    telemetryData.performanceMetrics = telemetryData.performanceMetrics.slice(-1000)
  }
}

// 辅助函数
function getTopComponents(limit: number) {
  return Array.from(telemetryData.componentViews.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([component, views]) => ({ component, views }))
}

function getTopPages(limit: number) {
  return Array.from(telemetryData.pageViews.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([page, views]) => ({ page, views }))
}

function getTopSearches(limit: number) {
  return Array.from(telemetryData.searches.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([query, count]) => ({ query, count }))
}