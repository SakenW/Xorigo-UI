'use client'

import React, { forwardRef, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../../foundations/utils/cn'
import { X } from 'lucide-react'
import {
  generateAriaProps,
  generateKeyboardNavigation,
  useFocusManagement,
  announceToScreenReader,
  checkWCAGCompliance,
  SkipLink,
  type ComponentAriaAttributes
} from '../../utils/accessibility'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnEscape?: boolean
  closeOnBackdropClick?: boolean
  showCloseButton?: boolean
  preventBodyScroll?: boolean
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  announceOpen?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    closable = true,
    closeOnEscape = true,
    closeOnBackdropClick = true,
    showCloseButton = true,
    preventBodyScroll = true,
    ariaLabelledBy,
    ariaDescribedBy,
    announceOpen = true,
    initialFocusRef,
    children,
    className,
    ...props
  }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const titleId = ariaLabelledBy || React.useId()
    const descriptionId = ariaDescribedBy || React.useId()
    const previousFocusRef = useRef<HTMLElement | null>(null)

    // 使用焦点管理
    const { isFocusTrapped } = useFocusManagement(modalRef, {
      trapFocus: isOpen,
      restoreFocus: true,
      initialFocus: initialFocusRef ? undefined : '[data-autofocus="true"]',
      autofocus: !initialFocusRef
    })

    // 生成 ARIA 属性
    const ariaProps = generateAriaProps('Modal', {
      title,
      description,
      titleId,
      descriptionId
    })

    // 生成键盘导航处理
    const keyboardHandlers = generateKeyboardNavigation('Modal', {
      onClose
    })

    // 处理 ESC 键关闭
    const handleKeyDown = (event: React.KeyboardEvent) => {
      keyboardHandlers.onKeyDown?.(event)

      if (closeOnEscape && event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      }
    }

    // 处理关闭
    const handleClose = () => {
      if (closable) {
        onClose()
        if (announceOpen) {
          announceToScreenReader('Modal closed')
        }
      }
    }

    // 处理背景点击
    const handleBackdropClick = (event: React.MouseEvent) => {
      if (event.target === event.currentTarget && closeOnBackdropClick) {
        handleClose()
      }
    }

    // 防止背景滚动
    useEffect(() => {
      if (isOpen && preventBodyScroll) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = ''
        }
      }
    }, [isOpen, preventBodyScroll])

    // 公告打开状态
    useEffect(() => {
      if (isOpen && announceOpen) {
        // 延迟公告，等待动画完成
        setTimeout(() => {
          announceToScreenReader(`Modal opened${title ? `: ${title}` : ''}`)
        }, 300)
      }
    }, [isOpen, title, announceOpen])

    // 检查 WCAG 合规性（仅在开发环境）
    if (process.env.NODE_ENV === 'development' && isOpen) {
      const compliance = checkWCAGCompliance('dialog', {
        ...props,
        title,
        'aria-modal': true,
        'aria-labelledby': titleId,
        'aria-describedby': descriptionId,
        role: 'dialog'
      })

      if (compliance.score < 100) {
        console.warn('Modal WCAG Compliance Issues:', compliance.issues)
      }
    }

    // 尺寸配置
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'max-w-full mx-4'
    }

    // 如果没有打开，返回 null
    if (!isOpen) return null

    // 使用 Portal 渲染到 body
    return createPortal(
      <>
        {/* 跳过链接 */}
        <SkipLink
          href="#modal-start"
          className="fixed top-4 left-4 z-[60]"
        >
          Skip to modal content
        </SkipLink>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={modalRef}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* 背景遮罩 */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleBackdropClick}
                aria-hidden="true"
              />

              {/* Modal 内容 */}
              <motion.div
                id="modal-start"
                ref={ref}
                className={cn(
                  'relative w-full rounded-lg bg-white dark:bg-gray-800 shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  sizeClasses[size],
                  className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                onKeyDown={handleKeyDown}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                data-autofocus={initialFocusRef ? 'false' : 'true'}
                {...props}
              >
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    {title && (
                      <h2
                        id={titleId}
                        className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                      >
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Description */}
                {description && (
                  <p
                    id={descriptionId}
                    className="px-6 pt-4 text-sm text-gray-600 dark:text-gray-400"
                  >
                    {description}
                  </p>
                )}

                {/* Content */}
                <div className="p-6">
                  {children}
                </div>

                {/* Focus indicator for screen readers */}
                <div
                  className="sr-only"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {isFocusTrapped ? 'Modal is focused' : 'Modal focus is not trapped'}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>,
      document.body
    )
  }
)

Modal.displayName = 'Modal'

// Modal Header 组件
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  showCloseButton?: boolean
  onClose?: () => void
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ title, description, showCloseButton = true, onClose, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700', className)}
        {...props}
      >
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  }
)

ModalHeader.displayName = 'ModalHeader'

// Modal Body 组件
export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6', className)}
        {...props}
      />
    )
  }
)

ModalBody.displayName = 'ModalBody'

// Modal Footer 组件
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700', className)}
        {...props}
      />
    )
  }
)

ModalFooter.displayName = 'ModalFooter'