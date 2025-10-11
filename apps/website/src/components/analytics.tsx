'use client'

import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    // 这里可以集成 Google Analytics 或其他分析工具
    // 目前为占位符实现
    const handleRouteChange = () => {
      // 分析代码可以放在这里
    }

    // 监听路由变化
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  return null
}