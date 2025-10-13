/**
 * 验证工具函数
 */

/**
 * 验证组件名称
 * 规则：以大写字母开头，仅包含字母和数字
 */
export function validateComponentName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: '组件名称不能为空' }
  }

  if (!/^[A-Z]/.test(name)) {
    return { valid: false, error: '组件名称必须以大写字母开头' }
  }

  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return { valid: false, error: '组件名称只能包含字母和数字' }
  }

  // 检查是否是保留字
  const reserved = ['React', 'Component', 'Fragment', 'Element', 'Node']
  if (reserved.includes(name)) {
    return { valid: false, error: `"${name}" 是保留字，请使用其他名称` }
  }

  return { valid: true }
}

/**
 * 验证包名称
 * 规则：小写字母、数字、连字符
 */
export function validatePackageName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: '包名称不能为空' }
  }

  if (!/^[a-z]/.test(name)) {
    return { valid: false, error: '包名称必须以小写字母开头' }
  }

  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return { valid: false, error: '包名称只能包含小写字母、数字和连字符' }
  }

  return { valid: true }
}

/**
 * 验证语言代码
 * 规则：ISO 639-1 标准（2个小写字母）
 */
export function validateLocaleCode(code: string): { valid: boolean; error?: string } {
  if (!code) {
    return { valid: false, error: '语言代码不能为空' }
  }

  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(code)) {
    return {
      valid: false,
      error: '语言代码必须符合 ISO 639-1 标准（如 "en"、"zh-CN"）',
    }
  }

  return { valid: true }
}

/**
 * 验证文件路径
 * 规则：不包含非法字符
 */
export function validateFilePath(filePath: string): { valid: boolean; error?: string } {
  if (!filePath) {
    return { valid: false, error: '文件路径不能为空' }
  }

  const illegalChars = /[<>:"|?*]/
  if (illegalChars.test(filePath)) {
    return { valid: false, error: '文件路径包含非法字符' }
  }

  return { valid: true }
}

/**
 * 验证版本号
 * 规则：符合 semver 格式
 */
export function validateVersion(version: string): { valid: boolean; error?: string } {
  if (!version) {
    return { valid: false, error: '版本号不能为空' }
  }

  if (!/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/.test(version)) {
    return { valid: false, error: '版本号必须符合 semver 格式（如 "1.0.0"）' }
  }

  return { valid: true }
}
