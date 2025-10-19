'use client'

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'

/** 数据项定义：content 可为任意 React 节点；height 为可选“预估高度”，用于首屏减抖动 */
export interface MasonryItem {
  id: string
  content: React.ReactNode
  height?: number
}

export interface MasonryHorizontalProps {
  items: MasonryItem[]
  /** 列数（横向优先：视觉左→右为 0…columns-1 列） */
  columns?: number
  /** 卡片间距（同时作用于横纵） */
  gap?: number
  className?: string
  itemClassName?: string
  /** 开启动画 */
  enableAnimation?: boolean
  /** 计算前的最小渲染（ms），避免抖动；0 表示不延迟 */
  initialLayoutDelayMs?: number
  /** 可选：渲染函数（默认用 item.content） */
  children?: (item: MasonryItem) => React.ReactNode
}

/** 内部：用于保存测量结果与布局位置 */
type SizeMap = Map<string, number>
interface ItemPos {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Masonry（横向优先）实现要点：
 * 1) 绝对定位 + 逐项分配到“当前最短列” -> 彻底杜绝空洞
 * 2) DOM 顺序保持为 items 原顺序（有利于可访问性与 SEO），视觉通过 transform 定位
 * 3) ResizeObserver 监听容器宽度与每项高度，实时重算
 */
export function MasonryHorizontal({
  items,
  columns = 3,
  gap = 24,
  className,
  itemClassName,
  enableAnimation = true,
  initialLayoutDelayMs = 0,
  children,
}: MasonryHorizontalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 记录每个 item 的真实高度（像素）
  const [sizes, setSizes] = useState<SizeMap>(() => new Map())

  // 记录容器宽度
  const [containerWidth, setContainerWidth] = useState<number>(0)

  // 记录布局结果（位置与容器高度）
  const [layout, setLayout] = useState<{
    positions: Record<string, ItemPos>
    containerHeight: number
  }>({ positions: {}, containerHeight: 0 })

  // 为每个 item 创建 ref，用于单独 ResizeObserver 监听
  const itemRefs = useMemo(() => {
    const map = new Map<string, HTMLDivElement | null>()
    items.forEach((it) => map.set(it.id, null))
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.id).join('|')])

  /** 将 ref 赋值存入 itemRefs */
  const setItemRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      itemRefs.set(id, el)
    },
    [itemRefs],
  )

  /** 监听容器宽度 */
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      if (e) setContainerWidth(e.contentRect.width)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  /** 监听每个 item 的高度变化（图片加载、内容变更等） */
  useEffect(() => {
    const observers: ResizeObserver[] = []
    itemRefs.forEach((el, id) => {
      if (!el) return
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (entry) {
          const h = entry.contentRect.height
          setSizes((prev) => {
            const next = new Map(prev)
            // 仅在变化时更新，减少重算频率
            if (Math.abs((next.get(id) ?? 0) - h) > 0.5) {
              next.set(id, h)
            }
            return next
          })
        }
      })
      ro.observe(el)
      observers.push(ro)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [itemRefs])

  /** 核心：根据容器宽度 + 列数 + gap + 每项高度，计算每项的绝对定位坐标 */
  const doLayout = useCallback(() => {
    if (!containerRef.current || containerWidth <= 0 || columns <= 0) return

    const colWidth =
      (containerWidth - gap * (columns - 1)) / Math.max(columns, 1)

    // 每列累计高度（初始为 0）
    const colHeights = new Array<number>(columns).fill(0)

    const positions: Record<string, ItemPos> = {}

    // 按 items 原顺序遍历（横向优先语义）
    items.forEach((item) => {
      // 使用观测高度；若无则用预估高度或 100 兜底（可以按需调整）
      const h = sizes.get(item.id) ?? item.height ?? 100

      // 找到当前最短列
      let targetCol = 0
      for (let c = 1; c < columns; c++) {
        if (colHeights[c] < colHeights[targetCol]) targetCol = c
      }

      const x = targetCol * (colWidth + gap)
      const y = colHeights[targetCol]

      positions[item.id] = { x, y, w: colWidth, h }

      // 更新该列累计高度
      colHeights[targetCol] += h + gap
    })

    const containerHeight =
      colHeights.length > 0 ? Math.max(...colHeights) - gap : 0

    setLayout({ positions, containerHeight })
  }, [columns, containerWidth, gap, items, sizes])

  // 初次与依赖变更时布局
  useLayoutEffect(() => {
    if (initialLayoutDelayMs > 0) {
      const t = setTimeout(doLayout, initialLayoutDelayMs)
      return () => clearTimeout(t)
    }
    doLayout()
  }, [doLayout, initialLayoutDelayMs])

  // 容器样式（相对定位 + 显式高度托底）
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'relative',
      width: '100%',
      height: Math.max(layout.containerHeight, 0),
    }),
    [layout.containerHeight],
  )

  return (
    <div ref={containerRef} className={cn('w-full', className)} style={containerStyle}>
      <AnimatePresence>
        {items.map((item, index) => {
          const pos = layout.positions[item.id]
          const x = pos?.x ?? 0
          const y = pos?.y ?? index * 10 // 未布局前给个极小偏移，避免完全重叠
          const w = pos?.w

          return (
            <motion.div
              key={item.id}
              // 绝对定位 + transform 放置
              className={cn('absolute will-change-transform', itemClassName)}
              style={{
                width: w, // 初次渲染在布局未完成时，w 可能为 undefined；可不设置也行
                transform: `translate3d(${x}px, ${y}px, 0)`,
              }}
              initial={
                enableAnimation
                  ? { opacity: 0, y: 12, scale: 0.98 }
                  : { opacity: 1 }
              }
              animate={
                enableAnimation
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 1 }
              }
              exit={
                enableAnimation
                  ? { opacity: 0, scale: 0.98, transition: { duration: 0.18 } }
                  : { opacity: 0 }
              }
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            >
              {/* 内层测量容器：真实高度由它决定 */}
              <div
                ref={setItemRef(item.id)}
                className="w-full"
                style={{
                  // GPU 加速 & 避免抖动
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {children ? children(item) : item.content}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
