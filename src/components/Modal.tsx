import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../utils/cn'

// 模态框接口
export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
  closable?: boolean
  maskClosable?: boolean
  centered?: boolean
  footer?: React.ReactNode
  className?: string
  width?: string | number
  zIndex?: number
}

// 模态框组件
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closable = true,
  maskClosable = true,
  centered = false,
  footer,
  className = '',
  width,
  zIndex = 1000,
}) => {
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

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }

  const variantIcons: Record<string, string> = {
    danger: '⚠️',
    warning: '⚠️',
    success: '✅',
    info: 'ℹ️',
    default: '',
  }

  const modalWidth = width || sizeClasses[size]

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]"
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
              'fixed inset-0 flex items-center justify-center p-4 z-[1002]',
              !centered && 'items-start pt-20'
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: zIndex + 1 }}
          >
            <motion.div
              className={cn(
                'relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl',
                modalWidth,
                className
              )}
              style={{ maxHeight: '90vh', overflow: 'auto' }}
            >
              {/* 标题栏 */}
              {(title || closable) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {variantIcons[variant] && (
                      <span className="text-xl">{variantIcons[variant]}</span>
                    )}
                    {title && (
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              )}

              {/* 内容区域 */}
              <div className="p-6">{children}</div>

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
}

Modal.displayName = 'Modal'

// 抽屉组件
export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
  maskClosable?: boolean
  footer?: React.ReactNode
  className?: string
  zIndex?: number
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  title,
  children,
  placement = 'right',
  size = 'md',
  closable = true,
  maskClosable = true,
  footer,
  className = '',
  zIndex = 1000,
}) => {
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

  const sizeClasses = {
    sm: placement === 'left' || placement === 'right' ? 'w-80' : 'h-64',
    md: placement === 'left' || placement === 'right' ? 'w-96' : 'h-96',
    lg:
      placement === 'left' || placement === 'right' ? 'w-[32rem]' : 'h-[32rem]',
  }

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleMaskClick}
            style={{ zIndex }}
          />

          {/* 抽屉内容 */}
          <motion.div
            className={cn(
              'fixed bg-white dark:bg-gray-800 shadow-2xl z-[1002]',
              (placement === 'left' || placement === 'right') && 'h-full',
              (placement === 'top' || placement === 'bottom') && 'w-full',
              sizeClasses[size],
              placement === 'left' && 'left-0 top-0',
              placement === 'right' && 'right-0 top-0',
              placement === 'top' && 'top-0 left-0 right-0',
              placement === 'bottom' && 'bottom-0 left-0 right-0',
              className
            )}
            {...drawerVariants}
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
                  >
                    ✕
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
}

Drawer.displayName = 'Drawer'
