import React, { forwardRef, useEffect, useRef, useState } from 'react'

export interface ScrollLockProps {
  /** 是否锁定滚动 */
  locked: boolean
  /** 锁定目标元素，默认为body */
  target?: HTMLElement | string | null
  /** 是否锁定水平滚动 */
  lockHorizontal?: boolean
  /** 是否锁定垂直滚动 */
  lockVertical?: boolean
  /** 是否隐藏滚动条 */
  hideScrollbar?: boolean
  /** 是否记录滚动位置 */
  saveScrollPosition?: boolean
  /** 恢复滚动位置的延迟(ms) */
  restoreDelay?: number
  /** 滚动锁定时的回调 */
  onLock?: () => void
  /** 滚动解锁时的回调 */
  onUnlock?: () => void
  /** 自定义容器类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
}

export const ScrollLock = forwardRef<HTMLDivElement, ScrollLockProps>(
  ({
    locked,
    target,
    lockHorizontal = true,
    lockVertical = true,
    hideScrollbar = true,
    saveScrollPosition = true,
    restoreDelay = 0,
    onLock,
    onUnlock,
    className,
    children,
    ...props
  }, ref) => {
    const targetRef = useRef<HTMLElement | null>(null)
    const scrollPositionRef = useRef({ x: 0, y: 0 })
    const originalStylesRef = useRef<React.CSSProperties>({})
    const [isLocked, setIsLocked] = useState(false)

    // 获取目标元素
    const getTargetElement = useCallback((): HTMLElement | null => {
      if (targetRef.current) {
        return targetRef.current
      }

      let element: HTMLElement | null = null

      if (typeof target === 'string') {
        element = document.querySelector(target) as HTMLElement
      } else if (target instanceof HTMLElement) {
        element = target
      } else {
        element = document.body
      }

      targetRef.current = element
      return element
    }, [target])

    // 保存原始样式和滚动位置
    const saveOriginalState = useCallback(() => {
      const element = getTargetElement()
      if (!element) return

      // 保存滚动位置
      if (saveScrollPosition) {
        scrollPositionRef.current = {
          x: element.scrollLeft,
          y: element.scrollTop,
        }
      }

      // 保存原始样式
      const computedStyle = window.getComputedStyle(element)
      originalStylesRef.current = {
        overflow: computedStyle.overflow,
        overflowX: computedStyle.overflowX,
        overflowY: computedStyle.overflowY,
        position: computedStyle.position,
        top: computedStyle.top,
        left: computedStyle.left,
        width: computedStyle.width,
        height: computedStyle.height,
      }
    }, [getTargetElement, saveScrollPosition])

    // 锁定滚动
    const lockScroll = useCallback(() => {
      const element = getTargetElement()
      if (!element) return

      saveOriginalState()

      // 应用锁定样式
      const newStyles: React.CSSProperties = {}

      if (lockVertical) {
        newStyles.overflowY = 'hidden'
      }
      if (lockHorizontal) {
        newStyles.overflowX = 'hidden'
      }
      if (lockVertical && lockHorizontal) {
        newStyles.overflow = 'hidden'
      }

      // 隐藏滚动条时的处理
      if (hideScrollbar) {
        // 计算滚动条宽度
        const scrollbarWidth = window.innerWidth - element.clientWidth

        if (scrollbarWidth > 0 && element === document.body) {
          // 为body添加padding来补偿滚动条宽度
          newStyles.paddingRight = `${scrollbarWidth}px`

          // 如果有固定定位的元素，也需要调整
          const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]') as NodeListOf<HTMLElement>
          fixedElements.forEach(el => {
            const currentRight = parseInt(window.getComputedStyle(el).right) || 0
            el.style.right = `${currentRight + scrollbarWidth}px`
          })
        }
      }

      // 应用样式
      Object.assign(element.style, newStyles)

      setIsLocked(true)
      onLock?.()
    }, [getTargetElement, lockVertical, lockHorizontal, hideScrollbar, saveOriginalState, onLock])

    // 解锁滚动
    const unlockScroll = useCallback(() => {
      const element = getTargetElement()
      if (!element) return

      // 恢复原始样式
      Object.assign(element.style, originalStylesRef.current)

      // 恢复滚动位置
      if (saveScrollPosition) {
        setTimeout(() => {
          if (element) {
            element.scrollLeft = scrollPositionRef.current.x
            element.scrollTop = scrollPositionRef.current.y
          }
        }, restoreDelay)
      }

      // 恢复固定定位元素的位置
      if (hideScrollbar && element === document.body) {
        const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"]') as NodeListOf<HTMLElement>
        fixedElements.forEach(el => {
          el.style.right = ''
        })
      }

      setIsLocked(false)
      onUnlock?.()
    }, [getTargetElement, saveScrollPosition, restoreDelay, hideScrollbar, onUnlock])

    // 监听锁定状态变化
    useEffect(() => {
      if (locked) {
        lockScroll()
      } else {
        unlockScroll()
      }
    }, [locked, lockScroll, unlockScroll])

    // 清理函数
    useEffect(() => {
      return () => {
        if (isLocked) {
          unlockScroll()
        }
      }
    }, [isLocked, unlockScroll])

    // 如果没有子元素，返回null（纯功能组件）
    if (!children) {
      return null
    }

    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }
)

ScrollLock.displayName = 'ScrollLock'

// Body滚动锁组件
export interface BodyScrollLockProps extends Omit<ScrollLockProps, 'target'> {}

export const BodyScrollLock = forwardRef<HTMLDivElement, BodyScrollLockProps>(
  (props, ref) => <ScrollLock ref={ref} target={document.body} {...props} />
)

BodyScrollLock.displayName = 'BodyScrollLock'

// 条件滚动锁组件
export interface ConditionalScrollLockProps extends Omit<ScrollLockProps, 'locked'> {
  /** 锁定条件 */
  condition: boolean
}

export const ConditionalScrollLock = forwardRef<HTMLDivElement, ConditionalScrollLockProps>(
  ({ condition, ...props }, ref) => (
    <ScrollLock ref={ref} locked={condition} {...props} />
  )
)

ConditionalScrollLock.displayName = 'ConditionalScrollLock'

// 滚动位置恢复Hook
export const useScrollPositionRestore = (target?: HTMLElement | string | null) => {
  const scrollPositionRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef<HTMLElement | null>(null)

  const getTargetElement = useCallback((): HTMLElement | null => {
    if (targetRef.current) {
      return targetRef.current
    }

    let element: HTMLElement | null = null

    if (typeof target === 'string') {
      element = document.querySelector(target) as HTMLElement
    } else if (target instanceof HTMLElement) {
      element = target
    } else {
      element = document.documentElement
    }

    targetRef.current = element
    return element
  }, [target])

  const saveScrollPosition = useCallback(() => {
    const element = getTargetElement()
    if (element) {
      scrollPositionRef.current = {
        x: element.scrollLeft,
        y: element.scrollTop,
      }
    }
  }, [getTargetElement])

  const restoreScrollPosition = useCallback(() => {
    const element = getTargetElement()
    if (element) {
      element.scrollLeft = scrollPositionRef.current.x
      element.scrollTop = scrollPositionRef.current.y
    }
  }, [getTargetElement])

  return {
    saveScrollPosition,
    restoreScrollPosition,
    scrollPosition: scrollPositionRef.current,
  }
}