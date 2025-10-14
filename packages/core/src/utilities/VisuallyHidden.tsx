import React, { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

// 视觉隐藏变体配置
const visuallyHiddenVariants = cva(
  'sr-only',
  {
    variants: {
      focusable: {
        true: 'focus: absolute focus:top-2 focus:left-2 focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      },
      preserveFocus: {
        true: 'focus:static',
      },
    },
    defaultVariants: {
      focusable: false,
      preserveFocus: false,
    },
  }
)

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof visuallyHiddenVariants> {
  /** 元素标签名 */
  as?: keyof JSX.IntrinsicElements
  /** 是否完全隐藏（包括屏幕阅读器） */
  hidden?: boolean
  /** 是否保持可聚焦 */
  focusable?: boolean
}

export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>(
  ({
    as: Component = 'span',
    className,
    focusable = false,
    preserveFocus = false,
    hidden = false,
    children,
    ...props
  }, ref) => {
    // 如果完全隐藏，返回null
    if (hidden) {
      return null
    }

    return (
      <Component
        ref={ref}
        className={cn(
          visuallyHiddenVariants({ focusable, preserveFocus }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

VisuallyHidden.displayName = 'VisuallyHidden'

// 跳过链接组件
export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 跳转目标选择器 */
  href: string
  /** 链接文本 */
  children: React.ReactNode
}

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ className, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'absolute top-0 left-0 -translate-y-full bg-blue-600 text-white px-4 py-2 rounded-md focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform z-50',
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
)

SkipLink.displayName = 'SkipLink'

// 屏幕阅读器专用文本组件
export interface ScreenReaderOnlyProps extends VisuallyHiddenProps {}

export const ScreenReaderOnly = forwardRef<HTMLElement, ScreenReaderOnlyProps>(
  (props, ref) => <VisuallyHidden ref={ref} {...props} />
)

ScreenReaderOnly.displayName = 'ScreenReaderOnly'

// 可聚焦的隐藏组件
export interface FocusableHiddenProps extends Omit<VisuallyHiddenProps, 'focusable'> {}

export const FocusableHidden = forwardRef<HTMLElement, FocusableHiddenProps>(
  (props, ref) => <VisuallyHidden ref={ref} focusable {...props} />
)

FocusableHidden.displayName = 'FocusableHidden'

// 动画隐藏组件（用于过渡动画）
export interface AnimatedHiddenProps extends VisuallyHiddenProps {
  /** 是否显示 */
  show: boolean
  /** 动画持续时间 */
  duration?: number
}

export const AnimatedHidden = forwardRef<HTMLElement, AnimatedHiddenProps>(
  ({ show, duration = 300, className, children, ...props }, ref) => {
    if (show) {
      return (
        <div
          ref={ref}
          className={cn('transition-all duration-300', className)}
          style={{ transitionDuration: `${duration}ms` }}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <VisuallyHidden ref={ref} className={className} {...props}>
        {children}
      </VisuallyHidden>
    )
  }
)

AnimatedHidden.displayName = 'AnimatedHidden'

// 描述性文本组件（用于表单控件等）
export interface DescriptionProps extends VisuallyHiddenProps {
  /** 描述的目标元素ID */
  htmlFor?: string
}

export const Description = forwardRef<HTMLElement, DescriptionProps>(
  ({ htmlFor, className, children, ...props }, ref) => (
    <VisuallyHidden
      ref={ref}
      as="span"
      id={htmlFor ? `${htmlFor}-description` : undefined}
      className={className}
      {...props}
    >
      {children}
    </VisuallyHidden>
  )
)

Description.displayName = 'Description'

// 错误消息组件
export interface ErrorMessageProps extends VisuallyHiddenProps {
  /** 错误的目标元素ID */
  htmlFor?: string
  /** 是否显示错误 */
  show?: boolean
}

export const ErrorMessage = forwardRef<HTMLElement, ErrorMessageProps>(
  ({ htmlFor, show = false, className, children, ...props }, ref) => {
    if (!show) {
      return null
    }

    return (
      <VisuallyHidden
        ref={ref}
        as="span"
        id={htmlFor ? `${htmlFor}-error` : undefined}
        className={cn('text-red-600', className)}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {children}
      </VisuallyHidden>
    )
  }
)

ErrorMessage.displayName = 'ErrorMessage'

// 状态文本组件（用于动态状态变化）
export interface StatusTextProps extends VisuallyHiddenProps {
  /** 状态类型 */
  politeness?: 'polite' | 'assertive' | 'off'
}

export const StatusText = forwardRef<HTMLElement, StatusTextProps>(
  ({ politeness = 'polite', className, children, ...props }, ref) => (
    <VisuallyHidden
      ref={ref}
      as="div"
      role="status"
      aria-live={politeness}
      className={className}
      {...props}
    >
      {children}
    </VisuallyHidden>
  )
)

StatusText.displayName = 'StatusText'

// 实时区域组件
export interface LiveRegionProps extends VisuallyHiddenProps {
  /** 区域类型 */
    politeness?: 'polite' | 'assertive' | 'off'
  /** 是否原子化 */
  atomic?: boolean
  /** 是否相关 */
  relevant?: 'additions' | 'removals' | 'text' | 'all'
}

export const LiveRegion = forwardRef<HTMLElement, LiveRegionProps>(
  ({ politeness = 'polite', atomic = false, relevant = 'additions text', className, children, ...props }, ref) => (
    <VisuallyHidden
      ref={ref}
      as="div"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
      {...props}
    >
      {children}
    </VisuallyHidden>
  )
)

LiveRegion.displayName = 'LiveRegion'

export {
  visuallyHiddenVariants,
}