'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

/**
 * GalleryIndexPage - 组件画廊首页
 *
 * 默认重定向到第一个组件（Button）
 */
export default function GalleryIndexPage() {
  const router = useRouter()

  React.useEffect(() => {
    // 自动重定向到Button组件页面
    router.replace('/demo-gallery/button')
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          正在加载组件画廊...
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          自动跳转到Button组件
        </p>
      </div>
    </div>
  )
}
