/**
 * Stack 堆叠组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 布局组件 - 灵活的间距和方向控制
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const stackVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "flex",
  {
    variants: {
      // 方向
      direction: {
        row: "flex-row",
        col: "flex-col",
        'row-reverse': "flex-row-reverse",
        'col-reverse': "flex-col-reverse",
        responsive: "flex-col sm:flex-row",
        'responsive-reverse': "flex-col-reverse sm:flex-row-reverse",
      },

      // 对齐方式（主轴）
      justify: {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
        stretch: "justify-stretch",
      },

      // 对齐方式（交叉轴）
      align: {
        start: "items-start",
        end: "items-end",
        center: "items-center",
        baseline: "items-baseline",
        stretch: "items-stretch",
      },

      // 换行控制
      wrap: {
        nowrap: "flex-nowrap",
        wrap: "flex-wrap",
        'wrap-reverse': "flex-wrap-reverse",
      },

      // 间距大小
      spacing: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        '2xl': "gap-10",
        '3xl': "gap-12",
        '4xl': "gap-16",
      },

      // 自定义间距（垂直）
      spacingY: {
        none: "gap-y-0",
        xs: "gap-y-1",
        sm: "gap-y-2",
        md: "gap-y-4",
        lg: "gap-y-6",
        xl: "gap-y-8",
        '2xl': "gap-y-10",
        '3xl': "gap-y-12",
        '4xl': "gap-y-16",
      },

      // 自定义间距（水平）
      spacingX: {
        none: "gap-x-0",
        xs: "gap-x-1",
        sm: "gap-x-2",
        md: "gap-x-4",
        lg: "gap-x-6",
        xl: "gap-x-8",
        '2xl': "gap-x-10",
        '3xl': "gap-x-12",
        '4xl': "gap-x-16",
      },

      // 分割线
      divider: {
        none: "",
        horizontal: "divide-y divide-border",
        vertical: "divide-x divide-border",
        both: "divide-y divide-x divide-border",
      },

      // 分割线样式
      dividerStyle: {
        solid: "divide-solid",
        dashed: "divide-dashed",
        dotted: "divide-dotted",
      },

      // 宽度控制
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },

      // 高度控制
      fullHeight: {
        true: "h-full",
        false: "h-auto",
      },

      // 最小宽度
      minWidth: {
        none: "",
        xs: "min-w-xs",
        sm: "min-w-sm",
        md: "min-w-md",
        lg: "min-w-lg",
        xl: "min-w-xl",
        fit: "min-w-fit",
        max: "min-w-max",
        full: "min-w-full",
      },

      // 最大宽度
      maxWidth: {
        none: "",
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        '2xl': "max-w-2xl",
        '3xl': "max-w-3xl",
        '4xl': "max-w-4xl",
        '5xl': "max-w-5xl",
        '6xl': "max-w-6xl",
        '7xl': "max-w-7xl",
        full: "max-w-full",
        screen: "max-w-screen-lg",
      },
    },

    // 默认变体
    defaultVariants: {
      direction: 'col',
      justify: 'start',
      align: 'start',
      wrap: 'nowrap',
      spacing: 'md',
      spacingY: 'none',
      spacingX: 'none',
      divider: 'none',
      dividerStyle: 'solid',
      fullWidth: false,
      fullHeight: false,
      minWidth: 'none',
      maxWidth: 'none',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义间距值
   */
  gap?: string

  /**
   * 自定义行间距
   */
  rowGap?: string

  /**
   * 自定义列间距
   */
  columnGap?: string

  /**
   * 是否作为内联元素
   */
  inline?: boolean

  /**
   * 子元素是否等分空间
   */
  distribute?: boolean

  /**
   * 子元素是否保持固定比例
   */
  fixedRatio?: boolean

  /**
   * 自定义样式类名
   */
  className?: string
}

// =============================================================================
// Stack 主组件实现
// =============================================================================

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction,
      justify,
      align,
      wrap,
      spacing,
      spacingY,
      spacingX,
      divider,
      dividerStyle,
      fullWidth,
      fullHeight,
      minWidth,
      maxWidth,
      gap,
      rowGap,
      columnGap,
      inline = false,
      distribute = false,
      fixedRatio = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 生成主题相关的样式
    const themeStyles: React.CSSProperties = {
      // 自定义间距
      ...(gap && { gap }),
      ...(rowGap && { rowGap }),
      ...(columnGap && { columnGap }),

      // 分配空间
      ...(distribute && {
        '& > *': {
          flex: 1,
        },
      }),

      // 固定比例
      ...(fixedRatio && {
        aspectRatio: '1/1',
      }),

      // 主题颜色变量（用于分割线等）
      '--stack-divider': `hsl(${theme.colors.border.primary})`,
      // 可根据七轴动态调整
    }

    // 生成响应式类名
    const responsiveClasses = React.useMemo(() => {
      const classes = [stackVariants({
        direction,
        justify,
        align,
        wrap,
        spacing: spacingY && spacingX ? 'none' : spacing,
        spacingY: spacingY || 'none',
        spacingX: spacingX || 'none',
        divider,
        dividerStyle,
        fullWidth,
        fullHeight,
        minWidth,
        maxWidth,
      })]

      // 内联模式
      if (inline) {
        classes.push('inline-flex')
      }

      // 分配空间模式
      if (distribute) {
        classes.push('& > *:flex-1')
      }

      return classes
    }, [
      direction, justify, align, wrap, spacing, spacingY, spacingX,
      divider, dividerStyle, fullWidth, fullHeight, minWidth, maxWidth,
      inline, distribute
    ])

    return (
      <div
        ref={ref}
        className={cn(
          responsiveClasses,
          className
        )}
        style={themeStyles}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// 专用 Stack 组件
// =============================================================================

// VStack - 垂直堆叠
export interface VStackProps extends Omit<StackProps, 'direction'> {
  spacing?: StackProps['spacing']
}

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>(
  ({ spacing = 'md', ...props }, ref) => {
    return (
      <Stack
        ref={ref}
        direction="col"
        spacing={spacing}
        {...props}
      />
    )
  }
)

VStack.displayName = 'VStack'

// HStack - 水平堆叠
export interface HStackProps extends Omit<StackProps, 'direction'> {
  spacing?: StackProps['spacing']
}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ spacing = 'md', ...props }, ref) => {
    return (
      <Stack
        ref={ref}
        direction="row"
        spacing={spacing}
        {...props}
      />
    )
  }
)

HStack.displayName = 'HStack'

// Spacer - 间距组件
export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: StackProps['spacing']
  flex?: boolean | number
}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = 'md', flex = false, className, ...props }, ref) => {
    const flexStyles = flex === true ? { flex: 1 } : flex ? { flex } : {}

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0",
          // 根据方向设置间距
          typeof size === 'string' && {
            'gap-1': size === 'xs',
            'gap-2': size === 'sm',
            'gap-4': size === 'md',
            'gap-6': size === 'lg',
            'gap-8': size === 'xl',
            'gap-10': size === '2xl',
            'gap-12': size === '3xl',
            'gap-16': size === '4xl',
            'gap-0': size === 'none',
          }[size],
          className
        )}
        style={flexStyles}
        {...props}
      />
    )
  }
)

Spacer.displayName = 'Spacer'

// Divider - 分割线组件
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: 'thin' | 'medium' | 'thick'
  color?: string
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({
    orientation = 'horizontal',
    variant = 'solid',
    thickness = 'thin',
    color,
    className,
    ...props
  }, ref) => {
    const { theme } = useTheme()

    const dividerStyles = {
      // 颜色
      ...(color && { borderColor: color }),
      ...(color && { backgroundColor: color }),

      // 主题颜色
      '--divider-color': color || `hsl(${theme.colors.border.primary})`,

      // 厚度
      ...(thickness === 'thin' && { height: orientation === 'horizontal' ? '1px' : 'auto', width: orientation === 'vertical' ? '1px' : 'auto' }),
      ...(thickness === 'medium' && { height: orientation === 'horizontal' ? '2px' : 'auto', width: orientation === 'vertical' ? '2px' : 'auto' }),
      ...(thickness === 'thick' && { height: orientation === 'horizontal' ? '4px' : 'auto', width: orientation === 'vertical' ? '4px' : 'auto' }),
    }

    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0",
          orientation === 'horizontal' ? 'w-full border-t' : 'h-full border-l',
          variant === 'dashed' && 'border-dashed',
          variant === 'dotted' && 'border-dotted',
          className
        )}
        style={{
          ...dividerStyles,
          borderColor: 'var(--divider-color)',
        }}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

// =============================================================================
// 组件元数据
// =============================================================================

Stack.displayName = 'Stack'

// =============================================================================
// 导出
// =============================================================================

export { Stack, stackVariants }
export type { StackProps }