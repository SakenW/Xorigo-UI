import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'
import { X } from 'lucide-react'

export interface BadgeProps {
  children?: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline-solid'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  dot?: boolean
  removable?: boolean
  onRemove?: () => void
  className?: string
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  dot = false,
  removable = false,
  onRemove,
  className,
  icon,
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200',
    outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
  }

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1 font-medium',
        rounded ? 'rounded-full' : 'rounded-md',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {dot && (
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            variant === 'default' && 'bg-gray-500',
            variant === 'primary' && 'bg-blue-500',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-yellow-500',
            variant === 'danger' && 'bg-red-500',
            variant === 'info' && 'bg-cyan-500'
          )}
        />
      )}
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={cn(
            'inline-flex items-center justify-center rounded-full',
            'hover:bg-black/10 dark:hover:bg-white/10',
            'transition-colors duration-150',
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
          )}
        >
          <X className={size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      )}
    </motion.span>
  )
}

export default Badge
