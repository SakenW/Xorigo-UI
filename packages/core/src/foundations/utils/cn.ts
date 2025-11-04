import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 工具函数: 合并和优化Tailwind CSS类名
 * 结合clsx和tailwind-merge的功能
 * 支持七轴主题系统的条件类名
 *
 * @param inputs - 类名输入(字符串、对象、数组等)
 * @returns 合并后的优化类名字符串
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (后面的px-4覆盖px-2)
 * cn('text-red-500', condition && 'text-blue-500') // 条件类名
 * cn('bg-primary-500', theme === 'dark' && 'bg-primary-400') // 主题条件
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * 创建主题感知的类名函数
 */
export function createThemeCn(themeClasses: Record<string, string>) {
  return function(theme: string, ...inputs: ClassValue[]): string {
    const themeClass = themeClasses[theme] || ''
    return cn(themeClass, ...inputs)
  }
}

/**
 * 创建条件类名函数
 */
export function createConditionalCn(conditions: Record<string, boolean>) {
  const conditionalClasses = Object.entries(conditions)
    .filter(([, condition]) => condition)
    .map(([className]) => className)

  return function(...inputs: ClassValue[]): string {
    return cn(...conditionalClasses, ...inputs)
  }
}

/**
 * 创建变体类名函数
 */
export function createVariantCn<V extends Record<string, string>>(
  variants: V,
  defaultVariant?: keyof V
) {
  return function(variant: keyof V | undefined = defaultVariant, ...inputs: ClassValue[]): string {
    const variantClass = variant ? variants[variant] : ''
    return cn(variantClass, ...inputs)
  }
}