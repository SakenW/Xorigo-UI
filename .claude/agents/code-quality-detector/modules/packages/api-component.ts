/**
 * Packages 目录 API 规范检测模块
 * 针对组件库的 API 设计标准
 */

import type { DetectionModule, DetectionContext, DetectionResult } from '../../core/detection-core'

/**
 * Packages 目录 API 检测模块
 */
export const packagesAPIModule: DetectionModule = {
  id: 'api-component',
  name: 'Packages API 规范检测',
  description: '检测组件库的 API 设计标准和一致性',
  enabled: true,
  tokenCost: 150, // 较高 token 消耗，因为需要解析代码

  rules: [
    {
      id: 'packages-base-props',
      name: '基础属性检查',
      description: '检查组件是否包含标准基础属性',
      severity: 'warning',
      category: 'api'
    },
    {
      id: 'packages-variant-system',
      name: '变体系统检查',
      description: '检查组件是否使用变体系统',
      severity: 'info',
      category: 'api'
    },
    {
      id: 'packages-forward-ref',
      name: 'forwardRef 检查',
      description: '检查组件是否支持 ref 转发',
      severity: 'info',
      category: 'api'
    },
    {
      id: 'packages-displayname',
      name: 'displayName 检查',
      description: '检查组件是否设置 displayName',
      severity: 'info',
      category: 'api'
    }
  ],

  async check(context: DetectionContext): Promise<DetectionResult[]> {
    const results: DetectionResult[] = []
    const { filePath, content, operation } = context

    if (!content || !['create', 'edit'].includes(operation)) {
      return results
    }

    // 只检测组件文件
    if (!this.isComponentFile(filePath)) {
      return results
    }

    // 解析组件内容
    await this.checkComponentAPI(filePath, content, results)

    return results
  },

  /**
   * 检查组件 API
   */
  async checkComponentAPI(filePath: string, content: string, results: DetectionResult[]): Promise<void> {
    const fileName = filePath.split('/').pop() || ''
    const componentName = fileName.replace(/\.(tsx?|jsx?)$/, '')

    // 检查基础属性
    await this.checkBaseProps(content, componentName, results)

    // 检查变体系统
    await this.checkVariantSystem(content, componentName, results)

    // 检查 forwardRef
    await this.checkForwardRef(content, componentName, results)

    // 检查 displayName
    await this.checkDisplayName(content, componentName, results)

    // 检查类型导出
    await this.checkTypeExports(content, componentName, results)
  },

  /**
   * 检查基础属性
   */
  async checkBaseProps(content: string, componentName: string, results: DetectionResult[]): Promise<void> {
    const baseProps = ['className', 'children', 'disabled']
    const missingProps = []

    // 检查接口定义
    const interfaceMatch = content.match(new RegExp(`interface\\s+${componentName}Props\\s*{([^}]+)}`, 's'))
    if (interfaceMatch) {
      const interfaceContent = interfaceMatch[1]

      baseProps.forEach(prop => {
        if (!interfaceContent.includes(`${prop}?`) && !interfaceContent.includes(`${prop}:`)) {
          missingProps.push(prop)
        }
      })
    }

    if (missingProps.length > 0) {
      results.push({
        ruleId: 'packages-base-props',
        severity: 'warning',
        message: `组件 ${componentName} 缺少标准基础属性: ${missingProps.join(', ')}`,
        suggestion: '添加标准基础属性以提高组件一致性',
        autoFix: {
          command: `# 在接口中添加基础属性\necho '  className?: string\n  children?: React.ReactNode\n  disabled?: boolean' >> temp_props.txt`,
          description: '添加标准基础属性到组件接口'
        }
      })
    }
  },

  /**
   * 检查变体系统
   */
  async checkVariantSystem(content: string, componentName: string, results: DetectionResult[]): Promise<void> {
    // 检查是否使用了 cva 或变体系统
    const hasCVA = content.includes('cva(') || content.includes('class-variance-authority')
    const hasVariants = content.includes('variants:') || content.includes('variant?:')

    if (!hasCVA && !hasVariants) {
      results.push({
        ruleId: 'packages-variant-system',
        severity: 'info',
        message: `组件 ${componentName} 没有使用变体系统`,
        suggestion: '考虑使用 class-variance-authority 实现变体系统以提高一致性'
      })
    }
  },

  /**
   * 检查 forwardRef
   */
  async checkForwardRef(content: string, componentName: string, results: DetectionResult[]): Promise<void> {
    const hasForwardRef = content.includes('React.forwardRef') || content.includes('forwardRef')

    if (!hasForwardRef) {
      results.push({
        ruleId: 'packages-forward-ref',
        severity: 'info',
        message: `组件 ${componentName} 没有支持 ref 转发`,
        suggestion: '使用 React.forwardRef 包装组件以支持 ref 转发'
      })
    }
  },

  /**
   * 检查 displayName
   */
  async checkDisplayName(content: string, componentName: string, results: DetectionResult[]): Promise<void> {
    const hasDisplayName = content.includes(`${componentName}.displayName`) ||
                           content.includes(`displayName: "${componentName}"`)

    if (!hasDisplayName) {
      results.push({
        ruleId: 'packages-displayname',
        severity: 'info',
        message: `组件 ${componentName} 没有设置 displayName`,
        suggestion: '设置 displayName 以改善调试体验'
      })
    }
  },

  /**
   * 检查类型导出
   */
  async checkTypeExports(content: string, componentName: string, results: DetectionResult[]): Promise<void> {
    const propsTypeExport = content.includes(`export type ${componentName}Props`) ||
                           content.includes(`export interface ${componentName}Props`)

    if (!propsTypeExport) {
      results.push({
        ruleId: 'packages-type-exports',
        severity: 'warning',
        message: `组件 ${componentName} 没有导出 Props 类型`,
        suggestion: '导出组件 Props 类型以支持类型推断'
      })
    }
  },

  /**
   * 判断是否为组件文件
   */
  isComponentFile(filePath: string): boolean {
    const componentDirs = ['components', 'ui']
    const componentExtensions = ['.tsx', '.jsx']

    const isInComponentDir = componentDirs.some(dir => filePath.includes(`/${dir}/`))
    const hasComponentExtension = componentExtensions.some(ext => filePath.endsWith(ext))

    return isInComponentDir && hasComponentExtension
  }
}

// 注册模块
import { DetectionSystem } from '../../core/detection-core'
DetectionSystem.registerModule(packagesAPIModule)