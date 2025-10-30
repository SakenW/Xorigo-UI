/**
 * 协作编辑工具函数
 * 提供常用的辅助函数和实用工具
 */

import type {
  User,
  EditOperation,
  CursorPosition,
  SelectionRange,
  Comment,
  Annotation,
  TeamTemplate,
  ConflictResolution,
  CollaborationEvent
} from '../types'

// ============================================================================
// 用户工具函数
// ============================================================================

/**
 * 生成用户颜色
 */
export function generateUserColor(userId: string): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
    '#6366F1', // indigo
    '#84CC16', // lime
  ]

  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

/**
 * 获取用户显示名称
 */
export function getUserDisplayName(user: User): string {
  return user.name || `用户 ${user.id.slice(0, 8)}`
}

/**
 * 获取用户头像URL
 */
export function getUserAvatarUrl(user: User): string {
  if (user.avatar) {
    return user.avatar
  }

  // 生成默认头像
  const initials = user.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${user.color.slice(1)}&color=ffffff`
}

/**
 * 检查用户是否在线
 */
export function isUserOnline(user: User): boolean {
  return user.status === 'online' || user.status === 'editing'
}

/**
 * 获取用户状态文本
 */
export function getUserStatusText(status: User['status']): string {
  const statusMap = {
    online: '在线',
    offline: '离线',
    away: '离开',
    editing: '编辑中'
  }
  return statusMap[status] || status
}

// ============================================================================
// 编辑操作工具函数
// ============================================================================

/**
 * 应用编辑操作到文本
 */
export function applyEditOperation(text: string, operation: EditOperation): string {
  const lines = text.split('\n')
  const { line, column } = operation.position

  // 确保行号有效
  if (line < 0 || line >= lines.length) {
    return text
  }

  const targetLine = lines[line]
  const before = targetLine.slice(0, column)
  const after = targetLine.slice(column)

  switch (operation.type) {
    case 'insert':
      lines[line] = before + operation.content + after
      break
    case 'delete':
      lines[line] = before + after.slice(operation.length || 0)
      break
    case 'replace':
      lines[line] = before + operation.content + after.slice(operation.length || 0)
      break
    case 'format':
      // 格式化操作需要更复杂的逻辑
      break
    case 'attribute':
      // 属性操作通常不影响文本内容
      break
  }

  return lines.join('\n')
}

/**
 * 生成操作ID
 */
export function generateOperationId(): string {
  return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 检查操作是否冲突
 */
export function isOperationConflicting(op1: EditOperation, op2: EditOperation): boolean {
  // 不同行的操作不会冲突
  if (op1.position.line !== op2.position.line) {
    return false
  }

  // 计算操作范围
  const op1Start = op1.position.column
  const op1End = op1Start + (op1.type === 'insert' ? op1.content.length : (op1.length || 0))
  const op2Start = op2.position.column
  const op2End = op2Start + (op2.type === 'insert' ? op2.content.length : (op2.length || 0))

  // 检查范围是否重叠
  return !(op1End <= op2Start || op2End <= op1Start)
}

/**
 * 转换操作（操作转换算法）
 */
export function transformOperation(op1: EditOperation, op2: EditOperation): EditOperation {
  if (op1.position.line < op2.position.line) {
    return op1
  } else if (op1.position.line > op2.position.line) {
    return {
      ...op1,
      position: {
        ...op1.position,
        line: op1.position.line + (op2.type === 'insert' ? 1 : op2.type === 'delete' ? -1 : 0)
      }
    }
  } else {
    // 同一行
    if (op1.position.column <= op2.position.column) {
      return op1
    } else {
      const offset = op2.type === 'insert' ? op2.content.length : (op2.type === 'delete' ? -(op2.length || 0) : 0)
      return {
        ...op1,
        position: {
          ...op1.position,
          column: op1.position.column + offset
        }
      }
    }
  }
}

// ============================================================================
// 光标和选择工具函数
// ============================================================================

/**
 * 计算光标在文本中的绝对位置
 */
export function getAbsolutePosition(text: string, cursor: CursorPosition): number {
  const lines = text.split('\n')
  let position = 0

  for (let i = 0; i < cursor.line && i < lines.length; i++) {
    position += lines[i].length + 1 // +1 for newline
  }

  return position + cursor.column
}

/**
 * 根据绝对位置获取行列位置
 */
export function getLineColumnFromPosition(text: string, position: number): CursorPosition {
  const lines = text.split('\n')
  let currentPosition = 0
  let line = 0
  let column = 0

  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length
    if (currentPosition + lineLength >= position) {
      line = i
      column = Math.max(0, position - currentPosition)
      break
    }
    currentPosition += lineLength + 1 // +1 for newline
  }

  return {
    line,
    column,
    userId: '',
    userName: '',
    color: '',
    timestamp: new Date()
  }
}

/**
 * 获取选择范围的文本
 */
export function getSelectedText(text: string, selection: SelectionRange): string {
  const startPos = getAbsolutePosition(text, selection.start)
  const endPos = getAbsolutePosition(text, selection.end)

  return text.slice(startPos, endPos)
}

/**
 * 检查光标是否在选择范围内
 */
export function isCursorInSelection(cursor: CursorPosition, selection: SelectionRange): boolean {
  // 简化检查，只比较行号和列号
  if (cursor.line < selection.start.line || cursor.line > selection.end.line) {
    return false
  }

  if (cursor.line === selection.start.line && cursor.column < selection.start.column) {
    return false
  }

  if (cursor.line === selection.end.line && cursor.column > selection.end.column) {
    return false
  }

  return true
}

// ============================================================================
// 评论工具函数
// ============================================================================

/**
 * 格式化评论时间
 */
export function formatCommentTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * 获取评论回复数量
 */
export function getCommentReplyCount(comment: Comment): number {
  let count = comment.replies.length

  for (const reply of comment.replies) {
    count += getCommentReplyCount(reply)
  }

  return count
}

/**
 * 检查评论是否有未回复
 */
export function hasUnrepliedComments(comments: Comment[]): boolean {
  for (const comment of comments) {
    if (!comment.isResolved && comment.replies.length === 0) {
      return true
    }
    if (hasUnrepliedComments(comment.replies)) {
      return true
    }
  }
  return false
}

// ============================================================================
// 模板工具函数
// ============================================================================

/**
 * 获取模板描述摘要
 */
export function getTemplateSummary(template: TeamTemplate, maxLength = 100): string {
  const summary = template.description || ''
  return summary.length > maxLength ? summary.slice(0, maxLength) + '...' : summary
}

/**
 * 获取模板标签字符串
 */
export function getTemplateTagsString(template: TeamTemplate, maxTags = 3): string {
  const tags = template.tags.slice(0, maxTags)
  const tagsString = tags.join(', ')
  const remainingCount = template.tags.length - maxTags

  if (remainingCount > 0) {
    return `${tagsString} +${remainingCount}`
  }

  return tagsString
}

/**
 * 检查模板是否可以使用
 */
export function canUseTemplate(template: TeamTemplate): boolean {
  return template.isPublic && template.isApproved && template.permissions.canUse
}

/**
 * 检查模板是否可以编辑
 */
export function canEditTemplate(template: TeamTemplate, userId: string): boolean {
  return template.author.id === userId && template.permissions.canModify
}

/**
 * 获取模板使用统计文本
 */
export function getTemplateStatsText(template: TeamTemplate): string {
  const { views, downloads, uses, averageRating } = template.statistics

  const parts = []
  if (views > 0) parts.push(`${views} 浏览`)
  if (downloads > 0) parts.push(`${downloads} 下载`)
  if (uses > 0) parts.push(`${uses} 使用`)
  if (averageRating > 0) parts.push(`${averageRating.toFixed(1)} 评分`)

  return parts.join(' · ') || '暂无统计'
}

/**
 * 格式化模板复杂度
 */
export function formatTemplateComplexity(complexity: string): string {
  const complexityMap = {
    simple: '简单',
    moderate: '中等',
    complex: '复杂'
  }
  return complexityMap[complexity as keyof typeof complexityMap] || complexity
}

/**
 * 格式化预估时间
 */
export function formatEstimatedTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}小时`
  }

  return `${hours}小时${remainingMinutes}分钟`
}

// ============================================================================
// 冲突解决工具函数
// ============================================================================

/**
 * 生成冲突解决建议
 */
export function generateConflictResolution(conflict: ConflictResolution): ConflictResolution {
  const strategies = {
    'concurrent_edit': 'operational_transform',
    'version_mismatch': 'last_writer_wins',
    'attribute_conflict': 'merge'
  }

  return {
    ...conflict,
    resolutionStrategy: strategies[conflict.conflictType] as any
  }
}

/**
 * 检查冲突是否可以自动解决
 */
export function canAutoResolveConflict(conflict: ConflictResolution): boolean {
  return conflict.conflictType === 'version_mismatch' ||
         conflict.conflictType === 'attribute_conflict'
}

// ============================================================================
// 协作事件工具函数
// ============================================================================

/**
 * 格式化协作事件消息
 */
export function formatCollaborationEvent(event: CollaborationEvent): string {
  const eventMessages = {
    'user_joined': '用户加入了协作',
    'user_left': '用户离开了协作',
    'cursor_moved': '用户移动了光标',
    'selection_changed': '用户改变了选择',
    'content_changed': '内容发生了变化',
    'conflict_detected': '检测到冲突',
    'conflict_resolved': '冲突已解决',
    'comment_added': '添加了评论',
    'comment_resolved': '评论已解决',
    'version_created': '创建了新版本',
    'branch_created': '创建了新分支',
    'merge_requested': '发起了合并请求',
    'template_shared': '分享了模板',
    'permission_changed': '权限发生了变化'
  }

  return eventMessages[event.type] || event.type
}

/**
 * 获取事件优先级
 */
export function getEventPriority(event: CollaborationEvent): 'high' | 'medium' | 'low' {
  const highPriorityEvents = ['conflict_detected', 'user_joined', 'user_left']
  const mediumPriorityEvents = ['content_changed', 'comment_added', 'version_created']

  if (highPriorityEvents.includes(event.type)) {
    return 'high'
  } else if (mediumPriorityEvents.includes(event.type)) {
    return 'medium'
  } else {
    return 'low'
  }
}

// ============================================================================
// 验证工具函数
// ============================================================================

/**
 * 验证邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证模板名称
 */
export function isValidTemplateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100
}

/**
 * 验证模板内容
 */
export function isValidTemplateContent(content: string): boolean {
  return content.trim().length >= 10 && content.trim().length <= 100000
}

/**
 * 验证评分值
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
}

// ============================================================================
// 格式化工具函数
// ============================================================================

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 格式化数字
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + 'K'
  } else {
    return (num / 1000000).toFixed(1) + 'M'
  }
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerms(text: string, searchTerms: string[]): string {
  let highlightedText = text

  for (const term of searchTerms) {
    if (term.trim()) {
      const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
    }
  }

  return highlightedText
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ============================================================================
// 防抖和节流工具函数
// ============================================================================

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}