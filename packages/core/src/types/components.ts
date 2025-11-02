/**
 * Component Types - 组件类型定义
 *
 * 临时文件，避免导入错误
 * TODO: 实现真正的组件类型定义
 */

export interface ComponentVariants {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export const variantClasses = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-200 text-gray-800',
  outline: 'border border-gray-300 bg-white',
  ghost: 'hover:bg-gray-100'
}