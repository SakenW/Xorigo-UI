/**
 * 安全数组解析工具
 * 用于防止参数类型不匹配导致的运行时错误
 */

/**
 * 安全地解析可能为数组或字符串的参数
 * @param value 要解析的值
 * @returns 解析后的数组
 */
export function safeArrayParse<T>(value: any): T[] {
  // 如果已经是数组，直接返回
  if (Array.isArray(value)) {
    return value
  }

  // 如果是字符串，尝试解析JSON
  if (typeof value === 'string') {
    try {
      // 如果以[开头，尝试作为JSON数组解析
      if (value.startsWith('[')) {
        return JSON.parse(value)
      }
      // 如果是空字符串或其他格式，返回空数组
      return []
    } catch (error) {
      console.warn('Failed to parse array from string:', value, error)
      return []
    }
  }

  // 其他情况返回空数组
  return []
}

/**
 * 安全地获取数组长度
 * @param value 可能的数组值
 * @returns 数组长度，如果不是数组则返回0
 */
export function safeArrayLength(value: any): number {
  return safeArrayParse(value).length
}

/**
 * 安全地检查数组是否为空
 * @param value 可能的数组值
 * @returns 是否为空数组
 */
export function safeArrayIsEmpty(value: any): boolean {
  return safeArrayParse(value).length === 0
}