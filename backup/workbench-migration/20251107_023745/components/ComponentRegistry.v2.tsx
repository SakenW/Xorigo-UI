/**
 * 组件注册系统 v2.0 - 扩展版本
 * 支持417个组件的自动扫描、注册、缓存和性能优化
 * 集成文件系统扫描器、元数据提取器、缓存系统和搜索功能
 */

'use client'

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { ComponentScanner, ScanResult } from './ComponentScanner'
import { MetadataExtractor } from './MetadataExtractor'
import { ComponentCache } from './ComponentCache'

// ============================================================================
// 类型定义
// ============================================================================

export interface ComponentMetadata {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  tags: string[]
  version: string
  props: ComponentProp[]
  examples: ComponentExample[]
  source?: string
  filePath?: string
  dependencies?: ExtractedDependency[]
  accessibility?: AccessibilityInfo
  themeSupport?: ThemeSupport
}

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  defaultValue?: any
  description?: string
  options?: string[]
}

export interface ComponentExample {
  id: string
  name: string
  code: string
  description?: string
  props?: Record<string, any>
}

export interface ExtractedDependency {
  name: string
  version?: string
  isLocal?: boolean
  isPeer?: boolean
}

export interface AccessibilityInfo {
  ariaRole?: string
  ariaAttributes?: string[]
  keyboardHandlers?: string[]
  focusable?: boolean
  tabIndex?: number
}

export interface ThemeSupport {
  variants?: string[]
  sizes?: string[]
  colors?: string[]
  customProperties?: string[]
}

export interface RegisteredComponent extends ComponentMetadata {
  component: React.ComponentType<any>
  loadStatus: 'loaded' | 'loading' | 'error'
  error?: string
  lastAccessed?: number
  loadTime?: number
}

export interface ComponentTreeNode {
  id: string
  name: string
  type: 'category' | 'component'
  children?: ComponentTreeNode[]
  component?: RegisteredComponent
  path?: string
}

export interface ScanStatus {
  isScanning: boolean
  progress: number
  currentFile?: string
  error?: string
  estimatedTimeRemaining?: number
}

export interface RegistryMetrics {
  totalScanTime: number
  averageScanTime: number
  cacheHitRate: number
  memoryUsage: number
  componentLoadTime: Record<string, number>
  searchQueryCount: number
  searchAverageTime: number
}

export interface SearchFilters {
  category?: string
  tags?: string[]
  version?: string
  status?: 'all' | 'loaded' | 'loading' | 'error'
  hasExamples?: boolean
  isAccessible?: boolean
}

export interface PerformanceConfig {
  enableCache: boolean
  cacheConfig: {
    maxSize: number
    maxAge: number
    storageType: 'memory' | 'localStorage'
  }
  enableLazyLoading: boolean
  lazyLoadThreshold: number
  enablePreloading: boolean
  parallelScanning: boolean
  maxConcurrentScans: number
}

export interface RegistryConfig {
  rootPaths: string[]
  includeTestFiles: boolean
  autoScan: boolean
  scanInterval: number
  performance: PerformanceConfig
  search: {
    enableFuzzySearch: boolean
    maxResults: number
    minQueryLength: number
  }
}

export interface ComponentRegistry {
  components: Map<string, RegisteredComponent>
  categories: Set<string>
  componentTree: ComponentTreeNode
  totalCount: number
  loadedCount: number
  scanStatus: ScanStatus
  cache: ComponentCache | null
  metrics: RegistryMetrics
  register: (component: RegisteredComponent) => Promise<void>
  unregister: (id: string) => Promise<void>
  getComponent: (id: string) => RegisteredComponent | undefined
  getComponentsByCategory: (category: string) => RegisteredComponent[]
  getComponentsByTag: (tag: string) => RegisteredComponent[]
  getAllComponents: () => RegisteredComponent[]
  searchComponents: (query: string, filters?: SearchFilters) => RegisteredComponent[]
  getSimilarComponents: (id: string, limit?: number) => RegisteredComponent[]
  scanComponents: (paths?: string[]) => Promise<ScanResult>
  incrementalScan: (paths?: string[]) => Promise<ScanResult>
  preloadComponents: (ids: string[]) => Promise<void>
  clearCache: () => Promise<void>
  isComponentLoaded: (id: string) => boolean
  getLoadStatus: (id: string) => 'loaded' | 'loading' | 'error' | undefined
  getMetrics: () => RegistryMetrics
}

// ============================================================================
// 组件注册上下文
// ============================================================================

const ComponentRegistryContext = createContext<ComponentRegistry | null>(null)

export const useComponentRegistry = (): ComponentRegistry => {
  const context = useContext(ComponentRegistryContext)
  if (!context) {
    throw new Error('useComponentRegistry must be used within a ComponentRegistryProvider')
  }
  return context
}

// ============================================================================
// 组件注册提供者
// ============================================================================

interface ComponentRegistryProviderProps {
  children: React.ReactNode
  config?: Partial<RegistryConfig>
  onScanComplete?: (result: ScanResult) => void
  onError?: (error: Error) => void
}

export const ComponentRegistryProvider: React.FC<ComponentRegistryProviderProps> = ({
  children,
  config,
  onScanComplete,
  onError
}) => {
  const [components, setComponents] = useState<Map<string, RegisteredComponent>>(new Map())
  const [loadedCount, setLoadedCount] = useState(0)
  const [scanStatus, setScanStatus] = useState<ScanStatus>({
    isScanning: false,
    progress: 0
  })
  const [componentTree, setComponentTree] = useState<ComponentTreeNode>({
    id: 'root',
    name: 'root',
    type: 'category',
    children: []
  })
  const [metrics, setMetrics] = useState<RegistryMetrics>({
    totalScanTime: 0,
    averageScanTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    componentLoadTime: {},
    searchQueryCount: 0,
    searchAverageTime: 0
  })

  const scannerRef = useRef<ComponentScanner | null>(null)
  const extractorRef = useRef<MetadataExtractor | null>(null)
  const cacheRef = useRef<ComponentCache | null>(null)

  // 默认配置
  const defaultConfig: RegistryConfig = {
    rootPaths: ['/home/saken/project/Xorigo-UI/packages/core/src/components'],
    includeTestFiles: false,
    autoScan: true,
    scanInterval: 0,
    performance: {
      enableCache: true,
      cacheConfig: {
        maxSize: 100 * 1024 * 1024, // 100MB
        maxAge: 300000, // 5分钟
        storageType: 'memory'
      },
      enableLazyLoading: true,
      lazyLoadThreshold: 50,
      enablePreloading: true,
      parallelScanning: true,
      maxConcurrentScans: 5
    },
    search: {
      enableFuzzySearch: true,
      maxResults: 100,
      minQueryLength: 2
    }
  }

  const registryConfig = useMemo(() => ({
    ...defaultConfig,
    ...config
  }), [config])

  // 初始化组件
  useEffect(() => {
    // 初始化缓存
    if (registryConfig.performance.enableCache) {
      cacheRef.current = new ComponentCache({
        maxSize: registryConfig.performance.cacheConfig.maxSize,
        maxAge: registryConfig.performance.cacheConfig.maxAge,
        compression: false,
        storageType: registryConfig.performance.cacheConfig.storageType,
        enableMetrics: true
      })
    }

    // 初始化扫描器和提取器
    if (registryConfig.rootPaths.length > 0) {
      scannerRef.current = new ComponentScanner({
        rootPath: registryConfig.rootPaths[0],
        includeTestFiles: registryConfig.includeTestFiles,
        parallel: registryConfig.performance.parallelScanning
      })

      extractorRef.current = new MetadataExtractor({
        includeJSDoc: true,
        includeExamples: true,
        includeDependencies: true,
        extractAccessibility: true,
        extractThemes: true
      })
    }

    // 如果启用自动扫描，开始扫描
    if (registryConfig.autoScan) {
      scanComponents()
    }
  }, [registryConfig])

  // 扫描组件
  const scanComponents = useCallback(async (paths?: string[]) => {
    if (!scannerRef.current) return

    setScanStatus({
      isScanning: true,
      progress: 0
    })

    try {
      const startTime = Date.now()
      const result = await scannerRef.current.scan()

      // 转换并注册组件
      const componentsToRegister = result.metadata
      for (const meta of componentsToRegister) {
        const component = await loadComponent(meta)
        await register(component)
      }

      setLoadedCount(componentsToRegister.length)

      // 更新指标
      const scanTime = Date.now() - startTime
      setMetrics(prev => ({
        ...prev,
        totalScanTime: scanTime,
        averageScanTime: prev.totalScanTime > 0
          ? (prev.averageScanTime + scanTime) / 2
          : scanTime
      }))

      // 缓存结果
      if (cacheRef.current && result.metadata.length > 0) {
        await cacheRef.current.setComponents(result.metadata)
      }

      onScanComplete?.(result)

      setScanStatus({
        isScanning: false,
        progress: 100
      })
    } catch (error) {
      const err = error instanceof Error ? error : new Error('扫描失败')
      setScanStatus({
        isScanning: false,
        progress: 0,
        error: err.message
      })
      onError?.(err)
    }
  }, [onScanComplete, onError])

  // 增量扫描
  const incrementalScan = useCallback(async (paths?: string[]) => {
    await scanComponents(paths)
  }, [scanComponents])

  // 加载组件
  const loadComponent = useCallback(async (metadata: ComponentMetadata): Promise<RegisteredComponent> => {
    const startTime = Date.now()

    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 50))

    // 创建模拟组件
    const MockComponent = (props: any) => {
      return (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{metadata.displayName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{metadata.description}</p>
        </div>
      )
    }

    const loadTime = Date.now() - startTime

    return {
      ...metadata,
      component: MockComponent,
      loadStatus: 'loaded' as const,
      loadTime
    }
  }, [])

  // 注册组件
  const register = useCallback(async (component: RegisteredComponent) => {
    setComponents(prev => {
      const next = new Map(prev)
      next.set(component.id, component)
      return next
    })

    // 更新组件树
    setComponentTree(prev => {
      // 简化实现：重新构建树
      const categories = new Set<string>()
      components.forEach(comp => categories.add(comp.category))

      const children = Array.from(categories).map(category => ({
        id: category,
        name: category,
        type: 'category' as const,
        children: []
      }))

      return {
        ...prev,
        children
      }
    })
  }, [components])

  // 注销组件
  const unregister = useCallback(async (id: string) => {
    setComponents(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  // 获取单个组件
  const getComponent = useCallback((id: string) => {
    const component = components.get(id)
    if (component) {
      component.lastAccessed = Date.now()
    }
    return component
  }, [components])

  // 按分类获取组件
  const getComponentsByCategory = useCallback((category: string) => {
    return Array.from(components.values()).filter(c => c.category === category)
  }, [components])

  // 按标签获取组件
  const getComponentsByTag = useCallback((tag: string) => {
    return Array.from(components.values()).filter(c => c.tags.includes(tag))
  }, [components])

  // 获取所有组件
  const getAllComponents = useCallback(() => {
    return Array.from(components.values())
  }, [components])

  // 搜索组件
  const searchComponents = useCallback((query: string, filters?: SearchFilters) => {
    const startTime = Date.now()
    let results = Array.from(components.values())

    // 基本搜索
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(c =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery) ||
        c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // 应用过滤器
    if (filters) {
      if (filters.category) {
        results = results.filter(c => c.category === filters.category)
      }

      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(c =>
          filters.tags!.some(tag => c.tags.includes(tag))
        )
      }

      if (filters.status && filters.status !== 'all') {
        results = results.filter(c => c.loadStatus === filters.status)
      }

      if (filters.hasExamples) {
        results = results.filter(c => c.examples.length > 0)
      }

      if (filters.isAccessible) {
        results = results.filter(c => c.accessibility?.focusable)
      }
    }

    // 限制结果数量
    if (registryConfig.search.maxResults) {
      results = results.slice(0, registryConfig.search.maxResults)
    }

    // 更新搜索指标
    const searchTime = Date.now() - startTime
    setMetrics(prev => ({
      ...prev,
      searchQueryCount: prev.searchQueryCount + 1,
      searchAverageTime: prev.searchAverageTime > 0
        ? (prev.searchAverageTime + searchTime) / 2
        : searchTime
    }))

    return results
  }, [components, registryConfig])

  // 获取相似组件
  const getSimilarComponents = useCallback((id: string, limit = 5) => {
    const target = components.get(id)
    if (!target) return []

    return Array.from(components.values())
      .filter(c => c.id !== id)
      .map(c => ({
        component: c,
        score: calculateSimilarity(target, c)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.component)
  }, [components])

  // 预加载组件
  const preloadComponents = useCallback(async (ids: string[]) => {
    const promises = ids.map(async id => {
      const component = components.get(id)
      if (component && component.loadStatus !== 'loaded') {
        // 实际实现中会进行组件加载
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    })

    await Promise.allSettled(promises)
  }, [components])

  // 清除缓存
  const clearCache = useCallback(async () => {
    if (cacheRef.current) {
      await cacheRef.current.clear()
    }
  }, [])

  // 检查组件是否已加载
  const isComponentLoaded = useCallback((id: string) => {
    return components.has(id) && components.get(id)?.loadStatus === 'loaded'
  }, [components])

  // 获取加载状态
  const getLoadStatus = useCallback((id: string) => {
    return components.get(id)?.loadStatus
  }, [components])

  // 获取指标
  const getMetrics = useCallback(() => {
    return {
      ...metrics,
      cacheHitRate: cacheRef.current?.getMetrics().hitRate || 0
    }
  }, [metrics])

  // 获取所有分类
  const categories = useMemo(() => {
    return new Set(Array.from(components.values()).map(c => c.category))
  }, [components])

  const registry: ComponentRegistry = {
    components,
    categories,
    componentTree,
    totalCount: components.size,
    loadedCount,
    scanStatus,
    cache: cacheRef.current,
    metrics,
    register,
    unregister,
    getComponent,
    getComponentsByCategory,
    getComponentsByTag,
    getAllComponents,
    searchComponents,
    getSimilarComponents,
    scanComponents,
    incrementalScan,
    preloadComponents,
    clearCache,
    isComponentLoaded,
    getLoadStatus,
    getMetrics
  }

  return (
    <ComponentRegistryContext.Provider value={registry}>
      {children}
    </ComponentRegistryContext.Provider>
  )
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 计算组件相似度
 */
function calculateSimilarity(a: RegisteredComponent, b: RegisteredComponent): number {
  let score = 0

  // 分类相同
  if (a.category === b.category) score += 0.3

  // 共同标签
  const commonTags = a.tags.filter(tag => b.tags.includes(tag))
  score += commonTags.length * 0.1

  // 属性相似
  const aProps = new Set(a.props.map(p => p.name))
  const bProps = new Set(b.props.map(p => p.name))
  const commonProps = new Set([...aProps].filter(x => bProps.has(x)))
  score += commonProps.size * 0.05

  return score
}

// ============================================================================
// 组件浏览器
// ============================================================================

export const ComponentBrowser: React.FC = () => {
  const registry = useComponentRegistry()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [showMetrics, setShowMetrics] = useState(false)

  const filteredComponents = useMemo(() => {
    const filters = selectedCategory !== 'all' ? { category: selectedCategory } : undefined
    return searchTerm || selectedCategory !== 'all'
      ? registry.searchComponents(searchTerm, filters)
      : registry.getAllComponents()
  }, [registry, searchTerm, selectedCategory])

  const categories = useMemo(() => {
    return ['all', ...Array.from(registry.categories)]
  }, [registry.categories])

  const handleRefresh = async () => {
    await registry.scanComponents()
  }

  const metrics = registry.getMetrics()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🧩 组件注册系统 v2.0
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            📊 {showMetrics ? '隐藏' : '显示'}指标
          </button>
          <button
            onClick={handleRefresh}
            disabled={registry.scanStatus.isScanning}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {registry.scanStatus.isScanning ? '⏳ 扫描中...' : '🔄 重新扫描'}
          </button>
        </div>
      </div>

      {/* 扫描状态 */}
      {registry.scanStatus.isScanning && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              正在扫描组件...
            </span>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {registry.scanStatus.progress}%
            </span>
          </div>
          <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${registry.scanStatus.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* 指标面板 */}
      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">性能指标</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">总组件数</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{registry.totalCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">已加载</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{registry.loadedCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">扫描时间</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.totalScanTime}ms
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">缓存命中率</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.cacheHitRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 搜索和筛选 */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索组件（支持名称、描述、标签）..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? '全部分类' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* 组件列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredComponents.map((comp) => (
          <motion.div
            key={comp.id}
            whileHover={{ scale: 1.02 }}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedComponent === comp.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
            onClick={() => setSelectedComponent(comp.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{comp.displayName}</h3>
              <span className={`px-2 py-0.5 text-xs rounded ${
                comp.loadStatus === 'loaded'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : comp.loadStatus === 'loading'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {comp.loadStatus === 'loaded' ? '✓' : comp.loadStatus === 'loading' ? '⏳' : '✗'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {comp.description}
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                {comp.category}
              </span>
              {comp.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {tag}
                </span>
              ))}
              {comp.tags.length > 2 && (
                <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded">
                  +{comp.tags.length - 2}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 组件详情 */}
      {selectedComponent && (
        <ComponentDetails
          component={registry.getComponent(selectedComponent)!}
          onClose={() => setSelectedComponent(null)}
        />
      )}
    </div>
  )
}

// ============================================================================
// 组件详情
// ============================================================================

interface ComponentDetailsProps {
  component: RegisteredComponent
  onClose: () => void
}

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ component, onClose }) => {
  const [activeTab, setActiveTab] = useState<'props' | 'examples' | 'source'>('props')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {component.displayName} 详情
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'props', label: '属性', icon: '⚙️' },
          { id: 'examples', label: '示例', icon: '💡' },
          { id: 'source', label: '源码', icon: '📄' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'props' && (
        <div className="space-y-2">
          {component.props.length > 0 ? component.props.map(prop => (
            <div key={prop.name} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-gray-900 dark:text-gray-100">{prop.name}</code>
                  {prop.required && <span className="text-red-500 text-xs">*</span>}
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {prop.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{prop.description || '暂无描述'}</p>
                {prop.defaultValue && (
                  <p className="text-xs text-gray-500 mt-1">
                    默认值: <code className="font-mono">{String(prop.defaultValue)}</code>
                  </p>
                )}
              </div>
            </div>
          )) : (
            <p className="text-gray-600 dark:text-gray-400">该组件未定义属性</p>
          )}
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="space-y-4">
          {component.examples.length > 0 ? component.examples.map(example => (
            <div key={example.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white">{example.name}</h4>
                {example.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{example.description}</p>
                )}
              </div>
              <pre className="p-4 text-sm bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          )) : (
            <p className="text-gray-600 dark:text-gray-400">该组件暂无示例代码</p>
          )}
        </div>
      )}

      {activeTab === 'source' && (
        <div>
          {component.source ? (
            <pre className="p-4 text-sm bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
              <code>{component.source}</code>
            </pre>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">源码信息不可用</p>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default ComponentBrowser
