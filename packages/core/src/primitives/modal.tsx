'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import { X, Maximize2, Minimize2, Move } from 'lucide-react'

// Modal 变体配置
const modalVariants = cva(
  // 基础样式
  'relative flex flex-col rounded-lg shadow-2xl bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)]',
  {
    variants: {
      size: {
        sm: 'max-w-md max-h-[80vh]',
        md: 'max-w-2xl max-h-[85vh]',
        lg: 'max-w-5xl max-h-[90vh]',
        xl: 'max-w-7xl max-h-[95vh]',
        full: 'w-[95vw] h-[95vh] max-w-none max-h-none',
      },
      position: {
        center: 'items-center justify-center',
        top: 'items-start justify-center pt-16',
        bottom: 'items-end justify-center pb-16',
      },
      variant: {
        default: 'bg-[var(--bg-primary)] border-[var(--border-secondary)]',
        glass: 'bg-[var(--bg-glass)]/80 backdrop-blur-lg border-[var(--border-glass)]',
        neon: 'bg-black/90 border-[var(--border-info)] shadow-[0_0_20px_var(--glow-info)]',
        gradient: 'bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'center',
      variant: 'default',
    },
  }
)

// 遮罩层变体
const overlayVariants = cva(
  'fixed inset-0 z-50 transition-opacity duration-200',
  {
    variants: {
      variant: {
        default: 'bg-black/50',
        dark: 'bg-black/80',
        blur: 'bg-black/30 backdrop-blur-sm',
        neon: 'bg-black/60 backdrop-blur-md',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ModalProps {
  /** 是否显示模态框 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 标题 */
  title?: React.ReactNode
  /** 描述 */
  description?: React.ReactNode
  /** 子内容 */
  children: React.ReactNode
  /** 底部操作区 */
  footer?: React.ReactNode
  /** 尺寸 */
  size?: VariantProps<typeof modalVariants>['size']
  /** 位置 */
  position?: VariantProps<typeof modalVariants>['position']
  /** 变体 */
  variant?: VariantProps<typeof modalVariants>['variant']
  /** 遮罩层变体 */
  overlayVariant?: VariantProps<typeof overlayVariants>['variant']
  /** 是否可关闭 */
  closable?: boolean
  /** 点击遮罩是否关闭 */
  closeOnOverlayClick?: boolean
  /** 按 ESC 是否关闭 */
  closeOnEscape?: boolean
  /** 是否显示全屏按钮 */
  showFullscreen?: boolean
  /** 是否可拖拽 */
  draggable?: boolean
  /** 是否阻止页面滚动 */
  blockScroll?: boolean
  /** 自定义类名 */
  className?: string
  /** 获取容器引用 */
  containerRef?: React.RefObject<HTMLDivElement>
}

// 拖拽 Hook
const useDraggable = (ref: React.RefObject<HTMLDivElement>, enabled: boolean = false) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const startPos = useRef({ x: 0, y: 0 })
  const elementStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled || !ref.current) return

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!ref.current?.contains(target)) return

      setIsDragging(true)
      startPos.current = { x: e.clientX, y: e.clientY }
      elementStart.current = { x: position.x, y: position.y }
      e.preventDefault()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      setPosition({
        x: elementStart.current.x + deltaX,
        y: elementStart.current.y + deltaY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enabled, isDragging, position])

  return { position, isDragging }
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  position = 'center',
  variant = 'default',
  overlayVariant = 'default',
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showFullscreen = false,
  draggable = false,
  blockScroll = true,
  className,
  containerRef,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const { themeConfig } = useTheme()
  const { position: dragPosition, isDragging } = useDraggable(modalRef, draggable && !isFullscreen)

  // 处理 ESC 键关闭
  useEffect(() => {
    if (!open || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, onClose])

  // 阻止页面滚动
  useEffect(() => {
    if (!open || !blockScroll) return

    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, blockScroll])

  // 处理遮罩点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  // 切换全屏
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // 获取拖拽样式
  const getDraggableStyle = (): React.CSSProperties => {
    if (!draggable || isFullscreen) return {}

    return {
      transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
      cursor: isDragging ? 'grabbing' : 'grab',
    }
  }

  // 获取主题样式
  const getModalStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = getDraggableStyle()

    if (variant === 'neon') {
      base.boxShadow = `0 0 30px ${themeConfig.glow}`
      base.borderColor = themeConfig.colors?.[400] as string
    }

    return base
  }

  // 动画配置
  const modalAnimation = {
    initial: {
      opacity: 0,
      scale: 0.9,
      y: position === 'bottom' ? 20 : position === 'top' ? -20 : 0
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: position === 'bottom' ? 20 : position === 'top' ? -20 : 0,
      transition: { duration: 0.2 }
    },
  }

  const overlayAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalContent = (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 遮罩层 */}
          <motion.div
            className={overlayVariants({ variant: overlayVariant })}
            variants={overlayAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={handleOverlayClick}
          />

          {/* 模态框 */}
          <div
            ref={containerRef}
            className={cn(
              'relative z-50 flex items-center justify-center p-4',
              position === 'top' && 'items-start pt-16',
              position === 'bottom' && 'items-end pb-16',
              position === 'center' && 'items-center justify-center'
            )}
          >
            <motion.div
              ref={modalRef}
              className={cn(
                modalVariants({
                  size: isFullscreen ? 'full' : size,
                  position: isFullscreen ? 'center' : position,
                  variant,
                }),
                'w-full max-h-full overflow-hidden',
                isDragging && 'shadow-2xl',
                className
              )}
              style={getModalStyle()}
              variants={modalAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* 头部 */}
              {(title || closable || showFullscreen) && (
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-secondary)]">
                  <div className="flex-1">
                    {title && (
                      <motion.h2
                        className="text-lg font-semibold text-[var(--text-primary)]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {title}
                      </motion.h2>
                    )}
                    {description && (
                      <motion.p
                        className="text-sm text-[var(--text-secondary)] mt-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {description}
                      </motion.p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {showFullscreen && (
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className={cn(
                          'p-2 rounded-md transition-colors',
                          'hover:bg-[var(--bg-tertiary)]',
                          'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                        aria-label={isFullscreen ? '退出全屏' : '全屏'}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    {draggable && !isFullscreen && (
                      <div className="p-2 text-[var(--text-secondary)]">
                        <Move className="w-4 h-4" />
                      </div>
                    )}

                    {closable && (
                      <button
                        type="button"
                        onClick={onClose}
                        className={cn(
                          'p-2 rounded-md transition-colors',
                          'hover:bg-[var(--bg-tertiary)]',
                          'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        )}
                        aria-label="关闭"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 内容区域 */}
              <div className="flex-1 overflow-auto">
                <div className="p-6">
                  {children}
                </div>
              </div>

              {/* 底部操作区 */}
              {footer && (
                <motion.div
                  className="p-6 border-t border-[var(--border-secondary)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )

  return typeof window !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null
}

Modal.displayName = 'Modal'

export default Modal