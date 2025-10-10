import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading'

// 通知接口
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  closable?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
  className?: string
}

// Toast 上下文
interface ToastContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newNotification: Notification = {
        id,
        duration: 5000,
        closable: true,
        ...notification,
      }

      setNotifications((prev) => [...prev, newNotification])

      // 自动移除
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, newNotification.duration)
      }

      return id
    },
    []
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return (
    <ToastContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'

// 使用 Toast Hook
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return {
    success: (
      title: string,
      message?: string,
      options?: Partial<Notification>
    ) => context.addNotification({ type: 'success', title, message, ...options }),
    error: (title: string, message?: string, options?: Partial<Notification>) =>
      context.addNotification({ type: 'error', title, message, ...options }),
    warning: (
      title: string,
      message?: string,
      options?: Partial<Notification>
    ) => context.addNotification({ type: 'warning', title, message, ...options }),
    info: (title: string, message?: string, options?: Partial<Notification>) =>
      context.addNotification({ type: 'info', title, message, ...options }),
    loading: (
      title: string,
      message?: string,
      options?: Partial<Notification>
    ) => context.addNotification({ type: 'loading', title, message, ...options }),
    remove: context.removeNotification,
    clear: context.clearAll,
  }
}

// Toast 容器组件
const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext)
  if (!context) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-9999 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {context.notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onRemove={() => context.removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

// Toast 单项组件
const ToastItem: React.FC<{
  notification: Notification
  onRemove: () => void
}> = ({ notification, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false)

  const defaultIcons: Record<NotificationType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    loading: '⏳',
  }

  const getTypeStyles = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
      case 'error':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
      case 'loading':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
      default:
        return 'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-300'
    }
  }

  return (
    <motion.div
      className={cn(
        'relative p-4 rounded-lg border shadow-lg backdrop-blur-xs',
        getTypeStyles(),
        notification.className
      )}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, type: 'spring' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      <div className="flex items-start space-x-3">
        {/* 图标 */}
        <div className="shrink-0 text-xl">
          {notification.icon || defaultIcons[notification.type]}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          {notification.message && (
            <p className="text-sm opacity-90 mt-1">{notification.message}</p>
          )}

          {/* 操作按钮 */}
          {notification.action && (
            <motion.button
              onClick={notification.action.onClick}
              className="mt-2 text-sm font-medium underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {notification.action.label}
            </motion.button>
          )}
        </div>

        {/* 关闭按钮 */}
        {notification.closable && (
          <motion.button
            onClick={onRemove}
            className="shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
        )}
      </div>

      {/* 进度条 */}
      {notification.duration &&
        notification.duration > 0 &&
        !isHovered && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-black/20 dark:bg-white/20 rounded-b-lg"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{
              duration: notification.duration / 1000,
              ease: 'linear',
            }}
          />
        )}
    </motion.div>
  )
}

// NotificationProgress 组件 - 专用于通知内的进度条
export interface NotificationProgressProps {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showValue?: boolean
  label?: string
  className?: string
}

export const NotificationProgress: React.FC<NotificationProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  showValue = true,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const variantClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    default: 'bg-blue-500',
  }

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'relative w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

NotificationProgress.displayName = 'NotificationProgress'
