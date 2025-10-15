/**
 * 智能组件预览引擎类型定义
 * 提供动态组件渲染、预览生成和缓存功能
 */

import type { ComponentInfo } from '@/data/component-classification'
import type React from 'react'

/**
 * 预览选项
 */
export interface PreviewOptions {
  /** 预览模式 */
  mode: 'compact' | 'normal' | 'detailed' | 'comparison'
  /** 主题 */
  theme: string
  /** 尺寸 */
  size: 'sm' | 'md' | 'lg'
  /** 是否支持交互 */
  interactive: boolean
  /** 是否显示动画 */
  animated: boolean
  /** 是否显示代码 */
  showCode: boolean
  /** 预览上下文 */
  context?: PreviewContext
}

/**
 * 预览上下文
 */
export interface PreviewContext {
  /** 用户意图 */
  userIntent: 'browsing' | 'searching' | 'comparing' | 'learning' | 'implementing'
  /** 项目类型 */
  projectType?: string
  /** 技术栈 */
  techStack?: string[]
  /** 设备类型 */
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'wide'
  /** 性能模式 */
  performanceMode?: 'speed' | 'features' | 'balanced'
}

/**
 * 组件预览
 */
export interface ComponentPreview {
  /** 组件信息 */
  component: ComponentInfo
  /** 渲染内容 */
  rendered: {
    /** 实际渲染的组件 */
    live: React.ReactNode
    /** 截图 */
    screenshot?: string
    /** 代码示例 */
    code?: string
  }
  /** 元数据 */
  metadata: {
    /** 尺寸 */
    dimensions: { width: number; height: number }
    /** 加载时间 */
    loadTime: number
    /** 复杂度 */
    complexity: 'simple' | 'medium' | 'complex'
    /** 可访问性信息 */
    accessibility: AccessibilityInfo
    /** 性能指标 */
    performance: PerformanceMetrics
  }
  /** 智能建议 */
  suggestions: {
    /** 相关组件 */
    relatedComponents: string[]
    /** 流行组合 */
    popularCombinations: string[]
    /** 使用提示 */
    usageTips: string[]
    /** 配套组件 */
    companionComponents: string[]
  }
}

/**
 * 可访问性信息
 */
export interface AccessibilityInfo {
  /** 是否通过可访问性检查 */
  passesAccessibility: boolean
  /** ARIA 属性 */
  ariaAttributes: string[]
  /** 键盘导航支持 */
  keyboardNavigable: boolean
  /** 屏幕阅读器支持 */
  screenReaderSupport: boolean
  /** 颜色对比度 */
  colorContrast: {
    normal: number
    large: number
    passesWCAG: boolean
  }
  /** 焦点管理 */
  focusManagement: boolean
}

/**
 * 性能指标
 */
export interface PerformanceMetrics {
  /** 渲染时间 */
  renderTime: number
  /** 内存使用 */
  memoryUsage: number
  /** 组件数量 */
  componentCount: number
  /** DOM 节点数量 */
  domNodes: number
  /** CSS 规则数量 */
  cssRules: number
  /** JavaScript 大小 */
  jsSize: number
}

/**
 * 预览配置
 */
export interface PreviewConfig {
  /** 缓存配置 */
  cache: {
    enabled: boolean
    ttl: number // 生存时间（毫秒）
    maxSize: number
    strategy: 'lru' | 'fifo' | 'custom'
  }
  /** 性能配置 */
  performance: {
    enableLazyLoading: boolean
    enableVirtualization: boolean
    maxLoadTime: number
    maxMemoryUsage: number
  }
  /** 渲染配置 */
  rendering: {
    enableScreenshot: boolean
    enableCodeGeneration: boolean
    enableAccessibilityCheck: boolean
    enablePerformanceAnalysis: boolean
  }
  /** 默认选项 */
  defaults: {
    mode: PreviewOptions['mode']
    theme: string
    size: PreviewOptions['size']
    interactive: boolean
    animated: boolean
  }
}

/**
 * 预览引擎接口
 */
export interface IntelligentPreviewEngine {
  /** 预览配置 */
  config: PreviewConfig

  /**
   * 生成组件预览
   */
  generatePreview: (component: ComponentInfo, options: PreviewOptions) => Promise<ComponentPreview>

  /**
   * 批量生成预览
   */
  generateBatchPreviews: (components: ComponentInfo[], options: PreviewOptions) => Promise<ComponentPreview[]>

  /**
   * 优化预览
   */
  optimizePreview: (preview: ComponentPreview, context: PreviewContext) => ComponentPreview

  /**
   * 缓存预览
   */
  cachePreview: (component: ComponentInfo, preview: ComponentPreview, options: PreviewOptions) => void

  /**
   * 获取缓存的预览
   */
  getCachedPreview: (component: ComponentInfo, options: PreviewOptions) => ComponentPreview | null

  /**
   * 清除缓存
   */
  clearCache: (pattern?: string) => void

  /**
   * 获取缓存统计
   */
  getCacheStats: () => CacheStats

  /**
   * 预热缓存
   */
  warmupCache: (components: ComponentInfo[], options?: PreviewOptions) => Promise<void>

  /**
   * 分析组件复杂度
   */
  analyzeComplexity: (component: ComponentInfo) => Promise<'simple' | 'medium' | 'complex'>

  /**
   * 生成使用建议
   */
  generateSuggestions: (component: ComponentInfo, context?: PreviewContext) => Promise<{
    relatedComponents: string[]
    popularCombinations: string[]
    usageTips: string[]
    companionComponents: string[]
  }>
}

/**
 * 缓存统计
 */
export interface CacheStats {
  /** 缓存大小 */
  size: number
  /** 命中次数 */
  hits: number
  /** 未命中次数 */
  misses: number
  /** 命中率 */
  hitRate: number
  /** 内存使用 */
  memoryUsage: number
  /** 最旧条目时间 */
  oldestEntry: number
  /** 最新条目时间 */
  newestEntry: number
}

/**
 * 组件渲染器接口
 */
export interface ComponentRenderer {
  /**
   * 渲染组件
   */
  render: (component: ComponentInfo, props: Record<string, any>, options: PreviewOptions) => Promise<React.ReactNode>

  /**
   * 获取默认属性
   */
  getDefaultProps: (component: ComponentInfo, options: PreviewOptions) => Record<string, any>

  /**
   * 验证属性
   */
  validateProps: (component: ComponentInfo, props: Record<string, any>) => {
    valid: boolean
    errors: string[]
    warnings: string[]
  }
}

/**
 * 截图生成器接口
 */
export interface ScreenshotGenerator {
  /**
   * 生成截图
   */
  generate: (element: React.ReactNode, options?: ScreenshotOptions) => Promise<string>

  /**
   * 批量生成截图
   */
  generateBatch: (elements: Array<{ element: React.ReactNode; id: string }>) => Promise<Map<string, string>>
}

/**
 * 截图选项
 */
export interface ScreenshotOptions {
  /** 格式 */
  format: 'png' | 'jpeg' | 'webp'
  /** 质量 */
  quality: number
  /** 尺寸 */
  scale?: number
  /** 背景色 */
  backgroundColor?: string
  /** 等待时间 */
  waitTime?: number
}

/**
 * 代码生成器接口
 */
export interface CodeGenerator {
  /**
   * 生成代码示例
   */
  generate: (component: ComponentInfo, props: Record<string, any>, options: CodeOptions) => Promise<string>

  /**
   * 生成导入语句
   */
  generateImports: (component: ComponentInfo) => string

  /**
   * 生成使用示例
   */
  generateUsage: (component: ComponentInfo, scenario: 'basic' | 'advanced' | 'real-world') => Promise<string>
}

/**
 * 代码生成选项
 */
export interface CodeOptions {
  /** 语言 */
  language: 'typescript' | 'javascript'
  /** 框架 */
  framework: 'react' | 'vue' | 'angular'
  /** 包含导入 */
  includeImports: boolean
  /** 包含注释 */
  includeComments: boolean
  /** 格式化 */
  format: boolean
  /** 复杂度 */
  complexity: 'simple' | 'complete' | 'production-ready'
}

/**
 * 默认预览配置
 */
export const DEFAULT_PREVIEW_CONFIG: PreviewConfig = {
  cache: {
    enabled: true,
    ttl: 300000, // 5分钟
    maxSize: 100,
    strategy: 'lru'
  },
  performance: {
    enableLazyLoading: true,
    enableVirtualization: false,
    maxLoadTime: 2000, // 2秒
    maxMemoryUsage: 50 * 1024 * 1024 // 50MB
  },
  rendering: {
    enableScreenshot: true,
    enableCodeGeneration: true,
    enableAccessibilityCheck: true,
    enablePerformanceAnalysis: true
  },
  defaults: {
    mode: 'normal',
    theme: 'default',
    size: 'md',
    interactive: false,
    animated: true
  }
}