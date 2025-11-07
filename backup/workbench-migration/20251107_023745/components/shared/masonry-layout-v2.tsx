'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

export interface MasonryItem {
  id: string
  content: React.ReactNode
}

export interface MasonryLayoutProps {
  items: MasonryItem[]
  /** 固定列数（满足“从左到右，3列，然后向下排”） */
  columns?: number
  /** 列间/行间间距（px） */
  gap?: number
  className?: string
  itemClassName?: string
  enableAnimation?: boolean
  /** 可选：自定义渲染 */
  children?: (item: MasonryItem) => React.ReactNode
}

/**
 * MasonryLayoutV2（列容器实现）
 * - 外层：display:grid 固定 N 列
 * - 内层：每一列是 flex 纵向栈，列内 item 高度互不影响，不会产生“行内空洞”
 * - 分配策略：行优先（row-first），保证视觉顺序为“从左到右，3列，然后往下排”
 */
export function MasonryLayoutV2({
  items,
  columns = 3,
  gap = 24,
  className,
  itemClassName,
  enableAnimation = true,
  children,
}: MasonryLayoutProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 1) 预建列容器
  const cols: Array<MasonryItem[]> = Array.from({ length: columns }, () => [])

  // 2) 行优先分配：按索引把第 0/1/2 个放入第 0/1/2 列，接着 3/4/5 … 以此类推
  items.forEach((item, idx) => {
    const colIndex = idx % columns
    cols[colIndex].push(item)
  })

  return (
    <div
      className={cn('w-full', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        alignItems: 'start',
      }}
    >
      {cols.map((colItems, colIdx) => (
        <div
          key={`col-${colIdx}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: `${gap}px`,
          }}
        >
          <AnimatePresence mode="popLayout">
            {colItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={cn('w-full break-inside-avoid', itemClassName)}
                layout={enableAnimation}
                initial={enableAnimation ? { opacity: 0, y: 20, scale: 0.98 } : { opacity: 1 }}
                animate={enableAnimation ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1 }}
                exit={enableAnimation ? { opacity: 0, scale: 0.98, transition: { duration: 0.18 } } : { opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 25,
                  delay: enableAnimation ? (colIdx * 0.02 + index * 0.015) : 0,
                }}
              >
                <div className="w-full h-full">
                  {children ? children(item) : item.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
