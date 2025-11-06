/**
 * @fileoverview withSize HOC - 尺寸控制高阶组件
 * @description 为组件提供尺寸系统支持，支持多种尺寸和响应式尺寸控制
 */

import React, { forwardRef, useMemo } from 'react'
import { HOC, ComponentType, Size } from '../types'

/**
 * 尺寸配置接口
 */
export interface SizeConfig {
  defaultSize?: Size
  sizes?: Record<Size, Record<string, any>>
  responsiveSizes?: Partial<Record<Size, Partial<Record<Size, any>>>>
  allowCustomSize?: boolean
}

/**
 * 尺寸上下文接口
 */
export interface SizeContextValue {
  currentSize: Size
  setSize: (size: Size) => void
  isSize: (size: Size) => boolean
  getSizeStyles: () => Record<string, any>
  sizes: Record<Size, Record<string, any>>
}

/**
 * 默认尺寸配置
 */
const DEFAULT_SIZES: Record<Size, Record<string, any>> = {
  xs: {
    className: 'text-xs px-2 py-1',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    height: '24px',
    minHeight: '24px',
  },
  sm: {
    className: 'text-sm px-3 py-1.5',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    height: '32px',
    minHeight: '32px',
  },
  md: {
    className: 'text-base px-4 py-2',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    height: '40px',
    minHeight: '40px',
  },
  lg: {
    className: 'text-lg px-6 py-2.5',
    padding: '0.625rem 1.5rem',
    fontSize: '1.125rem',
    height: '48px',
    minHeight: '48px',
  },
  xl: {
    className: 'text-xl px-8 py-3',
    padding: '0.75rem 2rem',
    fontSize: '1.25rem',
    height: '56px',
    minHeight: '56px',
  },
  '2xl': {
    className: 'text-2xl px-10 py-4',
    padding: '1rem 2.5rem',
    fontSize: '1.5rem',
    height: '64px',
    minHeight: '64px',
  },
}

/**
 * withSize HOC - 为组件注入尺寸支持
 *
 * @param config 尺寸配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const SizedButton = withSize({
 *   defaultSize: 'md',
 *   sizes: {
 *     custom: {
 *       width: '200px',
 *       height: '100px'
 *     }
 *   }
 * })(BaseButton)
 * ```
 */
export function withSize<T extends Record<string, any> = {}>(
  config: SizeConfig = {}
): HOC<T, T & SizeContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      defaultSize = 'md',
      sizes = {},
      responsiveSizes = {},
      allowCustomSize = true,
    } = config

    const displayName = config.displayName || `withSize(${Component.displayName || Component.name || 'Component'})`

    const SizeComponent = forwardRef<any, T & SizeContextValue>((props, ref) => {
      const {
        size: propSize,
        sizes: customSizes,
        ...componentProps
      } = props

      // 合并尺寸配置
      const allSizes = useMemo(() => {
        const merged: Record<Size, Record<string, any>> = {}

        // 合并默认尺寸
        Object.entries(DEFAULT_SIZES).forEach(([key, value]) => {
          merged[key as Size] = { ...value }
        })

        // 合并配置尺寸
        Object.entries(sizes).forEach(([key, value]) => {
          merged[key as Size] = { ...merged[key as Size], ...value }
        })

        // 合并props传入的尺寸
        if (customSizes) {
          Object.entries(customSizes).forEach(([key, value]) => {
            merged[key as Size] = { ...merged[key as Size], ...value }
          })
        }

        return merged
      }, [sizes, customSizes])

      // 当前尺寸
      const currentSize = useMemo<Size>(() => {
        const size = (propSize as Size) || defaultSize

        // 检查是否为自定义尺寸
        if (!allSizes[size] && allowCustomSize) {
          // 创建自定义尺寸样式
          return size as Size
        }

        return allSizes[size] ? size : defaultSize
      }, [propSize, defaultSize, allSizes, allowCustomSize])

      // 响应式尺寸处理
      const responsiveStyles = useMemo(() => {
        const breakpointSizes = responsiveSizes[defaultSize] || {}
        return breakpointSizes[currentSize] || {}
      }, [responsiveSizes, defaultSize, currentSize])

      // 尺寸上下文
      const sizeContext = useMemo<SizeContextValue>(() => {
        const currentSizeStyles = allSizes[currentSize] || {}
        const mergedStyles = {
          ...currentSizeStyles,
          ...responsiveStyles,
        }

        return {
          currentSize,
          setSize: (size: Size) => {
            // 实际实现中可以通过状态管理更新尺寸
            console.log('Set size to:', size)
          },
          isSize: (size: Size) => size === currentSize,
          getSizeStyles: () => mergedStyles,
          sizes: allSizes,
        }
      }, [currentSize, allSizes, responsiveStyles])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        size: currentSize,
        ...sizeContext,
      }

      return <Component ref={ref} {...enhancedProps} />
    })

    SizeComponent.displayName = displayName

    return SizeComponent
  }
}

// 便捷导出 - 无配置版本
export const WithSize = withSize()

// 预设尺寸
export const withExtraSmallSize = withSize({ defaultSize: 'xs' })
export const withSmallSize = withSize({ defaultSize: 'sm' })
export const withMediumSize = withSize({ defaultSize: 'md' })
export const withLargeSize = withSize({ defaultSize: 'lg' })
export const withExtraLargeSize = withSize({ defaultSize: 'xl' })

export default withSize
