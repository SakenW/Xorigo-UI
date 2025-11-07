'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { ArrowLeft, Settings, Download, Play, Code, Eye, Palette, Layout, Database, Activity, CheckCircle } from 'lucide-react'
import type { BusinessScenario, SolutionTemplate } from './business-scenario-card'
import { CodeQualityAnalyzer } from '../shared/code-quality-analyzer'
import { TemplateMarket } from '../shared/template-market'
import { AIAssistant } from '../shared/ai-assistant'
import { VersionControl } from '../shared/version-control'
import { VersionManagement } from '../shared/version-management'
// import { EnterprisePermissionManagement } from '../shared/enterprise-permission-management' // Temporarily commented out
// import { CICDPipelineManagement } from '../shared/ci-cd-pipeline-management' // Temporarily commented out
// import { EnterpriseDeploymentMonitoring } from '../shared/enterprise-deployment-monitoring' // Temporarily commented out
// import { TeamCollaboration } from '../shared/team-collaboration' // Temporarily commented out
import { ConfigVersionManager } from '../shared/config-version-manager'
import { CICDIntegration } from '../shared/ci-cd-integration'
import { RealTimePreview } from './real-time-preview'
import { SmartCodeGenerator } from './smart-code-generator'

interface SolutionConfiguratorProps {
  solution: SolutionTemplate | null
  scenario: BusinessScenario | null
  isOpen: boolean
  onClose: () => void
  onGenerateCode?: (config: SolutionConfig) => void
  className?: string
}

interface SavedConfiguration {
  id: string
  name: string
  description: string
  solutionId: string
  scenarioId: string
  config: SolutionConfig
  createdAt: string
  updatedAt: string
}

interface ConfigurationTemplate {
  id: string
  name: string
  description: string
  category: 'basic' | 'modern' | 'minimal' | 'corporate' | 'dark'
  config: Partial<SolutionConfig>
  icon: string
  tags: string[]
}

interface SolutionConfig {
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  layout: 'sidebar' | 'top' | 'mobile-first'
  components: ComponentConfig[]
  features: {
    responsive: boolean
    animations: boolean
    darkMode: boolean
    i18n: boolean
    testing: boolean
    typescript: boolean
  }
  // 新增设计令牌配置
  designTokens: {
    colorCategory?: string
    colorScale?: string
    spacingScale?: string
    borderRadius?: string
    fontSize?: string
    lineHeight?: string
    fontWeight?: string
    fontFamily?: string
    shadows?: string
    transitions?: string
  }
}

interface ComponentConfig {
  name: string
  variant?: string
  size?: string
  color?: string
  disabled?: boolean
  // 新增配置选项
  radius?: string
  shadow?: string
  animation?: string
  icon?: string
  placeholder?: string
  fullWidth?: boolean
  loading?: boolean
  error?: boolean
  required?: boolean
  maxLength?: number
  minHeight?: string
  maxHeight?: string
  spacing?: string
  borderRadius?: string
  borderStyle?: string
  opacity?: number
  zIndex?: number
  transform?: string
  transition?: string
  hoverScale?: boolean
  focusRing?: boolean
  [key: string]: any
}

const defaultConfig: SolutionConfig = {
  theme: 'light',
  primaryColor: 'blue',
  layout: 'sidebar',
  components: [],
  features: {
    responsive: true,
    animations: true,
    darkMode: true,
    i18n: false,
    testing: true,
    typescript: true
  },
  designTokens: {
    colorCategory: 'default',
    colorScale: 'standard',
    spacingScale: 'medium',
    borderRadius: 'medium',
    fontSize: 'base',
    lineHeight: 'normal',
    fontWeight: 'normal',
    fontFamily: 'system',
    shadows: 'medium',
    transitions: 'smooth'
  }
}

// 预设配置模板
const configurationTemplates: ConfigurationTemplate[] = [
  {
    id: 'modern-blue',
    name: '现代蓝色风格',
    description: '适合企业应用的现代蓝色主题',
    category: 'modern',
    icon: '🔵',
    tags: ['企业', '专业', '现代'],
    config: {
      theme: 'light',
      primaryColor: 'blue',
      layout: 'sidebar',
      features: {
        responsive: true,
        animations: true,
        darkMode: true,
        i18n: false,
        testing: true,
        typescript: true
      }
    }
  },
  {
    id: 'dark-professional',
    name: '深色专业风格',
    description: '专业的深色主题，适合开发者工具',
    category: 'dark',
    icon: '🌙',
    tags: ['深色', '专业', '开发者'],
    config: {
      theme: 'dark',
      primaryColor: 'slate',
      layout: 'sidebar',
      features: {
        responsive: true,
        animations: true,
        darkMode: true,
        i18n: false,
        testing: true,
        typescript: true
      }
    }
  },
  {
    id: 'minimal-light',
    name: '极简白色风格',
    description: '简洁的白色主题，专注内容展示',
    category: 'minimal',
    icon: '⚪',
    tags: ['极简', '干净', '内容优先'],
    config: {
      theme: 'light',
      primaryColor: 'gray',
      layout: 'top',
      features: {
        responsive: true,
        animations: false,
        darkMode: false,
        i18n: false,
        testing: false,
        typescript: true
      }
    }
  },
  {
    id: 'corporate-green',
    name: '企业绿色风格',
    description: '稳重的绿色主题，适合企业级应用',
    category: 'corporate',
    icon: '🟢',
    tags: ['企业', '稳重', '商务'],
    config: {
      theme: 'light',
      primaryColor: 'green',
      layout: 'sidebar',
      features: {
        responsive: true,
        animations: true,
        darkMode: true,
        i18n: true,
        testing: true,
        typescript: true
      }
    }
  },
  {
    id: 'purple-gradient',
    name: '紫色渐变风格',
    description: '现代紫色渐变主题，富有创意和活力',
    category: 'modern',
    icon: '🟣',
    tags: ['创意', '现代', '渐变'],
    config: {
      theme: 'light',
      primaryColor: 'purple',
      layout: 'mobile-first',
      features: {
        responsive: true,
        animations: true,
        darkMode: true,
        i18n: false,
        testing: true,
        typescript: true
      }
    }
  }
]

export function SolutionConfigurator({
  solution,
  scenario,
  isOpen,
  onClose,
  onGenerateCode,
  className
}: SolutionConfiguratorProps) {
  const [config, setConfig] = useState<SolutionConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState<'components' | 'theme' | 'features' | 'tokens' | 'market' | 'templates' | 'ai' | 'version' | 'preview' | 'real-time' | 'smart-generator'>('components')
  const [generatedCode, setGeneratedCode] = useState<string>('')
  const [savedConfigs, setSavedConfigs] = useState<SavedConfiguration[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveConfigName, setSaveConfigName] = useState('')
  const [saveConfigDescription, setSaveConfigDescription] = useState('')
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all')

  if (!solution || !scenario) return null

  // 生成组件配置
  const componentConfigs = useMemo(() => {
    return solution.components.map(componentName => ({
      name: componentName,
      variant: 'default',
      size: 'md',
      color: config.primaryColor,
      disabled: false,
      // 新增配置的默认值
      radius: 'md',
      shadow: 'sm',
      animation: 'none',
      icon: '',
      placeholder: `请输入${componentName}信息`,
      fullWidth: false,
      loading: false,
      error: false,
      required: false,
      maxLength: 100,
      minHeight: 'auto',
      maxHeight: 'auto',
      spacing: 'md',
      borderRadius: 'md',
      borderStyle: 'solid',
      opacity: 100,
      zIndex: 'auto',
      transform: 'none',
      transition: 'all',
      hoverScale: false,
      focusRing: true
    }))
  }, [solution.components, config.primaryColor])

  // 更新配置
  const updateConfig = (updates: Partial<SolutionConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  // 更新组件配置
  const updateComponentConfig = (index: number, updates: Partial<ComponentConfig>) => {
    setConfig(prev => ({
      ...prev,
      components: prev.components.map((comp, i) =>
        i === index ? { ...comp, ...updates } : comp
      )
    }))
  }

  // 配置保存和加载功能
  const STORAGE_KEY = 'xorigo-solution-configs'

  // 加载保存的配置
  const loadSavedConfigs = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const configs = JSON.parse(stored)
        setSavedConfigs(configs)
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }, [])

  // 保存配置到localStorage
  const saveConfig = useCallback((name: string, description: string) => {
    try {
      const newConfig: SavedConfiguration = {
        id: Date.now().toString(),
        name,
        description,
        solutionId: solution.id,
        scenarioId: scenario.id,
        config: { ...config },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const updatedConfigs = [...savedConfigs, newConfig]
      setSavedConfigs(updatedConfigs)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs))

      setShowSaveDialog(false)
      setSaveConfigName('')
      setSaveConfigDescription('')

      return true
    } catch (error) {
      console.error('保存配置失败:', error)
      return false
    }
  }, [config, solution, scenario, savedConfigs])

  // 加载配置
  const loadConfig = useCallback((savedConfig: SavedConfiguration) => {
    setConfig(savedConfig.config)
    setActiveTab('components')
  }, [])

  // 删除配置
  const deleteConfig = useCallback((id: string) => {
    try {
      const updatedConfigs = savedConfigs.filter(config => config.id !== id)
      setSavedConfigs(updatedConfigs)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfigs))
      return true
    } catch (error) {
      console.error('删除配置失败:', error)
      return false
    }
  }, [savedConfigs])

  // 导出配置
  const exportConfig = useCallback(() => {
    try {
      const exportData = {
        solution,
        scenario,
        config,
        exportedAt: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${solution.name}-config.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error('导出配置失败:', error)
      return false
    }
  }, [solution, scenario, config])

  // 应用配置模板
  const applyTemplate = useCallback((template: ConfigurationTemplate) => {
    const updatedConfig = {
      ...config,
      ...template.config,
      components: config.components // 保持现有的组件配置
    }
    setConfig(updatedConfig)
  }, [config])

  // 获取过滤后的模板
  const getFilteredTemplates = useCallback(() => {
    if (selectedTemplateCategory === 'all') {
      return configurationTemplates
    }
    return configurationTemplates.filter(template =>
      template.category === selectedTemplateCategory
    )
  }, [selectedTemplateCategory])

  // 初始化时加载保存的配置
  useEffect(() => {
    loadSavedConfigs()
  }, [loadSavedConfigs])

  // 性能监控状态
  const [generationMetrics, setGenerationMetrics] = useState({
    generationTime: 0,
    codeSize: 0,
    lastGenerated: null as Date | null,
    optimizationsApplied: [] as string[]
  })

  // 缓存优化的代码生成
  const cachedCodeGeneration = useMemo(() => {
    return new Map<string, { code: string; timestamp: number }>()
  }, [])

  // 智能组件组合逻辑
  const getOptimalComponentOrder = (components: string[]): string[] => {
    // 定义组件优先级和依赖关系
    const componentPriority = {
      'Card': 1,
      'Container': 2,
      'Layout': 3,
      'Header': 4,
      'Navigation': 5,
      'Sidebar': 6,
      'Main': 7,
      'Form': 8,
      'Input': 9,
      'Button': 10,
      'Table': 11,
      'List': 12,
      'Modal': 13,
      'Dropdown': 14,
      'Tooltip': 15
    }

    // 按优先级排序组件
    return [...components].sort((a, b) => {
      const priorityA = componentPriority[a] || 999
      const priorityB = componentPriority[b] || 999
      return priorityA - priorityB
    })
  }

  // 生成优化的导入语句
  const generateOptimizedImports = (components: string[]): string => {
    const uniqueComponents = [...new Set(components)]
    const coreImports = uniqueComponents.filter(comp =>
      ['Button', 'Input', 'Card', 'Modal', 'Dropdown'].includes(comp)
    )
    const layoutImports = uniqueComponents.filter(comp =>
      ['Container', 'Layout', 'Header', 'Sidebar', 'Main'].includes(comp)
    )
    const dataImports = uniqueComponents.filter(comp =>
      ['Table', 'List', 'Pagination'].includes(comp)
    )
    const otherImports = uniqueComponents.filter(comp =>
      !coreImports.includes(comp) && !layoutImports.includes(comp) && !dataImports.includes(comp)
    )

    const imports = []

    if (coreImports.length > 0) {
      imports.push(`import { ${coreImports.join(', ')} } from '@xorigo-ui/core'`)
    }
    if (layoutImports.length > 0) {
      imports.push(`import { ${layoutImports.join(', ')} } from '@xorigo-ui/layout'`)
    }
    if (dataImports.length > 0) {
      imports.push(`import { ${dataImports.join(', ')} } from '@xorigo-ui/data'`)
    }
    if (otherImports.length > 0) {
      imports.push(`import { ${otherImports.join(', ')} } from '@xorigo-ui/components'`)
    }

    return imports.join('\n')
  }

  // 生成设计令牌配置
  const generateDesignTokens = (config: SolutionConfig): string => {
    const tokens = []
    const { designTokens } = config

    if (designTokens.colorCategory || designTokens.colorScale) {
      tokens.push(`  colors: {
    primary: '${designTokens.colorScale || '500'}',
    category: '${designTokens.colorCategory || 'primary'}',
  }`)
    }

    if (designTokens.spacingScale) {
      tokens.push(`  spacing: {
    scale: '${designTokens.spacingScale}',
  }`)
    }

    if (designTokens.fontSize || designTokens.fontFamily) {
      tokens.push(`  typography: {
    fontSize: '${designTokens.fontSize || 'md'}',
    fontFamily: '${designTokens.fontFamily || 'sans'}',
    ${designTokens.fontWeight ? `fontWeight: '${designTokens.fontWeight}',` : ''}
    ${designTokens.lineHeight ? `lineHeight: '${designTokens.lineHeight}',` : ''}
  }`)
    }

    if (designTokens.borderRadius || designTokens.shadows) {
      tokens.push(`  visual: {
    borderRadius: '${designTokens.borderRadius || 'md'}',
    ${designTokens.shadows ? `shadows: '${designTokens.shadows}',` : ''}
  }`)
    }

    return tokens.length > 0 ? `const designTokens = {\n${tokens.join(',\n')}\n}` : ''
  }

  // 生成优化的组件代码
  const generateOptimizedComponentCode = (component: string, config: ComponentConfig, index: number): string => {
    const props = []
    const className = []

    // 基础属性
    if (config.variant && config.variant !== 'default') {
      props.push(`variant="${config.variant}"`)
    }
    if (config.size && config.size !== 'md') {
      props.push(`size="${config.size}"`)
    }
    if (config.color && config.color !== 'blue') {
      props.push(`color="${config.color}"`)
    }

    // 高级属性
    if (config.radius && config.radius !== 'md') {
      props.push(`radius="${config.radius}"`)
    }
    if (config.shadow && config.shadow !== 'md') {
      props.push(`shadow="${config.shadow}"`)
    }

    // 状态属性
    if (config.disabled) {
      props.push('disabled')
    }
    if (config.loading) {
      props.push('loading')
    }
    if (config.error) {
      props.push('error')
    }
    if (config.required) {
      props.push('required')
    }

    // 样式属性
    if (config.fullWidth) {
      className.push('w-full')
    }
    if (config.hoverScale) {
      className.push('hover:scale-105')
    }
    if (!config.focusRing) {
      className.push('focus:ring-0')
    }
    if (config.borderStyle === 'dashed') {
      className.push('border-dashed')
    }

    // 间距和透明度
    if (config.margin) {
      className.push(`m-${config.margin}`)
    }
    if (config.padding) {
      className.push(`p-${config.padding}`)
    }
    if (config.opacity && config.opacity !== 100) {
      className.push(`opacity-${config.opacity / 10}`)
    }

    const classNameStr = className.length > 0 ? ` className="${className.join(' ')}"` : ''
    const propsStr = props.length > 0 ? `\n        ${props.join('\n        ')}` : ''

    return `      <${component}${classNameStr}${propsStr} />`
  }

  // 智能代码生成函数（带性能监控）
  const generateSolutionCode = (solution: SolutionTemplate, config: SolutionConfig): string => {
    const startTime = performance.now()
    const optimizations = []

    // 创建缓存键
    const cacheKey = JSON.stringify({ solution: solution.id, config })

    // 检查缓存
    const cached = cachedCodeGeneration.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 300000) { // 5分钟缓存
      optimizations.push('cache-hit')
      return cached.code
    }

    // 获取优化的组件顺序
    const orderedComponents = getOptimalComponentOrder(solution.components)
    optimizations.push('component-ordering')

    // 生成优化的导入
    const imports = generateOptimizedImports(orderedComponents)
    optimizations.push('optimized-imports')

    // 生成设计令牌
    const designTokensCode = generateDesignTokens(config)
    optimizations.push('design-tokens')

    // 生成组件代码
    const componentsCode = orderedComponents.map((comp, index) => {
      const componentConfig = config.components[index] || {}
      return generateOptimizedComponentCode(comp, componentConfig, index)
    }).join('\n')
    optimizations.push('optimized-props')

    // 生成条件化功能代码
    const featuresCode = []
    if (config.features.responsive) {
      featuresCode.push('  responsive: true,')
    }
    if (config.features.animation) {
      featuresCode.push('  animation: true,')
    }
    if (config.features.i18n) {
      featuresCode.push('  i18n: true,')
    }

    const featuresStr = featuresCode.length > 0 ? `\nconst features = {\n${featuresCode.join('\n')}\n}` : ''

    // 生成完整代码
    const code = `${imports}

${designTokensCode ? designTokensCode + '\n' : ''}${featuresStr ? featuresCode + '\n' : ''}

export default function ${scenario.name.replace(/\s+/g, '')}Template() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">${solution.name}</h1>
          <p className="text-xl text-muted-foreground">${solution.description}</p>
        </header>

        <main className="space-y-6">
${componentsCode}
        </main>
      </div>
    </div>
  )
}`

    // 缓存生成的代码
    cachedCodeGeneration.set(cacheKey, { code, timestamp: Date.now() })

    // 清理过期缓存
    if (cachedCodeGeneration.size > 50) {
      const oldest = Array.from(cachedCodeGeneration.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)
      oldest.slice(0, 10).forEach(([key]) => cachedCodeGeneration.delete(key))
      optimizations.push('cache-cleanup')
    }

    // 记录性能指标
    const endTime = performance.now()
    const generationTime = Math.round(endTime - startTime)

    setGenerationMetrics({
      generationTime,
      codeSize: code.length,
      lastGenerated: new Date(),
      optimizationsApplied: optimizations
    })

    return code
  }

  // 生成代码预览（带性能监控）
  const generateCodePreview = () => {
    const code = generateSolutionCode(solution, config)
    setGeneratedCode(code)
    setActiveTab('preview')
  }

  const handleGenerateCode = () => {
    generateCodePreview()
    onGenerateCode?.(config)
  }

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light': return '☀️'
      case 'dark': return '🌙'
      case 'auto': return '🌗'
      default: return '🎨'
    }
  }

  const getColorIcon = (color: string) => {
    switch (color) {
      case 'blue': return '🔵'
      case 'green': return '🟢'
      case 'red': return '🔴'
      case 'purple': return '🟣'
      case 'orange': return '🟠'
      case 'pink': return '🩷'
      case 'indigo': return '🔷'
      default: return '⚪'
    }
  }

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'sidebar': return '📱'
      case 'top': return '📐'
      case 'mobile-first': return '📲'
      default: return '🖼️'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10',
        className
      )}
    >
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回解决方案详情</span>
            </button>

            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                配置 {solution.name}
              </h2>
              <Button
                size="sm"
                className="flex items-center gap-2"
                onClick={handleGenerateCode}
              >
                <Code className="w-4 h-4" />
                生成代码
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={exportConfig}
              >
                <Download className="w-4 h-4" />
                导出配置
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 标签页导航 */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 mb-8 overflow-x-auto">
          {[
            { id: 'components', label: '组件配置', icon: '🧩' },
            { id: 'theme', label: '主题样式', icon: '🎨' },
            { id: 'features', label: '功能特性', icon: '⚡' },
            { id: 'tokens', label: '设计令牌', icon: '🎭' },
            { id: 'market', label: '模板市场', icon: '🛍️' },
            { id: 'templates', label: '配置模板', icon: '📋' },
            { id: 'real-time', label: '实时预览', icon: '👁️' },
            { id: 'smart-generator', label: '智能生成', icon: '🧠' },
            { id: 'ai', label: 'AI助手', icon: '🤖' },
            { id: 'team', label: '团队协作', icon: '👥' },
            { id: 'version', label: '版本控制', icon: '📚' },
            { id: 'version-management', label: '版本管理', icon: '🔀' },
            { id: 'config-versions', label: '配置版本', icon: '📝' },
            { id: 'ci-cd', label: 'CI/CD集成', icon: '🔄' },
            { id: 'permissions', label: '权限管理', icon: '🛡️' },
            { id: 'deployment', label: '部署监控', icon: '🚀' },
            { id: 'preview', label: '代码预览', icon: '💻' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <AnimatePresence mode="wait">
          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  组件配置
                </h3>

                <div className="space-y-6">
                  {componentConfigs.map((component, index) => (
                    <div key={component.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      {/* 组件头部 */}
                      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-lg">🧩</span>
                            {component.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {component.variant} • {component.size} • {component.color}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 基础配置 */}
                      <div className="p-4 space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              变体 (Variant)
                            </label>
                            <select
                              value={config.components[index]?.variant || 'default'}
                              onChange={(e) => updateComponentConfig(index, { variant: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                            >
                              <option value="default">Default</option>
                              <option value="primary">Primary</option>
                              <option value="secondary">Secondary</option>
                              <option value="outline">Outline</option>
                              <option value="outline-solid">Outline Solid</option>
                              <option value="ghost">Ghost</option>
                              <option value="link">Link</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              尺寸 (Size)
                            </label>
                            <select
                              value={config.components[index]?.size || 'md'}
                              onChange={(e) => updateComponentConfig(index, { size: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                            >
                              <option value="xs">XS</option>
                              <option value="sm">SM</option>
                              <option value="md">MD</option>
                              <option value="lg">LG</option>
                              <option value="xl">XL</option>
                              <option value="2xl">2XL</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              颜色 (Color)
                            </label>
                            <select
                              value={config.components[index]?.color || config.primaryColor}
                              onChange={(e) => updateComponentConfig(index, { color: e.target.value })}
                              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                            >
                              <option value="blue">Blue</option>
                              <option value="green">Green</option>
                              <option value="red">Red</option>
                              <option value="purple">Purple</option>
                              <option value="orange">Orange</option>
                              <option value="pink">Pink</option>
                              <option value="indigo">Indigo</option>
                              <option value="gray">Gray</option>
                              <option value="slate">Slate</option>
                              <option value="zinc">Zinc</option>
                            </select>
                          </div>
                        </div>

                        {/* 样式配置 */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span>🎨</span> 样式配置
                          </h5>
                          <div className="grid md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                圆角 (Radius)
                              </label>
                              <select
                                value={config.components[index]?.radius || 'md'}
                                onChange={(e) => updateComponentConfig(index, { radius: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                              >
                                <option value="none">None</option>
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                                <option value="xl">Extra Large</option>
                                <option value="full">Full</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                阴影 (Shadow)
                              </label>
                              <select
                                value={config.components[index]?.shadow || 'sm'}
                                onChange={(e) => updateComponentConfig(index, { shadow: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                              >
                                <option value="none">None</option>
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                                <option value="xl">Extra Large</option>
                                <option value="inner">Inner</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                动画 (Animation)
                              </label>
                              <select
                                value={config.components[index]?.animation || 'none'}
                                onChange={(e) => updateComponentConfig(index, { animation: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                              >
                                <option value="none">None</option>
                                <option value="fade">Fade</option>
                                <option value="slide">Slide</option>
                                <option value="scale">Scale</option>
                                <option value="bounce">Bounce</option>
                                <option value="pulse">Pulse</option>
                                <option value="spin">Spin</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                间距 (Spacing)
                              </label>
                              <select
                                value={config.components[index]?.spacing || 'md'}
                                onChange={(e) => updateComponentConfig(index, { spacing: e.target.value })}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                              >
                                <option value="xs">XS</option>
                                <option value="sm">SM</option>
                                <option value="md">MD</option>
                                <option value="lg">LG</option>
                                <option value="xl">XL</option>
                                <option value="2xl">2XL</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* 交互配置 */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span>⚡</span> 交互配置
                          </h5>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                占位符文本
                              </label>
                              <Input
                                value={config.components[index]?.placeholder || ''}
                                onChange={(e) => updateComponentConfig(index, { placeholder: e.target.value })}
                                placeholder="输入占位符文本"
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                最大长度
                              </label>
                              <Input
                                type="number"
                                value={config.components[index]?.maxLength || 100}
                                onChange={(e) => updateComponentConfig(index, { maxLength: parseInt(e.target.value) })}
                                placeholder="100"
                                className="text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                透明度 (%)
                              </label>
                              <Input
                                type="number"
                                value={config.components[index]?.opacity || 100}
                                onChange={(e) => updateComponentConfig(index, { opacity: parseInt(e.target.value) })}
                                min="0"
                                max="100"
                                placeholder="100"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 状态开关 */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <span>🎛️</span> 状态开关
                          </h5>
                          <div className="grid md:grid-cols-4 gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.disabled || false}
                                onChange={(e) => updateComponentConfig(index, { disabled: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">禁用状态</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.loading || false}
                                onChange={(e) => updateComponentConfig(index, { loading: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">加载状态</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.error || false}
                                onChange={(e) => updateComponentConfig(index, { error: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">错误状态</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.required || false}
                                onChange={(e) => updateComponentConfig(index, { required: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">必填字段</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.fullWidth || false}
                                onChange={(e) => updateComponentConfig(index, { fullWidth: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">全宽显示</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.hoverScale || false}
                                onChange={(e) => updateComponentConfig(index, { hoverScale: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">悬停缩放</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.focusRing || true}
                                onChange={(e) => updateComponentConfig(index, { focusRing: e.target.checked })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">聚焦环</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={config.components[index]?.borderStyle === 'dashed'}
                                onChange={(e) => updateComponentConfig(index, {
                                  borderStyle: e.target.checked ? 'dashed' : 'solid'
                                })}
                                className="rounded border-gray-300 dark:border-gray-600"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">虚线边框</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {/* 主题设置 */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    主题设置
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        主题模式
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['light', 'dark', 'auto'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => updateConfig({ theme: theme as any })}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200',
                              config.theme === theme
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            )}
                          >
                            <div className="text-2xl mb-2">{getThemeIcon(theme)}</div>
                            <div className="text-sm font-medium capitalize">{theme}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        主色调
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {['blue', 'green', 'red', 'purple', 'orange', 'pink', 'indigo', 'gray'].map((color) => (
                          <button
                            key={color}
                            onClick={() => updateConfig({ primaryColor: color })}
                            className={cn(
                              'p-3 rounded-lg border-2 transition-all duration-200',
                              config.primaryColor === color
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            )}
                          >
                            <div className="text-lg mb-1">{getColorIcon(color)}</div>
                            <div className="text-xs font-medium capitalize">{color}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 布局设置 */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    布局设置
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        布局模式
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['sidebar', 'top', 'mobile-first'].map((layout) => (
                          <button
                            key={layout}
                            onClick={() => updateConfig({ layout: layout as any })}
                            className={cn(
                              'p-4 rounded-lg border-2 transition-all duration-200',
                              config.layout === layout
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            )}
                          >
                            <div className="text-2xl mb-2">{getLayoutIcon(layout)}</div>
                            <div className="text-sm font-medium capitalize">
                              {layout === 'sidebar' ? '侧边栏' : layout === 'top' ? '顶部导航' : '移动优先'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">布局预览</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {config.layout === 'sidebar' && '包含侧边栏导航的经典布局，适合管理后台'}
                        {config.layout === 'top' && '顶部导航栏布局，适合内容展示网站'}
                        {config.layout === 'mobile-first' && '移动优先设计，完美适配各种设备'}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  功能特性
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">基础功能</h4>
                    {Object.entries(config.features).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key === 'responsive' ? '响应式设计' : key === 'animations' ? '动画效果' : '暗色模式'}
                        </span>
                        <button
                          onClick={() => updateConfig({
                            features: { ...config.features, [key]: !value }
                          })}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              value ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">高级功能</h4>
                    {Object.entries(config.features).slice(3).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key === 'i18n' ? '国际化支持' : key === 'testing' ? '测试套件' : 'TypeScript'}
                        </span>
                        <button
                          onClick={() => updateConfig({
                            features: { ...config.features, [key]: !value }
                          })}
                          className={cn(
                            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                            value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              value ? 'translate-x-6' : 'translate-x-1'
                            )}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">功能说明</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• 响应式设计：自动适配桌面、平板、移动设备</li>
                    <li>• 动画效果：流畅的页面转场和微交互动画</li>
                    <li>• 暗色模式：支持手动和自动切换暗色主题</li>
                    <li>• 国际化：支持多语言切换功能</li>
                    <li>• 测试套件：包含单元测试和集成测试</li>
                    <li>• TypeScript：完整的类型安全和智能提示</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'tokens' && (
            <motion.div
              key="tokens"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    设计令牌配置
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    精细化控制设计系统令牌
                  </div>
                </div>

                <div className="space-y-8">
                  {/* 颜色配置 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      颜色令牌
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          颜色分类
                        </label>
                        <select
                          value={config.designTokens.colorCategory || 'default'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              colorCategory: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="default">默认分类</option>
                          <option value="business">商务风格</option>
                          <option value="creative">创意风格</option>
                          <option value="technology">科技风格</option>
                          <option value="minimal">极简风格</option>
                          <option value="elegant">优雅风格</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          颜色标度
                        </label>
                        <select
                          value={config.designTokens.colorScale || 'standard'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              colorScale: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="standard">标准标度</option>
                          <option value="vivid">鲜艳标度</option>
                          <option value="muted">柔和标度</option>
                          <option value="high-contrast">高对比度</option>
                          <option value="pastel">粉彩色调</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 间距配置 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-lg">📏</span>
                      间距令牌
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          间距标度
                        </label>
                        <select
                          value={config.designTokens.spacingScale || 'medium'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              spacingScale: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="compact">紧凑布局</option>
                          <option value="medium">标准布局</option>
                          <option value="spacious">宽松布局</option>
                          <option value="variable">可变间距</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          圆角样式
                        </label>
                        <select
                          value={config.designTokens.borderRadius || 'medium'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              borderRadius: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="none">无圆角</option>
                          <option value="small">小圆角</option>
                          <option value="medium">中圆角</option>
                          <option value="large">大圆角</option>
                          <option value="full">完全圆角</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 字体配置 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-lg">🔤</span>
                      字体令牌
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          字体大小
                        </label>
                        <select
                          value={config.designTokens.fontSize || 'base'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              fontSize: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="xs">超小字体</option>
                          <option value="sm">小字体</option>
                          <option value="base">基准字体</option>
                          <option value="lg">大字体</option>
                          <option value="xl">超大字体</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          字体粗细
                        </label>
                        <select
                          value={config.designTokens.fontWeight || 'normal'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              fontWeight: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="light">细体</option>
                          <option value="normal">常规</option>
                          <option value="medium">中等</option>
                          <option value="semibold">半粗体</option>
                          <option value="bold">粗体</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          字体系列
                        </label>
                        <select
                          value={config.designTokens.fontFamily || 'system'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              fontFamily: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="system">系统字体</option>
                          <option value="sans">无衬线字体</option>
                          <option value="serif">衬线字体</option>
                          <option value="mono">等宽字体</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 视觉效果配置 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      视觉效果
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          阴影效果
                        </label>
                        <select
                          value={config.designTokens.shadows || 'medium'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              shadows: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="none">无阴影</option>
                          <option value="subtle">微弱阴影</option>
                          <option value="medium">中等阴影</option>
                          <option value="strong">强烈阴影</option>
                          <option value="dramatic">戏剧阴影</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          过渡动画
                        </label>
                        <select
                          value={config.designTokens.transitions || 'smooth'}
                          onChange={(e) => updateConfig({
                            designTokens: {
                              ...config.designTokens,
                              transitions: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          <option value="none">无动画</option>
                          <option value="fast">快速过渡</option>
                          <option value="smooth">平滑过渡</option>
                          <option value="slow">缓慢过渡</option>
                          <option value="bounce">弹性动画</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 令牌预览 */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-lg">👁️</span>
                      令牌预览
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">颜色预览</h5>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                            ></div>
                            <div
                              className="w-8 h-8 rounded bg-gray-300"
                            ></div>
                            <div
                              className="w-8 h-8 rounded bg-gray-500"
                            ></div>
                            <div
                              className="w-8 h-8 rounded bg-gray-700"
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            分类: {config.designTokens.colorCategory || 'default'} |
                            标度: {config.designTokens.colorScale || 'standard'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">间距预览</h5>
                          <div className="space-y-2">
                            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                              <div className="text-xs">紧凑间距</div>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded">
                              <div className="text-sm">标准间距</div>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded">
                              <div className="text-base">宽松间距</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'market' && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateMarket
                onUseTemplate={(template) => {
                  // 应用模板配置
                  if (template.config) {
                    setConfig(prevConfig => ({
                      ...prevConfig,
                      ...template.config
                    }))
                    // 切换到预览标签查看效果
                    setActiveTab('preview')
                  }
                }}
              />
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    配置模板
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    选择预设模板快速配置您的解决方案
                  </div>
                </div>

                {/* 模板分类筛选 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <button
                      onClick={() => setSelectedTemplateCategory('all')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                        selectedTemplateCategory === 'all'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      全部模板
                    </button>
                    {['modern', 'minimal', 'corporate', 'dark'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedTemplateCategory(category)}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                          selectedTemplateCategory === category
                            ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        {category === 'modern' && '现代风格'}
                        {category === 'minimal' && '极简风格'}
                        {category === 'corporate' && '企业风格'}
                        {category === 'dark' && '深色主题'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 模板网格 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredTemplates().map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {template.name}
                            </h4>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {template.category}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>主题: {template.config.theme}</div>
                          <div>颜色: {template.config.primaryColor}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            applyTemplate(template)
                          }}
                        >
                          应用
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {getFilteredTemplates().length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📋</div>
                    <div>该分类下暂无模板</div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {activeTab === 'real-time' && (
            <motion.div
              key="real-time"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <RealTimePreview
                config={config}
                components={config.components.length > 0 ? config.components : componentConfigs}
                solutionName={solution.name}
                onConfigUpdate={updateConfig}
              />
            </motion.div>
          )}

          {activeTab === 'smart-generator' && (
            <motion.div
              key="smart-generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SmartCodeGenerator
                config={config}
                components={config.components.length > 0 ? config.components : componentConfigs}
                solutionName={solution.name}
                scenarioName={scenario.title}
                onCodeGenerated={(code, metadata) => {
                  setGeneratedCode(code)
                  console.log('智能代码生成完成:', metadata)
                }}
              />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AIAssistant
                config={config}
                components={config.components.map(c => c.name)}
                generatedCode={generatedCode}
                onApplySuggestion={(suggestion) => {
                  // 处理AI建议的应用
                  console.log('应用AI建议:', suggestion)
                  // 根据建议类型更新配置
                  if (suggestion.type === 'design' && suggestion.relatedComponents) {
                    // 可以根据设计建议更新配置
                  }
                }}
                onRegenerateSuggestions={() => {
                  // 重新生成建议
                  console.log('重新生成AI建议')
                }}
              />
            </motion.div>
          )}

          {/* Team Collaboration temporarily disabled
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">👥</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    团队协作功能
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    团队协作功能正在开发中，敬请期待...
                  </p>
                  <div className="mt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      开发中
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          */}

          {activeTab === 'version' && (
            <motion.div
              key="version"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VersionControl
                currentConfig={config}
                onRestoreVersion={(commitId) => {
                  // 处理版本恢复
                  console.log('恢复到版本:', commitId)
                }}
                onCompareVersions={(fromCommitId, toCommitId) => {
                  // 处理版本对比
                  console.log('对比版本:', fromCommitId, toCommitId)
                }}
              />
            </motion.div>
          )}

          {activeTab === 'version-management' && (
            <motion.div key="version-management" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <VersionManagement
                config={config}
                onConfigUpdate={(newConfig) => setConfig(newConfig)}
              />
            </motion.div>
          )}

          {activeTab === 'permissions' && (
            <motion.div
              key="permissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold mb-2">企业权限管理</h3>
                  <p>此功能正在开发中...</p>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'cicd' && (
            <motion.div
              key="cicd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">CI/CD流水线管理</h3>
                  <p>此功能正在开发中...</p>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'deployment' && (
            <motion.div
              key="deployment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">企业部署监控</h3>
                  <p>此功能正在开发中...</p>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    代码预览
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateCodePreview}
                    >
                      刷新代码
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Code className="w-4 h-4" />
                      复制代码
                    </Button>
                  </div>
                </div>

                {/* 性能监控面板 */}
                {generationMetrics.lastGenerated && (
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        性能监控
                      </h4>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        {generationMetrics.lastGenerated.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {generationMetrics.generationTime}ms
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">生成时间</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {(generationMetrics.codeSize / 1024).toFixed(1)}KB
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">代码大小</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {cachedCodeGeneration.size}
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">缓存条目</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {generationMetrics.optimizationsApplied.length}
                        </div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">优化项目</div>
                      </div>
                    </div>
                    {generationMetrics.optimizationsApplied.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {generationMetrics.optimizationsApplied.map((opt) => (
                          <span
                            key={opt}
                            className="text-xs bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{generatedCode || generateSolutionCode(solution, config)}</code>
                  </pre>
                </div>

                {/* 代码质量分析 */}
                {generatedCode && (
                  <div className="mt-6">
                    <CodeQualityAnalyzer
                      code={generatedCode}
                      config={config}
                      className="w-full"
                    />
                  </div>
                )}

                {!generatedCode && (
                  <div className="mt-4 text-center">
                    <Button
                      onClick={generateCodePreview}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <Play className="w-4 h-4" />
                      生成代码预览
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
          {activeTab === 'config-versions' && (
            <motion.div
              key="config-versions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ConfigVersionManager
                config={config}
                onConfigUpdate={(newConfig) => {
                  setConfig(newConfig)
                  console.log('配置版本管理更新配置:', newConfig)
                }}
                onVersionChange={(version) => {
                  console.log('版本切换:', version)
                }}
              />
            </motion.div>
          )}
          {activeTab === 'ci-cd' && (
            <motion.div
              key="ci-cd"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CICDIntegration
                config={config}
                onConfigUpdate={(newConfig) => {
                  setConfig(newConfig)
                  console.log('CI/CD集成更新配置:', newConfig)
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}