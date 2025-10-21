import React from 'react'
import { SSRMotionDiv, SSRAnimatePresence } from '../components/motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { semanticColors } from '@xorigo-ui/tokens'

export interface AlertProps {
  title?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  onClose?: () => void
  className?: string
  icon?: React.ReactNode
  /**
   * 是否显示Alert
   */
  visible?: boolean
  /**
   * 强制启用动画（忽略全局设置）
   */
  forceAnimation?: boolean
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  closable = false,
  onClose,
  className = '',
  icon,
  visible = true,
  forceAnimation = false,
}) => {
  const variantStyles = {
    info: {
      container: `bg-[var(--bg-info)] border-[var(--border-info)]`,
      icon: 'text-[var(--text-info)]',
      title: 'text-[var(--text-info)]',
      message: 'text-[var(--text-info)]',
      button: 'text-[var(--text-info)] hover:text-[var(--text-info)]',
    },
    success: {
      container: `bg-[var(--bg-success)] border-[var(--border-success)]`,
      icon: 'text-[var(--text-success)]',
      title: 'text-[var(--text-success)]',
      message: 'text-[var(--text-success)]',
      button: 'text-[var(--text-success)] hover:text-[var(--text-success)]',
    },
    warning: {
      container: `bg-[var(--bg-warning)] border-[var(--border-warning)]`,
      icon: 'text-[var(--text-warning)]',
      title: 'text-[var(--text-warning)]',
      message: 'text-[var(--text-warning)]',
      button: 'text-[var(--text-warning)] hover:text-[var(--text-warning)]',
    },
    error: {
      container: `bg-[var(--bg-error)] border-[var(--border-error)]`,
      icon: 'text-[var(--text-error)]',
      title: 'text-[var(--text-error)]',
      message: 'text-[var(--text-error)]',
      button: 'text-[var(--text-error)] hover:text-[var(--text-error)]',
    },
  }

  const defaultIcons: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  const styles = variantStyles[variant]

  return (
    <SSRAnimatePresence>
      {visible && (
        <SSRMotionDiv
          className={cn(
            'p-4 border rounded-md',
            styles.container,
            className
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          forceAnimation={forceAnimation}
        >
          <div className="flex">
            <div className="shrink-0">
              <div className={styles.icon}>
                {icon || <span className="text-xl">{defaultIcons[variant]}</span>}
              </div>
            </div>
            <div className="ml-3 flex-1">
              {title && (
                <h3 className={cn('text-sm font-medium', styles.title)}>
                  {title}
                </h3>
              )}
              <div className={cn('text-sm', title && 'mt-1', styles.message)}>
                {message}
              </div>
            </div>
            {closable && (
              <div className="ml-auto pl-3">
                <SSRMotionDiv
                  as="button"
                  onClick={onClose}
                  className={cn(
                    'inline-flex rounded-md p-1.5 focus:outline-hidden focus:ring-2 focus:ring-offset-2',
                    styles.button
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  forceAnimation={forceAnimation}
                >
                  <span className="sr-only">关闭</span>
                  ✕
                </SSRMotionDiv>
              </div>
            )}
          </div>
        </SSRMotionDiv>
      )}
    </SSRAnimatePresence>
  )
}

Alert.displayName = 'Alert'
