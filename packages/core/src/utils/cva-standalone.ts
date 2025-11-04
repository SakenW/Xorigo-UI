/**
 * 独立的 CVA 替代实现
 * 临时解决方案，用于替代 class-variance-authority
 */

import { cn } from './cn'

/**
 * 简化的变体函数，替代 class-variance-authority
 */
export function cva(baseClass: string, config?: {
  variants?: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
}) {
  return (props: Record<string, any> = {}) => {
    if (!config?.variants) return baseClass

    const classes = [baseClass]

    // 处理变体
    Object.entries(config.variants).forEach(([variantName, variantOptions]) => {
      const variantValue = props[variantName] || config.defaultVariants?.[variantName]
      if (variantValue && variantOptions[variantValue]) {
        classes.push(variantOptions[variantValue])
      }
    })

    return cn(...classes)
  }
}

/**
 * 变体属性类型
 */
export type VariantProps<T> = T extends (...args: any) => any
  ? Parameters<T>[0]
  : never