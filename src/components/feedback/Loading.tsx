import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  overlay?: boolean
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  overlay = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const containerClasses = overlay
    ? 'fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50'
    : 'flex items-center justify-center'

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-2">
        <motion.div
          className={cn(
            sizeClasses[size],
            'border-2 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full'
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {text && (
          <p
            className={cn(
              'text-sm',
              overlay
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

Loading.displayName = 'Loading'

// Spinner 组件
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'border-t-blue-600 dark:border-t-blue-500',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <motion.div
      className={cn(
        sizeClasses[size],
        'border-2 border-gray-200 dark:border-gray-700 rounded-full',
        color,
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  )
}

Spinner.displayName = 'Spinner'

