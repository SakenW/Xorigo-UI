/**
 * @fileoverview HelperText 模块导出
 * @description 导出 HelperText 组件、HelperTextList 组件及其相关类型和工具
 */

'use client'

// ==============================
// 组件导出 (Component Exports)
// ==============================

export { HelperText } from './helper-text'
export { HelperTextList } from './helper-text'

// ==============================
// 类型导出 (Type Exports)
// ==============================

export type {
  HelperTextProps,
  HelperTextListProps,
  HelperLink,
} from './helper-text'

// ==============================
// 变体函数导出 (Variant Function Exports)
// ==============================

export {
  helperTextVariants,
  helperIconVariants,
  helperLinkVariants,
} from './helper-text'

// ==============================
// 元数据导出 (Metadata Export)
// ==============================

export const helperTextMetadata = {
  name: 'HelperText',
  version: '1.0.0',
  category: 'forms',
  layer: 'component',
  stability: 'stable',
  since: 'v1.0.0',
} as const

// ==============================
// 常量导出 (Constants)
// ==============================

/**
 * HelperText 组件默认属性
 */
export const HELPER_TEXT_DEFAULTS = {
  status: 'default' as const,
  size: 'md' as const,
  showIcon: false,
  truncation: 'none' as const,
  maxLines: 0,
  isHidden: false,
  disabled: false,
} as const

/**
 * HelperText 状态类型
 */
export const HELPER_TEXT_STATUS = {
  DEFAULT: 'default',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
} as const

/**
 * HelperText 尺寸类型
 */
export const HELPER_TEXT_SIZE = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const

/**
 * HelperText 截断类型
 */
export const HELPER_TEXT_TRUNCATION = {
  NONE: 'none',
  SINGLE: 'single',
  MULTI: 'multi',
} as const

// ==============================
// 工具函数导出 (Utility Function Exports)
// ==============================

/**
 * 创建 HelperText 项（用于 HelperTextList）
 */
export const createHelperTextItem = (
  content: string | React.ReactNode,
  status: HelperTextProps['status'] = 'default',
  id?: string
) => ({
  id,
  content,
  status,
})

/**
 * 创建多条 HelperText 项
 */
export const createHelperTextItems = (
  items: Array<{
    content: string | React.ReactNode
    status?: HelperTextProps['status']
    id?: string
  }>
) => items.map((item, index) => createHelperTextItem(item.content, item.status, item.id))

/**
 * 验证 HelperText 配置
 */
export const validateHelperTextConfig = (config: Partial<HelperTextProps>): boolean => {
  // 检查是否有内容
  if (!config.content && !config.children) {
    console.warn('HelperText: 至少需要提供 content 或 children 属性')
    return false
  }

  // 检查 maxLines
  if (config.maxLines !== undefined && config.maxLines < 0) {
    console.warn('HelperText: maxLines 不能为负数')
    return false
  }

  // 检查 links
  if (config.links && !Array.isArray(config.links)) {
    console.warn('HelperText: links 必须是数组')
    return false
  }

  return true
}

/**
 * 获取 HelperText 状态对应的语义角色
 */
export const getHelperTextRole = (status: HelperTextProps['status']): 'status' | 'alert' => {
  return status === 'error' ? 'alert' : 'status'
}

/**
 * 获取 HelperText 状态对应的 aria-live 属性
 */
export const getHelperTextAriaLive = (status: HelperTextProps['status']): 'polite' | 'assertive' => {
  return status === 'error' ? 'assertive' : 'polite'
}

/**
 * 检查 HelperText 是否需要图标
 */
export const shouldShowHelperTextIcon = (
  showIcon: boolean,
  status: HelperTextProps['status']
): boolean => {
  return showIcon || status !== 'default'
}

/**
 * 格式化 HelperText 内容（处理链接标记）
 */
export const formatHelperTextContent = (
  content: string | React.ReactNode,
  links?: HelperLink[]
): string => {
  if (typeof content !== 'string' || !links || links.length === 0) {
    return content as string
  }

  // 计算链接标记数量
  const linkMarkers = content.match(/\{[0-9]+\}/g)?.length || 0

  if (linkMarkers > links.length) {
    console.warn(`HelperText: 链接标记数量 (${linkMarkers}) 超过实际链接数量 (${links.length})`)
  }

  return content
}

// ==============================
// Hook 导出 (Hook Exports)
// ==============================

/**
 * 自定义 HelperText Hook（如果需要的话）
 * 用于在复杂场景中管理 HelperText 状态
 */
export const useHelperText = (
  initialStatus: HelperTextProps['status'] = 'default'
) => {
  const [status, setStatus] = React.useState<HelperTextProps['status']>(initialStatus)
  const [content, setContent] = React.useState<string | React.ReactNode>('')
  const [visible, setVisible] = React.useState(true)

  const updateStatus = (newStatus: HelperTextProps['status']) => {
    setStatus(newStatus)
  }

  const updateContent = (newContent: string | React.ReactNode) => {
    setContent(newContent)
  }

  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const toggle = () => setVisible(prev => !prev)

  return {
    status,
    content,
    visible,
    updateStatus,
    updateContent,
    show,
    hide,
    toggle,
    setStatus,
    setContent,
  }
}

// ==============================
// 默认导出 (Default Export)
// ==============================

/**
 * HelperText 组件默认导出
 */
export default HelperText

// ==============================
// 重新导出表单分类 (Re-exports from Forms Category)
// ==============================

// 注意：如果需要，HelperText 也会通过 /packages/core/src/form/index.ts 重新导出
// 确保在表单分类中统一管理所有组件
