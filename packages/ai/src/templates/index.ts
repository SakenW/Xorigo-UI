/**
 * @fileoverview AI代码生成引擎 - 组件模板库入口
 * @description 导出所有组件模板
 */

import type { ComponentTemplate } from '../types'
import { baseTemplates } from './base'
import { variantTemplates } from './variant'
import { compoundTemplates } from './compound'
import { complexTemplates } from './complex'

// ============================================================================
// 合并所有模板
// ============================================================================

export const templates: ComponentTemplate[] = [
  ...baseTemplates,
  ...variantTemplates,
  ...compoundTemplates,
  ...complexTemplates
]

// ============================================================================
// 模板查找器
// ============================================================================

/**
 * 根据类型查找模板
 */
export function getTemplatesByType(type: string): ComponentTemplate[] {
  return templates.filter(template => template.type === type)
}

/**
 * 根据名称查找模板
 */
export function getTemplateByName(name: string): ComponentTemplate | undefined {
  return templates.find(template => template.name === name)
}

/**
 * 获取所有模板名称
 */
export function getAllTemplateNames(): string[] {
  return templates.map(template => template.name)
}

/**
 * 检查模板是否存在
 */
export function hasTemplate(name: string): boolean {
  return templates.some(template => template.name === name)
}

// ============================================================================
// 模板信息
// ============================================================================

export const templateInfo = {
  base: {
    name: '基础组件',
    description: '简单的基础组件，如按钮、输入框、卡片等',
    templates: baseTemplates,
    count: baseTemplates.length
  },
  variant: {
    name: '变体组件',
    description: '具有多种变体选择的组件，如徽章、头像等',
    templates: variantTemplates,
    count: variantTemplates.length
  },
  compound: {
    name: '组合组件',
    description: '由多个子组件组成的复合组件，如表单、卡片容器等',
    templates: compoundTemplates,
    count: compoundTemplates.length
  },
  complex: {
    name: '复杂组件',
    description: '具有复杂交互和功能的组件，如数据表格、模态框等',
    templates: complexTemplates,
    count: complexTemplates.length
  }
}

/**
 * 获取模板统计信息
 */
export function getTemplateStats() {
  return {
    total: templates.length,
    byType: {
      base: baseTemplates.length,
      variant: variantTemplates.length,
      compound: compoundTemplates.length,
      complex: complexTemplates.length
    }
  }
}

// ============================================================================
// 导出默认
// ============================================================================

export default templates
