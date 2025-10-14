import { NextRequest, NextResponse } from 'next/server'

// 健康检查配置
const HEALTH_CHECK_CONFIG = {
  // 响应时间阈值 (毫秒)
  RESPONSE_TIME_THRESHOLD: 2000,
  // 内存使用阈值 (百分比)
  MEMORY_THRESHOLD: 85,
  // CPU 使用阈值 (百分比)
  CPU_THRESHOLD: 80,
  // 磁盘使用阈值 (百分比)
  DISK_THRESHOLD: 85,
}

// 系统健康状态检查
async function getSystemHealth() {
  const health = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'unknown',
    port: process.env.PORT || 3100,
    checks: {
      responseTime: {
        status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
        value: 0,
        threshold: HEALTH_CHECK_CONFIG.RESPONSE_TIME_THRESHOLD,
      },
      memory: {
        status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
        used: 0,
        total: 0,
        percentage: 0,
        threshold: HEALTH_CHECK_CONFIG.MEMORY_THRESHOLD,
      },
      cpu: {
        status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
        usage: 0,
        threshold: HEALTH_CHECK_CONFIG.CPU_THRESHOLD,
      },
    },
    services: {
      website: 'running',
      dataLayer: 'connected',
      playground: 'ready',
      database: {
        status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
        responseTime: 0,
      },
      redis: {
        status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
        responseTime: 0,
      },
    },
  }

  const startTime = Date.now()

  try {
    // 检查内存使用情况
    if (process.memoryUsage) {
      const memoryUsage = process.memoryUsage()
      const totalMemory = memoryUsage.heapTotal
      const usedMemory = memoryUsage.heapUsed
      const memoryPercentage = (usedMemory / totalMemory) * 100

      health.checks.memory.used = usedMemory
      health.checks.memory.total = totalMemory
      health.checks.memory.percentage = Math.round(memoryPercentage)

      if (memoryPercentage > HEALTH_CHECK_CONFIG.MEMORY_THRESHOLD) {
        health.checks.memory.status = 'unhealthy'
        health.status = 'unhealthy'
      } else if (memoryPercentage > HEALTH_CHECK_CONFIG.MEMORY_THRESHOLD * 0.8) {
        health.checks.memory.status = 'degraded'
        if (health.status === 'healthy') health.status = 'degraded'
      }
    }

    // 检查 CPU 使用情况 (简化版本)
    const cpuUsage = process.cpuUsage()
    const cpuPercentage = (cpuUsage.user + cpuUsage.system) / 1000000 // 转换为秒

    health.checks.cpu.usage = Math.round(cpuPercentage)

    if (cpuPercentage > HEALTH_CHECK_CONFIG.CPU_THRESHOLD) {
      health.checks.cpu.status = 'unhealthy'
      health.status = 'unhealthy'
    } else if (cpuPercentage > HEALTH_CHECK_CONFIG.CPU_THRESHOLD * 0.8) {
      health.checks.cpu.status = 'degraded'
      if (health.status === 'healthy') health.status = 'degraded'
    }

    // 检查数据库连接 (示例)
    const dbStartTime = Date.now()
    try {
      // 这里应该有实际的数据库连接检查
      health.services.database.responseTime = Date.now() - dbStartTime
      health.services.database.status = 'healthy'
    } catch (error) {
      health.services.database.status = 'unhealthy'
      health.status = 'unhealthy'
    }

    // 检查 Redis 连接 (示例)
    const redisStartTime = Date.now()
    try {
      // 这里应该有实际的 Redis 连接检查
      health.services.redis.responseTime = Date.now() - redisStartTime
      health.services.redis.status = 'healthy'
    } catch (error) {
      health.services.redis.status = 'unhealthy'
      health.status = 'unhealthy'
    }

  } catch (error) {
    health.status = 'unhealthy'
    console.error('Health check failed:', error)
  }

  // 检查响应时间
  const responseTime = Date.now() - startTime
  health.checks.responseTime.value = responseTime

  if (responseTime > HEALTH_CHECK_CONFIG.RESPONSE_TIME_THRESHOLD) {
    health.checks.responseTime.status = 'unhealthy'
    health.status = 'unhealthy'
  } else if (responseTime > HEALTH_CHECK_CONFIG.RESPONSE_TIME_THRESHOLD * 0.8) {
    health.checks.responseTime.status = 'degraded'
    if (health.status === 'healthy') health.status = 'degraded'
  }

  return health
}

// GET 请求处理
export async function GET(request: NextRequest) {
  try {
    const health = await getSystemHealth()

    // 根据健康状态设置响应码
    const statusCode = health.status === 'healthy' ? 200 :
                      health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Health check endpoint error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    )
  }
}

// HEAD 请求处理 (简单的存活检查)
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}

// POST 请求处理 (用于外部健康检查)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const health = await getSystemHealth()

    // 如果请求包含详细检查参数，返回更多信息
    if (body.detailed) {
      return NextResponse.json({
        ...health,
        detailed: {
          process: {
            pid: process.pid,
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
          },
          build: {
            buildTime: process.env.BUILD_TIME,
            gitCommit: process.env.GIT_COMMIT,
            version: process.env.npm_package_version,
          },
        },
      })
    }

    return NextResponse.json(health, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Detailed health check error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Detailed health check failed',
      },
      { status: 503 }
    )
  }
}

export const dynamic = 'force-dynamic'