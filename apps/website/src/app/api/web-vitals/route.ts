import { NextRequest, NextResponse } from 'next/server'

// Web Vitals 数据接口
interface WebVitalsData {
  timestamp: number
  url: string
  userAgent: string
  metrics: {
    LCP: number | null
    FID: number | null
    CLS: number | null
    FCP: number | null
    TTFB: number | null
    INP: number | null
  }
  customMetrics: {
    renderTime: number
    bundleSize: number
    memoryUsage: number
  }
  sessionId?: string
  userId?: string
}

// 内存存储（生产环境应使用数据库）
let webVitalsData: WebVitalsData[] = []
const MAX_STORED_RECORDS = 1000

// 性能阈值配置
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, needsImprovement: 300 },  // First Input Delay (ms)
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte (ms)
  INP: { good: 200, needsImprovement: 500 },  // Interaction to Next Paint (ms)
}

// 生成性能评级
function getPerformanceRating(value: number | null, metric: keyof typeof PERFORMANCE_THRESHOLDS): 'good' | 'needs-improvement' | 'poor' {
  if (value === null) return 'poor'

  const threshold = PERFORMANCE_THRESHOLDS[metric]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.needsImprovement) return 'needs-improvement'
  return 'poor'
}

// 计算性能分数
function calculatePerformanceScore(metrics: WebVitalsData['metrics']): number {
  let score = 0
  let count = 0

  Object.entries(metrics).forEach(([key, value]) => {
    if (value !== null) {
      const rating = getPerformanceRating(value, key as keyof typeof PERFORMANCE_THRESHOLDS)
      if (rating === 'good') score += 100
      else if (rating === 'needs-improvement') score += 50
      else score += 0
      count++
    }
  })

  return count > 0 ? Math.round(score / count) : 0
}

// POST 请求处理 - 接收 Web Vitals 数据
export async function POST(request: NextRequest) {
  try {
    const data: WebVitalsData = await request.json()

    // 验证数据格式
    if (!data.metrics || !data.timestamp || !data.url) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // 添加服务器端时间戳
    data.timestamp = Date.now()

    // 计算性能分数
    const performanceScore = calculatePerformanceScore(data.metrics)

    // 增强数据
    const enrichedData = {
      ...data,
      performanceScore,
      serverTimestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
      country: request.headers.get('x-vercel-ip-country') || 'unknown',
    }

    // 存储数据
    webVitalsData.push(enrichedData)

    // 限制存储数量
    if (webVitalsData.length > MAX_STORED_RECORDS) {
      webVitalsData = webVitalsData.slice(-MAX_STORED_RECORDS)
    }

    // 记录关键指标
    console.log('Web Vitals received:', {
      url: data.url,
      LCP: data.metrics.LCP,
      FID: data.metrics.FID,
      CLS: data.metrics.CLS,
      performanceScore,
    })

    return NextResponse.json({
      success: true,
      message: 'Web Vitals data received',
      performanceScore,
    })
  } catch (error) {
    console.error('Web Vitals API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET 请求处理 - 获取聚合统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    period = searchParams.get('period') || '24h'
    url = searchParams.get('url')

    // 过滤数据
    let filteredData = webVitalsData
    const now = Date.now()

    // 时间范围过滤
    const timeRange = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }

    if (timeRange[period as keyof typeof timeRange]) {
      const cutoff = now - timeRange[period as keyof typeof timeRange]
      filteredData = filteredData.filter(record => record.timestamp > cutoff)
    }

    // URL 过滤
    if (url) {
      filteredData = filteredData.filter(record => record.url.includes(url))
    }

    if (filteredData.length === 0) {
      return NextResponse.json({
        message: 'No data available',
        period,
        url: url || 'all',
        recordCount: 0,
      })
    }

    // 计算统计数据
    const stats = {
      recordCount: filteredData.length,
      period,
      url: url || 'all',
      generated_at: new Date().toISOString(),
      metrics: {
        LCP: calculateMetricStats(filteredData.map(d => d.metrics.LCP).filter(Boolean)),
        FID: calculateMetricStats(filteredData.map(d => d.metrics.FID).filter(Boolean)),
        CLS: calculateMetricStats(filteredData.map(d => d.metrics.CLS).filter(Boolean)),
        FCP: calculateMetricStats(filteredData.map(d => d.metrics.FCP).filter(Boolean)),
        TTFB: calculateMetricStats(filteredData.map(d => d.metrics.TTFB).filter(Boolean)),
        INP: calculateMetricStats(filteredData.map(d => d.metrics.INP).filter(Boolean)),
      },
      performance: {
        averageScore: calculateAverageScore(filteredData),
        distribution: calculatePerformanceDistribution(filteredData),
      },
      customMetrics: {
        averageBundleSize: calculateAverage(filteredData.map(d => d.customMetrics.bundleSize)),
        averageMemoryUsage: calculateAverage(filteredData.map(d => d.customMetrics.memoryUsage)),
        averageRenderTime: calculateAverage(filteredData.map(d => d.customMetrics.renderTime)),
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Web Vitals stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}

// 计算指标统计数据
function calculateMetricStats(values: number[]) {
  if (values.length === 0) return null

  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((acc, val) => acc + val, 0)

  return {
    count: values.length,
    average: Math.round(sum / values.length),
    median: sorted[Math.floor(sorted.length / 2)],
    p75: sorted[Math.floor(sorted.length * 0.75)],
    p90: sorted[Math.floor(sorted.length * 0.9)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    min: sorted[0],
    max: sorted[sorted.length - 1],
  }
}

// 计算平均值
function calculateAverage(values: number[]) {
  if (values.length === 0) return 0
  return Math.round(values.reduce((acc, val) => acc + val, 0) / values.length)
}

// 计算平均性能分数
function calculateAverageScore(data: WebVitalsData[]) {
  if (data.length === 0) return 0
  const totalScore = data.reduce((acc, record) => {
    return acc + calculatePerformanceScore(record.metrics)
  }, 0)
  return Math.round(totalScore / data.length)
}

// 计算性能分布
function calculatePerformanceDistribution(data: WebVitalsData[]) {
  const distribution = { good: 0, needsImprovement: 0, poor: 0 }

  data.forEach(record => {
    const score = calculatePerformanceScore(record.metrics)
    if (score >= 80) distribution.good++
    else if (score >= 50) distribution.needsImprovement++
    else distribution.poor++
  })

  const total = distribution.good + distribution.needsImprovement + distribution.poor
  return {
    good: total > 0 ? Math.round((distribution.good / total) * 100) : 0,
    needsImprovement: total > 0 ? Math.round((distribution.needsImprovement / total) * 100) : 0,
    poor: total > 0 ? Math.round((distribution.poor / total) * 100) : 0,
  }
}

// DELETE 请求处理 - 清理数据
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan')

    if (olderThan) {
      const cutoff = new Date(olderThan).getTime()
      const beforeCount = webVitalsData.length
      webVitalsData = webVitalsData.filter(record => record.timestamp > cutoff)
      const deletedCount = beforeCount - webVitalsData.length

      return NextResponse.json({
        success: true,
        deletedRecords: deletedCount,
        remainingRecords: webVitalsData.length,
      })
    } else {
      // 清理所有数据
      const deletedCount = webVitalsData.length
      webVitalsData = []

      return NextResponse.json({
        success: true,
        deletedRecords: deletedCount,
        message: 'All Web Vitals data cleared',
      })
    }
  } catch (error) {
    console.error('Web Vitals cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup data' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'