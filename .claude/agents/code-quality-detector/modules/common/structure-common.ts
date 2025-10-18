/**
 * 通用目录结构检测模块
 * 基础的文件组织结构检测
 */

import type { DetectionModule, DetectionContext, DetectionResult } from '../../core/detection-core'

/**
 * 通用结构检测模块
 */
export const structureCommonModule: DetectionModule = {
  id: 'structure-common',
  name: '通用结构检测',
  description: '检测基础的文件组织结构',
  enabled: true,
  tokenCost: 40, // 低 token 消耗

  rules: [
    {
      id: 'common-temp-files',
      name: '临时文件检测',
      description: '检测临时文件和备份文件',
      severity: 'warning',
      category: 'structure'
    },
    {
      id: 'common-large-files',
      name: '大文件检测',
      description: '检测过大的文件',
      severity: 'info',
      category: 'structure'
    },
    {
      id: 'common-empty-files',
      name: '空文件检测',
      description: '检测空文件',
      severity: 'info',
      category: 'structure'
    }
  ],

  async check(context: DetectionContext): Promise<DetectionResult[]> {
    const results: DetectionResult[] = []
    const { filePath, content, operation } = context

    if (operation === 'create' || operation === 'edit') {
      await this.checkFileIssues(filePath, content, results)
    }

    return results
  },

  /**
   * 检查文件问题
   */
  async checkFileIssues(filePath: string, content: string, results: DetectionResult[]): Promise<void> {
    const fileName = filePath.split('/').pop() || ''

    // 检查临时文件
    if (this.isTempFile(fileName)) {
      results.push({
        ruleId: 'common-temp-files',
        severity: 'warning',
        message: `检测到临时文件: ${fileName}`,
        suggestion: '删除临时文件或将它们添加到 .gitignore',
        autoFix: {
          command: `rm "${filePath}"`,
          description: '删除临时文件'
        }
      })
    }

    // 检查空文件
    if (content && content.trim().length === 0) {
      results.push({
        ruleId: 'common-empty-files',
        severity: 'info',
        message: `文件为空: ${fileName}`,
        suggestion: '添加内容或删除空文件'
      })
    }

    // 检查大文件
    if (content && content.length > 50000) { // 约 50KB
      results.push({
        ruleId: 'common-large-files',
        severity: 'info',
        message: `文件较大: ${fileName} (${Math.round(content.length / 1024)}KB)`,
        suggestion: '考虑拆分大文件或移除不必要的内容'
      })
    }
  },

  /**
   * 判断是否为临时文件
   */
  isTempFile(fileName: string): boolean {
    const tempPatterns = [
      /\.tmp$/i,
      /\.temp$/i,
      /~$/,
      /\.swp$/,
      /\.bak$/,
      /\.backup$/,
      /#.*#$/,
      /\.orig$/,
      /\.log$/,
      /^\.DS_Store$/,
      /^Thumbs\.db$/
    ]

    return tempPatterns.some(pattern => pattern.test(fileName))
  }
}

// 注册模块
import { DetectionSystem } from '../../core/detection-core'
DetectionSystem.registerModule(structureCommonModule)