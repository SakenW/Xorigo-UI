'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

// 动态导入终极增强版
const UltimateFinalHome = dynamic(() => import('../ultimate-final.tsx'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>正在加载终极增强版...</p>
      </div>
    </div>
  )
})

export default function UltimateFinalPage() {
  useEffect(() => {
    // 设置页面标题
    document.title = 'Xorigo UI - 终极增强版'
  }, [])

  return <UltimateFinalHome />
}