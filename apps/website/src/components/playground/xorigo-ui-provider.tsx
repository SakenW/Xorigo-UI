/**
 * @fileoverview XorigoUI Provider - 为动态组件提供 Xorigo UI 组件库
 */

'use client'

import { createContext, useContext } from 'react'
import * as XorigoUI from '@xorigo-ui/core'

// 创建 XorigoUI 上下文
const XorigoUIContext = createContext<typeof XorigoUI | null>(null)

// Provider 组件
export function XorigoUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <XorigoUIContext.Provider value={XorigoUI}>
      {children}
    </XorigoUIContext.Provider>
  )
}

// Hook 用于访问 XorigoUI
export function useXorigoUI() {
  const context = useContext(XorigoUIContext)
  if (!context) {
    throw new Error('useXorigoUI must be used within XorigoUIProvider')
  }
  return context
}

// 在 window 对象上暴露 XorigoUI，供动态组件使用
if (typeof window !== 'undefined') {
  window.XorigoUI = XorigoUI
}

// 扩展 Window 类型
declare global {
  interface Window {
    XorigoUI: typeof XorigoUI
  }
}