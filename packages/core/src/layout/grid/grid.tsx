/**
 * Grid 网格布局组件 - 符合七轴主题系统 v1.4 SSOT
 *
 * 布局组件 - 强大的CSS Grid布局控制
 */

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../foundations/utils/cn'
import { useTheme } from '../../system/theme-provider'

// =============================================================================
// 组件变体系统 - CVA (Class Variance Authority)
// =============================================================================

const gridVariants = cva(
  // 基础样式 - 使用七轴主题系统的密度令牌
  "grid",
  {
    variants: {
      // 列数定义
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        7: "grid-cols-7",
        8: "grid-cols-8",
        9: "grid-cols-9",
        10: "grid-cols-10",
        11: "grid-cols-11",
        12: "grid-cols-12",
        none: "grid-cols-none",
        auto: "grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
        'auto-min': "grid-cols-[repeat(auto-fit,minmax(min-content,1fr))]",
        'auto-max': "grid-cols-[repeat(auto-fit,minmax(max-content,1fr))]",
      },

      // 响应式列数
      responsiveCols: {
        '1-sm': "grid-cols-1 sm:grid-cols-1",
        '1-md': "grid-cols-1 md:grid-cols-1",
        '1-lg': "grid-cols-1 lg:grid-cols-1",
        '2-sm': "grid-cols-1 sm:grid-cols-2",
        '2-md': "grid-cols-1 md:grid-cols-2",
        '2-lg': "grid-cols-1 lg:grid-cols-2",
        '3-sm': "grid-cols-1 sm:grid-cols-3",
        '3-md': "grid-cols-1 md:grid-cols-3",
        '3-lg': "grid-cols-1 lg:grid-cols-3",
        '4-sm': "grid-cols-1 sm:grid-cols-4",
        '4-md': "grid-cols-1 md:grid-cols-4",
        '4-lg': "grid-cols-1 lg:grid-cols-4",
        'auto-sm': "grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
        'auto-md': "grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
        'auto-lg': "grid-cols-1 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]",
      },

      // 行数定义
      rows: {
        1: "grid-rows-1",
        2: "grid-rows-2",
        3: "grid-rows-3",
        4: "grid-rows-4",
        5: "grid-rows-5",
        6: "grid-rows-6",
        none: "grid-rows-none",
        auto: "grid-rows-[repeat(auto-fit,minmax(0,1fr))]",
      },

      // 流动方向
      flow: {
        row: "grid-flow-row",
        col: "grid-flow-col",
        'row-dense': "grid-flow-row-dense",
        'col-dense': "grid-flow-col-dense",
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

      // 统一间距
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

      // 对齐内容（垂直）
      alignContent: {
        start: "content-start",
        end: "content-end",
        center: "content-center",
        between: "content-between",
        around: "content-around",
        evenly: "content-evenly",
        stretch: "content-stretch",
      },

      // 对齐项目（垂直）
      align: {
        start: "items-start",
        end: "items-end",
        center: "items-center",
        baseline: "items-baseline",
        stretch: "items-stretch",
      },

      // 对齐项目（水平）
        justify: {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        stretch: "justify-stretch",
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
        screen: "min-w-screen",
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

      // 内边距
      p: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
        '2xl': "p-10",
        '3xl': "p-12",
        '4xl': "p-16",
      },

      // 自动填充模式
      autoFit: {
        true: "grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]",
        false: "",
      },

      // 自动填充模式（指定最小宽度）
      autoFitMin: {
        '200px': "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]",
        '250px': "grid-cols-[repeat(auto-fit,minmax(250px,1fr))]",
        '300px': "grid-cols-[repeat(auto-fit,minmax(300px,1fr))]",
        '350px': "grid-cols-[repeat(auto-fit,minmax(350px,1fr))]",
        '400px': "grid-cols-[repeat(auto-fit,minmax(400px,1fr))]",
        '500px': "grid-cols-[repeat(auto-fit,minmax(500px,1fr))]",
      },
    },

    // 默认变体
    defaultVariants: {
      cols: 'auto',
      rows: 'none',
      flow: 'row',
      gapX: 'none',
      gapY: 'none',
      gap: 'md',
      alignContent: 'stretch',
      align: 'stretch',
      justify: 'stretch',
      width: 'auto',
      height: 'auto',
      minWidth: 'none',
      minHeight: 'none',
      maxWidth: 'none',
      maxHeight: 'none',
      p: 'none',
      autoFit: false,
      autoFitMin: undefined,
    },
  }
)

// =============================================================================
// 组件 Props 接口 - 符合组件 API 标准
// =============================================================================

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义网格模板列
   */
  gridTemplateColumns?: string

  /**
   * 自定义网格模板行
   */
  gridTemplateRows?: string

  /**
   * 自定义网格区域
   */
  gridTemplateAreas?: string

  /**
   * 自定义间距
   */
  gap?: string

  /**
   * 自定义列间距
   */
  columnGap?: string

  /**
   * 自定义行间距
   */
  rowGap?: string

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
// Grid 主组件实现
// =============================================================================

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      cols,
      responsiveCols,
      rows,
      flow,
      gapX,
      gapY,
      gap,
      alignContent,
      align,
      justify,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      p,
      autoFit,
      autoFitMin,
      gridTemplateColumns,
      gridTemplateRows,
      gridTemplateAreas,
      columnGap,
      rowGap,
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
      // 自定义网格模板
      ...(gridTemplateColumns && { gridTemplateColumns }),
      ...(gridTemplateRows && { gridTemplateRows }),
      ...(gridTemplateAreas && { gridTemplateAreas }),

      // 自定义间距
      ...(gap && { gap }),
      ...(columnGap && { columnGap }),
      ...(rowGap && { rowGap }),

      // 主题变量（用于动态调整）
      '--grid-gap-color': `hsl(${theme.colors.border.primary})`,
      // 可根据七轴动态调整
    }

    return (
      <div
        ref={ref}
        className={cn(
          inline ? 'inline-grid' : 'grid',
          gridVariants({
            cols,
            responsiveCols,
            rows,
            flow,
            gapX,
            gapY,
            gap,
            alignContent,
            align,
            justify,
            width,
            height,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            p,
            autoFit,
            autoFitMin,
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
// 专用 Grid 组件
// =============================================================================

// GridItem - 网格项目
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 网格列位置
   */
  colSpan?: number | string

  /**
   * 网格行位置
   */
  rowSpan?: number | string

  /**
   * 网格列起始位置
   */
  colStart?: number | string

  /**
   * 网格列结束位置
   */
  colEnd?: number | string

  /**
   * 网格行起始位置
   */
  rowStart?: number | string

  /**
   * 网格行结束位置
   */
  rowEnd?: number | string

  /**
   * 网格区域名称
   */
  gridArea?: string

  /**
   * 子元素内容
   */
  children?: React.ReactNode

  /**
   * 自定义样式类名
   */
  className?: string
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({
    colSpan,
    rowSpan,
    colStart,
    colEnd,
    rowStart,
    rowEnd,
    gridArea,
    className,
    children,
    ...props
  }, ref) => {
    // 生成网格位置样式
    const gridStyles: React.CSSProperties = {
      // 列跨度
      ...(colSpan !== undefined && {
        gridColumn: typeof colSpan === 'string' ? colSpan : `span ${colSpan}`,
      }),

      // 行跨度
      ...(rowSpan !== undefined && {
        gridRow: typeof rowSpan === 'string' ? rowSpan : `span ${rowSpan}`,
      }),

      // 列位置
      ...(colStart !== undefined && { gridColumnStart: colStart }),
      ...(colEnd !== undefined && { gridColumnEnd: colEnd }),

      // 行位置
      ...(rowStart !== undefined && { gridRowStart: rowStart }),
      ...(rowEnd !== undefined && { gridRowEnd: rowEnd }),

      // 网格区域
      ...(gridArea && { gridArea }),
    }

    return (
      <div
        ref={ref}
        className={className}
        style={gridStyles}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GridItem.displayName = 'GridItem'

// SimpleGrid - 简化网格布局
export interface SimpleGridProps extends Omit<GridProps, 'cols' | 'responsiveCols' | 'autoFit' | 'autoFitMin'> {
  /**
   * 列数
   */
  cols?: number

  /**
   * 最小列宽
   */
  minColWidth?: number | string

  /**
   * 是否自动适应
   */
  autoFit?: boolean
}

export const SimpleGrid = React.forwardRef<HTMLDivElement, SimpleGridProps>(
  ({
    cols = 1,
    minColWidth = 250,
    autoFit = true,
    gap = 'md',
    className,
    ...props
  }, ref) => {
    // 生成网格模板列
    const gridTemplateColumns = React.useMemo(() => {
      if (!autoFit) {
        return `repeat(${cols}, minmax(0, 1fr))`
      }

      return `repeat(auto-fit, minmax(${typeof minColWidth === 'number' ? `${minColWidth}px` : minColWidth}, 1fr))`
    }, [cols, minColWidth, autoFit])

    return (
      <Grid
        ref={ref}
        gap={gap}
        gridTemplateColumns={gridTemplateColumns}
        className={className}
        {...props}
      />
    )
  }
)

SimpleGrid.displayName = 'SimpleGrid'

// AspectRatioGrid - 等比例网格
export interface AspectRatioGridProps extends Omit<GridProps, 'cols' | 'gap'> {
  /**
   * 列数
   */
  cols?: number

  /**
   * 宽高比
   */
  aspectRatio?: string

  /**
   * 间距
   */
  gap?: GridProps['gap']
}

export const AspectRatioGrid = React.forwardRef<HTMLDivElement, AspectRatioGridProps>(
  ({
    cols = 3,
    aspectRatio = '1/1',
    gap = 'md',
    className,
    children,
    ...props
  }, ref) => {
    return (
      <Grid
        ref={ref}
        cols={cols}
        gap={gap}
        className={className}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <GridItem key={index}>
            <div
              style={{
                aspectRatio,
                overflow: 'hidden',
              }}
            >
              {child}
            </div>
          </GridItem>
        ))}
      </Grid>
    )
  }
)

AspectRatioGrid.displayName = 'AspectRatioGrid'

// =============================================================================
// 组件元数据
// =============================================================================

Grid.displayName = 'Grid'

// =============================================================================
// 导出
// =============================================================================

export { Grid, gridVariants }
export type { GridProps }