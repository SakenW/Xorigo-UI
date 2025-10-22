/**
 * Spacer 间距组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 布局组件 - 灵活的间距和空白控制
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const spacerVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "shrink-0",
  {
    variants: {
      // 方向
      direction: {
        vertical: "",
        horizontal: "",
        both: "",
      },

      // 尺寸预设
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        '2xl': "",
        '3xl': "",
        '4xl': "",
        '5xl': "",
        '6xl': "",
        '7xl': "",
        '8xl': "",
        auto: "",
        none: "",
      },

      // 自定义尺寸
      custom: {
        true: "",
        false: "",
      },

      // 是否可见（用于调试）
      visible: {
        true: "border border-dashed border-[var(--xor-border-tertiary)] bg-[var(--xor-bg-secondary)]",
        false: "",
      },

      // 是否弹性伸缩
      flex: {
        true: "flex-grow",
        false: "",
        '1': "flex-grow-1",
        '0': "flex-grow-0",
      },

      // 是否收缩
      shrink: {
        true: "flex-shrink",
        false: "",
        '1': "flex-shrink-1",
        '0': "flex-shrink-0",
      },

      // 最小尺寸
      minSize: {
        none: "",
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        '2xl': "",
        '3xl': "",
        '4xl': "",
        full: "",
        screen: "",
      },

      // 最大尺寸
      maxSize: {
        none: "",
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: '',
        '2xl': "",
        '3xl': "",
        '4xl': "",
        full: "",
        screen: "",
      },
    },

    // 默认变体
    defaultVariants: {
      direction: 'vertical',
      size: 'md',
      custom: false,
      visible: false,
      flex: false,
      shrink: 'true',
      minSize: 'none',
      maxSize: 'none',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {
  /**
   * 自定义宽度
   */
  width?: string | number

  /**
   * 自定义高度
   */
  height?: string | number

  /**
   * 自定义最小宽度
   */
  minWidth?: string | number

  /**
   * 自定义最小高度
   */
  minHeight?: string | number

  /**
   * 自定义最大宽度
   */
  maxWidth?: string | number

  /**
   * 自定义最大高度
   */
  maxHeight?: string | number

  /**
   * 是否为块级元素
   */
  block?: boolean

  /**
   * 是否内联显示
   */
  inline?: boolean

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// Spacer 主组件实现
// =============================================================================

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  (
    {
      direction,
      size,
      custom,
      visible,
      flex,
      shrink,
      minSize,
      maxSize,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      block = true,
      inline = false,
      className,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 生成预设尺寸映射
    const sizeMap = {
      xs: { width: '0.25rem', height: '0.25rem' },
      sm: { width: '0.5rem', height: '0.5rem' },
      md: { width: '1rem', height: '1rem' },
      lg: { width: '1.5rem', height: '1.5rem' },
      xl: { width: '2rem', height: '2rem' },
      '2xl': { width: '2.5rem', height: '2.5rem' },
      '3xl': { width: '3rem', height: '3rem' },
      '4xl': { width: '4rem', height: '4rem' },
      '5xl': { width: '5rem', height: '5rem' },
      '6xl': { width: '6rem', height: '6rem' },
      '7xl': { width: '7rem', height: '7rem' },
      '8xl': { width: '8rem', height: '8rem' },
      auto: { width: 'auto', height: 'auto' },
      none: { width: '0', height: '0' },
    } as const

    // 生成最小尺寸映射
    const minSizeMap = {
      none: { minWidth: '0', minHeight: '0' },
      xs: { minWidth: '0.25rem', minHeight: '0.25rem' },
      sm: { minWidth: '0.5rem', minHeight: '0.5rem' },
      md: { minWidth: '1rem', minHeight: '1rem' },
      lg: { minWidth: '1.5rem', minHeight: '1.5rem' },
      xl: { minWidth: '2rem', minHeight: '2rem' },
      '2xl': { minWidth: '2.5rem', minHeight: '2.5rem' },
      '3xl': { minWidth: '3rem', minHeight: '3rem' },
      '4xl': { minWidth: '4rem', minHeight: '4rem' },
      full: { minWidth: '100%', minHeight: '100%' },
      screen: { minWidth: '100vw', minHeight: '100vh' },
    } as const

    // 生成最大尺寸映射
    const maxSizeMap = {
      none: { maxWidth: 'none', maxHeight: 'none' },
      xs: { maxWidth: '0.25rem', maxHeight: '0.25rem' },
      sm: { maxWidth: '0.5rem', maxHeight: '0.5rem' },
      md: { maxWidth: '1rem', maxHeight: '1rem' },
      lg: { maxWidth: '1.5rem', maxHeight: '1.5rem' },
      xl: { maxWidth: '2rem', maxHeight: '2rem' },
      '2xl': { maxWidth: '2.5rem', maxHeight: '2.5rem' },
      '3xl': { maxWidth: '3rem', maxHeight: '3rem' },
      '4xl': { maxWidth: '4rem', maxHeight: '4rem' },
      full: { maxWidth: '100%', maxHeight: '100%' },
      screen: { maxWidth: '100vw', maxHeight: '100vh' },
    } as const

    // 生成样式
    const styles: React.CSSProperties = {
      // 方向控制
      ...(direction === 'vertical' && { width: '0', height: sizeMap[size as keyof typeof sizeMap]?.height || '1rem' }),
      ...(direction === 'horizontal' && { width: sizeMap[size as keyof typeof sizeMap]?.width || '1rem', height: '0' }),
      ...(direction === 'both' && sizeMap[size as keyof typeof sizeMap]),

      // 自定义尺寸
      ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
      ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
      ...(minWidth !== undefined && { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }),
      ...(minHeight !== undefined && { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }),
      ...(maxWidth !== undefined && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
      ...(maxHeight !== undefined && { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),

      // 预设最小/最大尺寸
      ...(minSize !== 'none' && minSizeMap[minSize as keyof typeof minSizeMap]),
      ...(maxSize !== 'none' && maxSizeMap[maxSize as keyof typeof maxSizeMap]),

      // 主题相关样式
      '--spacer-bg': visible ? `hsl(${theme.colors.muted})` : 'transparent',
      '--spacer-border': visible ? `hsl(${theme.colors.border.primary})` : 'transparent',
    }

    // 生成类名
    const classes = cn(
      spacerVariants({
        direction,
        size,
        custom,
        visible,
        flex,
        shrink,
        minSize,
        maxSize,
      }),
      // 显示控制
      inline && !block && 'inline-block',
      block && !inline && 'block',
      !block && !inline && 'inline-block',
      // 可见时添加背景和边框样式
      visible && {
        'bg-gray-50': true,
        'border border-dashed border-gray-300': true,
      },
      className
    )

    return (
      <div
        ref={ref}
        className={classes}
        style={{
          ...styles,
          // 可见时的样式覆盖
          ...(visible && {
            backgroundColor: 'var(--spacer-bg)',
            borderColor: 'var(--spacer-border)',
          }),
        }}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

// =============================================================================
// 专用 Spacer 组件
// =============================================================================

// VSpace - 垂直间距
export interface VSpaceProps extends Omit<SpacerProps, 'direction'> {
  size?: SpacerProps['size']
}

export const VSpace = React.forwardRef<HTMLDivElement, VSpaceProps>(
  ({ size = 'md', ...props }, ref) => {
    return (
      <Spacer
        ref={ref}
        direction="vertical"
        size={size}
        {...props}
      />
    )
  }
)

VSpace.displayName = 'VSpace'

// HSpace - 水平间距
export interface HSpaceProps extends Omit<SpacerProps, 'direction'> {
  size?: SpacerProps['size']
}

export const HSpace = React.forwardRef<HTMLDivElement, HSpaceProps>(
  ({ size = 'md', ...props }, ref) => {
    return (
      <Spacer
        ref={ref}
        direction="horizontal"
        size={size}
        {...props}
      />
    )
  }
)

HSpace.displayName = 'HSpace'

// FlexSpacer - 弹性间距
export interface FlexSpacerProps extends Omit<SpacerProps, 'size' | 'direction' | 'flex' | 'shrink'> {
  flex?: number | string
  shrink?: boolean
}

export const FlexSpacer = React.forwardRef<HTMLDivElement, FlexSpacerProps>(
  ({ flex = 1, shrink = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("shrink-0", className)}
        style={{
          flex: typeof flex === 'number' ? flex.toString() : flex,
          flexShrink: shrink ? 1 : 0,
        }}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

FlexSpacer.displayName = 'FlexSpacer'

// DividerSpace - 分割线间距
export interface DividerSpaceProps extends Omit<SpacerProps, 'visible' | 'direction'> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: 'thin' | 'medium' | 'thick'
}

export const DividerSpace = React.forwardRef<HTMLDivElement, DividerSpaceProps>(
  ({
    orientation = 'horizontal',
    variant = 'solid',
    thickness = 'thin',
    size = 'md',
    className,
    ...props
  }, ref) => {
    const { theme } = useTheme()

    const dividerStyles: React.CSSProperties = {
      // 颜色
      borderColor: `hsl(${theme.colors.border.primary})`,
      backgroundColor: `hsl(${theme.colors.border.primary})`,

      // 方向控制
      ...(orientation === 'horizontal' ? {
        width: sizeMap[size as keyof typeof sizeMap]?.width || '100%',
        height: thickness === 'thin' ? '1px' : thickness === 'medium' ? '2px' : '4px',
        borderBottom: variant === 'dashed' ? '1px dashed' : variant === 'dotted' ? '1px dotted' : '1px solid',
      } : {
        width: thickness === 'thin' ? '1px' : thickness === 'medium' ? '2px' : '4px',
        height: sizeMap[size as keyof typeof sizeMap]?.height || '100%',
        borderRight: variant === 'dashed' ? '1px dashed' : variant === 'dotted' ? '1px dotted' : '1px solid',
      }),
    }

    return (
      <div
        ref={ref}
        className={cn("shrink-0", className)}
        style={dividerStyles}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    )
  }
)

DividerSpace.displayName = 'DividerSpace'

// =============================================================================
// 工具函数
// =============================================================================

/**
 * 创建自定义间距
 */
export const createSpacer = (width: string | number, height?: string | number): React.ReactElement => {
  return (
    <Spacer
      width={width}
      height={height || width}
      block={false}
    />
  )
}

/**
 * 创建响应式间距
 */
export const createResponsiveSpacer = (
  mobileSize: string | number,
  desktopSize: string | number,
  direction: 'vertical' | 'horizontal' = 'vertical'
): React.ReactElement => {
  return (
    <Spacer
      direction={direction}
      width={direction === 'horizontal' ? mobileSize : '0'}
      height={direction === 'vertical' ? mobileSize : '0'}
      className={{
        'sm:direction-horizontal': direction === 'horizontal',
        'sm:w-desktop': direction === 'horizontal',
        'sm:h-desktop': direction === 'vertical',
      }}
      style={{
        '--desktop-size': typeof desktopSize === 'number' ? `${desktopSize}px` : desktopSize,
      }}
    />
  )
}

// =============================================================================
// 组件元数据
// =============================================================================

Spacer.displayName = 'Spacer'

// =============================================================================
// 导出
// =============================================================================

export { Spacer, spacerVariants }
export type { SpacerProps }