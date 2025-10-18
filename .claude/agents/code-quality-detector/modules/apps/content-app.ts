/**
 * Apps 目录内容质量检测模块
 * 针对应用代码质量和最佳实践
 */

import type { DetectionModule, DetectionContext, DetectionResult } from '../../core/detection-core'

/**
 * Apps 目录内容检测模块
 */
export const appsContentModule: DetectionModule = {
  id: 'content-app',
  name: 'Apps 内容质量检测',
  description: '检测应用代码的质量和最佳实践',
  enabled: true,
  tokenCost: 120, // 中等 token 消耗

  rules: [
    {
      id: 'apps-hardcoded-routes',
      name: '硬编码路由检测',
      description: '检测硬编码的路由路径',
      severity: 'warning',
      category: 'content'
    },
    {
      id: 'apps-missing-metadata',
      name: '页面元数据缺失',
      description: '检测页面缺少元数据配置',
      severity: 'warning',
      category: 'content'
    },
    {
      id: 'apps-direct-api-imports',
      name: '直接 API 导入',
      description: '检测组件直接导入 API 函数',
      severity: 'info',
      category: 'content'
    }
  ],

  async check(context: DetectionContext): Promise<DetectionResult[]> {
    const results: DetectionResult[] = []
    const { filePath, content, operation } = context

    if (!content || !['create', 'edit'].includes(operation)) {
      return results
    }

    // 检测页面文件
    if (filePath.includes('/app/') && filePath.endsWith('.tsx')) {
      await this.checkPageMetadata(filePath, content, results)
      await this.checkHardcodedRoutes(content, results)
    }

    // 检测组件文件
    if (filePath.includes('/components/') && filePath.endsWith('.tsx')) {
      await this.checkComponentPatterns(content, results)
    }

    return results
  },

  /**
   * 检查页面元数据
   */
  async checkPageMetadata(filePath: string, content: string, results: DetectionResult[]): Promise<void> {
    // 检查是否有 metadata 导出
    if (!content.includes('export metadata')) {
      results.push({
        ruleId: 'apps-missing-metadata',
        severity: 'warning',
        message: `页面文件 "${filePath.split('/').pop()}" 缺少 metadata 导出`,
        suggestion: '添加 metadata 导出以改善 SEO 和页面体验',
        autoFix: {
          command: `echo 'export const metadata = { title: "页面标题", description: "页面描述" }' >> "${filePath}"`,
          description: '添加基础 metadata 配置'
        }
      })
    }
  },

  /**
   * 检查硬编码路由
   */
  async checkHardcodedRoutes(content: string, results: DetectionResult[]): Promise<void> {
    // 检测硬编码的路径
    const hardcodedRoutePatterns = [
      /href\s*=\s*["']\/[^"']*["']/g,
      /router\.push\(["']\/[^"']*["']/g,
      /navigate\(["']\/[^"']*["']/g
    ]

    hardcodedRoutePatterns.forEach(pattern => {
      const matches = content.match(pattern)
      if (matches) {
        results.push({
          ruleId: 'apps-hardcoded-routes',
          severity: 'warning',
          message: `发现 ${matches.length} 个硬编码路由路径`,
          suggestion: '使用路由常量或配置文件管理路由路径',
          autoFix: {
            command: '# 建议创建路由常量文件\n# echo "export const ROUTES = { HOME: \'/\', ABOUT: \'/about\' }" > lib/routes.ts',
            description: '创建路由常量文件'
          }
        })
      }
    })
  },

  /**
   * 检查组件模式
   */
  async checkComponentPatterns(content: string, results: DetectionResult[]): Promise<void> {
    // 检测直接导入 API 函数
    if (content.includes('from ') && content.includes('/api/')) {
      results.push({
        ruleId: 'apps-direct-api-imports',
        severity: 'info',
        message: '组件直接导入 API 函数，建议使用 hooks 封装',
        suggestion: '创建自定义 hooks 封装 API 调用逻辑'
      })
    }

    // 检测大组件文件
    const lineCount = content.split('\n').length
    if (lineCount > 300) {
      results.push({
        ruleId: 'apps-large-component',
        severity: 'info',
        message: `组件文件过大 (${lineCount} 行)，建议拆分`,
        suggestion: '考虑将大组件拆分为更小的子组件'
      })
    }
  }
}

// 注册模块
import { DetectionSystem } from '../../core/detection-core'
DetectionSystem.registerModule(appsContentModule)