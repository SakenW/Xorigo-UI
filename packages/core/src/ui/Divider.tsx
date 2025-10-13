import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

export interface DividerProps {
  children?: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  align?: 'left' | 'center' | 'right'
  variant?: 'solid' | 'dashed' | 'dotted'
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
}

export const Divider: React.FC<DividerProps> = ({
  children,
  orientation = 'horizontal',
  align = 'center',
  variant = 'solid',
  className,
  spacing = 'md',
}) => {
  const spacingClasses = {
    horizontal: {
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-8',
    },
    vertical: {
      sm: 'mx-2',
      md: 'mx-4',
      lg: 'mx-8',
    },
  }

  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'inline-flex h-full',
          spacingClasses.vertical[spacing],
          className
        )}
      >
        <motion.div
          className={cn(
            'w-px bg-gray-200 dark:bg-gray-700',
            variantClasses[variant]
          )}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    )
  }

  if (!children) {
    return (
      <motion.hr
        className={cn(
          'border-0 border-t border-gray-200 dark:border-gray-700',
          variantClasses[variant],
          spacingClasses.horizontal[spacing],
          className
        )}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    )
  }

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div
      className={cn(
        'flex items-center',
        alignClasses[align],
        spacingClasses.horizontal[spacing],
        className
      )}
    >
      {align !== 'left' && (
        <motion.div
          className={cn(
            'flex-1 border-t border-gray-200 dark:border-gray-700',
            variantClasses[variant]
          )}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="px-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {children}
      </span>
      {align !== 'right' && (
        <motion.div
          className={cn(
            'flex-1 border-t border-gray-200 dark:border-gray-700',
            variantClasses[variant]
          )}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  )
}

export default Divider
