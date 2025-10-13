'use client'

import { useState, useEffect } from 'react'

/**
 * 媒体查询 Hook - 封装响应式断点检测
 * 在 RSC 中安全使用媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const media = window.matchMedia(query)

    // 初始设置
    setMatches(media.matches)

    // 监听变化
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener('change', listener)

    return () => {
      media.removeEventListener('change', listener)
    }
  }, [query])

  // 服务器端渲染时返回默认值
  return mounted ? matches : false
}

/**
 * 预定义的响应式断点
 */
export const useBreakpoints = () => {
  const isSm = useMediaQuery('(min-width: 640px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const is2Xl = useMediaQuery('(min-width: 1536px)')

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    // 常用组合
    isMobile: !isSm,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
  }
}

/**
 * 设备类型检测
 */
export const useDevice = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return {
    isMobile,
    isTablet,
    isDesktop,
  }
}