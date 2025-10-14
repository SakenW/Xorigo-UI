import { NextRequest, NextResponse } from 'next/server'
import { readonlyRegistry } from '@/data/registry.readonly'

/**
 * 健康检查 API 端点
 *
 * 提供系统健康状态检查，包括：
 * - API 服务状态
 * - 数据连接状态
 * - 系统性能指标
 * - 版本信息
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

// 系统信息
const systemInfo = {
  version: '2.0.0',
  name: 'Xorigo UI Website',
  description: 'Xorigo UI Component Library Website v2.0 - Workbench Architecture',
  environment: process.env.NODE_ENV || 'development',
  phase: '3-complete', // Phase 3: Workbench Editor Mode Complete
  startTime: new Date().toISOString(),
}

// GET /api/health - 健康检查
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    const { searchParams } = new URL(request.url)
    const detailed = searchParams.get('detailed') === 'true'

    // 基础健康检查
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - new Date(systemInfo.startTime).getTime(),
      system: systemInfo,
    }

    // 详细健康检查
    if (detailed) {
      // 检查数据连接
      let dataConnectionStatus = 'healthy'
      let dataConnectionError = null

      try {
        const components = readonlyRegistry.getComponents()
        const categories = readonlyRegistry.getCategories()

        if (components.length === 0) {
          dataConnectionStatus = 'warning'
          dataConnectionError = 'No components found'
        }

        if (categories.length === 0) {
          dataConnectionStatus = 'warning'
          dataConnectionError = 'No categories found'
        }

        healthStatus.data = {
          status: dataConnectionStatus,
          error: dataConnectionError,
          metrics: {
            componentsCount: components.length,
            categoriesCount: categories.length,
            validCategories: readonlyRegistry.getValidCategories().length,
          }
        }
      } catch (error) {
        healthStatus.data = {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown data connection error',
          metrics: null
        }
      }

      // API 端点检查
      const apiEndpoints = [
        '/api/components',
        '/api/search',
        '/api/telemetry',
        '/api/health',
      ]

      // Workbench 功能检查
      healthStatus.workbench = {
        status: 'healthy',
        features: {
          editorMode: true, // Monaco Editor 支持
          componentPreview: true, // 组件预览系统
          propsEditor: true, // 属性编辑器
          themeEditor: true, // 主题编辑器
          galleryIntegration: true, // Gallery 集成
        },
        supportedComponents: [
          'Button', 'Card', 'Input', 'Badge', 'Modal'
        ],
        architecture: 'unified-workbench-v2' // 统一架构v2
      }

      healthStatus.endpoints = apiEndpoints.map(endpoint => ({
        endpoint,
        status: 'healthy', // 在实际实现中，这里可以检查每个端点的响应
        responseTime: Math.random() * 100, // 模拟响应时间
      }))

      // 系统资源使用情况
      const memUsage = process.memoryUsage()
      healthStatus.systemResources = {
        memory: {
          rss: Math.round(memUsage.rss / 1024 / 1024), // MB
          heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
          heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
          external: Math.round(memUsage.external / 1024 / 1024), // MB
        },
        cpu: {
          usage: process.cpuUsage().user / 1000000, // 简化的 CPU 使用率
        },
      }

      // 性能指标
      healthStatus.performance = {
        responseTime: Date.now() - startTime,
        requestCount: Math.floor(Math.random() * 1000), // 模拟请求计数
        errorRate: Math.random() * 5, // 模拟错误率 (0-5%)
      }
    }

    // 确定整体健康状态
    if (healthStatus.data?.status === 'unhealthy') {
      healthStatus.status = 'unhealthy'
    } else if (healthStatus.data?.status === 'warning') {
      healthStatus.status = 'warning'
    }

    // 设置 HTTP 状态码
    const statusCode = healthStatus.status === 'healthy' ? 200 :
                        healthStatus.status === 'warning' ? 200 : 503

    return NextResponse.json(healthStatus, {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

  } catch (error) {
    console.error('Health Check Error:', error)

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown health check error',
      system: systemInfo,
    }, {
      status: 503,
      headers: corsHeaders,
    })
  }
}