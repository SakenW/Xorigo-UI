/**
 * Flex 弹性布局组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 布局组件 - 强大的Flexbox布局控制
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const flexVariants = cva(
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

      // 主轴对齐
      justify: {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
        stretch: "justify-stretch",
      },

      // 交叉轴对齐
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

      // Flex增长
      grow: {
        0: "flex-grow-0",
        1: "flex-grow",
        'true': "flex-grow",
        'false': "flex-grow-0",
      },

      // Flex收缩
      shrink: {
        0: "flex-shrink-0",
        1: "flex-shrink",
        'true': "flex-shrink",
        'false': "flex-shrink-0",
      },

      // Flex基础大小
      basis: {
        auto: "flex-basis-auto",
        0: "flex-basis-0",
        full: "flex-basis-full",
        '1/2': "flex-basis-1/2",
        '1/3': "flex-basis-1/3",
        '2/3': "flex-basis-2/3",
        '1/4': "flex-basis-1/4",
        '3/4': "flex-basis-3/4",
        '1/5': "flex-basis-1/5",
        '2/5': "flex-basis-2/5",
        '3/5': "flex-basis-3/5",
        '4/5': "flex-basis-4/5",
      },

      // 间距
      gap: {
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

      // 行间距
      gapY: {
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

      // 列间距
      gapX: {
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

      // 宽度控制
      width: {
        auto: "w-auto",
        full: "w-full",
        screen: "w-screen",
        min: "w-min",
        max: "w-max",
        fit: "w-fit",
      },

      // 高度控制
      height: {
        auto: "h-auto",
        full: "h-full",
        screen: "h-screen",
        min: "h-min",
        max: "h-max",
        fit: "h-fit",
      },

      // 最小宽度
      minWidth: {
        none: "min-w-0",
        xs: "min-w-xs",
        sm: "min-w-sm",
        md: "min-w-md",
        lg: "min-w-lg",
        xl: "min-w-xl",
        fit: "min-w-fit",
        max: "min-w-max",
        full: "min-w-full",
      },

      // 最小高度
      minHeight: {
        none: "min-h-0",
        xs: "min-h-xs",
        sm: "min-h-sm",
        md: "min-h-md",
        lg: "min-h-lg",
        xl: "min-h-xl",
        fit: "min-h-fit",
        max: "min-h-max",
        full: "min-h-full",
        screen: "min-h-screen",
      },

      // 最大宽度
      maxWidth: {
        none: "max-w-none",
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
        prose: "max-w-prose",
      },

      // 最大高度
      maxHeight: {
        none: "max-h-none",
        xs: "max-h-xs",
        sm: "max-h-sm",
        md: "max-h-md",
        lg: "max-h-lg",
        xl: "max-h-xl",
        '2xl': "max-h-2xl",
        '3xl': "max-h-3xl",
        '4xl': "max-h-4xl",
        '5xl': "max-h-5xl",
        '6xl': "max-h-6xl",
        '7xl': "max-h-7xl",
        full: "max-h-full",
        screen: "max-h-screen",
      },

      // 溢出控制
      overflow: {
        auto: "overflow-auto",
        hidden: "overflow-hidden",
        visible: "overflow-visible",
        scroll: "overflow-scroll",
        clip: "overflow-clip",
      },

      // X轴溢出
      overflowX: {
        auto: "overflow-x-auto",
        hidden: "overflow-x-hidden",
        visible: "overflow-x-visible",
        scroll: "overflow-x-scroll",
        clip: "overflow-x-clip",
      },

      // Y轴溢出
      overflowY: {
        auto: "overflow-y-auto",
        hidden: "overflow-y-hidden",
        visible: "overflow-y-visible",
        scroll: "overflow-y-scroll",
        clip: "overflow-y-clip",
      },

      // 定位
      position: {
        static: "static",
        fixed: "fixed",
        absolute: "absolute",
        relative: "relative",
        sticky: "sticky",
      },

      // 层级
      zIndex: {
        auto: "z-auto",
        0: "z-0",
        10: "z-10",
        20: "z-20",
        30: "z-30",
        40: "z-40",
        50: "z-50",
      },
    },

    // 默认变体
    defaultVariants: {
      direction: 'row',
      justify: 'start',
      align: 'start',
      wrap: 'nowrap',
      grow: 'false',
      shrink: 'true',
      basis: 'auto',
      gap: 'none',
      gapY: 'none',
      gapX: 'none',
      width: 'auto',
      height: 'auto',
      minWidth: 'none',
      minHeight: 'none',
      maxWidth: 'none',
      maxHeight: 'none',
      overflow: 'visible',
      overflowX: 'visible',
      overflowY: 'visible',
      position: 'static',
      zIndex: 'auto',
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义 Flex 属性
   */
  flex?: string

  /**
   * 自定义 flex-grow
   */
  flexGrow?: number

  /**
   * 自定义 flex-shrink
   */
  flexShrink?: number

  /**
   * 自定义 flex-basis
   */
  flexBasis?: string

  /**
   * 自定义 align-self
   */
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'baseline' | 'stretch'

  /**
   * 自定义 order
   */
  order?: number | 'first' | 'last' | 'none'

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
// Flex 主组件实现
// =============================================================================

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      direction,
      justify,
      align,
      wrap,
      grow,
      shrink,
      basis,
      gap,
      gapY,
      gapX,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      overflow,
      overflowX,
      overflowY,
      position,
      zIndex,
      flex,
      flexGrow,
      flexShrink,
      flexBasis,
      alignSelf,
      order,
      inline = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme()

    // 生成自定义样式
    const customStyles: React.CSSProperties = {
      // 自定义 flex 属性
      ...(flex && { flex }),

      // 自定义 flex 属性
      ...(flexGrow !== undefined && { flexGrow }),
      ...(flexShrink !== undefined && { flexShrink }),
      ...(flexBasis !== undefined && { flexBasis }),

      // 自定义 align-self
      ...(alignSelf && {
        alignSelf: alignSelf === 'start' ? 'flex-start' :
                   alignSelf === 'end' ? 'flex-end' : alignSelf,
      }),

      // 自定义 order
      ...(order !== undefined && {
        order: order === 'first' ? -999999 :
              order === 'last' ? 999999 :
              order === 'none' ? 0 : order,
      }),

      // 主题变量（用于动态调整）
      '--flex-gap-color': `hsl(${theme.colors.border.primary})`,
      // 可根据七轴动态调整
    }

    return (
      <div
        ref={ref}
        className={cn(
          inline ? 'inline-flex' : 'flex',
          flexVariants({
            direction,
            justify,
            align,
            wrap,
            grow: typeof grow === 'boolean' ? (grow ? 'true' : 'false') : grow,
            shrink: typeof shrink === 'boolean' ? (shrink ? 'true' : 'false') : shrink,
            basis,
            gap,
            gapY,
            gapX,
            width,
            height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            overflow,
            overflowX,
            overflowY,
            position,
            zIndex,
          }),
          className
        )}
        style={customStyles}
        {...props}
      >
        {children}
      </div>
    )
  }
)

// =============================================================================
// 专用 Flex 组件
// =============================================================================

// FlexItem - 单个 Flex 项目
export interface FlexItemProps extends Omit<FlexProps, 'direction' | 'justify' | 'align' | 'wrap'> {
  flex?: string | number
  order?: FlexProps['order']
  alignSelf?: FlexProps['alignSelf']
}

export const FlexItem = React.forwardRef<HTMLDivElement, FlexItemProps>(
  ({ flex = '0 1 auto', order, alignSelf, className, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        flex={typeof flex === 'number' ? `${flex} ${flex} 0px` : flex}
        order={order}
        alignSelf={alignSelf}
        className={className}
        {...props}
      />
    )
  }
)

FlexItem.displayName = 'FlexItem'

// FlexCenter - 居中布局
export interface FlexCenterProps extends Omit<FlexProps, 'justify' | 'align'> {
  direction?: FlexProps['direction']
}

export const FlexCenter = React.forwardRef<HTMLDivElement, FlexCenterProps>(
  ({ direction = 'row', className, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={direction}
        justify="center"
        align="center"
        className={className}
        {...props}
      />
    )
  }
)

FlexCenter.displayName = 'FlexCenter'

// FlexBetween - 两端对齐
export interface FlexBetweenProps extends Omit<FlexProps, 'justify'> {
  direction?: FlexProps['direction']
  align?: FlexProps['align']
}

export const FlexBetween = React.forwardRef<HTMLDivElement, FlexBetweenProps>(
  ({ direction = 'row', align = 'center', className, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={direction}
        justify="between"
        align={align}
        className={className}
        {...props}
      />
    )
  }
)

FlexBetween.displayName = 'FlexBetween'

// FlexEvenly - 均匀分布
export interface FlexEvenlyProps extends Omit<FlexProps, 'justify'> {
  direction?: FlexProps['direction']
  align?: FlexProps['align']
}

export const FlexEvenly = React.forwardRef<HTMLDivElement, FlexEvenlyProps>(
  ({ direction = 'row', align = 'center', className, ...props }, ref) => {
    return (
      <Flex
        ref={ref}
        direction={direction}
        justify="evenly"
        align={align}
        className={className}
        {...props}
      />
    )
  }
)

FlexEvenly.displayName = 'FlexEvenly'

// FlexSpacer - 弹性间距
export interface FlexSpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  flex?: number | string
}

export const FlexSpacer = React.forwardRef<HTMLDivElement, FlexSpacerProps>(
  ({ flex = 1, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("shrink-0", className)}
        style={{ flex: typeof flex === 'number' ? flex.toString() : flex }}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

FlexSpacer.displayName = 'FlexSpacer'

// =============================================================================
// 组件元数据
// =============================================================================

Flex.displayName = 'Flex'

// =============================================================================
// 导出
// =============================================================================

export { Flex, flexVariants }
export type { FlexProps }