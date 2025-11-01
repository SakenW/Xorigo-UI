import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 工具函数: 合并和优化Tailwind CSS类名
 * 结合clsx和tailwind-merge的功能
 *
 * @param inputs - 类名输入(字符串、对象、数组等)
 * @returns 合并后的优化类名字符串
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (后面的px-4覆盖px-2)
 * cn('text-red-500', condition && 'text-blue-500') // 条件类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
