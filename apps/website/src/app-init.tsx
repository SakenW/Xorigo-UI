/**
 * 应用初始化模块
 * 在应用启动时自动检测开发环境安全性
 */

'use client'

import { useEffect } from 'react'
import { developmentSecurity } from '@/utils/development-security'

/**
 * 开发环境初始化 Hook
 */
export function useDevelopmentInit() {
  useEffect(() => {
    // 只在开发环境运行
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.log('🚀 初始化开发环境安全检测...')

      // 立即执行一次检测
      const performInitialCheck = async () => {
        try {
          console.log('📊 执行开发环境安全检测...')

          const violations = await developmentSecurity.detectPortConflicts()

          if (violations.length > 0) {
            console.log(`⚠️ 检测到 ${violations.length} 个开发环境问题:`)
            violations.forEach(violation => {
              console.log(`  ❌ ${violation.message}`)
              if (violation.suggestions.length > 0) {
                console.log('  💡 建议修复:')
                violation.suggestions.forEach(suggestion => {
                  console.log(`     - ${suggestion}`)
                })
              }
            })

            // 尝试自动修复
            const autoFixed = await developmentSecurity.autoFix(violations)
            if (autoFixed) {
              console.log('🔧 已尝试自动修复部分问题')
            }
          } else {
            console.log('✅ 开发环境状态正常')
            console.log('✅ Docker 容器运行正确')
            console.log('✅ 无违规进程检测到')
          }

          // 显示开发环境报告
          console.log('\n' + developmentSecurity.generateReport())

        } catch (error) {
          console.error('开发环境检测失败:', error)
        }
      }

      // 延迟执行，确保页面完全加载
      const timer = setTimeout(performInitialCheck, 1000)

      // 开始定期监控
      developmentSecurity.startMonitoring(15000) // 每15秒检测一次

      // 页面卸载时清理
      const cleanup = () => {
        clearTimeout(timer)
        developmentSecurity.stopMonitoring()
        console.log('🛑 开发环境监控已停止')
      }

      window.addEventListener('beforeunload', cleanup)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('beforeunload', cleanup)
        developmentSecurity.stopMonitoring()
      }
    }
  }, [])
}

/**
 * 全局错误处理 - 检测开发环境相关错误
 */
export function setupDevelopmentErrorHandling() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  // 监听未捕获的错误
  const originalError = console.error
  console.error = (...args) => {
    const message = args.join(' ')

    // 检测开发环境相关错误
    if (message.includes('EADDRINUSE') && message.includes('3000')) {
      console.log('🚨 检测到端口 3000 冲突错误!')
      console.log('❌ 这是因为存在违规的 npm run dev 进程')
      console.log('✅ 解决方案:')
      console.log('   1. 执行: pkill -9 -f "npm run dev"')
      console.log('   2. 执行: sudo fuser -k 3000/tcp')
      console.log('   3. 使用: npm run docker:dev')
    }

    originalError.apply(console, args)
  }

  // 监听未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object') {
      const message = event.reason.message || ''

      if (message.includes('EADDRINUSE') && message.includes('3000')) {
        console.log('🚨 Promise 拒绝: 端口 3000 冲突!')
        console.log('❌ 存在违规的开发服务器进程')
        console.log('✅ 请使用 Docker 容器: npm run docker:dev')
      }
    }
  })
}

/**
 * 开发环境快捷键检测
 */
export function setupDevelopmentShortcuts() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return
  }

  window.addEventListener('keydown', (event) => {
    // Ctrl+Shift+D: 显示开发环境报告
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault()
      console.log('\n' + developmentSecurity.generateReport())
    }

    // Ctrl+Shift+C: 手动执行环境检测
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      event.preventDefault()
      console.log('🔍 手动执行开发环境检测...')
      developmentSecurity.detectPortConflicts().then(violations => {
        if (violations.length === 0) {
          console.log('✅ 开发环境状态正常')
        } else {
          console.log(`⚠️ 检测到 ${violations.length} 个问题`)
        }
      })
    }

    // Ctrl+Shift+S: 切换监控状态
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
      event.preventDefault()
      const violations = developmentSecurity.getViolations()
      if (violations.length > 0) {
        console.log('📊 当前开发环境问题:')
        violations.forEach(v => console.log(`  - ${v.message}`))
      } else {
        console.log('✅ 无开发环境问题')
      }
    }
  })

  console.log('⌨️ 开发环境快捷键已启用:')
  console.log('  Ctrl+Shift+D: 显示开发环境报告')
  console.log('  Ctrl+Shift+C: 手动环境检测')
  console.log('  Ctrl+Shift+S: 显示当前问题')
}

/**
 * 应用初始化导出
 */
export function initializeDevelopmentEnvironment() {
  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 开发环境初始化开始...')

    // 设置错误处理
    setupDevelopmentErrorHandling()

    // 设置快捷键
    setupDevelopmentShortcuts()

    console.log('✅ 开发环境初始化完成')
  }
}