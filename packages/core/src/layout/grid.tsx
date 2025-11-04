import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

// Grid组件变体配置
const gridVariants = cva(
  // 基础样式
  'grid transition-all duration-200',
  {
    variants: {
      variant: {
        // 默认网格
        default: '',
        // 自适应列宽
        'auto-fit': 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
        'auto-fill': 'grid-cols-[repeat(auto-fill,minmax(280px,1fr))]',
        // 瀑布流布局
        masonry: 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 space-y-4',
        // 约束网格
        constrained: 'grid-cols-[repeat(auto-fit,minmax(200px,400px))]',
        // 紧凑网格
        compact: 'grid-cols-[repeat(auto-fit,minmax(180px,1fr))]',
      },
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
        11: 'grid-cols-11',
        12: 'grid-cols-12',
        none: 'grid-cols-none',
        subgrid: 'grid-cols-subgrid',
      },
      rows: {
        1: 'grid-rows-1',
        2: 'grid-rows-2',
        3: 'grid-rows-3',
        4: 'grid-rows-4',
        5: 'grid-rows-5',
        6: 'grid-rows-6',
        none: 'grid-rows-none',
        subgrid: 'grid-rows-subgrid',
        auto: 'grid-rows-[auto]',
      },
      gap: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
        16: 'gap-16',
        20: 'gap-20',
      },
      gapX: {
        0: 'gap-x-0',
        1: 'gap-x-1',
        2: 'gap-x-2',
        3: 'gap-x-3',
        4: 'gap-x-4',
        5: 'gap-x-5',
        6: 'gap-x-6',
        8: 'gap-x-8',
        10: 'gap-x-10',
        12: 'gap-x-12',
        16: 'gap-x-16',
      },
      gapY: {
        0: 'gap-y-0',
        1: 'gap-y-1',
        2: 'gap-y-2',
        3: 'gap-y-3',
        4: 'gap-y-4',
        5: 'gap-y-5',
        6: 'gap-y-6',
        8: 'gap-y-8',
        10: 'gap-y-10',
        12: 'gap-y-12',
        16: 'gap-y-16',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      responsive: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      cols: 1,
      gap: 4,
      align: 'stretch',
      justify: 'start',
      responsive: true,
    },
  }
)

// Grid组件接口
export interface GridProps
  extends Omit<HTMLMotionProps<'div'>, 'variant'>,
    VariantProps<typeof gridVariants> {
  /** 自定义最小列宽 */
  minColumnWidth?: string
  /** 自定义最大列宽 */
  maxColumnWidth?: string
  /** 自定义最小行高 */
  minRowHeight?: string
  /** 网格流方向 */
  flow?: 'row' | 'column' | 'row dense' | 'column dense'
  /** 自动列数 */
  autoCols?: 'auto' | 'minmax' | 'max-content' | 'min-content'
  /** 自动行数 */
  autoRows?: 'auto' | 'minmax' | 'max-content' | 'min-content'
}

// Grid组件实现
const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      variant,
      cols,
      rows,
      gap,
      gapX,
      gapY,
      align,
      justify,
      responsive,
      minColumnWidth = '280px',
      maxColumnWidth,
      minRowHeight,
      flow,
      autoCols,
      autoRows,
      children,
      ...props
    },
    ref
  ) => {
    // 生成响应式类名
    const responsiveClasses = React.useMemo(() => {
      if (!responsive) return ''

      const classes: string[] = []

      // 响应式列数类名
      if (variant === 'default' && typeof cols === 'number') {
        classes.push(
          'grid-cols-1',
          `sm:grid-cols-${Math.min(cols, 2)}`,
          `md:grid-cols-${Math.min(cols, 3)}`,
          `lg:grid-cols-${Math.min(cols, 4)}`,
          `xl:grid-cols-${cols}`
        )
      }

      // 响应式间距类名
      if (gap && typeof gap === 'number') {
        classes.push(
          `gap-${Math.min(gap, 2)}`,
          `sm:gap-${Math.min(gap, 4)}`,
          `md:gap-${gap}`,
          `lg:gap-${Math.min(gap + 2, 8)}`
        )
      }

      return classes.join(' ')
    }, [responsive, variant, cols, gap])

    // 处理自定义auto-fit/fill网格样式
    const customGridStyle = React.useMemo(() => {
      const styles: React.CSSProperties = {}

      // 处理auto-fit/auto-fill模式
      if (variant === 'auto-fit' || variant === 'auto-fill') {
        const minW = minColumnWidth || '280px'
        const maxW = maxColumnWidth || '1fr'
        styles.gridTemplateColumns = `repeat(${variant === 'auto-fit' ? 'auto-fit' : 'auto-fill'}, minmax(${minW}, ${maxW}))`
      }

      // 处理自定义行高
      if (minRowHeight) {
        styles.gridAutoRows = `minmax(${minRowHeight}, auto)`
      }

      // 处理网格流方向
      if (flow) {
        styles.gridAutoFlow = flow
      }

      // 处理自动列
      if (autoCols) {
        styles.gridAutoColumns = autoCols
      }

      // 处理自动行
      if (autoRows) {
        styles.gridAutoRows = autoRows
      }

      return styles
    }, [variant, minColumnWidth, maxColumnWidth, minRowHeight, flow, autoCols, autoRows])

    // 动画变体
    const motionVariants = {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          staggerChildren: 0.1,
        }
      },
      exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 }
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          gridVariants({
            variant,
            cols: variant === 'default' ? cols : undefined,
            rows,
            gap,
            gapX,
            gapY,
            align,
            justify,
            responsive: undefined // 单独处理
          }),
          responsiveClasses,
          className
        )}
        style={customGridStyle}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Grid.displayName = 'Grid'

export { Grid, gridVariants }