import React, { forwardRef, useRef, useEffect, useState, useCallback } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

// ScrollArea变体配置
const scrollAreaVariants = cva(
  'relative overflow-auto',
  {
    variants: {
      size: {
        sm: 'max-h-32',
        md: 'max-h-64',
        lg: 'max-h-96',
        xl: 'max-h-[32rem]',
      },
      scrollbar: {
        auto: 'scrollbar-auto',
        hidden: 'scrollbar-hide',
        visible: 'scrollbar-default',
      },
      orientation: {
        horizontal: 'overflow-x-auto overflow-y-hidden',
        vertical: 'overflow-y-auto overflow-x-hidden',
        both: 'overflow-auto',
      },
    },
    defaultVariants: {
      size: 'md',
      scrollbar: 'auto',
      orientation: 'vertical',
    },
  }
)

// 滚动条样式
const scrollbarVariants = cva(
  'transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
        primary: 'bg-blue-200 hover:bg-blue-300 dark:bg-blue-800 dark:hover:bg-blue-700',
        secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
      },
      size: {
        sm: 'w-1',
        md: 'w-2',
        lg: 'w-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ScrollAreaProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof scrollAreaVariants> {
  /** 滚动条变体 */
  scrollbarVariant?: VariantProps<typeof scrollbarVariants>['variant']
  /** 滚动条大小 */
  scrollbarSize?: VariantProps<typeof scrollbarVariants>['size']
  /** 自定义滚动条样式 */
  scrollbarStyle?: React.CSSProperties
  /** 滚动到顶部的回调 */
  onScrollToTop?: () => void
  /** 滚动到底部的回调 */
  onScrollToBottom?: () => void
  /** 滚动位置变化回调 */
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
  /** 是否显示阴影指示器 */
  showShadow?: boolean
  /** 子元素 */
  children: React.ReactNode
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({
    className,
    size = 'md',
    scrollbar = 'auto',
    orientation = 'vertical',
    scrollbarVariant = 'default',
    scrollbarSize = 'md',
    scrollbarStyle,
    onScrollToTop,
    onScrollToBottom,
    onScroll,
    showShadow = false,
    children,
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const [scrollPosition, setScrollPosition] = useState({ top: 0, left: 0 })
    const [canScrollTop, setCanScrollTop] = useState(false)
    const [canScrollBottom, setCanScrollBottom] = useState(false)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    // 检查滚动能力
    const checkScrollCapabilities = useCallback(() => {
      const container = containerRef.current
      if (!container) return

      setCanScrollTop(container.scrollTop > 0)
      setCanScrollBottom(
        container.scrollTop < container.scrollHeight - container.clientHeight
      )
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      )
    }, [])

    // 滚动事件处理
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const container = event.currentTarget
      setScrollPosition({
        top: container.scrollTop,
        left: container.scrollLeft,
      })

      checkScrollCapabilities()
      setIsScrolling(true)

      // 检查是否滚动到顶部或底部
      if (container.scrollTop === 0 && onScrollToTop) {
        onScrollToTop()
      }
      if (
        container.scrollTop >= container.scrollHeight - container.clientHeight - 1 &&
        onScrollToBottom
      ) {
        onScrollToBottom()
      }

      if (onScroll) {
        onScroll(event)
      }

      // 滚动状态重置
      setTimeout(() => setIsScrolling(false), 150)
    }, [checkScrollCapabilities, onScrollToTop, onScrollToBottom, onScroll])

    // 滚动到指定位置
    const scrollTo = useCallback((options: ScrollToOptions) => {
      const container = containerRef.current
      if (container) {
        container.scrollTo(options)
      }
    }, [])

    // 滚动到顶部
    const scrollToTop = useCallback(() => {
      scrollTo({ top: 0, behavior: 'smooth' })
    }, [scrollTo])

    // 滚动到底部
    const scrollToBottom = useCallback(() => {
      scrollTo({ top: containerRef.current?.scrollHeight || 0, behavior: 'smooth' })
    }, [scrollTo])

    // 滚动到左边
    const scrollToLeft = useCallback(() => {
      scrollTo({ left: 0, behavior: 'smooth' })
    }, [scrollTo])

    // 滚动到右边
    const scrollToRight = useCallback(() => {
      scrollTo({ left: containerRef.current?.scrollWidth || 0, behavior: 'smooth' })
    }, [scrollTo])

    // 监听内容变化
    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      const resizeObserver = new ResizeObserver(() => {
        checkScrollCapabilities()
      })

      resizeObserver.observe(container)
      checkScrollCapabilities()

      return () => {
        resizeObserver.disconnect()
      }
    }, [checkScrollCapabilities])

    // 自定义滚动条样式
    const customScrollbarStyles = scrollbar === 'hidden' ? {
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      ...scrollbarStyle,
    } : scrollbar === 'visible' ? {
      '&::-webkit-scrollbar': {
        width: scrollbarSize === 'sm' ? '4px' : scrollbarSize === 'md' ? '8px' : '12px',
        height: scrollbarSize === 'sm' ? '4px' : scrollbarSize === 'md' ? '8px' : '12px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: '9999px',
        ...scrollbarStyle,
      },
      '&::-webkit-scrollbar-thumb:hover': {
        opacity: 0.8,
      },
    } : {}

    return (
      <div
        ref={containerRef}
        className={cn(
          scrollAreaVariants({ size, scrollbar, orientation, className }),
          isScrolling && 'scrolling'
        )}
        onScroll={handleScroll}
        style={customScrollbarStyles}
        {...props}
      >
        {/* 顶部阴影指示器 */}
        {showShadow && canScrollTop && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* 底部阴影指示器 */}
        {showShadow && canScrollBottom && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* 左侧阴影指示器 */}
        {showShadow && canScrollLeft && (
          <motion.div
            className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* 右侧阴影指示器 */}
        {showShadow && canScrollRight && (
          <motion.div
            className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {children}

        {/* 滚动控制按钮 - 暴露给外部使用 */}
        <div className="sr-only">
          <button onClick={scrollToTop} aria-label="滚动到顶部" />
          <button onClick={scrollToBottom} aria-label="滚动到底部" />
          <button onClick={scrollToLeft} aria-label="滚动到左边" />
          <button onClick={scrollToRight} aria-label="滚动到右边" />
        </div>
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

// 带控制按钮的ScrollArea
export interface ScrollAreaWithControlsProps extends ScrollAreaProps {
  /** 是否显示控制按钮 */
  showControls?: boolean
  /** 控制按钮位置 */
  controlsPosition?: 'inside' | 'outside'
}

export const ScrollAreaWithControls = forwardRef<HTMLDivElement, ScrollAreaWithControlsProps>(
  ({
    showControls = true,
    controlsPosition = 'outside',
    ...props
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [canScrollTop, setCanScrollTop] = useState(false)
    const [canScrollBottom, setCanScrollBottom] = useState(false)

    const scrollToTop = useCallback(() => {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const scrollToBottom = useCallback(() => {
      const container = containerRef.current
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
      }
    }, [])

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const container = event.currentTarget
      setCanScrollTop(container.scrollTop > 0)
      setCanScrollBottom(
        container.scrollTop < container.scrollHeight - container.clientHeight
      )
    }, [])

    return (
      <div className={cn('relative', controlsPosition === 'outside' && 'flex flex-col')}>
        {showControls && controlsPosition === 'outside' && (
          <button
            onClick={scrollToTop}
            disabled={!canScrollTop}
            className="mb-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            ↑ 向上
          </button>
        )}

        <ScrollArea
          ref={containerRef}
          {...props}
          onScroll={handleScroll}
          className={cn(
            props.className,
            showControls && controlsPosition === 'inside' && 'pb-8'
          )}
        />

        {showControls && (
          <button
            onClick={scrollToBottom}
            disabled={!canScrollBottom}
            className={cn(
              'px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors',
              controlsPosition === 'outside' ? 'mt-2' : 'absolute bottom-2 left-2'
            )}
          >
            向下 ↓
          </button>
        )}
      </div>
    )
  }
)

ScrollAreaWithControls.displayName = 'ScrollAreaWithControls'

export {
  scrollAreaVariants,
  scrollbarVariants,
}