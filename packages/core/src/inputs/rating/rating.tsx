/**
 * Rating - 评分组件
 *
 * 提供星级评分选择
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface RatingProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  readOnly?: boolean
  className?: string
}

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    { value, defaultValue = 0, onValueChange, max = 5, size = 'md', disabled, readOnly, className },
    ref
  ) => {
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : defaultValue

    const handleRate = (rating: number) => {
      if (disabled || readOnly) return
      onValueChange?.(rating)
    }

    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    return (
      <motion.div
        ref={ref}
        className={cn('flex space-x-1', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {Array.from({ length: max }).map((_, index) => {
          const rating = index + 1
          const filled = rating <= currentValue

          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => handleRate(rating)}
              disabled={disabled || readOnly}
              className={cn(
                'text-[var(--color-warning-500)] transition-colors',
                sizeStyles[size],
                (disabled || readOnly) && 'cursor-not-allowed'
              )}
              whileHover={!disabled && !readOnly ? { scale: 1.2 } : {}}
              whileTap={!disabled && !readOnly ? { scale: 0.9 } : {}}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className={cn(sizeStyles[size])}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.button>
          )
        })}
      </motion.div>
    )
  }
)

Rating.displayName = 'Rating'
export type { RatingProps }
