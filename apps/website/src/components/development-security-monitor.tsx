'use client'

import React, { useEffect, useState } from 'react'
import { useDevelopmentSecurity } from '@/hooks/use-development-security'
import { motion, AnimatePresence } from 'framer-motion'

interface ViolationAlert {
  id: string
  message: string
  severity: 'error' | 'warning'
  timestamp: Date
}

export function DevelopmentSecurityMonitor() {
  const { detectRunningViolations, cleanupViolations, getEnvironmentStatus } = useDevelopmentSecurity()
  const [violations, setViolations] = useState<ViolationAlert[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const checkEnvironment = async () => {
    setIsChecking(true)
    try {
      const status = await detectRunningViolations()

      if (status?.hasViolations) {
        const newViolation: ViolationAlert = {
          id: Date.now().toString(),
          message: '🚨 检测到违规的开发服务器进程！端口 3000/3001 被占用',
          severity: 'error',
          timestamp: new Date()
        }

        setViolations(prev => {
          const exists = prev.some(v => v.message === newViolation.message)
          return exists ? prev : [...prev, newViolation]
        })
      } else {
        setViolations([])
      }

      setLastCheck(new Date())
    } catch (error) {
      console.error('环境检测失败:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleCleanup = () => {
    cleanupViolations()
    setViolations([])
  }

  const dismissViolation = (id: string) => {
    setViolations(prev => prev.filter(v => v.id !== id))
  }

  // 初始检测
  useEffect(() => {
    checkEnvironment()

    // 定期检测
    const interval = setInterval(checkEnvironment, 10000) // 每10秒检测一次
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {violations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">⚠️</span>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-red-800 font-semibold text-sm">
                  开发环境安全警告
                </h3>

                {violations.map(violation => (
                  <div key={violation.id} className="mt-2">
                    <p className="text-red-700 text-sm">
                      {violation.message}
                    </p>
                    <p className="text-red-600 text-xs mt-1">
                      检测时间: {violation.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}

                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={handleCleanup}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                  >
                    清理进程
                  </button>
                  <button
                    onClick={checkEnvironment}
                    disabled={isChecking}
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {isChecking ? '检测中...' : '重新检测'}
                  </button>
                  <button
                    onClick={() => setViolations([])}
                    className="px-3 py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 transition-colors"
                  >
                    忽略
                  </button>
                </div>

                <div className="mt-3 p-2 bg-red-100 rounded">
                  <p className="text-red-800 text-xs font-medium">正确开发方式:</p>
                  <p className="text-red-700 text-xs mt-1">
                    1. 使用 Docker 容器: <code className="bg-red-200 px-1 rounded">npm run docker:dev</code>
                  </p>
                  <p className="text-red-700 text-xs mt-1">
                    2. 访问地址: <code className="bg-red-200 px-1 rounded">http://localhost:3100</code>
                  </p>
                  <p className="text-red-700 text-xs mt-1">
                    3. 禁止执行: <code className="bg-red-200 px-1 rounded">npm run dev</code>
                  </p>
                </div>
              </div>

              <button
                onClick={() => dismissViolation(violations[0].id)}
                className="flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <span className="text-lg">&times;</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 状态指示器 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-full shadow-lg">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${violations.length > 0 ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            <span>
              {violations.length > 0 ? '检测到违规' : '环境正常'}
            </span>
            {lastCheck && (
              <span className="text-gray-400">
                ({lastCheck.toLocaleTimeString()})
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DevelopmentSecurityMonitor