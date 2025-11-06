'use client'
import React, { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from '../../utils/cva-standalone'
import { useTheme } from '@xorigo-ui/system'
import { cn } from '../../utils/cn'
import { Avatar } from '../avatar'
import type { AvatarProps } from '../avatar'

// 测试Props生成工具
const generateTestProps = (component: string, options: {
  layout?: string
  max?: number
  total?: number
  testId?: string
}) => {
  const { layout, max, total, testId } = options
  const testIdValue = testId || `avatar-group-${layout || 'horizontal'}-${max || 5}-${total || 0}`
  return {
    'data-testid': testIdValue,
    'data-component': component,
    'data-layout': layout,
    'data-max': max,
    'data-total': total,
  }
}

// Avatar Group 变体配置
const avatarGroupVariants = cva(
  'flex',
  {
    variants: {
      layout: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
        grid: 'flex-row flex-wrap',
      },
      spacing: {
        tight: 'gap-0',
        normal: 'gap-1',
        loose: 'gap-2',
      },
      overlap: {
        none: '',
        stack: '',
        spread: 'gap-1',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      spacing: 'normal',
      overlap: 'stack',
    },
  }
)

// 溢出头像变体配置
const overflowVariants = cva(
  'relative inline-flex items-center justify-center font-medium rounded-full cursor-pointer transition-all duration-200',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-sm',
        xl: 'w-16 h-16 text-base',
        '2xl': 'w-20 h-20 text-lg',
      },
      shape: {
        circle: 'rounded-full',
        rounded: 'rounded-lg',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
    },
  }
)

// Avatar Group 组件接口
export interface AvatarGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarGroupVariants> {
  /** 头像元素数组 */
  children: React.ReactNode
  /** 最大显示数量（默认5） */
  max?: number
  /** Avatar组件尺寸 */
  size?: AvatarProps['size']
  /** Avatar组件形状 */
  shape?: AvatarProps['shape']
  /** 溢出时显示的工具提示 */
  overflowTooltip?: string | ((count: number) => string)
  /** 溢出头像的可点击事件 */
  onOverflowClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  /** 是否显示加载状态 */
  loading?: boolean
  /** 自定义溢出内容 */
  overflowContent?: React.ReactNode
  /** 响应式配置（移动端最大显示数） */
  maxItemsSm?: number
  /** 测试ID */
  testId?: string
  /** 动画配置 */
  animate?: boolean
  /** 工具提示显示延迟（毫秒） */
  tooltipDelay?: number
  /** 工具提示位置 */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Avatar Group 头像组组件
 *
 * 用于显示多个头像的组合，支持多种排列方式、溢出折叠、工具提示等功能。
 * 基于七轴主题系统设计，确保在不同主题下的一致性。
 *
 * @example
 * ```tsx
 * <AvatarGroup max={5}>
 *   <Avatar name="John Doe" />
 *   <Avatar name="Jane Smith" />
 *   <Avatar name="Bob Johnson" />
 * </AvatarGroup>
 * ```
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      children,
      max = 5,
      size = 'md',
      shape = 'circle',
      layout = 'horizontal',
      spacing = 'normal',
      overlap = 'stack',
      overflowTooltip = (count) => `还有 ${count} 个成员`,
      onOverflowClick,
      loading = false,
      overflowContent,
      maxItemsSm,
      testId,
      animate = true,
      tooltipDelay = 300,
      tooltipPosition = 'top',
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const { themeConfig } = useTheme()

    // 处理子元素
    const childrenArray = React.Children.toArray(children) as React.ReactNode[]

    // 响应式最大显示数
    const currentMax = typeof window !== 'undefined' && window.innerWidth < 640 && maxItemsSm
      ? maxItemsSm
      : max

    // 计算显示的头像和溢出数量
    const displayedAvatars = childrenArray.slice(0, currentMax)
    const remainingCount = Math.max(0, childrenArray.length - currentMax)

    // 计算偏移量（用于堆叠效果）
    const getOffset = (index: number, total: number) => {
      if (overlap === 'none') return 0
      if (overlap === 'spread') return 0
      return -index * (layout === 'horizontal' ? 8 : 8)
    }

    // 获取溢出头像内容
    const getOverflowContent = (count: number) => {
      if (overflowContent) return overflowContent
      return `+${count}`
    }

    // 获取工具提示文本
    const getTooltipText = (count: number) => {
      if (typeof overflowTooltip === 'function') {
        return overflowTooltip(count)
      }
      return overflowTooltip
    }

    // 工具提示属性
    const getTooltipProps = (index: number) => {
      if (index < 0) {
        return {
          'data-tooltip': getTooltipText(remainingCount),
          'data-position': tooltipPosition,
          'data-delay': tooltipDelay,
        }
      }

      const child = displayedAvatars[index] as React.ReactElement
      const childName = child?.props?.name || '成员'
      return {
        'data-tooltip': childName,
        'data-position': tooltipPosition,
        'data-delay': tooltipDelay,
      }
    }

    // 生成测试Props
    const testProps = generateTestProps('avatar-group', {
      layout,
      max: currentMax,
      total: childrenArray.length,
      testId,
    })

    // 动画配置
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    }

    const itemVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          avatarGroupVariants({ layout, spacing, overlap }),
          className
        )}
        initial={animate ? 'hidden' : undefined}
        animate={animate ? 'visible' : undefined}
        variants={animate ? containerVariants : undefined}
        {...testProps}
        {...props}
      >
        <AnimatePresence mode="popLayout">
          {loading ? (
            // 加载状态
            <motion.div
              className={cn(
                'flex items-center',
                layout === 'horizontal' ? 'flex-row' : 'flex-col'
              )}
              variants={animate ? itemVariants : undefined}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {Array.from({ length: Math.min(currentMax, 3) }).map((_, i) => (
                <div
                  key={`loading-${i}`}
                  className={cn(
                    'bg-[var(--bg-secondary)] animate-pulse rounded-full',
                    size === 'xs' && 'w-6 h-6',
                    size === 'sm' && 'w-8 h-8',
                    size === 'md' && 'w-10 h-10',
                    size === 'lg' && 'w-12 h-12',
                    size === 'xl' && 'w-16 h-16',
                    size === '2xl' && 'w-20 h-20',
                    overlap !== 'none' && i > 0 && (
                      layout === 'horizontal' ? '-ml-2' : '-mt-2'
                    )
                  )}
                  style={{ zIndex: -i }}
                  {...getTooltipProps(-1)}
                />
              ))}
            </motion.div>
          ) : (
            // 正常显示模式
            <>
              {displayedAvatars.map((child, index) => {
                const offset = getOffset(index, displayedAvatars.length)
                const isHovered = hoveredIndex === index

                return (
                  <motion.div
                    key={`avatar-${index}`}
                    className={cn(
                      'relative transition-transform duration-200',
                      isHovered ? 'scale-105' : 'scale-100',
                      overlap !== 'none' && index > 0 && (
                        layout === 'horizontal' ? '-ml-2' : '-mt-2'
                      )
                    )}
                    style={{
                      zIndex: childrenArray.length - index,
                    }}
                    variants={animate ? itemVariants : undefined}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    {...getTooltipProps(index)}
                  >
                    {React.isValidElement(child) ? (
                      React.cloneElement(child, {
                        size,
                        shape,
                      } as Partial<AvatarProps>)
                    ) : (
                      child
                    )}
                  </motion.div>
                )
              })}

              {/* 溢出头像 */}
              {remainingCount > 0 && (
                <motion.div
                  className={cn(
                    overflowVariants({ size, shape }),
                    'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
                    'ring-2 ring-[var(--bg-primary)]',
                    'hover:bg-[var(--bg-tertiary)] hover:scale-105',
                    'active:scale-95',
                    'shadow-sm'
                  )}
                  style={{
                    zIndex: 0,
                  }}
                  variants={animate ? itemVariants : undefined}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  onClick={onOverflowClick}
                  {...getTooltipProps(-1)}
                >
                  {getOverflowContent(remainingCount)}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

AvatarGroup.displayName = 'AvatarGroup'

// 导出变体类型
export { avatarGroupVariants, overflowVariants }
export type AvatarGroupVariants = VariantProps<typeof avatarGroupVariants>
export type OverflowVariants = VariantProps<typeof overflowVariants>
