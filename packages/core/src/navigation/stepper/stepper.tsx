/**
 * Stepper - 流程步骤导航组件
 *
 * 显示多步骤流程的进度和当前状态，支持可选步骤、历史回顾等功能。
 */

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

// ============================================================================
// Props Type Definitions
// ============================================================================

export interface Step {
  /**
   * 步骤唯一标识
   */
  id: string

  /**
   * 步骤标签
   */
  label: string

  /**
   * 步骤描述
   */
  description?: string

  /**
   * 步骤状态
   */
  status?: 'pending' | 'in-progress' | 'completed' | 'error' | 'skipped'

  /**
   * 是否可选
   */
  optional?: boolean

  /**
   * 点击处理
   */
  onClick?: () => void
}

export interface StepperProps {
  /**
   * 步骤列表
   */
  steps: Step[]

  /**
   * 当前步骤索引
   */
  currentStep?: number

  /**
   * 方向
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 大小
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 是否显示连接线
   */
  showConnectors?: boolean

  /**
   * 变体
   */
  variant?: 'default' | 'numbered' | 'dot'

  /**
   * 自定义类名
   */
  className?: string
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Stepper 组件
 */
export const Stepper = forwardRef<HTMLElement, StepperProps>(
  (
    {
      steps,
      currentStep = 0,
      orientation = 'horizontal',
      size = 'md',
      showConnectors = true,
      variant = 'default',
      className
    },
    ref
  ) => {
    const getStepStatus = (index: number): Step['status'] => {
      if (index < currentStep) return 'completed'
      if (index === currentStep) return 'in-progress'
      return 'pending'
    }

    const sizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    }

    const circleSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    }

    return (
      <nav
        ref={ref as any}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
      >
        {steps.map((step, index) => {
          const status = step.status || getStepStatus(index)
          const isActive = index === currentStep
          const isCompleted = status === 'completed'

          return (
            <React.Fragment key={step.id}>
              <motion.div
                className={cn(
                  'flex items-center',
                  orientation === 'vertical' ? 'w-full' : ''
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <button
                  className={cn(
                    'flex items-center justify-center rounded-full transition-colors',
                    circleSizes[size],
                    isActive && status === 'in-progress' && 'bg-[var(--color-primary-500)] text-white',
                    isCompleted && 'bg-[var(--color-success-500)] text-white',
                    !isActive && !isCompleted && 'bg-[var(--color-surface-elevated)] border-2 border-[var(--color-border)] text-[var(--color-text-secondary)]',
                    step.onClick && 'cursor-pointer hover:scale-105'
                  )}
                  onClick={step.onClick}
                  disabled={!step.onClick}
                >
                  {variant === 'numbered' && (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                  {variant === 'dot' && !isActive && !isCompleted && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)]" />
                  )}
                  {isCompleted && <span>✓</span>}
                </button>

                {/* Step Content */}
                <div className={cn(
                  'ml-3',
                  orientation === 'vertical' && 'ml-0 mt-2'
                )}>
                  <div className={cn('font-medium', sizeStyles[size])}>
                    {step.label}
                    {step.optional && (
                      <span className="ml-1 text-xs text-[var(--color-text-secondary)]">
                        (可选)
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector Line */}
              {showConnectors && index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 bg-[var(--color-border)]',
                    orientation === 'horizontal' ? 'h-0.5 mx-4' : 'w-0.5 my-4 mx-auto min-h-[2rem]'
                  )}
                >
                  <motion.div
                    className="h-full bg-[var(--color-primary-500)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </nav>
    )
  }
)

Stepper.displayName = 'Stepper'

// ============================================================================
// Export
// ============================================================================

export type { StepperProps, Step }
