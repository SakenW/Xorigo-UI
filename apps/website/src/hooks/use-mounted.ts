'use client'

import { useState, useEffect } from 'react'

/**
 * 挂载状态 Hook - 解决 SSR/CSR 水合问题
 * 确保组件只在客户端渲染时显示
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}