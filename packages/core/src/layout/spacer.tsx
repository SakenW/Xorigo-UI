import React, { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cva, type VariantProps } from '../utils/cva-standalone'
import { cn } from '../utils/cn'

// Spacer组件变体配置
const spacerVariants = cva(
  // 基础样式
  'shrink-0 transition-all duration-200',
  {
    variants: {
      size: {
        // 内置尺寸
        0: 'w-0 h-0',
        1: 'w-1 h-1',
        2: 'w-2 h-2',
        3: 'w-3 h-3',
        4: 'w-4 h-4',
        5: 'w-5 h-5',
        6: 'w-6 h-6',
        8: 'w-8 h-8',
        10: 'w-10 h-10',
        12: 'w-12 h-12',
        16: 'w-16 h-16',
        20: 'w-20 h-20',
        24: 'w-24 h-24',
        32: 'w-32 h-32',
        40: 'w-40 h-40',
        48: 'w-48 h-48',
        56: 'w-56 h-56',
        64: 'w-64 h-64',
        // 语义化尺寸
        xs: 'w-2 h-2',
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
        '2xl': 'w-16 h-16',
        '3xl': 'w-20 h-20',
        '4xl': 'w-24 h-24',
        // 自适应尺寸
        auto: 'w-auto h-auto',
        full: 'w-full h-full',
        screen: 'w-screen h-screen',
        'screen-half': 'w-[50vw] h-[50vh]',
        'screen-third': 'w-[33.33vw] h-[33.33vh]',
        'screen-quarter': 'w-[25vw] h-[25vh]',
      },
      direction: {
        // 水平间距
        horizontal: 'w-auto h-0',
        // 垂直间距
        vertical: 'w-0 h-auto',
        // 双向间距
        both: 'w-auto h-auto',
        // 行内间距
        inline: 'inline-block w-auto h-0',
      },
      responsive: {
        true: '',
        false: '',
      },
      flexible: {
        true: 'flex-grow flex-shrink',
        false: '',
      },
      visible: {
        true: '',
        false: 'invisible',
      },
      backgroundColor: {
        transparent: '',
        light: 'bg-gray-100 dark:bg-gray-800',
        medium: 'bg-gray-200 dark:bg-gray-700',
        dark: 'bg-gray-300 dark:bg-gray-600',
        primary: 'bg-blue-100 dark:bg-blue-900',
        secondary: 'bg-purple-100 dark:bg-purple-900',
        success: 'bg-green-100 dark:bg-green-900',
        warning: 'bg-yellow-100 dark:bg-yellow-900',
        error: 'bg-red-100 dark:bg-red-900',
      },
    },
    defaultVariants: {
      size: 'md',
      direction: 'both',
      responsive: false,
      flexible: false,
      visible: false,
      backgroundColor: 'transparent',
    },
  }
)

// Spacer组件接口
export interface SpacerProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof spacerVariants> {
  /** 自定义宽度 */
  width?: string | number
  /** 自定义高度 */
  height?: string | number
  /** 最小宽度 */
  minWidth?: string | number
  /** 最小高度 */
  minHeight?: string | number
  /** 最大宽度 */
  maxWidth?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 是否为调试模式（显示边框） */
  debug?: boolean
  /** 响应式断点配置 */
  breakpoints?: {
    sm?: Partial<Pick<SpacerProps, 'size' | 'width' | 'height'>>
    md?: Partial<Pick<SpacerProps, 'size' | 'width' | 'height'>>
    lg?: Partial<Pick<SpacerProps, 'size' | 'width' | 'height'>>
    xl?: Partial<Pick<SpacerProps, 'size' | 'width' | 'height'>>
  }
}

// Spacer组件实现
const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  (
    {
      className,
      size,
      direction,
      responsive,
      flexible,
      visible,
      backgroundColor,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      debug = false,
      breakpoints,
      children,
      ...props
    },
    ref
  ) => {
    // 计算自定义样式
    const customStyle = React.useMemo(() => {
      const style: React.CSSProperties = {}

      // 处理自定义尺寸
      if (width !== undefined) {
        style.width = typeof width === 'number' ? `${width}px` : width
      }
      if (height !== undefined) {
        style.height = typeof height === 'number' ? `${height}px` : height
      }
      if (minWidth !== undefined) {
        style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
      }
      if (minHeight !== undefined) {
        style.minHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight
      }
      if (maxWidth !== undefined) {
        style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
      }
      if (maxHeight !== undefined) {
        style.maxHeight = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
      }

      // 处理方向性尺寸
      if (direction === 'horizontal' && !width) {
        style.width = '100%'
        style.height = '0'
      } else if (direction === 'vertical' && !height) {
        style.width = '0'
        style.height = '100%'
      }

      return style
    }, [width, height, minWidth, minHeight, maxWidth, maxHeight, direction])

    // 生成响应式类名
    const responsiveClasses = React.useMemo(() => {
      if (!responsive || !breakpoints) return ''

      const classes: string[] = []

      // 处理各个断点的配置
      Object.entries(breakpoints).forEach(([breakpoint, config]) => {
        if (!config) return

        // 尺寸配置
        if (config.size) {
          classes.push(`${breakpoint}:w-${config.size}`, `${breakpoint}:h-${config.size}`)
        }

        // 自定义宽度配置
        if (config.width) {
          const w = typeof config.width === 'number' ? `${config.width}px` : config.width
          classes.push(`${breakpoint}:[width:${w}]`)
        }

        // 自定义高度配置
        if (config.height) {
          const h = typeof config.height === 'number' ? `${config.height}px` : config.height
          classes.push(`${breakpoint}:[height:${h}]`)
        }
      })

      return classes.join(' ')
    }, [responsive, breakpoints])

    // 调试模式类名
    const debugClasses = debug ? 'border border-dashed border-red-500 bg-red-50 dark:bg-red-900/20' : ''

    // 动画变体
    const motionVariants = {
      initial: {
        opacity: 0,
        scale: 0.8,
      },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.2,
          ease: [0.04, 0.62, 0.23, 0.98] as const
        }
      },
      exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.15 }
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          spacerVariants({
            size: width || height ? undefined : size,
            direction: width || height ? 'both' : direction,
            responsive: undefined, // 单独处理
            flexible,
            visible: visible || debug,
            backgroundColor: debug ? 'light' : backgroundColor,
          }),
          responsiveClasses,
          debugClasses,
          className
        )}
        style={customStyle}
        variants={motionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        aria-hidden="true"
        role="separator"
        {...props}
      >
        {/* 调试信息 */}
        {debug && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-red-600 dark:text-red-400 font-mono opacity-75">
            <span className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">
              {size || 'custom'}
            </span>
          </div>
        )}

        {children}
      </motion.div>
    )
  }
)

Spacer.displayName = 'Spacer'

export { Spacer, spacerVariants }