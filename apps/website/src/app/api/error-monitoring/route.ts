import { NextRequest, NextResponse } from 'next/server'

// 错误数据接口
interface ErrorData {
  errorId: string
  timestamp: string
  message: string
  stack?: string
  componentStack?: string
  url: string
  userAgent: string
  location: {
    pathname: string
    search: string
    hash: string
  }
  environment: string
  version: string
  buildTime?: string
  customData?: {
    memory?: any
    network?: any
    navigation?: any
  }
  type: 'boundary' | 'manual' | 'unhandled'
}

// 内存存储（生产环境应使用数据库）
let errorData: ErrorData[] = []
const MAX_STORED_ERRORS = 500

// 错误分类
function categorizeError(error: ErrorData): 'critical' | 'high' | 'medium' | 'low' {
  const { message, stack } = error

  // 关键错误 - 影响核心功能
  if (
    message.includes('ChunkLoadError') ||
    message.includes('Loading chunk') ||
    message.includes('Network error') ||
    message.includes('Failed to fetch') ||
    stack?.includes('Cannot access') ||
    stack?.includes('TypeError: Cannot read')
  ) {
    return 'critical'
  }

  // 高优先级错误 - 影响用户体验
  if (
    message.includes('ReferenceError') ||
    message.includes('TypeError') ||
    message.includes('SyntaxError') ||
    stack?.includes('React Error')
  ) {
    return 'high'
  }

  // 中等优先级错误 - 非关键功能问题
  if (
    message.includes('Warning') ||
    message.includes('Deprecated') ||
    message.includes('console.error')
  ) {
    return 'medium'
  }

  // 低优先级错误 - 轻微问题
  return 'low'
}

// POST 请求处理 - 接收错误报告
export async function POST(request: NextRequest) {
  try {
    const error: ErrorData = await request.json()

    // 验证数据格式
    if (!error.message || !error.errorId || !error.timestamp) {
      return NextResponse.json(
        { error: 'Invalid error data format' },
        { status: 400 }
      )
    }

    // 增强错误数据
    const enrichedError = {
      ...error,
      category: categorizeError(error),
      serverTimestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
      country: request.headers.get('x-vercel-ip-country') || 'unknown',
      userAgent: request.headers.get('user-agent') || error.userAgent,
    }

    // 存储错误数据
    errorData.push(enrichedError)

    // 限制存储数量
    if (errorData.length > MAX_STORED_ERRORS) {
      errorData = errorData.slice(-MAX_STORED_ERRORS)
    }

    // 记录关键错误到控制台
    if (enrichedError.category === 'critical' || enrichedError.category === 'high') {
      console.error('Critical Error Report:', {
        errorId: error.errorId,
        message: error.message,
        url: error.url,
        category: enrichedError.category,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Error report received',
      errorId: error.errorId,
      category: enrichedError.category,
    })
  } catch (error) {
    console.error('Error monitoring API error:', error)
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}

// GET 请求处理 - 获取错误统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '24h'
    const category = searchParams.get('category')
    const type = searchParams.get('type')

    // 过滤数据
    let filteredData = errorData
    const now = Date.now()

    // 时间范围过滤
    const timeRange = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }

    if (timeRange[period as keyof typeof timeRange]) {
      const cutoff = now - timeRange[period as keyof typeof timeRange]
      filteredData = filteredData.filter(record =>
        new Date(record.timestamp).getTime() > cutoff
      )
    }

    // 类别过滤
    if (category) {
      filteredData = filteredData.filter(record =>
        (record as any).category === category
      )
    }

    // 类型过滤
    if (type) {
      filteredData = filteredData.filter(record => record.type === type)
    }

    // 计算统计数据
    const stats = {
      summary: {
        totalErrors: filteredData.length,
        period,
        category: category || 'all',
        type: type || 'all',
        generated_at: new Date().toISOString(),
      },
      categories: calculateCategoryStats(filteredData),
      types: calculateTypeStats(filteredData),
      topErrors: getTopErrors(filteredData, 10),
      trends: calculateErrorTrends(filteredData),
      affectedUrls: getAffectedUrls(filteredData, 10),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error stats API error:', error)
    return NextResponse.json(
      { error: 'Failed to get error statistics' },
      { status: 500 }
    )
  }
}

// 计算类别统计
function calculateCategoryStats(data: any[]) {
  const stats = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }

  data.forEach(error => {
    const category = (error as any).category || 'medium'
    if (stats[category as keyof typeof stats] !== undefined) {
      stats[category as keyof typeof stats]++
    }
  })

  const total = Object.values(stats).reduce((sum, count) => sum + count, 0)
  return {
    ...stats,
    total,
    distribution: total > 0 ? {
      critical: Math.round((stats.critical / total) * 100),
      high: Math.round((stats.high / total) * 100),
      medium: Math.round((stats.medium / total) * 100),
      low: Math.round((stats.low / total) * 100),
    } : { critical: 0, high: 0, medium: 0, low: 0 }
  }
}

// 计算类型统计
function calculateTypeStats(data: ErrorData[]) {
  const stats = {
    boundary: 0,
    manual: 0,
    unhandled: 0,
  }

  data.forEach(error => {
    if (stats[error.type] !== undefined) {
      stats[error.type]++
    }
  })

  const total = Object.values(stats).reduce((sum, count) => sum + count, 0)
  return {
    ...stats,
    total,
    distribution: total > 0 ? {
      boundary: Math.round((stats.boundary / total) * 100),
      manual: Math.round((stats.manual / total) * 100),
      unhandled: Math.round((stats.unhandled / total) * 100),
    } : { boundary: 0, manual: 0, unhandled: 0 }
  }
}

// 获取最频繁的错误
function getTopErrors(data: ErrorData[], limit: number) {
  const errorCounts = new Map<string, { count: number; message: string; url: string; category: string }>()

  data.forEach(error => {
    const key = error.message.split('\n')[0] // 只取错误消息的第一行
    const existing = errorCounts.get(key)

    if (existing) {
      existing.count++
    } else {
      errorCounts.set(key, {
        count: 1,
        message: error.message,
        url: error.url,
        category: (error as any).category || 'medium',
      })
    }
  })

  return Array.from(errorCounts.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([message, info]) => ({
      message,
      count: info.count,
      url: info.url,
      category: info.category,
    }))
}

// 计算错误趋势
function calculateErrorTrends(data: ErrorData[]) {
  const hourlyBuckets = new Map<string, number>()

  data.forEach(error => {
    const hour = new Date(error.timestamp).toISOString().slice(0, 13) // YYYY-MM-DDTHH
    hourlyBuckets.set(hour, (hourlyBuckets.get(hour) || 0) + 1)
  })

  return Array.from(hourlyBuckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, count]) => ({
      hour,
      count,
    }))
    .slice(-24) // 最近24小时
}

// 获取受影响的URL
function getAffectedUrls(data: ErrorData[], limit: number) {
  const urlCounts = new Map<string, number>()

  data.forEach(error => {
    const url = error.url
    urlCounts.set(url, (urlCounts.get(url) || 0) + 1)
  })

  return Array.from(urlCounts.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, limit)
    .map(([url, count]) => ({
      url,
      count,
    }))
}

// DELETE 请求处理 - 清理错误数据
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan')
    const category = searchParams.get('category')

    if (olderThan) {
      const cutoff = new Date(olderThan).getTime()
      const beforeCount = errorData.length
      errorData = errorData.filter(record =>
        new Date(record.timestamp).getTime() > cutoff
      )
      const deletedCount = beforeCount - errorData.length

      return NextResponse.json({
        success: true,
        deletedRecords: deletedCount,
        remainingRecords: errorData.length,
      })
    } else if (category) {
      const beforeCount = errorData.length
      errorData = errorData.filter(record =>
        (record as any).category !== category
      )
      const deletedCount = beforeCount - errorData.length

      return NextResponse.json({
        success: true,
        deletedRecords: deletedCount,
        remainingRecords: errorData.length,
        category,
      })
    } else {
      // 清理所有数据
      const deletedCount = errorData.length
      errorData = []

      return NextResponse.json({
        success: true,
        deletedRecords: deletedCount,
        message: 'All error data cleared',
      })
    }
  } catch (error) {
    console.error('Error cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup error data' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'