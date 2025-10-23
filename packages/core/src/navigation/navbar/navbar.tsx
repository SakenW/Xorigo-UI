/**
 * Navbar 导航栏组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 导航组件 - 响应式导航栏和菜单控制
 */

'use client'

import React, { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const navbarVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "flex w-full items-center justify-between border-b bg-background-primary/95 backdrop-blur supports-[backdrop-filter]:bg-background-primary/60",
  {
    variants: {
      // 变体系统 - 使用七轴主题系统的颜色令牌
      variant: {
        default: "border-border-base-base bg-background-primary",
        floating: "border-border-base-base bg-background-primary/95 backdrop-blur shadow-lg rounded-lg mx-4 mt-4",
        transparent: "border-transparent bg-transparent",
        inverse: "border-border-base-base bg-foreground text-text-primary",
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-secondary bg-secondary-500-500 text-secondary-600-600-foreground",
      },

      // 尺寸系统 - 使用七轴主题系统的密度令牌
      size: {
        sm: "px-4 py-2",
        md: "px-6 py-4",
        lg: "px-8 py-6",
        xl: "px-12 py-8",
      },

      // 位置
      position: {
        static: "relative",
        sticky: "sticky top-0 z-50",
        fixed: "fixed top-0 z-50",
      },

      // 布局
      layout: {
        default: "flex-row",
        center: "flex-row justify-center",
        spaceBetween: "flex-row justify-between",
        start: "flex-row justify-start",
        end: "flex-row justify-end",
      },

      // 响应式行为
      responsive: {
        none: "",
        mobile: "lg:hidden",
        desktop: "hidden lg:flex",
      },

      // 阴影效果
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },

      // 圆角
      rounded: {
        none: "",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },

    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'md',
      position: 'static',
      layout: 'spaceBetween',
      responsive: 'none',
      shadow: 'none',
      rounded: 'none',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface NavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  /**
   * 品牌标志/Logo
   */
  brand?: React.ReactNode

  /**
   * 导航链接
   */
  nav?: React.ReactNode

  /**
   * 操作按钮区域
   */
  actions?: React.ReactNode

  /**
   * 移动端菜单按钮
   */
  menuButton?: React.ReactNode

  /**
   * 是否显示移动端菜单
   */
  mobileMenuOpen?: boolean

  /**
   * 移动端菜单切换回调
   */
  onMobileMenuToggle?: (open: boolean) => void

  /**
   * 容器最大宽度
   */
  maxWidth?: string

  /**
   * 是否居中内容
   */
  centered?: boolean

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// Navbar 主组件实现
// =============================================================================

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      variant,
      size,
      position,
      layout,
      responsive,
      shadow,
      rounded,
      brand,
      nav,
      actions,
      menuButton,
      mobileMenuOpen: controlledMobileMenuOpen,
      onMobileMenuToggle,
      maxWidth,
      centered = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()
    const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false)

    // 处理移动端菜单状态（受控或非受控）
    const mobileMenuOpen = controlledMobileMenuOpen !== undefined
      ? controlledMobileMenuOpen
      : internalMobileMenuOpen

    const handleMobileMenuToggle = React.useCallback(() => {
      if (controlledMobileMenuOpen !== undefined) {
        onMobileMenuToggle?.(!controlledMobileMenuOpen)
      } else {
        setInternalMobileMenuOpen(!internalMobileMenuOpen)
      }
    }, [controlledMobileMenuOpen, internalMobileMenuOpen, onMobileMenuToggle])

    // 生成主题相关的样式 - 使用七轴主题系统的统一命名
    const themeStyles: React.CSSProperties = {
      // 七轴主题令牌映射
      '--xor-bg-primary': `hsl(${theme.colors.background.primary})`,
      '--xor-bg-secondary-500-500': `hsl(${theme.colors.background.secondary})`,
      '--xor-bg-tertiary': `hsl(${theme.colors.background.tertiary})`,
      '--xor-text-primary': `hsl(${theme.colors.text.primary})`,
      '--xor-text-secondary-600-600': `hsl(${theme.colors.text.secondary})`,
      '--xor-text-tertiary': `hsl(${theme.colors.text.tertiary})`,
      '--xor-border-primary': `hsl(${theme.colors.border.primary})`,
      '--xor-primary': `hsl(${theme.colors.primary})`,
      '--xor-secondary': `hsl(${theme.colors.secondary})`,
      '--xor-text-on-primary': `hsl(${theme.colors.onPrimary})`,
      '--xor-text-on-secondary': `hsl(${theme.colors.onSecondary})`,

      // 背景和文字颜色（兼容变体系统）
      ...(variant === 'inverse' && {
        backgroundColor: `hsl(${theme.colors.foreground})`,
        color: `hsl(${theme.colors.background})`,
      }),
      ...(variant === 'primary' && {
        backgroundColor: `hsl(${theme.colors.primary})`,
        color: `hsl(${theme.colors.primaryForeground})`,
      }),
      ...(variant === 'secondary' && {
        backgroundColor: `hsl(${theme.colors.secondary})`,
        color: `hsl(${theme.colors.secondaryForeground})`,
      }),
      ...(variant === 'transparent' && {
        backgroundColor: 'transparent',
      }),
    }

    // 确定布局样式
    const layoutClasses = React.useMemo(() => {
      if (centered) {
        return "justify-center"
      }
      return navbarVariants({ layout })
    }, [centered, layout])

    // 确定容器样式
    const containerStyles = React.useMemo(() => {
      if (maxWidth) {
        return { maxWidth }
      }
      return {}
    }, [maxWidth])

    // 默认菜单按钮
    const defaultMenuButton = (
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-md p-2",
          "text-[var(--xor-text-tertiary)] hover:text-[var(--xor-text-primary)] hover:bg-[var(--xor-bg-secondary-500-500)]",
          "focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--xor-primary)]",
          variant === 'inverse' && "hover:bg-[var(--xor-bg-tertiary)]/10",
          variant === 'primary' && "text-[var(--xor-text-on-primary)] hover:bg-[var(--xor-text-on-primary)]/10",
          variant === 'secondary' && "text-[var(--xor-text-on-secondary)] hover:bg-[var(--xor-text-on-secondary)]/10"
        )}
        onClick={handleMobileMenuToggle}
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    )

    return (
      <nav
        ref={ref}
        className={cn(
          navbarVariants({
            variant,
            size,
            position,
            layout: centered ? 'center' : layout,
            responsive,
            shadow,
            rounded,
          }),
          layoutClasses,
          className
        )}
        style={themeStyles}
        {...props}
      >
        <div
          className="flex w-full items-center justify-between"
          style={containerStyles}
        >
          {/* 品牌区域 */}
          {brand && (
            <div className="flex items-center">
              {brand}
            </div>
          )}

          {/* 桌面端导航 */}
          {nav && (
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {nav}
            </div>
          )}

          {/* 操作区域 */}
          {actions && (
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {actions}
            </div>
          )}

          {/* 移动端菜单按钮 */}
          {(nav || actions) && (
            <div className="lg:hidden">
              {menuButton || defaultMenuButton}
            </div>
          )}
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (nav || actions) && (
          <div className="lg:hidden border-t border-border-base-base bg-background-primary/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {nav && (
                <div className="space-y-1">
                  {React.Children.map(nav, (child, index) => (
                    <div key={index} className="block">
                      {child}
                    </div>
                  ))}
                </div>
              )}
              {actions && (
                <div className="border-t border-border-base-base pt-4 mt-4">
                  <div className="space-y-1">
                    {React.Children.map(actions, (child, index) => (
                      <div key={index} className="block">
                        {child}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 额外的子元素 */}
        {children}
      </nav>
    )
  }
)

// =============================================================================
// 专用 Navbar 组件
// =============================================================================

// NavbarBrand - 品牌组件
export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string
  as?: 'a' | 'div' | 'span'
}

export const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ href, as: Component = 'div', className, children, ...props }, ref) => {
    const content = (
      <Component
        ref={ref}
        className={cn(
          "flex items-center space-x-2 text-lg font-semibold",
          className
        )}
        {...(href && Component === 'a' ? { href } : {})}
        {...props}
      >
        {children}
      </Component>
    )

    return content
  }
)

NavbarBrand.displayName = 'NavbarBrand'

// NavbarNav - 导航链接组件
export interface NavbarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
}

export const NavbarNav = React.forwardRef<HTMLDivElement, NavbarNavProps>(
  ({ align = 'start', className, children, ...props }, ref) => {
    const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "hidden lg:flex lg:items-center space-x-8",
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NavbarNav.displayName = 'NavbarNav'

// NavbarActions - 操作区域组件
export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
}

export const NavbarActions = React.forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ align = 'end', className, children, ...props }, ref) => {
    const alignClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "hidden lg:flex lg:items-center space-x-4",
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

NavbarActions.displayName = 'NavbarActions'

// NavbarLink - 导航链接组件
export interface NavbarLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
  disabled?: boolean
}

export const NavbarLink = React.forwardRef<HTMLAnchorElement, NavbarLinkProps>(
  ({ active = false, disabled = false, className, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          active && "text-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)

NavbarLink.displayName = 'NavbarLink'

// =============================================================================
// 组件元数据
// =============================================================================

Navbar.displayName = 'Navbar'

// =============================================================================
// 导出
// =============================================================================

export { Navbar, navbarVariants }
export type { NavbarProps }