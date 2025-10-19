'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

interface MasonryItemDebug {
  id: string
  content: React.ReactNode
  height?: number
  debug?: {
    renderTime: number
    actualHeight: number
    estimatedHeight: number
  }
}

interface MasonryDebugProps {
  items: MasonryItemDebug[]
  columns?: number
  gap?: number
  className?: string
  itemClassName?: string
  enableAnimation?: boolean
  showDebugInfo?: boolean
}

/**
 * 瀑布流调试版本 - 显示性能指标和布局信息
 */
export function MasonryDebug({
  items,
  columns: propColumns,
  gap = 24,
  className,
  itemClassName,
  enableAnimation = true,
  showDebugInfo = false
}: MasonryDebugProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(propColumns || 3)
  const [containerWidth, setContainerWidth] = useState(0)
  const [itemPositions, setItemPositions] = useState<Array<{ x: number; y: number; width: number }>>([])
  const [debugInfo, setDebugInfo] = useState({
    renderTime: 0,
    layoutTime: 0,
    totalHeight: 0,
    itemCount: 0
  })

  // 响应式列数计算
  const calculateColumns = useCallback((width: number) => {
    if (propColumns) return propColumns

    if (width < 640) return 1      // sm
    if (width < 1024) return 2     // md
    if (width < 1280) return 3     // lg
    return 4                       // xl
  }, [propColumns])

  // 监听容器尺寸变化
  useEffect(() => {
    const startTime = performance.now()
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        const width = entry.contentRect.width
        setContainerWidth(width)
        setColumns(calculateColumns(width))
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    const endTime = performance.now()
    setDebugInfo(prev => ({ ...prev, renderTime: endTime - startTime }))

    return () => resizeObserver.disconnect()
  }, [calculateColumns])

  // 计算瀑布流位置
  useEffect(() => {
    const startTime = performance.now()

    if (!containerWidth || columns === 0) return

    const columnWidth = (containerWidth - gap * (columns - 1)) / columns
    const columnHeights = new Array(columns).fill(0)
    const positions: Array<{ x: number; y: number; width: number }> = []

    items.forEach((item, index) => {
      // 找到最短的列
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

      const x = shortestColumnIndex * (columnWidth + gap)
      const y = columnHeights[shortestColumnIndex]

      positions.push({ x, y, width: columnWidth })

      // 更新列高度
      const itemHeight = item.height || 300
      columnHeights[shortestColumnIndex] += itemHeight + gap
    })

    const endTime = performance.now()
    const totalHeight = Math.max(...columnHeights)

    setItemPositions(positions)
    setDebugInfo(prev => ({
      ...prev,
      layoutTime: endTime - startTime,
      totalHeight,
      itemCount: items.length
    }))
  }, [items, columns, containerWidth, gap])

  // 获取容器总高度
  const containerHeight = itemPositions.length > 0
    ? Math.max(...itemPositions.map(pos => pos.y)) + 300
    : 0

  return (
    <div className="space-y-4">
      {/* 调试信息面板 */}
      {showDebugInfo && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">瀑布流调试信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <span className="text-gray-600">渲染时间:</span>
              <span className="ml-2 font-mono">{debugInfo.renderTime.toFixed(2)}ms</span>
            </div>
            <div>
              <span className="text-gray-600">布局时间:</span>
              <span className="ml-2 font-mono">{debugInfo.layoutTime.toFixed(2)}ms</span>
            </div>
            <div>
              <span className="text-gray-600">列数:</span>
              <span className="ml-2 font-mono">{columns}</span>
            </div>
            <div>
              <span className="text-gray-600">项目数:</span>
              <span className="ml-2 font-mono">{debugInfo.itemCount}</span>
            </div>
            <div>
              <span className="text-gray-600">总高度:</span>
              <span className="ml-2 font-mono">{debugInfo.totalHeight.toFixed(0)}px</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-gray-600">容器宽度:</span>
            <span className="ml-2 font-mono">{containerWidth.toFixed(0)}px</span>
            <span className="ml-4 text-gray-600">列宽:</span>
            <span className="ml-2 font-mono">
              {containerWidth && columns > 0 ? ((containerWidth - gap * (columns - 1)) / columns).toFixed(0) : 0}px
            </span>
          </div>
        </div>
      )}

      {/* 瀑布流容器 */}
      <div
        ref={containerRef}
        className={cn('relative w-full border-2 border-dashed border-gray-300 dark:border-gray-600', className)}
        style={{ height: containerHeight }}
      >
        {/* 网格辅助线 */}
        {showDebugInfo && containerWidth > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: columns }).map((_, index) => {
              const columnWidth = (containerWidth - gap * (columns - 1)) / columns
              const x = index * (columnWidth + gap) + columnWidth / 2

              return (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 w-px bg-blue-300 dark:bg-blue-600 opacity-30"
                  style={{ left: `${x}px` }}
                />
              )
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {items.map((item, index) => {
            const position = itemPositions[index]

            if (!position) return null

            return (
              <motion.div
                key={item.id}
                className={cn('absolute border border-red-300 dark:border-red-600', itemClassName)}
                initial={enableAnimation ? {
                  opacity: 0,
                  scale: 0.8,
                  y: position.y + 20
                } : false}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: position.x,
                  y: position.y,
                  width: position.width
                }}
                exit={enableAnimation ? {
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.2 }
                } : false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8
                }}
                style={{
                  zIndex: index
                }}
              >
                {/* 调试信息标签 */}
                {showDebugInfo && (
                  <div className="absolute -top-6 left-0 text-xs bg-red-500 text-white px-1 rounded">
                    {index} (x:{position.x.toFixed(0)}, y:{position.y.toFixed(0)})
                  </div>
                )}

                <div
                  className="w-full overflow-hidden"
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  {item.content}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* 空状态 */}
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <p>没有组件需要展示</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}