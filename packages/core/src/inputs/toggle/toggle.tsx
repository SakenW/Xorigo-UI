'use client'
/**
 * Toggle - 切换开关组件
 *
 * 提供开/关状态的切换
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
  description?: string
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { checked, defaultChecked = false, onCheckedChange, disabled, size = 'md', className, label, description },
    ref
  ) => {
    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const currentChecked = isControlled ? checked : internalChecked

    const handleToggle = () => {
      const newChecked = !currentChecked
      if (!isControlled) {
        setInternalChecked(newChecked)
      }
      onCheckedChange?.(newChecked)
    }

    const sizeStyles = {
      sm: {
        container: 'w-8 h-5',
        thumb: 'w-3 h-3',
        translate: 'translate-x-3'
      },
      md: {
        container: 'w-10 h-6',
        thumb: 'w-4 h-4',
        translate: 'translate-x-4'
      },
      lg: {
        container: 'w-12 h-7',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5'
      }
    }

    const styles = sizeStyles[size]

    return (
      <div className={cn('flex items-start space-x-3', className)}>
        <button
          ref={ref}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            'relative inline-flex flex-shrink-0 rounded-full transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            styles.container,
            currentChecked ? 'bg-[var(--color-primary-500)]' : 'bg-[var(--color-surface-secondary)]'
          )}
        >
          <motion.span
            className={cn(
              'inline-block rounded-full bg-white shadow transform transition-transform',
              styles.thumb
            )}
            initial={false}
            animate={{
              x: currentChecked ? styles.translate : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30
            }}
          />
        </button>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-[var(--color-text-secondary)]">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
export type { ToggleProps }
