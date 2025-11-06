'use client'
import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../utils'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { getModalAriaProps, generateAriaId, createFocusTrap } from '../utils/accessibility'

// 模态框变体
const modalVariants = cva(
  'relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl',
  {
    variants: {
      variant: {
        default: '',
        danger: 'border-2 border-red-200 dark:border-red-800',
        warning: 'border-2 border-amber-200 dark:border-amber-800',
        success: 'border-2 border-emerald-200 dark:border-emerald-800',
        info: 'border-2 border-blue-200 dark:border-blue-800',
      },
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// 模态框接口
export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  closable?: boolean
  maskClosable?: boolean
  centered?: boolean
  footer?: React.ReactNode
  width?: string | number
  zIndex?: number
}

// 模态框组件
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      size,
      variant,
      closable = true,
      maskClosable = true,
      centered = false,
      footer,
      className,
      width,
      zIndex = 1000,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const focusTrapRef = useRef<ReturnType<typeof createFocusTrap> | null>(null)
    const previousFocusRef = useRef<HTMLElement | null>(null)

    // 生成可访问性相关的ID
    const titleId = title ? generateAriaId('modal-title') : undefined
    const descriptionId = generateAriaId('modal-description')

    // 生成可访问性属性
    const ariaProps = getModalAriaProps({
      title,
      labelId: titleId,
      descriptionId,
      modal: true
    })
  // 处理ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // 处理滚动锁定和焦点管理
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      // 保存当前焦点元素
      previousFocusRef.current = document.activeElement as HTMLElement

      // 设置焦点陷阱
      if (modalRef.current) {
        focusTrapRef.current = createFocusTrap(modalRef.current)
        focusTrapRef.current.activate()
      }
    } else {
      document.body.style.overflow = 'unset'

      // 清理焦点陷阱
      if (focusTrapRef.current) {
        focusTrapRef.current.deactivate()
        focusTrapRef.current = null
      }

      // 恢复焦点到之前的元素
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = 'unset'
      if (focusTrapRef.current) {
        focusTrapRef.current.deactivate()
      }
    }
  }, [open])

  const variantIcons: Record<string, React.ReactNode> = {
    danger: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    default: null,
  }

  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && maskClosable) {
      onClose()
    }
  }

  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-1001"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleMaskClick}
            style={{ zIndex }}
          />

          {/* 模态框内容 */}
          <motion.div
            className={cn(
              'fixed inset-0 flex items-center justify-center p-4 z-1002',
              !centered && 'items-start pt-20'
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: zIndex + 1 }}
          >
            <motion.div
              ref={(node) => {
                modalRef.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
              }}
              className={cn(
                modalVariants({ variant, size }),
                className
              )}
              style={{
                maxHeight: '90vh',
                overflow: 'auto',
                width: width || undefined
              }}
              {...ariaProps}
              {...props}
            >
              {/* 标题栏 */}
              {(title || closable) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {variantIcons[variant] && (
                      <span className="text-xl">{variantIcons[variant]}</span>
                    )}
                    {title && (
                      <h2 id={titleId} className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {title}
                      </h2>
                    )}
                  </div>
                  {closable && (
                    <motion.button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* 内容区域 */}
              <div id={descriptionId} className="p-6">{children}</div>

              {/* 底部区域 */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
                  {footer}
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
})

Modal.displayName = 'Modal'

// 抽屉变体
const drawerVariants = cva(
  'fixed bg-white dark:bg-gray-800 shadow-2xl',
  {
    variants: {
      placement: {
        left: 'left-0 top-0 h-full',
        right: 'right-0 top-0 h-full',
        top: 'top-0 left-0 right-0 w-full',
        bottom: 'bottom-0 left-0 right-0 w-full',
      },
      size: {
        sm: 'w-80 h-64',
        md: 'w-96 h-96',
        lg: 'w-[32rem] h-[32rem]',
      },
    },
    defaultVariants: {
      placement: 'right',
      size: 'md',
    },
  }
)

// 抽屉组件
export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  closable?: boolean
  maskClosable?: boolean
  footer?: React.ReactNode
  zIndex?: number
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>((
  {
    open,
    onClose,
    title,
    children,
    placement,
    size,
    closable = true,
    maskClosable = true,
    footer,
    className,
    zIndex = 1000,
    ...props
  },
  ref
) => {
  // 处理ESC键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  // 处理滚动锁定
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const handleMaskClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && maskClosable) {
      onClose()
    }
  }

  const getDrawerVariants = () => {
    switch (placement) {
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '-100%' },
        }
      case 'right':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' },
        }
      case 'top':
        return {
          initial: { y: '-100%' },
          animate: { y: 0 },
          exit: { y: '-100%' },
        }
      case 'bottom':
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
        }
    }
  }

  const drawerVariants = getDrawerVariants()

  const drawerContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-1001"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleMaskClick}
            style={{ zIndex }}
          />

          {/* 抽屉内容 */}
          <motion.div
            ref={ref}
            className={cn(
              drawerVariants({ placement, size }),
              className
            )}
            {...props}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ zIndex: zIndex + 1 }}
          >
            {/* 标题栏 */}
            {(title || closable) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                {title && (
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h2>
                )}
                {closable && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* 内容区域 */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 160px)' }}
            >
              <div className="p-6">{children}</div>
            </div>

            {/* 底部区域 */}
            {footer && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(drawerContent, document.body)
})

Drawer.displayName = 'Drawer'
