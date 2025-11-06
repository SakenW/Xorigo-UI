'use client'
import React, { useState, forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils'
import { CheckIcon, XIcon } from './icon'
import { Spinner } from './Spinner'

/**
 * CopyButton 组件变体配置
 * 遵循 Xorigo UI API 标准
 */
const copyButtonVariants = cva(
  // 基础样式 - 使用主题令牌
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--bg-primary-action)] text-[var(--text-inverse)] hover:bg-[var(--bg-primary-action-hover)] focus:ring-[var(--ring-primary-action)]',
        secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border-primary)]',
        ghost: 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] focus:ring-[var(--border-primary)]',
        success: 'bg-[var(--bg-success)] text-[var(--text-inverse)] hover:bg-[var(--bg-success-hover)] focus:ring-[var(--ring-success)]',
      },
      size: {
        xs: 'px-1.5 py-1 text-xs min-h-[20px]',
        sm: 'px-2 py-1 text-xs min-h-[24px]',
        md: 'px-2.5 py-1.5 text-sm min-h-[28px]',
        lg: 'px-3 py-2 text-sm min-h-[32px]',
        xl: 'px-4 py-2.5 text-base min-h-[36px]',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'sm',
    },
  }
)

export interface CopyButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant' | 'children'>,
    VariantProps<typeof copyButtonVariants> {
  /** 要复制的文本内容 */
  text: string
  /** 复制成功后的提示文本 */
  copiedText?: string
  /** 默认显示的文本 */
  defaultText?: string
  /** 复制成功状态持续时间（ms） */
  successDuration?: number
  /** 复制成功回调 */
  onCopySuccess?: () => void
  /** 复制失败回调 */
  onCopyError?: (error: Error) => void
  /** 是否仅显示图标 */
  iconOnly?: boolean
  /** 可访问性标签 */
  ariaLabel?: string
}

/**
 * CopyButton - 复制按钮组件
 *
 * 功能特性：
 * - 多级复制降级策略（Clipboard API → execCommand → 手动复制提示）
 * - 状态反馈（未复制 → 复制中 → 成功/失败）
 * - 完整的无障碍支持
 * - 主题令牌集成
 *
 * @example
 * ```tsx
 * <CopyButton text="复制的内容" />
 * <CopyButton text="代码内容" variant="primary" size="md" />
 * ```
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      className,
      variant,
      size,
      text,
      copiedText = '已复制',
      defaultText = '复制',
      successDuration = 2000,
      onCopySuccess,
      onCopyError,
      iconOnly = false,
      ariaLabel,
      disabled,
      ...props
    },
    ref
  ) => {
    const [copyState, setCopyState] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')

    /**
     * 多级复制降级策略
     */
    const handleCopy = async () => {
      if (disabled || !text) return

      setCopyState('copying')

      try {
        // 策略1: 现代 Clipboard API（推荐）
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text)
          handleSuccess()
          return
        }

        // 策略2: execCommand（兼容旧浏览器）
        if (document.execCommand) {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()

          const success = document.execCommand('copy')
          document.body.removeChild(textarea)

          if (success) {
            handleSuccess()
            return
          }
        }

        // 策略3: 静默降级（无法复制时不报错）
        handleError(new Error('浏览器不支持自动复制'))
      } catch (error) {
        handleError(error as Error)
      }
    }

    /**
     * 复制成功处理
     */
    const handleSuccess = () => {
      setCopyState('success')
      onCopySuccess?.()

      // 自动恢复状态
      setTimeout(() => {
        setCopyState('idle')
      }, successDuration)
    }

    /**
     * 复制失败处理（静默降级）
     */
    const handleError = (error: Error) => {
      setCopyState('error')
      onCopyError?.(error)

      // 静默降级：不显示错误，自动恢复
      setTimeout(() => {
        setCopyState('idle')
      }, successDuration)
    }

    /**
     * 获取当前显示的图标
     */
    const getIcon = () => {
      switch (copyState) {
        case 'copying':
          return <Spinner size="sm" />
        case 'success':
          return <CheckIcon size="sm" />
        case 'error':
          return <XIcon size="sm" />
        default:
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          )
      }
    }

    /**
     * 获取当前显示的文本
     */
    const getDisplayText = () => {
      switch (copyState) {
        case 'copying':
          return '复制中...'
        case 'success':
          return copiedText
        case 'error':
          return '复制失败'
        default:
          return defaultText
      }
    }

    /**
     * 获取可访问性属性
     */
    const ariaProps = {
      'aria-label': ariaLabel || `复制 ${text}`,
      'aria-live': 'polite' as const,
      'aria-atomic': 'true' as const,
    }

    return (
      <motion.button
        ref={ref}
        type="button"
        className={cn(copyButtonVariants({ variant, size }), className)}
        onClick={handleCopy}
        disabled={disabled || copyState === 'copying'}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        transition={{ duration: 0.15 }}
        {...ariaProps}
        {...props}
      >
        {/* 图标 */}
        <span className="inline-flex items-center justify-center">
          {getIcon()}
        </span>

        {/* 文本（可选） */}
        {!iconOnly && (
          <span className="ml-1.5">
            {getDisplayText()}
          </span>
        )}
      </motion.button>
    )
  }
)

CopyButton.displayName = 'CopyButton'
