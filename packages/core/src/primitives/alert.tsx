import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../utils'
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader2
} from 'lucide-react'

// Alert 变体配置
const alertVariants = cva(
  // 基础样式
  'relative flex items-start gap-3 p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        // 信息类型
        info: 'bg-[var(--bg-info)]/10 border-[var(--border-info)] text-[var(--text-info)]',

        // 成功类型
        success: 'bg-[var(--bg-success)]/10 border-[var(--border-success)] text-[var(--text-success)]',

        // 警告类型
        warning: 'bg-[var(--bg-warning)]/10 border-[var(--border-warning)] text-[var(--text-warning)]',

        // 错误类型
        error: 'bg-[var(--bg-error)]/10 border-[var(--border-error)] text-[var(--text-error)]',

        // 中性类型
        neutral: 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-secondary)]',

        // 霓虹风格
        neon: 'bg-black/80 border-[var(--border-info)] text-[var(--text-info)] shadow-[0_0_15px_var(--glow-info)]',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4 text-base',
        lg: 'p-5 text-lg',
      },
      style: {
        // 默认样式
        default: 'border',

        // 实心样式
        solid: 'border-0',

        // 轮廓样式
        outline: 'bg-transparent border-2',

        // 左侧边框强调
        accent: 'border-l-4 border-l-current',
      },
      closable: {
        true: 'pr-12',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'info',
      style: 'default',
      size: 'md',
      closable: false,
    },
  }
)

// 图标映射
const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  neutral: Info,
  neon: Info,
}

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  style?: 'default' | 'solid' | 'outline' | 'accent'
  /** 标题 */
  title?: React.ReactNode
  /** 描述内容 */
  description?: React.ReactNode
  /** 操作按钮 */
  action?: React.ReactNode
  /** 是否可关闭 */
  closable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 自动关闭时间（毫秒），0 表示不自动关闭 */
  autoClose?: number
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 加载状态 */
  loading?: boolean
  /** 进度条显示（用于自动关闭） */
  showProgress?: boolean
  /** 是否在页面顶部固定显示 */
  fixed?: boolean
  /** 位置（fixed 模式下有效） */
  position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({
  className,
  title,
  description,
  action,
  closable = false,
  onClose,
  autoClose = 0,
  showIcon = true,
  icon,
  loading = false,
  showProgress = false,
  fixed = false,
  position = 'top',
  variant = 'info',
  size = 'md',
  style: styleVariant = 'default',
  children,
  ...props
}, ref) => {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const autoCloseTimeout = useRef<NodeJS.Timeout | null>(null)
  const { themeConfig } = useTheme()

  // 处理关闭
  const handleClose = () => {
    setVisible(false)
    onClose?.()

    // 清理定时器
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    if (autoCloseTimeout.current) {
      clearTimeout(autoCloseTimeout.current)
      autoCloseTimeout.current = null
    }
  }

  // 自动关闭逻辑
  useEffect(() => {
    if (autoClose > 0 && visible) {
      const interval = 50 // 进度更新间隔
      const totalSteps = autoClose / interval
      let currentStep = 0

      // 设置进度条
      if (showProgress) {
        progressInterval.current = setInterval(() => {
          currentStep++
          const remainingProgress = Math.max(0, 100 - (currentStep / totalSteps) * 100)
          setProgress(remainingProgress)

          if (currentStep >= totalSteps) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current)
              progressInterval.current = null
            }
          }
        }, interval)
      }

      // 设置自动关闭
      autoCloseTimeout.current = setTimeout(() => {
        handleClose()
      }, autoClose)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
        progressInterval.current = null
      }
      if (autoCloseTimeout.current) {
        clearTimeout(autoCloseTimeout.current)
        autoCloseTimeout.current = null
      }
    }
  }, [autoClose, visible, showProgress])

  // 获取图标组件
  const IconComponent = iconMap[variant as keyof typeof iconMap] || Info

  // 获取位置样式
  const getPositionClasses = () => {
    if (!fixed) return ''

    const positions = {
      top: 'top-4 left-1/2 -translate-x-1/2',
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      bottom: 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4',
    }

    return cn('fixed z-50 max-w-sm w-full', positions[position as keyof typeof positions])
  }

  // 获取主题样式
  const getAlertStyle = (): React.CSSProperties => {
    if (variant === 'neon') {
      return {
        boxShadow: `0 0 15px ${themeConfig.glow}`,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
      }
    }
    return {}
  }

  // 动画配置
  const alertAnimation = {
    initial: { opacity: 0, y: fixed ? -20 : 0, scale: fixed ? 0.95 : 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: fixed ? -20 : 0, scale: fixed ? 0.95 : 1 },
    transition: { duration: 0.2, ease: 'easeInOut' },
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          className={cn(
            getPositionClasses(),
            alertVariants({
              variant: styleVariant,
              size,
              closable: closable || autoClose > 0,
            }),
            className
          )}
          style={getAlertStyle()}
          variants={alertAnimation}
          initial="initial"
          animate="animate"
          exit="exit"
          {...props}
        >
          {/* 进度条 */}
          {showProgress && autoClose > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 rounded-t-lg overflow-hidden">
              <motion.div
                className="h-full bg-current opacity-50"
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>
          )}

          {/* 图标 */}
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : icon ? (
                <div className="w-5 h-5">{icon}</div>
              ) : (
                <IconComponent className="w-5 h-5" />
              )}
            </div>
          )}

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold mb-1">{title}</h4>
            )}
            {(description || children) && (
              <div className="text-sm opacity-90">
                {description || children}
              </div>
            )}
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>

          {/* 关闭按钮 */}
          {(closable || autoClose > 0) && (
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                'flex-shrink-0 p-1 rounded-md transition-colors',
                'hover:bg-black/10 dark:hover:bg-white/10',
                'focus:outline-hidden focus:ring-2 focus:ring-current focus:ring-opacity-20'
              )}
              aria-label="关闭警告"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

Alert.displayName = 'Alert'

// Alert Container 用于管理多个 Alert
export interface AlertContainerProps {
  children: React.ReactNode
  className?: string
  position?: AlertProps['position']
  maxItems?: number
}

export const AlertContainer: React.FC<AlertContainerProps> = ({
  children,
  className,
  position = 'top',
  maxItems = 5,
}) => {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        position === 'top' && 'top-4 left-1/2 -translate-x-1/2',
        position === 'top-left' && 'top-4 left-4',
        position === 'top-right' && 'top-4 right-4',
        position === 'bottom' && 'bottom-4 left-1/2 -translate-x-1/2',
        position === 'bottom-left' && 'bottom-4 left-4',
        position === 'bottom-right' && 'bottom-4 right-4',
        className
      )}
    >
      {React.Children.toArray(children).slice(0, maxItems)}
    </div>
  )
}

AlertContainer.displayName = 'AlertContainer'

// useAlert Hook 用于管理 Alert 状态
export interface AlertItem {
  id: string
  type: AlertProps['variant']
  title?: React.ReactNode
  description?: React.ReactNode
  duration?: number
  closable?: boolean
  showProgress?: boolean
}

export const useAlert = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const addAlert = (alert: Omit<AlertItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newAlert = { ...alert, id }

    setAlerts(prev => [...prev, newAlert])

    // 自动移除
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, alert.duration)
    }

    return id
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  // 快捷方法
  const info = (title: string, description?: string, duration = 5000) =>
    addAlert({ type: 'info', title, description, duration })

  const success = (title: string, description?: string, duration = 4000) =>
    addAlert({ type: 'success', title, description, duration })

  const warning = (title: string, description?: string, duration = 6000) =>
    addAlert({ type: 'warning', title, description, duration })

  const error = (title: string, description?: string, duration = 8000) =>
    addAlert({ type: 'error', title, description, duration, closable: true })

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    info,
    success,
    warning,
    error,
  }
}

export default Alert