/**
 * 组件注册系统
 * 实现动态组件扫描、注册、热重载和类型信息提取
 */

'use client'

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react'
import { motion } from 'framer-motion'

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 组件元数据
 */
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
}

/**
 * 组件属性
 */
export interface ComponentProp {
  name: string
  type: string
  required: boolean
  defaultValue?: any
  description?: string
  options?: string[]
}

/**
 * 组件示例
 */
export interface ComponentExample {
  id: string
  name: string
  code: string
  description?: string
  props?: Record<string, any>
}

/**
 * 组件注册项
 */
export interface RegisteredComponent extends ComponentMetadata {
  component: React.ComponentType<any>
  loadStatus: 'loaded' | 'loading' | 'error'
  error?: string
}

/**
 * 组件注册表
 */
export interface ComponentRegistry {
  components: Map<string, RegisteredComponent>
  categories: Set<string>
  totalCount: number
  loadedCount: number
  register: (component: RegisteredComponent) => void
  unregister: (id: string) => void
  getComponent: (id: string) => RegisteredComponent | undefined
  getComponentsByCategory: (category: string) => RegisteredComponent[]
  getAllComponents: () => RegisteredComponent[]
  searchComponents: (query: string) => RegisteredComponent[]
  isComponentLoaded: (id: string) => boolean
  getLoadStatus: (id: string) => 'loaded' | 'loading' | 'error' | undefined
}

// ============================================================================
// 组件注册上下文
// ============================================================================

/**
 * 组件注册上下文
 */
const ComponentRegistryContext = createContext<ComponentRegistry | null>(null)

/**
 * 使用组件注册表
 */
export const useComponentRegistry = (): ComponentRegistry => {
  const context = useContext(ComponentRegistryContext)
  if (!context) {
    throw new Error('useComponentRegistry must be used within a ComponentRegistryProvider')
  }
  return context
}

/**
 * 组件注册提供者
 */
interface ComponentRegistryProviderProps {
  children: React.ReactNode
  autoLoad?: boolean
  onLoadComplete?: (count: number) => void
}

export const ComponentRegistryProvider: React.FC<ComponentRegistryProviderProps> = ({
  children,
  autoLoad = true,
  onLoadComplete
}) => {
  const [components, setComponents] = useState<Map<string, RegisteredComponent>>(new Map())
  const [loadedCount, setLoadedCount] = useState(0)

  // 预定义组件元数据
  const metadataMap: Record<string, ComponentMetadata> = {
    button: {
      id: 'button',
      name: 'Button',
      displayName: 'Button',
      description: '基础按钮组件，支持多种变体和尺寸',
      category: 'primitives',
      tags: ['基础', '按钮', '交互'],
      version: '1.0.0',
      props: [
        { name: 'variant', type: '"solid" | "outline" | "ghost"', required: false, defaultValue: 'solid', description: '按钮变体' },
        { name: 'size', type: '"sm" | "md" | "lg"', required: false, defaultValue: 'md', description: '按钮尺寸' },
        { name: 'disabled', type: 'boolean', required: false, defaultValue: false, description: '是否禁用' },
        { name: 'children', type: 'React.ReactNode', required: true, description: '按钮内容' }
      ],
      examples: [
        {
          id: 'basic',
          name: '基础用法',
          code: `<Button variant="solid" size="md">
  点击我
</Button>`,
          description: '最基础的按钮用法'
        },
        {
          id: 'outlined',
          name: '轮廓按钮',
          code: `<Button variant="outline" size="lg">
  轮廓按钮
</Button>`,
          description: '边框样式的按钮'
        }
      ],
      source: '/packages/core/src/primitives/Button.tsx'
    },
    input: {
      id: 'input',
      name: 'Input',
      displayName: 'Input',
      description: '文本输入框组件',
      category: 'inputs',
      tags: ['表单', '输入', '控件'],
      version: '1.0.0',
      props: [
        { name: 'type', type: '"text" | "email" | "password"', required: false, defaultValue: 'text', description: '输入类型' },
        { name: 'label', type: 'string', required: false, description: '标签文本' },
        { name: 'placeholder', type: 'string', required: false, description: '占位符' },
        { name: 'disabled', type: 'boolean', required: false, defaultValue: false, description: '是否禁用' }
      ],
      examples: [
        {
          id: 'basic',
          name: '基础输入',
          code: `<Input
  label="姓名"
  placeholder="请输入姓名"
/>`,
          description: '带标签的输入框'
        }
      ],
      source: '/packages/core/src/inputs/Input.tsx'
    },
    card: {
      id: 'card',
      name: 'Card',
      displayName: 'Card',
      description: '卡片容器组件',
      category: 'layout',
      tags: ['容器', '布局', '卡片'],
      version: '1.0.0',
      props: [
        { name: 'children', type: 'React.ReactNode', required: true, description: '卡片内容' },
        { name: 'className', type: 'string', required: false, description: '自定义样式类' }
      ],
      examples: [
        {
          id: 'basic',
          name: '基础卡片',
          code: `<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>
    <p>卡片内容</p>
  </CardContent>
</Card>`,
          description: '包含标题和内容的卡片'
        }
      ],
      source: '/packages/core/src/layout/Card.tsx'
    }
  }

  // 模拟组件加载
  const loadComponent = useCallback(async (metadata: ComponentMetadata): Promise<RegisteredComponent> => {
    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 100))

    // 模拟组件（实际应该从文件系统动态加载）
    const MockComponent = (props: any) => {
      return (
        <div className="p-4 border rounded-lg bg-white dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{metadata.displayName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{metadata.description}</p>
        </div>
      )
    }

    return {
      ...metadata,
      component: MockComponent,
      loadStatus: 'loaded'
    }
  }, [])

  // 注册组件
  const register = useCallback((component: RegisteredComponent) => {
    setComponents(prev => {
      const next = new Map(prev)
      next.set(component.id, component)
      return next
    })
  }, [])

  // 注销组件
  const unregister = useCallback((id: string) => {
    setComponents(prev => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  // 获取单个组件
  const getComponent = useCallback((id: string) => {
    return components.get(id)
  }, [components])

  // 按分类获取组件
  const getComponentsByCategory = useCallback((category: string) => {
    return Array.from(components.values()).filter(c => c.category === category)
  }, [components])

  // 获取所有组件
  const getAllComponents = useCallback(() => {
    return Array.from(components.values())
  }, [components])

  // 搜索组件
  const searchComponents = useCallback((query: string) => {
    if (!query.trim()) return Array.from(components.values())

    const lowerQuery = query.toLowerCase()
    return Array.from(components.values()).filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }, [components])

  // 检查组件是否已加载
  const isComponentLoaded = useCallback((id: string) => {
    return components.has(id)
  }, [components])

  // 获取加载状态
  const getLoadStatus = useCallback((id: string) => {
    return components.get(id)?.loadStatus
  }, [components])

  // 获取所有分类
  const categories = useMemo(() => {
    return new Set(Array.from(components.values()).map(c => c.category))
  }, [components])

  // 自动加载所有组件
  useEffect(() => {
    if (!autoLoad) return

    const loadAllComponents = async () => {
      const metadataEntries = Object.entries(metadataMap)
      let loaded = 0

      for (const [id, metadata] of metadataEntries) {
        try {
          const component = await loadComponent(metadata)
          register(component)
          loaded++
          setLoadedCount(loaded)
        } catch (error) {
          console.error(`Failed to load component ${id}:`, error)
          register({
            ...metadata,
            component: () => null as any,
            loadStatus: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      onLoadComplete?.(loaded)
    }

    loadAllComponents()
  }, [autoLoad, loadComponent, register, onLoadComplete])

  const registry: ComponentRegistry = {
    components,
    categories,
    totalCount: metadataMap.length,
    loadedCount,
    register,
    unregister,
    getComponent,
    getComponentsByCategory,
    getAllComponents,
    searchComponents,
    isComponentLoaded,
    getLoadStatus
  }

  return (
    <ComponentRegistryContext.Provider value={registry}>
      {children}
    </ComponentRegistryContext.Provider>
  )
}

// ============================================================================
// 组件浏览器组件
// ============================================================================

/**
 * 组件浏览器
 */
export const ComponentBrowser: React.FC = () => {
  const registry = useComponentRegistry()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  const filteredComponents = useMemo(() => {
    let components = searchTerm
      ? registry.searchComponents(searchTerm)
      : registry.getAllComponents()

    if (selectedCategory !== 'all') {
      components = components.filter(c => c.category === selectedCategory)
    }

    return components
  }, [registry, searchTerm, selectedCategory])

  const categories = useMemo(() => {
    return ['all', ...Array.from(registry.categories)]
  }, [registry.categories])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🧩 组件浏览器
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>已加载 {registry.loadedCount} / {registry.totalCount}</span>
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(registry.loadedCount / registry.totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索组件..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {comp.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {comp.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                  {tag}
                </span>
              ))}
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

/**
 * 组件详情
 */
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
          {component.props.map(prop => (
            <div key={prop.name} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <code className="font-mono text-sm text-gray-900 dark:text-gray-100">{prop.name}</code>
                  {prop.required && <span className="text-red-500 text-xs">*</span>}
                  <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {prop.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{prop.description}</p>
                {prop.defaultValue && (
                  <p className="text-xs text-gray-500 mt-1">
                    默认值: <code className="font-mono">{String(prop.defaultValue)}</code>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="space-y-4">
          {component.examples.map(example => (
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
          ))}
        </div>
      )}

      {activeTab === 'source' && (
        <div>
          {component.source ? (
            <pre className="p-4 text-sm bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-lg overflow-x-auto">
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
