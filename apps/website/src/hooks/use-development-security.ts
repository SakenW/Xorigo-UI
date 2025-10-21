/**
 * 开发环境安全检测 Hook
 * 检测和阻止违规的开发命令执行
 */

import { useEffect, useCallback } from 'react'

interface DevelopmentRule {
  id: string
  pattern: RegExp
  message: string
  severity: 'error' | 'warning'
  action: 'block' | 'warn' | 'redirect'
  allowedInDocker?: boolean
}

interface Violation {
  rule: DevelopmentRule
  command: string
  timestamp: Date
  prevented: boolean
}

const DEVELOPMENT_RULES: DevelopmentRule[] = [
  {
    id: 'no-npm-dev',
    pattern: /npm\s+run\s+dev/gi,
    message: '🚨 禁止执行 npm run dev！请使用 Docker 容器进行开发',
    severity: 'error',
    action: 'block',
    allowedInDocker: false
  },
  {
    id: 'no-next-dev',
    pattern: /next\s+dev/gi,
    message: '🚨 禁止直接执行 next dev！请使用 Docker 容器',
    severity: 'error',
    action: 'block',
    allowedInDocker: false
  },
  {
    id: 'no-yarn-dev',
    pattern: /yarn\s+dev/gi,
    message: '🚨 禁止执行 yarn dev！请使用 Docker 容器',
    severity: 'error',
    action: 'block',
    allowedInDocker: false
  },
  {
    id: 'no-pnpm-dev',
    pattern: /pnpm\s+dev/gi,
    message: '🚨 禁止执行 pnpm dev！请使用 Docker 容器',
    severity: 'error',
    action: 'block',
    allowedInDocker: false
  }
]

const ALLOWED_DOCKER_COMMANDS = [
  'npm run docker:dev',
  'docker-compose',
  'docker compose'
]

export function useDevelopmentSecurity() {
  const checkCommand = useCallback((command: string): { allowed: boolean; rule?: DevelopmentRule } => {
    // 检查是否是 Docker 命令
    if (ALLOWED_DOCKER_COMMANDS.some(allowed => command.toLowerCase().includes(allowed.toLowerCase()))) {
      return { allowed: true }
    }

    // 检查是否违反规则
    for (const rule of DEVELOPMENT_RULES) {
      if (rule.pattern.test(command)) {
        return { allowed: false, rule }
      }
    }

    return { allowed: true }
  }, [])

  const getEnvironmentStatus = useCallback(() => {
    // 检查当前环境状态
    const isDockerContainer = process.env.DOCKER_CONTAINER === 'true'
    const isDevelopment = process.env.NODE_ENV === 'development'

    return {
      isDockerContainer,
      isDevelopment,
      correctPort: isDockerContainer ? 3100 : undefined,
      violations: [] as Violation[]
    }
  }, [])

  const reportViolation = useCallback((violation: Violation) => {
    // 记录违规行为
    console.error(`🚨 开发环境违规检测:`, {
      rule: violation.rule.id,
      command: violation.command,
      message: violation.rule.message,
      timestamp: violation.timestamp,
      prevented: violation.prevented
    })

    // 在生产环境中可以发送到监控系统
    if (typeof window !== 'undefined' && window.location?.hostname !== 'localhost') {
      // 可以集成错误监控服务
    }
  }, [])

  const preventCommand = useCallback((command: string, rule: DevelopmentRule) => {
    const violation: Violation = {
      rule,
      command,
      timestamp: new Date(),
      prevented: true
    }

    reportViolation(violation)

    // 显示错误信息
    console.error(`\n${rule.message}`)
    console.error(`✅ 正确的开发方式: npm run docker:dev 或 Docker Compose`)
    console.error(`🌐 访问地址: http://localhost:3100\n`)

    return false
  }, [reportViolation])

  const validateCommand = useCallback((command: string): boolean => {
    const { allowed, rule } = checkCommand(command)

    if (!allowed && rule) {
      return preventCommand(command, rule)
    }

    return allowed
  }, [checkCommand, preventCommand])

  // 检测现有违规进程
  const detectRunningViolations = useCallback(async () => {
    try {
      // 更精确的端口检测 - 避免误报 WSL 连接
      const checkPort = async (port: number): Promise<boolean> => {
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时

          const response = await fetch(`http://localhost:${port}`, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
              'User-Agent': 'Xorigo-Security-Check/1.0'
            }
          })

          clearTimeout(timeoutId)

          // 检查是否是 Next.js 开发服务器
          const serverType = response.headers.get('server') || ''
          const poweredBy = response.headers.get('x-powered-by') || ''
          const isNextDev = serverType.includes('Next.js') || poweredBy === 'Next.js'

          return isNextDev
        } catch (error) {
          // 连接超时或拒绝连接都不算违规
          return false
        }
      }

      const port3000 = await checkPort(3000)
      const port3001 = await checkPort(3001)
      const port3100 = await fetch('http://localhost:3100', {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      }).then(() => true).catch(() => false)

      // 只有确认是 Next.js 开发服务器才报告违规
      if (port3000 || port3001) {
        console.warn('⚠️ 检测到 Next.js 开发服务器在端口 ' + (port3000 ? '3000' : '3001') + ' 运行')
        console.warn('🚨 这是违规的 npm run dev 进程，请使用 Docker 容器')
        console.warn('✅ 正确方式: npm run docker:dev (端口 3100)')

        return {
          port3000,
          port3001,
          port3100,
          hasViolations: true,
          violationType: 'next-dev-server',
          message: '发现违规的 Next.js 开发服务器'
        }
      }

      if (port3100) {
        console.log('✅ Docker 容器端口 3100 正常运行')
      }

      return {
        port3000: false,
        port3001: false,
        port3100,
        hasViolations: false,
        violationType: null,
        message: '开发环境正常'
      }
    } catch (error) {
      console.error('端口检测失败:', error)
      return null
    }
  }, [])

  // 自动清理违规进程的函数 - 更安全的方式
  const cleanupViolations = useCallback(async () => {
    console.log('🧹 开始安全清理违规开发进程...')

    // 先进行精确检测
    const violations = await detectRunningViolations()

    if (!violations || !violations.hasViolations) {
      console.log('✅ 未发现违规进程，无需清理')
      return
    }

    console.log('🎯 精准定位违规进程...')
    console.log('⚠️ 以下命令仅清理确认的 npm run dev 进程，不会影响其他服务:')

    // 精确清理命令 - 只清理确认的违规进程
    const preciseCleanupCommands = [
      'pkill -f "npm run dev" --exact',
      'pkill -f "next dev" --exact',
      'fuser -k 3000/tcp 2>/dev/null || true',
      'fuser -k 3001/tcp 2>/dev/null || true'
    ]

    preciseCleanupCommands.forEach(cmd => {
      console.log(`   ${cmd}`)
    })

    console.log('📋 安全提醒:')
    console.log('   - 这些命令仅清理 npm run dev 相关进程')
    console.log('   - 不会影响 Docker 容器 (端口 3100)')
    console.log('   - 不会影响 WSL 系统进程')
    console.log('   - 清理完成后请验证: http://localhost:3100')
  }, [detectRunningViolations])

  useEffect(() => {
    // 初始化环境检测
    const status = getEnvironmentStatus()
    console.log('🔍 开发环境状态:', status)

    // 定期检测违规进程
    const interval = setInterval(() => {
      detectRunningViolations()
    }, 5000) // 每5秒检测一次

    return () => clearInterval(interval)
  }, [getEnvironmentStatus, detectRunningViolations])

  return {
    validateCommand,
    detectRunningViolations,
    cleanupViolations,
    getEnvironmentStatus,
    rules: DEVELOPMENT_RULES
  }
}

// 全局命令拦截器（仅在开发环境）
export function setupCommandInterceptor() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }

  // 拦截 console.log 中的命令
  const originalLog = console.log
  console.log = (...args) => {
    const message = args.join(' ')

    // 检测违规命令
    if (/(npm\s+run\s+dev|next\s+dev|yarn\s+dev|pnpm\s+dev)/gi.test(message)) {
      console.error('🚨 检测到违规开发命令!')
      console.error('❌ 禁止直接执行开发服务器')
      console.error('✅ 请使用: npm run docker:dev')
      return
    }

    originalLog.apply(console, args)
  }
}

// 导出规则供其他模块使用
export { DEVELOPMENT_RULES }