'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { Code, Play, Download, Copy, RefreshCw, CheckCircle, AlertCircle, Zap, Brain, Settings, FileText, Terminal, Package, GitBranch, Sparkles, Lightbulb, Target } from 'lucide-react'
import type { SolutionConfig, ComponentConfig } from './solution-configurator'

interface SmartCodeGeneratorProps {
  config: SolutionConfig
  components: ComponentConfig[]
  solutionName: string
  scenarioName: string
  onCodeGenerated?: (code: string, metadata: CodeMetadata) => void
  className?: string
}

interface CodeMetadata {
  generationTime: number
  codeSize: number
  componentsUsed: string[]
  featuresEnabled: string[]
  optimizations: string[]
  bestPractices: string[]
  suggestions: string[]
  complexity: 'simple' | 'moderate' | 'complex'
  quality: {
    score: number
    issues: string[]
    improvements: string[]
  }
}

interface GenerationTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'basic' | 'advanced' | 'enterprise' | 'minimal'
  features: string[]
  optimizations: string[]
}

const generationTemplates: GenerationTemplate[] = [
  {
    id: 'basic-react',
    name: '基础 React',
    description: '简洁的 React 组件，适合快速原型开发',
    icon: '⚛️',
    category: 'basic',
    features: ['TypeScript', 'Basic Styling', 'Event Handling'],
    optimizations: ['Tree Shaking', 'Code Splitting']
  },
  {
    id: 'advanced-hooks',
    name: '高级 Hooks',
    description: '使用现代 React Hooks 和最佳实践',
    icon: '🎣',
    category: 'advanced',
    features: ['Custom Hooks', 'State Management', 'Performance Optimization'],
    optimizations: ['Memoization', 'Lazy Loading', 'Bundle Analysis']
  },
  {
    id: 'enterprise-grade',
    name: '企业级方案',
    description: '生产就绪的企业级应用架构',
    icon: '🏢',
    category: 'enterprise',
    features: ['Error Boundaries', 'Testing Suite', 'Documentation', 'CI/CD Ready'],
    optimizations: ['Error Handling', 'Performance Monitoring', 'Security Hardening']
  },
  {
    id: 'minimal-tiny',
    name: '极简方案',
    description: '最小化代码体积，追求极致性能',
    icon: '🪶',
    category: 'minimal',
    features: ['Core Functionality Only', 'Zero Dependencies'],
    optimizations: ['Minification', 'Dead Code Elimination', 'Compression']
  }
]

export function SmartCodeGenerator({
  config,
  components,
  solutionName,
  scenarioName,
  onCodeGenerated,
  className
}: SmartCodeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<GenerationTemplate>(generationTemplates[0])
  const [generationMetadata, setGenerationMetadata] = useState<CodeMetadata | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // 智能组件分析
  const analyzeComponents = useCallback((components: ComponentConfig[]) => {
    const analysis = {
      hasForm: false,
      hasInteractive: false,
      hasDataDisplay: false,
      hasLayout: false,
      complexity: 0,
      dependencies: new Set<string>(),
      accessibility: [] as string[],
      performance: [] as string[]
    }

    components.forEach(component => {
      analysis.complexity += component.variant !== 'default' ? 1 : 0
      analysis.complexity += component.size !== 'md' ? 1 : 0
      analysis.complexity += component.animation !== 'none' ? 2 : 0
      analysis.complexity += Object.keys(component).length > 5 ? 1 : 0

      if (['Form', 'Input', 'Select', 'Checkbox'].includes(component.name)) {
        analysis.hasForm = true
        analysis.dependencies.add('react-hook-form')
        analysis.accessibility.push('Form validation')
        analysis.performance.push('Optimized form handling')
      }

      if (['Button', 'Modal', 'Dropdown'].includes(component.name)) {
        analysis.hasInteractive = true
        analysis.accessibility.push('Keyboard navigation')
        analysis.accessibility.push('Screen reader support')
      }

      if (['Table', 'Card', 'List', 'Chart'].includes(component.name)) {
        analysis.hasDataDisplay = true
        analysis.dependencies.add('react-table')
        analysis.performance.push('Virtual scrolling for large datasets')
      }

      if (['Container', 'Grid', 'Layout', 'Header'].includes(component.name)) {
        analysis.hasLayout = true
        analysis.dependencies.add('CSS Grid')
        analysis.dependencies.add('Flexbox')
      }

      if (component.animation && component.animation !== 'none') {
        analysis.dependencies.add('framer-motion')
        analysis.performance.push('Hardware-accelerated animations')
      }

      if (component.required || component.error) {
        analysis.accessibility.push('Required field indicators')
        analysis.accessibility.push('Error state handling')
      }
    })

    return analysis
  }, [])

  // 智能代码生成
  const generateSmartCode = useCallback(async () => {
    setIsGenerating(true)
    const startTime = performance.now()

    try {
      const analysis = analyzeComponents(components)
      const metadata: CodeMetadata = {
        generationTime: 0,
        codeSize: 0,
        componentsUsed: components.map(c => c.name),
        featuresEnabled: Object.entries(config.features)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key),
        optimizations: [],
        bestPractices: [],
        suggestions: [],
        complexity: analysis.complexity < 5 ? 'simple' : analysis.complexity < 15 ? 'moderate' : 'complex',
        quality: {
          score: 0,
          issues: [],
          improvements: []
        }
      }

      // 应用模板特性
      metadata.optimizations.push(...selectedTemplate.optimizations)
      metadata.featuresEnabled.push(...selectedTemplate.features)

      // 生成智能导入语句
      const imports = generateSmartImports(components, config, analysis)

      // 生成智能组件代码
      const componentCode = generateSmartComponents(components, config, analysis)

      // 生成智能样式
      const styles = generateSmartStyles(config, analysis)

      // 生成最佳实践代码
      const bestPracticesCode = generateBestPractices(config, analysis)

      // 生成测试代码
      const testCode = generateTests(components, config, selectedTemplate.category)

      // 组装完整代码
      const fullCode = `${imports}

${styles}

${componentCode}

${bestPracticesCode}

${testCode}

export default function ${scenarioName.replace(/\s+/g, '')}Solution() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      ${generateMainLayout(components, config, analysis)}
    </div>
  )
}`

      // 计算代码质量评分
      const qualityScore = calculateCodeQuality(fullCode, metadata)
      metadata.quality = qualityScore

      // 生成建议
      metadata.suggestions = generateSuggestions(analysis, config, metadata)

      const endTime = performance.now()
      metadata.generationTime = Math.round(endTime - startTime)
      metadata.codeSize = fullCode.length

      setGeneratedCode(fullCode)
      setGenerationMetadata(metadata)
      onCodeGenerated?.(fullCode, metadata)

    } catch (error) {
      console.error('代码生成失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [components, config, scenarioName, selectedTemplate, analyzeComponents, onCodeGenerated])

  // 智能导入生成
  const generateSmartImports = (components: ComponentConfig[], config: SolutionConfig, analysis: any) => {
    const imports = new Set<string>()

    // React 核心导入
    imports.add("import React, { useState, useEffect, useMemo, useCallback } from 'react'")

    // Xorigo UI 组件导入
    const coreComponents = new Set()
    const layoutComponents = new Set()
    const dataComponents = new Set()

    components.forEach(component => {
      if (['Button', 'Input', 'Card', 'Modal', 'Form', 'Select', 'Checkbox'].includes(component.name)) {
        coreComponents.add(component.name)
      } else if (['Container', 'Grid', 'Layout', 'Header', 'Sidebar'].includes(component.name)) {
        layoutComponents.add(component.name)
      } else if (['Table', 'List', 'Pagination', 'Chart'].includes(component.name)) {
        dataComponents.add(component.name)
      }
    })

    if (coreComponents.size > 0) {
      imports.add(`import { ${Array.from(coreComponents).join(', ')} } from '@xorigo-ui/core'`)
    }
    if (layoutComponents.size > 0) {
      imports.add(`import { ${Array.from(layoutComponents).join(', ')} } from '@xorigo-ui/layout'`)
    }
    if (dataComponents.size > 0) {
      imports.add(`import { ${Array.from(dataComponents).join(', ')} } from '@xorigo-ui/data'`)
    }

    // 工具库导入
    if (config.features.typescript) {
      imports.add("import { cn } from '@/utils'")
    }

    // 动画库导入
    if (components.some(c => c.animation && c.animation !== 'none')) {
      imports.add("import { motion, AnimatePresence } from 'framer-motion'")
    }

    // 表单处理导入
    if (analysis.hasForm) {
      imports.add("import { useForm, Controller } from 'react-hook-form'")
      imports.add("import { zodResolver } from '@hookform/resolvers/zod'")
      imports.add("import * as z from 'zod'")
    }

    return Array.from(imports).join('\n')
  }

  // 智能组件生成
  const generateSmartComponents = (components: ComponentConfig[], config: SolutionConfig, analysis: any) => {
    let componentCode = ''

    components.forEach((component, index) => {
      const props = generateComponentProps(component, config)
      const styling = generateComponentStyling(component, config)
      const accessibility = generateAccessibilityProps(component)

      componentCode += `
// ${component.name} 组件
const ${component.name}${index}Component = (${analysis.hasForm ? '{ control, errors }' : ''}) => {
  return (
    <${component.name}
      ${props}
      ${styling}
      ${accessibility}
      className={cn(
        'transition-all duration-200',
        ${component.disabled ? "'opacity-50 cursor-not-allowed'" : "'hover:opacity-80'"},
        ${component.error ? "'border-red-500'" : "''"}
      )}
    >
      ${component.placeholder || `${component.name} 内容`}
    </${component.name}>
  )
}
`
    })

    return componentCode
  }

  // 生成组件属性
  const generateComponentProps = (component: ComponentConfig, config: SolutionConfig) => {
    const props = []

    if (component.variant && component.variant !== 'default') {
      props.push(`variant="${component.variant}"`)
    }
    if (component.size && component.size !== 'md') {
      props.push(`size="${component.size}"`)
    }
    if (component.color && component.color !== 'blue') {
      props.push(`color="${component.color}"`)
    }
    if (component.radius && component.radius !== 'md') {
      props.push(`radius="${component.radius}"`)
    }
    if (component.shadow && component.shadow !== 'md') {
      props.push(`shadow="${component.shadow}"`)
    }
    if (component.disabled) {
      props.push('disabled')
    }
    if (component.loading) {
      props.push('loading')
    }
    if (component.error) {
      props.push('error')
    }
    if (component.required) {
      props.push('required')
    }
    if (component.fullWidth) {
      props.push('fullWidth')
    }

    return props.join('\n      ')
  }

  // 生成组件样式
  const generateComponentStyling = (component: ComponentConfig, config: SolutionConfig) => {
    const styles = []

    if (component.animation && component.animation !== 'none') {
      styles.push(`initial={{ opacity: 0, y: 20 }}`)
      styles.push(`animate={{ opacity: 1, y: 0 }}`)
      styles.push(`transition={{ duration: 0.3 }}`)
    }
    if (component.hoverScale) {
      styles.push(`whileHover={{ scale: 1.05 }}`)
    }
    if (component.focusRing) {
      styles.push(`whileFocus={{ scale: 1.02 }}`)
    }

    return styles.length > 0 ? styles.join('\n      ') : ''
  }

  // 生成可访问性属性
  const generateAccessibilityProps = (component: ComponentConfig) => {
    const a11y = []

    if (component.placeholder) {
      a11y.push(`aria-label="${component.placeholder}"`)
    }
    if (component.required) {
      a11y.push('aria-required="true"')
    }
    if (component.error) {
      a11y.push('aria-invalid="true"')
      a11y.push('aria-describedby="error-message"')
    }

    return a11y.join('\n      ')
  }

  // 生成智能样式
  const generateSmartStyles = (config: SolutionConfig, analysis: any) => {
    return `
// 设计令牌样式
const styles = {
  container: cn(
    'container mx-auto px-4 py-8',
    ${config.layout === 'sidebar' ? 'flex gap-6' : 'block'}
  ),
  card: cn(
    'rounded-lg shadow-md p-6',
    ${config.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'},
    ${config.designTokens?.shadows !== 'none' ? 'hover:shadow-lg transition-shadow' : ''}
  ),
  button: cn(
    'font-medium transition-colors',
    ${config.designTokens?.transitions !== 'none' ? 'duration-200' : ''}
  )
}
`
  }

  // 生成最佳实践代码
  const generateBestPractices = (config: SolutionConfig, analysis: any) => {
    let practices = ''

    if (config.features.typescript) {
      practices += `
// TypeScript 类型定义
interface ${scenarioName.replace(/\s+/g, '')}Props {
  ${components.map((c, i) => `${c.name.toLowerCase()}Data?: ${c.name}Data`).join('\n  ')}
}

interface ${c.name}Data {
  id: string
  value: string
  label?: string
}
`
    }

    if (config.features.responsive) {
      practices += `
// 响应式设计 Hook
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return { isMobile }
}
`
    }

    if (analysis.hasForm) {
      practices += `
// 表单验证模式
const formSchema = z.object({
  ${components.filter(c => ['Input', 'Select'].includes(c.name)).map(c =>
    `${c.name.toLowerCase()}: z.string()${c.required ? '.min(1, "此项为必填项")' : '.optional()'}`
  ).join(',\n  ')}
})

type FormValues = z.infer<typeof formSchema>
`
    }

    return practices
  }

  // 生成测试代码
  const generateTests = (components: ComponentConfig[], config: SolutionConfig, templateCategory: string) => {
    if (templateCategory === 'basic') return '// 基础测试：建议添加单元测试'

    return `
// 测试文件：${scenarioName.replace(/\s+/g, '')}.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ${scenarioName.replace(/\s+/g, '')}Solution } from './${scenarioName.replace(/\s+/g, '')}'

describe('${scenarioName}', () => {
  it('应该正确渲染所有组件', () => {
    render(<${scenarioName.replace(/\s+/g, '')}Solution />)
    ${components.map(c =>
      `expect(screen.getByText('${c.placeholder || c.name}')).toBeInTheDocument()`
    ).join('\n    ')}
  })

  ${components.filter(c => ['Button'].includes(c.name)).map(c => `
  it('应该正确处理 ${c.name} 点击事件', () => {
    const handleClick = jest.fn()
    render(<${scenarioName.replace(/\s+/g, '')}Solution />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  }
  `).join('')}

  ${config.features.responsive ? `
  it('应该在移动设备上正确显示', () => {
    global.innerWidth = 500
    render(<${scenarioName.replace(/\s+/g, '')}Solution />)
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
  }
  ` : ''}
})
`
  }

  // 生成主布局
  const generateMainLayout = (components: ComponentConfig[], config: SolutionConfig, analysis: any) => {
    const hasLayout = components.some(c => ['Container', 'Layout'].includes(c.name))

    if (hasLayout) {
      return `
      <Container className={styles.container}>
        <div className="grid gap-6 ${config.layout === 'mobile-first' ? 'md:grid-cols-1' : 'lg:grid-cols-2'}">
          ${components.map((c, i) => `
          <${c.name}${i}Component key="${c.name}-${i}" ${analysis.hasForm ? '{ control, errors }' : ''} />`).join('\n          ')}
        </div>
      </Container>`
    }

    return `
      <div className={styles.container}>
        <div className="grid gap-6 ${config.layout === 'mobile-first' ? 'md:grid-cols-1' : 'lg:grid-cols-2'}">
          ${components.map((c, i) => `
          <${c.name}${i}Component key="${c.name}-${i}" ${analysis.hasForm ? '{ control, errors }' : ''} />`).join('\n          ')}
        </div>
      </div>`
  }

  // 计算代码质量
  const calculateCodeQuality = (code: string, metadata: CodeMetadata) => {
    let score = 100
    const issues = []
    const improvements = []

    // 基础质量检查
    if (!code.includes('export default')) {
      score -= 10
      issues.push('缺少默认导出')
    }

    if (!code.includes('import React')) {
      score -= 5
      issues.push('缺少 React 导入')
    }

    if (code.length > 10000) {
      score -= 5
      improvements.push('考虑代码分割以减小文件大小')
    }

    if (!code.includes('aria-')) {
      score -= 10
      issues.push('缺少可访问性属性')
      improvements.push('添加 ARIA 属性以提高可访问性')
    }

    if (!code.includes('cn(')) {
      score -= 5
      improvements.push('使用 cn 工具函数进行样式合并')
    }

    // 奖励项
    if (code.includes('useMemo') || code.includes('useCallback')) {
      score += 5
    }

    if (code.includes('zod')) {
      score += 10
    }

    if (code.includes('test(') || code.includes('describe(')) {
      score += 10
    }

    if (code.includes('ErrorBoundary')) {
      score += 5
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      issues,
      improvements
    }
  }

  // 生成建议
  const generateSuggestions = (analysis: any, config: SolutionConfig, metadata: CodeMetadata) => {
    const suggestions = []

    if (analysis.complexity > 10) {
      suggestions.push('考虑将复杂组件拆分为更小的子组件')
    }

    if (!config.features.responsive) {
      suggestions.push('建议启用响应式设计以支持移动设备')
    }

    if (!config.features.testing) {
      suggestions.push('建议添加测试用例以提高代码质量')
    }

    if (!config.features.typescript) {
      suggestions.push('建议使用 TypeScript 以获得更好的类型安全')
    }

    if (metadata.quality.score < 80) {
      suggestions.push('代码质量有待提高，建议查看具体问题')
    }

    if (components.length > 5) {
      suggestions.push('组件数量较多，考虑使用 lazy loading 优化加载性能')
    }

    return suggestions
  }

  // 复制代码
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }

  // 下载代码
  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${solutionName.replace(/\s+/g, '-')}-generated.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 模板选择 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                智能代码生成器
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基于 AI 的智能代码生成，自动优化和最佳实践
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvanced ? '简单模式' : '高级模式'}
          </Button>
        </div>

        {/* 模板网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {generationTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={cn(
                'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                selectedTemplate.id === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <div className="text-2xl mb-2">{template.icon}</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {template.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 2).map((feature) => (
                  <span
                    key={feature}
                    className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 2 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded">
                    +{template.features.length - 2}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 生成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={generateSmartCode}
          disabled={isGenerating}
          size="lg"
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              正在生成智能代码...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              生成智能代码
            </>
          )}
        </Button>
      </div>

      {/* 生成结果 */}
      <AnimatePresence>
        {generatedCode && generationMetadata && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  代码生成完成
                </h4>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    {copiedCode ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        复制
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadCode}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载
                  </Button>
                </div>
              </div>

              {/* 元数据统计 */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {generationMetadata.generationTime}ms
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">生成时间</div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {(generationMetadata.codeSize / 1024).toFixed(1)}KB
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">代码大小</div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Package className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {generationMetadata.componentsUsed.length}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">组件数量</div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {generationMetadata.quality.score}%
                  </div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">质量评分</div>
                </div>
              </div>

              {/* 详细信息 */}
              {showAdvanced && (
                <div className="space-y-4 mb-6">
                  {/* 启用的功能 */}
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      启用的功能
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {generationMetadata.featuresEnabled.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 优化项目 */}
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-500" />
                      应用优化
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {generationMetadata.optimizations.map((optimization) => (
                        <span
                          key={optimization}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded-full"
                        >
                          {optimization}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 改进建议 */}
                  {generationMetadata.quality.improvements.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        改进建议
                      </h5>
                      <ul className="space-y-1">
                        {generationMetadata.quality.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 智能建议 */}
                  {generationMetadata.suggestions.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-500" />
                        智能建议
                      </h5>
                      <ul className="space-y-1">
                        {generationMetadata.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-purple-500 mt-1">💡</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 代码预览 */}
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-gray-500" />
                  生成的代码
                </h5>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
                  <pre className="text-sm">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}