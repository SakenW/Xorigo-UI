/**
 * 错误上报机制
 *
 * 集成 Sentry 和 LogRocket 用于错误监控和日志记录
 */

/**
 * Sentry 配置类型
 */
export interface SentryConfig {
  dsn: string
  environment: string
  release?: string
  tracesSampleRate?: number
  replaysSessionSampleRate?: number
  replaysOnErrorSampleRate?: number
}

/**
 * LogRocket 配置类型
 */
export interface LogRocketConfig {
  appId: string
  console: boolean
  network: boolean
  dom: boolean
}

/**
 * 初始化 Sentry 错误监控
 */
export function initSentry(config: SentryConfig) {
  // 仅在浏览器环境且生产模式下初始化
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return
  }

  // 动态导入 Sentry SDK
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      release: config.release || process.env.NEXT_PUBLIC_APP_VERSION,

      // 性能监控
      tracesSampleRate: config.tracesSampleRate || 0.1,

      // Session Replay
      replaysSessionSampleRate: config.replaysSessionSampleRate || 0.1,
      replaysOnErrorSampleRate: config.replaysOnErrorSampleRate || 1.0,

      // 过滤敏感信息
      beforeSend(event) {
        // 移除敏感数据
        if (event.request) {
          delete event.request.cookies
          delete event.request.headers
        }
        return event
      },

      // 忽略特定错误
      ignoreErrors: [
        // 浏览器插件错误
        'top.GLOBALS',
        'chrome-extension://',
        // 网络错误
        'Network request failed',
        'NetworkError',
        // 第三方脚本错误
        'Script error',
      ],
    })

    console.log('✅ Sentry 初始化成功')
  }).catch((error) => {
    console.error('❌ Sentry 初始化失败:', error)
  })
}

/**
 * 初始化 LogRocket 会话录制
 */
export function initLogRocket(config: LogRocketConfig) {
  // 仅在浏览器环境且生产模式下初始化
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return
  }

  // 动态导入 LogRocket SDK
  import('logrocket').then((LogRocket) => {
    LogRocket.default.init(config.appId, {
      console: {
        isEnabled: config.console,
      },
      network: {
        isEnabled: config.network,
      },
      dom: {
        isEnabled: config.dom,
      },
    })

    // 与 Sentry 集成
    if (window.Sentry) {
      import('logrocket').then((LogRocket) => {
        LogRocket.default.getSessionURL((sessionURL) => {
          if (window.Sentry) {
            window.Sentry.configureScope((scope) => {
              scope.setExtra('logRocketSession', sessionURL)
            })
          }
        })
      })
    }

    console.log('✅ LogRocket 初始化成功')
  }).catch((error) => {
    console.error('❌ LogRocket 初始化失败:', error)
  })
}

/**
 * 手动上报错误
 */
export function captureError(error: Error, context?: Record<string, any>) {
  if (typeof window === 'undefined') {
    return
  }

  // 开发环境下打印
  if (process.env.NODE_ENV === 'development') {
    console.error('手动捕获错误:', error, context)
  }

  // 上报到 Sentry
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      contexts: context,
    })
  }
}

/**
 * 上报消息
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window === 'undefined') {
    return
  }

  // 开发环境下打印
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level}] ${message}`)
  }

  // 上报到 Sentry
  if (window.Sentry) {
    window.Sentry.captureMessage(message, level)
  }
}

/**
 * 设置用户上下文
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  if (typeof window === 'undefined') {
    return
  }

  // 设置 Sentry 用户
  if (window.Sentry) {
    window.Sentry.setUser(user)
  }

  // 设置 LogRocket 用户
  if (window.LogRocket) {
    window.LogRocket.identify(user.id, {
      email: user.email,
      name: user.username,
    })
  }
}

/**
 * 添加面包屑 (用户行为追踪)
 */
export function addBreadcrumb(breadcrumb: {
  message: string
  category?: string
  level?: 'info' | 'warning' | 'error'
  data?: Record<string, any>
}) {
  if (typeof window === 'undefined') {
    return
  }

  if (window.Sentry) {
    window.Sentry.addBreadcrumb(breadcrumb)
  }
}

// 类型声明扩展
declare global {
  interface Window {
    Sentry?: {
      init: (config: any) => void
      captureException: (error: Error, context?: any) => void
      captureMessage: (message: string, level?: string) => void
      setUser: (user: any) => void
      configureScope: (callback: (scope: any) => void) => void
      addBreadcrumb: (breadcrumb: any) => void
    }
    LogRocket?: {
      init: (appId: string, config?: any) => void
      identify: (userId: string, traits?: any) => void
      getSessionURL: (callback: (url: string) => void) => void
    }
  }
}
