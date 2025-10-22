/**
 * Toast 轻提示组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 状态/通知/进度/结果/无障碍提示
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// Toast 上下文管理
// =============================================================================

interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: ToastItem) => void
  removeToast: (id: string) => void
  updateToast: (id: string, updates: Partial<ToastItem>) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// =============================================================================
// Toast 项目接口
// =============================================================================

export interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  action?: React.ReactNode
  duration?: number
  persistent?: boolean
  icon?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  createdAt: number
}

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const toastVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 shadow-lg transition-all",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "border-border bg-background text-foreground",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
        success: "border-success bg-success text-success-foreground",
        warning: "border-warning bg-warning text-warning-foreground",
        info: "border-info bg-info text-info-foreground",
      },

      // 尺寸系统
      size: {
        sm: "p-3 text-sm",
        md: "p-4 text-base",
        lg: "p-6 text-lg",
      },

      // 位置
      position: {
        'top-right': "animate-in slide-in-from-right-full",
        'top-left': "animate-in slide-in-from-left-full",
        'bottom-right': "animate-in slide-in-from-right-full",
        'bottom-left': "animate-in slide-in-from-left-full',
        'top-center': "animate-in slide-in-from-top",
        'bottom-center': "animate-in slide-in-from-bottom",
        'center': "animate-in fade-in",
      },

      // 状态
      state: {
        entering: "animate-in",
        exiting: "animate-out slide-out-to-right",
      }
    },

    // 默认变体
    defaultVariants: {
      variant: "default",
      size: "md',
      position: 'top-right',
      state: 'entering',
    },
  }
)

// =============================================================================
// Toast Provider 组件
// =============================================================================

export interface ToastProviderProps {
  children: React.ReactNode
  maxToasts?: number
  className?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center'
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  className,
  position = 'top-right',
}) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const toastIdRef = React.useRef(0)

  const addToast = React.useCallback((toast: Omit<ToastItem, 'id' | 'createdAt'>) => {
    const id = `toast-${toastIdRef.current++}`
    const newToast: ToastItem = {
      ...toast,
      id,
      createdAt: Date.now(),
    }
    setToasts(prev => [...prev.slice(-maxToasts + 1), newToast])

    // 自动关闭（非持久化提示）
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }
  }, [maxToasts])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, state: 'exiting' as const } : toast
    ))

    // 延迟移除 DOM
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  const updateToast = React.useCallback((id: string, updates: Partial<ToastItem>) => {
    setToasts(prev => prev.map(toast =>
      toast.id === id ? { ...toast, ...updates } : toast
    ))
  }, [])

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    updateToast,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className={cn(
          "fixed z-50 flex flex-col gap-2 p-4",
          {
            'top-right': 'top-0 right-0',
            'top-left': 'top-0 left-0',
            'bottom-right': 'bottom-0 right-0',
            'bottom-left': 'bottom-0 left-0',
            'top-center': 'top-0 left-1/2 -translate-x-1/2',
            'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
            'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
          }[position],
          className
        )}
      >
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} position={position} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// =============================================================================
// Toast Item 组件
// =============================================================================

interface ToastItemProps {
  toast: ToastItem
  position: ToastProviderProps['position']
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, position }) => {
  const { theme } = useTheme()
  const { removeToast } = useToast()

  const handleClose = () => {
    removeToast(toast.id)
    toast.onDismiss?.()
  }

  // 生成主题相关的样式
  const themeStyles: React.CSSProperties = {
    '--toast-bg': `hsl(${theme.colors.background})`,
    '--toast-border': `hsl(${theme.colors.border.primary})`,
    '--toast-text': `hsl(${theme.colors.text.primary})`,
    '--toast-icon': `hsl(${theme.colors[toast.variant || 'default']})`,
  }

  return (
    <div
      className={cn(
        toastVariants({
          variant: toast.variant,
          size: 'md',
          position,
          state: toast.state || 'entering',
        })
      )}
      style={themeStyles}
      role="alert"
      aria-live="polite"
    >
      {/* 图标 */}
      {toast.icon && (
        <div className="flex-shrink-0">
          <div className="h-5 w-5" style={{ color: 'var(--toast-icon)' }}>
            {toast.icon}
          </div>
        </div>
      )}

      {/* 内容 */}
      <div className="grid gap-1">
        {toast.title && (
          <div className="text-sm font-semibold" style={{ color: 'var(--toast-text)' }}>
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90" style={{ color: 'var(--toast-text)' }}>
            {toast.description}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      {toast.action && (
        <div className="flex-shrink-0">
          {toast.action}
        </div>
      )}

      {/* 关闭按钮 */}
      {(toast.dismissible !== false) && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 rounded-md p-1 hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="关闭通知"
          style={{ color: 'var(--toast-text)', opacity: 0.7 }}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// =============================================================================
// Toast Hook 便捷函数
// =============================================================================

export const useToastHelpers = () => {
  const { addToast } = useToast()

  return {
    success: (title: string, options?: Partial<Omit<ToastItem, 'id' | 'createdAt' | 'variant'>>) =>
      addToast({ title, variant: 'success', duration: 5000, ...options }),

    error: (title: string, options?: Partial<Omit<ToastItem, 'id' | 'createdAt' | 'variant'>>) =>
      addToast({ title, variant: 'destructive', duration: 8000, ...options }),

    warning: (title: string, options?: Partial<Omit<ToastItem, 'id' | 'createdAt' | 'variant'>>) =>
      addToast({ title, variant: 'warning', duration: 6000, ...options }),

    info: (title: string, options?: Partial<Omit<ToastItem, 'id' | 'createdAt' | 'variant'>>) =>
      addToast({ title, variant: 'info', duration: 4000, ...options }),

    default: (title: string, options?: Partial<Omit<ToastItem, 'id' | 'createdAt' | 'variant'>>) =>
      addToast({ title, variant: 'default', duration: 3000, ...options }),
  }
}

// =============================================================================
// 组件元数据
// =============================================================================

ToastProvider.displayName = 'ToastProvider'
Toast.displayName = 'Toast'

// =============================================================================
// 导出
// =============================================================================

export { toastVariants, ToastContext }
export type { ToastProviderProps, ToastItemProps }