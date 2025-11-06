/**
 * @fileoverview withVariant HOC - 变体管理高阶组件
 * @description 为组件提供变体系统支持，支持多种变体切换和组合
 */

import React, { forwardRef, useMemo } from 'react'
import { HOC, ComponentType, Variant } from '../types'

/**
 * 变体配置接口
 */
export interface VariantConfig {
  defaultVariant?: Variant
  variants?: Record<string, Record<string, any>>
  customVariants?: Record<string, any>
  allowCustomVariant?: boolean
}

/**
 * 变体上下文接口
 */
export interface VariantContextValue {
  currentVariant: Variant
  setVariant: (variant: Variant) => void
  isVariant: (variant: string) => boolean
  getVariantStyles: () => Record<string, any>
  variants: Record<string, Record<string, any>>
}

/**
 * 默认变体样式
 */
const DEFAULT_VARIANTS: Record<Variant, Record<string, any>> = {
  primary: {
    className: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    backgroundColor: '#2563eb',
    color: '#ffffff',
  },
  secondary: {
    className: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    backgroundColor: '#4b5563',
    color: '#ffffff',
  },
  tertiary: {
    className: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    backgroundColor: '#9333ea',
    color: '#ffffff',
  },
  outline: {
    className: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    backgroundColor: 'transparent',
    color: '#2563eb',
    borderColor: '#2563eb',
  },
  ghost: {
    className: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    backgroundColor: 'transparent',
    color: '#2563eb',
  },
  link: {
    className: 'text-blue-600 underline hover:no-underline focus:ring-blue-500',
    backgroundColor: 'transparent',
    color: '#2563eb',
    textDecoration: 'underline',
  },
}

/**
 * withVariant HOC - 为组件注入变体支持
 *
 * @param config 变体配置选项
 * @returns 高阶组件函数
 *
 * @example
 * ```tsx
 * const VariantButton = withVariant({
 *   defaultVariant: 'primary',
 *   variants: {
 *     custom: {
 *       className: 'bg-gradient-to-r from-pink-500 to-rose-500'
 *     }
 *   }
 * })(BaseButton)
 * ```
 */
export function withVariant<T extends Record<string, any> = {}>(
  config: VariantConfig = {}
): HOC<T, T & VariantContextValue> {
  return function(Component: ComponentType<T>) {
    const {
      defaultVariant = 'primary',
      variants = {},
      customVariants = {},
      allowCustomVariant = true,
    } = config

    const displayName = config.displayName || `withVariant(${Component.displayName || Component.name || 'Component'})`

    const VariantComponent = forwardRef<any, T & VariantContextValue>((props, ref) => {
      const {
        variant: propVariant,
        variants: customVariantsProp,
        ...componentProps
      } = props

      // 合并变体配置
      const allVariants = useMemo(() => {
        const merged: Record<string, Record<string, any>> = {}

        // 合并默认变体
        Object.entries(DEFAULT_VARIANTS).forEach(([key, value]) => {
          merged[key] = { ...value }
        })

        // 合并配置变体
        Object.entries(variants).forEach(([key, value]) => {
          merged[key] = { ...merged[key], ...value }
        })

        // 合并自定义变体
        Object.entries(customVariants).forEach(([key, value]) => {
          merged[key] = { ...merged[key], ...value }
        })

        // 合并props传入的变体
        if (customVariantsProp) {
          Object.entries(customVariantsProp).forEach(([key, value]) => {
            merged[key] = { ...merged[key], ...value }
          })
        }

        return merged
      }, [variants, customVariants, customVariantsProp])

      // 当前变体
      const currentVariant = useMemo<Variant>(() => {
        const variant = (propVariant as Variant) || defaultVariant

        // 检查是否为自定义变体
        if (!allVariants[variant] && allowCustomVariant) {
          // 创建自定义变体样式
          return variant as Variant
        }

        return allVariants[variant] ? variant : defaultVariant
      }, [propVariant, defaultVariant, allVariants, allowCustomVariant])

      // 变体上下文
      const variantContext = useMemo<VariantContextValue>(() => {
        const currentVariantStyles = allVariants[currentVariant] || {}

        return {
          currentVariant,
          setVariant: (variant: Variant) => {
            // 实际实现中可以通过状态管理更新变体
            console.log('Set variant to:', variant)
          },
          isVariant: (variant: string) => variant === currentVariant,
          getVariantStyles: () => currentVariantStyles,
          variants: allVariants,
        }
      }, [currentVariant, allVariants])

      // 传递给组件的增强props
      const enhancedProps = {
        ...componentProps,
        variant: currentVariant,
        ...variantContext,
      }

      return <Component ref={ref} {...enhancedProps} />
    })

    VariantComponent.displayName = displayName

    return VariantComponent
  }
}

// 便捷导出 - 无配置版本
export const WithVariant = withVariant()

// 预设变体
export const withPrimaryVariant = withVariant({ defaultVariant: 'primary' })
export const withSecondaryVariant = withVariant({ defaultVariant: 'secondary' })
export const withOutlineVariant = withVariant({ defaultVariant: 'outline' })
export const withGhostVariant = withVariant({ defaultVariant: 'ghost' })
export const withLinkVariant = withVariant({ defaultVariant: 'link' })

export default withVariant
