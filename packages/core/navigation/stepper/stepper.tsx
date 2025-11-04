/**
 * Stepper - 流程步骤导航组件
 *
 * 用于展示多步骤流程的进度和导航。
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
   * 步骤标题
   */
  title: string

  /**
   * 步骤描述
   */
  description?: string

  /**
   * 步骤状态
   */
  status?: 'pending' | 'active' | 'completed' | 'error'

  /**
   * 步骤图标
   */
  icon?: React.ReactNode
}

export interface StepperProps {
  /**
   * 步骤列表
   */
  steps: Step[]

  /**
   * 步骤per方向
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * 当前活跃步骤索引
   */
  currentStep?: number

  /**
   * 点击步骤的处理
   */
  onStepClick?: (index: number) => void

  /**
   * 是否可点击
   */
  clickable?: boolean

  /**
   * 变体
   */
  variant?: 'default' | 'numbered' | 'dotted'

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
      orientation = 'horizontal',
      currentStep = 0,
      onStepClick,
      clickable = false,
      variant = 'default',
      className
    },
    ref
  ) => {
    const getStepStatus = (index: number) => {
      if (index < currentStep) return 'completed'
      if (index === currentStep) return 'active'
      return 'pending'
    }

    const getConnectorStatus = (index: number) => {
      if (index < currentStep) return 'completed'
      return 'pending'
    }

    return (
      <div
        ref={ref as any}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
      >
        {steps.map((step, index) => {
          const status = step.status || getStepStatus(index)
          const isClickable = clickable && status !== 'pending'
          const isLast = index === steps.length - 1

          return (
            <div
              key={step.id}
              className={cn(
                'flex',
                orientation === 'horizontal' ? 'flex-col items-center flex-1' : 'flex-row w-full'
              )}
            >
              <motion.button
                className={cn(
                  'flex items-center gap-3',
                  orientation === 'horizontal' ? 'flex-col' : 'flex-row w-full',
                  isClickable && 'cursor-pointer hover:opacity-80'
                )}
                onClick={() => isClickable && onStepClick?.(index)}
                whileHover={isClickable ? { scale: 1.02 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
                disabled={!isClickable}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 transition-colors',
                    status === 'completed' && 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)] text-white',
                    status === 'active' && 'bg-[var(--color-surface)] border-[var(--color-primary-500)] text-[var(--color-primary-500)]',
                    status === 'error' && 'bg-[var(--color-error-500)] border-[var(--color-error-500)] text-white',
                    status === 'pending' && 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]',
                    variant === 'numbered' && 'w-10 h-10',
                    variant === 'dotted' && 'w-6 h-6',
                    variant === 'default' && 'w-8 h-8'
                  )}
                >
                  {step.icon ? (
                    <span>{step.icon}</span>
                  ) : (
                    status === 'completed' ? <span>✓</span> : index + 1
                  )}
                </div>

                {/* Step Content */}
                <div
                  className={cn(
                    'text-left',
                    orientation === 'horizontal' ? 'text-center' : 'text-left'
                  )}
                >
                  <div
                    className={cn(
                      'text-sm font-medium',
                      status === 'pending' && 'text-[var(--color-text-secondary)]',
                      (status === 'active' || status === 'completed') && 'text-[var(--color-text-primary)]'
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              </motion.button>

              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 transition-colors',
                    orientation === 'horizontal' ? 'h-0.5 mt-0 mx-2' : 'w-0.5 ml-4 my-2'
                  )}
                >
                  <div
                    className={cn(
                      'w-full h-full',
                      getConnectorStatus(index) === 'completed'
                        ? 'bg-[var(--color-primary-500)]'
                        : 'bg-[var(--color-border)]'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = 'Stepper'

// ============================================================================
// Export
// ============================================================================

export type { StepperProps, Step }
