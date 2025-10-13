'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * 主题同步 Hook - 封装主题相关的客户端逻辑
 * 解决 RSC 中无法直接使用主题相关 API 的问题
 */
export function useThemeSync() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // 确保组件在客户端挂载后才显示
  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    mounted,
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    // 安全的主题切换函数
    toggleTheme: () => {
      if (mounted) {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    }
  }
}