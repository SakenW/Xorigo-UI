'use client'

import React from 'react'
import { ComponentNav, type NavGroup } from '@xorigo-ui/core'
import { useRouter, usePathname } from 'next/navigation'

/**
 * 组件画廊导航数据
 */
const GALLERY_NAV_GROUPS: NavGroup[] = [
  {
    name: 'Base',
    items: [
      { id: 'button', name: 'Button', description: '按钮组件' },
      { id: 'card', name: 'Card', description: '卡片组件' },
      { id: 'badge', name: 'Badge', description: '徽章组件' },
    ],
  },
  {
    name: 'Inputs',
    items: [
      { id: 'input', name: 'Input', description: '输入框组件' },
      { id: 'checkbox', name: 'Checkbox', description: '复选框组件' },
      { id: 'select', name: 'Select', description: '选择器组件' },
    ],
  },
  {
    name: 'Feedback',
    items: [
      { id: 'alert', name: 'Alert', description: '警告提示' },
      { id: 'modal', name: 'Modal', description: '模态框' },
      { id: 'toast', name: 'Toast', description: '消息提示' },
    ],
  },
]

/**
 * GalleryLayout - 组件画廊布局
 *
 * 布局结构：
 * - 左侧：固定宽度导航栏（ComponentNav）
 * - 右侧：自适应内容区（children）
 */
export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  /**
   * 从路径中提取当前激活的组件ID
   * /demo-gallery/button -> button
   */
  const activeId = pathname.split('/').pop() || ''

  /**
   * 处理导航项点击
   */
  const handleNavItemClick = (item: { id: string }) => {
    router.push(`/demo-gallery/${item.id}`)
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* 左侧导航栏 - shadcn/ui 简洁风格 */}
      <aside className="fixed left-0 top-0 h-screen w-64 overflow-y-auto border-r border-[var(--border-secondary)] bg-[var(--bg-primary)] p-6">
        {/* 画廊标题 */}
        <div className="mb-8 pb-6 border-b border-[var(--border-secondary)]">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            组件画廊
          </h1>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Xorigo UI 组件展示
          </p>
        </div>

        {/* 组件导航 */}
        <ComponentNav
          groups={GALLERY_NAV_GROUPS}
          activeId={activeId}
          onItemClick={handleNavItemClick}
          showDescriptions
        />
      </aside>

      {/* 右侧内容区 */}
      <main className="ml-64 flex-1 p-8 bg-[var(--bg-secondary)]/30">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
