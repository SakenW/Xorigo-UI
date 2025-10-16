import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

export interface AlertProps {
  title?: string
  message: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  closable?: boolean
  onClose?: () => void
  className?: string
  icon?: React.ReactNode
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  closable = false,
  onClose,
  className = '',
  icon,
}) => {
  const variantStyles = {
    info: {
      container:
        'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-400',
      title: 'text-blue-800 dark:text-blue-300',
      message: 'text-blue-700 dark:text-blue-400',
      button: 'text-blue-400 hover:text-blue-500',
    },
    success: {
      container:
        'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
      icon: 'text-green-400',
      title: 'text-green-800 dark:text-green-300',
      message: 'text-green-700 dark:text-green-400',
      button: 'text-green-400 hover:text-green-500',
    },
    warning: {
      container:
        'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-400',
      title: 'text-yellow-800 dark:text-yellow-300',
      message: 'text-yellow-700 dark:text-yellow-400',
      button: 'text-yellow-400 hover:text-yellow-500',
    },
    error: {
      container:
        'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
      icon: 'text-red-400',
      title: 'text-red-800 dark:text-red-300',
      message: 'text-red-700 dark:text-red-400',
      button: 'text-red-400 hover:text-red-500',
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
    <motion.div
      className={cn(
        'p-4 border rounded-md',
        styles.container,
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
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
            <motion.button
              onClick={onClose}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-hidden focus:ring-2 focus:ring-offset-2',
                styles.button
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">关闭</span>
              ✕
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

Alert.displayName = 'Alert'
