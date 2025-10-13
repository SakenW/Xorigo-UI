/**
 * @fileoverview Playground 错误边界上下文实现
 * 提供错误报告和用户操作跟踪功能
 */

import type { ErrorBoundaryContext } from './playground.store'

export class PlaygroundErrorBoundary implements ErrorBoundaryContext {
  private errors: Error[] = []
  private userActions: Array<{
    action: string
    data?: any
    timestamp: number
  }> = []

  reportError(error: Error, context?: Record<string, any>): void {
    // 添加到错误列表
    this.errors.push(error)

    // 限制错误历史数量
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50)
    }

    // 控制台输出
    console.group('🎮 Playground Error Report')
    console.error('错误:', error)
    if (context) {
      console.log('上下文:', context)
    }
    console.groupEnd()

    // 发送到 Sentry (如果可用)
    this.sendToSentry(error, context)

    // 保存到 localStorage
    this.saveErrorToStorage(error, context)
  }

  captureUserAction(action: string, data?: any): void {
    const userAction = {
      action,
      data,
      timestamp: Date.now(),
    }

    this.userActions.push(userAction)

    // 限制操作历史数量
    if (this.userActions.length > 100) {
      this.userActions = this.userActions.slice(-100)
    }

    // 开发模式下输出用户操作
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎮 Playground Action: ${action}`, data)
    }

    // 保存到 localStorage
    this.saveActionToStorage(userAction)
  }

  getLastError(): Error | null {
    return this.errors.length > 0 ? this.errors[this.errors.length - 1] : null
  }

  /**
   * 获取最近的用户操作
   */
  getRecentActions(count: number = 10) {
    return this.userActions.slice(-count)
  }

  /**
   * 获取错误历史
   */
  getErrorHistory() {
    return [...this.errors]
  }

  /**
   * 清除错误历史
   */
  clearErrors(): void {
    this.errors = []
    localStorage.removeItem('playground_errors')
  }

  /**
   * 清除操作历史
   */
  clearActions(): void {
    this.userActions = []
    localStorage.removeItem('playground_actions')
  }

  /**
   * 生成错误报告
   */
  generateErrorReport(): string {
    const lastError = this.getLastError()
    const recentActions = this.getRecentActions(5)

    const report = {
      timestamp: new Date().toISOString(),
      lastError: lastError ? {
        message: lastError.message,
        stack: lastError.stack,
        name: lastError.name,
      } : null,
      recentActions,
      errorCount: this.errors.length,
      actionCount: this.userActions.length,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
    }

    return JSON.stringify(report, null, 2)
  }

  /**
   * 发送错误到 Sentry
   */
  private sendToSentry(error: Error, context?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        tags: {
          component: 'playground',
        },
        extra: {
          ...context,
          recentActions: this.getRecentActions(3),
        },
      })
    }
  }

  /**
   * 保存错误到 localStorage
   */
  private saveErrorToStorage(error: Error, context?: Record<string, any>): void {
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        name: error.name,
        timestamp: Date.now(),
        context,
      }

      const errors = this.loadFromStorage('playground_errors') || []
      errors.push(errorData)

      // 限制存储的错误数量
      if (errors.length > 20) {
        errors.splice(0, errors.length - 20)
      }

      localStorage.setItem('playground_errors', JSON.stringify(errors))
    } catch (storageError) {
      console.warn('保存错误到 localStorage 失败:', storageError)
    }
  }

  /**
   * 保存操作到 localStorage
   */
  private saveActionToStorage(action: any): void {
    try {
      const actions = this.loadFromStorage('playground_actions') || []
      actions.push(action)

      // 限制存储的操作数量
      if (actions.length > 50) {
        actions.splice(0, actions.length - 50)
      }

      localStorage.setItem('playground_actions', JSON.stringify(actions))
    } catch (storageError) {
      console.warn('保存操作到 localStorage 失败:', storageError)
    }
  }

  /**
   * 从 localStorage 加载数据
   */
  private loadFromStorage(key: string): any {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.warn(`从 localStorage 加载数据失败 (${key}):`, error)
      return null
    }
  }

  /**
   * 从 localStorage 恢复数据
   */
  restoreFromStorage(): void {
    try {
      // 恢复错误历史
      const errors = this.loadFromStorage('playground_errors')
      if (errors && Array.isArray(errors)) {
        this.errors = errors.map(errorData => {
          const error = new Error(errorData.message)
          error.stack = errorData.stack
          error.name = errorData.name
          return error
        })
      }

      // 恢复操作历史
      const actions = this.loadFromStorage('playground_actions')
      if (actions && Array.isArray(actions)) {
        this.userActions = actions
      }

      console.log(`从 localStorage 恢复了 ${this.errors.length} 个错误和 ${this.userActions.length} 个操作`)
    } catch (error) {
      console.warn('从 localStorage 恢复数据失败:', error)
    }
  }
}

// 创建默认实例
export const playgroundErrorBoundary = new PlaygroundErrorBoundary()